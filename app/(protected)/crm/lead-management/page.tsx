'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  GET_LEADS,
  CREATE_LEAD,
  UPDATE_LEAD,
  DELETE_LEAD,
  CONVERT_LEAD_TO_OPPORTUNITY,
  GET_USERS,
} from '@/gql/queries'
import { Trash2, Edit, X, Save, TrendingUp, Eye } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'
import { StatusBadge } from '@/components/ui/status-badge'
import { useRouter } from 'next/navigation'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  company: '',
  title: '',
  email: '',
  phone: '',
  source: '',
  status: 'new',
  rating: 'warm',
  estimatedValue: '',
  expectedCloseDate: '',
  assignedTo: '',
  notes: '',
}

export default function LeadManagementPage() {
  const { user } = useAuth()
  const router = useRouter()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [convertModal, setConvertModal] = useState<{ show: boolean; lead: any | null }>({ show: false, lead: null })
  const [leadView, setLeadView] = useState<any | null>(null)

  const { data, loading, refetch } = useQuery(GET_LEADS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const [createLead, { loading: saving }] = useMutation(CREATE_LEAD, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [updateLead, { loading: updating }] = useMutation(UPDATE_LEAD, {
    onCompleted: () => { refetch(); setEditing(null); reset() },
  })

  const [deleteLead] = useMutation(DELETE_LEAD, {
    onCompleted: () => refetch(),
  })

  const [convertLead, { loading: converting }] = useMutation(CONVERT_LEAD_TO_OPPORTUNITY, {
    onCompleted: (data) => {
      refetch()
      setConvertModal({ show: false, lead: null })
      router.push('/crm/opportunity-management')
    },
    onError: (error) => {
      console.error('Convert error:', error)
      alert('Failed to convert lead: ' + error.message)
    },
  })

  const reset = () => { setForm({ ...EMPTY_FORM }); setErrors({}) }
  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      ...form,
      estimatedValue: form.estimatedValue ? parseFloat(form.estimatedValue) : undefined,
      assignedTo: form.assignedTo || undefined,
      organizationId: orgId,
    }
    if (editing) {
      updateLead({ variables: { id: editing, input } })
    } else {
      createLead({ variables: { input } })
    }
  }

  const handleEdit = (lead: any) => {
    setForm({
      firstName: lead.firstName || '',
      lastName: lead.lastName || '',
      company: lead.company || '',
      title: lead.title || '',
      email: lead.email || '',
      phone: lead.phone || '',
      source: lead.source || '',
      status: lead.status || 'new',
      rating: lead.rating || 'warm',
      estimatedValue: lead.estimatedValue?.toString() || '',
      expectedCloseDate: lead.expectedCloseDate?.split('T')[0] || '',
      assignedTo: lead.assignedTo || '',
      notes: lead.notes || '',
    })
    setEditing(lead.id)
    setAdding(true)
  }

  const leads = data?.leads || []
  const users = usersData?.usersByOrganization?.users || []

  const stats = {
    total: leads.length,
    new: leads.filter((l: any) => l.status === 'new').length,
    contacted: leads.filter((l: any) => l.status === 'contacted').length,
    qualified: leads.filter((l: any) => l.status === 'qualified').length,
    converted: leads.filter((l: any) => l.status === 'converted').length,
  }

  const statusColor: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-green-100 text-green-700',
    unqualified: 'bg-red-100 text-red-700',
    converted: 'bg-purple-100 text-purple-700',
    pending_approval: 'bg-amber-100 text-amber-900',
    approval_rejected: 'bg-rose-100 text-rose-800',
  }

  const ratingColor: Record<string, string> = {
    hot: 'bg-red-100 text-red-700',
    warm: 'bg-orange-100 text-orange-700',
    cold: 'bg-blue-100 text-blue-700',
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'firstName', label: 'Name', sortable: true, render: (v, row) => <span className="font-medium">{v} {row.lastName}</span> },
    { key: 'company', label: 'Company', render: v => <span className="text-xs">{v || '—'}</span> },
    { key: 'email', label: 'Email', render: v => <span className="text-xs">{v || '—'}</span> },
    { key: 'phone', label: 'Phone', width: '120px' },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <StatusBadge status={String(v)} /> },
    { key: 'rating', label: 'Rating', width: '80px', render: v => v ? <span className={`px-2 py-0.5 rounded text-xs ${ratingColor[v]}`}>{v}</span> : '—' },
    { key: 'estimatedValue', label: 'Value', width: '120px', render: v => v ? formatMoney(v) : '—' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead Management</h1>
        <p className="text-gray-500">Track and manage sales leads</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, cls: 'text-blue-600 bg-blue-50' },
          { label: 'New', value: stats.new, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Contacted', value: stats.contacted, cls: 'text-yellow-600 bg-yellow-50' },
          { label: 'Qualified', value: stats.qualified, cls: 'text-green-600 bg-green-50' },
          { label: 'Converted', value: stats.converted, cls: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-lg font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Lead' : 'New Lead'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="First Name *" value={form.firstName} onChange={e => setF('firstName', e.target.value)} error={errors.firstName} className="h-7 text-xs" />
              <InputFloating label="Last Name *" value={form.lastName} onChange={e => setF('lastName', e.target.value)} error={errors.lastName} className="h-7 text-xs" />
              <InputFloating label="Company" value={form.company} onChange={e => setF('company', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Title" value={form.title} onChange={e => setF('title', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Email" type="email" value={form.email} onChange={e => setF('email', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Phone" value={form.phone} onChange={e => setF('phone', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <InputFloating label="Source" value={form.source} onChange={e => setF('source', e.target.value)} className="h-7 text-xs" />
              <SelectFloating label="Status" value={form.status} onChange={e => setF('status', typeof e === 'string' ? e : e.target.value)} options={[{ value: 'new', label: 'New' }, { value: 'contacted', label: 'Contacted' }, { value: 'qualified', label: 'Qualified' }, { value: 'unqualified', label: 'Unqualified' }, { value: 'pending_approval', label: 'Pending approval' }, { value: 'approval_rejected', label: 'Approval declined' }]} className="h-7 text-xs" />
              <SelectFloating label="Rating" value={form.rating} onChange={e => setF('rating', typeof e === 'string' ? e : e.target.value)} options={[{ value: 'hot', label: 'Hot' }, { value: 'warm', label: 'Warm' }, { value: 'cold', label: 'Cold' }]} className="h-7 text-xs" />
              <SelectFloating label="Assigned To" value={form.assignedTo} onChange={e => setF('assignedTo', typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'None' }, ...users.map((u: any) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))]} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Estimated Value" type="number" value={form.estimatedValue} onChange={e => setF('estimatedValue', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Expected Close Date" type="date" value={form.expectedCloseDate} onChange={e => setF('expectedCloseDate', e.target.value)} className="h-7 text-xs" />
            </div>
            <InputFloating label="Notes" multiline rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} className="text-xs" />
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setEditing(null); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update' : 'Save Lead'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={leads}
        columns={columns}
        loading={loading}
        title="All Leads"
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Lead"
        searchable
        searchPlaceholder="Search leads..."
        emptyMessage="No leads yet. Click 'New Lead' to create one."
        onRowClick={handleEdit}
        actions={[
          {
            label: 'View',
            icon: <Eye className="h-3.5 w-3.5" />,
            onClick: row => setLeadView(row),
            variant: 'ghost',
          },
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          {
            label: 'Convert',
            icon: <TrendingUp className="h-3.5 w-3.5" />,
            onClick: row => setConvertModal({ show: true, lead: row }),
            variant: 'ghost',
            show: (row: any) => row.status !== 'converted' && row.status !== 'pending_approval',
          },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete this lead?')) deleteLead({ variables: { id: row.id } }) }, variant: 'ghost' },
        ]}
      />

      <Dialog open={leadView != null} onOpenChange={(o) => !o && setLeadView(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {leadView ? `${leadView.firstName ?? ''} ${leadView.lastName ?? ''}`.trim() || 'Lead' : 'Lead'}
            </DialogTitle>
          </DialogHeader>
          <pre className="text-[11px] rounded border bg-slate-50 p-3 overflow-auto max-h-[60vh] whitespace-pre-wrap">
            {leadView ? JSON.stringify(leadView, null, 2) : ''}
          </pre>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setLeadView(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {convertModal.show && convertModal.lead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Convert Lead to Opportunity</h3>
              <button onClick={() => setConvertModal({ show: false, lead: null })} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600">
                Are you sure you want to convert this lead to an opportunity?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="text-sm font-medium">{convertModal.lead.firstName} {convertModal.lead.lastName}</p>
                {convertModal.lead.company && <p className="text-xs text-gray-600">{convertModal.lead.company}</p>}
                {convertModal.lead.email && <p className="text-xs text-gray-600">{convertModal.lead.email}</p>}
                {convertModal.lead.estimatedValue && <p className="text-xs text-gray-600">Value: {formatMoney(convertModal.lead.estimatedValue)}</p>}
              </div>
              <p className="text-xs text-gray-500">
                This will create a new opportunity and mark the lead as converted.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 rounded-b-lg">
              <Button variant="outline" size="sm" onClick={() => setConvertModal({ show: false, lead: null })} disabled={converting}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => convertLead({ variables: { id: convertModal.lead.id } })} disabled={converting} className="bg-blue-600 hover:bg-blue-700 text-white">
                <TrendingUp className="h-4 w-4 mr-1" />
                {converting ? 'Converting...' : 'Convert to Opportunity'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
