'use client'

import { useMemo, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_PRODUCTS,
  GET_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCT_CATEGORIES,
  GET_UOMS,
  GET_ATTRIBUTES,
  GET_TAX_RATES,
  GET_VENDORS,
  GET_WAREHOUSES,
  UPDATE_PRODUCT_QUANTITY,
  REPLENISH_PRODUCT,
} from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatMoney } from '@/lib/format-money'
import { uploadDocument, buildDownloadUrl } from '@/lib/upload'
import { downloadDocumentPdf } from '@/lib/pdf-download'
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  ShoppingCart,
  Boxes,
  X,
  ImagePlus,
  Boxes as BoxesIcon,
  TrendingUp,
  ShoppingBag,
  Layers,
  ListOrdered,
  RefreshCw,
  Printer,
  Loader2,
} from 'lucide-react'

type AttributeLineForm = { attributeId: string; valueIds: string[] }

interface ProductForm {
  id?: string
  name: string
  internalReference: string
  barcode: string
  hsnSac: string
  notes: string
  images: string[]
  canBeSold: boolean
  canBePurchased: boolean
  canBeExpensed: boolean
  productType: string
  trackInventory: boolean
  salesPrice: string
  costPrice: string
  uomId: string
  salesTaxIds: string[]
  purchaseTaxIds: string[]
  categoryId: string
  attributeLines: AttributeLineForm[]
  vendorPricelist: Array<{ vendorId: string; leadTimeDays: string; minQty: string; price: string }>
  packagings: Array<{ name: string; qtyPerPackage: string; barcode: string }>
  reorderingRules: Array<{ warehouseId: string; minQty: string; maxQty: string }>
  incomeAccount: string
  expenseAccount: string
  stockAccount: string
  status: string
  billControlPolicy: string
  // Smart-button data (read-only, hydrated from GET_PRODUCT — only populated when editing)
  onHandQty: number
  forecastedQty: number
  purchasedQty: number
  variantCount: number
}

const EMPTY: ProductForm = {
  name: '',
  internalReference: '',
  barcode: '',
  hsnSac: '',
  notes: '',
  images: [],
  canBeSold: false,
  canBePurchased: true,
  canBeExpensed: false,
  productType: 'goods',
  trackInventory: true,
  salesPrice: '',
  costPrice: '',
  uomId: '',
  salesTaxIds: [],
  purchaseTaxIds: [],
  categoryId: '',
  attributeLines: [],
  vendorPricelist: [],
  packagings: [],
  reorderingRules: [],
  incomeAccount: '',
  expenseAccount: '',
  stockAccount: '',
  status: 'active',
  billControlPolicy: '',
  onHandQty: 0,
  forecastedQty: 0,
  purchasedQty: 0,
  variantCount: 0,
}

export default function ProductsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<ProductForm>(EMPTY)
  const [tab, setTab] = useState('header')

  const { data, loading, refetch } = useQuery(GET_PRODUCTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const { data: categoryData } = useQuery(GET_PRODUCT_CATEGORIES, { variables: { organizationId: orgId }, skip: !orgId })
  const { data: uomData } = useQuery(GET_UOMS, { variables: { organizationId: orgId }, skip: !orgId })
  const { data: attributeData } = useQuery(GET_ATTRIBUTES, { variables: { organizationId: orgId }, skip: !orgId })
  const { data: taxData } = useQuery(GET_TAX_RATES, { variables: { organizationId: orgId }, skip: !orgId })
  const { data: vendorData } = useQuery(GET_VENDORS, { variables: { organizationId: orgId, page: 1, limit: 200 }, skip: !orgId })
  const { data: warehouseData } = useQuery(GET_WAREHOUSES, { variables: { organizationId: orgId }, skip: !orgId })

  const products: any[] = useMemo(() => data?.products ?? [], [data])
  const categories: any[] = categoryData?.productCategories ?? []
  const uoms: any[] = uomData?.uoms ?? []
  const attributes: any[] = attributeData?.attributes ?? []
  const taxRates: any[] = taxData?.taxRates ?? []
  const vendors: any[] = vendorData?.vendors ?? []
  const warehouses: any[] = warehouseData?.warehouses ?? []

  const stats = useMemo(
    () => ({
      total: products.length,
      purchasable: products.filter((p) => p.canBePurchased).length,
      sellable: products.filter((p) => p.canBeSold).length,
    }),
    [products],
  )

  const [createMutation, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      toast.success('Product created')
    },
    onError: (e) => toast.error(e.message),
  })
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      toast.success('Product updated')
    },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      refetch()
      toast.success('Product deleted')
    },
    onError: (e) => toast.error(e.message),
  })
  const [updateQuantityMutation, { loading: updatingQty }] = useMutation(UPDATE_PRODUCT_QUANTITY, {
    onError: (e) => toast.error(e.message),
  })
  const [replenishMutation, { loading: replenishing }] = useMutation(REPLENISH_PRODUCT, {
    onError: (e) => toast.error(e.message),
  })

  const { refetch: refetchProductDetail } = useQuery(GET_PRODUCT, { skip: true })

  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [qtyDialogOpen, setQtyDialogOpen] = useState(false)
  const [qtyValue, setQtyValue] = useState('')
  const [qtyWarehouseId, setQtyWarehouseId] = useState('')

  const openNew = () => {
    setForm({ ...EMPTY })
    setTab('header')
    setOpen(true)
  }

  const openEdit = async (row: any) => {
    setTab('header')
    setOpen(true)
    try {
      const res = await refetchProductDetail({ id: row.id })
      const p = res.data?.product
      if (!p) return
      setForm({
        id: p.id,
        name: p.name ?? '',
        internalReference: p.internalReference ?? '',
        barcode: p.barcode ?? '',
        hsnSac: p.hsnSac ?? '',
        notes: p.notes ?? '',
        images: p.images ?? [],
        canBeSold: !!p.canBeSold,
        canBePurchased: !!p.canBePurchased,
        canBeExpensed: !!p.canBeExpensed,
        productType: p.productType ?? 'goods',
        trackInventory: p.trackInventory !== false,
        salesPrice: String(p.salesPrice ?? ''),
        costPrice: String(p.costPrice ?? ''),
        uomId: p.uomId ?? '',
        salesTaxIds: p.salesTaxIds ?? [],
        purchaseTaxIds: p.purchaseTaxIds ?? [],
        categoryId: p.categoryId ?? '',
        attributeLines: (p.attributeLines ?? []).map((l: any) => ({ attributeId: l.attributeId, valueIds: l.valueIds })),
        vendorPricelist: (p.vendorPricelist ?? []).map((l: any) => ({
          vendorId: l.vendorId,
          leadTimeDays: String(l.leadTimeDays ?? 0),
          minQty: String(l.minQty ?? 1),
          price: String(l.price ?? 0),
        })),
        packagings: (p.packagings ?? []).map((pkg: any) => ({
          name: pkg.name ?? '',
          qtyPerPackage: String(pkg.qtyPerPackage ?? 1),
          barcode: pkg.barcode ?? '',
        })),
        reorderingRules: (p.reorderingRules ?? []).map((r: any) => ({
          warehouseId: r.warehouseId ?? '',
          minQty: String(r.minQty ?? 0),
          maxQty: String(r.maxQty ?? 0),
        })),
        incomeAccount: p.incomeAccount ?? '',
        expenseAccount: p.expenseAccount ?? '',
        stockAccount: p.stockAccount ?? '',
        billControlPolicy: p.billControlPolicy ?? '',
        status: p.status ?? 'active',
        onHandQty: p.onHandQty ?? 0,
        forecastedQty: p.forecastedQty ?? 0,
        purchasedQty: p.purchasedQty ?? 0,
        variantCount: (p.variants ?? []).length,
      })
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load product')
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this product?')) deleteMutation({ variables: { id } })
  }

  const setF = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => setForm((p) => ({ ...p, [key]: value }))

  const toggleAttributeLine = (attributeId: string, checked: boolean) => {
    if (checked) {
      setF('attributeLines', [...form.attributeLines, { attributeId, valueIds: [] }])
    } else {
      setF('attributeLines', form.attributeLines.filter((l) => l.attributeId !== attributeId))
    }
  }

  const toggleAttributeValue = (attributeId: string, valueId: string) => {
    setF(
      'attributeLines',
      form.attributeLines.map((l) => {
        if (l.attributeId !== attributeId) return l
        const has = l.valueIds.includes(valueId)
        return { ...l, valueIds: has ? l.valueIds.filter((v) => v !== valueId) : [...l.valueIds, valueId] }
      }),
    )
  }

  const addVendorPricelistLine = () => {
    setF('vendorPricelist', [...form.vendorPricelist, { vendorId: '', leadTimeDays: '0', minQty: '1', price: '0' }])
  }

  const addPackagingLine = () => {
    setF('packagings', [...form.packagings, { name: '', qtyPerPackage: '1', barcode: '' }])
  }

  const addReorderingRule = () => {
    setF('reorderingRules', [...form.reorderingRules, { warehouseId: '', minQty: '0', maxQty: '0' }])
  }

  const handleImageUpload = async (file: File) => {
    if (!orgId) return
    setUploadingImage(true)
    try {
      const uploaded = await uploadDocument({
        file,
        organizationId: orgId,
        parentModule: 'PRODUCT',
        parentId: form.id || 'unsaved',
        category: 'product-image',
      })
      setF('images', [...form.images, buildDownloadUrl(uploaded.downloadUrl)])
    } catch (e: any) {
      toast.error(e.message ?? 'Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (idx: number) => setF('images', form.images.filter((_, i) => i !== idx))

  const openQtyDialog = () => {
    setQtyValue(String(form.onHandQty ?? 0))
    setQtyWarehouseId('')
    setQtyDialogOpen(true)
  }

  const saveQuantity = async () => {
    if (!form.id) return
    try {
      await updateQuantityMutation({
        variables: {
          productId: form.id,
          quantity: Number(qtyValue) || 0,
          warehouseId: qtyWarehouseId || undefined,
        },
      })
      toast.success('Quantity updated')
      setQtyDialogOpen(false)
      const res = await refetchProductDetail({ id: form.id })
      const p = res.data?.product
      if (p) setForm((prev) => ({ ...prev, onHandQty: p.onHandQty ?? 0, forecastedQty: p.forecastedQty ?? 0 }))
      refetch()
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to update quantity')
    }
  }

  const handleReplenish = async () => {
    if (!form.id) return
    try {
      const res = await replenishMutation({ variables: { productId: form.id } })
      const rfq = res.data?.replenishProduct
      toast.success(`Draft RFQ ${rfq?.purchaseOrder?.seqNo ?? ''} created for ${rfq?.quantity} unit(s).`)
    } catch (e: any) {
      toast.error(e.message ?? 'Replenish failed')
    }
  }

  const handlePrintLabels = () => {
    if (!form.id) return
    downloadDocumentPdf('product-label', form.id, `labels-${form.internalReference || form.name}`).catch((e) =>
      toast.error(e.message ?? 'Failed to generate labels'),
    )
  }

  const submit = () => {
    if (!form.name.trim()) {
      toast.error('Product name is required')
      setTab('header')
      return
    }
    const input = {
      name: form.name.trim(),
      internalReference: form.internalReference.trim() || undefined,
      barcode: form.barcode.trim() || undefined,
      hsnSac: form.hsnSac.trim() || undefined,
      notes: form.notes.trim() || undefined,
      images: form.images.length ? form.images : undefined,
      canBeSold: form.canBeSold,
      canBePurchased: form.canBePurchased,
      canBeExpensed: form.canBeExpensed,
      productType: form.productType,
      trackInventory: form.trackInventory,
      salesPrice: form.salesPrice ? Number(form.salesPrice) : undefined,
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      uomId: form.uomId || undefined,
      salesTaxIds: form.salesTaxIds.length ? form.salesTaxIds : undefined,
      purchaseTaxIds: form.purchaseTaxIds.length ? form.purchaseTaxIds : undefined,
      categoryId: form.categoryId || undefined,
      attributeLines: form.attributeLines.filter((l) => l.valueIds.length > 0),
      vendorPricelist: form.vendorPricelist
        .filter((l) => l.vendorId)
        .map((l) => ({
          vendorId: l.vendorId,
          leadTimeDays: Number(l.leadTimeDays) || 0,
          minQty: Number(l.minQty) || 1,
          price: Number(l.price) || 0,
        })),
      packagings: form.packagings
        .filter((p) => p.name.trim())
        .map((p) => ({
          name: p.name.trim(),
          qtyPerPackage: Number(p.qtyPerPackage) || 1,
          barcode: p.barcode.trim() || undefined,
        })),
      reorderingRules: form.reorderingRules.map((r) => ({
        warehouseId: r.warehouseId || undefined,
        minQty: Number(r.minQty) || 0,
        maxQty: Number(r.maxQty) || 0,
      })),
      incomeAccount: form.incomeAccount || undefined,
      expenseAccount: form.expenseAccount || undefined,
      stockAccount: form.stockAccount || undefined,
      billControlPolicy: form.billControlPolicy || undefined,
      status: form.status,
    }
    if (form.id) {
      updateMutation({ variables: { id: form.id, input } })
    } else {
      createMutation({ variables: { input: { ...input, organizationId: orgId } } })
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1300px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Products"
        description="Shared catalogue for Inventory and Purchasing — the same product master feeds PO lines, GRN, and stock."
        actions={
          <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" /> New Product
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total Products" value={stats.total} icon={<Package className="h-4 w-4" />} />
        <Stat label="Purchasable" value={stats.purchasable} icon={<ShoppingCart className="h-4 w-4" />} />
        <Stat label="Sellable" value={stats.sellable} icon={<Boxes className="h-4 w-4" />} />
      </div>

      <SectionCard title="All products" bodyClassName="p-0">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No products yet</p>
            <Button onClick={openNew} className="mt-3 bg-grad-brand text-white border-none gap-1.5">
              <Plus className="h-4 w-4" /> New Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Reference</th>
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">UoM</th>
                  <th className="px-3 py-3 font-medium text-right">Sales Price</th>
                  <th className="px-3 py-3 font-medium text-right">Cost</th>
                  <th className="px-3 py-3 font-medium">Flags</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-secondary/30 cursor-pointer" onClick={() => openEdit(p)}>
                    <td className="px-5 py-3 font-mono text-xs">{p.internalReference || p.seqNo || '—'}</td>
                    <td className="px-3 py-3 font-medium">{p.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{p.category?.fullPath || '—'}</td>
                    <td className="px-3 py-3 text-muted-foreground">{p.uom?.name || '—'}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{p.salesPrice ? formatMoney(p.salesPrice) : '—'}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{p.costPrice ? formatMoney(p.costPrice) : '—'}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        {p.canBePurchased && <Badge variant="outline" className="text-[10px]">Purchase</Badge>}
                        {p.canBeSold && <Badge variant="outline" className="text-[10px]">Sales</Badge>}
                      </div>
                    </td>
                    <td className="px-3 py-3 capitalize">{p.status}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openEdit(p)} className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={form.id ? `Edit product — ${form.name}` : 'New product'}
        icon={<Package className="h-5 w-5" />}
        size="xl"
        submitting={creating || updating}
        onSubmit={submit}
        submitLabel={form.id ? 'Save changes' : 'Save product'}
        bodyClassName="px-6 py-5"
      >
        {form.id && (
          <div className="flex flex-wrap items-center gap-2 pb-4 mb-4 border-b border-border">
            <SmartButton icon={<BoxesIcon className="h-3.5 w-3.5" />} label="On Hand" value={form.onHandQty} />
            <SmartButton icon={<TrendingUp className="h-3.5 w-3.5" />} label="Forecasted" value={form.forecastedQty} />
            <SmartButton icon={<ShoppingBag className="h-3.5 w-3.5" />} label="Purchased" value={form.purchasedQty} />
            <SmartButton icon={<Layers className="h-3.5 w-3.5" />} label="Variants" value={form.variantCount} />
            <SmartButton icon={<ListOrdered className="h-3.5 w-3.5" />} label="Reordering Rules" value={form.reorderingRules.length} onClick={() => setTab('inventory')} />
            <div className="flex-1" />
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={openQtyDialog}>
              Update Quantity
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs gap-1.5" disabled={replenishing} onClick={handleReplenish}>
              {replenishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Replenish
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handlePrintLabels}>
              <Printer className="h-3.5 w-3.5" /> Print Labels
            </Button>
          </div>
        )}

        {qtyDialogOpen && form.id && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-4 space-y-3">
            <p className="text-sm font-medium text-amber-900">Update on-hand quantity</p>
            <div className="grid sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-1.5">
                <Label htmlFor="qty-warehouse">Warehouse</Label>
                <select id="qty-warehouse" value={qtyWarehouseId} onChange={(e) => setQtyWarehouseId(e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-2 text-xs">
                  <option value="">All warehouses (total)</option>
                  {warehouses.map((w: any) => <option key={w.id} value={w.id}>{w.warehouseName}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qty-value">New quantity</Label>
                <Input id="qty-value" type="number" value={qtyValue} onChange={(e) => setQtyValue(e.target.value)} className="h-9" />
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" disabled={updatingQty} onClick={saveQuantity} className="h-9">
                  {updatingQty ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null} Save
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setQtyDialogOpen(false)} className="h-9">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="overflow-x-auto no-scrollbar w-full justify-start mb-4">
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="attributes">Attributes &amp; Variants</TabsTrigger>
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="accounting">Accounting</TabsTrigger>
          </TabsList>

          <TabsContent value="header">
            <FormSection>
              <div className="flex gap-4">
                <div className="shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                      e.target.value = ''
                    }}
                  />
                  {form.images.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="h-24 w-24 rounded-lg border-2 border-dashed border-border grid place-items-center text-muted-foreground hover:bg-secondary/40"
                    >
                      {uploadingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                    </button>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {form.images.map((src, idx) => (
                        <div key={idx} className="relative h-24 w-24 rounded-lg border border-border overflow-hidden group">
                          <img src={src} alt={`Product image ${idx + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-black/60 text-white grid place-items-center opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="h-24 w-24 rounded-lg border-2 border-dashed border-border grid place-items-center text-muted-foreground hover:bg-secondary/40"
                      >
                        {uploadingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="p-name">Name *</Label>
                  <Input id="p-name" value={form.name} onChange={(e) => setF('name', e.target.value)} placeholder="TOOLS-WELDING SPOOL" />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 text-sm rounded-lg border border-border p-3 cursor-pointer hover:bg-secondary/40">
                  <Checkbox checked={form.canBeSold} onCheckedChange={(v) => setF('canBeSold', !!v)} />
                  Can be sold
                </label>
                <label className="flex items-center gap-2 text-sm rounded-lg border border-border p-3 cursor-pointer hover:bg-secondary/40">
                  <Checkbox checked={form.canBePurchased} onCheckedChange={(v) => setF('canBePurchased', !!v)} />
                  Can be purchased
                </label>
                <label className="flex items-center gap-2 text-sm rounded-lg border border-border p-3 cursor-pointer hover:bg-secondary/40">
                  <Checkbox checked={form.canBeExpensed} onCheckedChange={(v) => setF('canBeExpensed', !!v)} />
                  Can be expensed
                </label>
              </div>
            </FormSection>
          </TabsContent>

          <TabsContent value="general">
            <FormSection>
              <FieldGrid cols={2}>
                <div className="space-y-1.5">
                  <Label htmlFor="p-type">Product type</Label>
                  <select id="p-type" value={form.productType} onChange={(e) => setF('productType', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="goods">Goods</option>
                    <option value="service">Service</option>
                    <option value="combo">Combo</option>
                  </select>
                </div>
                <div className="space-y-1.5 flex items-end">
                  <label className="flex items-center gap-2 text-sm h-10">
                    <Checkbox checked={form.trackInventory} onCheckedChange={(v) => setF('trackInventory', !!v)} disabled={form.productType !== 'goods'} />
                    Track inventory
                  </label>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-sales-price">Sales price</Label>
                  <Input id="p-sales-price" type="number" value={form.salesPrice} onChange={(e) => setF('salesPrice', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-cost">Cost</Label>
                  <Input id="p-cost" type="number" value={form.costPrice} onChange={(e) => setF('costPrice', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-uom">UoM</Label>
                  <select id="p-uom" value={form.uomId} onChange={(e) => setF('uomId', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">Select…</option>
                    {uoms.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-category">Category</Label>
                  <select id="p-category" value={form.categoryId} onChange={(e) => setF('categoryId', e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">Select…</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.fullPath}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-ref">Internal reference / SKU</Label>
                  <Input id="p-ref" value={form.internalReference} onChange={(e) => setF('internalReference', e.target.value)} placeholder="Auto-generated if empty" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-barcode">Barcode</Label>
                  <Input id="p-barcode" value={form.barcode} onChange={(e) => setF('barcode', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-hsn">HSN / SAC</Label>
                  <Input id="p-hsn" value={form.hsnSac} onChange={(e) => setF('hsnSac', e.target.value)} className="font-mono" />
                </div>
              </FieldGrid>
              <div className="space-y-1.5 pt-2">
                <Label>Sales taxes</Label>
                <div className="flex flex-wrap gap-2">
                  {taxRates.filter((t: any) => t.appliesTo !== 'PURCHASE').map((t: any) => (
                    <label key={t.id} className="flex items-center gap-1.5 text-xs rounded-full border border-border px-2.5 py-1 cursor-pointer">
                      <Checkbox
                        checked={form.salesTaxIds.includes(t.id)}
                        onCheckedChange={(v) => setF('salesTaxIds', v ? [...form.salesTaxIds, t.id] : form.salesTaxIds.filter((x) => x !== t.id))}
                      />
                      {t.name} ({t.ratePercent}%)
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 pt-2">
                <Label>Purchase taxes</Label>
                <div className="flex flex-wrap gap-2">
                  {taxRates.filter((t: any) => t.appliesTo !== 'SALES').map((t: any) => (
                    <label key={t.id} className="flex items-center gap-1.5 text-xs rounded-full border border-border px-2.5 py-1 cursor-pointer">
                      <Checkbox
                        checked={form.purchaseTaxIds.includes(t.id)}
                        onCheckedChange={(v) => setF('purchaseTaxIds', v ? [...form.purchaseTaxIds, t.id] : form.purchaseTaxIds.filter((x) => x !== t.id))}
                      />
                      {t.name} ({t.ratePercent}%)
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 pt-2">
                <Label htmlFor="p-notes">Internal notes</Label>
                <textarea
                  id="p-notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setF('notes', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                />
              </div>
            </FormSection>
          </TabsContent>

          <TabsContent value="attributes">
            <FormSection description="Select an attribute and the values that apply — variants are generated from the combination of selected values.">
              {attributes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No attributes configured. Create one under Products → Attributes.</p>
              ) : (
                <div className="space-y-3">
                  {attributes.map((a: any) => {
                    const line = form.attributeLines.find((l) => l.attributeId === a.id)
                    return (
                      <div key={a.id} className="rounded-lg border border-border p-3">
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <Checkbox checked={!!line} onCheckedChange={(v) => toggleAttributeLine(a.id, !!v)} />
                          {a.name}
                        </label>
                        {line && (
                          <div className="flex flex-wrap gap-1.5 mt-2 pl-6">
                            {a.values.map((v: any) => (
                              <label key={v.id} className="flex items-center gap-1.5 text-xs rounded-full border border-border px-2.5 py-1 cursor-pointer">
                                <Checkbox checked={line.valueIds.includes(v.id)} onCheckedChange={() => toggleAttributeValue(a.id, v.id)} />
                                {v.value}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {form.id && (
                <p className="text-xs text-muted-foreground pt-2">
                  Variants are regenerated automatically on save based on the selected attribute values.
                </p>
              )}
            </FormSection>
          </TabsContent>

          <TabsContent value="purchase">
            <FormSection description="Vendor pricelist lines are optional at create time.">
              {!form.canBePurchased ? (
                <p className="text-sm text-muted-foreground">Enable "Can be purchased" on the Header tab to configure vendor pricing.</p>
              ) : (
                <div className="space-y-2">
                  {form.vendorPricelist.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_100px_100px_120px_32px] gap-2 items-end">
                      <select
                        value={line.vendorId}
                        onChange={(e) => {
                          const next = [...form.vendorPricelist]
                          next[idx] = { ...next[idx], vendorId: e.target.value }
                          setF('vendorPricelist', next)
                        }}
                        className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="">Vendor…</option>
                        {vendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                      <Input
                        type="number"
                        placeholder="Lead days"
                        value={line.leadTimeDays}
                        onChange={(e) => {
                          const next = [...form.vendorPricelist]
                          next[idx] = { ...next[idx], leadTimeDays: e.target.value }
                          setF('vendorPricelist', next)
                        }}
                        className="h-9 text-xs"
                      />
                      <Input
                        type="number"
                        placeholder="Min qty"
                        value={line.minQty}
                        onChange={(e) => {
                          const next = [...form.vendorPricelist]
                          next[idx] = { ...next[idx], minQty: e.target.value }
                          setF('vendorPricelist', next)
                        }}
                        className="h-9 text-xs"
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={line.price}
                        onChange={(e) => {
                          const next = [...form.vendorPricelist]
                          next[idx] = { ...next[idx], price: e.target.value }
                          setF('vendorPricelist', next)
                        }}
                        className="h-9 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setF('vendorPricelist', form.vendorPricelist.filter((_, i) => i !== idx))}
                        className="h-9 w-8 grid place-items-center text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addVendorPricelistLine}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add vendor pricelist line
                  </Button>
                </div>
              )}
            </FormSection>

            {form.canBePurchased && (
              <>
              <FormSection title="Bill Control Policy" description="How vendor bills are created from this product's PO lines (Odoo 19: per-product policy)." className="pt-5 border-t border-border mt-5">
                <FieldGrid cols={2}>
                  <div className="space-y-1.5">
                    <Label>Billing Policy</Label>
                    <select
                      value={form.billControlPolicy}
                      onChange={(e) => setF('billControlPolicy', e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Use PO default</option>
                      <option value="ordered_quantities">Ordered Quantities — bill on PO confirm</option>
                      <option value="received_quantities">Received Quantities — bill only after receipt</option>
                    </select>
                    <p className="text-xs text-muted-foreground">Overrides the PO-level bill control policy for this specific product.</p>
                  </div>
                </FieldGrid>
              </FormSection>

              <FormSection title="Packaging" description="Selectable packaging options (e.g. Box of 10) shown on Purchase Order lines." className="pt-5 border-t border-border mt-5">
                <div className="space-y-2">
                  {form.packagings.map((pkg, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_100px_140px_32px] gap-2 items-end">
                      <Input
                        placeholder="Name (e.g. Box of 10)"
                        value={pkg.name}
                        onChange={(e) => {
                          const next = [...form.packagings]
                          next[idx] = { ...next[idx], name: e.target.value }
                          setF('packagings', next)
                        }}
                        className="h-9 text-xs"
                      />
                      <Input
                        type="number"
                        min="1"
                        placeholder="Qty/pkg"
                        value={pkg.qtyPerPackage}
                        onChange={(e) => {
                          const next = [...form.packagings]
                          next[idx] = { ...next[idx], qtyPerPackage: e.target.value }
                          setF('packagings', next)
                        }}
                        className="h-9 text-xs"
                      />
                      <Input
                        placeholder="Barcode (optional)"
                        value={pkg.barcode}
                        onChange={(e) => {
                          const next = [...form.packagings]
                          next[idx] = { ...next[idx], barcode: e.target.value }
                          setF('packagings', next)
                        }}
                        className="h-9 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setF('packagings', form.packagings.filter((_, i) => i !== idx))}
                        className="h-9 w-8 grid place-items-center text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addPackagingLine}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add packaging
                  </Button>
                </div>
              </FormSection>
              </>
            )}
          </TabsContent>

          <TabsContent value="inventory">
            <FormSection>
              {!form.trackInventory ? (
                <p className="text-sm text-muted-foreground">Enable "Track inventory" on the General Info tab to configure routes and reordering rules.</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Tracking method: <span className="font-medium capitalize">none</span> (lot/serial tracking and routes
                  can be configured after the product is saved).
                </p>
              )}
            </FormSection>

            {form.trackInventory && (
              <FormSection title="Reordering Rules" description="Per-warehouse min/max quantity thresholds. Leave warehouse blank for an organization-wide rule." className="pt-5 border-t border-border mt-5">
                <div className="space-y-2">
                  {form.reorderingRules.map((rule, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_100px_100px_32px] gap-2 items-end">
                      <select
                        value={rule.warehouseId}
                        onChange={(e) => {
                          const next = [...form.reorderingRules]
                          next[idx] = { ...next[idx], warehouseId: e.target.value }
                          setF('reorderingRules', next)
                        }}
                        className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="">All warehouses</option>
                        {warehouses.map((w: any) => <option key={w.id} value={w.id}>{w.warehouseName}</option>)}
                      </select>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Min qty"
                        value={rule.minQty}
                        onChange={(e) => {
                          const next = [...form.reorderingRules]
                          next[idx] = { ...next[idx], minQty: e.target.value }
                          setF('reorderingRules', next)
                        }}
                        className="h-9 text-xs"
                      />
                      <Input
                        type="number"
                        min="0"
                        placeholder="Max qty"
                        value={rule.maxQty}
                        onChange={(e) => {
                          const next = [...form.reorderingRules]
                          next[idx] = { ...next[idx], maxQty: e.target.value }
                          setF('reorderingRules', next)
                        }}
                        className="h-9 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setF('reorderingRules', form.reorderingRules.filter((_, i) => i !== idx))}
                        className="h-9 w-8 grid place-items-center text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addReorderingRule}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add reordering rule
                  </Button>
                </div>
              </FormSection>
            )}
          </TabsContent>

          <TabsContent value="accounting">
            <FormSection description="Leave blank to inherit from the product's category.">
              <FieldGrid cols={3}>
                <div className="space-y-1.5">
                  <Label htmlFor="p-income">Income account</Label>
                  <Input id="p-income" value={form.incomeAccount} onChange={(e) => setF('incomeAccount', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-expense">Expense account</Label>
                  <Input id="p-expense" value={form.expenseAccount} onChange={(e) => setF('expenseAccount', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="p-stock">Stock account</Label>
                  <Input id="p-stock" value={form.stockAccount} onChange={(e) => setF('stockAccount', e.target.value)} />
                </div>
              </FieldGrid>
            </FormSection>
          </TabsContent>
        </Tabs>
      </FormModal>
    </div>
  )
}

function SmartButton({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  value: number
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-secondary/50 disabled:cursor-default"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-semibold tabular-nums">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </button>
  )
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
      <div className="p-2 rounded-md bg-blue-50 text-blue-600">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
