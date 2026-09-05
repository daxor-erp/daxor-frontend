'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { GET_PURCHASE_ORDERS_FOR_BILLING, BILL_PURCHASE_ORDER } from '@/gql/queries'
import { FileText, X, Save, AlertCircle, CheckCircle, Package, Clock } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'

export default function BillPurchaseOrdersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [billingPO, setBillingPO] = useState<any>(null)
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')

  const { data: poData, loading, refetch } = useQuery(GET_PURCHASE_ORDERS_FOR_BILLING, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [billPO, { loading: saving }] = useMutation(BILL_PURCHASE_ORDER, {
    onCompleted: (data) => {
      setSuccess(`Bill ${data.billPurchaseOrder.billNumber} created successfully for ${formatMoney(data.billPurchaseOrder.totalAmount)}`)
      setBillingPO(null)
      setDueDate('')
      setErrors({})
      refetch()
    },
    onError: err => setErrors({ submit: err.message }),
  })

  const billingStatusMap = Object.fromEntries(
    (poData?.purchaseorders ?? []).map((po: any) => [po.id, po.billingStatus])
  )

  const BILLABLE_STATUSES = new Set(['purchase_order', 'sent', 'received', 'partially_received', 'partially_billed'])
  const pos = (poData?.purchaseorders ?? []).filter(
    (po: any) => BILLABLE_STATUSES.has(po.status)
  )

  const stats = {
    total: pos.length,
    ready: pos.filter((p: any) => p.billingStatus !== 'billed').length,
    billed: pos.filter((p: any) => p.billingStatus === 'billed').length,
  }

  const startBilling = (row: any) => {
    if (row.billingStatus === 'billed') {
      alert('This PO has already been fully billed.')
      return
    }
    if (!row.vendorId) {
      alert('This PO has no vendor assigned. Add a vendor before billing.')
      return
    }
    setBillingPO(row)
    setSuccess('')
  }

  const handleBill = () => {
    const e: Record<string, string> = {}
    if (!billDate) e.billDate = 'Required'
    if (!dueDate) e.dueDate = 'Required'
    setErrors(e)
    if (Object.keys(e).length) return

    billPO({ variables: { id: billingPO.id, billDate, dueDate } })
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'PO #', width: '140px', render: v => <MonoCell value={v} /> },
    { key: 'vendorName', label: 'Vendor', render: v => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'orderDate', label: 'Order Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'totalAmount', label: 'PO Amount', width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'status', label: 'PO Status', width: '130px', render: v => <ErpBadge status={v} /> },
    {
      key: 'id',
      label: 'Billing',
      width: '130px',
      render: (v) => {
        const status = billingStatusMap[v]
        if (status === 'billed') return <ErpBadge status="paid" label="Fully billed" />
        if (status === 'partially_billed') return <ErpBadge status="partially_paid" label="Partial" />
        return <span className="text-xs text-muted-foreground">Not billed</span>
      },
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Bill Purchase Orders"
        subtitle="Convert approved or received purchase orders into vendor bills"
        icon={<FileText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Payables' }, { label: 'Bill Purchase Orders' }]}
      />

      <StatsRow cols={3}>
        <StatCard label="Billable POs" value={stats.total} icon={<Package className="h-5 w-5" />} variant="slate" />
        <StatCard label="Ready to Bill" value={stats.ready} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Fully Billed" value={stats.billed} icon={<CheckCircle className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-primary">
          <p className="font-medium">How this works</p>
          <p className="text-xs mt-1">Select an approved or received PO and click Create Bill. A vendor bill is automatically created from the PO line items and linked to the PO for tracking.</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-sm text-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          {success}
          <button onClick={() => setSuccess('')} className="ml-auto text-green-600 hover:text-green-800"><X className="h-4 w-4" /></button>
        </div>
      )}

      {billingPO && (
        <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">Create Bill from PO: {billingPO.seqNo}</span>
            <button onClick={() => { setBillingPO(null); setErrors({}) }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded p-3 text-xs">
              <div><span className="text-gray-400">PO Number</span><p className="font-bold">{billingPO.seqNo}</p></div>
              <div><span className="text-gray-400">Vendor</span><p className="font-bold text-primary">{billingPO.vendorName || '—'}</p></div>
              <div><span className="text-gray-400">PO Amount</span><p className="font-bold">{formatMoney(billingPO.totalAmount || 0)}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Bill Date *" type="date" value={billDate} onChange={e => setBillDate(e.target.value)} error={errors.billDate} className="h-7 text-xs" />
              <InputFloating label="Due Date *" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} error={errors.dueDate} className="h-7 text-xs" />
            </div>
            {errors.submit && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{errors.submit}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setBillingPO(null); setErrors({}) }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleBill} disabled={saving} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
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
        title="All Purchase Orders Ready to Bill"
        searchable
        searchPlaceholder="Search purchase orders…"
        emptyMessage="No approved or received POs available. Approve a PO first from Purchases → Enter Purchase Orders."
        pageSize={25}
        onRowClick={(r: any) => { if (r.billingStatus !== 'billed') startBilling(r) }}
        isRowClickable={(r: any) => r.billingStatus !== 'billed'}
        actions={[
          {
            label: 'Create Bill',
            icon: <FileText className="h-3.5 w-3.5" />,
            onClick: (row: any) => startBilling(row),
            show: (row: any) => row.billingStatus !== 'billed',
          },
        ]}
      />
    </div>
  )
}
