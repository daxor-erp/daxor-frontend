'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  GET_CASH_SALES_REFUND_CANDIDATES,
  GET_ORGANIZATIONS,
  REFUND_CASH_SALE,
} from '@/gql/queries'
import { CUSTOMER_PAYMENT_METHOD_OPTIONS } from '@/lib/customer-payment-methods'
import { wsCell, wsLabelCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { Banknote, RefreshCw } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

const labelCell = wsLabelCell
const cell = wsCell
const moneyClass = wsMoney

export default function RefundCashSalesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [salesOrderId, setSalesOrderId] = useState('')
  const [refundDate, setRefundDate] = useState(() => new Date().toISOString().split('T')[0])
  const [refundMethod, setRefundMethod] = useState('cash')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const { data: candData, loading: candLoading, refetch } = useQuery(GET_CASH_SALES_REFUND_CANDIDATES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: orgsData } = useQuery(GET_ORGANIZATIONS, { variables: { page: 1, limit: 300 } })

  const [refundCashSale, { loading: saving }] = useMutation(REFUND_CASH_SALE, {
    onCompleted: () => {
      setSalesOrderId('')
      setReferenceNumber('')
      setAmount('')
      setNotes('')
      setError('')
      void refetch()
    },
    onError: (e) => setError(e.message),
  })

  const candidates = candData?.cashSalesRefundCandidates ?? []
  const orgs = orgsData?.organizations ?? []

  const selected = useMemo(
    () => candidates.find((s: { id: string }) => s.id === salesOrderId),
    [candidates, salesOrderId],
  )

  useEffect(() => {
    if (selected?.totalAmount != null) {
      setAmount(String(Number(selected.totalAmount)))
    } else {
      setAmount('')
    }
  }, [selected?.id, selected?.totalAmount])

  const customerName = (cid: string) => orgs.find((o: { id: string }) => o.id === cid)?.name ?? cid.slice(0, 8)

  const submit = () => {
    setError('')
    if (!salesOrderId) {
      setError('Select a cash sale.')
      return
    }
    const n = parseFloat(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid refund amount.')
      return
    }
    if (selected && n > Number(selected.totalAmount ?? 0) + 0.01) {
      setError('Refund cannot exceed the sale total.')
      return
    }
    refundCashSale({
      variables: {
        input: {
          salesOrderId,
          refundDate: new Date(refundDate).toISOString(),
          refundMethod,
          referenceNumber: referenceNumber.trim() || undefined,
          amount: n,
          notes: notes.trim() || undefined,
        },
      },
    })
  }

  return (
    <div className="erp-shell">
      <div>
        <h1 className="erp-page-title flex items-center gap-2">
          <Banknote className="h-8 w-8 text-orange-700" />
          Refund Cash Sales
        </h1>
        <p className="text-gray-500 mt-1">
          Refund <strong>cash sale</strong> orders (flagged at creation). The sale is marked refunded; use your cash /
          bank process to pay the customer.
        </p>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-orange-800 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>Refund worksheet</span>
          <span className="opacity-90">Cash sale reversal</span>
        </div>

        <div className="p-3 overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[720px]">
            <tbody>
              <tr>
                <td className={labelCell}>Cash sale *</td>
                <td className={`${cell} min-w-[320px]`} colSpan={3}>
                  <select
                    className="w-full max-w-2xl bg-transparent outline-none text-xs font-mono"
                    value={salesOrderId}
                    onChange={(e) => {
                      setSalesOrderId(e.target.value)
                      setError('')
                    }}
                  >
                    <option value="">— Select —</option>
                    {candidates.map((s: { id: string; seqNo: string; customerId: string; totalAmount: number }) => (
                      <option key={s.id} value={s.id}>
                        {s.seqNo} · {customerName(s.customerId)} · {formatMoney(Number(s.totalAmount ?? 0))}
                      </option>
                    ))}
                  </select>
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
                    placeholder="Optional"
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Notes</td>
                <td className={cell} colSpan={3}>
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
              size="sm"
              className="h-9 text-xs bg-orange-800 hover:bg-orange-900 text-white"
              onClick={submit}
              disabled={saving || !orgId || !salesOrderId}
            >
              {saving ? 'Processing…' : 'Record refund'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => refetch()}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${candLoading ? 'animate-spin' : ''}`} />
              Refresh list
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5 mt-2">{error}</p>
          )}
          {!candLoading && !candidates.length && (
            <p className="text-xs text-gray-500 mt-2">
              No refundable cash sales. New cash sales must be created with the cash-sale flag (Enter Cash Sales). Older
              orders without the flag will not appear here.
            </p>
          )}
        </div>
      </div>

      {selected && (
        <div className="rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
          <p className="font-semibold text-gray-800 mb-1">Selected sale</p>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className={`${labelCell} w-36`}>Customer</td>
                <td className={cell}>{customerName(selected.customerId)}</td>
              </tr>
              <tr>
                <td className={labelCell}>Sale total</td>
                <td className={`${cell} ${moneyClass}`}>{formatMoney(Number(selected.totalAmount ?? 0))}</td>
              </tr>
              <tr>
                <td className={labelCell}>Order date</td>
                <td className={`${cell} font-mono`}>
                  {selected.orderDate ? formatDate(selected.orderDate) : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
