'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import {
  GET_BUDGETS,
  CREATE_BUDGET,
  UPDATE_BUDGET,
  ACTIVATE_BUDGET,
  DELETE_BUDGET,
  GET_CHART_OF_ACCOUNTS,
} from '@/gql/queries'
import { Trash2, X, Save, Plus, Minus, CheckCircle, Wallet, Clock, CheckCircle2, CircleDollarSign, Pencil } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'
import { toDateInputValue } from '@/lib/format-date'
import { toast } from 'sonner'

const EMPTY_LINE = { accountCode: '', accountName: '', period: '', amount: '' }

type BudgetLineForm = typeof EMPTY_LINE

function emptyForm() {
  const y = new Date().getFullYear()
  return {
    budgetName: '',
    fiscalYear: String(y),
    startDate: `${y}-01-01`,
    endDate: `${y}-12-31`,
    lines: [{ ...EMPTY_LINE }] as BudgetLineForm[],
  }
}

export default function SetUpBudgetsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_BUDGETS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const { data: accountsData } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm())
    setErrors({})
  }

  const [createBudget, { loading: creating }] = useMutation(CREATE_BUDGET, {
    onCompleted: () => {
      refetch()
      closeForm()
      toast.success('Budget created')
    },
    onError: (e) => toast.error(e.message),
  })

  const [updateBudget, { loading: updating }] = useMutation(UPDATE_BUDGET, {
    onCompleted: () => {
      refetch()
      closeForm()
      toast.success('Budget updated')
    },
    onError: (e) => toast.error(e.message),
  })

  const [activateBudget] = useMutation(ACTIVATE_BUDGET, {
    onCompleted: () => {
      refetch()
      toast.success('Budget activated')
    },
    onError: (e) => toast.error(e.message),
  })

  const [deleteBudget] = useMutation(DELETE_BUDGET, {
    onCompleted: () => {
      refetch()
      toast.success('Budget deleted')
    },
    onError: (e) => toast.error(e.message),
  })

  const setF = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: '' }))
  }

  const setLine = (idx: number, k: string, v: string) => {
    const newLines = [...form.lines]
    newLines[idx] = { ...newLines[idx], [k]: v }
    setForm((p) => ({ ...p, lines: newLines }))
  }

  const addLine = () => {
    setForm((p) => ({ ...p, lines: [...p.lines, { ...EMPTY_LINE }] }))
  }

  const removeLine = (idx: number) => {
    if (form.lines.length > 1) {
      setForm((p) => ({ ...p, lines: p.lines.filter((_, i) => i !== idx) }))
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setErrors({})
    setFormOpen(true)
  }

  const openEdit = (row: any) => {
    setEditingId(row.id)
    setForm({
      budgetName: row.budgetName ?? '',
      fiscalYear: String(row.fiscalYear ?? new Date().getFullYear()),
      startDate: toDateInputValue(row.startDate) || emptyForm().startDate,
      endDate: toDateInputValue(row.endDate) || emptyForm().endDate,
      lines:
        Array.isArray(row.lines) && row.lines.length > 0
          ? row.lines.map((l: any) => ({
              accountCode: l.accountCode ?? '',
              accountName: l.accountName ?? '',
              period: l.period ?? '',
              amount: l.amount != null ? String(l.amount) : '',
            }))
          : [{ ...EMPTY_LINE }],
    })
    setErrors({})
    setFormOpen(true)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.budgetName.trim()) e.budgetName = 'Required'
    if (!form.fiscalYear.trim()) e.fiscalYear = 'Required'
    if (!form.startDate) e.startDate = 'Required'
    if (!form.endDate) e.endDate = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate() || !orgId) return
    const input = {
      budgetName: form.budgetName.trim(),
      fiscalYear: form.fiscalYear.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      lines: form.lines
        .filter((l) => l.accountCode.trim() || l.accountName.trim() || l.amount)
        .map((l) => ({
          accountCode: l.accountCode.trim() || '—',
          accountName: l.accountName.trim() || '—',
          period: l.period.trim() || 'Annual',
          amount: parseFloat(l.amount) || 0,
        })),
      organizationId: orgId,
    }
    if (input.lines.length === 0) {
      toast.error('Add at least one budget line')
      return
    }
    if (editingId) {
      updateBudget({ variables: { id: editingId, input } })
    } else {
      createBudget({ variables: { input } })
    }
  }

  const budgets = data?.budgets || []
  const accounts = accountsData?.chartOfAccounts || []
  const totalAmount = form.lines.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0)
  const saving = creating || updating

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
            onClick={openCreate}
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

      {formOpen && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">
              {editingId ? 'Edit Budget' : 'New Budget'}
            </span>
            <button
              type="button"
              onClick={closeForm}
              className="text-primary-foreground/80 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <InputFloating
                label="Budget Name *"
                value={form.budgetName}
                onChange={(e) => setF('budgetName', e.target.value)}
                error={errors.budgetName}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Fiscal Year *"
                value={form.fiscalYear}
                onChange={(e) => setF('fiscalYear', e.target.value)}
                error={errors.fiscalYear}
                className="h-7 text-xs"
              />
              <InputFloating
                label="Start Date *"
                type="date"
                value={form.startDate}
                onChange={(e) => setF('startDate', e.target.value)}
                error={errors.startDate}
                className="h-7 text-xs"
              />
              <InputFloating
                label="End Date *"
                type="date"
                value={form.endDate}
                onChange={(e) => setF('endDate', e.target.value)}
                error={errors.endDate}
                className="h-7 text-xs"
              />
            </div>

            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Budget Lines</span>
                <Button size="sm" type="button" onClick={addLine} className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Line
                </Button>
              </div>

              {form.lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-3">
                    <InputFloating
                      label="Account Code"
                      value={line.accountCode}
                      onChange={(e) => setLine(idx, 'accountCode', e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="col-span-4">
                    <InputFloating
                      label="Account Name"
                      value={line.accountName}
                      onChange={(e) => setLine(idx, 'accountName', e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <InputFloating
                      label="Period"
                      placeholder="Q1, Jan, etc"
                      value={line.period}
                      onChange={(e) => setLine(idx, 'period', e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <InputFloating
                      label="Amount"
                      type="number"
                      value={line.amount}
                      onChange={(e) => setLine(idx, 'amount', e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-6">
                    {form.lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLine(idx)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove line"
                      >
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
              <Button variant="outline" size="sm" type="button" onClick={closeForm} className="h-8 text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[110px]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {saving ? 'Saving…' : editingId ? 'Update Budget' : 'Save Budget'}
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
        onRowClick={(row: any) => openEdit(row)}
        actions={[
          {
            label: 'Edit',
            icon: <Pencil className="h-3.5 w-3.5" />,
            onClick: (row: any) => openEdit(row),
            show: (row: any) => row.status !== 'closed',
          },
          {
            label: 'Activate',
            icon: <CheckCircle className="h-3.5 w-3.5" />,
            onClick: (row: any) => {
              if (confirm('Activate this budget?')) activateBudget({ variables: { id: row.id } })
            },
            show: (row: any) => row.status === 'draft',
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (row: any) => {
              if (confirm(`Delete budget “${row.budgetName}”?`)) {
                deleteBudget({ variables: { id: row.id } })
              }
            },
            show: (row: any) => row.status === 'draft' || row.status === 'active',
          },
        ]}
      />

      {accounts.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {accounts.length} chart of accounts available for line coding.
        </p>
      )}
    </div>
  )
}
