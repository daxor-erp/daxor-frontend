'use client'

import { useQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { DataTable, Column } from '@/components/DataTable'
import { Trash2, Package, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react'
import { X, Save } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      seqNo
      name
      sku
      description
      category
      brand
      unit
      price
      costPrice
      taxRate
      minStockLevel
      maxStockLevel
      reorderPoint
      barcode
      status
      organizationId
      createdAt
    }
  }
`

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      sku
    }
  }
`

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      sku
    }
  }
`

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`

export default function ProductsPage() {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
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
    organizationId: '507f1f77bcf86cd799439011',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_PRODUCTS)
  const [createProduct, { loading: saving }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      refetch()
      setAdding(false)
      reset()
    },
  })
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      refetch()
      setEditing(null)
      reset()
    },
  })
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => refetch(),
  })

  const products = data?.products ?? []

  const reset = () => {
    setFormData({
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
      organizationId: '507f1f77bcf86cd799439011',
    })
    setErrors({})
  }

  const setF = (k: string, v: string) => {
    setFormData(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = 'Required'
    if (!formData.sku.trim()) e.sku = 'Required'
    if (!formData.unit.trim()) e.unit = 'Required'
    if (!formData.price || parseFloat(formData.price) < 0) e.price = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    
    const input = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      taxRate: parseFloat(formData.taxRate) || 0,
      minStockLevel: parseFloat(formData.minStockLevel) || 0,
      maxStockLevel: parseFloat(formData.maxStockLevel) || 0,
      reorderPoint: parseFloat(formData.reorderPoint) || 0,
    }

    if (editing) {
      updateProduct({ variables: { id: editing, input } })
    } else {
      createProduct({ variables: { input } })
    }
  }

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      category: product.category || '',
      brand: product.brand || '',
      unit: product.unit,
      price: product.price?.toString() || '',
      costPrice: product.costPrice?.toString() || '',
      taxRate: product.taxRate?.toString() || '',
      minStockLevel: product.minStockLevel?.toString() || '',
      maxStockLevel: product.maxStockLevel?.toString() || '',
      reorderPoint: product.reorderPoint?.toString() || '',
      barcode: product.barcode || '',
      status: product.status,
      organizationId: product.organizationId,
    })
    setEditing(product.id)
    setAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct({ variables: { id } })
    }
  }

  const handleCancel = () => {
    setAdding(false)
    setEditing(null)
    reset()
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-50 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-600 border-gray-200',
      discontinued: 'bg-red-50 text-red-700 border-red-200',
    }
    return colors[status] || 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const stats = {
    total: products.length,
    active: products.filter((p: any) => p.status === 'active').length,
    lowStock: products.filter((p: any) => p.minStockLevel > 0).length,
    discontinued: products.filter((p: any) => p.status === 'discontinued').length,
  }

  const columns: Column[] = [
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      width: '120px',
      render: (value) => <span className="font-mono text-gray-600">{value}</span>
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      width: '250px',
      render: (value) => <span className="font-medium text-gray-800">{value}</span>
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      width: '150px',
      render: (value) => <span className="text-gray-600">{value || '—'}</span>
    },
    {
      key: 'brand',
      label: 'Brand',
      width: '150px',
      render: (value) => <span className="text-gray-600">{value || '—'}</span>
    },
    {
      key: 'unit',
      label: 'Unit',
      width: '80px',
      render: (value) => <span className="text-gray-600">{value}</span>
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      width: '100px',
      align: 'right',
      render: (value) => <span className="font-semibold text-gray-800">{formatMoney(value)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Products', value: stats.total, icon: Package, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: stats.active, icon: ShoppingCart, cls: 'text-green-600 bg-green-50' },
          { label: 'Low Stock Items', value: stats.lowStock, icon: AlertCircle, cls: 'text-orange-600 bg-orange-50' },
          { label: 'Discontinued', value: stats.discontinued, icon: TrendingUp, cls: 'text-red-600 bg-red-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Inline form panel */}
      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm mb-4 overflow-hidden">
          {/* Form toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Product' : 'New Product'}</span>
            <button onClick={handleCancel} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form fields */}
          <div className="p-3 space-y-3">
            {/* Row 1 */}
            <div className="grid grid-cols-4 gap-3">
              <InputFloating
                label="Product Name *"
                value={formData.name}
                onChange={(e) => setF('name', e.target.value)}
                error={errors.name}
                className="h-7 text-xs"
              />
              <InputFloating
                label="SKU *"
                value={formData.sku}
                onChange={(e) => setF('sku', e.target.value)}
                error={errors.sku}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Category"
                value={formData.category}
                onChange={(e) => setF('category', e.target.value)}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Brand"
                value={formData.brand}
                onChange={(e) => setF('brand', e.target.value)}
                className="h-7 text-xs"
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 gap-3">
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
                className="h-7 text-xs"
              />
              <InputFloating
                label="Price *"
                type="number"
                value={formData.price}
                onChange={(e) => setF('price', e.target.value)}
                error={errors.price}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Cost Price"
                type="number"
                value={formData.costPrice}
                onChange={(e) => setF('costPrice', e.target.value)}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Tax Rate (%)"
                type="number"
                value={formData.taxRate}
                onChange={(e) => setF('taxRate', e.target.value)}
                className="h-7 text-xs"
              />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-4 gap-3">
              <InputFloating
                label="Min Stock Level"
                type="number"
                value={formData.minStockLevel}
                onChange={(e) => setF('minStockLevel', e.target.value)}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Max Stock Level"
                type="number"
                value={formData.maxStockLevel}
                onChange={(e) => setF('maxStockLevel', e.target.value)}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Reorder Point"
                type="number"
                value={formData.reorderPoint}
                onChange={(e) => setF('reorderPoint', e.target.value)}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Barcode"
                value={formData.barcode}
                onChange={(e) => setF('barcode', e.target.value)}
                className="h-7 text-xs"
              />
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 gap-3">
              <InputFloating
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setF('description', e.target.value)}
                className="text-xs min-h-[60px]"
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
                className="h-7 text-xs"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleCancel} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update Product' : 'Save Product'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products DataTable */}
      <DataTable
        data={products}
        columns={columns}
        loading={loading}
        title="All Products"
        onAdd={() => setAdding(true)}
        addLabel="New Product"
        searchable
        searchPlaceholder="Search products..."
        emptyMessage="No products yet. Click 'New Product' to add one."
        onRowClick={handleEdit}
        actions={[
          {
            label: 'Edit',
            icon: <Package className="h-3.5 w-3.5" />,
            onClick: (row) => handleEdit(row),
            variant: 'ghost',
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (row) => handleDelete(row.id),
            variant: 'ghost',
          },
        ]}
      />
    </div>
  )
}
