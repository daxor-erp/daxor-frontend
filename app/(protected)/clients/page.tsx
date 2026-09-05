'use client'

import { useQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { DataTable, Column } from '@/components/DataTable'
import { Trash2, Users, UserPlus, Building2, Mail, X, Save, Eye, CheckCircle2, Globe, Phone, MapPin, Briefcase, TrendingUp, Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, StatsRow, StatCard, ErpBadge } from '@/components/ui/erp-shared'

const GET_CLIENTS = gql`
  query GetClients($organizationId: ID) {
    clients(organizationId: $organizationId) {
      id
      name
      email
      phone
      company
      address
      city
      state
      country
      zipCode
      website
      industry
      notes
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
    deleteClient(id: $id) {
      id
      name
    }
  }
`

export default function ClientsPage() {
  const { user } = useAuth()
  const [adding, setAdding] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [viewClient, setViewClient] = useState<any>(null)
  const [showClientsPanel, setShowClientsPanel] = useState(false)
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
    organizationId: user?.organizationId ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_CLIENTS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
    fetchPolicy: 'network-only',
  })
  const [createClient, { loading: saving, error: saveError }] = useMutation(CREATE_CLIENT, {
    onCompleted: (res) => {
      refetch()
      setAdding(false)
      reset()
      setSuccessMsg(`Client "${res.createClient.name}" created successfully!`)
      setTimeout(() => setSuccessMsg(''), 4000)
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
      organizationId: user?.organizationId ?? '',
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
      if (viewClient?.id === id) setViewClient(null)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-50 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-600 border-gray-200',
      prospect: 'bg-primary/10 text-primary border-primary/20',
      lead: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    }
    return colors[status] || 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const stats = {
    total: clients.length,
    active: clients.filter((c: any) => c.status === 'active').length,
    inactive: clients.filter((c: any) => c.status === 'inactive').length,
    prospect: clients.filter((c: any) => c.status === 'prospect').length,
    lead: clients.filter((c: any) => c.status === 'lead').length,
    withCompany: clients.filter((c: any) => c.company).length,
  }

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: '180px',
      render: (value) => <span className="text-sm font-medium">{value}</span>
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      width: '200px',
      render: (value) => <span className="text-sm text-muted-foreground">{value}</span>
    },
    {
      key: 'phone',
      label: 'Phone',
      width: '130px',
      render: (value) => <span className="text-sm text-muted-foreground">{value || '—'}</span>
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      width: '160px',
      render: (value) => <span className="text-sm text-muted-foreground">{value || '—'}</span>
    },
    {
      key: 'city',
      label: 'City',
      width: '120px',
      render: (value) => <span className="text-sm text-muted-foreground">{value || '—'}</span>
    },
    {
      key: 'industry',
      label: 'Industry',
      width: '130px',
      render: (value) => <span className="text-sm text-muted-foreground">{value || '—'}</span>
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: (value) => <ErpBadge status={String(value)} />
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Clients"
        subtitle="Manage your client relationships"
        icon={<Users className="h-5 w-5" />}
        breadcrumbs={[{ label: 'CRM' }, { label: 'Clients' }]}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => { refetch(); setShowClientsPanel(true) }}
              variant="outline"
            >
              <Users className="h-4 w-4 mr-1.5" />
              View Clients ({clients.length})
            </Button>
            <Button
              onClick={() => { setAdding(true); setViewClient(null) }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              New Client
            </Button>
          </div>
        }
      />

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMsg}
        </div>
      )}

      <StatsRow cols={5}>
        <StatCard label="Total Clients" value={stats.total} icon={<Users className="h-5 w-5" />} variant="blue" />
        <StatCard label="Active" value={stats.active} icon={<UserPlus className="h-5 w-5" />} variant="green" />
        <StatCard label="Prospects" value={stats.prospect} icon={<TrendingUp className="h-5 w-5" />} variant="slate" />
        <StatCard label="Leads" value={stats.lead} icon={<Mail className="h-5 w-5" />} variant="amber" />
        <StatCard label="Inactive" value={stats.inactive} icon={<Building2 className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      {/* Inline form panel */}
      {adding && (
        <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">New Client</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-primary-foreground/80 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3 space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <InputFloating label="Name *" value={formData.name} onChange={(e) => setF('name', e.target.value)} error={errors.name} className="h-7 text-xs" />
              <InputFloating label="Email *" type="email" value={formData.email} onChange={(e) => setF('email', e.target.value)} error={errors.email} className="h-7 text-xs" />
              <InputFloating label="Phone" value={formData.phone} onChange={(e) => setF('phone', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Company" value={formData.company} onChange={(e) => setF('company', e.target.value)} className="h-7 text-xs" />
            </div>

            <div className="grid grid-cols-4 gap-3">
              <InputFloating label="City" value={formData.city} onChange={(e) => setF('city', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="State" value={formData.state} onChange={(e) => setF('state', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Country" value={formData.country} onChange={(e) => setF('country', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Zip Code" value={formData.zipCode} onChange={(e) => setF('zipCode', e.target.value)} className="h-7 text-xs" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Website" value={formData.website} onChange={(e) => setF('website', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Industry" value={formData.industry} onChange={(e) => setF('industry', e.target.value)} className="h-7 text-xs" />
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

            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Address" multiline value={formData.address} onChange={(e) => setF('address', e.target.value)} className="text-xs min-h-[60px]" rows={2} />
              <InputFloating label="Notes" multiline value={formData.notes} onChange={(e) => setF('notes', e.target.value)} className="text-xs min-h-[60px]" rows={2} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div>{saveError && <p className="text-xs text-red-500">{saveError.message}</p>}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
                <Button size="sm" onClick={handleSubmit} disabled={saving} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]">
                  <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Client'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table + View Panel side by side */}
      <div className={`flex gap-4 ${viewClient ? 'items-start' : ''}`}>
        <div className={viewClient ? 'flex-1 min-w-0' : 'w-full'}>
          <DataTable
            data={clients}
            columns={columns}
            loading={loading}
            title="All Clients"
            searchable
            searchPlaceholder="Search clients…"
            emptyMessage="No clients yet. Click New Client to add one."
            pageSize={25}
            onRowClick={(row) => setViewClient(row)}
            actions={[
              {
                label: 'View',
                icon: <Eye className="h-3.5 w-3.5" />,
                onClick: (row) => setViewClient(row),
              },
              {
                label: 'Delete',
                icon: <Trash2 className="h-3.5 w-3.5" />,
                onClick: (row) => handleDelete(row.id),
              },
            ]}
          />
        </div>

        {/* View Client Panel */}
        {viewClient && (
          <div className="w-80 shrink-0 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-primary">
              <span className="text-sm font-semibold text-white">Client Details</span>
              <button onClick={() => setViewClient(null)} className="text-primary-foreground/80 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
                  {viewClient.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{viewClient.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(viewClient.status)}`}>
                    {viewClient.status}
                  </span>
                </div>
              </div>

              <hr />

              {/* Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-gray-700">{viewClient.email}</p>
                  </div>
                </div>

                {viewClient.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-gray-700">{viewClient.phone}</p>
                    </div>
                  </div>
                )}

                {viewClient.company && (
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Company</p>
                      <p className="text-gray-700">{viewClient.company}</p>
                    </div>
                  </div>
                )}

                {viewClient.industry && (
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Industry</p>
                      <p className="text-gray-700">{viewClient.industry}</p>
                    </div>
                  </div>
                )}

                {(viewClient.city || viewClient.country) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-gray-700">
                        {[viewClient.address, viewClient.city, viewClient.state, viewClient.country, viewClient.zipCode].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {viewClient.website && (
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Website</p>
                      <a href={viewClient.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{viewClient.website}</a>
                    </div>
                  </div>
                )}

                {viewClient.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-400 mb-1">Notes</p>
                    <p className="text-gray-600 text-xs leading-relaxed">{viewClient.notes}</p>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-400">Created At</p>
                  <p className="text-gray-600 text-xs">{new Date(viewClient.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full h-8 text-xs"
                  onClick={() => handleDelete(viewClient.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Client
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Clients Panel Overlay */}
      {showClientsPanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowClientsPanel(false)} />
          <div className="relative ml-auto w-[480px] h-full bg-white shadow-2xl flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-primary">
              <div>
                <p className="text-white font-semibold text-base">All Clients</p>
                <p className="text-primary-foreground/80 text-xs">{clients.length} client{clients.length !== 1 ? 's' : ''} found</p>
              </div>
              <button onClick={() => setShowClientsPanel(false)} className="text-primary-foreground/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading && (
                <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading clients…</div>
              )}
              {!loading && clients.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Users className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">No clients created yet.</p>
                  <p className="text-xs mt-1">Click "New Client" to add your first client.</p>
                </div>
              )}
              {clients.map((client: any) => (
                <div
                  key={client.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => { setViewClient(client); setShowClientsPanel(false) }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {client.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-800 text-sm truncate">{client.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border shrink-0 ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{client.email}</p>
                      {client.company && <p className="text-xs text-gray-400">{client.company}</p>}
                      {(client.city || client.country) && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {[client.city, client.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel Footer */}
            <div className="px-4 py-3 border-t border-gray-200">
              <Button
                className="w-full h-9 text-sm bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => { setShowClientsPanel(false); setAdding(true) }}
              >
                <UserPlus className="h-4 w-4 mr-2" /> Add New Client
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
