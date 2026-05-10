'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { GET_JOURNAL_ENTRIES, CREATE_JOURNAL_ENTRY, POST_JOURNAL_ENTRY, DELETE_JOURNAL_ENTRY, GET_CHART_OF_ACCOUNTS } from '@/gql/queries'
import { Trash2, X, Save, Plus, Minus, CheckCircle } from 'lucide-react'

const EMPTY_LINE = { accountCode: '', accountName: '', debit: '', credit: '', description: '' }

export default function MakeJournalEntriesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    entryNumber: '',
    entryDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    description: '',
    lines: [{ ...EMPTY_LINE }, { ...EMPTY_LINE }],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_JOURNAL_ENTRIES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: accountsData } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createEntry, { loading: saving }] = useMutation(CREATE_JOURNAL_ENTRY, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [postEntry] = useMutation(POST_JOURNAL_ENTRY, {
    onCompleted: () => refetch(),
  })

  const [deleteEntry] = useMutation(DELETE_JOURNAL_ENTRY, {
    onCompleted: () => refetch(),
  })

  const reset = () => {
    setForm({
      entryNumber: '',
      entryDate: new Date().toISOString().split('T')[0],
      referenceNumber: '',
      description: '',
      lines: [{ ...EMPTY_LINE }, { ...EMPTY_LINE }],
    })
    setErrors({})
  }

  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const setLine = (idx: number, k: string, v: string) => {
    const newLines = [...form.lines]
    newLines[idx] = { ...newLines[idx], [k]: v }
    setForm(p => ({ ...p, lines: newLines }))
  }

  const addLine = () => {
    setForm(p => ({ ...p, lines: [...p.lines, { ...EMPTY_LINE }] }))
  }

  const removeLine = (idx: number) => {
    if (form.lines.length > 2) {
      setForm(p => ({ ...p, lines: p.lines.filter((_, i) => i !== idx) }))
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.entryNumber.trim()) e.entryNumber = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    
    const totalDebit = form.lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0)
    const totalCredit = form.lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0)
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      e.balance = 'Debits must equal credits'
    }
    
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      entryNumber: form.entryNumber,
      entryDate: form.entryDate,
      referenceNumber: form.referenceNumber || undefined,
      description: form.description,
      lines: form.lines.map(l => ({
        accountCode: l.accountCode,
        accountName: l.accountName,
        debit: parseFloat(l.debit) || 0,
        credit: parseFloat(l.credit) || 0,
        description: l.description || undefined,
      })),
      organizationId: orgId,
    }
    createEntry({ variables: { input } })
  }

  const entries = data?.journalEntries || []
  const accounts = accountsData?.chartOfAccounts || []

  const totalDebit = form.lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0)
  const totalCredit = form.lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  const statusColor: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-700',
    posted: 'bg-green-100 text-green-700',
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'entryNumber', label: 'Entry #', sortable: true, render: v => <span className="font-medium">{v}</span> },
    { key: 'entryDate', label: 'Date', width: '110px', render: v => new Date(v).toLocaleDateString() },
    { key: 'description', label: 'Description', render: v => <span className="text-xs">{v}</span> },
    { key: 'totalDebit', label: 'Debit', width: '100px', render: v => `$${v.toLocaleString()}` },
    { key: 'totalCredit', label: 'Credit', width: '100px', render: v => `$${v.toLocaleString()}` },
    { key: 'status', label: 'Status', width: '90px', render: v => <span className={`px-2 py-0.5 rounded text-xs capitalize ${statusColor[v]}`}>{v}</span> },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Make Journal Entries</h1>
        <p className="text-gray-500">Create manual journal entries</p>
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">New Journal Entry</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <InputFloating label="Entry Number *" value={form.entryNumber} onChange={e => setF('entryNumber', e.target.value)} error={errors.entryNumber} className="h-7 text-xs" />
              <InputFloating label="Entry Date" type="date" value={form.entryDate} onChange={e => setF('entryDate', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Reference #" value={form.referenceNumber} onChange={e => setF('referenceNumber', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Description *" value={form.description} onChange={e => setF('description', e.target.value)} error={errors.description} className="h-7 text-xs" />
            </div>

            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Journal Lines</span>
                <Button size="sm" onClick={addLine} className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />Add Line</Button>
              </div>
              
              {form.lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-2">
                    <InputFloating label="Account Code" value={line.accountCode} onChange={e => setLine(idx, 'accountCode', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-3">
                    <InputFloating label="Account Name" value={line.accountName} onChange={e => setLine(idx, 'accountName', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-2">
                    <InputFloating label="Debit" type="number" value={line.debit} onChange={e => setLine(idx, 'debit', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-2">
                    <InputFloating label="Credit" type="number" value={line.credit} onChange={e => setLine(idx, 'credit', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-2">
                    <InputFloating label="Description" value={line.description} onChange={e => setLine(idx, 'description', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-6">
                    {form.lines.length > 2 && (
                      <button onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700">
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex gap-4">
                  <span className="text-sm">Total Debit: <strong>${totalDebit.toFixed(2)}</strong></span>
                  <span className="text-sm">Total Credit: <strong>${totalCredit.toFixed(2)}</strong></span>
                  {isBalanced ? (
                    <span className="text-green-600 text-sm flex items-center gap-1"><CheckCircle className="h-4 w-4" />Balanced</span>
                  ) : (
                    <span className="text-red-600 text-sm">Not Balanced</span>
                  )}
                </div>
              </div>
            </div>

            {errors.balance && <p className="text-red-500 text-xs">{errors.balance}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || !isBalanced} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={entries}
        columns={columns}
        loading={loading}
        title="All Journal Entries"
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Entry"
        searchable
        searchPlaceholder="Search entries..."
        emptyMessage="No journal entries yet. Click 'New Entry' to create one."
        actions={[
          { label: 'Post', icon: <CheckCircle className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Post this entry?')) postEntry({ variables: { id: row.id } }) }, variant: 'ghost', show: (row: any) => row.status === 'draft' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete this entry?')) deleteEntry({ variables: { id: row.id } }) }, variant: 'ghost', show: (row: any) => row.status === 'draft' },
        ]}
      />
    </div>
  )
}
