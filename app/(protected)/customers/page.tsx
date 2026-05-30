'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_CUSTOMERS, CREATE_CUSTOMER, UPDATE_CUSTOMER, DELETE_CUSTOMER } from '@/gql/queries'
import { Trash2, Edit, X, Save, Users, CheckCircle, XCircle } from 'lucide-react'

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
  bankName: '',
  bankAccountNumber: '',
  bankIfsc: '',
  bankBranch: '',
  notes: '',
}

export default function CustomersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createCustomer, { loading: saving }] = useMutation(CREATE_CUSTOMER, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [updateCustomer, { loading: updating }] = useMutation(UPDATE_CUSTOMER, {
    onCompleted: () => { refetch(); setEditing(null); setAdding(false); reset() },
  })

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
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
    if (editing) {
      const { ...updateInput } = form as any
      updateCustomer({ variables: { id: editing, input: updateInput } })
    } else {
      createCustomer({ variables: { input: { ...form, organizationId: orgId } } })
    }
  }

  const handleEdit = (customer: any) => {
    setForm({
      name: customer.name || '',
      contactPerson: customer.contactPerson || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      country: customer.country || '',
      zipCode: customer.zipCode || '',
      taxNumber: customer.taxNumber || '',
      paymentTerms: customer.paymentTerms || '',
      bankName: customer.bankName || '',
      bankAccountNumber: customer.bankAccountNumber || '',
      bankIfsc: customer.bankIfsc || '',
      bankBranch: customer.bankBranch || '',
      notes: customer.notes || '',
    })
    setEditing(customer.id)
    setAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this customer?')) deleteCustomer({ variables: { id } })
  }

  const customers = data?.customers ?? []
  const stats = {
    total: customers.length,
    active: customers.filter((c: any) => c.status === 'active').length,
    inactive: customers.filter((c: any) => c.status === 'inactive').length,
  }

  const columns: Column[] = [
    { key: 'docNumber', label: 'Code', width: '130px', render: v => <span className="font-mono text-gray-500 text-xs">{v || '—'}</span> },
    { key: 'name', label: 'Customer Name', sortable: true, render: v => <span className="font-medium text-gray-800">{v}</span> },
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
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-gray-500">Manage your customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Customers', value: stats.total, icon: Users, cls: 'text-blue-600 bg-blue-50' },
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
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Customer' : 'New Customer'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Customer Name *" value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} className="h-7 text-xs" />
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
              <InputFloating label="Bank name" value={form.bankName} onChange={e => setF('bankName', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Account number" value={form.bankAccountNumber} onChange={e => setF('bankAccountNumber', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="IFSC / routing" value={form.bankIfsc} onChange={e => setF('bankIfsc', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Branch" value={form.bankBranch} onChange={e => setF('bankBranch', e.target.value)} className="h-7 text-xs" />
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
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update' : 'Save Customer'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={customers}
        columns={columns}
        loading={loading}
        title="All Customers"
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Customer"
        searchable
        searchPlaceholder="Search customers..."
        emptyMessage="No customers yet. Click 'New Customer' to add one."
        onRowClick={handleEdit}
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => handleDelete(row.id), variant: 'ghost' },
        ]}
      />
    </div>
  )
}
