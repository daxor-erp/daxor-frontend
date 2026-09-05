'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell } from '@/components/ui/erp-shared'
import { GET_CHART_OF_ACCOUNTS, CREATE_CHART_OF_ACCOUNT, UPDATE_CHART_OF_ACCOUNT, DELETE_CHART_OF_ACCOUNT } from '@/gql/queries'
import { Trash2, Edit, X, Save, BookOpen, Plus, CheckCircle2 } from 'lucide-react'

const EMPTY_FORM = {
  accountNumber: '',
  accountName: '',
  accountType: 'asset',
  parentAccount: '',
  level: '1',
  description: '',
  isActive: true,
}

export default function ChartOfAccountsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createAccount, { loading: saving }] = useMutation(CREATE_CHART_OF_ACCOUNT, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [updateAccount, { loading: updating }] = useMutation(UPDATE_CHART_OF_ACCOUNT, {
    onCompleted: () => { refetch(); setEditing(null); reset() },
  })

  const [deleteAccount] = useMutation(DELETE_CHART_OF_ACCOUNT, {
    onCompleted: () => refetch(),
  })

  const reset = () => { setForm({ ...EMPTY_FORM }); setErrors({}) }
  const setF = (k: string, v: string | boolean) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.accountName.trim()) e.accountName = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      ...form,
      level: parseInt(form.level),
      parentAccount: form.parentAccount || undefined,
      organizationId: orgId,
    }
    if (editing) {
      updateAccount({ variables: { id: editing, input } })
    } else {
      createAccount({ variables: { input } })
    }
  }

  const handleEdit = (account: any) => {
    setForm({
      accountNumber: account.accountNumber || '',
      accountName: account.accountName || '',
      accountType: account.accountType || 'asset',
      parentAccount: account.parentAccount || '',
      level: account.level?.toString() || '1',
      description: account.description || '',
      isActive: account.isActive !== false,
    })
    setEditing(account.id)
    setAdding(true)
  }

  const accounts = data?.chartOfAccounts || []
  const stats = {
    total: accounts.length,
    active: accounts.filter((a: any) => a.isActive !== false).length,
    assets: accounts.filter((a: any) => a.accountType === 'asset').length,
  }

  const columns: Column[] = [
    { key: 'accountCode', label: 'Code', width: '100px', sortable: true, render: (v) => <MonoCell value={v} className="font-medium text-foreground" /> },
    { key: 'accountNumber', label: 'Account #', width: '120px', sortable: true, render: (v) => <MonoCell value={v} /> },
    { key: 'accountName', label: 'Account Name', sortable: true, render: (v) => <span className="text-sm font-medium">{v}</span> },
    { key: 'accountType', label: 'Type', width: '110px', render: (v) => <ErpBadge status={String(v)} label={String(v).replace(/\b\w/g, (c: string) => c.toUpperCase())} /> },
    { key: 'level', label: 'Level', width: '80px', render: (v) => <span className="text-sm tabular-nums">{v}</span> },
    { key: 'isActive', label: 'Status', width: '100px', render: (v) => <ErpBadge status={v ? 'active' : 'inactive'} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Chart of Accounts"
        subtitle="Manage your account hierarchy"
        icon={<BookOpen className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'Chart of Accounts' }]}
        actions={
          <Button
            onClick={() => { reset(); setEditing(null); setAdding(true) }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Account
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total Accounts" value={stats.total} icon={<BookOpen className="h-5 w-5" />} variant="slate" />
        <StatCard label="Active" value={stats.active} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Asset Accounts" value={stats.assets} icon={<BookOpen className="h-5 w-5" />} variant="blue" />
      </StatsRow>

      {adding && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Account' : 'New Account'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Account Number" value={form.accountNumber} onChange={e => setF('accountNumber', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Account Name *" value={form.accountName} onChange={e => setF('accountName', e.target.value)} error={errors.accountName} className="h-7 text-xs" />
              <SelectFloating label="Account Type" value={form.accountType} onChange={e => setF('accountType', typeof e === 'string' ? e : e.target.value)} options={[
                { value: 'asset', label: 'Asset' },
                { value: 'liability', label: 'Liability' },
                { value: 'equity', label: 'Equity' },
                { value: 'revenue', label: 'Revenue' },
                { value: 'expense', label: 'Expense' },
              ]} className="h-7 text-xs" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Parent Account" value={form.parentAccount} onChange={e => setF('parentAccount', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Level" type="number" value={form.level} onChange={e => setF('level', e.target.value)} className="h-7 text-xs" />
              <SelectFloating label="Status" value={form.isActive ? 'active' : 'inactive'} onChange={e => setF('isActive', (typeof e === 'string' ? e : e.target.value) === 'active')} options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]} className="h-7 text-xs" />
            </div>
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
        data={accounts}
        columns={columns}
        loading={loading}
        title="All Accounts"
        searchable
        searchPlaceholder="Search accounts…"
        emptyMessage="No accounts found."
        pageSize={25}
        onRowClick={handleEdit}
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: (row) => handleEdit(row) },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: (row) => { if (confirm('Delete this account?')) deleteAccount({ variables: { id: row.id } }) } },
        ]}
      />
    </div>
  )
}
