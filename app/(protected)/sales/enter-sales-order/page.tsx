'use client'

import { useState } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bell, Settings, User, Search, ChevronDown, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

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
      clientId {
        id
        name
        email
      }
    }
  }
`

const CREATE_SALES_ORDER = gql`
  mutation CreateSalesOrder($input: CreateSalesOrderInput!) {
    createSalesOrder(input: $input) {
      id
      seqNo
      status
      quotationId
      customerId
      totalAmount
    }
  }
`

const GET_SALES_ORDERS = gql`
  query GetSalesOrdersForEntry($organizationId: ID!, $page: Int, $limit: Int) {
    salesorders(organizationId: $organizationId, page: $page, limit: $limit) {
      id
      seqNo
      quotationId
      quotationStatus
      customerId
      projectId
      totalAmount
      status
      orderDate
      organizationId
      createdAt
    }
  }
`

const today = () => new Date().toISOString().split('T')[0]

export default function EnterSalesOrderPage() {
  const [showProfile, setShowProfile] = useState(false)
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
    variables: { organizationId: orgId, page: 1, limit: 200 },
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

  const mapStatus = (status: string) => {
    if (status === 'accepted' || status === 'rejected') return status
    if (status === 'pending' || status === 'sent') return 'pending'
    return 'other'
  }

  const allQuotations = data?.quotations ?? []
  const orders = orderData?.salesorders ?? []
  const filteredQuotations = allQuotations.filter((q: any) => mapStatus(q.status) === formData.quotationStatus)
  const selectedQuotation = filteredQuotations.find((q: any) => q.id === formData.quotationId)

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
    if (!selectedQuotation?.clientId?.id) {
      setErrorMsg('Selected quotation does not have a valid client.')
      return
    }
    await createSalesOrder({
      variables: {
        input: {
          customerId: selectedQuotation.clientId.id,
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
        customerId: q?.clientId?.id || '',
        totalAmount: q?.totalAmount != null ? String(q.totalAmount) : '',
      }))
    }
  }

  return (
    <div className="flex-1 bg-gray-50 h-screen overflow-y-auto">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="text-lg font-semibold text-gray-800">
            Welcome, <span className="text-blue-600">{user?.firstName || 'User'}</span>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center max-w-2xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors">My Profile</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors">Account Settings</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors">Preferences</button>
                <hr className="my-1" />
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors text-red-600">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Enter Sales Order</h1>
          <p className="text-sm text-gray-500">Create sales order from accepted quotation</p>
        </div>
        {successMsg && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {errorMsg}
          </div>
        )}

        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
            <span className="text-sm font-semibold text-gray-700">Sales Order Entry</span>
          </div>

          <form onSubmit={handleSubmit} className="p-2 space-y-3">
            <div className="border border-gray-300 rounded overflow-x-auto">
              <div className="grid bg-[#f0f0f0] border-b border-gray-300" style={{ gridTemplateColumns: '11rem 18rem 14rem 10rem 11rem 11rem 12rem' }}>
                {['Quotation Status', 'Quotation', 'Customer ID', 'Project ID', 'Total Amount', 'Order Date', 'Organization ID'].map((h, i) => (
                  <div key={i} className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</div>
                ))}
              </div>

              <div className="grid min-w-[87rem]" style={{ gridTemplateColumns: '11rem 18rem 14rem 10rem 11rem 11rem 12rem' }}>
                <div className="border-r border-gray-200 px-1 py-1">
                  <select
                    id="quotationStatus"
                    name="quotationStatus"
                    value={formData.quotationStatus}
                    onChange={handleChange}
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="border-r border-gray-200 px-1 py-1">
                  <select
                    id="quotationId"
                    name="quotationId"
                    value={formData.quotationId}
                    onChange={handleChange}
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-blue-400"
                    required
                  >
                    <option value="">
                      {quotationLoading ? 'Loading...' : `Select ${formData.quotationStatus}`}
                    </option>
                    {filteredQuotations.map((q: any) => (
                      <option key={q.id} value={q.id}>
                        {q.quotationNumber} - ${Number(q.totalAmount || 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-r border-gray-200 px-1 py-1">
                  <input
                    id="customerId"
                    name="customerId"
                    type="text"
                    value={formData.customerId}
                    readOnly
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-gray-50 text-gray-700"
                  />
                </div>

                <div className="border-r border-gray-200 px-1 py-1">
                  <input
                    id="projectId"
                    name="projectId"
                    type="text"
                    value={formData.projectId}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>

                <div className="border-r border-gray-200 px-1 py-1">
                  <input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    step="0.01"
                    value={formData.totalAmount}
                    readOnly
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-gray-50 text-gray-700"
                  />
                </div>

                <div className="border-r border-gray-200 px-1 py-1">
                  <input
                    id="orderDate"
                    name="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={handleChange}
                    required
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>

                <div className="px-1 py-1">
                  <input
                    id="organizationId"
                    name="organizationId"
                    type="text"
                    value={formData.organizationId}
                    readOnly
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={saving}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                {saving ? 'Creating...' : 'Create Sales Order'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => setFormData({
                  quotationStatus: 'pending',
                  quotationId: '',
                  customerId: '',
                  projectId: '',
                  totalAmount: '',
                  orderDate: today(),
                  organizationId: orgId
                })}
              >
                Reset
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm mt-4">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
            <span className="text-sm font-semibold text-gray-700">Created Sales Orders</span>
            <span className="text-xs text-gray-500">{orders.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-xs">
              <thead>
                <tr className="bg-[#f0f0f0] border-b border-gray-300">
                  {['Seq No', 'Quotation ID', 'Quotation Status', 'Customer', 'Project', 'Amount', 'Order Date', 'Status', 'Organization'].map((h) => (
                    <th key={h} className="text-left px-3 py-2 font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordersLoading ? (
                  <tr>
                    <td className="px-3 py-3 text-gray-500" colSpan={9}>Loading sales orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-gray-500" colSpan={9}>No sales orders created yet.</td>
                  </tr>
                ) : (
                  orders.map((order: any, idx: number) => (
                    <tr key={order.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-3 py-2 border-r border-gray-200">{order.seqNo || '—'}</td>
                      <td className="px-3 py-2 border-r border-gray-200 font-mono text-[11px]">{order.quotationId || '—'}</td>
                      <td className="px-3 py-2 border-r border-gray-200">{order.quotationStatus || '—'}</td>
                      <td className="px-3 py-2 border-r border-gray-200 font-mono text-[11px]">{order.customerId || '—'}</td>
                      <td className="px-3 py-2 border-r border-gray-200 font-mono text-[11px]">{order.projectId || '—'}</td>
                      <td className="px-3 py-2 border-r border-gray-200">${Number(order.totalAmount || 0).toFixed(2)}</td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">{order.status || '—'}</td>
                      <td className="px-3 py-2">{order.organizationId || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
