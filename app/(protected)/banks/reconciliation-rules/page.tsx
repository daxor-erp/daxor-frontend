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
import { wsCell, wsHeaderCell } from '@/lib/worksheet-styles'
import { ListFilter, Pencil, Plus, RefreshCw, Scale, Trash2, X } from 'lucide-react'

const cell = wsCell
const headerCell = wsHeaderCell

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
  const [adding, setAdding] = useState(false)
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
      setAdding(false)
      setError('')
      void refetch()
    },
    onError: (e) => setError(e.message),
  })

  const [updateRule, { loading: updating }] = useMutation(UPDATE_RECONCILIATION_RULE, {
    onCompleted: () => {
      setForm({ ...emptyForm })
      setEditingId(null)
      setError('')
      void refetch()
    },
    onError: (e) => setError(e.message),
  })

  const [deleteRule, { loading: deleting }] = useMutation(DELETE_RECONCILIATION_RULE, {
    onCompleted: () => {
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

  const setF = (key: keyof typeof emptyForm, val: string | boolean) => {
    setForm((f) => ({ ...f, [key]: val }))
  }

  const startEdit = (r: RuleRow) => {
    setEditingId(r.id)
    setAdding(false)
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
  }

  const cancel = () => {
    setForm({ ...emptyForm })
    setEditingId(null)
    setAdding(false)
    setError('')
  }

  const saveCreate = () => {
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

  const saveUpdate = () => {
    if (!editingId) return
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
  }

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ListFilter className="h-8 w-8 text-slate-700" />
          Reconciliation rules
        </h1>
        <p className="text-gray-500 mt-1 max-w-3xl">
          Define how bank statement text should line up with register text when you reconcile. Rules are applied in
          priority order (lower number first). Leave &quot;Bank line contains&quot; or &quot;Book line contains&quot;
          empty to skip that check. A blank account means the rule applies to all accounts. These rules support future
          auto-matching; today they document your process for the team.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          className="h-8 text-xs bg-slate-800 hover:bg-slate-900"
          onClick={() => {
            setAdding(true)
            setEditingId(null)
            setForm({ ...emptyForm })
            setError('')
          }}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          New rule
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => refetch()}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {(adding || editingId) && (
        <div className="rounded border-2 border-slate-400 overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Scale className="h-3.5 w-3.5" />
              {editingId ? 'Edit rule' : 'New rule'}
            </span>
            <button type="button" onClick={cancel} className="text-white/90 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <InputFloating
                label="Rule name *"
                value={form.name}
                onChange={(e) => setF('name', e.target.value)}
                className="h-9"
              />
              <div>
                <span className="text-[10px] text-gray-500 block mb-0.5">Scope (account)</span>
                <SelectFloating
                  label=""
                  value={form.bankAccount}
                  onChange={(v) => setF('bankAccount', typeof v === 'string' ? v : v.target.value)}
                  options={accountOptions}
                  className="h-9"
                />
              </div>
              <InputFloating
                label="Priority (lower = first)"
                value={form.priority}
                onChange={(e) => setF('priority', e.target.value)}
                className="h-9"
                type="number"
              />
              <div className="flex items-end gap-2 pb-1">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setF('isActive', e.target.checked)}
                  />
                  Active
                </label>
              </div>
              <div className="sm:col-span-2">
                <InputFloating
                  label="Bank line text contains (statement)"
                  value={form.bankLineTextContains}
                  onChange={(e) => setF('bankLineTextContains', e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="sm:col-span-2">
                <InputFloating
                  label="Book line text contains (register)"
                  value={form.bookLineTextContains}
                  onChange={(e) => setF('bookLineTextContains', e.target.value)}
                  className="h-9"
                />
              </div>
              <InputFloating
                label="Amount tolerance"
                value={form.amountTolerance}
                onChange={(e) => setF('amountTolerance', e.target.value)}
                className="h-9"
                type="number"
                step="0.01"
                min="0"
              />
              <div className="sm:col-span-2">
                <InputFloating
                  label="Notes"
                  value={form.notes}
                  onChange={(e) => setF('notes', e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {editingId ? (
                <Button
                  type="button"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={saveUpdate}
                  disabled={updating}
                >
                  {updating ? 'Saving…' : 'Save changes'}
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={saveCreate}
                  disabled={creating}
                >
                  {creating ? 'Creating…' : 'Create rule'}
                </Button>
              )}
              <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={cancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
      )}

      <div className="rounded border border-gray-300 overflow-hidden bg-white shadow-sm">
        <div className="px-3 py-2 bg-gray-50 border-b text-sm font-semibold text-gray-800">Rules (priority order)</div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[900px]">
            <thead>
              <tr>
                <th className={`${headerCell} text-left`}>Priority</th>
                <th className={`${headerCell} text-left`}>Name</th>
                <th className={`${headerCell} text-left`}>Account</th>
                <th className={`${headerCell} text-left`}>Bank line ⊃</th>
                <th className={`${headerCell} text-left`}>Book line ⊃</th>
                <th className={`${headerCell} text-right`}>Tol</th>
                <th className={`${headerCell} text-center`}>Active</th>
                <th className={`${headerCell} w-24`} />
              </tr>
            </thead>
            <tbody>
              {!rules.length && !loading && (
                <tr>
                  <td colSpan={8} className={`${cell} text-center text-gray-500 py-8`}>
                    No rules yet. Add one to document matching logic for your team.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={8} className={`${cell} text-center text-gray-500 py-8`}>
                    Loading…
                  </td>
                </tr>
              )}
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className={`${cell} font-mono`}>{r.priority}</td>
                  <td className={`${cell} font-medium`}>{r.name}</td>
                  <td className={cell}>{(r.bankAccount && r.bankAccount.trim()) || 'All'}</td>
                  <td className={cell}>
                    {r.bankLineTextContains || <span className="text-gray-400">—</span>}
                  </td>
                  <td className={cell}>
                    {r.bookLineTextContains || <span className="text-gray-400">—</span>}
                  </td>
                  <td className={`${cell} text-right font-mono`}>{r.amountTolerance}</td>
                  <td className={`${cell} text-center`}>
                    {r.isActive ? (
                      <span className="text-green-700">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className={cell}>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1.5"
                        onClick={() => startEdit(r)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1.5 text-red-700"
                        disabled={deleting}
                        onClick={() => {
                          if (confirm('Delete this reconciliation rule?')) {
                            setError('')
                            void deleteRule({ variables: { id: r.id } })
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
