'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_CUSTOMERS,
  GET_CLIENTS,
  GET_CUSTOMER_INVOICES,
  GET_CUSTOMER_PAYMENTS,
  CREATE_CUSTOMER_PAYMENT,
} from '@/gql/queries'
import { buildBillToOptions } from '@/lib/bill-to-options'
import { wsCell, wsHeaderCell, wsLabelCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { Banknote, Save, RefreshCw, FileSpreadsheet } from 'lucide-react'
import { CUSTOMER_PAYMENT_METHOD_OPTIONS } from '@/lib/customer-payment-methods'

const PAYMENT_METHODS = CUSTOMER_PAYMENT_METHOD_OPTIONS

const cell = wsCell
const headerCell = wsHeaderCell
const labelCell = wsLabelCell
const moneyClass = wsMoney

export default function AcceptCustomerPaymentsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [customerId, setCustomerId] = useState('')
  const [payByInvoice, setPayByInvoice] = useState<Record<string, string>>({})
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: customersData } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: clientsData } = useQuery(GET_CLIENTS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
  })

  const { data: invData, loading: invLoading, refetch: refetchInv } = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 200, customerId: customerId || undefined },
    skip: !orgId || !customerId,
  })

  const { data: payData, loading: payLoading, refetch: refetchPay } = useQuery(GET_CUSTOMER_PAYMENTS, {
    variables: { organizationId: orgId, page: 1, limit: 50 },
    skip: !orgId,
  })

  const [createPayment, { loading: saving }] = useMutation(CREATE_CUSTOMER_PAYMENT, {
    onCompleted: () => {
      refetchInv()
      refetchPay()
      setPayByInvoice({})
      setReferenceNumber('')
      setNotes('')
      setErrors({})
    },
    onError: (err) => setErrors({ submit: err.message }),
  })

  const customers = customersData?.customers ?? []
  const clients = clientsData?.clients ?? []
  const customerOptions = useMemo(
    () => buildBillToOptions(clients, customers),
    [clients, customers],
  )

  const rawInvoices = invData?.customerinvoices ?? []
  const openInvoices = useMemo(
    () =>
      rawInvoices.filter(
        (inv: { outstandingAmount: number; status: string }) =>
          (inv.outstandingAmount ?? 0) > 0.001 && !['draft', 'cancelled', 'paid'].includes(inv.status),
      ),
    [rawInvoices],
  )

  const setPayCell = (invoiceId: string, v: string) => {
    setPayByInvoice((p) => ({ ...p, [invoiceId]: v }))
    setErrors((e) => ({ ...e, submit: '', allocations: '' }))
  }

  const fillOutstanding = () => {
    const next: Record<string, string> = {}
    for (const inv of openInvoices) {
      next[inv.id] = String(inv.outstandingAmount ?? 0)
    }
    setPayByInvoice(next)
  }

  const clearAmounts = () => setPayByInvoice({})

  const allocationTotal = useMemo(() => {
    let t = 0
    for (const inv of openInvoices) {
      const raw = payByInvoice[inv.id]
      const n = parseFloat(raw || '0')
      if (!Number.isNaN(n)) t += n
    }
    return Math.round(t * 100) / 100
  }, [openInvoices, payByInvoice])

  const handleSubmit = () => {
    const e: Record<string, string> = {}
    if (!customerId) e.customer = 'Select bill-to (client or customer)'
    if (!paymentDate) e.date = 'Payment date is required'

    const allocations: { invoiceId: string; amount: number }[] = []
    for (const inv of openInvoices) {
      const raw = payByInvoice[inv.id]
      const amount = parseFloat(raw || '0')
      if (Number.isNaN(amount) || amount < 0) {
        e.allocations = 'Invalid amount on one or more rows'
        break
      }
      if (amount === 0) continue
      const max = inv.outstandingAmount ?? 0
      if (amount > max + 0.01) {
        e.allocations = `Pay amount for ${inv.seqNo} cannot exceed outstanding (${formatMoney(max)})`
        break
      }
      allocations.push({ invoiceId: inv.id, amount })
    }

    if (!allocations.length) e.allocations = 'Enter at least one payment amount greater than zero'
    if (allocationTotal <= 0) e.allocations = 'Total payment must be greater than zero'

    setErrors(e)
    if (Object.keys(e).length) return

    createPayment({
      variables: {
        input: {
          customerId,
          paymentDate,
          paymentMethod,
          referenceNumber: referenceNumber || undefined,
          totalAmount: allocationTotal,
          allocations,
          notes: notes || undefined,
          organizationId: orgId,
        },
      },
    })
  }

  const recentPayments = payData?.customerPayments ?? []

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileSpreadsheet className="h-8 w-8 text-emerald-700" />
          Accept Customer Payments
        </h1>
        <p className="text-gray-500 mt-1">
          Record receipts against open customer invoices in a worksheet-style layout.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Bill-to contacts',
            value: clients.length + customers.length,
            icon: Banknote,
            cls: 'text-emerald-700 bg-emerald-50',
          },
          {
            label: 'Open invoices (this customer)',
            value: openInvoices.length,
            icon: FileSpreadsheet,
            cls: 'text-blue-700 bg-blue-50',
          },
          {
            label: 'This payment total',
            value: `$${formatMoney(allocationTotal)}`,
            icon: Save,
            cls: 'text-violet-700 bg-violet-50',
          },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm"
          >
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}>
              <Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-lg font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Excel-style worksheet */}
      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-[#217346] text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>Payment worksheet</span>
          <span className="opacity-90">Customer receipts</span>
        </div>

        <div className="p-3 overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[720px]">
            <tbody>
              <tr>
                <td className={labelCell}>Bill-to</td>
                <td className={`${cell} min-w-[280px]`} colSpan={3}>
                  <SelectFloating
                    label=""
                    value={customerId}
                    onChange={(v) => {
                      const next = typeof v === 'string' ? v : v.target.value
                      setCustomerId(next)
                      setPayByInvoice({})
                      setErrors({})
                    }}
                    options={customerOptions}
                    className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                  />
                  {errors.customer && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.customer}</p>
                  )}
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Payment date</td>
                <td className={cell}>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none font-mono"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                  {errors.date && <p className="text-red-600 text-[11px] mt-1">{errors.date}</p>}
                </td>
                <td className={labelCell}>Method</td>
                <td className={cell}>
                  <select
                    className="w-full bg-transparent outline-none"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Reference #</td>
                <td className={cell}>
                  <input
                    className="w-full bg-transparent outline-none font-mono"
                    placeholder="Cheque / bank ref"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </td>
                <td className={labelCell}>Notes</td>
                <td className={cell}>
                  <input
                    className="w-full bg-transparent outline-none"
                    placeholder="Optional"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={fillOutstanding}
              disabled={!customerId || !openInvoices.length}
            >
              Fill outstanding
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={clearAmounts}>
              Clear amounts
            </Button>
          </div>

          <p className="text-[11px] text-gray-500 mt-2">
            Choose the same bill-to as on the invoice (CRM <strong>Client</strong> or registered{' '}
            <strong>Customer</strong>). Enter amounts in <strong>Pay now</strong> for one or more lines.
          </p>

          <table className="w-full border-collapse mt-3 min-w-[720px]">
            <thead>
              <tr>
                <th className={`${headerCell} text-left`}>Invoice #</th>
                <th className={`${headerCell} text-left`}>Invoice date</th>
                <th className={`${headerCell} ${moneyClass}`}>Total</th>
                <th className={`${headerCell} ${moneyClass}`}>Paid</th>
                <th className={`${headerCell} ${moneyClass}`}>Outstanding</th>
                <th className={`${headerCell} ${moneyClass} min-w-[100px]`}>Pay now</th>
              </tr>
            </thead>
            <tbody>
              {!customerId && (
                <tr>
                  <td colSpan={6} className={`${cell} text-center text-gray-400 py-8`}>
                    Choose a customer to load invoices.
                  </td>
                </tr>
              )}
              {customerId && invLoading && (
                <tr>
                  <td colSpan={6} className={`${cell} text-center text-gray-500 py-6`}>
                    Loading invoices…
                  </td>
                </tr>
              )}
              {customerId && !invLoading && !openInvoices.length && (
                <tr>
                  <td colSpan={6} className={`${cell} text-center text-gray-500 py-6`}>
                    No open invoices for this customer. Create invoices from Sales → Create Invoices first.
                  </td>
                </tr>
              )}
              {openInvoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-[#fafafa]">
                  <td className={`${cell} font-mono font-medium`}>{inv.seqNo}</td>
                  <td className={cell}>
                    {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : '—'}
                  </td>
                  <td className={`${cell} ${moneyClass}`}>{formatMoney(inv.totalAmount ?? 0)}</td>
                  <td className={`${cell} ${moneyClass} text-green-700`}>
                    {formatMoney(inv.paidAmount ?? 0)}
                  </td>
                  <td className={`${cell} ${moneyClass} text-amber-800 font-semibold`}>
                    {formatMoney(inv.outstandingAmount ?? 0)}
                  </td>
                  <td className={`${cell} ${moneyClass} p-0`}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full h-full min-h-[32px] px-2 py-1.5 bg-[#fffef7] font-mono text-right outline-none focus:bg-amber-50/80"
                      placeholder="0.00"
                      value={payByInvoice[inv.id] ?? ''}
                      onChange={(e) => setPayCell(inv.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className={`${labelCell} text-right`}>
                  Payment total
                </td>
                <td className={`${cell} ${moneyClass} font-bold text-emerald-800 bg-[#e8f5e9]`}>
                  ${formatMoney(allocationTotal)}
                </td>
              </tr>
            </tfoot>
          </table>

          {errors.allocations && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5 mt-2">
              {errors.allocations}
            </p>
          )}
          {errors.submit && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5 mt-2">
              {errors.submit}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              size="sm"
              className="h-9 text-xs bg-[#217346] hover:bg-[#1a5c38] text-white min-w-[160px]"
              onClick={handleSubmit}
              disabled={saving || !customerId}
            >
              {saving ? (
                'Saving…'
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5 inline" />
                  Record payment (${formatMoney(allocationTotal)})
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Recent receipts */}
      <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Recent customer payments</h2>
          <button
            type="button"
            onClick={() => refetchPay()}
            className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${payLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[640px]">
            <thead>
              <tr>
                <th className={headerCell}>Receipt #</th>
                <th className={headerCell}>Date</th>
                <th className={headerCell}>Customer</th>
                <th className={headerCell}>Method</th>
                <th className={`${headerCell} ${moneyClass}`}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {!recentPayments.length && (
                <tr>
                  <td colSpan={5} className={`${cell} text-center text-gray-400 py-6`}>
                    No payments recorded yet.
                  </td>
                </tr>
              )}
              {recentPayments.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className={`${cell} font-mono`}>{p.paymentNumber}</td>
                  <td className={cell}>
                    {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}
                  </td>
                  <td className={cell}>{p.customer?.name ?? '—'}</td>
                  <td className={cell}>{p.paymentMethod?.replace('_', ' ')}</td>
                  <td className={`${cell} ${moneyClass} font-semibold`}>
                    ${formatMoney(p.totalAmount ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
