'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { GET_RETURN_AUTHORIZATIONS, RECEIVE_RETURN_AUTHORIZATION_GOODS } from '@/gql/queries'
import { wsCell, wsHeaderCell, wsLabelCell } from '@/lib/worksheet-styles'
import { PackageCheck, RefreshCw } from 'lucide-react'

export default function ReceiveReturnedOrderPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [raId, setRaId] = useState('')
  const [receivedDate, setReceivedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [receiptNotes, setReceiptNotes] = useState('')
  const [qtyThisReceipt, setQtyThisReceipt] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  const { data, loading, refetch } = useQuery(GET_RETURN_AUTHORIZATIONS, {
    variables: {
      organizationId: orgId,
      status: 'approved',
      receiptComplete: false,
      page: 1,
      limit: 150,
    },
    skip: !orgId,
  })

  const list = data?.returnAuthorizations ?? []

  const selected = useMemo(() => list.find((r: { id: string }) => r.id === raId), [list, raId])

  useEffect(() => {
    if (!selected?.lines?.length) {
      setQtyThisReceipt({})
      return
    }
    const next: Record<string, string> = {}
    for (const line of selected.lines) {
      const lid = line.id
      const req = Number(line.quantity ?? 0)
      const got = Number(line.quantityReceived ?? 0)
      const remain = Math.max(0, req - got)
      next[lid] = remain > 0 ? String(remain) : ''
    }
    setQtyThisReceipt(next)
  }, [selected?.id, selected?.lines])

  const [receiveGoods, { loading: saving }] = useMutation(RECEIVE_RETURN_AUTHORIZATION_GOODS, {
    onCompleted: () => {
      setError('')
      setReceiptNotes('')
      setRaId('')
      void refetch()
    },
    onError: (e) => setError(e.message),
  })

  const submit = () => {
    if (!selected) {
      setError('Select an approved return authorization.')
      return
    }
    const lines: { lineId: string; quantityReceived: number }[] = []
    for (const line of selected.lines) {
      const raw = qtyThisReceipt[line.id]
      const n = parseFloat(raw || '0')
      if (!Number.isFinite(n) || n <= 0) continue
      const req = Number(line.quantity ?? 0)
      const got = Number(line.quantityReceived ?? 0)
      const remain = Math.max(0, req - got)
      if (n > remain + 0.0001) {
        setError(`Qty for "${line.description.slice(0, 40)}…" cannot exceed remaining (${remain}).`)
        return
      }
      lines.push({ lineId: line.id, quantityReceived: n })
    }
    if (!lines.length) {
      setError('Enter at least one positive quantity to receive.')
      return
    }
    setError('')
    receiveGoods({
      variables: {
        input: {
          returnAuthorizationId: selected.id,
          receivedDate: new Date(receivedDate).toISOString(),
          notes: receiptNotes.trim() || undefined,
          lines,
        },
      },
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-[1000px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PackageCheck className="h-8 w-8 text-teal-700" />
          Receive Returned Order
        </h1>
        <p className="text-gray-500 mt-1">
          Record goods received against an <strong>approved</strong> return authorization (RMA). Quantities accumulate;
          the RMA is marked complete when all lines are fully received.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-400">Awaiting receipt</p>
          <p className="text-lg font-bold text-gray-800">{list.length}</p>
        </div>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-teal-800 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>Receipt worksheet</span>
          <span className="opacity-90">Approved RMAs</span>
        </div>

        <div className="p-4 space-y-4">
          <table className="w-full border-collapse text-xs min-w-[640px]">
            <tbody>
              <tr>
                <td className={wsLabelCell}>Return authorization *</td>
                <td className={`${wsCell} min-w-[320px]`} colSpan={3}>
                  <select
                    className="w-full max-w-xl bg-transparent outline-none text-xs font-mono"
                    value={raId}
                    onChange={(e) => {
                      setRaId(e.target.value)
                      setError('')
                    }}
                  >
                    <option value="">— Select RA —</option>
                    {list.map((r: { id: string; raNumber: string; customer?: { name?: string } }) => (
                      <option key={r.id} value={r.id}>
                        {r.raNumber} — {r.customer?.name ?? 'Customer'}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className={wsLabelCell}>Received date</td>
                <td className={wsCell}>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none font-mono"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                  />
                </td>
                <td className={wsLabelCell}>Receipt notes</td>
                <td className={wsCell}>
                  <input
                    className="w-full bg-transparent outline-none"
                    placeholder="Optional (dock, condition…)"
                    value={receiptNotes}
                    onChange={(e) => setReceiptNotes(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {selected && (
            <div className="overflow-x-auto border border-gray-200 rounded">
              <table className="w-full border-collapse text-xs min-w-[720px]">
                <thead>
                  <tr>
                    <th className={`${wsHeaderCell} text-left`}>Description</th>
                    <th className={`${wsHeaderCell} text-right w-24`}>Requested</th>
                    <th className={`${wsHeaderCell} text-right w-24`}>Received prior</th>
                    <th className={`${wsHeaderCell} text-right w-28`}>This receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.lines.map(
                    (line: { id: string; description: string; quantity: number; quantityReceived?: number }) => {
                      const req = Number(line.quantity ?? 0)
                      const got = Number(line.quantityReceived ?? 0)
                      const remain = Math.max(0, req - got)
                      return (
                        <tr key={line.id} className="hover:bg-gray-50">
                          <td className={wsCell}>{line.description}</td>
                          <td className={`${wsCell} text-right font-mono`}>{req}</td>
                          <td className={`${wsCell} text-right font-mono`}>{got}</td>
                          <td className={`${wsCell} p-1`}>
                            <input
                              type="number"
                              step="any"
                              min="0"
                              max={remain}
                              className="w-full text-right font-mono text-xs px-2 py-1 border border-gray-200 rounded"
                              value={qtyThisReceipt[line.id] ?? ''}
                              onChange={(e) =>
                                setQtyThisReceipt((p) => ({ ...p, [line.id]: e.target.value }))
                              }
                              disabled={remain <= 0}
                              placeholder={remain <= 0 ? '—' : '0'}
                            />
                          </td>
                        </tr>
                      )
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className="h-9 text-xs bg-teal-800 hover:bg-teal-900 text-white"
              onClick={submit}
              disabled={saving || !selected}
            >
              {saving ? 'Saving…' : 'Record receipt'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => refetch()}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh list
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5">{error}</p>
          )}
          {!loading && !list.length && (
            <p className="text-xs text-gray-500">
              No approved RMAs waiting for receipt. Approve a request first, or all open RMAs are fully received.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
