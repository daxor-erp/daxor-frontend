'use client'

import { useQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { DataTable, Column } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Trash2, Users, UserPlus, Building2, Mail } from 'lucide-react'
import { X, Save } from 'lucide-react'

const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      name
      email
      phone
      company
      city
      status
      createdAt
    }
  }
`

const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      name
      email
    }
  }
`

const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`

export default function ClientsPage() {
  const [adding, setAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    website: '',
    industry: '',
    notes: '',
    status: 'prospect',
    organizationId: '507f1f77bcf86cd799439011',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_CLIENTS)
  const [createClient, { loading: saving, error: saveError }] = useMutation(CREATE_CLIENT, {
    onCompleted: () => {
      refetch()
      setAdding(false)
      reset()
    },
  })
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    onCompleted: () => refetch(),
  })

  const clients = data?.clients ?? []

  const reset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      website: '',
      industry: '',
      notes: '',
      status: 'prospect',
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
    if (!formData.email.trim()) e.email = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    createClient({ variables: { input: formData } })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient({ variables: { id } })
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-50 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-600 border-gray-200',
      prospect: 'bg-blue-50 text-blue-700 border-blue-200',
      lead: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    }
    return colors[status] || 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const stats = {
    total: clients.length,
    active: clients.filter((c: any) => c.status === 'active').length,
    prospect: clients.filter((c: any) => c.status === 'prospect').length,
    lead: clients.filter((c: any) => c.status === 'lead').length,
  }

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: '200px',
      render: (value) => <span className="font-medium text-gray-800">{value}</span>
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      width: '220px',
      render: (value) => <span className="text-gray-600">{value}</span>
    },
    {
      key: 'phone',
      label: 'Phone',
      width: '140px',
      render: (value) => <span className="text-gray-600">{value || '—'}</span>
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      width: '180px',
      render: (value) => <span className="text-gray-700">{value || '—'}</span>
    },
    {
      key: 'city',
      label: 'City',
      width: '140px',
      render: (value) => <span className="text-gray-600">{value || '—'}</span>
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
          <h1 className="text-3xl font-bold">CRM - Clients</h1>
          <p className="text-gray-500">Manage your client relationships</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Clients', value: stats.total, icon: Users, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: stats.active, icon: UserPlus, cls: 'text-green-600 bg-green-50' },
          { label: 'Prospects', value: stats.prospect, icon: Building2, cls: 'text-indigo-600 bg-indigo-50' },
          { label: 'Leads', value: stats.lead, icon: Mail, cls: 'text-yellow-600 bg-yellow-50' },
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
            <span className="text-xs font-semibold text-white">New Client</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form fields */}
          <div className="p-3 space-y-3">
            {/* Row 1 */}
            <div className="grid grid-cols-4 gap-3">
              <InputFloating
                label="Name"
                value={formData.name}
                onChange={(e) => setF('name', e.target.value)}
                error={errors.name}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setF('email', e.target.value)}
                error={errors.email}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Phone"
                value={formData.phone}
                onChange={(e) => setF('phone', e.target.value)}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Company"
                value={formData.company}
                onChange={(e) => setF('company', e.target.value)}
                className="h-7 text-xs"
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 gap-3">
              <InputFloating
                label="City"
                value={formData.city}
                onChange={(e) => setF('city', e.target.value)}
                className="h-7 text-xs"
              />
              <InputFloating
                label="State"
                value={formData.state}
                onChange={(e) => setF('state', e.target.value)}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Country"
                value={formData.country}
                onChange={(e) => setF('country', e.target.value)}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Zip Code"
                value={formData.zipCode}
                onChange={(e) => setF('zipCode', e.target.value)}
                className="h-7 text-xs"
              />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-3 gap-3">
              <InputFloating
                label="Website"
                value={formData.website}
                onChange={(e) => setF('website', e.target.value)}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Industry"
                value={formData.industry}
                onChange={(e) => setF('industry', e.target.value)}
                className="h-7 text-xs"
              />
              <SelectFloating
                label="Status"
                value={formData.status}
                onChange={(e) => setF('status', typeof e === 'string' ? e : e.target.value)}
                options={[
                  { value: 'prospect', label: 'Prospect' },
                  { value: 'lead', label: 'Lead' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                className="h-7 text-xs"
              />
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 gap-3">
              <InputFloating
                label="Address"
                multiline
                value={formData.address}
                onChange={(e) => setF('address', e.target.value)}
                className="text-xs min-h-[60px]"
                rows={2}
              />
              <InputFloating
                label="Notes"
                multiline
                value={formData.notes}
                onChange={(e) => setF('notes', e.target.value)}
                className="text-xs min-h-[60px]"
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div>
                {saveError && <p className="text-xs text-red-500">{saveError.message}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
                  <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Client'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clients DataTable */}
      <DataTable
        data={clients}
        columns={columns}
        loading={loading}
        title="All Clients"
        onAdd={() => setAdding(true)}
        addLabel="New Client"
        searchable
        searchPlaceholder="Search clients..."
        emptyMessage="No clients yet. Click 'New Client' to add one."
        actions={[
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
