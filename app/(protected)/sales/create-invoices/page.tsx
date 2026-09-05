'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
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
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { DataTable, type Column } from '@/components/DataTable'
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

interface Line { desc: string; qty: string; price: string }
const emptyLine = (): Line => ({ desc: '', qty: '', price: '' })
const today = () => new Date().toISOString().split('T')[0]

const cell = 'border border-border bg-background outline-none focus:ring-1 focus:ring-primary focus:border-primary text-xs px-2 h-7 w-full rounded-sm'
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

  const soColumns: Column[] = [
    { key: 'seqNo', label: 'Order #', width: '110px', render: (v) => <MonoCell value={v} /> },
    {
      key: 'customerId',
      label: 'Customer',
      render: (_v, r: any) => <span className="text-sm font-medium">{getCustomer(r.customerId || r.clientId || '')}</span>,
    },
    { key: 'orderDate', label: 'Order Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'totalAmount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '120px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  const invColumns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: (v) => <MonoCell value={v} /> },
    {
      key: 'customerId',
      label: 'Customer',
      render: (_v, r: any) => <span className="text-sm font-medium">{getCustomer(r.customerId || r.clientId)}</span>,
    },
    {
      key: 'salesOrderId',
      label: 'Sales Order',
      width: '120px',
      render: (v) => <MonoCell value={v ? getSO(v) : '—'} />,
    },
    { key: 'invoiceDate', label: 'Invoice Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'dueDate', label: 'Due Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'totalAmount', label: 'Total', width: '110px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'paidAmount', label: 'Paid', width: '110px', align: 'right', render: (v) => <AmountCell value={v ?? 0} /> },
    { key: 'status', label: 'Status', width: '120px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Create Invoices"
        subtitle="Create and manage customer invoices"
        icon={<FileText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Create Invoices' }]}
        actions={
          !adding ? (
            <Button onClick={() => setAdding(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" /> New Invoice
            </Button>
          ) : undefined
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total" value={stats.total} icon={<FileText className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={stats.draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Paid" value={stats.paid} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Overdue" value={stats.overdue} icon={<XCircle className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      {adding && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">New Invoice</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>

          <div className="grid grid-cols-4 border-b border-border">
            {[
              { label: 'Customer *', key: 'customerId', type: 'select', opts: customers.map((c) => ({ id: c.id, name: c.docNumber ? `${c.docNumber} — ${c.name}` : c.name })), err: errors.customerId },
              { label: 'Sales Order', key: 'salesOrderId', type: 'select', opts: availableSalesOrders.map((s: any) => ({ id: s.id, name: `${entityRefLabel(s.seqNo, s.docNumber)} — ${formatMoney(s.totalAmount || 0)}` })), err: '' },
              { label: 'Invoice Date *', key: 'invoiceDate', type: 'date', err: errors.invoiceDate },
              { label: 'Due Date', key: 'dueDate', type: 'date', err: '' },
            ].map(({ label, key, type, opts, err }: any) => (
              <div key={key} className="border-r border-border last:border-r-0 p-2">
                <p className={`text-xs mb-1 font-medium ${err ? 'text-red-500' : 'text-muted-foreground'}`}>{label}{err ? ` — ${err}` : ''}</p>
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

          <div className="p-2">
            <div className="border border-border rounded overflow-hidden">
              <div className="grid bg-muted/70 border-b border-border" style={{ gridTemplateColumns: '2rem 1fr 6rem 8rem 7rem 2rem' }}>
                {['#', 'Description', 'Qty', 'Unit Price', 'Line Total', ''].map((h, i) => (
                  <div key={i} className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-r border-border last:border-r-0">{h}</div>
                ))}
              </div>

              {lines.map((l, i) => (
                <div key={i} className="grid border-b border-border last:border-b-0 hover:bg-primary/5" style={{ gridTemplateColumns: '2rem 1fr 6rem 8rem 7rem 2rem' }}>
                  <div className="border-r border-border flex items-center justify-center text-xs text-muted-foreground py-1">{i + 1}</div>
                  <div className="border-r border-border px-1 py-1">
                    <input value={l.desc} onChange={e => setL(i, 'desc', e.target.value)} placeholder="Item description"
                      className={errors[`d${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-border px-1 py-1">
                    <input type="number" min="0" value={l.qty} onChange={e => setL(i, 'qty', e.target.value)} placeholder="0"
                      className={errors[`q${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-border px-1 py-1">
                    <input type="number" min="0" step="0.01" value={l.price} onChange={e => setL(i, 'price', e.target.value)} placeholder="0.00"
                      className={errors[`p${i}`] ? cellErr : cell} />
                  </div>
                  <div className="border-r border-border px-2 py-1 flex items-center">
                    <span className="text-xs font-medium">
                      {formatMoney((parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0))}
                    </span>
                  </div>
                  <div className="flex items-center justify-center py-1">
                    {lines.length > 1 && (
                      <button onClick={() => setLines(p => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="border-t border-dashed border-border px-2 py-1">
                <button onClick={() => setLines(p => [...p, emptyLine()])} className="text-xs text-primary hover:text-primary flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add line
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between mt-3">
              <div>
                {saveError && <p className="text-xs text-red-500">{saveError.message}</p>}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex gap-8 text-xs text-muted-foreground mb-1">
                    <span>Subtotal</span><span>{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex gap-8 text-sm font-bold border-t border-border pt-1">
                    <span>Total</span><span>{formatMoney(subtotal)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]">
                    <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Invoice'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!adding && (
        <DataTable
          data={availableSalesOrders}
          columns={soColumns}
          title="All Available Sales Orders"
          searchable
          searchPlaceholder="Search sales orders…"
          emptyMessage="No sales orders available for invoice generation."
          pageSize={10}
          actions={[
            {
              label: 'Generate Invoice',
              icon: <Plus className="h-3.5 w-3.5" />,
              onClick: (so: any) => startFromSalesOrder(so),
            },
          ]}
        />
      )}

      <DataTable
        data={invoices}
        columns={invColumns}
        loading={loading}
        title="All Invoices"
        searchable
        searchPlaceholder="Search invoices…"
        emptyMessage="No invoices yet. Click New Invoice to create one."
        pageSize={25}
        actions={[
          {
            label: 'View',
            icon: <Eye className="h-3.5 w-3.5" />,
            onClick: (inv: any) => setViewInv(inv),
          },
          {
            label: 'Download PDF',
            icon: <Download className="h-3.5 w-3.5" />,
            onClick: (inv: any) => downloadDocumentPdf('customer-invoice', inv.id, inv.invoiceNumber || inv.seqNo).catch(() => {}),
          },
          {
            label: 'Send for approval',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (inv: any) => submitInvoiceForApproval({ variables: { id: inv.id } }),
            show: (inv: any) => inv.status === 'draft' || inv.status === 'approval_declined',
            disabled: submittingInv,
          },
        ]}
      />

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
            <Button type="button" variant="outline" size="sm" onClick={() => setViewInv(null)}>
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
