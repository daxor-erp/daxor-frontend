'use client'

import { useState } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Send, ShoppingCart, FileText, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { CREATE_SALES_ORDER, GET_SALES_ORDERS, SUBMIT_SALES_ORDER } from '@/gql/queries'
import { formatMoney } from '@/lib/format-money'
import { quotationPartyId } from '@/lib/sales-customer-options'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'

const GET_QUOTATIONS = gql`
  query GetQuotationsForSalesOrder($organizationId: ID) {
    quotations(organizationId: $organizationId) {
      id
      quotationNumber
      subject
      status
      quotationDate
      validUntil
      totalAmount
      customerId {
        id
        name
        email
        docNumber
      }
    }
  }
`

const today = () => new Date().toISOString().split('T')[0]

export default function EnterSalesOrderPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [formData, setFormData] = useState({
    quotationStatus: 'pending',
    quotationId: '',
    customerId: '',
    projectId: '',
    totalAmount: '',
    orderDate: today(),
    organizationId: orgId,
  })
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { data, loading: quotationLoading } = useQuery(GET_QUOTATIONS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })
  const { data: orderData, loading: ordersLoading, refetch: refetchOrders } = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200, cashSale: false },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createSalesOrder, { loading: saving }] = useMutation(CREATE_SALES_ORDER, {
    onCompleted: (res) => {
      setSuccessMsg(`Sales Order "${res.createSalesOrder.seqNo || res.createSalesOrder.id}" created successfully.`)
      setErrorMsg('')
      setFormData({
        quotationStatus: 'pending',
        quotationId: '',
        customerId: '',
        projectId: '',
        totalAmount: '',
        orderDate: today(),
        organizationId: orgId,
      })
      refetchOrders()
      setTimeout(() => setSuccessMsg(''), 6000)
    },
    onError: (err) => setErrorMsg(err.message),
  })

  const [submitSalesOrder, { loading: submittingOrder }] = useMutation(SUBMIT_SALES_ORDER, {
    onCompleted: () => refetchOrders(),
    onError: (e) => alert(e.message),
  })

  const mapStatus = (status: string) => {
    if (status === 'accepted' || status === 'rejected') return status
    if (status === 'pending' || status === 'sent') return 'pending'
    return 'other'
  }

  const allQuotations = data?.quotations ?? []
  const orders = orderData?.salesorders ?? []
  const filteredQuotations = allQuotations.filter((q: any) => mapStatus(q.status) === formData.quotationStatus)
  const selectedQuotation = filteredQuotations.find((q: any) => q.id === formData.quotationId)

  const stats = {
    total: orders.length,
    draft: orders.filter((o: any) => String(o.status).toLowerCase() === 'draft').length,
    pending: orders.filter((o: any) => String(o.status).toLowerCase() === 'submitted').length,
    approved: orders.filter((o: any) => ['approved', 'active'].includes(String(o.status).toLowerCase())).length,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!formData.quotationId) {
      setErrorMsg('Please select a quotation.')
      return
    }
    if (formData.quotationStatus !== 'accepted') {
      setErrorMsg('Sales Order can be created only for accepted quotations.')
      return
    }
    const partyId = selectedQuotation ? quotationPartyId(selectedQuotation) : ''
    if (!partyId) {
      setErrorMsg('Selected quotation does not have a valid customer.')
      return
    }
    await createSalesOrder({
      variables: {
        input: {
          customerId: partyId,
          projectId: formData.projectId || undefined,
          quotationId: selectedQuotation.id,
          quotationStatus: formData.quotationStatus,
          totalAmount: Number(formData.totalAmount || selectedQuotation.totalAmount || 0),
          orderDate: formData.orderDate,
          organizationId: formData.organizationId,
        },
      },
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (name === 'quotationStatus') {
      setFormData((prev) => ({
        ...prev,
        quotationStatus: value,
        quotationId: '',
        customerId: '',
        totalAmount: '',
      }))
    }
    if (name === 'quotationId') {
      const q = filteredQuotations.find((x: any) => x.id === value)
      setFormData((prev) => ({
        ...prev,
        quotationId: value,
        customerId: quotationPartyId(q),
        totalAmount: q?.totalAmount != null ? String(q.totalAmount) : '',
      }))
    }
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Seq No', width: '100px', render: (v) => <MonoCell value={v} /> },
    { key: 'quotationId', label: 'Quotation', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'quotationStatus', label: 'Quotation Status', width: '120px', render: (v) => <span className="text-sm capitalize">{v || '—'}</span> },
    { key: 'customerId', label: 'Customer', render: (v) => <MonoCell value={v} /> },
    { key: 'projectId', label: 'Project', width: '120px', render: (v) => <MonoCell value={v} /> },
    { key: 'totalAmount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'orderDate', label: 'Order Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'status', label: 'Status', width: '130px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Enter Sales Order"
        subtitle="Create a sales order from an accepted quotation"
        icon={<ShoppingCart className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Enter Sales Order' }]}
      />

      <StatsRow cols={4}>
        <StatCard label="Total Orders" value={stats.total} icon={<FileText className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={stats.draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Pending Approval" value={stats.pending} icon={<Send className="h-5 w-5" />} variant="blue" />
        <StatCard label="Approved / Active" value={stats.approved} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </StatsRow>

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
          <span className="text-sm font-semibold">Sales Order Entry</span>
        </div>

        <form onSubmit={handleSubmit} className="p-2 space-y-3">
          <div className="border border-border rounded overflow-x-auto">
            <div className="grid bg-muted/70 border-b border-border" style={{ gridTemplateColumns: '11rem 18rem 14rem 10rem 11rem 11rem 12rem' }}>
              {['Quotation Status', 'Quotation', 'Customer ID', 'Project ID', 'Total Amount', 'Order Date', 'Organization ID'].map((h, i) => (
                <div key={i} className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-r border-border last:border-r-0">{h}</div>
              ))}
            </div>

            <div className="grid min-w-[87rem]" style={{ gridTemplateColumns: '11rem 18rem 14rem 10rem 11rem 11rem 12rem' }}>
              <div className="border-r border-border px-1 py-1">
                <select
                  id="quotationStatus"
                  name="quotationStatus"
                  value={formData.quotationStatus}
                  onChange={handleChange}
                  className="w-full h-8 px-2 border border-border rounded text-xs bg-background outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="border-r border-border px-1 py-1">
                <select
                  id="quotationId"
                  name="quotationId"
                  value={formData.quotationId}
                  onChange={handleChange}
                  className="w-full h-8 px-2 border border-border rounded text-xs bg-background outline-none focus:ring-1 focus:ring-primary"
                  required
                >
                  <option value="">
                    {quotationLoading ? 'Loading...' : `Select ${formData.quotationStatus}`}
                  </option>
                  {filteredQuotations.map((q: any) => (
                    <option key={q.id} value={q.id}>
                      {q.quotationNumber} - {formatMoney(q.totalAmount || 0)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-r border-border px-1 py-1">
                <input
                  id="customerId"
                  name="customerId"
                  type="text"
                  value={formData.customerId}
                  readOnly
                  className="w-full h-8 px-2 border border-border rounded text-xs bg-muted text-muted-foreground"
                />
              </div>

              <div className="border-r border-border px-1 py-1">
                <input
                  id="projectId"
                  name="projectId"
                  type="text"
                  value={formData.projectId}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full h-8 px-2 border border-border rounded text-xs bg-background outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="border-r border-border px-1 py-1">
                <input
                  id="totalAmount"
                  name="totalAmount"
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  readOnly
                  className="w-full h-8 px-2 border border-border rounded text-xs bg-muted text-muted-foreground"
                />
              </div>

              <div className="border-r border-border px-1 py-1">
                <input
                  id="orderDate"
                  name="orderDate"
                  type="date"
                  value={formData.orderDate}
                  onChange={handleChange}
                  required
                  className="w-full h-8 px-2 border border-border rounded text-xs bg-background outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="px-1 py-1">
                <input
                  id="organizationId"
                  name="organizationId"
                  type="text"
                  value={formData.organizationId}
                  readOnly
                  className="w-full h-8 px-2 border border-border rounded text-xs bg-muted text-muted-foreground"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={saving}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-4"
            >
              {saving ? 'Creating...' : 'Create Sales Order'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFormData({
                quotationStatus: 'pending',
                quotationId: '',
                customerId: '',
                projectId: '',
                totalAmount: '',
                orderDate: today(),
                organizationId: orgId,
              })}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        loading={ordersLoading}
        title="All Sales Orders"
        description="New orders start as Draft. Use Send for approval to route to the Sales approver."
        searchable
        searchPlaceholder="Search sales orders…"
        emptyMessage="No sales orders created yet."
        pageSize={25}
        actions={[
          {
            label: 'Send for approval',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (order: any) => submitSalesOrder({ variables: { id: order.id } }),
            show: (order: any) =>
              !order.cashSale && ['draft', 'rejected'].includes(String(order.status).toLowerCase()),
            disabled: submittingOrder,
          },
        ]}
      />
    </div>
  )
}
