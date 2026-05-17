'use client'

import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_ITEMS, GET_INVENTORY_CONTROLS } from '@/gql/queries'
import { ReportShell } from '@/components/reports/report-shell'
import { formatMoney, formatNumber } from '@/lib/format-money'
import { escapeHtml, pdfMoney } from '@/lib/pdf-download'

export default function InventoryValuationPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const itemsQ = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 1000 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const ctlQ = useQuery(GET_INVENTORY_CONTROLS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const items: any[] = itemsQ.data?.items ?? []
  const stocks: any[] = ctlQ.data?.inventoryControls ?? []

  const rows = useMemo(() => {
    const byId = new Map<string, any>()
    for (const it of items) byId.set(it.id, it)
    // Aggregate quantities per item across bins
    const qtyById = new Map<string, number>()
    for (const s of stocks) {
      const key = String(s.itemId ?? '')
      qtyById.set(key, (qtyById.get(key) ?? 0) + Number(s.quantity ?? 0))
    }
    return items
      .map((it) => {
        const qty = qtyById.get(it.id) ?? 0
        const rate = Number(it.rate ?? 0)
        return {
          id: it.id,
          name: it.name,
          category: it.category ?? '—',
          unit: it.unit ?? 'unit',
          quantity: qty,
          rate,
          value: qty * rate,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [items, stocks])

  const totals = useMemo(
    () => rows.reduce(
      (s, r) => ({ qty: s.qty + r.quantity, value: s.value + r.value }),
      { qty: 0, value: 0 },
    ),
    [rows],
  )

  const buildPdf = () => `
    <div class="pdf-meta">
      <div><strong>${rows.length}</strong> items</div>
      <div><strong>Total quantity:</strong> ${formatNumber(totals.qty)}</div>
      <div><strong>Total valuation:</strong> ${pdfMoney(totals.value)}</div>
    </div>
    <table>
      <thead><tr><th>Item</th><th>Category</th><th>Unit</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Value</th></tr></thead>
      <tbody>
        ${rows.map((r) => `
          <tr>
            <td>${escapeHtml(r.name)}</td>
            <td>${escapeHtml(r.category)}</td>
            <td>${escapeHtml(r.unit)}</td>
            <td class="num">${formatNumber(r.quantity)}</td>
            <td class="num">${pdfMoney(r.rate)}</td>
            <td class="num">${pdfMoney(r.value)}</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr style="background:#f3f4f6;font-weight:700;">
          <td colspan="5">Total</td>
          <td class="num">${pdfMoney(totals.value)}</td>
        </tr>
      </tfoot>
    </table>
  `

  return (
    <ReportShell
      title="Inventory Valuation"
      description="Stock on hand valued at item rate."
      onRefresh={() => { itemsQ.refetch?.(); ctlQ.refetch?.() }}
      loading={itemsQ.loading || ctlQ.loading}
      pdfBody={buildPdf}
      pdfFilename="inventory-valuation"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Items" value={formatNumber(rows.length)} />
        <Stat label="Total units" value={formatNumber(totals.qty)} />
        <Stat label="Total valuation" value={formatMoney(totals.value)} accent />
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Item</th>
              <th className="px-3 py-2.5 font-medium">Category</th>
              <th className="px-3 py-2.5 font-medium">Unit</th>
              <th className="px-3 py-2.5 font-medium text-right">Qty</th>
              <th className="px-3 py-2.5 font-medium text-right">Rate</th>
              <th className="px-4 py-2.5 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">No items in inventory.</td></tr>
            ) : rows.slice(0, 100).map((r) => (
              <tr key={r.id} className="border-t hover:bg-secondary/30">
                <td className="px-4 py-2.5 font-medium">{r.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{r.category}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{r.unit}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatNumber(r.quantity)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatMoney(r.rate)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums font-medium">{formatMoney(r.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportShell>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={'rounded-xl border p-3 ' + (accent ? 'border-emerald-200 bg-emerald-50' : 'border-border bg-secondary/30')}>
      <p className={'text-[11px] uppercase tracking-wider font-semibold ' + (accent ? 'text-emerald-700' : 'text-muted-foreground')}>{label}</p>
      <p className={'mt-0.5 text-lg font-bold tabular-nums ' + (accent ? 'text-emerald-900' : '')}>{value}</p>
    </div>
  )
}
