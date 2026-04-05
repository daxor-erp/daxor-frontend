'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_CLIENTS,
  GET_CUSTOMERS,
  GET_CUSTOMER_DEPOSITS,
  CREATE_CUSTOMER_DEPOSIT,
  CANCEL_CUSTOMER_DEPOSIT,
} from '@/gql/queries'
import { buildBillToOptions } from '@/lib/bill-to-options'
import { CUSTOMER_PAYMENT_METHOD_OPTIONS } from '@/lib/customer-payment-methods'
import { wsCell, wsHeaderCell, wsLabelCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { PiggyBank, RefreshCw, XCircle } from 'lucide-react'

const labelCell = wsLabelCell
const cell = wsCell
const headerCell = wsHeaderCell
const moneyClass = wsMoney

export default function RecordCustomerDepositsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [customerId, setCustomerId] = useState('')
  const [depositDate, setDepositDate] = useState(() => new Date().toISOString().split('T')[0])
  const [depositMethod, setDepositMethod] = useState('bank_transfer')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [amount, setAmount] = useState('')
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

  const { data: depData, loading: depLoading, refetch: refetchDep } = useQuery(GET_CUSTOMER_DEPOSITS, {
    variables: { organizationId: orgId, page: 1, limit: 40 },
    skip: !orgId,
  })

  const [createDeposit, { loading: saving }] = useMutation(CREATE_CUSTOMER_DEPOSIT, {
    onCompleted: () => {
      setReferenceNumber('')
      setAmount('')
      setNotes('')
      setError('')
      void refetchDep()
    },
    onError: (e) => setError(e.message),
  })

  const [cancelDeposit, { loading: cancelling }] = useMutation(CANCEL_CUSTOMER_DEPOSIT, {
    onCompleted: () => void refetchDep(),
    onError: (e) => setError(e.message),
  })

  const customers = customersData?.customers ?? []
  const clients = clientsData?.clients ?? []
  const customerOptions = useMemo(
    () => buildBillToOptions(clients, customers),
    [clients, customers],
  )

  const deposits = depData?.customerDeposits ?? []

  const submit = () => {
    setError('')
    if (!customerId) {
      setError('Select bill-to (client or customer).')
      return
    }
    const n = parseFloat(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid deposit amount.')
      return
    }
    createDeposit({
      variables: {
        input: {
          organizationId: orgId,
          customerId,
          depositDate: new Date(depositDate).toISOString(),
          depositMethod,
          referenceNumber: referenceNumber.trim() || undefined,
          amount: n,
          notes: notes.trim() || undefined,
        },
      },
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-[1100px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PiggyBank className="h-8 w-8 text-violet-700" />
          Record Customer Deposits
        </h1>
        <p className="text-gray-500 mt-1">
          Record customer prepayments or on-account deposits (liability). Apply them to invoices elsewhere in your
          process when ready.
        </p>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-violet-800 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>Deposit worksheet</span>
          <span className="opacity-90">Customer liability</span>
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
                      setError('')
                    }}
                    options={customerOptions}
                    className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Deposit date</td>
                <td className={cell}>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none font-mono"
                    value={depositDate}
                    onChange={(e) => setDepositDate(e.target.value)}
                  />
                </td>
                <td className={labelCell}>Method</td>
                <td className={cell}>
                  <select
                    className="w-full bg-transparent outline-none"
                    value={depositMethod}
                    onChange={(e) => setDepositMethod(e.target.value)}
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
              className="h-9 text-xs bg-violet-800 hover:bg-violet-900 text-white"
              onClick={submit}
              disabled={saving || !orgId}
            >
              {saving ? 'Saving…' : 'Record deposit'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => refetchDep()}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${depLoading ? 'animate-spin' : ''}`} />
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
          Recent deposits
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[800px]">
            <thead>
              <tr>
                <th className={`${headerCell} text-left`}>Deposit #</th>
                <th className={`${headerCell} text-left`}>Bill-to</th>
                <th className={`${headerCell} text-left`}>Date</th>
                <th className={`${headerCell} text-left`}>Method</th>
                <th className={`${headerCell} ${moneyClass}`}>Amount</th>
                <th className={`${headerCell} text-center w-24`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {!deposits.length && (
                <tr>
                  <td colSpan={6} className={`${cell} text-center text-gray-500 py-8`}>
                    {depLoading ? 'Loading…' : 'No deposits recorded yet.'}
                  </td>
                </tr>
              )}
              {deposits.map(
                (d: {
                  id: string
                  depositNumber: string
                  customer?: { name?: string; docNumber?: string }
                  depositDate: string
                  depositMethod: string
                  amount: number
                }) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className={`${cell} font-mono`}>{d.depositNumber}</td>
                    <td className={cell}>
                      <span className="font-medium">{d.customer?.name ?? '—'}</span>
                      {d.customer?.docNumber ? (
                        <span className="text-gray-500 ml-1">{d.customer.docNumber}</span>
                      ) : null}
                    </td>
                    <td className={`${cell} font-mono`}>
                      {d.depositDate ? new Date(d.depositDate).toLocaleDateString() : '—'}
                    </td>
                    <td className={cell}>{d.depositMethod.replace(/_/g, ' ')}</td>
                    <td className={`${cell} ${moneyClass}`}>{formatMoney(Number(d.amount ?? 0))}</td>
                    <td className={`${cell} text-center`}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[11px] text-gray-600"
                        disabled={cancelling}
                        onClick={() => {
                          if (
                            confirm(
                              `Cancel deposit ${d.depositNumber}? This removes it from the register (soft cancel).`,
                            )
                          ) {
                            setError('')
                            cancelDeposit({ variables: { id: d.id } })
                          }
                        }}
                      >
                        <XCircle className="h-3 w-3 mr-0.5 inline" />
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
