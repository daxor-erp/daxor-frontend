'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_GOODS_RECEIPTS,
  CREATE_GOODS_RECEIPT,
  UPDATE_GOODS_RECEIPT,
  DELETE_GOODS_RECEIPT,
} from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Save, X, Pencil, Trash2 } from 'lucide-react'
import { shouldIgnoreRowClick } from '@/lib/data-table-row-click'

type GoodsReceiptRow = {
  id: string
  docNumber?: string | null
  docDate?: string | null
  status?: string | null
  createdAt?: string | null
}

function formatDisplayDate(value: string | null | undefined): string {
  if (value == null || value === '') return 'N/A'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString()
}

export default function GoodsReceiptsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [panelOpen, setPanelOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    docDate: new Date().toISOString().split('T')[0],
    status: 'DRAFT',
    organizationId: orgId,
  })

  useEffect(() => {
    if (!orgId) return
    setForm((p) => ({ ...p, organizationId: orgId }))
  }, [orgId])

  const { data, loading, error: queryError, refetch } = useQuery(GET_GOODS_RECEIPTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  function closePanel() {
    setPanelOpen(false)
    setEditingId(null)
    setFormError('')
    setForm({
      docDate: new Date().toISOString().split('T')[0],
      status: 'DRAFT',
      organizationId: orgId,
    })
  }

  const [createGoodsReceipt, { loading: creating }] = useMutation(CREATE_GOODS_RECEIPT, {
    onCompleted: () => {
      closePanel()
      void refetch()
    },
    onError: (err) => setFormError(err.message),
  })

  const [updateGoodsReceipt, { loading: updating }] = useMutation(UPDATE_GOODS_RECEIPT, {
    onCompleted: () => {
      closePanel()
      void refetch()
    },
    onError: (err) => setFormError(err.message),
  })

  const [deleteGoodsReceipt] = useMutation(DELETE_GOODS_RECEIPT, {
    onCompleted: () => void refetch(),
    onError: (err) => alert(err.message),
  })

  const items: GoodsReceiptRow[] = data?.goodsreceipts ?? []

  const openNew = () => {
    setEditingId(null)
    setFormError('')
    setForm({
      docDate: new Date().toISOString().split('T')[0],
      status: 'DRAFT',
      organizationId: orgId,
    })
    setPanelOpen(true)
  }

  const openEdit = (row: GoodsReceiptRow) => {
    if (!row.id) return
    const raw = row.docDate ?? ''
    let ymd = ''
    if (raw) {
      const d = new Date(raw)
      if (!Number.isNaN(d.getTime())) {
        ymd = d.toISOString().split('T')[0]
      }
    }
    if (!ymd) {
      ymd = new Date().toISOString().split('T')[0]
    }
    setEditingId(row.id)
    setFormError('')
    setForm({
      docDate: ymd,
      status: row.status != null && row.status !== '' ? String(row.status) : 'DRAFT',
      organizationId: orgId,
    })
    setPanelOpen(true)
  }

  const handleSave = () => {
    if (!orgId) {
      setFormError('Organization is required. Please sign in again.')
      return
    }
    if (!form.docDate?.trim()) {
      setFormError('Document date is required.')
      return
    }
    const input = {
      docDate: form.docDate,
      status: form.status,
      organizationId: orgId,
    }
    setFormError('')
    if (editingId) {
      updateGoodsReceipt({ variables: { id: editingId, input } })
    } else {
      createGoodsReceipt({ variables: { input } })
    }
  }

  const handleDelete = (id: string) => {
    if (!id) return
    if (confirm('Delete this goods receipt?')) {
      deleteGoodsReceipt({ variables: { id } })
    }
  }

  const saving = creating || updating

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Goods Receipts</h1>
          <p className="text-gray-500">Record and track goods receipt documents</p>
        </div>
        <Button onClick={openNew} disabled={!orgId}>
          <Plus className="h-4 w-4 mr-2" />
          New Record
        </Button>
      </div>

      {!orgId && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          No organization on your account. Goods receipts cannot be loaded until your profile includes an
          organization.
        </p>
      )}

      {queryError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {queryError.message}
        </p>
      )}

      {panelOpen && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">
              {editingId ? 'Edit Goods Receipt' : 'New Goods Receipt'}
            </span>
            <button type="button" onClick={closePanel} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2">
            <div className="border border-gray-300 rounded overflow-x-auto">
              <div
                className="grid bg-[#f0f0f0] border-b border-gray-300"
                style={{ gridTemplateColumns: '11rem 10rem 14rem 7rem' }}
              >
                {['Doc Date', 'Status', 'Organization', 'Action'].map((h, i) => (
                  <div
                    key={i}
                    className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0"
                  >
                    {h}
                  </div>
                ))}
              </div>
              <div className="grid min-w-[42rem]" style={{ gridTemplateColumns: '11rem 10rem 14rem 7rem' }}>
                <div className="border-r border-gray-200 px-1 py-1">
                  <input
                    type="date"
                    value={form.docDate}
                    onChange={(e) => setForm((p) => ({ ...p, docDate: e.target.value }))}
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div className="border-r border-gray-200 px-1 py-1">
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="POSTED">POSTED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div className="border-r border-gray-200 px-1 py-1">
                  <input
                    type="text"
                    value={form.organizationId}
                    readOnly
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-gray-50 text-gray-700"
                  />
                </div>
                <div className="px-1 py-1">
                  <Button
                    size="sm"
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white w-full"
                  >
                    <Save className="h-3.5 w-3.5 mr-1" /> {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
            {formError && <p className="text-xs text-red-600 mt-2">{formError}</p>}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Total Records: {items.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500">No records found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[960px] w-full text-xs">
                <thead>
                  <tr className="bg-[#f0f0f0] border-b border-gray-300">
                    {['Document #', 'Date', 'Status', 'Created', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 font-semibold text-gray-600 border-r border-gray-300 last:border-r-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={item.id || `row-${idx}`}
                      className={`border-b border-gray-200 cursor-pointer hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      onClick={(e) => {
                        if (shouldIgnoreRowClick(e) || !item.id) return
                        openEdit(item)
                      }}
                      title="Click to view or edit"
                    >
                      <td className="px-3 py-2 border-r border-gray-200 font-mono">
                        {item.docNumber ?? 'N/A'}
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        {formatDisplayDate(item.docDate ?? undefined)}
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs border border-blue-200">
                          {item.status ?? 'DRAFT'}
                        </span>
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        {formatDisplayDate(item.createdAt ?? undefined)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => openEdit(item)}
                            disabled={!item.id}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDelete(item.id)}
                            disabled={!item.id}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
