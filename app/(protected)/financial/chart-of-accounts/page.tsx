'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_CHART_OF_ACCOUNTS, CREATE_CHART_OF_ACCOUNT, UPDATE_CHART_OF_ACCOUNT, DELETE_CHART_OF_ACCOUNT } from '@/gql/queries'
import { Trash2, Edit, X, Save } from 'lucide-react'

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

  const typeColor: Record<string, string> = {
    asset: 'bg-blue-100 text-blue-700',
    liability: 'bg-red-100 text-red-700',
    equity: 'bg-purple-100 text-purple-700',
    revenue: 'bg-green-100 text-green-700',
    expense: 'bg-orange-100 text-orange-700',
  }

  const columns: Column[] = [
    { key: 'accountCode', label: 'Code', width: '100px', sortable: true, render: v => <span className="font-mono text-xs font-medium">{v}</span> },
    { key: 'accountNumber', label: 'Account #', width: '120px', sortable: true, render: v => <span className="font-mono text-xs text-gray-600">{v || '—'}</span> },
    { key: 'accountName', label: 'Account Name', sortable: true, render: v => <span className="font-medium">{v}</span> },
    { key: 'accountType', label: 'Type', width: '110px', render: v => <span className={`px-2 py-0.5 rounded text-xs capitalize ${typeColor[v]}`}>{v}</span> },
    { key: 'level', label: 'Level', width: '80px', render: v => <span className="text-xs">{v}</span> },
    { key: 'isActive', label: 'Status', width: '90px', render: v => <span className={`px-2 py-0.5 rounded text-xs ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{v ? 'Active' : 'Inactive'}</span> },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chart of Accounts</h1>
        <p className="text-gray-500">Manage your account hierarchy</p>
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Account' : 'New Account'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
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
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
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
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Account"
        searchable
        searchPlaceholder="Search accounts..."
        emptyMessage="No accounts yet. Click 'New Account' to create one."
        onRowClick={handleEdit}
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete this account?')) deleteAccount({ variables: { id: row.id } }) }, variant: 'ghost' },
        ]}
      />
    </div>
  )
}
