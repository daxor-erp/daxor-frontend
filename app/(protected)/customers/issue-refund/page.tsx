'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_CLIENTS,
  GET_CUSTOMERS,
  GET_CUSTOMER_INVOICES,
  GET_CUSTOMER_REFUNDS,
  CREATE_CUSTOMER_REFUND,
  CANCEL_CUSTOMER_REFUND,
} from '@/gql/queries'
import { buildBillToOptions } from '@/lib/bill-to-options'
import { CUSTOMER_PAYMENT_METHOD_OPTIONS } from '@/lib/customer-payment-methods'
import { wsCell, wsHeaderCell, wsLabelCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { Banknote, RefreshCw, Undo2 } from 'lucide-react'

const labelCell = wsLabelCell
const cell = wsCell
const headerCell = wsHeaderCell
const moneyClass = wsMoney

export default function IssueCustomerRefundPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [customerId, setCustomerId] = useState('')
  const [refundDate, setRefundDate] = useState(() => new Date().toISOString().split('T')[0])
  const [refundMethod, setRefundMethod] = useState('bank_transfer')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [customerInvoiceId, setCustomerInvoiceId] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const { data: customersData } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: clientsData } = useQuery(GET_CLIENTS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
  })

  const { data: invData, refetch: refetchInv } = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 200, customerId: customerId || undefined },
    skip: !orgId || !customerId,
  })

  const { data: refundsData, loading: refundsLoading, refetch: refetchRefunds } = useQuery(GET_CUSTOMER_REFUNDS, {
    variables: { organizationId: orgId, page: 1, limit: 40 },
    skip: !orgId,
  })

  const [createRefund, { loading: saving }] = useMutation(CREATE_CUSTOMER_REFUND, {
    onCompleted: () => {
      setReferenceNumber('')
      setAmount('')
      setCustomerInvoiceId('')
      setNotes('')
      setError('')
      void refetchInv()
      void refetchRefunds()
    },
    onError: (e) => setError(e.message),
  })

  const [cancelRefund, { loading: cancelling }] = useMutation(CANCEL_CUSTOMER_REFUND, {
    onCompleted: () => {
      void refetchRefunds()
      void refetchInv()
    },
    onError: (e) => setError(e.message),
  })

  const customers = customersData?.customers ?? []
  const clients = clientsData?.clients ?? []
  const customerOptions = useMemo(
    () => buildBillToOptions(clients, customers),
    [clients, customers],
  )

  const rawInvoices = invData?.customerinvoices ?? []
  const refundableInvoices = useMemo(
    () => rawInvoices.filter((inv: { paidAmount?: number; status: string }) => {
      const paid = Number(inv.paidAmount ?? 0)
      return paid > 0.001 && !['draft', 'cancelled'].includes(inv.status)
    }),
    [rawInvoices],
  )

  const refunds = refundsData?.customerRefunds ?? []
  const totalIssued = useMemo(
    () => refunds.reduce((s: number, r: { amount: number }) => s + Number(r.amount ?? 0), 0),
    [refunds],
  )

  const handleSubmit = () => {
    setError('')
    if (!customerId) {
      setError('Select bill-to (client or customer).')
      return
    }
    const n = parseFloat(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid refund amount.')
      return
    }
    if (customerInvoiceId) {
      const inv = refundableInvoices.find((i: { id: string }) => i.id === customerInvoiceId)
      if (inv && n > Number(inv.paidAmount ?? 0) + 0.01) {
        setError('Amount cannot exceed paid amount on the selected invoice.')
        return
      }
    }
    createRefund({
      variables: {
        input: {
          organizationId: orgId,
          customerId,
          refundDate: new Date(refundDate).toISOString(),
          refundMethod,
          referenceNumber: referenceNumber.trim() || undefined,
          amount: n,
          customerInvoiceId: customerInvoiceId || undefined,
          notes: notes.trim() || undefined,
        },
      },
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-[1100px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Undo2 className="h-8 w-8 text-rose-700" />
          Issue Customer Refund
        </h1>
        <p className="text-gray-500 mt-1">
          Record money returned to the customer. Link an invoice to reduce applied payment on that bill; leave invoice
          blank for a goodwill or overpayment refund without touching AR.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-400">Recent refunds (list)</p>
          <p className="text-lg font-bold text-gray-800">{refunds.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-400">Total shown (page)</p>
          <p className="text-lg font-bold text-rose-800 tabular-nums">{formatMoney(totalIssued)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-400">Refundable invoices</p>
          <p className="text-lg font-bold text-gray-800">{customerId ? refundableInvoices.length : '—'}</p>
        </div>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-[#217346] text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>Refund worksheet</span>
          <span className="opacity-90">Disbursement</span>
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
                      setCustomerInvoiceId('')
                      setError('')
                    }}
                    options={customerOptions}
                    className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Refund date</td>
                <td className={cell}>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none font-mono"
                    value={refundDate}
                    onChange={(e) => setRefundDate(e.target.value)}
                  />
                </td>
                <td className={labelCell}>Method</td>
                <td className={cell}>
                  <select
                    className="w-full bg-transparent outline-none"
                    value={refundMethod}
                    onChange={(e) => setRefundMethod(e.target.value)}
                  >
                    {CUSTOMER_PAYMENT_METHOD_OPTIONS.map((m) => (
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
                <td className={labelCell}>Amount</td>
                <td className={`${cell} ${moneyClass}`}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full bg-transparent outline-none font-mono text-right"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Apply to invoice</td>
                <td className={cell} colSpan={3}>
                  <select
                    className="w-full max-w-xl bg-transparent outline-none text-xs"
                    value={customerInvoiceId}
                    onChange={(e) => setCustomerInvoiceId(e.target.value)}
                    disabled={!customerId}
                  >
                    <option value="">— None (no AR adjustment) —</option>
                    {refundableInvoices.map((inv: { id: string; seqNo: string; paidAmount: number }) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.seqNo} — paid {formatMoney(Number(inv.paidAmount ?? 0))}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Notes</td>
                <td className={cell} colSpan={3}>
                  <input
                    className="w-full bg-transparent outline-none"
                    placeholder="Optional reason"
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
              size="sm"
              className="h-9 text-xs bg-[#217346] hover:bg-[#1a5c38] text-white"
              onClick={handleSubmit}
              disabled={saving || !orgId}
            >
              <Banknote className="h-3.5 w-3.5 mr-1 inline" />
              {saving ? 'Recording…' : 'Record refund'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => refetchRefunds()}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${refundsLoading ? 'animate-spin' : ''}`} />
              Refresh list
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5 mt-2">{error}</p>
          )}
        </div>
      </div>

      <div className="rounded border border-gray-300 overflow-hidden bg-white shadow-sm">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-800">
          Recent refunds
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[800px]">
            <thead>
              <tr>
                <th className={`${headerCell} text-left`}>Refund #</th>
                <th className={`${headerCell} text-left`}>Bill-to</th>
                <th className={`${headerCell} text-left`}>Date</th>
                <th className={`${headerCell} text-left`}>Method</th>
                <th className={`${headerCell} ${moneyClass}`}>Amount</th>
                <th className={`${headerCell} text-left`}>Invoice</th>
                <th className={`${headerCell} text-center w-24`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {!refunds.length && (
                <tr>
                  <td colSpan={7} className={`${cell} text-center text-gray-500 py-8`}>
                    {refundsLoading ? 'Loading…' : 'No refunds recorded yet.'}
                  </td>
                </tr>
              )}
              {refunds.map(
                (r: {
                  id: string
                  refundNumber: string
                  customer?: { name?: string; docNumber?: string }
                  refundDate: string
                  refundMethod: string
                  amount: number
                  invoice?: { seqNo?: string } | null
                }) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className={`${cell} font-mono`}>{r.refundNumber}</td>
                    <td className={cell}>
                      <span className="font-medium">{r.customer?.name ?? '—'}</span>
                      {r.customer?.docNumber ? (
                        <span className="text-gray-500 ml-1">{r.customer.docNumber}</span>
                      ) : null}
                    </td>
                    <td className={`${cell} font-mono`}>
                      {r.refundDate ? new Date(r.refundDate).toLocaleDateString() : '—'}
                    </td>
                    <td className={cell}>{r.refundMethod.replace(/_/g, ' ')}</td>
                    <td className={`${cell} ${moneyClass}`}>{formatMoney(Number(r.amount ?? 0))}</td>
                    <td className={`${cell} font-mono`}>{r.invoice?.seqNo ?? '—'}</td>
                    <td className={`${cell} text-center`}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[11px] text-rose-700"
                        disabled={cancelling}
                        onClick={() => {
                          if (
                            confirm(
                              `Cancel refund ${r.refundNumber}? If linked to an invoice, paid amount will be restored.`,
                            )
                          ) {
                            setError('')
                            cancelRefund({ variables: { id: r.id } })
                          }
                        }}
                      >
                        <Undo2 className="h-3 w-3 mr-0.5 inline" />
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
