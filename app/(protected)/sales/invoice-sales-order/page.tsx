'use client'

import { useQuery } from '@apollo/client'
import { GET_CUSTOMER_INVOICES } from '@/gql/queries'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import {
  GET_CUSTOMERS_FOR_SALES,
  mapSalesCustomers,
  customerDisplayName,
} from '@/lib/sales-customer-options'

const INV_STATUS: Record<string, { label: string; className: string }> = {
  draft:          { label: 'Draft', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  approved:       { label: 'Approved', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  sent:           { label: 'Sent', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  partially_paid: { label: 'Partially Paid', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  paid:           { label: 'Paid', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  overdue:        { label: 'Overdue', className: 'bg-red-50 text-red-700 border-red-200' },
  cancelled:      { label: 'Cancelled', className: 'bg-rose-50 text-rose-600 border-rose-200' },
}

export default function InvoiceSalesOrderPage() {
  const { user } = useAuth()
  const organizationId = user?.organizationId || ''

  const { data: invData, loading: invLoading } = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId, page: 1, limit: 200 },
    skip: !organizationId,
  })
  const { data: customersData } = useQuery(GET_CUSTOMERS_FOR_SALES, {
    variables: { organizationId },
    skip: !organizationId,
  })
  const invoices = invData?.customerinvoices ?? []
  const customers = mapSalesCustomers(customersData?.customers)
  const getCustomerDisplay = (id: string) => customerDisplayName(customers, id)
  const formatDate = (value: string | null | undefined) => {
    if (!value) return '—'
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
  }

  const stats = {
    invoices: invoices.length,
    draft: invoices.filter((i: any) => i.status === 'draft').length,
    paid: invoices.filter((i: any) => i.status === 'paid').length,
    overdue: invoices.filter((i: any) => i.status === 'overdue').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold">Invoice Sales Order</h1>
          <p className="text-gray-500">View generated sales invoices</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoices', value: stats.invoices, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Draft', value: stats.draft, icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' },
          { label: 'Paid', value: stats.paid, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${bg} p-2 rounded-lg`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-800">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border">
        <CardHeader className="py-4 px-6 border-b">
          <CardTitle className="text-base font-semibold text-gray-800">Sales Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading invoices…</div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No invoices generated yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1300px] w-full text-xs">
                <thead>
                  <tr className="bg-[#f0f0f0] border-b border-gray-300">
                    {['Invoice #', 'Customer', 'Sales Order', 'Invoice Date', 'Due Date', 'Total', 'Paid', 'Status'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv: any, idx: number) => {
                    const s = INV_STATUS[inv.status] ?? INV_STATUS.draft
                    return (
                      <tr key={inv.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-3 py-2 border-r border-gray-200 font-mono">{inv.seqNo || '—'}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{getCustomerDisplay(inv.customerId || inv.clientId)}</td>
                        <td className="px-3 py-2 border-r border-gray-200 font-mono">{inv.salesOrderId || '—'}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{formatDate(inv.invoiceDate)}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{formatDate(inv.dueDate)}</td>
                        <td className="px-3 py-2 border-r border-gray-200 font-semibold">
                          {formatMoney(inv.totalAmount)}
                        </td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          {formatMoney(inv.paidAmount ?? 0)}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${s.className}`}>{s.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
