'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
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
import { Trash2, Edit, X, Save, TrendingUp, Eye, Plus, Users, UserPlus, CheckCircle2, Clock } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'
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
    onCompleted: () => {
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

  const ratingColor: Record<string, string> = {
    hot: 'bg-red-100 text-red-700',
    warm: 'bg-orange-100 text-orange-700',
    cold: 'bg-primary/10 text-primary',
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: (v) => <MonoCell value={v} /> },
    { key: 'firstName', label: 'Name', sortable: true, render: (v, row) => <span className="text-sm font-medium">{v} {row.lastName}</span> },
    { key: 'company', label: 'Company', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'email', label: 'Email', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'phone', label: 'Phone', width: '120px', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <ErpBadge status={String(v)} /> },
    { key: 'rating', label: 'Rating', width: '80px', render: (v) => v ? <span className={`px-2 py-0.5 rounded text-xs ${ratingColor[v]}`}>{v}</span> : '—' },
    { key: 'estimatedValue', label: 'Value', width: '120px', align: 'right', render: (v) => v ? <AmountCell value={v} /> : '—' },
    { key: 'expectedCloseDate', label: 'Close', width: '110px', render: (v) => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Lead Management"
        subtitle="Track and manage sales leads"
        icon={<Users className="h-5 w-5" />}
        breadcrumbs={[{ label: 'CRM' }, { label: 'Lead Management' }]}
        actions={
          <Button onClick={() => { reset(); setEditing(null); setAdding(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Lead
          </Button>
        }
      />

      <StatsRow cols={5}>
        <StatCard label="Total" value={stats.total} icon={<Users className="h-5 w-5" />} variant="slate" />
        <StatCard label="New" value={stats.new} icon={<UserPlus className="h-5 w-5" />} variant="blue" />
        <StatCard label="Contacted" value={stats.contacted} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Qualified" value={stats.qualified} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Converted" value={stats.converted} icon={<TrendingUp className="h-5 w-5" />} variant="violet" />
      </StatsRow>

      {adding && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Lead' : 'New Lead'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
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
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[110px]">
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
        searchable
        searchPlaceholder="Search leads…"
        emptyMessage="No leads yet. Click New Lead to create one."
        pageSize={25}
        onRowClick={handleEdit}
        actions={[
          {
            label: 'View',
            icon: <Eye className="h-3.5 w-3.5" />,
            onClick: (row) => setLeadView(row),
          },
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: (row) => handleEdit(row) },
          {
            label: 'Convert',
            icon: <TrendingUp className="h-3.5 w-3.5" />,
            onClick: (row) => setConvertModal({ show: true, lead: row }),
            show: (row: any) => row.status !== 'converted' && row.status !== 'pending_approval',
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (row) => { if (confirm('Delete this lead?')) deleteLead({ variables: { id: row.id } }) },
          },
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
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full mx-4 border border-border">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Convert Lead to Opportunity</h3>
              <button onClick={() => setConvertModal({ show: false, lead: null })} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="erp-page-desc">
                Are you sure you want to convert this lead to an opportunity?
              </p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-sm font-medium">{convertModal.lead.firstName} {convertModal.lead.lastName}</p>
                {convertModal.lead.company && <p className="text-xs text-muted-foreground">{convertModal.lead.company}</p>}
                {convertModal.lead.email && <p className="text-xs text-muted-foreground">{convertModal.lead.email}</p>}
                {convertModal.lead.estimatedValue && <p className="text-xs text-muted-foreground">Value: {formatMoney(convertModal.lead.estimatedValue)}</p>}
              </div>
              <p className="text-xs text-muted-foreground">
                This will create a new opportunity and mark the lead as converted.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 bg-muted/30 rounded-b-lg">
              <Button variant="outline" size="sm" onClick={() => setConvertModal({ show: false, lead: null })} disabled={converting}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => convertLead({ variables: { id: convertModal.lead.id } })} disabled={converting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
