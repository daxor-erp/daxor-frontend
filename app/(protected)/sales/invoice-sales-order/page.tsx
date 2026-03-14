'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_SALES_ORDERS,
  GET_CUSTOMER_INVOICES,
  CREATE_CUSTOMER_INVOICE,
  GET_ORGANIZATIONS,
  GET_PROJECTS,
  UPDATE_SALES_ORDER,
} from '@/gql/queries'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  FileText, Receipt, CheckCircle2, Clock, AlertCircle,
  ArrowRight, Building2, FolderKanban, CalendarDays, DollarSign,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const SO_STATUS: Record<string, { label: string; className: string }> = {
  draft:     { label: 'Draft',     className: 'bg-gray-100 text-gray-600 border-gray-200' },
  submitted: { label: 'Submitted', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved:  { label: 'Approved',  className: 'bg-blue-50 text-blue-700 border-blue-200' },
  active:    { label: 'Active',    className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border-red-200' },
}

const INV_STATUS: Record<string, { label: string; className: string }> = {
  draft:          { label: 'Draft',    className: 'bg-gray-100 text-gray-600 border-gray-200' },
  approved:       { label: 'Approved', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  sent:           { label: 'Sent',     className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  partially_paid: { label: 'Partial',  className: 'bg-amber-50 text-amber-700 border-amber-200' },
  paid:           { label: 'Paid',     className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  overdue:        { label: 'Overdue',  className: 'bg-red-50 text-red-700 border-red-200' },
  cancelled:      { label: 'Cancelled',className: 'bg-rose-50 text-rose-600 border-rose-200' },
}

const today = () => new Date().toISOString().split('T')[0]

export default function InvoiceSalesOrderPage() {
  const { user } = useAuth()
  const organizationId = user?.organizationId || ''

  // Data fetching
  const { data: soData, loading: soLoading, refetch: refetchSO } = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId, page: 1, limit: 200 },
    skip: !organizationId,
  })
  const { data: invData, loading: invLoading, refetch: refetchInv } = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId, page: 1, limit: 200 },
    skip: !organizationId,
  })
  const { data: orgsData } = useQuery(GET_ORGANIZATIONS, { variables: { page: 1, limit: 200 } })
  const { data: projectsData } = useQuery(GET_PROJECTS, {
    variables: { organizationId, page: 1, limit: 200 },
    skip: !organizationId,
  })

  const [createInvoice, { loading: creating, error: createError }] = useMutation(CREATE_CUSTOMER_INVOICE, {
    onCompleted: () => {
      setSelectedSO(null)
      setInvoiceDate(today())
      setDueDate('')
      setErrors({})
      refetchSO()
      refetchInv()
    },
  })

  const [updateSalesOrder] = useMutation(UPDATE_SALES_ORDER)

  // State
  const [selectedSO, setSelectedSO] = useState<any>(null)
  const [invoiceDate, setInvoiceDate] = useState(today())
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'orders' | 'invoices'>('orders')

  const salesOrders = soData?.salesorders ?? []
  const invoices = invData?.customerinvoices ?? []
  const organizations: any[] = orgsData?.organizations ?? []
  const projects: any[] = projectsData?.projects ?? []

  // Already-invoiced sales order IDs
  const invoicedSOIds = new Set(invoices.map((inv: any) => inv.salesOrderId).filter(Boolean))

  const getOrgName = (id: string) => organizations.find(o => o.id === id)?.name ?? id
  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name ?? id

  const invoiceable = salesOrders.filter((so: any) =>
    ['approved', 'active'].includes(so.status) && !invoicedSOIds.has(so.id)
  )
  const alreadyInvoiced = salesOrders.filter((so: any) => invoicedSOIds.has(so.id))

  const stats = {
    total: salesOrders.length,
    invoiceable: invoiceable.length,
    invoiced: alreadyInvoiced.length,
    invoices: invoices.length,
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!invoiceDate) e.invoiceDate = 'Invoice date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSO || !validate()) return

    await createInvoice({
      variables: {
        input: {
          customerId: selectedSO.customerId,
          salesOrderId: selectedSO.id,
          invoiceDate,
          dueDate: dueDate || undefined,
          totalAmount: selectedSO.totalAmount,
          organizationId,
        },
      },
    })
  }

  return (
    
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold">Invoice Sales Order</h1>
          <p className="text-gray-500">Generate customer invoices from approved sales orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Sales Orders',  value: stats.total,       icon: Receipt,      color: 'text-blue-600',    bg: 'bg-blue-50' },
          { label: 'Ready to Invoice', value: stats.invoiceable, icon: AlertCircle,  color: 'text-amber-600',   bg: 'bg-amber-50' },
          { label: 'Invoiced',      value: stats.invoiced,    icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Invoices',value: stats.invoices,    icon: FileText,     color: 'text-indigo-600',  bg: 'bg-indigo-50' },
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

      {/* Tab switcher */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {(['orders', 'invoices'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'orders' ? 'Sales Orders' : 'Generated Invoices'}
          </button>
        ))}
      </div>

      {/* Sales Orders Table */}
      {activeTab === 'orders' && (
        <Card className="shadow-sm border">
          <CardHeader className="py-4 px-6 border-b">
            <CardTitle className="text-base font-semibold text-gray-800">
              Sales Orders
              {invoiceable.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  {invoiceable.length} ready
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {soLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading sales orders…</div>
            ) : salesOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Receipt className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">No sales orders found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    {['Order #', 'Client', 'Project', 'Order Date', 'Amount', 'Status', 'Action'].map(h => (
                      <TableHead key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wide first:pl-6">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesOrders.map((so: any) => {
                    const s = SO_STATUS[so.status] ?? SO_STATUS.draft
                    const isInvoiced = invoicedSOIds.has(so.id)
                    const canInvoice = ['approved', 'active'].includes(so.status) && !isInvoiced
                    return (
                      <TableRow key={so.id} className={`transition-colors ${canInvoice ? 'hover:bg-blue-50/40' : 'hover:bg-gray-50 opacity-70'}`}>
                        <TableCell className="pl-6 font-mono text-xs text-gray-500">{so.seqNo || '—'}</TableCell>
                        <TableCell className="text-sm text-gray-700">{getOrgName(so.customerId)}</TableCell>
                        <TableCell className="text-sm text-gray-500">{so.projectId ? getProjectName(so.projectId) : '—'}</TableCell>
                        <TableCell className="text-sm text-gray-600">{so.orderDate ? new Date(so.orderDate).toLocaleDateString() : '—'}</TableCell>
                        <TableCell className="text-sm font-semibold text-gray-800">
                          ${Number(so.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.className}`}>
                            {s.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          {isInvoiced ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Invoiced
                            </span>
                          ) : canInvoice ? (
                            <Button
                              size="sm"
                              onClick={() => setSelectedSO(so)}
                              className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <ArrowRight className="h-3 w-3 mr-1" /> Invoice
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400">Not eligible</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generated Invoices Table */}
      {activeTab === 'invoices' && (
        <Card className="shadow-sm border">
          <CardHeader className="py-4 px-6 border-b">
            <CardTitle className="text-base font-semibold text-gray-800">Generated Invoices</CardTitle>
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
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    {['Invoice #', 'Client', 'Sales Order', 'Invoice Date', 'Due Date', 'Total', 'Paid', 'Status'].map(h => (
                      <TableHead key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wide first:pl-6">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv: any) => {
                    const s = INV_STATUS[inv.status] ?? INV_STATUS.draft
                    const linkedSO = salesOrders.find((so: any) => so.id === inv.salesOrderId)
                    return (
                      <TableRow key={inv.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="pl-6 font-mono text-xs text-gray-500">{inv.seqNo || '—'}</TableCell>
                        <TableCell className="text-sm text-gray-700">{getOrgName(inv.customerId)}</TableCell>
                        <TableCell className="text-sm text-gray-500 font-mono">{linkedSO?.seqNo || inv.salesOrderId || '—'}</TableCell>
                        <TableCell className="text-sm text-gray-600">{inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : '—'}</TableCell>
                        <TableCell className="text-sm text-gray-600">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</TableCell>
                        <TableCell className="text-sm font-semibold text-gray-800">
                          ${Number(inv.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          ${Number(inv.paidAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.className}`}>
                            {s.label}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Invoice Generation Dialog */}
      <Dialog open={!!selectedSO} onOpenChange={v => { if (!v) { setSelectedSO(null); setErrors({}) } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="bg-blue-50 p-1.5 rounded-md">
                <Receipt className="h-4 w-4 text-blue-600" />
              </div>
              Generate Invoice
            </DialogTitle>
          </DialogHeader>

          {selectedSO && (
            <form onSubmit={handleGenerate} className="space-y-5 pt-1">

              {/* Sales Order Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sales Order Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Receipt className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Order Number</p>
                      <p className="text-sm font-semibold text-gray-800 font-mono">{selectedSO.seqNo || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Client</p>
                      <p className="text-sm font-medium text-gray-800">{getOrgName(selectedSO.customerId)}</p>
                    </div>
                  </div>
                  {selectedSO.projectId && (
                    <div className="flex items-start gap-2">
                      <FolderKanban className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Project</p>
                        <p className="text-sm font-medium text-gray-800">{getProjectName(selectedSO.projectId)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Order Date</p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedSO.orderDate ? new Date(selectedSO.orderDate).toLocaleDateString() : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 col-span-2">
                    <DollarSign className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Order Amount</p>
                      <p className="text-lg font-bold text-gray-800">
                        ${Number(selectedSO.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Invoice fields */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Invoice Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">
                      Invoice Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={invoiceDate}
                      onChange={e => { setInvoiceDate(e.target.value); setErrors(p => ({ ...p, invoiceDate: '' })) }}
                      className={errors.invoiceDate ? 'border-red-400' : ''}
                    />
                    {errors.invoiceDate && <p className="text-xs text-red-500">{errors.invoiceDate}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">
                      Due Date <span className="text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Amount preview */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-blue-700 font-medium">Invoice Total</span>
                <span className="text-lg font-bold text-blue-800">
                  ${Number(selectedSO.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {createError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {createError.message}
                </p>
              )}

              <DialogFooter className="pt-1">
                <Button type="button" variant="outline" onClick={() => setSelectedSO(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[160px]"
                >
                  {creating ? 'Generating…' : 'Generate Invoice'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
