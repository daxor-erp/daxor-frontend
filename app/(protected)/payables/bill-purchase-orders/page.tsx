'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { GET_PURCHASE_ORDERS_FOR_BILLING, BILL_PURCHASE_ORDER, GET_VENDOR_BILLS } from '@/gql/queries'
import { FileText, X, Save, AlertCircle, CheckCircle } from 'lucide-react'

export default function BillPurchaseOrdersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [billingPO, setBillingPO] = useState<any>(null)
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')

  const { data: poData, loading } = useQuery(GET_PURCHASE_ORDERS_FOR_BILLING, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: billsData } = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
  })

  const [billPO, { loading: saving }] = useMutation(BILL_PURCHASE_ORDER, {
    onCompleted: (data) => {
      setSuccess(`Bill ${data.billPurchaseOrder.billNumber} created successfully for $${Number(data.billPurchaseOrder.totalAmount).toFixed(2)}`)
      setBillingPO(null)
      setDueDate('')
      setErrors({})
    },
    onError: err => setErrors({ submit: err.message }),
  })

  // POs that already have a bill
  const billedPOIds = new Set(
    (billsData?.vendorBills ?? [])
      .filter((b: any) => b.purchaseOrderId)
      .map((b: any) => b.purchaseOrderId)
  )

  const pos = (poData?.purchaseorders ?? []).filter(
    (po: any) => !['draft', 'submitted'].includes(po.status)
  )

  const handleBill = () => {
    const e: Record<string, string> = {}
    if (!billDate) e.billDate = 'Required'
    if (!dueDate) e.dueDate = 'Required'
    setErrors(e)
    if (Object.keys(e).length) return

    billPO({ variables: { id: billingPO.id, billDate, dueDate } })
  }

  const statusColor: Record<string, string> = {
    approved: 'bg-blue-50 text-blue-700 border-blue-200',
    received: 'bg-green-50 text-green-700 border-green-200',
    sent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'PO #', width: '130px', render: v => <span className="font-mono text-xs text-gray-600">{v || '—'}</span> },
    { key: 'vendorName', label: 'Vendor', render: v => <span className="font-medium">{v || '—'}</span> },
    { key: 'projectName', label: 'Project', render: v => <span className="text-gray-600">{v || '—'}</span> },
    { key: 'orderDate', label: 'Order Date', width: '110px', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'totalAmount', label: 'PO Amount', width: '110px', align: 'right', render: v => <span className="font-bold">${Number(v || 0).toFixed(2)}</span> },
    {
      key: 'status', label: 'PO Status', width: '110px',
      render: v => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColor[v] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{v}</span>
    },
    {
      key: 'id', label: 'Billed', width: '90px',
      render: (v) => billedPOIds.has(v)
        ? <span className="inline-flex items-center gap-1 text-xs text-green-600"><CheckCircle className="h-3.5 w-3.5" /> Yes</span>
        : <span className="text-xs text-gray-400">No</span>
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bill Purchase Orders</h1>
        <p className="text-gray-500">Convert approved or received purchase orders into vendor bills</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">How this works</p>
          <p className="text-xs mt-1">Select an approved or received PO and click "Create Bill". A vendor bill is automatically created from the PO line items and linked to the PO for tracking.</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-sm text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          {success}
          <button onClick={() => setSuccess('')} className="ml-auto text-green-600 hover:text-green-800"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Bill creation form */}
      {billingPO && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">Create Bill from PO: {billingPO.seqNo}</span>
            <button onClick={() => { setBillingPO(null); setErrors({}) }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded p-3 text-xs">
              <div><span className="text-gray-400">PO Number</span><p className="font-bold">{billingPO.seqNo}</p></div>
              <div><span className="text-gray-400">Vendor</span><p className="font-bold text-blue-700">{billingPO.vendorName || '—'}</p></div>
              <div><span className="text-gray-400">PO Amount</span><p className="font-bold">${Number(billingPO.totalAmount || 0).toFixed(2)}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Bill Date *" type="date" value={billDate} onChange={e => setBillDate(e.target.value)} error={errors.billDate} className="h-7 text-xs" />
              <InputFloating label="Due Date *" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} error={errors.dueDate} className="h-7 text-xs" />
            </div>
            {errors.submit && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{errors.submit}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setBillingPO(null); setErrors({}) }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleBill} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Creating…' : 'Create Bill'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={pos}
        columns={columns}
        loading={loading}
        title="Purchase Orders Ready to Bill"
        searchable
        emptyMessage="No approved or received POs available. Approve a PO first from Purchases → Enter Purchase Orders."
        actions={[
          {
            label: 'Create Bill',
            icon: <FileText className="h-3.5 w-3.5" />,
            onClick: row => {
              if (billedPOIds.has(row.id)) {
                alert('This PO already has a bill created.')
                return
              }
              if (!row.vendorId) {
                alert('This PO has no vendor assigned. Add a vendor before billing.')
                return
              }
              setBillingPO(row)
              setSuccess('')
            },
            variant: 'ghost',
          },
        ]}
      />
    </div>
  )
}
