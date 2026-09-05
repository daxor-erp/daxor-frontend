'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import {
  GET_RECONCILIATION_RULES,
  GET_BANK_ACCOUNTS,
  CREATE_RECONCILIATION_RULE,
  UPDATE_RECONCILIATION_RULE,
  DELETE_RECONCILIATION_RULE,
} from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { FormDrawer, FormSection, ConfirmDialog } from '@/components/ui/form-drawer'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell } from '@/components/ui/erp-shared'
import { ListFilter, Pencil, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react'

const emptyForm = {
  name: '',
  bankAccount: '',
  priority: '100',
  isActive: true,
  bankLineTextContains: '',
  bookLineTextContains: '',
  amountTolerance: '0.01',
  notes: '',
}

type RuleRow = {
  id: string
  name: string
  bankAccount?: string | null
  priority: number
  isActive: boolean
  bankLineTextContains: string
  bookLineTextContains: string
  amountTolerance: number
  notes?: string | null
}

export default function ReconciliationRulesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''
  const [form, setForm] = useState({ ...emptyForm })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [error, setError] = useState('')

  const { data, loading, refetch } = useQuery(GET_RECONCILIATION_RULES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: acctData } = useQuery(GET_BANK_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createRule, { loading: creating }] = useMutation(CREATE_RECONCILIATION_RULE, {
    onCompleted: () => {
      setForm({ ...emptyForm })
      setDrawerOpen(false)
      setEditingId(null)
      setError('')
      void refetch()
    },
    onError: (e) => setError(e.message),
  })

  const [updateRule, { loading: updating }] = useMutation(UPDATE_RECONCILIATION_RULE, {
    onCompleted: () => {
      setForm({ ...emptyForm })
      setDrawerOpen(false)
      setEditingId(null)
      setError('')
      void refetch()
    },
    onError: (e) => setError(e.message),
  })

  const [deleteRule, { loading: deleting }] = useMutation(DELETE_RECONCILIATION_RULE, {
    onCompleted: () => {
      setDelConfirm(null)
      setError('')
      void refetch()
    },
    onError: (e) => setError(e.message),
  })

  const rules: RuleRow[] = useMemo(() => (data?.reconciliationRules ?? []) as RuleRow[], [data])
  const bankAccounts = (acctData?.bankAccounts ?? []) as {
    accountNumber: string
    accountName: string
    isActive?: boolean
  }[]

  const accountOptions = useMemo(
    () => [
      { value: '', label: 'All bank accounts' },
      ...bankAccounts
        .filter((a) => a.isActive !== false)
        .map((a) => ({
          value: a.accountNumber,
          label: `${a.accountName} (${a.accountNumber})`,
        })),
    ],
    [bankAccounts],
  )

  const stats = {
    total: rules.length,
    active: rules.filter((r) => r.isActive).length,
    inactive: rules.filter((r) => !r.isActive).length,
  }

  const setF = (key: keyof typeof emptyForm, val: string | boolean) => {
    setForm((f) => ({ ...f, [key]: val }))
  }

  const openCreate = () => {
    setForm({ ...emptyForm })
    setEditingId(null)
    setError('')
    setDrawerOpen(true)
  }

  const startEdit = (r: RuleRow) => {
    setEditingId(r.id)
    setError('')
    setForm({
      name: r.name,
      bankAccount: (r.bankAccount || '').trim(),
      priority: String(r.priority ?? 100),
      isActive: r.isActive,
      bankLineTextContains: r.bankLineTextContains || '',
      bookLineTextContains: r.bookLineTextContains || '',
      amountTolerance: String(r.amountTolerance ?? 0.01),
      notes: r.notes || '',
    })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setForm({ ...emptyForm })
    setEditingId(null)
    setDrawerOpen(false)
    setError('')
  }

  const handleSave = () => {
    setError('')
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    const tol = parseFloat(form.amountTolerance)
    if (!Number.isFinite(tol) || tol < 0) {
      setError('Amount tolerance must be a non-negative number.')
      return
    }
    const pr = parseInt(form.priority, 10)

    if (editingId) {
      updateRule({
        variables: {
          id: editingId,
          input: {
            name: form.name.trim(),
            bankAccount: form.bankAccount,
            priority: Number.isFinite(pr) ? pr : 100,
            isActive: form.isActive,
            bankLineTextContains: form.bankLineTextContains,
            bookLineTextContains: form.bookLineTextContains,
            amountTolerance: tol,
            notes: form.notes.trim(),
          },
        },
      })
      return
    }

    createRule({
      variables: {
        input: {
          name: form.name.trim(),
          organizationId: orgId,
          bankAccount: form.bankAccount || undefined,
          priority: Number.isFinite(pr) ? pr : 100,
          isActive: form.isActive,
          bankLineTextContains: form.bankLineTextContains,
          bookLineTextContains: form.bookLineTextContains,
          amountTolerance: tol,
          notes: form.notes.trim() || undefined,
        },
      },
    })
  }

  const columns: Column[] = [
    { key: 'priority', label: 'Priority', width: '90px', render: (v) => <MonoCell value={v} /> },
    { key: 'name', label: 'Name', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    {
      key: 'bankAccount',
      label: 'Account',
      width: '140px',
      render: (v) => <span className="text-sm">{(v && String(v).trim()) || 'All'}</span>,
    },
    {
      key: 'bankLineTextContains',
      label: 'Bank line ⊃',
      render: (v) => <span className="text-sm">{v || <span className="text-muted-foreground">—</span>}</span>,
    },
    {
      key: 'bookLineTextContains',
      label: 'Book line ⊃',
      render: (v) => <span className="text-sm">{v || <span className="text-muted-foreground">—</span>}</span>,
    },
    {
      key: 'amountTolerance',
      label: 'Tol',
      width: '80px',
      align: 'right',
      render: (v) => <MonoCell value={v} />,
    },
    {
      key: 'isActive',
      label: 'Status',
      width: '110px',
      render: (v) => <ErpBadge status={v ? 'active' : 'cancelled'} label={v ? 'Active' : 'Inactive'} />,
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Reconciliation Rules"
        subtitle="Define how bank statement text matches register text when reconciling"
        icon={<ListFilter className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Banks' }, { label: 'Reconciliation Rules' }]}
        actions={
          <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Rule
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total Rules" value={stats.total} icon={<ListFilter className="h-5 w-5" />} variant="slate" />
        <StatCard label="Active" value={stats.active} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Inactive" value={stats.inactive} icon={<XCircle className="h-5 w-5" />} variant="amber" />
      </StatsRow>

      <DataTable
        data={rules}
        columns={columns}
        loading={loading}
        title="All Reconciliation Rules"
        searchable
        searchPlaceholder="Search rules…"
        emptyMessage="No rules yet. Add one to document matching logic for your team."
        pageSize={25}
        actions={[
          {
            label: 'Edit',
            icon: <Pencil className="h-3.5 w-3.5" />,
            onClick: (r: RuleRow) => startEdit(r),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r: RuleRow) => setDelConfirm(r.id),
          },
        ]}
      />

      <FormDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={editingId ? 'Edit Reconciliation Rule' : 'New Reconciliation Rule'}
        description="Rules are applied in priority order (lower number first)."
        size="md"
        submitLabel={editingId ? 'Save Changes' : 'Create Rule'}
        onSubmit={handleSave}
        submitting={creating || updating}
      >
        <FormSection columns={2}>
          <InputFloating label="Rule name *" value={form.name} onChange={(e) => setF('name', e.target.value)} />
          <SelectFloating
            label="Scope (account)"
            value={form.bankAccount}
            onChange={(v) => setF('bankAccount', typeof v === 'string' ? v : v.target.value)}
            options={accountOptions}
          />
          <InputFloating
            label="Priority (lower = first)"
            type="number"
            value={form.priority}
            onChange={(e) => setF('priority', e.target.value)}
          />
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setF('isActive', e.target.checked)}
                className="rounded border-border"
              />
              Active
            </label>
          </div>
          <div className="sm:col-span-2">
            <InputFloating
              label="Bank line text contains (statement)"
              value={form.bankLineTextContains}
              onChange={(e) => setF('bankLineTextContains', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <InputFloating
              label="Book line text contains (register)"
              value={form.bookLineTextContains}
              onChange={(e) => setF('bookLineTextContains', e.target.value)}
            />
          </div>
          <InputFloating
            label="Amount tolerance"
            type="number"
            step="0.01"
            min="0"
            value={form.amountTolerance}
            onChange={(e) => setF('amountTolerance', e.target.value)}
          />
          <div className="sm:col-span-2">
            <InputFloating label="Notes" value={form.notes} onChange={(e) => setF('notes', e.target.value)} />
          </div>
        </FormSection>
        {error && (
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded px-2 py-1.5 mt-3">
            {error}
          </p>
        )}
      </FormDrawer>

      <ConfirmDialog
        open={!!delConfirm}
        onClose={() => setDelConfirm(null)}
        onConfirm={() => {
          if (delConfirm) void deleteRule({ variables: { id: delConfirm } })
        }}
        title="Delete Reconciliation Rule?"
        description="This rule will be permanently deleted."
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
      />
    </div>
  )
}
