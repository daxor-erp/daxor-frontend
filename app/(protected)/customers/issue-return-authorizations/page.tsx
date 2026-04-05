'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_CLIENTS,
  GET_CUSTOMERS,
  GET_ITEMS,
  GET_SALES_ORDERS,
  CREATE_RETURN_AUTHORIZATION,
} from '@/gql/queries'
import { buildBillToOptions } from '@/lib/bill-to-options'
import { wsCell, wsHeaderCell, wsLabelCell } from '@/lib/worksheet-styles'
import { ClipboardList, Plus, Trash2, Send } from 'lucide-react'

const labelCell = wsLabelCell
const cell = wsCell
const headerCell = wsHeaderCell

type LineDraft = {
  key: string
  itemId: string
  description: string
  quantity: string
}

function newLine(): LineDraft {
  return {
    key: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    itemId: '',
    description: '',
    quantity: '1',
  }
}

export default function IssueReturnAuthorizationsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [customerId, setCustomerId] = useState('')
  const [salesOrderId, setSalesOrderId] = useState('')
  const [requestedDate, setRequestedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState<LineDraft[]>(() => [newLine(), newLine()])
  const [error, setError] = useState('')

  const { data: customersData } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: clientsData } = useQuery(GET_CLIENTS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
  })

  const { data: soData } = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const { data: itemsData } = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 2000 },
    skip: !orgId,
  })

  const [success, setSuccess] = useState('')

  const [createRa, { loading: saving }] = useMutation(CREATE_RETURN_AUTHORIZATION, {
    onCompleted: (res) => {
      const ra = res.createReturnAuthorization
      setSuccess(`Created ${ra?.raNumber ?? 'RMA'} — pending approval.`)
      setReason('')
      setNotes('')
      setSalesOrderId('')
      setLines([newLine(), newLine()])
      setError('')
    },
    onError: (e) => setError(e.message),
  })

  const customers = customersData?.customers ?? []
  const clients = clientsData?.clients ?? []
  const customerOptions = useMemo(
    () => buildBillToOptions(clients, customers),
    [clients, customers],
  )

  const salesOrders = soData?.salesorders ?? []
  const ordersForCustomer = useMemo(
    () =>
      customerId
        ? salesOrders.filter((so: { customerId?: string }) => String(so.customerId ?? '') === customerId)
        : [],
    [salesOrders, customerId],
  )

  const items = itemsData?.items ?? []
  const itemOptions = useMemo(() => {
    const opts = [{ value: '', label: '— Item (optional) —' }]
    for (const it of items) {
      opts.push({
        value: it.id,
        label: `${it.seqNo ? `${it.seqNo} · ` : ''}${it.name}`,
      })
    }
    return opts
  }, [items])

  const setLine = (key: string, patch: Partial<LineDraft>) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)))
  }

  const onPickItem = (key: string, itemId: string) => {
    const it = items.find((i: { id: string }) => i.id === itemId)
    setLine(key, {
      itemId,
      description: it?.name ? String(it.name) : '',
    })
  }

  const addRow = () => setLines((p) => [...p, newLine()])
  const removeRow = (key: string) => setLines((p) => (p.length <= 1 ? p : p.filter((l) => l.key !== key)))

  const submit = () => {
    setError('')
    if (!customerId) {
      setError('Select bill-to.')
      return
    }
    const payloadLines = lines
      .map((l) => ({
        itemId: l.itemId.trim() ? l.itemId.trim() : undefined,
        description: l.description.trim(),
        quantity: parseFloat(l.quantity),
      }))
      .filter((l) => l.description.length > 0)

    if (!payloadLines.length) {
      setError('Add at least one line with a description.')
      return
    }
    for (const l of payloadLines) {
      if (!Number.isFinite(l.quantity) || l.quantity <= 0) {
        setError('Each line needs a positive quantity.')
        return
      }
    }

    setSuccess('')
    createRa({
      variables: {
        input: {
          organizationId: orgId,
          customerId,
          salesOrderId: salesOrderId || undefined,
          reason: reason.trim() || undefined,
          notes: notes.trim() || undefined,
          requestedDate: new Date(requestedDate).toISOString(),
          lines: payloadLines,
        },
      },
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-[1100px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ClipboardList className="h-8 w-8 text-amber-700" />
          Issue Return Authorizations
        </h1>
        <p className="text-gray-500 mt-1">
          Create an RMA request (pending). Use <strong>Approve Return Authorizations</strong> to approve or reject.
        </p>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-amber-800 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>Return authorization worksheet</span>
          <span className="opacity-90">New RMA</span>
        </div>

        <div className="p-3 space-y-3 overflow-x-auto">
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
                      setSalesOrderId('')
                      setError('')
                      setSuccess('')
                    }}
                    options={customerOptions}
                    className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Sales order</td>
                <td className={cell} colSpan={3}>
                  <select
                    className="w-full max-w-xl bg-transparent outline-none text-xs"
                    value={salesOrderId}
                    onChange={(e) => setSalesOrderId(e.target.value)}
                    disabled={!customerId}
                  >
                    <option value="">— Optional —</option>
                    {ordersForCustomer.map((so: { id: string; seqNo?: string; totalAmount?: number }) => (
                      <option key={so.id} value={so.id}>
                        {so.seqNo ?? so.id} — {so.totalAmount != null ? `$${Number(so.totalAmount).toFixed(2)}` : ''}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Requested date</td>
                <td className={cell}>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none font-mono"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                  />
                </td>
                <td className={labelCell}>Reason</td>
                <td className={cell}>
                  <input
                    className="w-full bg-transparent outline-none"
                    placeholder="e.g. Defective batch"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Notes</td>
                <td className={cell} colSpan={3}>
                  <input
                    className="w-full bg-transparent outline-none"
                    placeholder="Optional internal notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={addRow}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add line
            </Button>
            <span className="text-[11px] text-gray-500">Optional item links inventory; description is required.</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs min-w-[880px]">
              <thead>
                <tr>
                  <th className={`${headerCell} text-left min-w-[200px]`}>Item</th>
                  <th className={`${headerCell} text-left`}>Description</th>
                  <th className={`${headerCell} text-right w-28`}>Qty</th>
                  <th className={`${headerCell} w-16`} />
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.key} className="hover:bg-gray-50">
                    <td className={`${cell} p-1`}>
                      <select
                        className="w-full text-[11px] bg-white border border-gray-200 rounded px-1 py-1"
                        value={line.itemId}
                        onChange={(e) => onPickItem(line.key, e.target.value)}
                      >
                        {itemOptions.map((o, idx) => (
                          <option key={`${line.key}-${idx}-${o.value}`} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={`${cell} p-1`}>
                      <input
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs"
                        value={line.description}
                        onChange={(e) => setLine(line.key, { description: e.target.value })}
                        placeholder="Line description"
                      />
                    </td>
                    <td className={`${cell} p-1`}>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        className="w-full text-right font-mono text-xs px-2 py-1 border border-gray-200 rounded"
                        value={line.quantity}
                        onChange={(e) => setLine(line.key, { quantity: e.target.value })}
                      />
                    </td>
                    <td className={`${cell} text-center p-1`}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-gray-500"
                        onClick={() => removeRow(line.key)}
                        aria-label="Remove line"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              className="h-9 text-xs bg-amber-800 hover:bg-amber-900 text-white"
              onClick={submit}
              disabled={saving || !orgId}
            >
              <Send className="h-3.5 w-3.5 mr-1 inline" />
              {saving ? 'Submitting…' : 'Submit RMA request'}
            </Button>
          </div>
          {success && (
            <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2 py-1.5">
              {success}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
