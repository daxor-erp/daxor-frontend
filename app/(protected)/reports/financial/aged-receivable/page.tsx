'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_AGED_RECEIVABLE } from '@/gql/queries'
import { PageHeader, StatsRow, StatCard, AmountCell, MonoCell, DateCell, ErpBadge } from '@/components/ui/erp-shared'
import { ReceiptText, AlertCircle, Clock, FileText, ChevronDown, ChevronRight } from 'lucide-react'

const BUCKETS = ['current', 'days30', 'days60', 'days90', 'over90'] as const
const BUCKET_LABELS: Record<string, string> = {
  current: 'Current',
  days30:  '1–30 Days',
  days60:  '31–60 Days',
  days90:  '61–90 Days',
  over90:  '90+ Days',
}

export default function AgedReceivablePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const { data, loading } = useQuery(GET_AGED_RECEIVABLE, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const rows: any[] = data?.agedReceivable ?? []
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
        title="Aged Receivable"
        subtitle="Outstanding customer invoices bucketed by days overdue — as of today"
        icon={<ReceiptText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Reports' }, { label: 'Financial' }, { label: 'Aged Receivable' }]}
      />

      <StatsRow cols={5}>
        <StatCard label="Current"    value={`₹${(totals.current/1000).toFixed(1)}k`} icon={<FileText     className="h-5 w-5" />} variant="green"  />
        <StatCard label="1–30 Days"  value={`₹${(totals.days30/1000).toFixed(1)}k`}  icon={<Clock        className="h-5 w-5" />} variant="amber"  />
        <StatCard label="31–60 Days" value={`₹${(totals.days60/1000).toFixed(1)}k`}  icon={<AlertCircle  className="h-5 w-5" />} variant="orange" />
        <StatCard label="61–90 Days" value={`₹${(totals.days90/1000).toFixed(1)}k`}  icon={<AlertCircle  className="h-5 w-5" />} variant="rose"   />
        <StatCard label="90+ Days"   value={`₹${(totals.over90/1000).toFixed(1)}k`}  icon={<AlertCircle  className="h-5 w-5" />} variant="rose"   />
      </StatsRow>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-muted/50 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
          <div>Customer</div>
          {BUCKETS.map(b => <div key={b} className="text-right">{BUCKET_LABELS[b]}</div>)}
          <div className="text-right">Total</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading report…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">No outstanding receivables found.</div>
        ) : (
          <>
            {rows.map((row: any) => (
              <div key={row.customerId}>
                <div
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-2.5 border-b hover:bg-muted/30 cursor-pointer"
                  onClick={() => toggle(row.customerId)}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {expanded.has(row.customerId)
                      ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    }
                    {row.customerName}
                  </div>
                  {BUCKETS.map(b => (
                    <div key={b} className="text-right text-sm">
                      {Number(row[b]) > 0 ? <AmountCell value={row[b]} className={b !== 'current' ? 'text-rose-600' : undefined} /> : <span className="text-muted-foreground">—</span>}
                    </div>
                  ))}
                  <div className="text-right text-sm font-semibold"><AmountCell value={row.total} /></div>
                </div>

                {expanded.has(row.customerId) && (row.invoices ?? []).map((inv: any) => (
                  <div key={inv.invoiceId} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-2 border-b bg-muted/20 text-xs text-muted-foreground">
                    <div className="pl-6 flex items-center gap-3">
                      <MonoCell value={inv.invoiceNumber} />
                      <DateCell value={inv.dueDate} />
                      <ErpBadge status={inv.status} />
                      {inv.daysOverdue > 0 && <span className="text-rose-600 font-medium">{inv.daysOverdue}d overdue</span>}
                    </div>
                    <div className="text-right col-span-5 flex items-center justify-end gap-2">
                      <span>Outstanding:</span>
                      <AmountCell value={inv.outstandingAmount} className={inv.daysOverdue > 0 ? 'text-rose-600' : undefined} />
                    </div>
                    <div />
                  </div>
                ))}
              </div>
            ))}

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
