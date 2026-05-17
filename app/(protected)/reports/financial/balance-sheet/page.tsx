'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_CUSTOMER_INVOICES,
  GET_VENDOR_BILLS,
  GET_CASH_BANKS,
  GET_INVENTORY_CONTROLS,
} from '@/gql/queries'
import { ReportShell, type ReportPeriod } from '@/components/reports/report-shell'
import { formatMoney } from '@/lib/format-money'
import { pdfMoney } from '@/lib/pdf-download'

export default function BalanceSheetPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [period, setPeriod] = useState<ReportPeriod>('this_year')

  const invQ = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 1000 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const billsQ = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, page: 1, limit: 1000 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const cashQ = useQuery(GET_CASH_BANKS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const invCtlQ = useQuery(GET_INVENTORY_CONTROLS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const invoices: any[] = invQ.data?.customerinvoices ?? []
  const bills: any[] = billsQ.data?.vendorBills ?? []
  const cashBanks: any[] = cashQ.data?.cashBanks ?? []
  const invCtls: any[] = invCtlQ.data?.inventoryControls ?? []

  const totals = useMemo(() => {
    const receivable = invoices.reduce((s, i) => s + Number(i.outstandingAmount ?? 0), 0)
    const payable = bills.reduce((s, b) => s + Number(b.outstandingAmount ?? 0), 0)
    // Cash = net of credit-style (RECEIPT/DEPOSIT/CREDIT) minus debit-style (PAYMENT/WITHDRAWAL/DEBIT) transactions.
    const cash = cashBanks.reduce((s, c) => {
      const amt = Number(c?.amount ?? 0)
      const t = String(c?.transactionType ?? '').toUpperCase()
      const isInflow = ['RECEIPT', 'DEPOSIT', 'CREDIT', 'IN', 'INFLOW'].includes(t)
      const isOutflow = ['PAYMENT', 'WITHDRAWAL', 'DEBIT', 'OUT', 'OUTFLOW'].includes(t)
      if (isInflow) return s + amt
      if (isOutflow) return s - amt
      return s + amt
    }, 0)
    const inventory = invCtls.reduce(
      (s, it) => s + Number(it?.quantity ?? 0),
      0,
    )
    const assets = cash + receivable + inventory
    const liabilities = payable
    const equity = assets - liabilities
    return { receivable, payable, cash, inventory, assets, liabilities, equity }
  }, [invoices, bills, cashBanks, invCtls])

  const buildPdf = () => `
    <div class="pdf-section">
      <div class="pdf-section-title">Assets</div>
      <table>
        <tbody>
          <tr><td>Cash &amp; bank</td><td class="num">${pdfMoney(totals.cash)}</td></tr>
          <tr><td>Accounts receivable</td><td class="num">${pdfMoney(totals.receivable)}</td></tr>
          <tr><td>Inventory at value</td><td class="num">${pdfMoney(totals.inventory)}</td></tr>
          <tr style="background:#f3f4f6;"><td><strong>Total assets</strong></td><td class="num"><strong>${pdfMoney(totals.assets)}</strong></td></tr>
        </tbody>
      </table>
    </div>
    <div class="pdf-section">
      <div class="pdf-section-title">Liabilities &amp; equity</div>
      <table>
        <tbody>
          <tr><td>Accounts payable</td><td class="num">${pdfMoney(totals.payable)}</td></tr>
          <tr><td>Equity (assets - liabilities)</td><td class="num">${pdfMoney(totals.equity)}</td></tr>
          <tr style="background:#ecfdf5;border-top:2px solid #059669;"><td><strong>Total liabilities + equity</strong></td><td class="num"><strong>${pdfMoney(totals.liabilities + totals.equity)}</strong></td></tr>
        </tbody>
      </table>
    </div>
  `

  return (
    <ReportShell
      title="Balance Sheet"
      description="Snapshot of assets, liabilities and equity."
      period={period}
      onPeriodChange={setPeriod}
      onRefresh={() => {
        invQ.refetch?.()
        billsQ.refetch?.()
        cashQ.refetch?.()
        invCtlQ.refetch?.()
      }}
      loading={invQ.loading || billsQ.loading}
      pdfBody={buildPdf}
      pdfFilename="balance-sheet"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Assets</p>
          <Row label="Cash & bank" value={totals.cash} />
          <Row label="Accounts receivable" value={totals.receivable} hint={`${invoices.length} open invoices`} />
          <Row label="Inventory (units on hand)" value={totals.inventory} hint={`${invCtls.length} items tracked`} />
          <Row label="Total assets" value={totals.assets} strong divider />
        </div>
        <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Liabilities & equity</p>
          <Row label="Accounts payable" value={totals.payable} hint={`${bills.length} open bills`} />
          <Row label="Owner's equity" value={totals.equity} hint="Computed: assets − liabilities" />
          <Row label="Total liabilities + equity" value={totals.liabilities + totals.equity} strong divider accent />
        </div>
      </div>
    </ReportShell>
  )
}

function Row({
  label, value, strong, divider, accent, hint,
}: { label: string; value: number; strong?: boolean; divider?: boolean; accent?: boolean; hint?: string }) {
  return (
    <div className={divider ? 'pt-2 mt-2 border-t border-border' : ''}>
      <div className="flex items-center justify-between gap-2">
        <span className={'text-sm ' + (strong ? 'font-semibold' : '')}>{label}</span>
        <span className={
          'tabular-nums text-sm ' +
          (strong ? 'font-bold ' : '') +
          (accent ? 'text-emerald-700' : value < 0 ? 'text-rose-700' : '')
        }>
          {value < 0 ? `(${formatMoney(Math.abs(value))})` : formatMoney(value)}
        </span>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  )
}
