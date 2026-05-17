'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { MY_APPROVAL_REQUESTS } from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type Status = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
type Role = 'ANY' | 'REQUESTER' | 'APPROVER'

const PAGE_SIZE = 25

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
    DELIVERY_CHALLAN: 'Delivery challan',
    GRN: 'GRN',
    MATERIAL_RECEIPT: 'Material receipt',
  }
  return map[entityType] ?? entityType
}

function statusBadgeCls(status: string) {
  if (status === 'APPROVED') return 'bg-emerald-50 text-emerald-900 border-emerald-200'
  if (status === 'REJECTED') return 'bg-red-50 text-red-900 border-red-200'
  return 'bg-amber-50 text-amber-900 border-amber-200'
}

function statusBadgeLabel(status: string) {
  if (status === 'APPROVED') return 'Approved'
  if (status === 'REJECTED') return 'Declined'
  return 'Pending'
}

type ApprovalRow = {
  id: string
  title?: string | null
  moduleKey?: string
  entityType?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  requesterUserId?: string
  requesterDisplayName?: string | null
  assigneeApproverUserId?: string
  resolutionNote?: string | null
  decidedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export default function ApprovalsHistoryPage() {
  const { user } = useAuth()
  const myUid = String(user?.id ?? '')
  const [status, setStatus] = useState<Status>('ALL')
  const [role, setRole] = useState<Role>('ANY')
  const [page, setPage] = useState(0)

  const { data, loading, refetch } = useQuery(MY_APPROVAL_REQUESTS, {
    variables: {
      status: status === 'ALL' ? null : status,
      role,
      limit: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
    skip: !user?.id,
  })

  const rows: ApprovalRow[] = data?.myApprovalRequests ?? []
  const hasNext = rows.length === PAGE_SIZE
  const hasPrev = page > 0

  const empty = useMemo(() => !loading && rows.length === 0, [loading, rows.length])

  return (
    <div className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Approval history"
        description="All approval requests you sent or were asked to decide on."
        actions={
          <Button variant="outline" onClick={() => refetch()} disabled={loading}>
            Refresh
          </Button>
        }
      />

      <SectionCard title="Filters" bodyClassName="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-44">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
            <Select
              value={status}
              onValueChange={(v) => {
                setPage(0)
                setStatus(v as Status)
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-44">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Role</label>
            <Select
              value={role}
              onValueChange={(v) => {
                setPage(0)
                setRole(v as Role)
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANY">Either</SelectItem>
                <SelectItem value="REQUESTER">Sent by me</SelectItem>
                <SelectItem value="APPROVER">Assigned to me</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Requests" bodyClassName="p-0">
        {loading && rows.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading…</div>
        ) : empty ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No approval requests match these filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50">
                <TableHead className="text-xs uppercase">Title</TableHead>
                <TableHead className="text-xs uppercase">Module</TableHead>
                <TableHead className="text-xs uppercase">Type</TableHead>
                <TableHead className="text-xs uppercase">Role</TableHead>
                <TableHead className="text-xs uppercase">Status</TableHead>
                <TableHead className="text-xs uppercase">Decided</TableHead>
                <TableHead className="text-xs uppercase">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const isRequester = String(r.requesterUserId ?? '') === myUid
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-slate-900">
                      <div className="leading-tight">
                        <div>{r.title ?? '—'}</div>
                        {r.resolutionNote ? (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Note: {r.resolutionNote}
                          </div>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>{moduleLabel(String(r.moduleKey ?? ''))}</TableCell>
                    <TableCell>{entityLabel(String(r.entityType ?? ''))}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                          isRequester
                            ? 'bg-sky-50 text-sky-900 border-sky-200'
                            : 'bg-violet-50 text-violet-900 border-violet-200',
                        )}
                      >
                        {isRequester ? 'Sent by me' : 'To approve'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                          statusBadgeCls(String(r.status)),
                        )}
                      >
                        {statusBadgeLabel(String(r.status))}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.decidedAt ? new Date(r.decidedAt).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <span>
            Page {page + 1}
            {rows.length > 0 ? ` · showing ${rows.length} item${rows.length === 1 ? '' : 's'}` : ''}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrev || loading}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
