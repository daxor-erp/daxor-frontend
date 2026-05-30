'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column, Action } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { GET_ASSETS, CREATE_ASSET, UPDATE_ASSET, DELETE_ASSET } from '@/gql/queries'
import {
  Plus,
  X,
  Save,
  Pencil,
  Trash2,
  Wrench,
  Package,
} from 'lucide-react'

const ASSET_TYPES = ['EQUIPMENT', 'VEHICLE', 'BUILDING', 'FURNITURE', 'IT', 'OTHER'] as const

const DEPR_METHODS = [
  { value: 'straight_line', label: 'Straight line' },
  { value: 'declining_balance', label: 'Declining balance' },
  { value: 'none', label: 'None' },
]

function fmtDate(v: string | null | undefined) {
  if (v == null || v === '') return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
}

function fmtMoney(v: number | null | undefined) {
  if (v == null || Number.isNaN(Number(v))) return '—'
  return Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

type AssetRow = {
  id: string
  assetNumber?: string | null
  assetName?: string | null
  assetType?: string | null
  category?: string | null
  purchaseDate?: string | null
  purchasePrice?: number | null
  currentValue?: number | null
  depreciationMethod?: string | null
  usefulLife?: number | null
  location?: string | null
  assignedTo?: string | null
  status?: string | null
  serialNumber?: string | null
  manufacturer?: string | null
  warrantyExpiry?: string | null
}

const emptyForm = () => ({
  assetNumber: '',
  assetName: '',
  assetType: 'EQUIPMENT',
  category: 'Equipment',
  purchaseDate: new Date().toISOString().split('T')[0],
  purchasePrice: '0',
  currentValue: '0',
  depreciationMethod: 'straight_line',
  usefulLife: '5',
  location: '',
  assignedTo: '',
  status: 'ACTIVE',
  serialNumber: '',
  manufacturer: '',
  warrantyExpiry: '',
})

export default function EquipmentMastersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [typeFilter, setTypeFilter] = useState<string>('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const { data, loading, error: listError, refetch } = useQuery(GET_ASSETS, {
    variables: {
      organizationId: orgId,
      page: 1,
      limit: 200,
      assetType: typeFilter || undefined,
    },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createAsset, { loading: creating }] = useMutation(CREATE_ASSET, {
    onCompleted: () => {
      closePanel()
      void refetch()
    },
    onError: (e) => setFormError(e.message),
  })

  const [updateAsset, { loading: updating }] = useMutation(UPDATE_ASSET, {
    onCompleted: () => {
      closePanel()
      void refetch()
    },
    onError: (e) => setFormError(e.message),
  })

  const [deleteAsset] = useMutation(DELETE_ASSET, {
    onCompleted: () => void refetch(),
    onError: (e) => alert(e.message),
  })

  const rows: AssetRow[] = data?.assets ?? []

  function closePanel() {
    setPanelOpen(false)
    setEditingId(null)
    setFormError('')
    setForm(emptyForm())
  }

  function openNew() {
    setEditingId(null)
    setForm(emptyForm())
    setFormError('')
    setPanelOpen(true)
  }

  function openEdit(r: AssetRow) {
    if (!r.id) return
    setEditingId(r.id)
    setFormError('')
    setForm({
      assetNumber: r.assetNumber ?? '',
      assetName: r.assetName ?? '',
      assetType: (r.assetType as (typeof ASSET_TYPES)[number]) || 'EQUIPMENT',
      category: r.category ?? 'Equipment',
      purchaseDate: r.purchaseDate
        ? new Date(r.purchaseDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      purchasePrice: String(r.purchasePrice ?? 0),
      currentValue: String(r.currentValue ?? 0),
      depreciationMethod: r.depreciationMethod ?? 'straight_line',
      usefulLife: String(r.usefulLife ?? 5),
      location: r.location ?? '',
      assignedTo: r.assignedTo ?? '',
      status: r.status ?? 'ACTIVE',
      serialNumber: r.serialNumber ?? '',
      manufacturer: r.manufacturer ?? '',
      warrantyExpiry: r.warrantyExpiry
        ? new Date(r.warrantyExpiry).toISOString().split('T')[0]
        : '',
    })
    setPanelOpen(true)
  }

  const setF = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    setFormError('')
  }

  const buildInput = () => {
    const purchasePrice = parseFloat(form.purchasePrice) || 0
    const currentValue = parseFloat(form.currentValue) || 0
    const usefulLife = Math.max(0, Math.round(parseFloat(form.usefulLife) || 0))
    const input: Record<string, unknown> = {
      assetNumber: form.assetNumber.trim(),
      assetName: form.assetName.trim(),
      assetType: form.assetType,
      category: form.category.trim() || 'General',
      purchaseDate: form.purchaseDate,
      purchasePrice,
      currentValue,
      depreciationMethod: form.depreciationMethod,
      usefulLife,
      location: form.location.trim() || '—',
      organizationId: orgId,
    }
    if (form.assignedTo.trim()) input.assignedTo = form.assignedTo.trim()
    if (form.status.trim()) input.status = form.status.trim()
    if (form.serialNumber.trim()) input.serialNumber = form.serialNumber.trim()
    if (form.manufacturer.trim()) input.manufacturer = form.manufacturer.trim()
    if (form.warrantyExpiry.trim()) input.warrantyExpiry = form.warrantyExpiry
    return input
  }

  const save = () => {
    if (!orgId) {
      setFormError('Organization required.')
      return
    }
    if (!form.assetNumber.trim() || !form.assetName.trim()) {
      setFormError('Asset number and name are required.')
      return
    }
    setFormError('')
    const input = buildInput()
    if (editingId) {
      updateAsset({ variables: { id: editingId, input } })
    } else {
      createAsset({ variables: { input } })
    }
  }

  const columns: Column<AssetRow>[] = [
    {
      key: 'assetNumber',
      label: 'Asset #',
      width: '120px',
      render: (v) => <span className="font-mono text-xs">{v ?? '—'}</span>,
    },
    {
      key: 'assetName',
      label: 'Name',
      render: (v) => <span className="text-xs font-medium">{v ?? '—'}</span>,
    },
    {
      key: 'assetType',
      label: 'Type',
      width: '100px',
      render: (v) => <span className="text-xs capitalize">{v ?? '—'}</span>,
    },
    {
      key: 'location',
      label: 'Location',
      render: (v) => <span className="text-xs text-gray-600">{v ?? '—'}</span>,
    },
    {
      key: 'purchasePrice',
      label: 'Cost',
      width: '88px',
      render: (v) => (
        <span className="text-xs tabular-nums">{fmtMoney(v as number)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '90px',
      render: (v) => (
        <span className="text-[10px] uppercase px-2 py-0.5 rounded border bg-gray-50">
          {v ?? '—'}
        </span>
      ),
    },
    {
      key: 'purchaseDate',
      label: 'Purchased',
      width: '100px',
      render: (v) => <span className="text-xs">{fmtDate(v as string)}</span>,
    },
  ]

  const actions: Action<AssetRow>[] = [
    {
      label: 'Edit',
      icon: <Pencil className="h-3.5 w-3.5 text-blue-600" />,
      onClick: (r) => openEdit(r),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-3.5 w-3.5 text-red-600" />,
      onClick: (r) => {
        if (!r.id) return
        if (confirm('Delete this asset record?')) deleteAsset({ variables: { id: r.id } })
      },
    },
  ]

  const saving = creating || updating

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8 text-teal-600" />
            Equipment masters
          </h1>
          <p className="text-gray-500 mt-1">
            Register and maintain equipment and other fixed assets (linked to finance fixed-asset data).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SelectFloating
            label="Type filter"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(typeof e === 'string' ? e : e.target.value)
            }
            options={[
              { value: '', label: 'All types' },
              ...ASSET_TYPES.map((t) => ({ value: t, label: t })),
            ]}
            className="h-8 text-xs w-44"
          />
          <Button type="button" onClick={() => openNew()} disabled={!orgId} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-1" />
            New equipment
          </Button>
        </div>
      </div>

      {!orgId && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          No organization on your profile.
        </p>
      )}

      {listError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {listError.message}
        </p>
      )}

      {panelOpen && (
        <div className="border border-teal-300 rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-teal-600">
            <span className="text-xs font-semibold text-white flex items-center gap-2">
              <Package className="h-4 w-4" />
              {editingId ? 'Edit equipment' : 'New equipment'}
            </span>
            <button type="button" onClick={closePanel} className="text-teal-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <InputFloating
              label="Asset number *"
              value={form.assetNumber}
              onChange={(e) => setF('assetNumber', e.target.value)}
              className="h-8"
            />
            <InputFloating
              label="Asset name *"
              value={form.assetName}
              onChange={(e) => setF('assetName', e.target.value)}
              className="h-8"
            />
            <SelectFloating
              label="Asset type *"
              value={form.assetType}
              onChange={(e) =>
                setF('assetType', typeof e === 'string' ? e : e.target.value)
              }
              options={ASSET_TYPES.map((t) => ({ value: t, label: t }))}
              className="h-8"
            />
            <InputFloating
              label="Category *"
              value={form.category}
              onChange={(e) => setF('category', e.target.value)}
              className="h-8"
            />
            <InputFloating
              label="Purchase date *"
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setF('purchaseDate', e.target.value)}
              className="h-8"
            />
            <InputFloating
              label="Purchase price *"
              type="number"
              min={0}
              step="any"
              value={form.purchasePrice}
              onChange={(e) => setF('purchasePrice', e.target.value)}
              className="h-8"
            />
            <InputFloating
              label="Current value *"
              type="number"
              min={0}
              step="any"
              value={form.currentValue}
              onChange={(e) => setF('currentValue', e.target.value)}
              className="h-8"
            />
            <SelectFloating
              label="Depreciation method *"
              value={form.depreciationMethod}
              onChange={(e) =>
                setF('depreciationMethod', typeof e === 'string' ? e : e.target.value)
              }
              options={DEPR_METHODS}
              className="h-8"
            />
            <InputFloating
              label="Useful life (years) *"
              type="number"
              min={0}
              value={form.usefulLife}
              onChange={(e) => setF('usefulLife', e.target.value)}
              className="h-8"
            />
            <InputFloating
              label="Location *"
              value={form.location}
              onChange={(e) => setF('location', e.target.value)}
              className="h-8"
            />
            <InputFloating
              label="Serial #"
              value={form.serialNumber}
              onChange={(e) => setF('serialNumber', e.target.value)}
              className="h-8"
            />
            <InputFloating
              label="Manufacturer"
              value={form.manufacturer}
              onChange={(e) => setF('manufacturer', e.target.value)}
              className="h-8"
            />
            <InputFloating
              label="Assigned to (user id)"
              value={form.assignedTo}
              onChange={(e) => setF('assignedTo', e.target.value)}
              className="h-8"
            />
            <SelectFloating
              label="Status"
              value={form.status}
              onChange={(e) => setF('status', typeof e === 'string' ? e : e.target.value)}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'IN_MAINTENANCE', label: 'In maintenance' },
                { value: 'RETIRED', label: 'Retired' },
                { value: 'DISPOSED', label: 'Disposed' },
              ]}
              className="h-8"
            />
            <InputFloating
              label="Warranty expiry"
              type="date"
              value={form.warrantyExpiry}
              onChange={(e) => setF('warrantyExpiry', e.target.value)}
              className="h-8"
            />
          </div>
          {formError && <p className="px-4 pb-2 text-xs text-red-600">{formError}</p>}
          <div className="flex justify-end gap-2 px-4 pb-4">
            <Button type="button" variant="outline" size="sm" onClick={closePanel}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={saving}
              className="bg-teal-600 hover:bg-teal-700"
              onClick={save}
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      )}

      <DataTable<AssetRow>
        data={rows}
        columns={columns}
        loading={loading}
        title="Equipment & assets"
        searchable
        searchPlaceholder="Search assets…"
        emptyMessage="No assets yet. Add equipment above."
        onRowClick={openEdit}
        actions={actions}
        rowKey="id"
      />
    </div>
  )
}
