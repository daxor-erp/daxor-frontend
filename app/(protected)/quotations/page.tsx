'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { CellInput } from '@/components/ui/cell-input'
import { CellSelect } from '@/components/ui/cell-select'
import { InputFloating } from '@/components/ui/input-floating'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, X, Save, Trash2, FileText, Clock, CheckCircle2, Send, Pencil, Loader2, Eye, Download, ShoppingBag, Mail } from 'lucide-react'
import { PageHeader, StatsRow, StatCard, ErpBadge } from '@/components/ui/erp-shared'
import { downloadDocumentPdf } from '@/lib/pdf-download'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { friendlyMutationDeniedMessage } from '@/lib/apollo-user-errors'
import { shouldIgnoreRowClick } from '@/lib/data-table-row-click'
import { SUBMIT_QUOTATION_FOR_APPROVAL, CREATE_SO_FROM_QUOTATION, SEND_QUOTATION } from '@/gql/queries'
import { formatDate, toDateInputValue } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'
import {
  GET_CUSTOMERS_FOR_SALES,
  mapSalesCustomers,
  customerSelectOptions,
  quotationPartyId,
  quotationPartyName,
} from '@/lib/sales-customer-options'

const GET_ITEMS = gql`
  query GetItems($organizationId: ID!) {
    items(organizationId: $organizationId, page: 1, limit: 1000) {
      id
      name
      description
      rate
      unit
    }
  }
`

const GET_QUOTATIONS = gql`
  query GetQuotations($organizationId: ID) {
    quotations(organizationId: $organizationId) {
      id
      quotationNumber
      customerId {
        id
        name
        email
        docNumber
      }
      subject
      quotationDate
      validUntil
      totalAmount
      status
    }
  }
`

const GET_QUOTATION = gql`
  query GetQuotation($id: ID!) {
    quotation(id: $id) {
      id
      quotationNumber
      customerId {
        id
        name
        email
        docNumber
      }
      subject
      quotationDate
      validUntil
      lineItems {
        itemId
        description
        quantity
        unitPrice
        discount
        tax
        total
      }
      subtotal
      discountAmount
      taxAmount
      totalAmount
      terms
      notes
      status
    }
  }
`

const CREATE_QUOTATION = gql`
  mutation CreateQuotation($input: CreateQuotationInput!) {
    createQuotation(input: $input) {
      id
      quotationNumber
    }
  }
`

const UPDATE_QUOTATION = gql`
  mutation UpdateQuotation($id: ID!, $input: UpdateQuotationInput!) {
    updateQuotation(id: $id, input: $input) {
      id
      quotationNumber
      status
    }
  }
`

const DELETE_QUOTATION = gql`
  mutation DeleteQuotation($id: ID!) {
    deleteQuotation(id: $id) {
      id
      quotationNumber
    }
  }
`

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  draft:               { label: 'Draft',               cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  submitted:           { label: 'Pending approval',    cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  approval_declined:   { label: 'Declined (internal)', cls: 'bg-red-50 text-red-800 border-red-200' },
  approved:            { label: 'Approved (internal)', cls: 'bg-teal-50 text-teal-800 border-teal-200' },
  sent:                { label: 'Sent',                cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  accepted:            { label: 'Accepted',            cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected:            { label: 'Rejected',            cls: 'bg-red-50 text-red-700 border-red-200' },
  expired:             { label: 'Expired',             cls: 'bg-orange-50 text-orange-700 border-orange-200' },
}

const STATUS_KEYS = Object.keys(STATUS_CFG) as (keyof typeof STATUS_CFG)[]

interface Line { itemId: string; desc: string; qty: string; price: string; discount: string; tax: string }
const emptyLine = (): Line => ({ itemId: '', desc: '', qty: '1', price: '0', discount: '0', tax: '0' })
const today = () => new Date().toISOString().split('T')[0]
const in30Days = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

function toDateInput(v: string) {
  return toDateInputValue(v)
}


export default function CreateQuotationsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId

  const { data: customersData } = useQuery(GET_CUSTOMERS_FOR_SALES, {
    variables: { organizationId: orgId ?? '' },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })
  const { data: itemsData } = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })
  const { data: quotationsData, loading, refetch } = useQuery(GET_QUOTATIONS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; quotationNumber: string } | null>(null)
  const [viewListId, setViewListId] = useState<string | null>(null)
  const [convertTarget, setConvertTarget] = useState<{ id: string; quotationNumber: string } | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorBanner, setErrorBanner] = useState('')
  const [form, setForm] = useState({ customerId: '', subject: '', quotationDate: today(), validUntil: in30Days(), terms: '', notes: '' })
  const [lines, setLines] = useState<Line[]>([emptyLine()])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showForm = adding || !!editingId
  const formPanelRef = useRef<HTMLDivElement>(null)

  const { data: quotationDetail, loading: loadingDetail, error: detailError } = useQuery(GET_QUOTATION, {
    variables: { id: editingId! },
    skip: !editingId,
    fetchPolicy: 'network-only',
  })

  const [create, { loading: saving }] = useMutation(CREATE_QUOTATION)

  const [updateQuotation, { loading: updating }] = useMutation(UPDATE_QUOTATION)

  const [deleteQuotation, { loading: deleting }] = useMutation(DELETE_QUOTATION)

  const [submitQuotationForApproval, { loading: submittingApproval }] = useMutation(SUBMIT_QUOTATION_FOR_APPROVAL)

  const [createSOFromQuotation, { loading: converting }] = useMutation(CREATE_SO_FROM_QUOTATION)

  const [sendQuotationEmail, { loading: sending }] = useMutation(SEND_QUOTATION)

  const reportMutationFailure = (err: unknown) => {
    const msg = friendlyMutationDeniedMessage(err)
    setErrorBanner(msg)
    toast.error(msg)
  }

  const { data: listViewData, loading: listViewLoading } = useQuery(GET_QUOTATION, {
    variables: { id: viewListId! },
    skip: !viewListId,
    fetchPolicy: 'network-only',
  })

  const detail = quotationDetail?.quotation
  const editLoading = !!(editingId && loadingDetail && (!detail || detail.id !== editingId))

  /** Avoid re-hydrating the form when quotation refetches (e.g. status change) so line edits are preserved. */
  const hydratedEditId = useRef<string | null>(null)
  useEffect(() => {
    hydratedEditId.current = null
  }, [editingId])

  useEffect(() => {
    if (!showForm) return
    formPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [showForm, editingId, adding])

  useEffect(() => {
    const q = quotationDetail?.quotation
    if (!editingId || !q || q.id !== editingId) return
    if (hydratedEditId.current === editingId) return
    hydratedEditId.current = editingId
    setForm({
      customerId: quotationPartyId(q),
      subject: q.subject ?? '',
      quotationDate: toDateInput(q.quotationDate),
      validUntil: toDateInput(q.validUntil),
      terms: q.terms ?? '',
      notes: q.notes ?? '',
    })
    const lis = q.lineItems?.length ? q.lineItems : []
    setLines(
      lis.length
        ? lis.map((li: { itemId?: string | null; description?: string; quantity?: number; unitPrice?: number; discount?: number; tax?: number }) => ({
            itemId: li.itemId ?? '',
            desc: li.description ?? '',
            qty: String(li.quantity ?? 1),
            price: String(li.unitPrice ?? 0),
            discount: String(li.discount ?? 0),
            tax: String(li.tax ?? 0),
          }))
        : [emptyLine()],
    )
    setErrors({})
  }, [editingId, quotationDetail])

  const customers  = mapSalesCustomers(customersData?.customers)
  const items      = itemsData?.items        ?? []
  const quotations = quotationsData?.quotations ?? []

  const reset = () => {
    setForm({ customerId: '', subject: '', quotationDate: today(), validUntil: in30Days(), terms: '', notes: '' })
    setLines([emptyLine()])
    setErrors({})
  }

  const closeForm = () => {
    setAdding(false)
    setEditingId(null)
    setErrorBanner('')
    reset()
  }

  const startCreate = () => {
    setViewListId(null)
    setEditingId(null)
    reset()
    setErrorBanner('')
    setAdding(true)
  }

  const startEdit = (id: string) => {
    setViewListId(null)
    setAdding(false)
    setEditingId(id)
  }

  const setF = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }
  const setL = (i: number, k: keyof Line, v: string) => {
    setLines(prev => prev.map((l, idx) => {
      if (idx !== i) return l
      const updated = { ...l, [k]: v }
      if (k === 'itemId' && v) {
        const item = items.find((it: { id: string }) => it.id === v)
        if (item) { updated.desc = (item as { name?: string }).name ?? ''; updated.price = (item as { rate?: number }).rate?.toString() || '0' }
      }
      return updated
    }))
  }

  const lineTotal = (l: Line) => {
    const sub = (parseFloat(l.qty) || 0) * (parseFloat(l.price) || 0)
    const disc = sub * ((parseFloat(l.discount) || 0) / 100)
    const tax  = (sub - disc) * ((parseFloat(l.tax) || 0) / 100)
    return sub - disc + tax
  }

  const totals = (() => {
    const subtotal        = lines.reduce((s, l) => s + (parseFloat(l.qty)||0)*(parseFloat(l.price)||0), 0)
    const discountAmount  = lines.reduce((s, l) => { const sub=(parseFloat(l.qty)||0)*(parseFloat(l.price)||0); return s+sub*((parseFloat(l.discount)||0)/100) }, 0)
    const taxAmount       = lines.reduce((s, l) => { const sub=(parseFloat(l.qty)||0)*(parseFloat(l.price)||0); const d=sub*((parseFloat(l.discount)||0)/100); return s+(sub-d)*((parseFloat(l.tax)||0)/100) }, 0)
    return { subtotal, discountAmount, taxAmount, totalAmount: subtotal - discountAmount + taxAmount }
  })()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.customerId)      e.customerId      = 'Required'
    if (!form.subject)       e.subject       = 'Required'
    if (!form.quotationDate) e.quotationDate = 'Required'
    if (!form.validUntil)    e.validUntil    = 'Required'
    lines.forEach((l, i) => {
      if (!l.desc.trim())              e[`d${i}`] = 'Required'
      if (!(parseFloat(l.qty) > 0))   e[`q${i}`] = '!'
      if (!(parseFloat(l.price) >= 0)) e[`p${i}`] = '!'
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const buildLineInput = () =>
    lines.map(l => ({
      itemId:      l.itemId || undefined,
      description: l.desc,
      quantity:    parseFloat(l.qty),
      unitPrice:   parseFloat(l.price),
      discount:    parseFloat(l.discount) || 0,
      tax:         parseFloat(l.tax) || 0,
      total:       lineTotal(l),
    }))

  const handleSave = async () => {
    if (!validate()) return
    setErrorBanner('')
    const payload = {
      customerId:     form.customerId,
      subject:        form.subject,
      quotationDate:  form.quotationDate,
      validUntil:     form.validUntil,
      lineItems:      buildLineInput(),
      subtotal:       totals.subtotal,
      discountAmount: totals.discountAmount,
      taxAmount:      totals.taxAmount,
      totalAmount:    totals.totalAmount,
      terms:          form.terms,
      notes:          form.notes,
    }
    try {
      if (editingId) {
        const res = await updateQuotation({
          variables: { id: editingId, input: payload },
        })
        const qn = res.data?.updateQuotation?.quotationNumber
        setEditingId(null)
        reset()
        await refetch()
        setSuccessMsg(`Quotation "${qn ?? ''}" updated successfully!`)
        setTimeout(() => setSuccessMsg(''), 5000)
      } else {
        const res = await create({
          variables: {
            input: { ...payload, organizationId: orgId },
          },
        })
        const qn = res.data?.createQuotation?.quotationNumber
        setAdding(false)
        reset()
        await refetch()
        setSuccessMsg(`Quotation "${qn ?? ''}" saved successfully!`)
        setTimeout(() => setSuccessMsg(''), 5000)
      }
    } catch (err) {
      reportMutationFailure(err)
    }
  }

  const handleStatusChange = async (id: string, current: string, next: string) => {
    if (next === current) return
    setErrorBanner('')
    try {
      await updateQuotation({
        variables: { id, input: { status: next } },
      })
      await refetch()
    } catch (err) {
      reportMutationFailure(err)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setErrorBanner('')
    try {
      await deleteQuotation({ variables: { id: deleteTarget.id } })
      setDeleteTarget(null)
      await refetch()
      setSuccessMsg('Quotation deleted.')
      setTimeout(() => setSuccessMsg(''), 5000)
    } catch (err) {
      reportMutationFailure(err)
    }
  }

  const confirmConvert = async () => {
    if (!convertTarget) return
    setErrorBanner('')
    try {
      const res = await createSOFromQuotation({ variables: { quotationId: convertTarget.id } })
      const soSeq = res.data?.createSOFromQuotation?.seqNo
      setConvertTarget(null)
      await refetch()
      setSuccessMsg(`Sales Order ${soSeq ? `"${soSeq}" ` : ''}created from quotation "${convertTarget.quotationNumber}".`)
      setTimeout(() => setSuccessMsg(''), 6000)
    } catch (err) {
      reportMutationFailure(err)
    }
  }

  const stats = {
    total:    quotations.length,
    draft:    quotations.filter((q: { status: string }) => q.status === 'draft').length,
    sent:     quotations.filter((q: { status: string }) => q.status === 'sent').length,
    accepted: quotations.filter((q: { status: string }) => q.status === 'accepted').length,
  }

  const headerCols = ['Quotation #', 'Customer', 'Subject', 'Date', 'Valid Until', 'Amount', 'Status', 'View', 'Actions'] as const
  const colClass = (i: number) =>
    i === 0 ? 'w-32' : i === 1 ? 'flex-1 min-w-0' : i === 2 ? 'w-40' : i === 3 || i === 4 ? 'w-28' : i === 5 ? 'w-28' : i === 6 ? 'w-36' : i === 7 ? 'w-20 shrink-0' : 'w-36'

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Quotations"
        subtitle="Create, edit, and manage quotations"
        icon={<FileText className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Quotations' }]}
        actions={
          !showForm && (
            <button onClick={startCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> New Quotation
            </button>
          )
        }
      />

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />{successMsg}
        </div>
      )}

      {errorBanner && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm font-medium">
          {errorBanner}
        </div>
      )}

      <StatsRow cols={4}>
        <StatCard label="Total"    value={stats.total}    icon={<FileText     className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft"    value={stats.draft}    icon={<Clock        className="h-5 w-5" />} variant="amber" />
        <StatCard label="Sent"     value={stats.sent}     icon={<Send         className="h-5 w-5" />} variant="blue" />
        <StatCard label="Accepted" value={stats.accepted} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </StatsRow>

      {showForm && (
        <div
          ref={formPanelRef}
          className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">
              {editingId
                ? `Edit quotation${detail?.quotationNumber ? ` — ${detail.quotationNumber}` : ''}`
                : 'New quotation'}
            </span>
            <button type="button" onClick={closeForm} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {editLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-gray-500 text-sm">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading quotation…
            </div>
          ) : detailError && editingId ? (
            <div className="px-4 py-8 text-center text-sm text-red-600">{detailError.message}</div>
          ) : (
            <>
              <div className="grid grid-cols-4 border-b border-gray-200">
                {[
                  { label: 'Customer *',       key: 'customerId',    type: 'select', err: errors.customerId },
                  { label: 'Subject *',        key: 'subject',       type: 'text',   err: errors.subject },
                  { label: 'Quotation Date *', key: 'quotationDate', type: 'date',   err: errors.quotationDate },
                  { label: 'Valid Until *',    key: 'validUntil',    type: 'date',   err: errors.validUntil },
                ].map(({ label, key, type, err }) => (
                  <div key={key} className="border-r border-gray-200 last:border-r-0 p-2">
                    <p className={`text-xs mb-1 font-medium ${err ? 'text-red-500' : 'text-gray-500'}`}>{label}{err ? ` — ${err}` : ''}</p>
                    {type === 'select' ? (
                      <CellSelect
                        value={(form as Record<string, string>)[key]}
                        onChange={e => setF(key, e.target.value)}
                        invalid={!!err}
                        placeholder="— select customer —"
                        options={customerSelectOptions(customers).slice(1)}
                      />
                    ) : (
                      <CellInput type={type} value={(form as Record<string, string>)[key]} onChange={e => setF(key, e.target.value)} invalid={!!err} />
                    )}
                  </div>
                ))}
              </div>

              {editingId && (
                <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">Status</span>
                  <CellSelect
                    className="w-auto"
                    value={detail?.status ?? 'draft'}
                    onChange={e => handleStatusChange(editingId, detail?.status ?? 'draft', e.target.value)}
                    disabled={updating}
                    options={STATUS_KEYS.map(k => ({ value: k, label: STATUS_CFG[k].label }))}
                  />
                </div>
              )}

              <div className="p-2">
                <div className="border border-gray-300 rounded overflow-hidden">
                  <div className="grid bg-[#f0f0f0] border-b border-gray-300" style={{ gridTemplateColumns: '2rem 12rem 1fr 6rem 8rem 6rem 6rem 8rem 2rem' }}>
                    {['#', 'Item', 'Description', 'Qty', 'Unit Price', 'Disc %', 'Tax %', 'Line Total', ''].map((h, i) => (
                      <div key={i} className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</div>
                    ))}
                  </div>

                  {lines.map((l, i) => (
                    <div key={i} className="grid border-b border-gray-200 last:border-b-0 hover:bg-blue-50/20" style={{ gridTemplateColumns: '2rem 12rem 1fr 6rem 8rem 6rem 6rem 8rem 2rem' }}>
                      <div className="border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-1">{i + 1}</div>
                      <div className="border-r border-gray-200 px-1 py-1">
                        <CellSelect
                          value={l.itemId}
                          onChange={e => setL(i, 'itemId', e.target.value)}
                          placeholder="— select item —"
                          options={items.map((it: { id: string; name: string }) => ({ value: it.id, label: it.name }))}
                        />
                      </div>
                      <div className="border-r border-gray-200 px-1 py-1">
                        <CellInput value={l.desc} onChange={e => setL(i, 'desc', e.target.value)} placeholder="Description" invalid={!!errors[`d${i}`]} />
                      </div>
                      <div className="border-r border-gray-200 px-1 py-1">
                        <CellInput type="number" min="0" value={l.qty} onChange={e => setL(i, 'qty', e.target.value)} invalid={!!errors[`q${i}`]} />
                      </div>
                      <div className="border-r border-gray-200 px-1 py-1">
                        <CellInput type="number" min="0" step="0.01" value={l.price} onChange={e => setL(i, 'price', e.target.value)} invalid={!!errors[`p${i}`]} />
                      </div>
                      <div className="border-r border-gray-200 px-1 py-1">
                        <CellInput type="number" min="0" max="100" step="0.1" value={l.discount} onChange={e => setL(i, 'discount', e.target.value)} />
                      </div>
                      <div className="border-r border-gray-200 px-1 py-1">
                        <CellInput type="number" min="0" max="100" step="0.1" value={l.tax} onChange={e => setL(i, 'tax', e.target.value)} />
                      </div>
                      <div className="border-r border-gray-200 px-2 py-1 flex items-center">
                        <span className="text-xs font-medium text-gray-700">{formatMoney(lineTotal(l))}</span>
                      </div>
                      <div className="flex items-center justify-center py-1">
                        {lines.length > 1 && (
                          <button type="button" onClick={() => setLines(p => p.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-dashed border-gray-300 px-2 py-1">
                    <button type="button" onClick={() => setLines(p => [...p, emptyLine()])} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                      <Plus className="h-3 w-3" /> Add line
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-xs mb-1 font-medium text-gray-500">Terms & Conditions</p>
                    <InputFloating multiline rows={3} value={form.terms} onChange={e => setF('terms', e.target.value)} placeholder="Enter terms and conditions" />
                  </div>
                  <div>
                    <p className="text-xs mb-1 font-medium text-gray-500">Notes</p>
                    <InputFloating multiline rows={3} value={form.notes} onChange={e => setF('notes', e.target.value)} placeholder="Enter additional notes" />
                  </div>
                </div>

                <div className="flex items-end justify-between mt-3">
                  <div />
                  <div className="flex items-center gap-6">
                    <div className="text-right space-y-1">
                      <div className="flex gap-8 text-xs text-gray-500"><span>Subtotal</span><span>{formatMoney(totals.subtotal)}</span></div>
                      <div className="flex gap-8 text-xs text-gray-500"><span>Discount</span><span>-{formatMoney(totals.discountAmount)}</span></div>
                      <div className="flex gap-8 text-xs text-gray-500"><span>Tax</span><span>{formatMoney(totals.taxAmount)}</span></div>
                      <div className="flex gap-8 text-sm font-bold text-gray-800 border-t border-gray-300 pt-1"><span>Total</span><span>{formatMoney(totals.totalAmount)}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={closeForm} className="h-8 text-xs">Cancel</Button>
                      <Button size="sm" onClick={handleSave} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[130px]">
                        <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editingId ? 'Update quotation' : 'Save quotation'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300 gap-3">
          <div>
            <span className="text-sm font-semibold text-gray-700">All quotations</span>
            <p className="text-[11px] text-muted-foreground mt-0.5">Click a row to edit in the panel above</p>
          </div>
          {!showForm && (
            <Button size="sm" onClick={startCreate} className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white shrink-0">
              <Plus className="h-3.5 w-3.5 mr-1" /> New quotation
            </Button>
          )}
        </div>

        <div className="flex bg-[#f0f0f0] border-b border-gray-300">
          <div className="w-8 border-r border-gray-300 py-2 flex items-center justify-center text-xs text-gray-400">#</div>
          {headerCols.map((h, i) => (
            <div key={h} className={`border-r border-gray-300 last:border-r-0 px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide ${colClass(i)}`}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : quotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">No quotations yet. Click &quot;New quotation&quot; to create one.</p>
          </div>
        ) : (
          quotations.map((q: { id: string; quotationNumber: string; customerId?: { name?: string; docNumber?: string }; clientId?: { name?: string }; subject: string; quotationDate: string; validUntil: string; totalAmount: number; status: string }, idx: number) => {
            const s = STATUS_CFG[q.status] ?? STATUS_CFG.draft
            return (
              <div
                key={q.id}
                role="button"
                tabIndex={0}
                className={`flex border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                onClick={(e) => {
                  if (shouldIgnoreRowClick(e, e.currentTarget)) return
                  startEdit(q.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    startEdit(q.id)
                  }
                }}
                title="Click to edit quotation"
              >
                <div className="w-8 border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-2">{idx + 1}</div>
                <div className="w-32 border-r border-gray-200 px-2 py-2 text-xs font-mono text-gray-700 font-semibold truncate">{q.quotationNumber}</div>
                <div className="flex-1 min-w-0 border-r border-gray-200 px-2 py-2 text-xs font-medium text-gray-800 truncate">{quotationPartyName(q)}</div>
                <div className="w-40 border-r border-gray-200 px-2 py-2 text-xs text-gray-600 truncate">{q.subject}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{formatDate(q.quotationDate)}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{formatDate(q.validUntil)}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-800">{formatMoney(q.totalAmount)}</div>
                <div className="w-36 border-r border-gray-200 px-2 py-2 flex items-center" data-stop-row-click>
                  <CellSelect
                    value={q.status}
                    onChange={e => handleStatusChange(q.id, q.status, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={updating}
                    className={`max-w-[9rem] font-medium ${s.cls}`}
                    aria-label={`Status for ${q.quotationNumber}`}
                    options={STATUS_KEYS.map(k => ({ value: k, label: STATUS_CFG[k].label }))}
                  />
                </div>
                <div className="w-20 shrink-0 border-r border-gray-200 px-1 py-2 flex items-center justify-center gap-1" data-stop-row-click>
                  <button
                    type="button"
                    title="View full quotation (snapshot)"
                    onClick={(e) => { e.stopPropagation(); setViewListId(q.id) }}
                    className="p-1.5 rounded-md text-gray-500 hover:text-teal-700 hover:bg-teal-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Download PDF"
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadDocumentPdf('quotation', q.id, q.quotationNumber).catch((err) => toast.error(String(err?.message || err)))
                    }}
                    className="p-1.5 rounded-md text-gray-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="w-36 px-2 py-2 flex flex-wrap items-center justify-center gap-1" data-stop-row-click>
                  {(q.status === 'draft' || q.status === 'approval_declined') && (
                    <button
                      type="button"
                      title="Send for internal approval"
                      disabled={submittingApproval}
                      onClick={async (e) => {
                        e.stopPropagation()
                        setErrorBanner('')
                        try {
                          await submitQuotationForApproval({ variables: { id: q.id } })
                          await refetch()
                          setSuccessMsg('Submitted for internal approval.')
                          setTimeout(() => setSuccessMsg(''), 5000)
                        } catch (err) {
                          reportMutationFailure(err)
                        }
                      }}
                      className="p-1.5 rounded-md text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {/* Send to Customer email — shown when approved */}
                  {q.status === 'approved' && (
                    <button
                      type="button"
                      title="Send to Customer (email)"
                      disabled={sending}
                      onClick={async (e) => {
                        e.stopPropagation()
                        setErrorBanner('')
                        try {
                          await sendQuotationEmail({ variables: { id: q.id } })
                          await refetch()
                          setSuccessMsg(`Quotation "${q.quotationNumber}" sent to customer.`)
                          setTimeout(() => setSuccessMsg(''), 5000)
                        } catch (err) {
                          reportMutationFailure(err)
                        }
                      }}
                      className="p-1.5 rounded-md text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {/* Convert to Sales Order — shown for draft/approved/sent/accepted */}
                  {['draft','approved','sent','accepted'].includes(q.status) && (                    <button
                      type="button"
                      title="Convert to Sales Order"
                      disabled={converting}
                      onClick={(e) => {
                        e.stopPropagation()
                        setConvertTarget({ id: q.id, quotationNumber: q.quotationNumber })
                      }}
                      className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Edit quotation"
                    onClick={(e) => { e.stopPropagation(); startEdit(q.id) }}
                    className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Delete quotation"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteTarget({ id: q.id, quotationNumber: q.quotationNumber })
                    }}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <Dialog open={viewListId != null} onOpenChange={(o) => !o && setViewListId(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {listViewData?.quotation?.quotationNumber ? `Quotation ${listViewData.quotation.quotationNumber}` : 'Quotation'}
            </DialogTitle>
          </DialogHeader>
          <div className="text-xs overflow-y-auto min-h-0">
            {listViewLoading ? (
              <p className="text-gray-500 py-8 text-center">Loading…</p>
            ) : listViewData?.quotation ? (
              <pre className="rounded border bg-slate-50 p-3 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[60vh]">
                {JSON.stringify(listViewData.quotation, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">No detail loaded.</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setViewListId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!convertTarget} onOpenChange={(open) => { if (!open) setConvertTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convert to Sales Order?</AlertDialogTitle>
            <AlertDialogDescription>
              {convertTarget
                ? `Quotation "${convertTarget.quotationNumber}" will become a new draft Sales Order. The quotation status will be set to Accepted.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={converting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={converting}
              onClick={(e) => { e.preventDefault(); confirmConvert() }}
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600"
            >
              {converting ? 'Converting…' : 'Convert to SO'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete quotation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {deleteTarget ? `"${deleteTarget.quotationNumber}"` : 'this quotation'} from your list. You cannot undo this from the app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
