'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { CellInput } from '@/components/ui/cell-input'
import { CellSelect } from '@/components/ui/cell-select'
import { Button } from '@/components/ui/button'
import {
  GET_MATERIAL_RECEIPTS,
  CREATE_MATERIAL_RECEIPT,
  UPDATE_MATERIAL_RECEIPT,
  SUBMIT_MATERIAL_RECEIPT_FOR_APPROVAL,
  CANCEL_MATERIAL_RECEIPT,
  DELETE_MATERIAL_RECEIPT,
  GET_VENDORS,
  GET_PURCHASE_ORDERS,
  GET_WAREHOUSES,
} from '@/gql/queries'
import {
  Package,
  CheckCircle,
  Clock,
  X,
  Save,
  Plus,
  Trash2,
  Edit,
  Ban,
  Send,
} from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'

interface LineItem {
  itemDescription: string
  orderedQty: number
  receivedQty: number
  rejectedQty: number
  unit: string
  unitPrice: number
  lineTotal: number
}

const EMPTY_LINE: LineItem = {
  itemDescription: '',
  orderedQty: 0,
  receivedQty: 0,
  rejectedQty: 0,
  unit: '',
  unitPrice: 0,
  lineTotal: 0,
}

const EMPTY_FORM = {
  purchaseOrderId: '',
  purchaseOrderNumber: '',
  vendorId: '',
  vendorName: '',
  receiptDate: new Date().toISOString().split('T')[0],
  warehouseId: '',
  warehouseName: '',
  notes: '',
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  submitted: 'bg-sky-50 text-sky-800 border-sky-200',
  approval_declined: 'bg-red-50 text-red-700 border-red-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

export default function MaterialReceiptPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...EMPTY_LINE }])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_MATERIAL_RECEIPTS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const { data: vendorData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const { data: poData } = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const { data: warehouseData } = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createMRN, { loading: saving }] = useMutation(CREATE_MATERIAL_RECEIPT, {
    onCompleted: () => { refetch(); closeForm() },
  })

  const [updateMRN, { loading: updating }] = useMutation(UPDATE_MATERIAL_RECEIPT, {
    onCompleted: () => { refetch(); closeForm() },
  })

  const [submitMRNForApproval] = useMutation(SUBMIT_MATERIAL_RECEIPT_FOR_APPROVAL, {
    onCompleted: () => refetch(),
  })

  const [cancelMRN] = useMutation(CANCEL_MATERIAL_RECEIPT, {
    onCompleted: () => refetch(),
  })

  const [deleteMRN] = useMutation(DELETE_MATERIAL_RECEIPT, {
    onCompleted: () => refetch(),
  })

  const reset = () => {
    setForm({ ...EMPTY_FORM })
    setLineItems([{ ...EMPTY_LINE }])
    setErrors({})
  }

  const closeForm = () => {
    setAdding(false)
    setEditing(null)
    reset()
  }

  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const handlePOChange = (poId: string) => {
    const po = (poData?.purchaseorders ?? []).find((p: any) => p.id === poId)
    if (po) {
      setForm(prev => ({
        ...prev,
        purchaseOrderId: po.id,
        purchaseOrderNumber: po.seqNo || '',
        vendorId: po.vendorId || '',
        vendorName: po.vendorName || '',
      }))
      if (po.items?.length) {
        setLineItems(
          po.items.map((item: any) => ({
            itemDescription: item.itemDescription || '',
            orderedQty: item.quantity || 0,
            receivedQty: item.quantity || 0,
            rejectedQty: 0,
            unit: '',
            unitPrice: item.unitPrice || 0,
            lineTotal: item.lineTotal || item.quantity * item.unitPrice || 0,
          })),
        )
      }
    } else {
      setF('purchaseOrderId', poId)
    }
  }

  const handleVendorChange = (vendorId: string) => {
    const vendor = (vendorData?.vendors ?? []).find((v: any) => v.id === vendorId)
    setForm(prev => ({
      ...prev,
      vendorId,
      vendorName: vendor?.name || '',
    }))
  }

  const handleWarehouseChange = (warehouseId: string) => {
    const wh = (warehouseData?.warehouses ?? []).find((w: any) => w.id === warehouseId)
    setForm(prev => ({
      ...prev,
      warehouseId,
      warehouseName: wh?.warehouseName || '',
    }))
  }

  const updateLineItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], [field]: value }
      if (field === 'receivedQty' || field === 'unitPrice') {
        updated[idx].lineTotal =
          (field === 'receivedQty' ? Number(value) : updated[idx].receivedQty) *
          (field === 'unitPrice' ? Number(value) : updated[idx].unitPrice)
      }
      return updated
    })
  }

  const addLine = () => setLineItems(prev => [...prev, { ...EMPTY_LINE }])
  const removeLine = (idx: number) =>
    setLineItems(prev => prev.filter((_, i) => i !== idx))

  const totalAmount = lineItems.reduce((sum, l) => sum + (l.lineTotal || 0), 0)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.receiptDate) e.receiptDate = 'Required'
    if (!lineItems.length || !lineItems[0].itemDescription.trim()) {
      e.lineItems = 'At least one line item is required'
    }
    lineItems.forEach((l, i) => {
      if (!l.itemDescription.trim()) e[`line_${i}`] = 'Description required'
      if (l.receivedQty <= 0) e[`lineQty_${i}`] = 'Received qty must be > 0'
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      ...form,
      purchaseOrderId: form.purchaseOrderId || undefined,
      vendorId: form.vendorId || undefined,
      warehouseId: form.warehouseId || undefined,
      lineItems: lineItems.map(l => ({
        itemDescription: l.itemDescription,
        orderedQty: Number(l.orderedQty),
        receivedQty: Number(l.receivedQty),
        rejectedQty: Number(l.rejectedQty),
        unit: l.unit,
        unitPrice: Number(l.unitPrice),
        lineTotal: Number(l.lineTotal),
      })),
      totalAmount,
      organizationId: orgId,
    }

    if (editing) {
      const { organizationId: _org, purchaseOrderId: _po, purchaseOrderNumber: _poNum, ...updateInput } = input as any
      updateMRN({ variables: { id: editing, input: updateInput } })
    } else {
      createMRN({ variables: { input } })
    }
  }

  const handleEdit = (mrn: any) => {
    setForm({
      purchaseOrderId: mrn.purchaseOrderId || '',
      purchaseOrderNumber: mrn.purchaseOrderNumber || '',
      vendorId: mrn.vendorId || '',
      vendorName: mrn.vendorName || '',
      receiptDate: mrn.receiptDate ? mrn.receiptDate.split('T')[0] : '',
      warehouseId: mrn.warehouseId || '',
      warehouseName: mrn.warehouseName || '',
      notes: mrn.notes || '',
    })
    setLineItems(
      mrn.lineItems?.length
        ? mrn.lineItems.map((l: any) => ({
            itemDescription: l.itemDescription,
            orderedQty: l.orderedQty,
            receivedQty: l.receivedQty,
            rejectedQty: l.rejectedQty || 0,
            unit: l.unit || '',
            unitPrice: l.unitPrice,
            lineTotal: l.lineTotal,
          }))
        : [{ ...EMPTY_LINE }],
    )
    setEditing(mrn.id)
    setAdding(true)
  }

  const handleCancel = (id: string) => {
    if (confirm('Cancel this Material Receipt?')) {
      cancelMRN({ variables: { id } })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this Material Receipt?')) {
      deleteMRN({ variables: { id } })
    }
  }

  const mrns = data?.materialreceipts ?? []
  const vendors = (vendorData?.vendors ?? []).filter((v: any) => {
    const ap = v.orgApprovalStatus ?? 'approved'
    return ap === 'approved'
  })
  const purchaseOrders = poData?.purchaseorders ?? []
  const warehouses = warehouseData?.warehouses ?? []

  const stats = {
    total: mrns.length,
    draft: mrns.filter((m: any) => m.status === 'draft').length,
    confirmed: mrns.filter((m: any) => m.status === 'confirmed').length,
    pending: mrns.filter((m: any) => m.status === 'submitted').length,
  }

  const columns: Column[] = [
    {
      key: 'mrnNumber',
      label: 'MRN #',
      width: '160px',
      render: v => <span className="font-mono text-xs text-gray-600">{v}</span>,
    },
    {
      key: 'purchaseOrderNumber',
      label: 'PO Ref',
      width: '120px',
      render: v => <span className="text-gray-600">{v || '—'}</span>,
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      render: v => <span className="font-medium">{v || '—'}</span>,
    },
    {
      key: 'receiptDate',
      label: 'Receipt Date',
      width: '120px',
      render: v => (v ? formatDate(v) : '—'),
    },
    {
      key: 'warehouseName',
      label: 'Warehouse',
      width: '140px',
      render: v => <span className="text-gray-600">{v || '—'}</span>,
    },
    {
      key: 'lineItems',
      label: 'Items',
      width: '90px',
      render: v => (
        <span className="text-gray-600">{Array.isArray(v) ? `${v.length} item(s)` : '—'}</span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total',
      width: '110px',
      render: v => (
        <span className="font-medium">
          {typeof v === 'number' ? formatMoney(v) : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: v => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STATUS_STYLES[String(v)] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
        >
          {v}
        </span>
      ),
    },
    {
      key: '_orgApproval',
      label: 'Org approval',
      width: '168px',
      render: (_v, row: any) => {
        const st = String(row.status || '')
        const showSubmit = st === 'draft' || st === 'approval_declined'
        return (
          <div className="flex flex-col gap-1 min-w-[140px]">
            {showSubmit ? (
              <CellSelect
                aria-label="Material receipt approval action"
                defaultValue=""
                onChange={(e) => {
                  const val = e.target.value
                  e.target.value = ''
                  if (val === 'submit') void submitMRNForApproval({ variables: { id: row.id } })
                }}
                options={[
                  { value: '', label: 'Change status…' },
                  { value: 'submit', label: 'Send for approval' },
                ]}
              />
            ) : (
              <span className="text-xs text-gray-400">—</span>
            )}
          </div>
        )
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '110px',
      render: v => (v ? formatDate(v) : '—'),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Material Receipts</h1>
        <p className="text-gray-500">Record and manage goods received from vendors against purchase orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total MRNs', value: stats.total, icon: Package, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Draft', value: stats.draft, icon: Clock, cls: 'text-yellow-600 bg-yellow-50' },
          { label: 'Pending approval', value: stats.pending, icon: Send, cls: 'text-sky-600 bg-sky-50' },
          { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
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

      {/* Inline create/edit form */}
      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">
              {editing ? 'Edit Material Receipt' : 'New Material Receipt'}
            </span>
            <button onClick={closeForm} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Header fields */}
            <div className="grid grid-cols-4 gap-3">
              <SelectFloating
                label="Purchase Order"
                value={form.purchaseOrderId}
                onChange={e =>
                  handlePOChange(typeof e === 'string' ? e : e.target.value)
                }
                options={[
                  { value: '', label: 'Select PO (optional)' },
                  ...purchaseOrders
                    .filter((po: any) => !['cancelled', 'received'].includes(po.status))
                    .map((po: any) => ({
                      value: po.id,
                      label: `${po.seqNo || po.id} — ${po.vendorName || ''} (${po.status})`,
                    })),
                ]}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Vendor"
                value={form.vendorId}
                onChange={e =>
                  handleVendorChange(typeof e === 'string' ? e : e.target.value)
                }
                options={[
                  { value: '', label: 'Select vendor' },
                  ...vendors.map((v: any) => ({ value: v.id, label: v.name })),
                ]}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Receipt Date *"
                type="date"
                value={form.receiptDate}
                onChange={e => setF('receiptDate', e.target.value)}
                error={errors.receiptDate}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Warehouse"
                value={form.warehouseId}
                onChange={e =>
                  handleWarehouseChange(typeof e === 'string' ? e : e.target.value)
                }
                options={[
                  { value: '', label: 'Select warehouse' },
                  ...warehouses.map((w: any) => ({
                    value: w.id,
                    label: w.warehouseName,
                  })),
                ]}
                className="h-7 text-xs"
              />
            </div>

            {/* Line Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Line Items
                </p>
                {errors.lineItems && (
                  <p className="text-xs text-red-500">{errors.lineItems}</p>
                )}
              </div>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-2 font-medium text-gray-600">Description *</th>
                      <th className="text-right p-2 font-medium text-gray-600 w-24">Ordered</th>
                      <th className="text-right p-2 font-medium text-gray-600 w-24">Received *</th>
                      <th className="text-right p-2 font-medium text-gray-600 w-24">Rejected</th>
                      <th className="text-left p-2 font-medium text-gray-600 w-20">Unit</th>
                      <th className="text-right p-2 font-medium text-gray-600 w-24">Unit Price</th>
                      <th className="text-right p-2 font-medium text-gray-600 w-28">Line Total</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((line, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="p-1">
                          <CellInput
                            invalid={!!errors[`line_${idx}`]}
                            placeholder="Item description"
                            value={line.itemDescription}
                            onChange={e => updateLineItem(idx, 'itemDescription', e.target.value)}
                          />
                        </td>
                        <td className="p-1">
                          <CellInput
                            type="number"
                            min="0"
                            className="text-right"
                            value={line.orderedQty}
                            onChange={e => updateLineItem(idx, 'orderedQty', Number(e.target.value))}
                          />
                        </td>
                        <td className="p-1">
                          <CellInput
                            type="number"
                            min="0"
                            className="text-right"
                            invalid={!!errors[`lineQty_${idx}`]}
                            value={line.receivedQty}
                            onChange={e => updateLineItem(idx, 'receivedQty', Number(e.target.value))}
                          />
                        </td>
                        <td className="p-1">
                          <CellInput
                            type="number"
                            min="0"
                            className="text-right"
                            value={line.rejectedQty}
                            onChange={e => updateLineItem(idx, 'rejectedQty', Number(e.target.value))}
                          />
                        </td>
                        <td className="p-1">
                          <CellInput
                            placeholder="pcs"
                            value={line.unit}
                            onChange={e => updateLineItem(idx, 'unit', e.target.value)}
                          />
                        </td>
                        <td className="p-1">
                          <CellInput
                            type="number"
                            min="0"
                            className="text-right"
                            value={line.unitPrice}
                            onChange={e => updateLineItem(idx, 'unitPrice', Number(e.target.value))}
                          />
                        </td>
                        <td className="p-1">
                          <CellInput
                            type="number"
                            readOnly
                            className="text-right bg-gray-50 text-gray-700"
                            value={line.lineTotal.toFixed(2)}
                          />
                        </td>
                        <td className="p-1 text-center">
                          {lineItems.length > 1 && (
                            <button
                              onClick={() => removeLine(idx)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={addLine}
                className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-3.5 w-3.5" /> Add Line
              </button>
            </div>

            {/* Total + Notes */}
            <div className="grid grid-cols-4 gap-3 items-end">
              <div className="col-span-3">
                <InputFloating
                  label="Notes"
                  multiline
                  rows={2}
                  value={form.notes}
                  onChange={e => setF('notes', e.target.value)}
                  className="text-xs min-h-[50px]"
                />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatMoney(totalAmount)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1 border-t">
              <Button variant="outline" size="sm" onClick={closeForm} className="h-8 text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={saving || updating}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {saving || updating ? 'Saving…' : editing ? 'Update MRN' : 'Save MRN'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={mrns}
        columns={columns}
        loading={loading}
        title="All Material Receipts"
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New MRN"
        searchable
        searchPlaceholder="Search MRNs…"
        emptyMessage="No material receipts yet. Click 'New MRN' to record received goods."
        onRowClick={handleEdit}
        actions={[
          {
            label: 'Edit',
            icon: <Edit className="h-3.5 w-3.5" />,
            onClick: row => handleEdit(row),
            variant: 'ghost',
            show: (row: any) => row.status === 'draft' || row.status === 'approval_declined',
          },
          {
            label: 'Cancel',
            icon: <Ban className="h-3.5 w-3.5" />,
            onClick: row => handleCancel(row.id),
            variant: 'ghost',
            show: (row: any) =>
              row.status !== 'cancelled' && row.status !== 'submitted' && row.status !== 'confirmed',
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: row => handleDelete(row.id),
            variant: 'ghost',
          },
        ]}
      />
    </div>
  )
}
