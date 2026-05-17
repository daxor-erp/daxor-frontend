'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_OPPORTUNITIES, CREATE_OPPORTUNITY, UPDATE_OPPORTUNITY, DELETE_OPPORTUNITY, GET_USERS } from '@/gql/queries'
import { Trash2, Edit, X, Save, TrendingUp, DollarSign } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'

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

  const stageColor: Record<string, string> = {
    prospecting: 'bg-blue-100 text-blue-700',
    qualification: 'bg-yellow-100 text-yellow-700',
    'needs-analysis': 'bg-orange-100 text-orange-700',
    proposal: 'bg-purple-100 text-purple-700',
    negotiation: 'bg-pink-100 text-pink-700',
    'closed-won': 'bg-green-100 text-green-700',
    'closed-lost': 'bg-red-100 text-red-700',
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'name', label: 'Opportunity Name', sortable: true, render: v => <span className="font-medium">{v}</span> },
    { key: 'accountName', label: 'Account', render: v => <span className="text-xs">{v || '—'}</span> },
    { key: 'amount', label: 'Amount', width: '120px', render: v => v ? formatMoney(v) : '—' },
    { key: 'closeDate', label: 'Close Date', width: '110px', render: v => v ? formatDate(v) : '—' },
    { key: 'stage', label: 'Stage', width: '130px', render: v => <span className={`px-2 py-0.5 rounded text-xs ${stageColor[v]}`}>{v.replace('-', ' ')}</span> },
    { key: 'probability', label: 'Probability', width: '100px', render: v => `${v || 0}%` },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Opportunity Management</h1>
        <p className="text-gray-500">Track and manage sales opportunities</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Opportunities', value: opportunities.length, icon: TrendingUp, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Total Value', value: formatMoney(totalValue), icon: DollarSign, cls: 'text-green-600 bg-green-50' },
          { label: 'Avg Probability', value: `${avgProbability}%`, icon: TrendingUp, cls: 'text-purple-600 bg-purple-50' },
          { label: 'Closed Won', value: opportunities.filter((o: any) => o.stage === 'closed-won').length, icon: TrendingUp, cls: 'text-green-600 bg-green-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Opportunity' : 'New Opportunity'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
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
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
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
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Opportunity"
        searchable
        searchPlaceholder="Search opportunities..."
        emptyMessage="No opportunities yet. Click 'New Opportunity' to create one."
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete this opportunity?')) deleteOpportunity({ variables: { id: row.id } }) }, variant: 'ghost' },
        ]}
      />
    </div>
  )
}
