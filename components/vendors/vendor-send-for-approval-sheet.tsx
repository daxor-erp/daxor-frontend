'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  GET_VENDOR,
  GET_VENDOR_APPROVAL_REQUESTS,
  GET_VENDOR_ELIGIBLE_APPROVERS,
  SUBMIT_VENDOR_FOR_APPROVAL,
} from '@/gql/queries'
import { ActivityLogPanel } from '@/components/activity-log-panel'
import { toast } from 'sonner'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vendorId: string | null
  organizationId: string
  onSubmitted: () => void
}

function fmtDate(iso?: string | null): string {
  if (!iso) return '—'
  const t = Date.parse(iso)
  return Number.isNaN(t) ? iso : new Date(t).toLocaleString()
}

function statusBadgeClass(ap: string) {
  const s = String(ap || '').toLowerCase()
  if (s === 'draft') return 'bg-slate-100 text-slate-800 border-slate-200'
  if (s === 'submitted') return 'bg-amber-50 text-amber-900 border-amber-200'
  if (s === 'approval_declined') return 'bg-red-50 text-red-900 border-red-200'
  if (s === 'approved') return 'bg-emerald-50 text-emerald-900 border-emerald-200'
  return 'bg-slate-50 text-slate-700 border-slate-200'
}

export function VendorSendForApprovalSheet({
  open,
  onOpenChange,
  vendorId,
  organizationId,
  onSubmitted,
}: Props) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const vid = vendorId ?? ''

  useEffect(() => {
    if (open && vid) {
      setSelected([])
      setSearch('')
    }
  }, [open, vid])

  const { data: vData, loading: vLoading, error: vError } = useQuery(GET_VENDOR, {
    variables: { id: vid },
    skip: !open || !vid,
    fetchPolicy: 'network-only',
  })

  const { data: uData } = useQuery(GET_VENDOR_ELIGIBLE_APPROVERS, {
    variables: { organizationId },
    skip: !open || !organizationId,
    fetchPolicy: 'network-only',
  })

  const { data: reqData } = useQuery(GET_VENDOR_APPROVAL_REQUESTS, {
    variables: { vendorId: vid },
    skip: !open || !vid,
    fetchPolicy: 'network-only',
  })

  const [submitApproval, { loading: submitting }] = useMutation(SUBMIT_VENDOR_FOR_APPROVAL, {
    onCompleted: () => {
      toast.success('Approval request submitted.')
      setSelected([])
      onSubmitted()
      onOpenChange(false)
    },
    onError: (e) => toast.error(e.message ?? 'Submission failed.'),
  })

  const vendor = vData?.vendor as
    | {
        id?: string
        seqNo?: string | null
        name?: string
        type?: string | null
        email?: string | null
        phone?: string | null
        mobile?: string | null
        gstin?: string | null
        pan?: string | null
        gstTreatment?: string | null
        address?: { street?: string | null; city?: string | null; zip?: string | null; country?: string | null } | null
        tags?: { name: string }[] | null
        internalNotes?: string | null
        orgApprovalStatus?: string
        createdAt?: string
        updatedAt?: string
        createdBy?: { firstName?: string; lastName?: string; email?: string } | null
      }
    | undefined

  const formattedAddress = vendor?.address
    ? [vendor.address.street, vendor.address.city, vendor.address.zip, vendor.address.country]
        .filter(Boolean)
        .join(', ')
    : undefined

  const approvers = (uData?.vendorEligibleApprovers ?? []) as {
    id: string
    email: string
    firstName: string
    lastName: string
  }[]

  const q = search.trim().toLowerCase()
  const filteredApprovers = useMemo(
    () =>
      q
        ? approvers.filter((u) =>
            `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q))
        : approvers,
    [approvers, q],
  )

  const requests = reqData?.vendorApprovalRequests ?? []

  const timeline = [...requests].sort(
    (a, b) => Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? ''),
  )

  const currentStatusLabel = (() => {
    const ap = String(vendor?.orgApprovalStatus ?? 'approved').toLowerCase()
    switch (ap) {
      case 'draft':
        return 'Draft'
      case 'submitted':
        return 'Pending approval'
      case 'approval_declined':
        return 'Approval declined'
      case 'approved':
        return 'Approved'
      default:
        return String(vendor?.orgApprovalStatus ?? '—')
    }
  })()

  const toggle = (uid: string) => {
    setSelected((prev) => (prev.includes(uid) ? prev.filter((x) => x !== uid) : [...prev, uid]))
  }

  const onSend = async () => {
    if (!vid) return
    if (!selected.length) {
      toast.error('Please select one or more approvers.')
      return
    }
    await submitApproval({ variables: { id: vid, assigneeApproverUserIds: [...selected] } })
  }

  const readRow = (label: string, value: string | null | undefined) => (
    <div className="grid grid-cols-3 gap-x-4 gap-y-1 py-2 border-b border-slate-100 last:border-b-0 text-sm">
      <span className="col-span-1 text-slate-500">{label}</span>
      <span className="col-span-2 text-slate-900 break-words">{value?.trim() ? value : '—'}</span>
    </div>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl flex flex-col p-0 gap-0 overflow-hidden"
      >
        <SheetHeader className="px-6 py-4 border-b border-slate-200 shrink-0 text-left space-y-1">
          <SheetTitle className="text-lg">Send vendor for approval</SheetTitle>
          <p className="text-xs text-muted-foreground font-normal">
            Review vendor details and choose org-configured approvers ({approvers.length} available).
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {vError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm p-4">
              {vError.message}
            </div>
          ) : vLoading ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
              Loading vendor…
            </div>
          ) : !vendor ? (
            <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              No vendor loaded.
            </div>
          ) : (
            <>
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Vendor details
                </h3>
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                  {readRow('Vendor ID', vendor.seqNo || vendor.id)}
                  {readRow('Vendor Name', vendor.name)}
                  {readRow('Type', vendor.type ?? undefined)}
                  {readRow('Email', vendor.email ?? undefined)}
                  {readRow('Phone', vendor.phone ?? undefined)}
                  {readRow('Mobile', vendor.mobile ?? undefined)}
                  {readRow('GSTIN', vendor.gstin ?? undefined)}
                  {readRow('PAN', vendor.pan ?? undefined)}
                  {readRow('Address', formattedAddress)}
                  {readRow('Tags', vendor.tags?.length ? vendor.tags.map((t) => t.name).join(', ') : undefined)}
                  {readRow('Internal Notes', vendor.internalNotes ?? undefined)}
                  <Separator className="my-3" />
                  {readRow(
                    'Created By',
                    vendor.createdBy
                      ? `${vendor.createdBy.firstName ?? ''} ${vendor.createdBy.lastName ?? ''}`.trim() ||
                        vendor.createdBy.email
                      : '—',
                  )}
                  {readRow('Created At', fmtDate(vendor.createdAt))}
                  {readRow('Updated At', fmtDate(vendor.updatedAt))}
                  <div className="grid grid-cols-3 gap-x-4 gap-y-2 py-2 pt-4">
                    <span className="col-span-1 text-slate-500 text-sm">Current status</span>
                    <span className="col-span-2">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${statusBadgeClass(String(vendor.orgApprovalStatus))}`}
                      >
                        {currentStatusLabel}
                      </Badge>
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Approvers
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Only users assigned under Administration → Approvals → Vendors are listed below.
                </p>
                {approvers.length === 0 ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm p-4">
                    No vendors approvers are configured yet. Ask an org administrator to assign at least one user under
                    Approvals → Vendors.
                  </div>
                ) : (
                  <>
                    <input
                      className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm mb-2"
                      placeholder="Search approvers…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-200 divide-y divide-slate-100">
                      {filteredApprovers.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 text-center">No matches.</div>
                      ) : (
                        filteredApprovers.map((u) => {
                          const checked = selected.includes(u.id)
                          return (
                            <label
                              key={u.id}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-slate-50 cursor-pointer"
                            >
                              <Checkbox checked={checked} onCheckedChange={() => toggle(u.id)} />
                              <span>
                                <span className="font-medium text-slate-900">
                                  {u.firstName} {u.lastName}
                                </span>{' '}
                                <span className="text-slate-500">({u.email})</span>
                              </span>
                            </label>
                          )
                        })
                      )}
                    </div>
                  </>
                )}
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Activity
                </h3>
                <ActivityLogPanel entityType="VENDOR" entityId={vid} />
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Approval status / timeline
                </h3>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                  <p className="text-xs text-slate-600">
                    Pending requests are synced with the approvals inbox. Showing recent requests for this vendor.
                  </p>
                  {timeline.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No approval history yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {timeline.slice(0, 8).map((r: { id: string; assigneeDisplayName?: string | null; status?: string; createdAt?: string | null; decidedAt?: string | null; resolutionNote?: string | null }) => (
                        <li
                          key={r.id}
                          className="rounded-md bg-white border border-slate-200 px-3 py-2 text-xs text-slate-700"
                        >
                          <div className="flex flex-wrap gap-2 justify-between items-start">
                            <span className="font-semibold capitalize">{String(r.status ?? '').toLowerCase()}</span>
                            <span className="text-slate-500">{fmtDate(r.createdAt)}</span>
                          </div>
                          {(r.assigneeDisplayName ?? '') && (
                            <p className="mt-1 text-slate-600">Assignee: {r.assigneeDisplayName}</p>
                          )}
                          {r.decidedAt && (
                            <p className="text-slate-500">Resolved: {fmtDate(r.decidedAt)}</p>
                          )}
                          {r.resolutionNote && (
                            <p className="text-slate-600 mt-1">Note: {r.resolutionNote}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </>
          )}
        </div>

        <SheetFooter className="px-6 py-4 border-t border-slate-200 gap-2 sm:gap-2 flex-row justify-end shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-teal-600 hover:bg-teal-700 text-white"
            disabled={submitting || vLoading || !vendor || approvers.length === 0}
            onClick={() => void onSend()}
          >
            {submitting ? 'Sending…' : 'Send for approval'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
