'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { GET_SITE_LOCATIONS, CREATE_SITE_LOCATION, UPDATE_SITE_LOCATION, DELETE_SITE_LOCATION } from '@/gql/queries'
import { PageHeader, MonoCell } from '@/components/ui/erp-shared'
import { MapPin, Save, X, Edit, Trash2, Plus } from 'lucide-react'

const EMPTY_FORM = { name: '', address: '', city: '', state: '', country: '', zipCode: '', contactPerson: '', phone: '', email: '' }

export default function SiteLocationsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_SITE_LOCATIONS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createLocation, { loading: saving }] = useMutation(CREATE_SITE_LOCATION, {
    onCompleted: () => { refetch(); reset() },
  })

  const [updateLocation, { loading: updating }] = useMutation(UPDATE_SITE_LOCATION, {
    onCompleted: () => { refetch(); reset() },
  })

  const [deleteLocation] = useMutation(DELETE_SITE_LOCATION, {
    onCompleted: () => refetch(),
  })

  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const reset = () => { setForm({ ...EMPTY_FORM }); setAdding(false); setEditing(null); setErrors({}) }

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
      updateLocation({ variables: { id: editing, input } })
    } else {
      createLocation({ variables: { input } })
    }
  }

  const handleEdit = (location: any) => {
    setForm({
      name: location.name || '',
      address: location.address || '',
      city: location.city || '',
      state: location.state || '',
      country: location.country || '',
      zipCode: location.zipCode || '',
      contactPerson: location.contactPerson || '',
      phone: location.phone || '',
      email: location.email || '',
    })
    setEditing(location.id)
    setAdding(true)
  }

  const locations = data?.siteLocations || []

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: v => <MonoCell value={v} /> },
    { key: 'name', label: 'Location Name', sortable: true, render: v => <span className="text-sm font-medium">{v}</span> },
    { key: 'address', label: 'Address', render: v => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'city', label: 'City', width: '120px' },
    { key: 'state', label: 'State', width: '80px' },
    { key: 'zipCode', label: 'Zip Code', width: '100px' },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Site Locations"
        subtitle="Manage production site locations"
        icon={<MapPin className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Production' }, { label: 'Masters' }, { label: 'Site Locations' }]}
        actions={
          <Button onClick={() => setAdding(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Location
          </Button>
        }
      />

      {adding && (
        <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Location' : 'New Location'}</span>
            <button onClick={reset} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <InputFloating label="Location Name *" value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} className="h-7 text-xs" />
            <InputFloating label="Address" value={form.address} onChange={e => setF('address', e.target.value)} className="h-7 text-xs" />
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="City" value={form.city} onChange={e => setF('city', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="State" value={form.state} onChange={e => setF('state', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Zip Code" value={form.zipCode} onChange={e => setF('zipCode', e.target.value)} className="h-7 text-xs" />
            </div>
            <InputFloating label="Country" value={form.country} onChange={e => setF('country', e.target.value)} className="h-7 text-xs" />
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Contact Person" value={form.contactPerson} onChange={e => setF('contactPerson', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Phone" value={form.phone} onChange={e => setF('phone', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Email" type="email" value={form.email} onChange={e => setF('email', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={reset}>Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating}><Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={locations}
        columns={columns}
        loading={loading}
        title="All Locations"
        searchable
        searchPlaceholder="Search locations…"
        emptyMessage="No locations yet."
        pageSize={25}
        onRowClick={handleEdit}
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row) },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete?')) deleteLocation({ variables: { id: row.id } }) } },
        ]}
      />
    </div>
  )
}
