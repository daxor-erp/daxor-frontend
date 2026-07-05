'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@apollo/client'
import { Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '@/gql/queries'

export type ProductFormValues = {
  name: string
  sku: string
  description: string
  category: string
  brand: string
  unit: string
  price: string
  costPrice: string
  taxRate: string
  minStockLevel: string
  maxStockLevel: string
  reorderPoint: string
  barcode: string
  status: string
}

const EMPTY: ProductFormValues = {
  name: '',
  sku: '',
  description: '',
  category: '',
  brand: '',
  unit: 'pcs',
  price: '',
  costPrice: '',
  taxRate: '',
  minStockLevel: '',
  maxStockLevel: '',
  reorderPoint: '',
  barcode: '',
  status: 'active',
}

type ProductFormProps = {
  mode: 'create' | 'edit'
  productId?: string
  initialValues?: Partial<ProductFormValues>
  organizationId: string
}

export function ProductForm({ mode, productId, initialValues, organizationId }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ProductFormValues>({ ...EMPTY, ...initialValues })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => router.push('/inventory/products'),
  })
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => router.push('/inventory/products'),
  })

  const setF = (k: keyof ProductFormValues, v: string) => {
    setFormData((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = 'Required'
    if (!formData.sku.trim()) e.sku = 'Required'
    if (!formData.unit.trim()) e.unit = 'Required'
    if (!formData.price || Number.parseFloat(formData.price) < 0) e.price = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate() || !organizationId) return

    const input = {
      ...formData,
      organizationId,
      price: Number.parseFloat(formData.price) || 0,
      costPrice: Number.parseFloat(formData.costPrice) || 0,
      taxRate: Number.parseFloat(formData.taxRate) || 0,
      minStockLevel: Number.parseFloat(formData.minStockLevel) || 0,
      maxStockLevel: Number.parseFloat(formData.maxStockLevel) || 0,
      reorderPoint: Number.parseFloat(formData.reorderPoint) || 0,
    }

    if (mode === 'edit' && productId) {
      updateProduct({ variables: { id: productId, input } })
    } else {
      createProduct({ variables: { input } })
    }
  }

  const saving = creating || updating

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">
            {mode === 'edit' ? 'Edit Product' : 'New Product'}
          </h2>
          <button
            type="button"
            onClick={() => router.push('/inventory/products')}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InputFloating
              label="Product Name *"
              value={formData.name}
              onChange={(e) => setF('name', e.target.value)}
              error={errors.name}
            />
            <InputFloating
              label="SKU *"
              value={formData.sku}
              onChange={(e) => setF('sku', e.target.value)}
              error={errors.sku}
            />
            <InputFloating
              label="Category"
              value={formData.category}
              onChange={(e) => setF('category', e.target.value)}
            />
            <InputFloating
              label="Brand"
              value={formData.brand}
              onChange={(e) => setF('brand', e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SelectFloating
              label="Unit *"
              value={formData.unit}
              onChange={(e) => setF('unit', typeof e === 'string' ? e : e.target.value)}
              options={[
                { value: 'pcs', label: 'Pieces' },
                { value: 'kg', label: 'Kilogram' },
                { value: 'ltr', label: 'Liter' },
                { value: 'box', label: 'Box' },
                { value: 'set', label: 'Set' },
              ]}
              error={errors.unit}
            />
            <InputFloating
              label="Sales Price *"
              type="number"
              value={formData.price}
              onChange={(e) => setF('price', e.target.value)}
              error={errors.price}
            />
            <InputFloating
              label="Cost"
              type="number"
              value={formData.costPrice}
              onChange={(e) => setF('costPrice', e.target.value)}
            />
            <InputFloating
              label="Tax Rate (%)"
              type="number"
              value={formData.taxRate}
              onChange={(e) => setF('taxRate', e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InputFloating
              label="Min Stock Level"
              type="number"
              value={formData.minStockLevel}
              onChange={(e) => setF('minStockLevel', e.target.value)}
            />
            <InputFloating
              label="Max Stock Level"
              type="number"
              value={formData.maxStockLevel}
              onChange={(e) => setF('maxStockLevel', e.target.value)}
            />
            <InputFloating
              label="Reorder Point"
              type="number"
              value={formData.reorderPoint}
              onChange={(e) => setF('reorderPoint', e.target.value)}
            />
            <InputFloating
              label="Barcode"
              value={formData.barcode}
              onChange={(e) => setF('barcode', e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputFloating
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setF('description', e.target.value)}
            />
            <SelectFloating
              label="Status"
              value={formData.status}
              onChange={(e) => setF('status', typeof e === 'string' ? e : e.target.value)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'discontinued', label: 'Discontinued' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="outline" onClick={() => router.push('/inventory/products')}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-teal-700 hover:bg-teal-800 text-white min-w-[120px]"
            >
              <Save className="h-4 w-4 mr-1.5" />
              {saving ? 'Saving…' : mode === 'edit' ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
