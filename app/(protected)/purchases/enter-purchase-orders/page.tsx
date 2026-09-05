'use client'

import { useMemo, useRef, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_PURCHASE_ORDERS,
  GET_PURCHASE_ORDER,
  GET_DOCUMENTS,
  DELETE_DOCUMENT,
  CREATE_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER,
  GET_VENDORS,
  GET_PROJECTS,
  GET_PRODUCTS,
  GET_UOMS,
  GET_TAX_RATES,
  GET_WAREHOUSES,
  GET_PAYMENT_TERMS,
  GET_USERS,
  MARK_PURCHASE_ORDER_RFQ_SENT,
  MARK_PURCHASE_ORDER_PRINTED,
  SUBMIT_PURCHASE_ORDER,
  APPROVE_PURCHASE_ORDER,
  CONFIRM_PURCHASE_ORDER,
  SEND_PURCHASE_ORDER_BY_EMAIL,
  RECEIVE_PURCHASE_ORDER,
  CANCEL_PURCHASE_ORDER,
  LOCK_PURCHASE_ORDER,
  BILL_PURCHASE_ORDER,
  CLOSE_PURCHASE_ORDER_LINE,
  DUPLICATE_PURCHASE_ORDER,
} from '@/gql/queries'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { DataTable, type Column } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { CellInput } from '@/components/ui/cell-input'
import { CellSelect } from '@/components/ui/cell-select'
import { SectionCard } from '@/components/dashboard/section-card'
import {
  PageHeader,
  StatsRow,
  StatCard,
  ErpBadge,
  AmountCell,
  MonoCell,
  DateCell,
} from '@/components/ui/erp-shared'
import { downloadDocumentPdf } from '@/lib/pdf-download'
import { uploadDocument, buildDownloadUrl, humanFileSize } from '@/lib/upload'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'
import { toast } from 'sonner'
import {
  Plus,
  X,
  Trash2,
  ShoppingCart,
  Download,
  Mail,
  CheckCircle2,
  PackageCheck,
  Lock,
  Ban,
  Printer,
  FileText,
  StickyNote,
  Copy,
  Paperclip,
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  Send,
} from 'lucide-react'

// rfq -> rfq_sent -> submitted -> approved -> purchase_order -> sent
//   -> received | partially_received -> billed | partially_billed
// cancelled | rejected | locked are terminal/side states.
const STATUS_BAR_STEPS = ['rfq', 'submitted', 'approved', 'purchase_order', 'sent', 'received'] as const

const EDITABLE_STATUSES = new Set(['rfq', 'rfq_sent'])

interface Line {
  lineType: 'product' | 'section' | 'note'
  productId: string
  productName: string
  uomId: string
  packagingId: string
  packagingQty: string
  quantity: string
  unitPrice: string
  taxIds: string[]
  discountPercent: string
  note: string
  qtyReceived?: number
  qtyBilled?: number
  closedForReceiving?: boolean
  lineId?: string  // server-assigned _id, needed for close-line action
}
const emptyLine = (): Line => ({
  lineType: 'product',
  productId: '',
  productName: '',
  uomId: '',
  packagingId: '',
  packagingQty: '',
  quantity: '',
  unitPrice: '',
  taxIds: [],
  discountPercent: '0',
  note: '',
})
const today = () => new Date().toISOString().split('T')[0]

export default function EnterPurchaseOrdersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: poData, loading, refetch } = useQuery(GET_PURCHASE_ORDERS, { variables: { organizationId: orgId, page: 1, limit: 100 }, skip: !orgId })
  const { data: vendorData } = useQuery(GET_VENDORS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: projectData } = useQuery(GET_PROJECTS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: productData } = useQuery(GET_PRODUCTS, { variables: { organizationId: orgId, canBePurchased: true }, skip: !orgId })
  const { data: uomData } = useQuery(GET_UOMS, { variables: { organizationId: orgId }, skip: !orgId })
  const { data: taxData } = useQuery(GET_TAX_RATES, { variables: { organizationId: orgId, appliesTo: null }, skip: !orgId })
  const { data: warehouseData } = useQuery(GET_WAREHOUSES, { variables: { organizationId: orgId }, skip: !orgId })
  const { data: termsData } = useQuery(GET_PAYMENT_TERMS, { variables: { organizationId: orgId }, skip: !orgId })
  const { data: usersData } = useQuery(GET_USERS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })

  const { refetch: refetchPoDetail } = useQuery(GET_PURCHASE_ORDER, { skip: true })

  const [create, { loading: saving }] = useMutation(CREATE_PURCHASE_ORDER, {
    onCompleted: () => { setOpen(false); reset(); refetch(); toast.success('RFQ created.') },
    onError: (e) => toast.error(e.message),
  })
  const [update, { loading: updating }] = useMutation(UPDATE_PURCHASE_ORDER, {
    onCompleted: () => { setOpen(false); reset(); refetch(); toast.success('RFQ updated.') },
    onError: (e) => toast.error(e.message),
  })
  const [markRfqSent] = useMutation(MARK_PURCHASE_ORDER_RFQ_SENT, { onCompleted: () => refetch(), onError: (e) => toast.error(e.message) })
  const [submitPO] = useMutation(SUBMIT_PURCHASE_ORDER, { onCompleted: () => refetch(), onError: (e) => toast.error(e.message) })
  const [approvePO] = useMutation(APPROVE_PURCHASE_ORDER, { onCompleted: () => refetch(), onError: (e) => toast.error(e.message) })
  const [confirmPO] = useMutation(CONFIRM_PURCHASE_ORDER, { onCompleted: () => refetch(), onError: (e) => toast.error(e.message) })
  const [sendPOEmail, { loading: sendingEmail }] = useMutation(SEND_PURCHASE_ORDER_BY_EMAIL, {
    onCompleted: () => { refetch(); toast.success('Purchase order emailed to vendor.') },
    onError: (e) => toast.error(e.message),
  })
  const [receivePO, { loading: receiving }] = useMutation(RECEIVE_PURCHASE_ORDER, {
    onCompleted: () => { refetch(); setReceiveOpen(false); toast.success('Receipt recorded.') },
    onError: (e) => toast.error(e.message),
  })
  const [cancelPO] = useMutation(CANCEL_PURCHASE_ORDER, { onCompleted: () => refetch(), onError: (e) => toast.error(e.message) })
  const [lockPO] = useMutation(LOCK_PURCHASE_ORDER, { onCompleted: () => refetch(), onError: (e) => toast.error(e.message) })
  const [markPrinted] = useMutation(MARK_PURCHASE_ORDER_PRINTED, { onError: (e) => toast.error(e.message) })
  const [billPO, { loading: billing }] = useMutation(BILL_PURCHASE_ORDER, {
    onCompleted: (data) => { refetch(); setBillOpen(false); toast.success(`Bill ${data.billPurchaseOrder.billNumber} created.`) },
    onError: (e) => toast.error(e.message),
  })
  const [closeLineMut] = useMutation(CLOSE_PURCHASE_ORDER_LINE, { onCompleted: () => refetch(), onError: (e) => toast.error(e.message) })
  const [duplicatePO, { loading: duplicating }] = useMutation(DUPLICATE_PURCHASE_ORDER, {
    onCompleted: (data) => { refetch(); toast.success(`Duplicate RFQ ${data.duplicatePurchaseOrder.seqNo} created.`) },
    onError: (e) => toast.error(e.message),
  })
  const [deleteDoc] = useMutation(DELETE_DOCUMENT, { onError: (e) => toast.error(e.message) })

  const [open, setOpen] = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [receivingPo, setReceivingPo] = useState<any | null>(null)
  const [receiveQtys, setReceiveQtys] = useState<Record<string, string>>({})
  const [allowOverReceive, setAllowOverReceive] = useState<Record<string, boolean>>({})
  const [billOpen, setBillOpen] = useState(false)
  const [billingPo, setBillingPo] = useState<any | null>(null)
  const [billDate, setBillDate] = useState(today())
  const [billDueDate, setBillDueDate] = useState('')
  const [billQtys, setBillQtys] = useState<Record<string, string>>({})
  const [attachingPoId, setAttachingPoId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    vendorId: '', projectId: '', orderDate: today(), orderDeadline: '', expectedArrival: '',
    deliverToLocationId: '', paymentTerms: '', deliveryTerms: '', fiscalPosition: '', vendorReference: '',
    gstTreatment: '', currency: 'INR', exchangeRate: '1', agreement: '', sourceDocument: '', incoterms: '', buyerId: '',
    askConfirmation: false, notes: '',
  })
  const [formVersion, setFormVersion] = useState(0)  // server-side version for optimistic concurrency
  const [lines, setLines] = useState<Line[]>([emptyLine()])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const vendors = (vendorData?.vendors ?? []).filter((v: any) => (v.orgApprovalStatus ?? 'approved') === 'approved')
  const projects = (projectData?.projects ?? []).filter((p: any) => (p.orgApprovalStatus ?? 'approved') === 'approved')
  const products = productData?.products ?? []
  const uoms = uomData?.uoms ?? []
  const taxRates = (taxData?.taxRates ?? []).filter((t: any) => t.appliesTo !== 'SALES')
  const warehouses = warehouseData?.warehouses ?? []
  const paymentTerms = termsData?.paymentTerms ?? []
  const users = usersData?.usersByOrganization?.users ?? []
  const orders = poData?.purchaseorders ?? []

  const reset = () => {
    setEditingId(null)
    setFormVersion(0)
    setForm({
      vendorId: '', projectId: '', orderDate: today(), orderDeadline: '', expectedArrival: '',
      deliverToLocationId: '', paymentTerms: '', deliveryTerms: '', fiscalPosition: '', vendorReference: '',
      gstTreatment: '', currency: 'INR', exchangeRate: '1', agreement: '', sourceDocument: '', incoterms: '', buyerId: '',
      askConfirmation: false, notes: '',
    })
    setLines([emptyLine()])
    setErrors({})
  }
  const setF = (k: string, v: string | boolean) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })) }
  const setL = (i: number, k: keyof Line, v: any) => setLines((p) => p.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)))
  const pickVendor = (id: string) => {
    const v = vendors.find((x: any) => x.id === id)
    setForm((p) => ({ ...p, vendorId: id, gstTreatment: v?.gstTreatment ?? p.gstTreatment }))
    setErrors((p) => ({ ...p, vendorId: '' }))
  }
  const pickProduct = (i: number, id: string) => {
    const p = products.find((x: any) => x.id === id)
    if (p) {
      setLines((prev) =>
        prev.map((l, idx) =>
          idx === i
            ? { ...l, productId: id, productName: p.name, unitPrice: String(p.costPrice ?? ''), uomId: p.uomId ?? '', packagingId: '', packagingQty: '' }
            : l,
        ),
      )
    }
  }
  const addLine = (lineType: Line['lineType']) => setLines((p) => [...p, { ...emptyLine(), lineType }])

  const lineTotals = lines.map((l) => {
    if (l.lineType !== 'product') return { untaxed: 0, tax: 0, total: 0 }
    const qty = parseFloat(l.quantity) || 0
    const price = parseFloat(l.unitPrice) || 0
    const discount = parseFloat(l.discountPercent) || 0
    const untaxed = qty * price * (1 - discount / 100)
    const rateSum = l.taxIds.reduce((s, id) => s + (taxRates.find((t: any) => t.id === id)?.ratePercent ?? 0), 0)
    const tax = untaxed * (rateSum / 100)
    return { untaxed, tax, total: untaxed + tax }
  })
  const untaxedAmount = lineTotals.reduce((s, l) => s + l.untaxed, 0)
  const taxAmount = lineTotals.reduce((s, l) => s + l.tax, 0)
  const totalAmount = untaxedAmount + taxAmount

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.vendorId) e.vendorId = 'Required'
    if (!form.orderDate) e.orderDate = 'Required'
    lines.forEach((l, i) => {
      if (l.lineType !== 'product') return
      if (!l.productId) e[`p${i}`] = 'Required'
      if (!(parseFloat(l.quantity) > 0)) e[`q${i}`] = '!'
      if (!(parseFloat(l.unitPrice) >= 0)) e[`pr${i}`] = '!'
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const buildItems = () =>
    lines.map((l) => {
      if (l.lineType !== 'product') {
        return { lineType: l.lineType, note: l.note || undefined, quantity: 0, unitPrice: 0 }
      }
      return {
        lineType: 'product',
        productId: l.productId,
        productName: l.productName,
        uomId: l.uomId || undefined,
        packagingId: l.packagingId || undefined,
        packagingQty: l.packagingQty ? parseFloat(l.packagingQty) : undefined,
        quantity: parseFloat(l.quantity) || 0,
        unitPrice: parseFloat(l.unitPrice) || 0,
        taxIds: l.taxIds.length ? l.taxIds : undefined,
        discountPercent: parseFloat(l.discountPercent) || 0,
      }
    })

  const handleSave = () => {
    if (!validate()) return
    const input = {
      vendorId: form.vendorId,
      gstTreatment: form.gstTreatment || undefined,
      currency: form.currency || undefined,
      exchangeRate: parseFloat(form.exchangeRate) > 0 ? parseFloat(form.exchangeRate) : 1,
      agreement: form.agreement || undefined,
      sourceDocument: form.sourceDocument || undefined,
      incoterms: form.incoterms || undefined,
      buyerId: form.buyerId || undefined,
      projectId: form.projectId || undefined,
      orderDate: form.orderDate,
      orderDeadline: form.orderDeadline || undefined,
      expectedArrival: form.expectedArrival || undefined,
      deliverToLocationId: form.deliverToLocationId || undefined,
      paymentTerms: form.paymentTerms || undefined,
      deliveryTerms: form.deliveryTerms || undefined,
      fiscalPosition: form.fiscalPosition || undefined,
      vendorReference: form.vendorReference || undefined,
      askConfirmation: form.askConfirmation,
      notes: form.notes || undefined,
      items: buildItems(),
      // Gap 9 — pass the version we loaded, so the server can detect conflicting edits.
      expectedVersion: editingId ? formVersion : undefined,
    }
    if (editingId) {
      update({ variables: { id: editingId, input } })
    } else {
      create({ variables: { input: { ...input, organizationId: orgId } } })
    }
  }

  const openNew = () => {
    reset()
    setOpen(true)
  }

  const openEdit = async (row: any) => {
    if (!EDITABLE_STATUSES.has(row.status)) {
      toast.error('Only RFQ documents can be edited. Confirmed/sent orders are locked.')
      return
    }
    setOpen(true)
    try {
      const res = await refetchPoDetail({ id: row.id })
      const po = res.data?.purchaseorder
      if (!po) return
      setEditingId(po.id)
      setFormVersion(po.version ?? 0)
      setForm({
        vendorId: po.vendorId ?? '',
        projectId: po.projectId ?? '',
        orderDate: po.orderDate ? po.orderDate.slice(0, 10) : today(),
        orderDeadline: po.orderDeadline ? po.orderDeadline.slice(0, 10) : '',
        expectedArrival: po.expectedArrival ? po.expectedArrival.slice(0, 10) : '',
        deliverToLocationId: po.deliverToLocationId ?? '',
        paymentTerms: po.paymentTerms ?? '',
        deliveryTerms: po.deliveryTerms ?? '',
        fiscalPosition: po.fiscalPosition ?? '',
        vendorReference: po.vendorReference ?? '',
        gstTreatment: po.gstTreatment ?? '',
        currency: po.currency ?? 'INR',
        exchangeRate: String(po.exchangeRate ?? 1),
        agreement: po.agreement ?? '',
        sourceDocument: po.sourceDocument ?? '',
        incoterms: po.incoterms ?? '',
        buyerId: po.buyerId ?? '',
        askConfirmation: !!po.askConfirmation,
        notes: po.notes ?? '',
      })
      setLines(
        (po.items ?? []).map((l: any) => ({
          lineType: l.lineType ?? 'product',
          productId: l.productId ?? '',
          productName: l.productName ?? '',
          uomId: l.uomId ?? '',
          packagingId: l.packagingId ?? '',
          packagingQty: l.packagingQty ? String(l.packagingQty) : '',
          quantity: String(l.quantity ?? ''),
          unitPrice: String(l.unitPrice ?? ''),
          taxIds: l.taxIds ?? [],
          discountPercent: String(l.discountPercent ?? '0'),
          note: l.note ?? '',
          qtyReceived: l.qtyReceived ?? 0,
          qtyBilled: l.qtyBilled ?? 0,
          closedForReceiving: !!l.closedForReceiving,
          lineId: l.id,
        })),
      )
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load purchase order')
    }
  }

  const getVendor = (id: string) => vendors.find((v: any) => v.id === id)?.name ?? '—'
  const getProject = (id: string) => projects.find((p: any) => p.id === id)?.name ?? '—'

  const productLinesOf = (po: any) => (po.items ?? []).filter((l: any) => !l.lineType || l.lineType === 'product')

  const openReceive = (po: any) => {
    setReceivingPo(po)
    const initial: Record<string, string> = {}
    for (const line of productLinesOf(po)) {
      const remaining = Math.max(0, Number(line.quantity ?? 0) - Number(line.qtyReceived ?? 0))
      initial[line.id] = String(remaining)
    }
    setReceiveQtys(initial)
    setReceiveOpen(true)
  }

  const setReceiveQty = (lineId: string, value: string) => setReceiveQtys((p) => ({ ...p, [lineId]: value }))

  const confirmReceive = () => {
    if (!receivingPo) return
    const lines = productLinesOf(receivingPo)
      .map((line: any) => {
        const remaining = Math.max(0, Number(line.quantity ?? 0) - Number(line.qtyReceived ?? 0))
        const qty = Math.min(remaining, Math.max(0, parseFloat(receiveQtys[line.id]) || 0))
        return { lineId: line.id, qtyReceived: qty }
      })
      .filter((l: any) => l.qtyReceived > 0)
    if (!lines.length) {
      toast.error('Enter a quantity greater than 0 for at least one line.')
      return
    }
    receivePO({ variables: { id: receivingPo.id, lines } })
  }

  // Bill dialog — partial/multi-bill against received-but-unbilled quantity.
  const openBillDialog = (po: any) => {
    setBillingPo(po)
    setBillDate(today())
    setBillDueDate('')
    const initial: Record<string, string> = {}
    for (const line of productLinesOf(po)) {
      const billable = Math.max(0, Number(line.qtyReceived ?? 0) - Number(line.qtyBilled ?? 0))
      initial[line.id] = String(billable)
    }
    setBillQtys(initial)
    setBillOpen(true)
  }

  const confirmBill = () => {
    if (!billingPo || !billDate || !billDueDate) {
      toast.error('Bill date and due date are required.')
      return
    }
    const lines = productLinesOf(billingPo)
      .map((line: any) => {
        const billable = Math.max(0, Number(line.qtyReceived ?? 0) - Number(line.qtyBilled ?? 0))
        const qty = Math.min(billable, Math.max(0, parseFloat(billQtys[line.id]) || 0))
        return { lineId: line.id, quantity: qty }
      })
      .filter((l: any) => l.quantity > 0)
    if (!lines.length) {
      toast.error('No billable quantity. Ensure goods have been received first.')
      return
    }
    billPO({ variables: { id: billingPo.id, billDate, dueDate: billDueDate, lines } })
  }

  // Document attachment handlers.
  const { data: attachmentsData, refetch: refetchAttachments } = useQuery(GET_DOCUMENTS, {
    variables: { parentModule: 'PURCHASE_ORDER', parentId: attachingPoId ?? '' },
    skip: !attachingPoId,
    fetchPolicy: 'cache-and-network',
  })
  const attachments: any[] = attachmentsData?.documents ?? []

  const handleAttachFile = async (file: File) => {
    if (!attachingPoId || !orgId) return
    setUploading(true)
    try {
      await uploadDocument({ file, organizationId: orgId, parentModule: 'PURCHASE_ORDER', parentId: attachingPoId, category: 'po-attachment' })
      await refetchAttachments()
      toast.success('File attached.')
    } catch (e: any) {
      toast.error(e.message ?? 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteAttachment = async (docId: string) => {
    await deleteDoc({ variables: { id: docId } })
    refetchAttachments()
  }

  const stats = {
    total: orders.length,
    rfq: orders.filter((o: any) => o.status === 'rfq' || o.status === 'rfq_sent').length,
    confirmed: orders.filter((o: any) => ['purchase_order', 'sent'].includes(o.status)).length,
    received: orders.filter((o: any) => ['received', 'partially_received'].includes(o.status)).length,
  }

  const columns: Column[] = [
    {
      key: 'seqNo',
      label: 'PO #',
      width: '140px',
      render: (v) => <MonoCell value={v} />,
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      render: (_v, r) => (
        <span className="text-sm font-medium">
          {r.vendorName || (r.vendorId ? getVendor(r.vendorId) : '—')}
        </span>
      ),
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      width: '110px',
      render: (v) => <DateCell value={v} />,
    },
    {
      key: 'totalAmount',
      label: 'Total',
      width: '120px',
      align: 'right',
      render: (v) => <AmountCell value={v} />,
    },
    {
      key: 'status',
      label: 'Status',
      width: '130px',
      render: (v) => <ErpBadge status={v} />,
    },
    {
      key: 'receiptStatus',
      label: 'Receipt',
      width: '120px',
      render: (v) => <ErpBadge status={v || 'not_received'} />,
    },
    {
      key: 'billingStatus',
      label: 'Billing',
      width: '120px',
      render: (v) => <ErpBadge status={v || 'not_billed'} />,
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Purchase Orders"
        subtitle="Create an RFQ, send it to the vendor, route for approval, then confirm into a purchase order."
        icon={<ShoppingCart className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Purchases' }, { label: 'Enter Purchase Orders' }]}
        actions={
          <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New RFQ
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total" value={stats.total} icon={<ShoppingCart className="h-5 w-5" />} variant="slate" />
        <StatCard label="RFQ" value={stats.rfq} icon={<FileText className="h-5 w-5" />} variant="amber" />
        <StatCard label="Confirmed / Sent" value={stats.confirmed} icon={<Send className="h-5 w-5" />} variant="blue" />
        <StatCard label="Received" value={stats.received} icon={<PackageCheck className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <DataTable
        data={orders}
        columns={columns}
        loading={loading}
        title="All Purchase Orders"
        searchable
        searchPlaceholder="Search orders…"
        emptyMessage="No purchase orders found."
        pageSize={25}
        onRowClick={(r: any) => {
          if (EDITABLE_STATUSES.has(r.status)) openEdit(r)
        }}
        isRowClickable={(r: any) => EDITABLE_STATUSES.has(r.status)}
        actions={[
          {
            label: 'Send RFQ',
            icon: <Mail className="h-3.5 w-3.5" />,
            onClick: (r: any) => markRfqSent({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'rfq',
          },
          {
            label: 'Send for approval',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r: any) => submitPO({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'rfq' || r.status === 'rfq_sent',
          },
          {
            label: 'Approve',
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => approvePO({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'submitted',
          },
          {
            label: 'Confirm order',
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => confirmPO({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'approved',
          },
          {
            label: 'Send by email',
            icon: <Mail className="h-3.5 w-3.5" />,
            onClick: (r: any) => sendPOEmail({ variables: { id: r.id } }),
            disabled: sendingEmail,
            show: (r: any) => r.status === 'purchase_order',
          },
          {
            label: 'Receive',
            icon: <PackageCheck className="h-3.5 w-3.5" />,
            onClick: (r: any) => openReceive(r),
            show: (r: any) => ['purchase_order', 'sent', 'partially_received'].includes(r.status),
          },
          {
            label: 'Create bill',
            icon: <FileText className="h-3.5 w-3.5" />,
            onClick: (r: any) => openBillDialog(r),
            show: (r: any) =>
              ['purchase_order', 'sent', 'received', 'partially_received', 'partially_billed'].includes(r.status),
          },
          {
            label: 'Print PDF',
            icon: <Printer className="h-3.5 w-3.5" />,
            onClick: (r: any) => {
              markPrinted({ variables: { id: r.id } })
              downloadDocumentPdf('purchase-order', r.id, `RFQ-${r.seqNo}`).catch(() => {})
            },
          },
          {
            label: 'Download PDF',
            icon: <Download className="h-3.5 w-3.5" />,
            onClick: (r: any) => downloadDocumentPdf('purchase-order', r.id, r.seqNo).catch(() => {}),
          },
          {
            label: 'Duplicate',
            icon: <Copy className="h-3.5 w-3.5" />,
            onClick: (r: any) => duplicatePO({ variables: { id: r.id } }),
            disabled: duplicating,
          },
          {
            label: 'Attachments',
            icon: <Paperclip className="h-3.5 w-3.5" />,
            onClick: (r: any) => setAttachingPoId(attachingPoId === r.id ? null : r.id),
          },
          {
            label: 'Lock',
            icon: <Lock className="h-3.5 w-3.5" />,
            onClick: (r: any) => lockPO({ variables: { id: r.id } }),
            show: (r: any) =>
              ['purchase_order', 'sent', 'received', 'billed', 'partially_received', 'partially_billed'].includes(
                r.status,
              ),
          },
          {
            label: 'Cancel',
            icon: <Ban className="h-3.5 w-3.5" />,
            onClick: (r: any) => cancelPO({ variables: { id: r.id } }),
            show: (r: any) =>
              !['received', 'partially_received', 'billed', 'partially_billed', 'locked', 'cancelled'].includes(
                r.status,
              ),
          },
        ]}
      />

      {/* Attachments panel — shown below the list when a PO row's Attach button is clicked */}
      {attachingPoId && (
        <SectionCard title={`Attachments — ${orders.find((o: any) => o.id === attachingPoId)?.seqNo ?? ''}`} bodyClassName="p-4">
          <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAttachFile(f); e.target.value = '' }} />
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((doc: any) => (
              <div key={doc.id} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs bg-white">
                <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div>
                  <a href={buildDownloadUrl(doc.downloadUrl)} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-primary">{doc.filename}</a>
                  <p className="text-muted-foreground">{humanFileSize(doc.sizeBytes ?? 0)} · {doc.createdAt ? formatDate(doc.createdAt) : ''}</p>
                </div>
                <button onClick={() => handleDeleteAttachment(doc.id)} className="text-destructive ml-1"><X className="h-3 w-3" /></button>
              </div>
            ))}
            {attachments.length === 0 && <p className="text-xs text-muted-foreground">No attachments yet.</p>}
          </div>
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="h-8 text-xs gap-1.5">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? 'Uploading…' : 'Attach file'}
          </Button>
        </SectionCard>
      )}

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editingId ? 'Edit RFQ' : 'New RFQ'}
        icon={<ShoppingCart className="h-5 w-5" />}
        size="xl"
        submitting={saving || updating}
        onSubmit={handleSave}
        submitLabel={editingId ? 'Save changes' : 'Save RFQ'}
      >
        <FormSection title="Header">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label htmlFor="po-vendor">Vendor *</Label>
              <select id="po-vendor" value={form.vendorId} onChange={(e) => pickVendor(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Select…</option>
                {vendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
              {errors.vendorId && <p className="text-xs text-destructive">{errors.vendorId}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-vendor-ref">Vendor reference</Label>
              <Input id="po-vendor-ref" value={form.vendorReference} onChange={(e) => setF('vendorReference', e.target.value)} />
            </div>
            {projects.length > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="po-project">Project</Label>
                <select id="po-project" value={form.projectId} onChange={(e) => setF('projectId', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">None</option>
                  {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="po-order-date">Order date *</Label>
              <Input id="po-order-date" type="date" value={form.orderDate} onChange={(e) => setF('orderDate', e.target.value)} />
              {errors.orderDate && <p className="text-xs text-destructive">{errors.orderDate}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-deadline">Order deadline</Label>
              <Input id="po-deadline" type="date" value={form.orderDeadline} onChange={(e) => setF('orderDeadline', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-arrival">Expected arrival</Label>
              <Input id="po-arrival" type="date" value={form.expectedArrival} onChange={(e) => setF('expectedArrival', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-deliver-to">Deliver to</Label>
              <select id="po-deliver-to" value={form.deliverToLocationId} onChange={(e) => setF('deliverToLocationId', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Select…</option>
                {warehouses.map((w: any) => <option key={w.id} value={w.id}>{w.warehouseName}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-terms">Payment terms</Label>
              <select id="po-terms" value={form.paymentTerms} onChange={(e) => setF('paymentTerms', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Select…</option>
                {paymentTerms.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-fiscal">Fiscal position</Label>
              <Input id="po-fiscal" value={form.fiscalPosition} onChange={(e) => setF('fiscalPosition', e.target.value)} placeholder="Within Tamil Nadu" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-gst-treatment">GST Treatment</Label>
              <Input id="po-gst-treatment" value={form.gstTreatment} onChange={(e) => setF('gstTreatment', e.target.value)} placeholder="Auto-filled from vendor" className="capitalize" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-currency">Currency</Label>
              <select id="po-currency" value={form.currency} onChange={(e) => setF('currency', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="SGD">SGD</option>
                <option value="MYR">MYR</option>
              </select>
            </div>
            {form.currency !== 'INR' && (
              <div className="space-y-1.5">
                <Label htmlFor="po-exchange-rate">Exchange rate (units/{form.currency} per 1 INR)</Label>
                <Input id="po-exchange-rate" type="number" min="0.000001" step="0.0001" value={form.exchangeRate} onChange={(e) => setF('exchangeRate', e.target.value)} className="font-mono" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="po-buyer">Buyer</Label>
              <select id="po-buyer" value={form.buyerId} onChange={(e) => setF('buyerId', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Select…</option>
                {users.map((u: any) => <option key={u.id} value={u.id}>{`${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email}</option>)}
              </select>
            </div>
          </FieldGrid>
          <label className="flex items-center gap-2 text-sm pt-1">
            <Checkbox checked={form.askConfirmation} onCheckedChange={(v) => setF('askConfirmation', !!v)} />
            Ask vendor for delivery confirmation
          </label>
        </FormSection>

        <FormSection title="Other Information" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label htmlFor="po-agreement">Agreement</Label>
              <Input id="po-agreement" value={form.agreement} onChange={(e) => setF('agreement', e.target.value)} placeholder="Blanket order / agreement reference" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-source-doc">Source document</Label>
              <Input id="po-source-doc" value={form.sourceDocument} onChange={(e) => setF('sourceDocument', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-incoterms">Incoterms</Label>
              <Input id="po-incoterms" value={form.incoterms} onChange={(e) => setF('incoterms', e.target.value)} placeholder="e.g. FOB, CIF" />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Products" className="pt-5 border-t border-border mt-5">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid bg-muted/50 border-b border-border" style={{ gridTemplateColumns: '2rem 1.3fr 5rem 6.5rem 5rem 6rem 6rem 5rem 6rem 4rem 4rem 2rem' }}>
              {['#', 'Product', 'UoM', 'Packaging', 'Qty', 'Unit Price', 'Taxes', 'Disc.%', 'Amount', 'Recv.', 'Billed', ''].map((h) => (
                <div key={h} className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-r border-border last:border-r-0">{h}</div>
              ))}
            </div>
            {lines.map((l, i) =>
              l.lineType !== 'product' ? (
                <div key={i} className="grid border-b border-border last:border-b-0 bg-muted/30" style={{ gridTemplateColumns: '2rem 1fr 2rem' }}>
                  <div className="border-r border-border flex items-center justify-center text-xs text-muted-foreground py-1">{i + 1}</div>
                  <div className="px-2 py-1 flex items-center gap-1.5">
                    {l.lineType === 'section' ? <FileText className="h-3 w-3 text-muted-foreground shrink-0" /> : <StickyNote className="h-3 w-3 text-muted-foreground shrink-0" />}
                    <input
                      value={l.note}
                      onChange={(e) => setL(i, 'note', e.target.value)}
                      placeholder={l.lineType === 'section' ? 'Section title…' : 'Note…'}
                      className={`w-full bg-transparent outline-none text-xs ${l.lineType === 'section' ? 'font-semibold uppercase tracking-wide' : 'italic text-muted-foreground'}`}
                    />
                  </div>
                  <div className="flex items-center justify-center py-1">
                    {lines.length > 1 && (
                      <button onClick={() => setLines((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
              <div key={i} className="grid border-b border-border last:border-b-0" style={{ gridTemplateColumns: '2rem 1.3fr 5rem 6.5rem 5rem 6rem 6rem 5rem 6rem 4rem 4rem 2rem' }}>
                <div className="border-r border-border flex items-center justify-center text-xs text-muted-foreground py-1">{i + 1}</div>
                <div className="border-r border-border px-1 py-1">
                  <CellSelect value={l.productId} onChange={(e) => pickProduct(i, e.target.value)} placeholder="Select product…" invalid={!!errors[`p${i}`]} options={products.map((p: any) => ({ value: p.id, label: p.name }))} />
                </div>
                <div className="border-r border-border px-1 py-1">
                  <CellSelect value={l.uomId} onChange={(e) => setL(i, 'uomId', e.target.value)} placeholder="…" options={uoms.map((u: any) => ({ value: u.id, label: u.name }))} />
                </div>
                <div className="border-r border-border px-1 py-1">
                  <CellSelect
                    value={l.packagingId}
                    onChange={(e) => setL(i, 'packagingId', e.target.value)}
                    placeholder="None"
                    options={(products.find((p: any) => p.id === l.productId)?.packagings ?? []).map((pkg: any) => ({ value: pkg.id, label: pkg.name }))}
                  />
                </div>
                <div className="border-r border-border px-1 py-1">
                  <CellInput type="number" min="0" value={l.quantity} onChange={(e) => setL(i, 'quantity', e.target.value)} invalid={!!errors[`q${i}`]} />
                </div>
                <div className="border-r border-border px-1 py-1">
                  <CellInput type="number" min="0" step="0.01" value={l.unitPrice} onChange={(e) => setL(i, 'unitPrice', e.target.value)} invalid={!!errors[`pr${i}`]} />
                </div>
                <div className="border-r border-border px-1 py-1 flex flex-wrap gap-1 items-center">
                  {taxRates.slice(0, 3).map((t: any) => (
                    <label key={t.id} className="flex items-center gap-0.5 text-[10px]">
                      <input
                        type="checkbox"
                        checked={l.taxIds.includes(t.id)}
                        onChange={(e) => setL(i, 'taxIds', e.target.checked ? [...l.taxIds, t.id] : l.taxIds.filter((x) => x !== t.id))}
                      />
                      {t.code}
                    </label>
                  ))}
                </div>
                <div className="border-r border-border px-1 py-1">
                  <CellInput type="number" min="0" max="100" value={l.discountPercent} onChange={(e) => setL(i, 'discountPercent', e.target.value)} />
                </div>
                <div className="border-r border-border px-2 py-1 flex items-center">
                  <span className="text-xs font-medium">{formatMoney(lineTotals[i]?.total ?? 0)}</span>
                </div>
                <div className="border-r border-border px-2 py-1 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground tabular-nums">{l.qtyReceived ?? 0}</span>
                </div>
                <div className="border-r border-border px-2 py-1 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground tabular-nums">{l.qtyBilled ?? 0}</span>
                </div>
                <div className="flex items-center justify-center py-1">
                  {lines.length > 1 && (
                    <button onClick={() => setLines((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              ),
            )}
            <div className="border-t border-dashed border-border px-2 py-1.5 flex items-center gap-3">
              <button onClick={() => setLines((p) => [...p, emptyLine()])} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add a product
              </button>
              <button onClick={() => addLine('section')} className="text-xs text-muted-foreground hover:underline flex items-center gap-1">
                <FileText className="h-3 w-3" /> Add a section
              </button>
              <button onClick={() => addLine('note')} className="text-xs text-muted-foreground hover:underline flex items-center gap-1">
                <StickyNote className="h-3 w-3" /> Add a note
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <div className="text-right space-y-1 text-sm">
              <div className="flex gap-8 text-muted-foreground text-xs"><span>Untaxed amount</span><span>{formatMoney(untaxedAmount)}</span></div>
              <div className="flex gap-8 text-muted-foreground text-xs"><span>Tax</span><span>{formatMoney(taxAmount)}</span></div>
              <div className="flex gap-8 font-bold border-t border-border pt-1"><span>Total</span><span>{formatMoney(totalAmount)}</span></div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Terms & Notes" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={2}>
            <div className="space-y-1.5">
              <Label htmlFor="po-delivery-terms">Delivery terms</Label>
              <Input id="po-delivery-terms" value={form.deliveryTerms} onChange={(e) => setF('deliveryTerms', e.target.value)} />
            </div>
          </FieldGrid>
          <div className="space-y-1.5">
            <Label htmlFor="po-notes">Notes</Label>
            <textarea id="po-notes" rows={3} value={form.notes} onChange={(e) => setF('notes', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" />
          </div>
        </FormSection>
      </FormModal>

      <FormModal
        open={receiveOpen}
        onOpenChange={setReceiveOpen}
        title={`Receive products — ${receivingPo?.seqNo ?? ''}`}
        description="Enter the quantity actually received for each line. Defaults to the remaining quantity — edit any line to record a partial receipt."
        icon={<PackageCheck className="h-5 w-5" />}
        size="lg"
        submitting={receiving}
        onSubmit={confirmReceive}
        submitLabel="Validate"
      >
        {receivingPo && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid bg-muted/50 border-b border-border" style={{ gridTemplateColumns: '1fr 5rem 6rem 8rem 7rem 2rem' }}>
              {['Product', 'Ordered', 'Rcvd.', 'Receive now', 'Over-receive?', ''].map((h) => (
                <div key={h} className="px-3 py-2 text-xs font-semibold text-muted-foreground border-r border-border last:border-r-0">{h}</div>
              ))}
            </div>
            {productLinesOf(receivingPo).map((line: any) => {
              const ordered = Number(line.quantity ?? 0)
              const already = Number(line.qtyReceived ?? 0)
              const remaining = Math.max(0, ordered - already)
              const isClosed = !!line.closedForReceiving
              const fullyReceived = isClosed || remaining <= 0
              return (
                <div key={line.id} className="grid border-b border-border last:border-b-0" style={{ gridTemplateColumns: '1fr 5rem 6rem 8rem 7rem 2rem' }}>
                  <div className="border-r border-border px-3 py-2 text-sm">{line.productName || 'Item'}{isClosed && <span className="ml-1 text-[10px] text-amber-600 font-medium">(closed)</span>}</div>
                  <div className="border-r border-border px-3 py-2 text-sm text-right tabular-nums">{ordered}</div>
                  <div className="border-r border-border px-3 py-2 text-sm text-right tabular-nums text-muted-foreground">{already}</div>
                  <div className="border-r border-border px-2 py-1.5">
                    {fullyReceived ? (
                      <span className="text-xs text-emerald-600 font-medium">Done</span>
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        max={allowOverReceive[line.id] ? undefined : remaining}
                        value={receiveQtys[line.id] ?? ''}
                        onChange={(e) => setReceiveQty(line.id, e.target.value)}
                        className="h-8 text-sm text-right"
                      />
                    )}
                  </div>
                  <div className="border-r border-border flex items-center justify-center px-2">
                    {!fullyReceived && (
                      <label className="flex items-center gap-1 cursor-pointer">
                        <Checkbox
                          checked={!!allowOverReceive[line.id]}
                          onCheckedChange={(v) => setAllowOverReceive((p) => ({ ...p, [line.id]: !!v }))}
                        />
                        <span className="text-[10px] text-muted-foreground">Allow</span>
                      </label>
                    )}
                  </div>
                  <div className="flex items-center justify-center px-1">
                    {!fullyReceived && line.id && (
                      <button
                        type="button"
                        title="Close this line (no more deliveries expected)"
                        onClick={() => { closeLineMut({ variables: { id: receivingPo.id, lineId: line.id } }); setReceiveOpen(false) }}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </FormModal>

      {/* Bill dialog — partial/multi-bill against received-but-unbilled quantity */}
      <FormModal
        open={billOpen}
        onOpenChange={setBillOpen}
        title={`Create Bill — ${billingPo?.seqNo ?? ''}`}
        description="Bill the received-but-not-yet-billed quantity. You can create multiple bills for the same PO as goods arrive in batches."
        icon={<FileText className="h-5 w-5" />}
        size="md"
        submitting={billing}
        onSubmit={confirmBill}
        submitLabel="Create Bill"
      >
        {billingPo && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Bill date *</Label>
                <Input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Due date *</Label>
                <Input type="date" value={billDueDate} onChange={(e) => setBillDueDate(e.target.value)} />
              </div>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="grid bg-muted/50 border-b border-border" style={{ gridTemplateColumns: '1fr 6rem 6rem 7rem' }}>
                {['Product', 'Rcvd.', 'Billed', 'Bill qty now'].map((h) => (
                  <div key={h} className="px-3 py-2 text-xs font-semibold text-muted-foreground border-r border-border last:border-r-0">{h}</div>
                ))}
              </div>
              {productLinesOf(billingPo).map((line: any) => {
                const received = Number(line.qtyReceived ?? 0)
                const alreadyBilled = Number(line.qtyBilled ?? 0)
                const billable = Math.max(0, received - alreadyBilled)
                return (
                  <div key={line.id} className="grid border-b border-border last:border-b-0" style={{ gridTemplateColumns: '1fr 6rem 6rem 7rem' }}>
                    <div className="border-r border-border px-3 py-2 text-sm">{line.productName || 'Item'}</div>
                    <div className="border-r border-border px-3 py-2 text-sm text-right tabular-nums">{received}</div>
                    <div className="border-r border-border px-3 py-2 text-sm text-right tabular-nums text-muted-foreground">{alreadyBilled}</div>
                    <div className="px-2 py-1.5">
                      {billable <= 0 ? (
                        <span className="text-xs text-emerald-600 font-medium">Fully billed</span>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          max={billable}
                          value={billQtys[line.id] ?? ''}
                          onChange={(e) => setBillQtys((p) => ({ ...p, [line.id]: e.target.value }))}
                          className="h-8 text-sm text-right"
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </FormModal>
    </div>
  )
}
