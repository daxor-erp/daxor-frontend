'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { GET_CONTRACTORS, CREATE_CONTRACTOR, UPDATE_CONTRACTOR, DELETE_CONTRACTOR } from '@/gql/queries'
import { Users, Save, X, Edit, Trash2 } from 'lucide-react'

const EMPTY_FORM = { name: '', contactPerson: '', email: '', phone: '', specialty: '', address: '' }

export default function ContractorsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_CONTRACTORS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createContractor, { loading: saving }] = useMutation(CREATE_CONTRACTOR, {
    onCompleted: () => { refetch(); reset() },
  })

  const [updateContractor, { loading: updating }] = useMutation(UPDATE_CONTRACTOR, {
    onCompleted: () => { refetch(); reset() },
  })

  const [deleteContractor] = useMutation(DELETE_CONTRACTOR, {
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
      updateContractor({ variables: { id: editing, input } })
    } else {
      createContractor({ variables: { input } })
    }
  }

  const handleEdit = (contractor: any) => {
    setForm({
      name: contractor.name || '',
      contactPerson: contractor.contactPerson || '',
      email: contractor.email || '',
      phone: contractor.phone || '',
      specialty: contractor.specialty || '',
      address: contractor.address || '',
    })
    setEditing(contractor.id)
    setAdding(true)
  }

  const contractors = data?.contractors || []

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'name', label: 'Contractor Name', sortable: true },
    { key: 'contactPerson', label: 'Contact Person', width: '150px' },
    { key: 'email', label: 'Email', render: v => <span className="text-xs">{v || '—'}</span> },
    { key: 'phone', label: 'Phone', width: '130px' },
    { key: 'specialty', label: 'Specialty', width: '120px', render: v => v ? <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{v}</span> : '—' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contractors</h1>
        <p className="text-gray-500">Manage production contractors and subcontractors</p>
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Contractor' : 'New Contractor'}</span>
            <button onClick={reset} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Contractor Name *" value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} className="h-7 text-xs" />
              <InputFloating label="Contact Person" value={form.contactPerson} onChange={e => setF('contactPerson', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Email" type="email" value={form.email} onChange={e => setF('email', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Phone" value={form.phone} onChange={e => setF('phone', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Specialty" value={form.specialty} onChange={e => setF('specialty', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Address" value={form.address} onChange={e => setF('address', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={reset} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs"><Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={contractors}
        columns={columns}
        loading={loading}
        title="All Contractors"
        onAdd={() => setAdding(true)}
        addLabel="New Contractor"
        searchable
        searchPlaceholder="Search contractors..."
        emptyMessage="No contractors yet."
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete?')) deleteContractor({ variables: { id: row.id } }) }, variant: 'ghost' },
        ]}
      />
    </div>
  )
}
