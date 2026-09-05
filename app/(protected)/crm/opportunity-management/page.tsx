'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_OPPORTUNITIES, CREATE_OPPORTUNITY, UPDATE_OPPORTUNITY, DELETE_OPPORTUNITY, GET_USERS } from '@/gql/queries'
import { Trash2, Edit, X, Save, TrendingUp, DollarSign, Plus, Target } from 'lucide-react'

const EMPTY_FORM = {
  name: '',
  accountName: '',
  contactName: '',
  email: '',
  phone: '',
  amount: '',
  closeDate: '',
  stage: 'prospecting',
  probability: '10',
  leadSource: '',
  nextStep: '',
  description: '',
  assignedTo: '',
}

export default function OpportunityManagementPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_OPPORTUNITIES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const [createOpportunity, { loading: saving }] = useMutation(CREATE_OPPORTUNITY, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [updateOpportunity, { loading: updating }] = useMutation(UPDATE_OPPORTUNITY, {
    onCompleted: () => { refetch(); setEditing(null); reset() },
  })

  const [deleteOpportunity] = useMutation(DELETE_OPPORTUNITY, {
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
    const input = {
      ...form,
      amount: form.amount ? parseFloat(form.amount) : undefined,
      probability: parseInt(form.probability),
      assignedTo: form.assignedTo || undefined,
      organizationId: orgId,
    }
    if (editing) {
      updateOpportunity({ variables: { id: editing, input } })
    } else {
      createOpportunity({ variables: { input } })
    }
  }

  const handleEdit = (opp: any) => {
    setForm({
      name: opp.name || '',
      accountName: opp.accountName || '',
      contactName: opp.contactName || '',
      email: opp.email || '',
      phone: opp.phone || '',
      amount: opp.amount?.toString() || '',
      closeDate: opp.closeDate?.split('T')[0] || '',
      stage: opp.stage || 'prospecting',
      probability: opp.probability?.toString() || '10',
      leadSource: opp.leadSource || '',
      nextStep: opp.nextStep || '',
      description: opp.description || '',
      assignedTo: opp.assignedTo || '',
    })
    setEditing(opp.id)
    setAdding(true)
  }

  const opportunities = data?.opportunities || []
  const users = usersData?.usersByOrganization?.users || []

  const totalValue = opportunities.reduce((sum: number, o: any) => sum + (o.amount || 0), 0)
  const avgProbability = opportunities.length > 0 ? Math.round(opportunities.reduce((sum: number, o: any) => sum + (o.probability || 0), 0) / opportunities.length) : 0
  const closedWon = opportunities.filter((o: any) => o.stage === 'closed-won').length

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: (v) => <MonoCell value={v} /> },
    { key: 'name', label: 'Opportunity Name', sortable: true, render: (v) => <span className="text-sm font-medium">{v}</span> },
    { key: 'accountName', label: 'Account', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', render: (v) => v ? <AmountCell value={v} /> : '—' },
    { key: 'closeDate', label: 'Close Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'stage', label: 'Stage', width: '130px', render: (v) => <ErpBadge status={String(v)} /> },
    { key: 'probability', label: 'Probability', width: '100px', render: (v) => `${v || 0}%` },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Opportunity Management"
        subtitle="Track and manage sales opportunities"
        icon={<Target className="h-5 w-5" />}
        breadcrumbs={[{ label: 'CRM' }, { label: 'Opportunity Management' }]}
        actions={
          <Button onClick={() => { reset(); setEditing(null); setAdding(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Opportunity
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total Opportunities" value={opportunities.length} icon={<TrendingUp className="h-5 w-5" />} variant="blue" />
        <StatCard label="Total Value" value={`₹${(totalValue / 1000).toFixed(1)}k`} icon={<DollarSign className="h-5 w-5" />} variant="green" />
        <StatCard label="Avg Probability" value={`${avgProbability}%`} icon={<Target className="h-5 w-5" />} variant="violet" />
        <StatCard label="Closed Won" value={closedWon} icon={<TrendingUp className="h-5 w-5" />} variant="green" />
      </StatsRow>

      {adding && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Opportunity' : 'New Opportunity'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <InputFloating label="Opportunity Name *" value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} className="h-7 text-xs" />
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Account Name" value={form.accountName} onChange={e => setF('accountName', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Contact Name" value={form.contactName} onChange={e => setF('contactName', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Email" type="email" value={form.email} onChange={e => setF('email', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <InputFloating label="Phone" value={form.phone} onChange={e => setF('phone', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Amount" type="number" value={form.amount} onChange={e => setF('amount', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Close Date" type="date" value={form.closeDate} onChange={e => setF('closeDate', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Probability (%)" type="number" min="0" max="100" value={form.probability} onChange={e => setF('probability', e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <SelectFloating label="Stage" value={form.stage} onChange={e => setF('stage', typeof e === 'string' ? e : e.target.value)} options={[{ value: 'prospecting', label: 'Prospecting' }, { value: 'qualification', label: 'Qualification' }, { value: 'needs-analysis', label: 'Needs Analysis' }, { value: 'proposal', label: 'Proposal' }, { value: 'negotiation', label: 'Negotiation' }, { value: 'closed-won', label: 'Closed Won' }, { value: 'closed-lost', label: 'Closed Lost' }]} className="h-7 text-xs" />
              <InputFloating label="Lead Source" value={form.leadSource} onChange={e => setF('leadSource', e.target.value)} className="h-7 text-xs" />
              <SelectFloating label="Assigned To" value={form.assignedTo} onChange={e => setF('assignedTo', typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'None' }, ...users.map((u: any) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))]} className="h-7 text-xs" />
            </div>
            <InputFloating label="Next Step" value={form.nextStep} onChange={e => setF('nextStep', e.target.value)} className="h-7 text-xs" />
            <InputFloating label="Description" multiline rows={2} value={form.description} onChange={e => setF('description', e.target.value)} className="text-xs" />
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setEditing(null); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={opportunities}
        columns={columns}
        loading={loading}
        title="All Opportunities"
        searchable
        searchPlaceholder="Search opportunities…"
        emptyMessage="No opportunities yet. Click New Opportunity to create one."
        pageSize={25}
        onRowClick={handleEdit}
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: (row) => handleEdit(row) },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (row) => { if (confirm('Delete this opportunity?')) deleteOpportunity({ variables: { id: row.id } }) },
          },
        ]}
      />
    </div>
  )
}
