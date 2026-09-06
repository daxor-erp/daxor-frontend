'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  CREATE_VENDOR,
  UPDATE_VENDOR,
  GET_VENDOR,
  GET_USERS,
  GET_PAYMENT_TERMS,
  ENSURE_DEFAULT_PAYMENT_TERMS,
  GET_PRICE_LISTS,
  CHECK_GSTIN_STATUS,
  LOOKUP_PAN,
  ADD_VENDOR_BANK_ACCOUNT,
  REMOVE_VENDOR_BANK_ACCOUNT,
} from '@/gql/queries'
import { TagPickerDialog, type VendorTagValue } from './tag-picker-dialog'
import { BankAccountDialog, type VendorBankAccountValue } from './bank-account-dialog'
import { ActivityLogPanel } from '@/components/activity-log-panel'
import { toast } from 'sonner'
import {
  Building2,
  User as UserIcon,
  Tags as TagsIcon,
  X,
  Plus,
  Trash2,
  ShieldCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const STEPS = [
  { key: 'identity', label: '1. Identity' },
  { key: 'tax', label: '2. Tax details' },
  { key: 'contact', label: '3. Contact' },
  { key: 'tags', label: '4. Tags' },
  { key: 'sales-purchase', label: '5. Sales & Purchase' },
  { key: 'accounting', label: '6. Accounting' },
  { key: 'notes', label: '7. Internal notes' },
  { key: 'activity', label: '8. Activity' },
] as const

const INVOICE_SENDING_PREFERENCES = [
  { value: 'email', label: 'By Email' },
  { value: 'postal', label: 'By Post' },
  { value: 'manual', label: 'Manual (no auto-send)' },
]

const GST_TREATMENTS = [
  { value: 'registered_business_regular', label: 'Registered Business – Regular' },
  { value: 'registered_business_composition', label: 'Registered Business – Composition' },
  { value: 'unregistered_business', label: 'Unregistered Business' },
  { value: 'consumer', label: 'Consumer' },
  { value: 'overseas', label: 'Overseas' },
  { value: 'special_economic_zone', label: 'Special Economic Zone' },
  { value: 'deemed_export', label: 'Deemed Export' },
  { value: 'uin_holders', label: 'UIN Holders' },
]

const WARNING_LEVELS = [
  { value: 'no_message', label: 'No Message' },
  { value: 'warning', label: 'Warning' },
  { value: 'blocking', label: 'Blocking Message' },
]

type VendorFormState = {
  type: 'individual' | 'company'
  name: string
  street: string
  city: string
  zip: string
  country: string

  gstTreatment: string
  gstin: string
  pan: string

  phone: string
  mobile: string
  email: string
  website: string

  tags: VendorTagValue[]

  salesperson: string
  salesPaymentTerms: string
  salesPaymentMethod: string
  priceList: string
  deliveryMethod: string

  buyer: string
  purchasePaymentTerms: string
  fiscalPosition: string

  customerLocation: string
  vendorLocation: string
  subcontractingLocation: string

  reference: string
  company: string
  slaPolicies: string

  bankAccounts: VendorBankAccountValue[]
  accountReceivable: string
  accountPayable: string
  invoiceSendingPreference: string

  warningSalesOrder: string
  warningPurchaseOrder: string
  warningPicking: string
  internalNotes: string
}

const EMPTY_FORM: VendorFormState = {
  type: 'company',
  name: '',
  street: '',
  city: '',
  zip: '',
  country: '',
  gstTreatment: 'unregistered_business',
  gstin: '',
  pan: '',
  phone: '',
  mobile: '',
  email: '',
  website: '',
  tags: [],
  salesperson: '',
  salesPaymentTerms: '',
  salesPaymentMethod: '',
  priceList: '',
  deliveryMethod: '',
  buyer: '',
  purchasePaymentTerms: '',
  fiscalPosition: '',
  customerLocation: '',
  vendorLocation: '',
  subcontractingLocation: '',
  reference: '',
  company: '',
  slaPolicies: '',
  bankAccounts: [],
  accountReceivable: '',
  accountPayable: '',
  invoiceSendingPreference: 'email',
  warningSalesOrder: 'no_message',
  warningPurchaseOrder: 'no_message',
  warningPicking: 'no_message',
  internalNotes: '',
}

type ExistingVendor = {
  id: string
  [key: string]: unknown
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
  /** Present when editing an existing (draft/declined) vendor; omitted for create. */
  editingVendor?: ExistingVendor | null
  onSaved: () => void
}

function vendorToForm(v: any): VendorFormState {
  return {
    type: v?.type === 'individual' ? 'individual' : 'company',
    name: v?.name ?? '',
    street: v?.address?.street ?? '',
    city: v?.address?.city ?? '',
    zip: v?.address?.zip ?? '',
    country: v?.address?.country ?? '',
    gstTreatment: v?.gstTreatment ?? 'unregistered_business',
    gstin: v?.gstin ?? '',
    pan: v?.pan ?? '',
    phone: v?.phone ?? '',
    mobile: v?.mobile ?? '',
    email: v?.email ?? '',
    website: v?.website ?? '',
    tags: (v?.tags ?? []).map((t: any) => ({ tagId: t.tagId, name: t.name, color: t.color, category: t.category })),
    salesperson: v?.sales?.salesperson ?? '',
    salesPaymentTerms: v?.sales?.paymentTerms ?? '',
    salesPaymentMethod: v?.sales?.paymentMethod ?? '',
    priceList: v?.sales?.priceList ?? '',
    deliveryMethod: v?.sales?.deliveryMethod ?? '',
    buyer: v?.purchase?.buyer ?? '',
    purchasePaymentTerms: v?.purchase?.paymentTerms ?? '',
    fiscalPosition: v?.purchase?.fiscalPosition ?? '',
    customerLocation: v?.inventory?.customerLocation ?? '',
    vendorLocation: v?.inventory?.vendorLocation ?? '',
    subcontractingLocation: v?.inventory?.subcontractingLocation ?? '',
    reference: v?.misc?.reference ?? '',
    company: v?.misc?.company ?? '',
    slaPolicies: v?.misc?.slaPolicies ?? '',
    bankAccounts: (v?.bankAccounts ?? []).map((b: any) => ({
      id: b.id,
      accountNumber: b.accountNumber,
      bankId: b.bankId,
      bankName: b.bankName,
      currency: b.currency,
      accountHolder: b.accountHolder,
      sendMoney: !!b.sendMoney,
    })),
    accountReceivable: v?.accounting?.accountReceivable ?? '',
    accountPayable: v?.accounting?.accountPayable ?? '',
    invoiceSendingPreference: v?.accounting?.invoiceSendingPreference ?? 'email',
    warningSalesOrder: v?.warnings?.salesOrder ?? 'no_message',
    warningPurchaseOrder: v?.warnings?.purchaseOrder ?? 'no_message',
    warningPicking: v?.warnings?.picking ?? 'no_message',
    internalNotes: v?.internalNotes ?? '',
  }
}

export function VendorWizardDialog({ open, onOpenChange, organizationId, editingVendor, onSaved }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState<VendorFormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [bankDialogOpen, setBankDialogOpen] = useState(false)
  const [gstinCheck, setGstinCheck] = useState<{ status: string; message: string; valid: boolean } | null>(null)
  const [panCheck, setPanCheck] = useState<{ valid: boolean; message: string; holderType?: string | null } | null>(null)

  const isEdit = !!editingVendor

  // The row passed in from the list table only carries summary fields — fetch full detail
  // (tags, sales/purchase/inventory/misc, bank accounts, accounting, warnings) when editing.
  const { data: fullVendorData, loading: loadingFullVendor } = useQuery(GET_VENDOR, {
    variables: { id: editingVendor?.id ?? '' },
    skip: !open || !editingVendor?.id,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (open) {
      setStepIndex(0)
      setErrors({})
      setGstinCheck(null)
      setPanCheck(null)
      if (!editingVendor) setForm({ ...EMPTY_FORM })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingVendor?.id])

  useEffect(() => {
    if (open && editingVendor && fullVendorData?.vendor) {
      setForm(vendorToForm(fullVendorData.vendor))
    }
  }, [open, editingVendor, fullVendorData])

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { organizationId, page: 1, limit: 200 },
    skip: !open || !organizationId,
  })
  const { data: termsData, refetch: refetchTerms } = useQuery(GET_PAYMENT_TERMS, {
    variables: { organizationId },
    skip: !open || !organizationId,
  })
  const { data: priceListData } = useQuery(GET_PRICE_LISTS, {
    variables: { organizationId, page: 1, limit: 100 },
    skip: !open || !organizationId,
  })

  const [ensureDefaultTerms] = useMutation(ENSURE_DEFAULT_PAYMENT_TERMS)

  useEffect(() => {
    if (open && organizationId && termsData && (termsData.paymentTerms ?? []).length === 0) {
      void ensureDefaultTerms({ variables: { organizationId } }).then(() => refetchTerms())
    }
  }, [open, organizationId, termsData, ensureDefaultTerms, refetchTerms])

  const users = (usersData?.usersByOrganization?.users ?? []) as Array<{ id: string; firstName: string; lastName: string }>
  const paymentTerms = (termsData?.paymentTerms ?? []) as Array<{ id: string; name: string }>
  const priceLists = (priceListData?.priceLists ?? []) as Array<{ id: string; title: string }>

  const [createVendor, { loading: creating }] = useMutation(CREATE_VENDOR, {
    onCompleted: () => {
      toast.success('Vendor created as draft.')
      onSaved()
      onOpenChange(false)
    },
    onError: (e) => toast.error(e.message ?? 'Failed to create vendor'),
  })

  const [updateVendor, { loading: updating }] = useMutation(UPDATE_VENDOR, {
    onCompleted: () => {
      toast.success('Vendor updated.')
      onSaved()
      onOpenChange(false)
    },
    onError: (e) => toast.error(e.message ?? 'Failed to update vendor'),
  })

  const [addBankAccount, { loading: addingBank }] = useMutation(ADD_VENDOR_BANK_ACCOUNT, {
    onError: (e) => toast.error(e.message ?? 'Failed to add bank account'),
  })
  const [removeBankAccount, { loading: removingBank }] = useMutation(REMOVE_VENDOR_BANK_ACCOUNT, {
    onError: (e) => toast.error(e.message ?? 'Failed to remove bank account'),
  })

  const setF = <K extends keyof VendorFormState>(key: K, value: VendorFormState[K]) => {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: '' }))
  }

  /** Persist bank account immediately when editing — "Save account" previously only updated local form state. */
  const handleBankAccountSave = async (account: VendorBankAccountValue) => {
    const vendorId = editingVendor?.id
    if (!vendorId) {
      setF('bankAccounts', [...form.bankAccounts, account])
      toast.message('Bank account added — click Save vendor on the last step to persist it.')
      return
    }
    try {
      const res = await addBankAccount({
        variables: {
          vendorId,
          input: {
            accountNumber: account.accountNumber,
            bankId: account.bankId || undefined,
            currency: account.currency,
            accountHolder: account.accountHolder,
            sendMoney: account.sendMoney,
          },
        },
      })
      const saved = res.data?.addVendorBankAccount?.bankAccounts ?? []
      setF(
        'bankAccounts',
        saved.map((b: any) => ({
          id: b.id,
          accountNumber: b.accountNumber,
          bankId: b.bankId,
          bankName: b.bankName,
          currency: b.currency,
          accountHolder: b.accountHolder,
          sendMoney: !!b.sendMoney,
        })),
      )
      toast.success(
        account.sendMoney
          ? 'Bank account saved on vendor (Send money enabled).'
          : 'Bank account saved. Enable Send money if you will pay this vendor by bank transfer.',
      )
      onSaved()
    } catch {
      // onError toast already shown
    }
  }

  const handleBankAccountRemove = async (index: number) => {
    const account = form.bankAccounts[index]
    const vendorId = editingVendor?.id
    if (vendorId && account?.id) {
      try {
        const res = await removeBankAccount({
          variables: { vendorId, bankAccountId: account.id },
        })
        const saved = res.data?.removeVendorBankAccount?.bankAccounts ?? []
        setF(
          'bankAccounts',
          saved.map((b: any) => ({
            id: b.id,
            accountNumber: b.accountNumber,
            bankId: b.bankId,
            bankName: b.bankName,
            currency: b.currency,
            accountHolder: b.accountHolder,
            sendMoney: !!b.sendMoney,
          })),
        )
        toast.success('Bank account removed.')
        onSaved()
      } catch {
        // onError toast already shown
      }
      return
    }
    setF('bankAccounts', form.bankAccounts.filter((_, idx) => idx !== index))
  }

  const validateStep = (idx: number): boolean => {
    const e: Record<string, string> = {}
    if (STEPS[idx].key === 'identity' && !form.name.trim()) {
      e.name = 'Vendor name is required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => {
    if (!validateStep(stepIndex)) return
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))
  }
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1))

  const buildInput = () => {
    // Tags are already resolved to real Tag ids by TagPickerDialog (it calls createTag eagerly
    // when the user creates a new one), so we only ever send `tags` refs here.
    return {
      type: form.type,
      name: form.name.trim(),
      address: { street: form.street, city: form.city, zip: form.zip, country: form.country },
      gstTreatment: form.gstTreatment,
      gstin: form.gstin.trim() || undefined,
      pan: form.pan.trim() || undefined,
      phone: form.phone || undefined,
      mobile: form.mobile || undefined,
      email: form.email || undefined,
      website: form.website || undefined,
      tags: form.tags.map((t) => ({ tagId: t.tagId })),
      sales: {
        salesperson: form.salesperson || undefined,
        paymentTerms: form.salesPaymentTerms || undefined,
        paymentMethod: form.salesPaymentMethod || undefined,
        priceList: form.priceList || undefined,
        deliveryMethod: form.deliveryMethod || undefined,
      },
      purchase: {
        buyer: form.buyer || undefined,
        paymentTerms: form.purchasePaymentTerms || undefined,
        fiscalPosition: form.fiscalPosition || undefined,
      },
      inventory: {
        customerLocation: form.customerLocation || undefined,
        vendorLocation: form.vendorLocation || undefined,
        subcontractingLocation: form.subcontractingLocation || undefined,
      },
      misc: {
        reference: form.reference || undefined,
        company: form.company || undefined,
        slaPolicies: form.slaPolicies || undefined,
      },
      bankAccounts: form.bankAccounts.length
        ? form.bankAccounts.map((b) => ({
            accountNumber: b.accountNumber,
            bankId: b.bankId || undefined,
            currency: b.currency,
            accountHolder: b.accountHolder,
            sendMoney: b.sendMoney,
          }))
        : undefined,
      accounting: {
        accountReceivable: form.accountReceivable || undefined,
        accountPayable: form.accountPayable || undefined,
        invoiceSendingPreference: form.invoiceSendingPreference || undefined,
      },
      warnings: {
        salesOrder: form.warningSalesOrder,
        purchaseOrder: form.warningPurchaseOrder,
        picking: form.warningPicking,
      },
      internalNotes: form.internalNotes || undefined,
    }
  }

  const handleSave = () => {
    if (!validateStep(0)) {
      setStepIndex(0)
      return
    }
    const input = buildInput()
    if (isEdit && editingVendor) {
      updateVendor({ variables: { id: editingVendor.id, input } })
    } else {
      createVendor({ variables: { input: { ...input, organizationId } } })
    }
  }

  const isLastStep = stepIndex === STEPS.length - 1
  const saving = creating || updating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-4.5 w-4.5" />
            {isEdit ? `Edit vendor — ${editingVendor?.name ?? ''}` : 'New vendor'}
          </DialogTitle>
        </DialogHeader>

        {/* Step tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-border overflow-x-auto shrink-0 bg-muted/30">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStepIndex(i)}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                i === stepIndex
                  ? 'bg-primary text-primary-foreground'
                  : i < stepIndex
                    ? 'text-primary'
                    : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isEdit && loadingFullVendor ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading vendor…
            </div>
          ) : (
            <>
          {STEPS[stepIndex].key === 'identity' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Vendor type</p>
                <div className="flex gap-2">
                  {(['individual', 'company'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setF('type', t)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium capitalize ${
                        form.type === t
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {t === 'individual' ? <UserIcon className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <InputFloating label="Name *" value={form.name} onChange={(e) => setF('name', e.target.value)} error={errors.name} className="h-9 text-xs" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">Address</p>
              <div className="grid grid-cols-2 gap-3">
                <InputFloating label="Street" value={form.street} onChange={(e) => setF('street', e.target.value)} className="h-9 text-xs" />
                <InputFloating label="City" value={form.city} onChange={(e) => setF('city', e.target.value)} className="h-9 text-xs" />
                <InputFloating label="ZIP" value={form.zip} onChange={(e) => setF('zip', e.target.value)} className="h-9 text-xs" />
                <InputFloating label="Country" value={form.country} onChange={(e) => setF('country', e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
          )}

          {STEPS[stepIndex].key === 'tax' && (
            <TaxDetailsStep
              form={form}
              setF={setF}
              gstinCheck={gstinCheck}
              setGstinCheck={setGstinCheck}
              panCheck={panCheck}
              setPanCheck={setPanCheck}
            />
          )}

          {STEPS[stepIndex].key === 'contact' && (
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Phone" value={form.phone} onChange={(e) => setF('phone', e.target.value)} className="h-9 text-xs" />
              <InputFloating label="Mobile" value={form.mobile} onChange={(e) => setF('mobile', e.target.value)} className="h-9 text-xs" />
              <InputFloating label="Email" type="email" value={form.email} onChange={(e) => setF('email', e.target.value)} className="h-9 text-xs" />
              <InputFloating label="Website" value={form.website} onChange={(e) => setF('website', e.target.value)} className="h-9 text-xs" />
            </div>
          )}

          {STEPS[stepIndex].key === 'tags' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Multi-select existing tags, or create new ones inline.</p>
                <Button type="button" variant="outline" size="sm" onClick={() => setTagDialogOpen(true)}>
                  <TagsIcon className="h-3.5 w-3.5 mr-1" /> Manage tags
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {form.tags.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No tags selected.</p>
                ) : (
                  form.tags.map((t) => (
                    <Badge key={t.tagId} variant="outline" className="gap-1.5" style={{ borderColor: t.color }}>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.name}
                      <button
                        type="button"
                        onClick={() => setF('tags', form.tags.filter((x) => x.tagId !== t.tagId))}
                        className="ml-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          )}

          {STEPS[stepIndex].key === 'sales-purchase' && (
            <div className="space-y-6">
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sales</p>
                <div className="grid grid-cols-2 gap-3">
                  <SelectFloating
                    label="Salesperson"
                    value={form.salesperson}
                    onChange={(v) => setF('salesperson', typeof v === 'string' ? v : v.target.value)}
                    options={[{ value: '', label: 'Select…' }, ...users.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))]}
                    className="h-9 text-xs"
                  />
                  <SelectFloating
                    label="Payment Terms"
                    value={form.salesPaymentTerms}
                    onChange={(v) => setF('salesPaymentTerms', typeof v === 'string' ? v : v.target.value)}
                    options={[{ value: '', label: 'Select…' }, ...paymentTerms.map((t) => ({ value: t.id, label: t.name }))]}
                    className="h-9 text-xs"
                  />
                  <InputFloating label="Payment Method" value={form.salesPaymentMethod} onChange={(e) => setF('salesPaymentMethod', e.target.value)} className="h-9 text-xs" />
                  <SelectFloating
                    label="Price List"
                    value={form.priceList}
                    onChange={(v) => setF('priceList', typeof v === 'string' ? v : v.target.value)}
                    options={[{ value: '', label: 'Select…' }, ...priceLists.map((p) => ({ value: p.id, label: p.title }))]}
                    className="h-9 text-xs"
                  />
                  <InputFloating label="Delivery Method" value={form.deliveryMethod} onChange={(e) => setF('deliveryMethod', e.target.value)} className="h-9 text-xs" />
                </div>
              </section>
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Purchase</p>
                <div className="grid grid-cols-2 gap-3">
                  <SelectFloating
                    label="Buyer"
                    value={form.buyer}
                    onChange={(v) => setF('buyer', typeof v === 'string' ? v : v.target.value)}
                    options={[{ value: '', label: 'Select…' }, ...users.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))]}
                    className="h-9 text-xs"
                  />
                  <SelectFloating
                    label="Payment Terms"
                    value={form.purchasePaymentTerms}
                    onChange={(v) => setF('purchasePaymentTerms', typeof v === 'string' ? v : v.target.value)}
                    options={[{ value: '', label: 'Select…' }, ...paymentTerms.map((t) => ({ value: t.id, label: t.name }))]}
                    className="h-9 text-xs"
                  />
                  <InputFloating label="Fiscal Position" value={form.fiscalPosition} onChange={(e) => setF('fiscalPosition', e.target.value)} className="h-9 text-xs" />
                </div>
              </section>
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Inventory</p>
                <div className="grid grid-cols-3 gap-3">
                  <InputFloating label="Customer Location" value={form.customerLocation} onChange={(e) => setF('customerLocation', e.target.value)} className="h-9 text-xs" />
                  <InputFloating label="Vendor Location" value={form.vendorLocation} onChange={(e) => setF('vendorLocation', e.target.value)} className="h-9 text-xs" />
                  <InputFloating label="Subcontracting Location" value={form.subcontractingLocation} onChange={(e) => setF('subcontractingLocation', e.target.value)} className="h-9 text-xs" />
                </div>
              </section>
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Misc</p>
                <div className="grid grid-cols-3 gap-3">
                  <InputFloating label="Reference" value={form.reference} onChange={(e) => setF('reference', e.target.value)} className="h-9 text-xs" />
                  <InputFloating label="Company" value={form.company} onChange={(e) => setF('company', e.target.value)} className="h-9 text-xs" />
                  <InputFloating label="SLA Policies" value={form.slaPolicies} onChange={(e) => setF('slaPolicies', e.target.value)} className="h-9 text-xs" />
                </div>
              </section>
            </div>
          )}

          {STEPS[stepIndex].key === 'accounting' && (
            <div className="space-y-6">
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bank Accounts</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => setBankDialogOpen(true)} disabled={addingBank}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> {addingBank ? 'Saving…' : 'Add bank account'}
                  </Button>
                </div>
                {form.bankAccounts.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No bank accounts added.
                    {isEdit
                      ? ' Add one with “Send money” enabled so Pay Bills can record bank transfers.'
                      : ' Accounts are kept until you click Save vendor on the last step.'}
                  </p>
                ) : (
                  <div className="rounded-md border border-border divide-y divide-border">
                    {form.bankAccounts.map((b, i) => (
                      <div key={b.id ?? i} className="flex items-center justify-between px-3 py-2 text-xs">
                        <div>
                          <p className="font-medium">{b.accountNumber} — {b.bankName ?? '—'}</p>
                          <p className="text-muted-foreground">{b.currency} · {b.accountHolder} {b.sendMoney ? '· Send money enabled' : ''}</p>
                        </div>
                        <button
                          type="button"
                          disabled={removingBank}
                          onClick={() => void handleBankAccountRemove(i)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Customer Invoice</p>
                <SelectFloating
                  label="Invoice sending preference"
                  value={form.invoiceSendingPreference}
                  onChange={(v) => setF('invoiceSendingPreference', typeof v === 'string' ? v : v.target.value)}
                  options={INVOICE_SENDING_PREFERENCES}
                  className="h-9 text-xs max-w-xs"
                />
              </section>
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Accounting entries</p>
                <div className="grid grid-cols-2 gap-3">
                  <InputFloating label="Account Receivable" value={form.accountReceivable} onChange={(e) => setF('accountReceivable', e.target.value)} className="h-9 text-xs" />
                  <InputFloating label="Account Payable" value={form.accountPayable} onChange={(e) => setF('accountPayable', e.target.value)} className="h-9 text-xs" />
                </div>
              </section>
            </div>
          )}

          {STEPS[stepIndex].key === 'notes' && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Warnings</p>
              <div className="grid grid-cols-3 gap-3">
                <SelectFloating
                  label="On Sales Order"
                  value={form.warningSalesOrder}
                  onChange={(v) => setF('warningSalesOrder', typeof v === 'string' ? v : v.target.value)}
                  options={WARNING_LEVELS}
                  className="h-9 text-xs"
                />
                <SelectFloating
                  label="On Purchase Order"
                  value={form.warningPurchaseOrder}
                  onChange={(v) => setF('warningPurchaseOrder', typeof v === 'string' ? v : v.target.value)}
                  options={WARNING_LEVELS}
                  className="h-9 text-xs"
                />
                <SelectFloating
                  label="On Picking"
                  value={form.warningPicking}
                  onChange={(v) => setF('warningPicking', typeof v === 'string' ? v : v.target.value)}
                  options={WARNING_LEVELS}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Internal Notes</p>
                <Textarea
                  value={form.internalNotes}
                  onChange={(e) => setF('internalNotes', e.target.value)}
                  rows={5}
                  placeholder="Free-text internal notes about this vendor…"
                />
              </div>
            </div>
          )}

          {STEPS[stepIndex].key === 'activity' && (
            <div className="space-y-3">
              {isEdit && editingVendor?.id ? (
                <ActivityLogPanel entityType="VENDOR" entityId={editingVendor.id} />
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Activity history is available after the vendor is saved for the first time.
                </p>
              )}
            </div>
          )}
            </>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border shrink-0 flex-row justify-between sm:justify-between">
          <Button type="button" variant="outline" onClick={goBack} disabled={stepIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {!isLastStep ? (
              <Button type="button" onClick={goNext}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save vendor'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>

      <TagPickerDialog
        open={tagDialogOpen}
        onOpenChange={setTagDialogOpen}
        organizationId={organizationId}
        value={form.tags}
        onChange={(tags) => setF('tags', tags)}
      />
      <BankAccountDialog
        open={bankDialogOpen}
        onOpenChange={setBankDialogOpen}
        organizationId={organizationId}
        vendorName={form.name || 'Vendor'}
        onSave={(account) => void handleBankAccountSave(account)}
      />
    </Dialog>
  )
}

function TaxDetailsStep({
  form,
  setF,
  gstinCheck,
  setGstinCheck,
  panCheck,
  setPanCheck,
}: {
  form: VendorFormState
  setF: <K extends keyof VendorFormState>(key: K, value: VendorFormState[K]) => void
  gstinCheck: { status: string; message: string; valid: boolean } | null
  setGstinCheck: (v: { status: string; message: string; valid: boolean } | null) => void
  panCheck: { valid: boolean; message: string; holderType?: string | null } | null
  setPanCheck: (v: { valid: boolean; message: string; holderType?: string | null } | null) => void
}) {
  const [checking, setChecking] = useState(false)
  const [looking, setLooking] = useState(false)

  // Lazy client-side query via fetch to avoid pulling in useLazyQuery boilerplate duplication here.
  const { refetch: refetchGstin } = useQuery(CHECK_GSTIN_STATUS, {
    variables: { gstin: form.gstin || 'PENDING' },
    skip: true,
  })
  const { refetch: refetchPan } = useQuery(LOOKUP_PAN, {
    variables: { pan: form.pan || 'PENDING' },
    skip: true,
  })

  const handleCheckGstin = async () => {
    if (!form.gstin.trim()) {
      toast.error('Enter a GSTIN first')
      return
    }
    setChecking(true)
    try {
      const res = await refetchGstin({ gstin: form.gstin.trim() })
      const r = res.data?.checkGstinStatus
      if (r) {
        setGstinCheck({ status: r.status, message: r.message, valid: r.valid })
        if (r.valid) toast.success(r.message)
        else toast.error(r.message)
      }
    } catch (e: any) {
      toast.error(e.message ?? 'GSTIN check failed')
    } finally {
      setChecking(false)
    }
  }

  const handleLookupPan = async () => {
    if (!form.pan.trim()) {
      toast.error('Enter a PAN first')
      return
    }
    setLooking(true)
    try {
      const res = await refetchPan({ pan: form.pan.trim() })
      const r = res.data?.lookupPan
      if (r) {
        setPanCheck({ valid: r.valid, message: r.message, holderType: r.holderType })
        if (r.valid) toast.success(r.message)
        else toast.error(r.message)
      }
    } catch (e: any) {
      toast.error(e.message ?? 'PAN lookup failed')
    } finally {
      setLooking(false)
    }
  }

  return (
    <div className="space-y-4">
      <SelectFloating
        label="GST Treatment"
        value={form.gstTreatment}
        onChange={(v) => setF('gstTreatment', typeof v === 'string' ? v : v.target.value)}
        options={GST_TREATMENTS}
        className="h-9 text-xs"
      />
      <div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <InputFloating
              label="GSTIN"
              value={form.gstin}
              onChange={(e) => {
                setF('gstin', e.target.value.toUpperCase())
                setGstinCheck(null)
              }}
              className="h-9 text-xs"
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleCheckGstin} disabled={checking}>
            {checking ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5 mr-1" />}
            Check Status
          </Button>
        </div>
        {gstinCheck && (
          <p className={`mt-1.5 text-xs ${gstinCheck.valid ? 'text-emerald-600' : 'text-destructive'}`}>
            {gstinCheck.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <InputFloating
              label="PAN"
              value={form.pan}
              onChange={(e) => {
                setF('pan', e.target.value.toUpperCase())
                setPanCheck(null)
              }}
              className="h-9 text-xs"
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleLookupPan} disabled={looking}>
            {looking ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5 mr-1" />}
            Lookup
          </Button>
        </div>
        {panCheck && (
          <p className={`mt-1.5 text-xs ${panCheck.valid ? 'text-emerald-600' : 'text-destructive'}`}>
            {panCheck.message}
            {panCheck.holderType ? ` (${panCheck.holderType})` : ''}
          </p>
        )}
      </div>
    </div>
  )
}
