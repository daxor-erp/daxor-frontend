'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { GET_BUDGETS, CREATE_BUDGET, ACTIVATE_BUDGET, DELETE_BUDGET, GET_CHART_OF_ACCOUNTS } from '@/gql/queries'
import { Trash2, X, Save, Plus, Minus, CheckCircle, Wallet, Clock, CheckCircle2, CircleDollarSign } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'

const EMPTY_LINE = { accountCode: '', accountName: '', period: '', amount: '' }

export default function SetUpBudgetsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    budgetName: '',
    fiscalYear: new Date().getFullYear().toString(),
    startDate: `${new Date().getFullYear()}-01-01`,
    endDate: `${new Date().getFullYear()}-12-31`,
    lines: [{ ...EMPTY_LINE }],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_BUDGETS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: accountsData } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createBudget, { loading: saving }] = useMutation(CREATE_BUDGET, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [activateBudget] = useMutation(ACTIVATE_BUDGET, {
    onCompleted: () => refetch(),
  })

  const [deleteBudget] = useMutation(DELETE_BUDGET, {
    onCompleted: () => refetch(),
  })

  const reset = () => {
    setForm({
      budgetName: '',
      fiscalYear: new Date().getFullYear().toString(),
      startDate: `${new Date().getFullYear()}-01-01`,
      endDate: `${new Date().getFullYear()}-12-31`,
      lines: [{ ...EMPTY_LINE }],
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
    if (form.lines.length > 1) {
      setForm(p => ({ ...p, lines: p.lines.filter((_, i) => i !== idx) }))
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.budgetName.trim()) e.budgetName = 'Required'
    if (!form.fiscalYear.trim()) e.fiscalYear = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      budgetName: form.budgetName,
      fiscalYear: form.fiscalYear,
      startDate: form.startDate,
      endDate: form.endDate,
      lines: form.lines.map(l => ({
        accountCode: l.accountCode,
        accountName: l.accountName,
        period: l.period,
        amount: parseFloat(l.amount) || 0,
      })),
      organizationId: orgId,
    }
    createBudget({ variables: { input } })
  }

  const budgets = data?.budgets || []
  const accounts = accountsData?.chartOfAccounts || []
  const totalAmount = form.lines.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0)

  const stats = useMemo(() => {
    const draft = budgets.filter((b: any) => b.status === 'draft').length
    const active = budgets.filter((b: any) => b.status === 'active').length
    const total = budgets.reduce((s: number, b: any) => s + Number(b.totalAmount ?? 0), 0)
    return { draft, active, total }
  }, [budgets])

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: (v) => <MonoCell value={v} /> },
    { key: 'budgetName', label: 'Budget Name', sortable: true, render: (v) => <span className="text-sm font-medium">{v}</span> },
    { key: 'fiscalYear', label: 'Fiscal Year', width: '110px', render: (v) => <MonoCell value={v} /> },
    { key: 'startDate', label: 'Start Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'endDate', label: 'End Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'totalAmount', label: 'Total Amount', width: '130px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Set Up Budgets"
        subtitle="Create and manage fiscal year budgets"
        icon={<Wallet className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'Budgets' }]}
        actions={
          <Button
            onClick={() => { reset(); setAdding(true) }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Budget
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total Budgets" value={budgets.length} icon={<Wallet className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={stats.draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Active" value={stats.active} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Total Amount" value={`₹${(stats.total / 1000).toFixed(1)}k`} icon={<CircleDollarSign className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      {adding && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">New Budget</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <InputFloating label="Budget Name *" value={form.budgetName} onChange={e => setF('budgetName', e.target.value)} error={errors.budgetName} className="h-7 text-xs" />
              <InputFloating label="Fiscal Year *" value={form.fiscalYear} onChange={e => setF('fiscalYear', e.target.value)} error={errors.fiscalYear} className="h-7 text-xs" />
              <InputFloating label="Start Date" type="date" value={form.startDate} onChange={e => setF('startDate', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="End Date" type="date" value={form.endDate} onChange={e => setF('endDate', e.target.value)} className="h-7 text-xs" />
            </div>

            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Budget Lines</span>
                <Button size="sm" onClick={addLine} className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />Add Line</Button>
              </div>

              {form.lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-3">
                    <InputFloating label="Account Code" value={line.accountCode} onChange={e => setLine(idx, 'accountCode', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-4">
                    <InputFloating label="Account Name" value={line.accountName} onChange={e => setLine(idx, 'accountName', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-2">
                    <InputFloating label="Period" placeholder="Q1, Jan, etc" value={line.period} onChange={e => setLine(idx, 'period', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-2">
                    <InputFloating label="Amount" type="number" value={line.amount} onChange={e => setLine(idx, 'amount', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-6">
                    {form.lines.length > 1 && (
                      <button onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700">
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-semibold">Total Budget: {formatMoney(totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Budget'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={budgets}
        columns={columns}
        loading={loading}
        title="All Budgets"
        searchable
        searchPlaceholder="Search budgets…"
        emptyMessage="No budgets found."
        pageSize={25}
        actions={[
          { label: 'Activate', icon: <CheckCircle className="h-3.5 w-3.5" />, onClick: (row) => { if (confirm('Activate this budget?')) activateBudget({ variables: { id: row.id } }) }, show: (row: any) => row.status === 'draft' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: (row) => { if (confirm('Delete this budget?')) deleteBudget({ variables: { id: row.id } }) }, show: (row: any) => row.status === 'draft' },
        ]}
      />

      {accounts.length > 0 && (
        <p className="text-xs text-muted-foreground">{accounts.length} chart of accounts available for line coding.</p>
      )}
    </div>
  )
}
