'use client'

import { useLazyQuery, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_CUSTOMERS, GET_CLIENTS, GENERATE_CUSTOMER_STATEMENT } from '@/gql/queries'
import { buildBillToOptions } from '@/lib/bill-to-options'
import { wsCell, wsHeaderCell, wsLabelCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { BarChart3, FileText, Printer } from 'lucide-react'

function defaultDateRange() {
  const to = new Date()
  const from = new Date()
  from.setMonth(from.getMonth() - 1)
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  }
}

const VARIANTS = {
  generate: {
    title: 'Generate Statements',
    subtitle:
      'Period activity for invoices and receipts (payments), plus current total accounts receivable balance for the bill-to.',
    headerClass: 'bg-indigo-700',
    buttonClass: 'bg-indigo-700 hover:bg-indigo-800',
    accentBold: 'text-indigo-900',
    icon: FileText,
    iconClass: 'text-indigo-700',
    paramLabel: 'Statement parameters',
    paramRight: 'AR summary',
  },
  print: {
    title: 'Print Individual Statement',
    subtitle:
      'Select bill-to and date range, generate the AR statement, then print or save as PDF from your browser.',
    headerClass: 'bg-slate-800',
    buttonClass: 'bg-slate-800 hover:bg-slate-900',
    accentBold: 'text-slate-900',
    icon: Printer,
    iconClass: 'text-slate-700',
    paramLabel: 'Print parameters',
    paramRight: 'Individual statement',
  },
} as const

export type CustomerStatementWorksheetVariant = keyof typeof VARIANTS

type Props = { variant: CustomerStatementWorksheetVariant }

export function CustomerStatementWorksheet({ variant }: Props) {
  const cfg = VARIANTS[variant]
  const Icon = cfg.icon

  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [customerId, setCustomerId] = useState('')
  const dr = defaultDateRange()
  const [dateFrom, setDateFrom] = useState(dr.from)
  const [dateTo, setDateTo] = useState(dr.to)

  const { data: customersData } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: clientsData } = useQuery(GET_CLIENTS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
  })

  const [runStatement, { data, loading, error }] = useLazyQuery(GENERATE_CUSTOMER_STATEMENT, {
    fetchPolicy: 'network-only',
  })

  const customers = customersData?.customers ?? []
  const clients = clientsData?.clients ?? []
  const billToOptions = useMemo(() => buildBillToOptions(clients, customers), [clients, customers])

  const stmt = data?.generateCustomerStatement

  const handleGenerate = () => {
    if (!customerId || !orgId) return
    runStatement({
      variables: {
        organizationId: orgId,
        customerId,
        dateFrom: `${dateFrom}T00:00:00.000Z`,
        dateTo: `${dateTo}T23:59:59.999Z`,
      },
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-[1100px] print:max-w-none">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Icon className={`h-8 w-8 ${cfg.iconClass}`} />
          {cfg.title}
        </h1>
        <p className="text-gray-500 mt-1">{cfg.subtitle}</p>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm print:border-0 print:shadow-none">
        <div
          className={`${cfg.headerClass} text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between print:bg-gray-800`}
        >
          <span>{cfg.paramLabel}</span>
          <span className="opacity-90">{cfg.paramRight}</span>
        </div>

        <div className="p-4 print:hidden">
          <table className="w-full border-collapse text-xs min-w-[640px]">
            <tbody>
              <tr>
                <td className={wsLabelCell}>Bill-to *</td>
                <td className={`${wsCell} min-w-[280px]`} colSpan={3}>
                  <SelectFloating
                    label=""
                    value={customerId}
                    onChange={(v) => {
                      const next = typeof v === 'string' ? v : v.target.value
                      setCustomerId(next)
                    }}
                    options={billToOptions}
                    className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                  />
                </td>
              </tr>
              <tr>
                <td className={wsLabelCell}>From</td>
                <td className={wsCell}>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none font-mono"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </td>
                <td className={wsLabelCell}>To</td>
                <td className={wsCell}>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none font-mono"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className={`h-9 text-xs text-white ${cfg.buttonClass}`}
              onClick={handleGenerate}
              disabled={loading || !customerId || !orgId}
            >
              {loading ? 'Generating…' : variant === 'print' ? 'Load statement' : 'Generate statement'}
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5 mt-2">
              {error.message}
            </p>
          )}
        </div>

        {stmt && (
          <div className="border-t border-gray-200 p-4 print:p-2">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4 print:mb-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900 print:text-base">
                  {stmt.customer?.name || 'Customer'}
                </h2>
                <p className="text-xs text-gray-500 font-mono">
                  {stmt.customer?.docNumber} · Period{' '}
                  {stmt.dateFrom ? new Date(stmt.dateFrom).toLocaleDateString() : '—'} —{' '}
                  {stmt.dateTo ? new Date(stmt.dateTo).toLocaleDateString() : '—'}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs print:hidden"
                onClick={() => window.print()}
              >
                <Printer className="h-3.5 w-3.5 mr-1" />
                Print
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 print:mb-2">
              {[
                { label: 'Invoices (period)', value: `$${formatMoney(stmt.periodInvoicesTotal ?? 0)}` },
                { label: 'Payments (period)', value: `$${formatMoney(stmt.periodPaymentsTotal ?? 0)}` },
                {
                  label: 'Current A/R balance',
                  value: `$${formatMoney(stmt.currentBalance ?? 0)}`,
                  bold: true,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="rounded border border-gray-200 bg-gray-50 px-3 py-2 print:bg-white"
                >
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">{row.label}</p>
                  <p
                    className={`text-sm ${row.bold ? `font-bold ${cfg.accentBold}` : 'font-semibold text-gray-800'}`}
                  >
                    {row.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs min-w-[720px]">
                <thead>
                  <tr>
                    <th className={`${wsHeaderCell} text-left`}>Date</th>
                    <th className={`${wsHeaderCell} text-left`}>Type</th>
                    <th className={`${wsHeaderCell} text-left`}>Reference</th>
                    <th className={`${wsHeaderCell} text-left`}>Description</th>
                    <th className={`${wsHeaderCell} ${wsMoney}`}>Debit</th>
                    <th className={`${wsHeaderCell} ${wsMoney}`}>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {!stmt.lines?.length && (
                    <tr>
                      <td colSpan={6} className={`${wsCell} text-center text-gray-500 py-8`}>
                        No invoices or payments in this period.
                      </td>
                    </tr>
                  )}
                  {stmt.lines?.map((line: any, i: number) => (
                    <tr key={`${line.reference}-${i}`} className="hover:bg-gray-50">
                      <td className={wsCell}>{line.date ? new Date(line.date).toLocaleDateString() : '—'}</td>
                      <td className={wsCell}>{line.kind}</td>
                      <td className={`${wsCell} font-mono`}>{line.reference}</td>
                      <td className={wsCell}>{line.description}</td>
                      <td className={`${wsCell} ${wsMoney}`}>{line.debit ? formatMoney(line.debit) : '—'}</td>
                      <td className={`${wsCell} ${wsMoney}`}>{line.credit ? formatMoney(line.credit) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-gray-500 mt-3 print:mt-2">
              <BarChart3 className="h-3.5 w-3.5 inline mr-1" />
              Current A/R balance is total outstanding across all open invoices for this bill-to (not limited to the
              period).
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
