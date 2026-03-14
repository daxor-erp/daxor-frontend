'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { DataTable, Column } from '@/components/DataTable'
import { Trash2, Package, Box, Archive, AlertTriangle } from 'lucide-react'
import { X, Save, Edit } from 'lucide-react'
import { GET_ITEMS, CREATE_ITEM, UPDATE_ITEM, DELETE_ITEM } from '@/gql/queries'

export default function ItemsPage() {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: 'pcs',
    rate: '',
    status: 'active',
    organizationId: '507f1f77bcf86cd799439011',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_ITEMS, {
    variables: { organizationId: '507f1f77bcf86cd799439011', page: 1, limit: 100 }
  })
  
  const [createItem, { loading: saving }] = useMutation(CREATE_ITEM, {
    onCompleted: () => {
      refetch()
      setAdding(false)
      reset()
    },
  })
  
  const [updateItem, { loading: updating }] = useMutation(UPDATE_ITEM, {
    onCompleted: () => {
      refetch()
      setEditing(null)
      reset()
    },
  })
  
  const [deleteItem] = useMutation(DELETE_ITEM, {
    onCompleted: () => refetch(),
  })

  const items = data?.items ?? []

  const reset = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      unit: 'pcs',
      rate: '',
      status: 'active',
      organizationId: '507f1f77bcf86cd799439011',
    })
    setErrors({})}

  const setF = (k: string, v: string) => {
    setFormData(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = 'Required'
    if (!formData.unit.trim()) e.unit = 'Required'
    if (!formData.rate || parseFloat(formData.rate) < 0) e.rate = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    
    const input = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      unit: formData.unit,
      rate: parseFloat(formData.rate) || 0,
      organizationId: formData.organizationId,
    }

    if (editing) {
      // Include status for update
      updateItem({ variables: { id: editing, input: { ...input, status: formData.status } } })
    } else {
      // Exclude status for create until backend is restarted
      createItem({ variables: { input } })
    }
  }

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category || '',
      unit: item.unit,
      rate: item.rate?.toString() || '',
      status: item.status,
      organizationId: item.organizationId,
    })
    setEditing(item.id)
    setAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem({ variables: { id } })
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
    }
    return colors[status] || 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const stats = {
    total: items.length,
    active: items.filter((i: any) => i.status === 'active').length,
    inactive: items.filter((i: any) => i.status === 'inactive').length,
    categories: new Set(items.map((i: any) => i.category).filter(Boolean)).size,
  }

  const columns: Column[] = [
    {
      key: 'seqNo',
      label: 'Code',
      sortable: true,
      width: '100px',
      render: (value) => <span className="font-mono text-gray-600">{value || '—'}</span>
    },
    {
      key: 'name',
      label: 'Item Name',
      sortable: true,
      width: '250px',
      render: (value) => <span className="font-medium text-gray-800">{value}</span>
    },
    {
      key: 'description',
      label: 'Description',
      width: '200px',
      render: (value) => <span className="text-gray-600">{value || '—'}</span>
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
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
      key: 'rate',
      label: 'Rate',
      sortable: true,
      width: '100px',
      align: 'right',
      render: (value) => <span className="font-semibold text-gray-800">${Number(value).toFixed(2)}</span>
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
          <h1 className="text-3xl font-bold">Inventory Items</h1>
          <p className="text-gray-500">Manage inventory items and materials</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Items', value: stats.total, icon: Package, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: stats.active, icon: Box, cls: 'text-green-600 bg-green-50' },
          { label: 'Inactive', value: stats.inactive, icon: Archive, cls: 'text-gray-600 bg-gray-50' },
          { label: 'Categories', value: stats.categories, icon: AlertTriangle, cls: 'text-purple-600 bg-purple-50' },
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
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Item' : 'New Item'}</span>
            <button onClick={handleCancel} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form fields */}
          <div className="p-3 space-y-3">
            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-3">
              <InputFloating
                label="Item Name *"
                value={formData.name}
                onChange={(e) => setF('name', e.target.value)}
                error={errors.name}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Category"
                value={formData.category}
                onChange={(e) => setF('category', e.target.value)}
                className="h-7 text-xs"
              />
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
                  { value: 'm', label: 'Meter' },
                  { value: 'ft', label: 'Feet' },
                ]}
                error={errors.unit}
                className="h-7 text-xs"
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-3">
              <InputFloating
                label="Rate *"
                type="number"
                value={formData.rate}
                onChange={(e) => setF('rate', e.target.value)}
                error={errors.rate}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Status"
                value={formData.status}
                onChange={(e) => setF('status', typeof e === 'string' ? e : e.target.value)}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                className="h-7 text-xs"
              />
              <div></div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 gap-3">
              <InputFloating
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setF('description', e.target.value)}
                className="text-xs min-h-[60px]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleCancel} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update Item' : 'Save Item'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Items DataTable */}
      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        title="All Items"
        onAdd={() => setAdding(true)}
        addLabel="New Item"
        searchable
        searchPlaceholder="Search items..."
        emptyMessage="No items yet. Click 'New Item' to add one."
        actions={[
          {
            label: 'Edit',
            icon: <Edit className="h-3.5 w-3.5" />,
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
