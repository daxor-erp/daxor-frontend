'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
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
import { Banknote, Save, FileSpreadsheet, Plus, Users, DollarSign } from 'lucide-react'
import { CUSTOMER_PAYMENT_METHOD_OPTIONS } from '@/lib/customer-payment-methods'
import { formatDate } from '@/lib/format-date'

const PAYMENT_METHODS = CUSTOMER_PAYMENT_METHOD_OPTIONS

const cell = wsCell
const headerCell = wsHeaderCell
const labelCell = wsLabelCell
const moneyClass = wsMoney

export default function AcceptCustomerPaymentsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [formOpen, setFormOpen] = useState(true)
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
    variables: { organizationId: orgId, page: 1, limit: 200 },
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

  const payments: any[] = payData?.customerPayments ?? []

  const stats = {
    contacts: clients.length + customers.length,
    openInvoices: openInvoices.length,
    payments: payments.length,
    paymentTotal: payments.reduce((s: number, p: any) => s + Number(p.totalAmount ?? 0), 0),
  }

  const columns: Column[] = [
    { key: 'paymentNumber', label: 'Receipt #', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'paymentDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'customer',
      label: 'Customer',
      render: (v) => <span className="text-sm font-medium">{v?.name ?? '—'}</span>,
    },
    {
      key: 'paymentMethod',
      label: 'Method',
      width: '130px',
      render: (v) => <span className="text-xs capitalize">{String(v ?? '—').replace(/_/g, ' ')}</span>,
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      width: '120px',
      align: 'right',
      render: (v) => <AmountCell value={v} />,
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Accept Customer Payments"
        subtitle="Record receipts against open customer invoices in a worksheet-style layout"
        icon={<FileSpreadsheet className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Customers' }, { label: 'Accept Payments' }]}
        actions={
          <Button
            onClick={() => setFormOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Payment
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Bill-to Contacts" value={stats.contacts} icon={<Users className="h-5 w-5" />} variant="slate" />
        <StatCard label="Open Invoices" value={customerId ? stats.openInvoices : '—'} icon={<FileSpreadsheet className="h-5 w-5" />} variant="blue" />
        <StatCard label="Payments" value={stats.payments} icon={<Banknote className="h-5 w-5" />} variant="green" />
        <StatCard
          label="Total Received"
          value={`₹${(stats.paymentTotal / 1000).toFixed(1)}k`}
          icon={<DollarSign className="h-5 w-5" />}
          variant="amber"
        />
      </StatsRow>

      {formOpen && (
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4 text-primary" />
              Payment worksheet
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
              Close
            </Button>
          </div>

          <div className="p-4 overflow-x-auto">
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
                      <p className="text-destructive text-[11px] mt-1">{errors.customer}</p>
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
                    {errors.date && <p className="text-destructive text-[11px] mt-1">{errors.date}</p>}
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

            <p className="text-[11px] text-muted-foreground mt-2">
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
                    <td colSpan={6} className={`${cell} text-center text-muted-foreground py-8`}>
                      Choose a customer to load invoices.
                    </td>
                  </tr>
                )}
                {customerId && invLoading && (
                  <tr>
                    <td colSpan={6} className={`${cell} text-center text-muted-foreground py-6`}>
                      Loading invoices…
                    </td>
                  </tr>
                )}
                {customerId && !invLoading && !openInvoices.length && (
                  <tr>
                    <td colSpan={6} className={`${cell} text-center text-muted-foreground py-6`}>
                      No open invoices for this customer. Create invoices from Sales → Create Invoices first.
                    </td>
                  </tr>
                )}
                {openInvoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-muted/40">
                    <td className={`${cell} font-mono font-medium`}>{inv.seqNo}</td>
                    <td className={cell}>
                      {inv.invoiceDate ? formatDate(inv.invoiceDate) : '—'}
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
                        className="w-full h-full min-h-[32px] px-2 py-1.5 bg-amber-50/40 font-mono text-right outline-none focus:bg-amber-50/80"
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
                  <td className={`${cell} ${moneyClass} font-bold text-foreground bg-muted/60`}>
                    ₹{formatMoney(allocationTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {errors.allocations && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded px-2 py-1.5 mt-2">
                {errors.allocations}
              </p>
            )}
            {errors.submit && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded px-2 py-1.5 mt-2">
                {errors.submit}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                size="sm"
                className="h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90 min-w-[160px]"
                onClick={handleSubmit}
                disabled={saving || !customerId}
              >
                {saving ? (
                  'Saving…'
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1.5 inline" />
                    Record payment (₹{formatMoney(allocationTotal)})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={payments}
        columns={columns}
        loading={payLoading}
        title="All Customer Payments"
        searchable
        searchPlaceholder="Search payments…"
        emptyMessage="No payments recorded yet."
        pageSize={25}
      />
    </div>
  )
}
