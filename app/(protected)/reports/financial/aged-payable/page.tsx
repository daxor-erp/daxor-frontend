'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_AGED_PAYABLE } from '@/gql/queries'
import { PageHeader, StatsRow, StatCard, AmountCell, MonoCell, DateCell, ErpBadge } from '@/components/ui/erp-shared'
import { DollarSign, AlertCircle, Clock, FileText, ChevronDown, ChevronRight } from 'lucide-react'

const BUCKETS = ['current', 'days30', 'days60', 'days90', 'over90'] as const
const BUCKET_LABELS: Record<string, string> = {
  current: 'Current (Not Due)',
  days30:  '1–30 Days',
  days60:  '31–60 Days',
  days90:  '61–90 Days',
  over90:  '90+ Days',
}

export default function AgedPayablePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const { data, loading } = useQuery(GET_AGED_PAYABLE, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const rows: any[] = data?.agedPayable ?? []
  const totals = BUCKETS.reduce((acc, b) => {
    acc[b] = rows.reduce((s: number, r: any) => s + Number(r[b] ?? 0), 0)
    return acc
  }, {} as Record<string, number>)
  const grandTotal = rows.reduce((s: number, r: any) => s + Number(r.total ?? 0), 0)

  const toggle = (id: string) => setExpanded(prev => {
    const next = new Set(prev)
    if (next.has(id)) { next.delete(id) } else { next.add(id) }
    return next
  })

  return (
    <div className="erp-shell">
      <PageHeader
        title="Aged Payable"
        subtitle="Outstanding vendor bills bucketed by days overdue — as of today"
        icon={<DollarSign className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Reports' }, { label: 'Financial' }, { label: 'Aged Payable' }]}
      />

      <StatsRow cols={5}>
        <StatCard label="Current"    value={`₹${(totals.current/1000).toFixed(1)}k`} icon={<FileText     className="h-5 w-5" />} variant="green"  />
        <StatCard label="1–30 Days"  value={`₹${(totals.days30/1000).toFixed(1)}k`}  icon={<Clock        className="h-5 w-5" />} variant="amber"  />
        <StatCard label="31–60 Days" value={`₹${(totals.days60/1000).toFixed(1)}k`}  icon={<AlertCircle  className="h-5 w-5" />} variant="orange" />
        <StatCard label="61–90 Days" value={`₹${(totals.days90/1000).toFixed(1)}k`}  icon={<AlertCircle  className="h-5 w-5" />} variant="rose"   />
        <StatCard label="90+ Days"   value={`₹${(totals.over90/1000).toFixed(1)}k`}  icon={<AlertCircle  className="h-5 w-5" />} variant="rose"   />
      </StatsRow>

      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-muted/50 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
          <div>Vendor</div>
          {BUCKETS.map(b => <div key={b} className="text-right">{BUCKET_LABELS[b].split(' ')[0]}{' '}{BUCKET_LABELS[b].split(' ').slice(1).join(' ')}</div>)}
          <div className="text-right">Total</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading report…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">No outstanding payables found.</div>
        ) : (
          <>
            {rows.map((row: any) => (
              <div key={row.vendorId}>
                {/* Vendor summary row */}
                <div
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-2.5 border-b hover:bg-muted/30 cursor-pointer"
                  onClick={() => toggle(row.vendorId)}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {expanded.has(row.vendorId)
                      ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    }
                    {row.vendorName}
                  </div>
                  {BUCKETS.map(b => (
                    <div key={b} className="text-right text-sm">
                      {Number(row[b]) > 0 ? <AmountCell value={row[b]} className={b !== 'current' ? 'text-rose-600' : undefined} /> : <span className="text-muted-foreground">—</span>}
                    </div>
                  ))}
                  <div className="text-right text-sm font-semibold"><AmountCell value={row.total} /></div>
                </div>

                {/* Bill detail rows */}
                {expanded.has(row.vendorId) && (row.bills ?? []).map((bill: any) => (
                  <div key={bill.billId} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-2 border-b bg-muted/20 text-xs text-muted-foreground">
                    <div className="pl-6 flex items-center gap-3">
                      <MonoCell value={bill.billNumber} />
                      <DateCell value={bill.dueDate} />
                      <ErpBadge status={bill.status} />
                      {bill.daysOverdue > 0 && <span className="text-rose-600 font-medium">{bill.daysOverdue}d overdue</span>}
                    </div>
                    <div className="text-right col-span-5 flex items-center justify-end gap-2">
                      <span>Outstanding:</span>
                      <AmountCell value={bill.outstandingAmount} className={bill.daysOverdue > 0 ? 'text-rose-600' : undefined} />
                    </div>
                    <div />
                  </div>
                ))}
              </div>
            ))}

            {/* Totals row */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-3 bg-muted/60 text-sm font-bold border-t">
              <div>TOTAL</div>
              {BUCKETS.map(b => <div key={b} className="text-right"><AmountCell value={totals[b]} /></div>)}
              <div className="text-right"><AmountCell value={grandTotal} /></div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
