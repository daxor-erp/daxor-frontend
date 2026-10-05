'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery } from '@apollo/client'
import { ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import {
  MY_APPROVAL_REQUESTS,
  MY_PENDING_APPROVAL_REQUESTS,
  RESOLVE_APPROVAL_REQUEST,
  GET_VENDOR,
} from '@/gql/queries'
import { cn } from '@/lib/utils'
import { toastApolloError } from '@/lib/toast-apollo'

function moduleLabel(moduleKey: string) {
  const map: Record<string, string> = {
    purchases: 'Purchases',
    sales: 'Sales',
    crm: 'CRM',
    quotations: 'Quotations',
    payables: 'Payables',
    inventory: 'Inventory',
    products: 'Products',
    financial: 'Financial',
    payroll: 'Payroll',
    hr: 'HR',
    customers: 'Customers',
    banks: 'Banks',
    reports: 'Reports',
    vendors: 'Vendors',
  }
  return map[moduleKey] ?? moduleKey
}

function entityLabel(entityType: string) {
  const map: Record<string, string> = {
    PURCHASE_ORDER: 'Purchase order',
    SALES_ORDER: 'Sales order',
    MODULE_WORKSPACE_RECORD: 'Page workspace item',
    QUOTATION: 'Quotation',
    CUSTOMER_INVOICE: 'Customer invoice',
    SALES_ENQUIRY: 'Sales enquiry',
    LEAD: 'CRM lead',
    PAYROLL_UI_RECORD: 'Payroll record',
    PAYROLL_MANAGEMENT: 'Payroll management',
    VENDOR_BILL: 'Vendor bill',
    VENDOR: 'Vendor',
    PROJECT: 'Project',
    SALES_RETURN: 'Sales return',
    RETURN_AUTHORIZATION: 'Return authorization',
    DELIVERY_CHALLAN: 'Delivery challan',
    GRN: 'GRN',
    MATERIAL_RECEIPT: 'Material receipt',
  }
  return map[entityType] ?? entityType
}

function statusBadge(status: string): { label: string; cls: string } {
  if (status === 'APPROVED')
    return { label: 'Approved', cls: 'bg-emerald-50 text-emerald-900 border-emerald-200' }
  if (status === 'REJECTED')
    return { label: 'Declined', cls: 'bg-red-50 text-red-900 border-red-200' }
  return { label: 'Awaiting', cls: 'bg-amber-50 text-amber-900 border-amber-200' }
}

type ApprovalCardRow = {
  id: string
  title?: string | null
  moduleKey?: string
  entityType?: string
  entityId?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  requesterDisplayName?: string | null
  resolutionNote?: string | null
  decidedAt?: string | null
  createdAt?: string
}

type ApprovalRow = ApprovalCardRow & {
  requesterUserId?: string
  assigneeApproverUserId?: string
  updatedAt?: string
}

function isVendorMasterRow(row: { entityType?: string; moduleKey?: string; entityId?: string }): boolean {
  const eid = String(row.entityId ?? '').trim()
  if (!eid) return false
  if (String(row.entityType ?? '').toUpperCase() === 'VENDOR') return true
  return String(row.moduleKey ?? '').toLowerCase() === 'vendors'
}

function VendorApprovalDetails({ vendorId }: { vendorId: string }) {
  const { data, loading, error } = useQuery(GET_VENDOR, {
    variables: { id: vendorId },
    skip: !vendorId,
    fetchPolicy: 'cache-first',
  })

  const v = data?.vendor as
    | {
        name?: string | null
        seqNo?: string | null
        email?: string | null
        phone?: string | null
        mobile?: string | null
        gstin?: string | null
        pan?: string | null
        address?: { street?: string | null; city?: string | null; zip?: string | null; country?: string | null } | null
        purchase?: { paymentTerms?: string | null } | null
        internalNotes?: string | null
        status?: string | null
        orgApprovalStatus?: string | null
      }
    | undefined

  const formatCellValue = (value: unknown): string => {
    if (value == null) return '—'
    if (typeof value === 'string') {
      const trimmed = value.trim()
      return trimmed || '—'
    }
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return '—'
  }

  const cell = (label: string, value?: unknown) => (
    <div className="grid grid-cols-[minmax(0,7.5rem)_1fr] gap-x-2 gap-y-0.5 text-xs leading-snug">
      <span className="text-muted-foreground font-medium shrink-0">{label}</span>
      <span className="text-foreground break-words min-w-0">{formatCellValue(value)}</span>
    </div>
  )

  if (loading) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/25 px-3 py-2.5 text-xs text-muted-foreground">
        Loading vendor details…
      </div>
    )
  }
  if (error || !v) {
    return (
      <div className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2.5 text-[11px] text-amber-950">
        Full vendor details could not be loaded. You may still approve or decline from the summary.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-secondary/35 p-3 space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Vendor master data</p>
      <div className="space-y-1.5">
        {cell('Vendor name', v.name)}
        {cell('Code', v.seqNo)}
        {cell('Email', v.email)}
        {cell('Phone', v.phone ?? v.mobile)}
        {cell('GSTIN', v.gstin)}
        {cell('PAN', v.pan)}
        {cell('Payment terms', v.purchase?.paymentTerms)}
        {cell('Address', v.address?.street)}
        {cell('City', v.address?.city)}
        {cell('Country', v.address?.country)}
        {cell('Postal / ZIP', v.address?.zip)}
        {cell('Notes', v.internalNotes)}
      </div>
      <div className="pt-2 mt-2 border-t border-border/70 text-[11px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5">
        <span>
          <span className="font-medium text-foreground/80">Lifecycle: </span>
          {String(v.orgApprovalStatus ?? '—').replace(/_/g, ' ')}
        </span>
        <span>
          <span className="font-medium text-foreground/80">Active status: </span>
          {String(v.status ?? '—')}
        </span>
      </div>
    </div>
  )
}

function ApprovalCard({
  row,
  role,
  note,
  onNoteChange,
  resolvingId,
  onResolve,
}: {
  row: ApprovalCardRow
  role: 'requester' | 'approver'
  note?: string
  onNoteChange?: (v: string) => void
  resolvingId?: string | null
  onResolve?: (id: string, decision: 'APPROVED' | 'REJECTED') => void
}) {
  const badge = statusBadge(String(row.status))
  const canDecide = role === 'approver' && row.status === 'PENDING' && !!onResolve
  return (
    <div className="rounded-xl border bg-card p-4 elev-1 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug pr-4">{row.title ?? 'Approval request'}</p>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide border ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide">
        <span
          className={`rounded-full border px-2 py-0.5 font-medium ${
            role === 'requester'
              ? 'bg-sky-50 text-sky-900 border-sky-200'
              : 'bg-violet-50 text-violet-900 border-violet-200'
          }`}
        >
          {role === 'requester' ? 'Sent by me' : 'To approve'}
        </span>
      </div>
      <dl className="grid gap-1 text-xs text-muted-foreground">
        <div className="flex gap-2">
          <dt className="font-medium">Module</dt>
          <dd className="text-foreground">{moduleLabel(String(row.moduleKey ?? ''))}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium">Type</dt>
          <dd className="text-foreground">{entityLabel(String(row.entityType ?? ''))}</dd>
        </div>
        {row.requesterDisplayName ? (
          <div className="flex gap-2">
            <dt className="font-medium">Requested by</dt>
            <dd className="text-foreground">{row.requesterDisplayName}</dd>
          </div>
        ) : null}
        {row.createdAt ? (
          <div className="flex gap-2">
            <dt className="font-medium">Sent</dt>
            <dd className="text-foreground">{new Date(row.createdAt).toLocaleString()}</dd>
          </div>
        ) : null}
        {row.decidedAt ? (
          <div className="flex gap-2">
            <dt className="font-medium">Decided</dt>
            <dd className="text-foreground">{new Date(row.decidedAt).toLocaleString()}</dd>
          </div>
        ) : null}
        {row.resolutionNote ? (
          <div className="flex gap-2">
            <dt className="font-medium">Note</dt>
            <dd className="text-foreground">{row.resolutionNote}</dd>
          </div>
        ) : null}
      </dl>
      {isVendorMasterRow(row) ? <VendorApprovalDetails vendorId={String(row.entityId)} /> : null}
      {canDecide ? (
        <>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" htmlFor={`note-${row.id}`}>
              Note for requester <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              id={`note-${row.id}`}
              rows={2}
              placeholder="e.g. reason for declining or approval comment"
              className="resize-none text-sm"
              value={note ?? ''}
              onChange={(e) => onNoteChange?.(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              disabled={resolvingId === row.id}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onResolve?.(row.id, 'APPROVED')}
            >
              Approve
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
              disabled={resolvingId === row.id}
              onClick={() => onResolve?.(row.id, 'REJECTED')}
            >
              Decline
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )
}

type ApprovalsInboxProps = {
  /** Extra classes for the clipboard trigger button */
  triggerClassName?: string
}

/**
 * Approvals inbox (clipboard icon + side sheet).
 * Always mounted so `daxor:open-approvals-inbox` opens the sheet from Notifications / Open.
 */
export function ApprovalsInbox({ triggerClassName }: ApprovalsInboxProps) {
  const { user } = useAuth()
  const [inboxOpen, setInboxOpen] = useState(false)
  const [noteById, setNoteById] = useState<Record<string, string>>({})
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  const myUid = String(user?.id ?? '')

  const {
    data: pendingAssigneeData,
    loading: pendingAssigneeLoading,
    refetch: refetchPendingAssignee,
  } = useQuery(MY_PENDING_APPROVAL_REQUESTS, {
    fetchPolicy: 'network-only',
    pollInterval: 15_000,
    skip: !user?.id,
  })

  const { data, loading, refetch } = useQuery(MY_APPROVAL_REQUESTS, {
    variables: { role: 'ANY', limit: 200 },
    fetchPolicy: 'cache-and-network',
    pollInterval: 15_000,
    skip: !user?.id,
  })

  useEffect(() => {
    const refreshApprovals = () => {
      void refetchPendingAssignee()
      void refetch()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshApprovals()
    }
    window.addEventListener('daxor:approvals-changed', refreshApprovals)
    window.addEventListener('focus', refreshApprovals)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('daxor:approvals-changed', refreshApprovals)
      window.removeEventListener('focus', refreshApprovals)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [refetch, refetchPendingAssignee])

  useEffect(() => {
    const open = () => setInboxOpen(true)
    window.addEventListener('daxor:open-approvals-inbox', open)
    return () => window.removeEventListener('daxor:open-approvals-inbox', open)
  }, [])

  const pendingForMe = useMemo((): ApprovalRow[] => {
    const raw = pendingAssigneeData?.myPendingApprovalRequests ?? []
    return raw.map((r: Record<string, unknown>) => ({
      id: String(r.id ?? ''),
      title: (r.title as string | null | undefined) ?? null,
      moduleKey: r.moduleKey as string | undefined,
      entityType: r.entityType as string | undefined,
      entityId: r.entityId != null ? String(r.entityId) : undefined,
      status: 'PENDING' as const,
      requesterUserId:
        r.requesterUserId != null && String(r.requesterUserId).trim()
          ? String(r.requesterUserId)
          : undefined,
      requesterDisplayName: (r.requesterDisplayName as string | null | undefined) ?? null,
      assigneeApproverUserId:
        r.assigneeApproverUserId != null ? String(r.assigneeApproverUserId) : myUid,
      resolutionNote: null,
      decidedAt: null,
      createdAt: r.createdAt as string | undefined,
      updatedAt: r.updatedAt as string | undefined,
    }))
  }, [pendingAssigneeData, myUid])

  const pendingForMeIds = useMemo(() => new Set(pendingForMe.map((r) => r.id)), [pendingForMe])

  const allRows: ApprovalRow[] = data?.myApprovalRequests ?? []

  const pendingSentByMe = useMemo(
    () =>
      allRows.filter(
        (r) =>
          r.status === 'PENDING' &&
          String(r.requesterUserId ?? '') === myUid &&
          !pendingForMeIds.has(r.id),
      ),
    [allRows, myUid, pendingForMeIds],
  )

  const approvedRows = useMemo(() => allRows.filter((r) => r.status === 'APPROVED'), [allRows])
  const rejectedRows = useMemo(() => allRows.filter((r) => r.status === 'REJECTED'), [allRows])
  const badgeCount = pendingForMe.length

  const [resolveApproval] = useMutation(RESOLVE_APPROVAL_REQUEST, {
    onCompleted: () => {
      void refetch()
      void refetchPendingAssignee()
      window.dispatchEvent(new Event('daxor:approvals-changed'))
    },
    onError: toastApolloError,
  })

  const resolve = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setResolvingId(id)
    try {
      await resolveApproval({
        variables: { id, decision, note: noteById[id]?.trim() || undefined },
      })
      setNoteById((p) => {
        const n = { ...p }
        delete n[id]
        return n
      })
    } finally {
      setResolvingId(null)
    }
  }

  const inboxStillLoading =
    !user?.id
      ? false
      : (pendingAssigneeLoading && pendingAssigneeData === undefined) ||
        (loading && data === undefined)

  if (!user?.id) return null

  return (
    <Sheet open={inboxOpen} onOpenChange={setInboxOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            'relative inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground',
            triggerClassName,
          )}
          aria-label="Approvals inbox"
        >
          <ClipboardCheck className="h-5 w-5" />
          {badgeCount > 0 ? (
            <span className="absolute right-1 top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          ) : null}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <div className="border-b px-6 py-4">
          <SheetHeader className="p-0 space-y-1 text-left">
            <SheetTitle>Approvals</SheetTitle>
            <p className="text-xs font-normal text-muted-foreground">
              Requests you sent and requests assigned to you. Decisions update in real time.
            </p>
          </SheetHeader>
        </div>
        <Tabs defaultValue="pending" className="flex-1 flex flex-col min-h-0">
          <div className="border-b px-4 pt-3">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="pending">
                Pending
                {pendingForMe.length + pendingSentByMe.length > 0 ? (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-amber-100 px-1.5 text-[10px] font-medium text-amber-900">
                    {pendingForMe.length + pendingSentByMe.length}
                  </span>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="declined">Declined</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="pending" className="m-0 px-4 py-3 space-y-3">
              {inboxStillLoading && pendingForMe.length === 0 && pendingSentByMe.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2">Loading requests…</p>
              ) : pendingForMe.length + pendingSentByMe.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-secondary/40 px-4 py-12 text-center text-sm text-muted-foreground">
                  No pending approval requests right now.
                </div>
              ) : (
                <>
                  {pendingForMe.map((r) => (
                    <ApprovalCard
                      key={r.id}
                      row={r}
                      role="approver"
                      note={noteById[r.id] ?? ''}
                      onNoteChange={(v) => setNoteById((p) => ({ ...p, [r.id]: v }))}
                      resolvingId={resolvingId}
                      onResolve={resolve}
                    />
                  ))}
                  {pendingSentByMe.map((r) => (
                    <ApprovalCard key={r.id} row={r} role="requester" />
                  ))}
                </>
              )}
            </TabsContent>
            <TabsContent value="approved" className="m-0 px-4 py-3 space-y-3">
              {loading && allRows.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2">Loading…</p>
              ) : approvedRows.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-secondary/40 px-4 py-12 text-center text-sm text-muted-foreground">
                  Nothing approved yet.
                </div>
              ) : (
                approvedRows.map((r) => (
                  <ApprovalCard
                    key={r.id}
                    row={r}
                    role={String(r.requesterUserId ?? '') === myUid ? 'requester' : 'approver'}
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="declined" className="m-0 px-4 py-3 space-y-3">
              {loading && allRows.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2">Loading…</p>
              ) : rejectedRows.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-secondary/40 px-4 py-12 text-center text-sm text-muted-foreground">
                  Nothing declined yet.
                </div>
              ) : (
                rejectedRows.map((r) => (
                  <ApprovalCard
                    key={r.id}
                    row={r}
                    role={String(r.requesterUserId ?? '') === myUid ? 'requester' : 'approver'}
                  />
                ))
              )}
            </TabsContent>
          </div>
        </Tabs>
        <div className="border-t px-4 py-2 text-right">
          <Link
            href="/approvals/history"
            onClick={() => setInboxOpen(false)}
            className="text-[11px] font-medium text-primary hover:underline"
          >
            View all approvals
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
