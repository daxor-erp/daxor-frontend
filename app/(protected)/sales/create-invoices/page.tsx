'use client'

import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { GET_CUSTOMER_INVOICES, CREATE_CUSTOMER_INVOICE, GET_SALES_ORDERS, SUBMIT_CUSTOMER_INVOICE_FOR_APPROVAL } from '@/gql/queries'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, X, Save, Trash2, FileText, Clock, CheckCircle2, XCircle, Eye, Send, Download } from 'lucide-react'
import { PageHeader, StatsRow, StatCard } from '@/components/ui/erp-shared'
import { downloadDocumentPdf } from '@/lib/pdf-download'
import { useAuth } from '@/contexts/AuthContext'
import { DocumentAttachments } from '@/components/widgets/document-attachments'
import { PdfDownloadButton } from '@/components/widgets/pdf-download-button'
import { escapeHtml, pdfMoney } from '@/lib/pdf-download'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'
import {
  GET_CUSTOMERS_FOR_SALES,
  mapSalesCustomers,
  customerDisplayName,
} from '@/lib/sales-customer-options'
import { entityRefLabel } from '@/lib/format-status'
import { StatusBadge } from '@/components/ui/status-badge'

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  draft:            { label: 'Draft',    cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  submitted:        { label: 'Pending approval', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  approval_declined:{ label: 'Declined', cls: 'bg-red-50 text-red-700 border-red-200' },
  approved:         { label: 'Approved', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  sent:             { label: 'Sent',     cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  partially_paid: { label: 'Partial',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  paid:           { label: 'Paid',     cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  overdue:        { label: 'Overdue',  cls: 'bg-red-50 text-red-700 border-red-200' },
  cancelled:      { label: 'Cancelled',cls: 'bg-rose-50 text-rose-600 border-rose-200' },
}

interface Line { desc: string; qty: string; price: string }
const emptyLine = (): Line => ({ desc: '', qty: '', price: '' })
const today = () => new Date().toISOString().split('T')[0]

const cell = 'border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-xs px-2 h-7 w-full rounded-sm'
const cellErr = 'border border-red-400 bg-red-50 outline-none focus:ring-1 focus:ring-red-400 text-xs px-2 h-7 w-full rounded-sm'

export default function CreateInvoicesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [viewInv, setViewInv] = useState<any | null>(null)

  const { data: invData, loading, refetch } = useQuery(GET_CUSTOMER_INVOICES, { variables: { organizationId: orgId, page: 1, limit: 100 }, skip: !orgId })
  const { data: customersData } = useQuery(GET_CUSTOMERS_FOR_SALES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })
  const { data: soData } = useQuery(GET_SALES_ORDERS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })

  const [create, { loading: saving, error: saveError }] = useMutation(CREATE_CUSTOMER_INVOICE, {
    onCompleted: () => { setAdding(false); reset(); refetch() },
  })

  const [submitInvoiceForApproval, { loading: submittingInv }] = useMutation(SUBMIT_CUSTOMER_INVOICE_FOR_APPROVAL, {
    onCompleted: () => refetch(),
    onError: (e) => alert(e.message),
  })

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ customerId: '', salesOrderId: '', invoiceDate: today(), dueDate: '' })
  const [lines, setLines] = useState<Line[]>([emptyLine()])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const customers = mapSalesCustomers(customersData?.customers)
  const salesOrders = soData?.salesorders ?? []
  const invoices = invData?.customerinvoices ?? []
  const invoicedSOIds = new Set(invoices.map((i: any) => i.salesOrderId).filter(Boolean))
  const availableSalesOrders = salesOrders.filter((s: any) => !invoicedSOIds.has(s.id))

  const reset = () => { setForm({ customerId: '', salesOrderId: '', invoiceDate: today(), dueDate: '' }); setLines([emptyLine()]); setErrors({}) }
  const setF = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }
  const setL = (i: number, k: keyof Line, v: string) => setLines(p => p.map((l, idx) => idx === i ? { ...l, [k]: v } : l))
  const onSalesOrderSelect = (salesOrderId: string) => {
    const so = availableSalesOrders.find((s: any) => s.id === salesOrderId)
    if (!so) {
      setF('salesOrderId', salesOrderId)
      return
    }
    setForm(p => ({
      ...p,
      salesOrderId: so.id,
      customerId: so.customerId || so.clientId || p.customerId,
    }))
    setLines([{ desc: `Sales Order ${entityRefLabel(so.seqNo, so.docNumber)}`, qty: '1', price: String(so.totalAmount || 0) }])
  }
  const startFromSalesOrder = (so: any) => {
    setAdding(true)
    setForm({
      customerId: so.customerId || so.clientId || '',
      salesOrderId: so.id,
      invoiceDate: today(),
      dueDate: '',
    })
    setLines([{ desc: `Sales Order ${entityRefLabel(so.seqNo, so.docNumber)}`, qty: '1', price: String(so.totalAmount || 0) }])
    setErrors({})
  }

  const subtotal = lines.reduce((s, l) => s + (parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0), 0)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.customerId) e.customerId = 'Required'
    if (!form.invoiceDate) e.invoiceDate = 'Required'
    lines.forEach((l, i) => {
      if (!l.desc.trim()) e[`d${i}`] = 'Required'
      if (!(parseFloat(l.qty) > 0)) e[`q${i}`] = '!'
      if (!(parseFloat(l.price) > 0)) e[`p${i}`] = '!'
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSave = () => {
    if (!validate()) return
    create({ variables: { input: { customerId: form.customerId, salesOrderId: form.salesOrderId || undefined, invoiceDate: form.invoiceDate, dueDate: form.dueDate || undefined, totalAmount: subtotal, organizationId: orgId } } })
  }

  const stats = { total: invoices.length, draft: invoices.filter((i: any) => i.status === 'draft').length, paid: invoices.filter((i: any) => i.status === 'paid').length, overdue: invoices.filter((i: any) => i.status === 'overdue').length }
  const getCustomer = (id: string) => customerDisplayName(customers, id)
  const getSO = (id: string) => {
    const so = salesOrders.find((s: any) => s.id === id)
    return entityRefLabel(so?.seqNo, so?.docNumber)
  }

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Create Invoices"
        subtitle="Create and manage customer invoices"
        icon={<FileText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Create Invoices' }]}
        actions={
          !adding && (
            <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> New Invoice
            </button>
          )
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total"   value={stats.total}   icon={<FileText     className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft"   value={stats.draft}   icon={<Clock        className="h-5 w-5" />} variant="amber" />
        <StatCard label="Paid"    value={stats.paid}    icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Overdue" value={stats.overdue} icon={<XCircle      className="h-5 w-5" />} variant="rose"  />
      </StatsRow>

      {/* Inline form panel */}
      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm mb-4 overflow-hidden">
          {/* Form toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">New Invoice</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          {/* Header fields grid */}
          <div className="grid grid-cols-4 border-b border-gray-200">
            {[
              { label: 'Customer *', key: 'customerId', type: 'select', opts: customers.map((c) => ({ id: c.id, name: c.docNumber ? `${c.docNumber} — ${c.name}` : c.name })), err: errors.customerId },
              { label: 'Sales Order', key: 'salesOrderId', type: 'select', opts: availableSalesOrders.map((s: any) => ({ id: s.id, name: `${entityRefLabel(s.seqNo, s.docNumber)} — ${formatMoney(s.totalAmount || 0)}` })), err: '' },
              { label: 'Invoice Date *', key: 'invoiceDate', type: 'date', err: errors.invoiceDate },
              { label: 'Due Date', key: 'dueDate', type: 'date', err: '' },
            ].map(({ label, key, type, opts, err }: any) => (
              <div key={key} className="border-r border-gray-200 last:border-r-0 p-2">
                <p className={`text-xs mb-1 font-medium ${err ? 'text-red-500' : 'text-gray-500'}`}>{label}{err ? ` — ${err}` : ''}</p>
                {type === 'select' ? (
                  <select value={(form as any)[key]} onChange={e => (key === 'salesOrderId' ? onSalesOrderSelect(e.target.value) : setF(key, e.target.value))}
                    className={err ? cellErr : cell}>
                    <option value="">— select —</option>
                    {opts.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                ) : (
                  <input type={type} value={(form as any)[key]} onChange={e => setF(key, e.target.value)}
                    className={err ? cellErr : cell} />
                )}
              </div>
            ))}
          </div>

          {/* Line items spreadsheet */}
          <div className="p-2">
            <div className="border border-gray-300 rounded overflow-hidden">
              {/* Line header */}
              <div className="grid bg-[#f0f0f0] border-b border-gray-300" style={{ gridTemplateColumns: '2rem 1fr 6rem 8rem 7rem 2rem' }}>
                {['#', 'Description', 'Qty', 'Unit Price', 'Line Total', ''].map((h, i) => (
                  <div key={i} className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</div>
                ))}
              </div>

              {/* Line rows */}
              {lines.map((l, i) => (
                <div key={i} className="grid border-b border-gray-200 last:border-b-0 hover:bg-blue-50/20" style={{ gridTemplateColumns: '2rem 1fr 6rem 8rem 7rem 2rem' }}>
                  <div className="border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-1">{i + 1}</div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input value={l.desc} onChange={e => setL(i, 'desc', e.target.value)} placeholder="Item description"
                      className={errors[`d${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input type="number" min="0" value={l.qty} onChange={e => setL(i, 'qty', e.target.value)} placeholder="0"
                      className={errors[`q${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-1 py-1">
                    <input type="number" min="0" step="0.01" value={l.price} onChange={e => setL(i, 'price', e.target.value)} placeholder="0.00"
                      className={errors[`p${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-gray-200 px-2 py-1 flex items-center">
                    <span className="text-xs font-medium text-gray-700">
                      {formatMoney((parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0))}
                    </span>
                  </div>
                  <div className="flex items-center justify-center py-1">
                    {lines.length > 1 && (
                      <button onClick={() => setLines(p => p.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add line row */}
              <div className="border-t border-dashed border-gray-300 px-2 py-1">
                <button onClick={() => setLines(p => [...p, emptyLine()])} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add line
                </button>
              </div>
            </div>

            {/* Totals + actions */}
            <div className="flex items-end justify-between mt-3">
              <div>
                {saveError && <p className="text-xs text-red-500">{saveError.message}</p>}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex gap-8 text-xs text-gray-500 mb-1">
                    <span>Subtotal</span><span>{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex gap-8 text-sm font-bold text-gray-800 border-t border-gray-300 pt-1">
                    <span>Total</span><span>{formatMoney(subtotal)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
                    <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Invoice'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available sales orders for invoicing */}
      {!adding && (
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
            <span className="text-sm font-semibold text-gray-700">Available Sales Orders</span>
            <span className="text-xs text-gray-500">{availableSalesOrders.length} available</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[950px] w-full text-xs">
              <thead>
                <tr className="bg-[#f0f0f0] border-b border-gray-300">
                  {['Order #', 'Customer', 'Order Date', 'Amount', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left px-3 py-2 font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {availableSalesOrders.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-gray-500" colSpan={6}>No sales orders available for invoice generation.</td>
                  </tr>
                ) : (
                  availableSalesOrders.map((so: any, idx: number) => (
                    <tr key={so.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-3 py-2 border-r border-gray-200 font-mono">{so.seqNo || '—'}</td>
                      <td className="px-3 py-2 border-r border-gray-200">{getCustomer(so.customerId || so.clientId || '')}</td>
                      <td className="px-3 py-2 border-r border-gray-200">{so.orderDate ? formatDate(so.orderDate) : '—'}</td>
                      <td className="px-3 py-2 border-r border-gray-200 font-semibold">{formatMoney(so.totalAmount || 0)}</td>
                      <td className="px-3 py-2 border-r border-gray-200">{so.status || '—'}</td>
                      <td className="px-3 py-2">
                        <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => startFromSalesOrder(so)}>
                          <Plus className="h-3.5 w-3.5 mr-1" /> Generate Invoice
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices grid */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-semibold text-gray-700">Invoices</span>
          {!adding && (
            <Button size="sm" onClick={() => setAdding(true)} className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-3.5 w-3.5 mr-1" /> New Invoice
            </Button>
          )}
        </div>

        {/* Header */}
        <div className="flex bg-[#f0f0f0] border-b border-gray-300">
          <div className="w-8 border-r border-gray-300 py-2 flex items-center justify-center text-xs text-gray-400">#</div>
          {['Code', 'Customer', 'Sales Order', 'Invoice Date', 'Due Date', 'Total', 'Paid', 'Status', ''].map((h, i) => (
            <div key={h === '' ? 'actions' : h} className={`border-r border-gray-300 px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide ${i === 1 ? 'flex-1' : i === 0 ? 'w-24' : i === 2 ? 'w-28' : i === 3 || i === 4 ? 'w-28' : i === 5 || i === 6 ? 'w-24' : i === 7 ? 'w-28' : 'w-28'}`}>{h === '' ? 'View / Send' : h}</div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">No invoices yet. Click "New Invoice" to create one.</p>
          </div>
        ) : (
          invoices.map((inv: any, idx: number) => {
            return (
              <div key={inv.id} className={`flex border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <div className="w-8 border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-2">{idx + 1}</div>
                <div className="w-24 border-r border-gray-200 px-2 py-2 text-xs font-mono text-gray-400">{inv.seqNo || '—'}</div>
                <div className="flex-1 border-r border-gray-200 px-2 py-2 text-xs font-medium text-gray-800 truncate">{getCustomer(inv.customerId || inv.clientId)}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs font-mono text-gray-500">{inv.salesOrderId ? getSO(inv.salesOrderId) : '—'}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{inv.invoiceDate ? formatDate(inv.invoiceDate) : '—'}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{inv.dueDate ? formatDate(inv.dueDate) : '—'}</div>
                <div className="w-24 border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-800">{formatMoney(inv.totalAmount)}</div>
                <div className="w-24 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{formatMoney(inv.paidAmount ?? 0)}</div>
                <div className="w-24 border-r border-gray-200 px-2 py-2">
                  <StatusBadge status={inv.status} />
                </div>
                <div className="w-28 px-2 py-2 flex items-center justify-center gap-1 border-l border-gray-100">
                  <button
                    type="button"
                    title="View invoice row"
                    className="p-1.5 rounded text-gray-500 hover:text-teal-700 hover:bg-teal-50"
                    onClick={() => setViewInv(inv)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Download PDF"
                    className="p-1.5 rounded text-gray-500 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => downloadDocumentPdf('customer-invoice', inv.id, inv.invoiceNumber || inv.seqNo).catch(() => {})}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  {(inv.status === 'draft' || inv.status === 'approval_declined') && (
                    <button
                      type="button"
                      title="Send for approval"
                      disabled={submittingInv}
                      className="p-1.5 rounded text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                      onClick={() => submitInvoiceForApproval({ variables: { id: inv.id } })}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <Dialog open={viewInv != null} onOpenChange={(o) => !o && setViewInv(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2">
              <span>Invoice #{viewInv?.seqNo ?? viewInv?.id?.slice?.(-6)}</span>
              {viewInv && (
                <PdfDownloadButton
                  title={`Invoice #${viewInv.seqNo ?? viewInv.id?.slice?.(-6)}`}
                  subtitle={viewInv.invoiceDate ? formatDate(viewInv.invoiceDate) : undefined}
                  filename={`invoice-${viewInv.seqNo ?? viewInv.id?.slice?.(-6)}`}
                  size="sm"
                  variant="primary"
                  label="PDF"
                  buildHtml={() => `
                    <div class="pdf-meta">
                      <div><strong>Invoice #:</strong> ${escapeHtml(viewInv.seqNo ?? viewInv.id?.slice?.(-6) ?? '')}</div>
                      <div><strong>Date:</strong> ${escapeHtml(viewInv.invoiceDate ? formatDate(viewInv.invoiceDate) : '')}</div>
                      <div><strong>Due:</strong> ${escapeHtml(viewInv.dueDate ? formatDate(viewInv.dueDate) : '')}</div>
                      <div><strong>Status:</strong> ${escapeHtml(String(viewInv.status ?? '').toUpperCase())}</div>
                    </div>
                    <div class="pdf-section">
                      <div class="pdf-section-title">Summary</div>
                      <table>
                        <tbody>
                          <tr><td>Total</td><td class="num">${pdfMoney(viewInv.totalAmount)}</td></tr>
                          <tr><td>Paid</td><td class="num">${pdfMoney(viewInv.paidAmount)}</td></tr>
                          <tr style="background:#ecfdf5;border-top:2px solid #059669;"><td><strong>Outstanding</strong></td><td class="num"><strong>${pdfMoney(viewInv.outstandingAmount)}</strong></td></tr>
                        </tbody>
                      </table>
                    </div>
                  `}
                />
              )}
            </DialogTitle>
          </DialogHeader>
          {viewInv && (
            <div className="space-y-3 overflow-auto">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Stat label="Total" value={formatMoney(Number(viewInv.totalAmount ?? 0))} />
                <Stat label="Outstanding" value={formatMoney(Number(viewInv.outstandingAmount ?? 0))} tone="rose" />
                <Stat label="Status" value={String(viewInv.status ?? '').toUpperCase()} />
                <Stat label="Date" value={viewInv.invoiceDate ? formatDate(viewInv.invoiceDate) : '—'} />
              </div>
              <DocumentAttachments parentModule="invoice" parentId={viewInv.id} compact title="Attachments" />
              <details className="rounded border bg-slate-50 p-3">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Raw JSON</summary>
                <pre className="text-[11px] mt-2 overflow-auto max-h-[20vh] whitespace-pre-wrap">{JSON.stringify(viewInv, null, 2)}</pre>
              </details>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setViewInv(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'rose' }) {
  return (
    <div className={`rounded-lg border p-3 ${tone === 'rose' ? 'bg-rose-50 border-rose-200' : 'bg-secondary/40 border-border'}`}>
      <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</p>
      <p className={`text-base font-bold tabular-nums ${tone === 'rose' ? 'text-rose-700' : ''}`}>{value}</p>
    </div>
  )
}
