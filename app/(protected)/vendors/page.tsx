'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_VENDORS, CREATE_VENDOR, UPDATE_VENDOR, DELETE_VENDOR, SUBMIT_VENDOR_FOR_APPROVAL } from '@/gql/queries'
import { Trash2, Edit, X, Save, Building2, Users, CheckCircle, XCircle } from 'lucide-react'

const EMPTY_FORM = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  taxNumber: '',
  paymentTerms: '',
  notes: '',
}

export default function VendorsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const [createVendor, { loading: saving }] = useMutation(CREATE_VENDOR, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [updateVendor, { loading: updating }] = useMutation(UPDATE_VENDOR, {
    onCompleted: () => { refetch(); setEditing(null); reset() },
  })

  const [deleteVendor] = useMutation(DELETE_VENDOR, {
    onCompleted: () => refetch(),
  })

  const [submitVendorForApproval] = useMutation(SUBMIT_VENDOR_FOR_APPROVAL, {
    onCompleted: () => refetch(),
  })

  const reset = () => { setForm({ ...EMPTY_FORM }); setErrors({}) }
  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = { ...form, organizationId: orgId }
    if (editing) {
      const { ...updateInput } = input as any
      delete updateInput.organizationId
      updateVendor({ variables: { id: editing, input: updateInput } })
    } else {
      createVendor({ variables: { input } })
    }
  }

  const handleEdit = (vendor: any) => {
    setForm({
      name: vendor.name || '',
      contactPerson: vendor.contactPerson || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      address: vendor.address || '',
      city: vendor.city || '',
      state: vendor.state || '',
      country: vendor.country || '',
      zipCode: vendor.zipCode || '',
      taxNumber: vendor.taxNumber || '',
      paymentTerms: vendor.paymentTerms || '',
      notes: vendor.notes || '',
    })
    setEditing(vendor.id)
    setAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this vendor?')) deleteVendor({ variables: { id } })
  }

  const vendors = data?.vendors ?? []
  const stats = {
    total: vendors.length,
    active: vendors.filter((v: any) => v.status === 'active').length,
    inactive: vendors.filter((v: any) => v.status === 'inactive').length,
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '110px', render: v => <span className="font-mono text-gray-500 text-xs">{v || '—'}</span> },
    { key: 'name', label: 'Vendor Name', sortable: true, render: v => <span className="font-medium text-gray-800">{v}</span> },
    { key: 'contactPerson', label: 'Contact', render: v => <span className="text-gray-600">{v || '—'}</span> },
    { key: 'email', label: 'Email', render: v => <span className="text-gray-600">{v || '—'}</span> },
    { key: 'phone', label: 'Phone', width: '130px', render: v => <span className="text-gray-600">{v || '—'}</span> },
    { key: 'paymentTerms', label: 'Payment Terms', width: '130px', render: v => <span className="text-gray-600">{v || '—'}</span> },
    {
      key: 'status', label: 'Status', width: '100px',
      render: v => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${v === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
          {v}
        </span>
      )
    },
    {
      key: '_orgApproval',
      label: 'Org approval',
      width: '168px',
      render: (_v, row: any) => {
        const ap = String(row.orgApprovalStatus ?? 'approved')
        const showSubmit = ap === 'draft' || ap === 'approval_declined'
        const label =
          ap === 'draft'
            ? 'Draft'
            : ap === 'submitted'
              ? 'Pending approval'
              : ap === 'approval_declined'
                ? 'Declined'
                : 'Approved'
        return (
          <div className="flex flex-col gap-1 min-w-[140px]">
            <span className="text-xs text-gray-600">{label}</span>
            {showSubmit ? (
              <select
                aria-label="Vendor approval action"
                className="h-7 text-xs rounded-md border border-gray-200 bg-white px-2"
                defaultValue=""
                onChange={(e) => {
                  const val = e.target.value
                  e.target.value = ''
                  if (val === 'submit') void submitVendorForApproval({ variables: { id: row.id } })
                }}
              >
                <option value="">Change status…</option>
                <option value="submit">Send for approval</option>
              </select>
            ) : (
              <span className="text-xs text-gray-400">—</span>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendors</h1>
        <p className="text-gray-500">Manage your suppliers and vendors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Vendors', value: stats.total, icon: Building2, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: stats.active, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
          { label: 'Inactive', value: stats.inactive, icon: XCircle, cls: 'text-gray-600 bg-gray-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Inline form */}
      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Vendor' : 'New Vendor'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Vendor Name *" value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} className="h-7 text-xs" />
              <InputFloating label="Contact Person" value={form.contactPerson} onChange={e => setF('contactPerson', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Email" type="email" value={form.email} onChange={e => setF('email', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Phone" value={form.phone} onChange={e => setF('phone', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Tax Number" value={form.taxNumber} onChange={e => setF('taxNumber', e.target.value)} className="h-7 text-xs" />
              <SelectFloating
                label="Payment Terms"
                value={form.paymentTerms}
                onChange={e => setF('paymentTerms', typeof e === 'string' ? e : e.target.value)}
                options={[
                  { value: '', label: 'Select...' },
                  { value: 'Net 15', label: 'Net 15' },
                  { value: 'Net 30', label: 'Net 30' },
                  { value: 'Net 45', label: 'Net 45' },
                  { value: 'Net 60', label: 'Net 60' },
                  { value: 'Due on Receipt', label: 'Due on Receipt' },
                ]}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <InputFloating label="Address" value={form.address} onChange={e => setF('address', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="City" value={form.city} onChange={e => setF('city', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="State" value={form.state} onChange={e => setF('state', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Country" value={form.country} onChange={e => setF('country', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <InputFloating label="Notes" multiline rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} className="text-xs min-h-[50px]" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setEditing(null); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update' : 'Save Vendor'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={vendors}
        columns={columns}
        loading={loading}
        title="All Vendors"
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Vendor"
        searchable
        searchPlaceholder="Search vendors..."
        emptyMessage="No vendors yet. Click 'New Vendor' to add one."
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => handleDelete(row.id), variant: 'ghost' },
        ]}
      />
    </div>
  )
}
