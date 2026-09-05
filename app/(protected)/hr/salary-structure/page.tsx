'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_EMPLOYEE_SALARY_STRUCTURES,
  CREATE_EMPLOYEE_SALARY_STRUCTURE,
  UPDATE_EMPLOYEE_SALARY_STRUCTURE,
  DELETE_EMPLOYEE_SALARY_STRUCTURE,
  GET_EMPLOYEE_MASTERS,
  GET_PAYROLL_UI_RECORDS,
} from '@/gql/queries'
import { PAYROLL_UI_CATEGORY } from '@/lib/payroll-ui-category'
import { formatMoney } from '@/lib/format-money'

type Row = {
  id: string
  employeeId: string
  effectiveFrom: string
  effectiveTo?: string | null
  ctcAnnual: number
  basicMonthly: number
  status: string
  components: { payComponentId: string; amount: number }[]
}

type FormState = {
  id: string | null
  employeeId: string
  effectiveFrom: string
  effectiveTo: string
  basicMonthly: string
  ctcAnnual: string
  status: string
  components: { payComponentId: string; amount: string }[]
  pfOptIn: boolean
  pfRate: string
  pfWageCeiling: string
  esiOptIn: boolean
  tdsRegime: 'NEW' | 'OLD'
  oldRegimeDeductions: string
  tdsMonthlyOverride: string
}

function emptyForm(): FormState {
  return {
    id: null,
    employeeId: '',
    effectiveFrom: new Date().toISOString().slice(0, 10),
    effectiveTo: '',
    basicMonthly: '',
    ctcAnnual: '',
    status: 'ACTIVE',
    components: [],
    pfOptIn: true,
    pfRate: '12',
    pfWageCeiling: '15000',
    esiOptIn: true,
    tdsRegime: 'NEW',
    oldRegimeDeductions: '0',
    tdsMonthlyOverride: '',
  }
}

function inr(n: number) {
  return formatMoney(n, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function SalaryStructurePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm())

  const { data: empData } = useQuery(GET_EMPLOYEE_MASTERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: compData } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: orgId, category: PAYROLL_UI_CATEGORY.PAY_COMPONENT },
    skip: !orgId,
  })

  const { data, loading, refetch } = useQuery(GET_EMPLOYEE_SALARY_STRUCTURES, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createMut, { loading: saving }] = useMutation(CREATE_EMPLOYEE_SALARY_STRUCTURE, {
    onCompleted: () => { closeDialog(); refetch() },
  })
  const [updateMut, { loading: updating }] = useMutation(UPDATE_EMPLOYEE_SALARY_STRUCTURE, {
    onCompleted: () => { closeDialog(); refetch() },
  })
  const [deleteMut] = useMutation(DELETE_EMPLOYEE_SALARY_STRUCTURE, {
    onCompleted: () => refetch(),
  })

  const employees: any[] = empData?.employeeMasters ?? []
  const rows: Row[] = data?.employeeSalaryStructures ?? []

  const payComponents = useMemo(() => {
    const list = (compData?.payrolluirecords ?? []) as Array<{ id: string; data: string }>
    return list.map((r) => {
      let parsed: any = {}
      try { parsed = typeof r.data === 'string' ? JSON.parse(r.data) : r.data } catch { /* ignore malformed record */ }
      return {
        id: r.id,
        shortCode: String(parsed.shortCode ?? ''),
        name: String(parsed.name ?? parsed.shortCode ?? ''),
        kind: String(parsed.kind ?? 'EARNING'),
        basis: String(parsed.basis ?? 'FIXED_AMOUNT'),
        defaultValue: typeof parsed.value === 'number' ? parsed.value : 0,
      }
    }).filter((c) => c.shortCode)
  }, [compData])

  const empLookup = useMemo(() => {
    const m = new Map<string, string>()
    for (const e of employees) m.set(e.id, `${e.firstName} ${e.lastName} (${e.employeeCode})`)
    return m
  }, [employees])
  const compLookup = useMemo(() => {
    const m = new Map<string, { shortCode: string; name: string }>()
    for (const c of payComponents) m.set(c.id, { shortCode: c.shortCode, name: c.name })
    return m
  }, [payComponents])

  const closeDialog = () => { setOpen(false); setForm(emptyForm()) }

  const openCreate = () => { setForm(emptyForm()); setOpen(true) }
  const openEdit = (r: Row) => {
    setForm({
      id: r.id,
      employeeId: r.employeeId,
      effectiveFrom: r.effectiveFrom?.slice(0, 10) ?? '',
      effectiveTo: r.effectiveTo ? r.effectiveTo.slice(0, 10) : '',
      basicMonthly: String(r.basicMonthly ?? ''),
      ctcAnnual: String(r.ctcAnnual ?? ''),
      status: r.status ?? 'ACTIVE',
      components: r.components.map((c) => ({ payComponentId: c.payComponentId, amount: String(c.amount) })),
      pfOptIn: ((r as any).statutory?.pfOptIn ?? true) as boolean,
      pfRate: String((r as any).statutory?.pfRate ?? 12),
      pfWageCeiling: String((r as any).statutory?.pfWageCeiling ?? 15000),
      esiOptIn: ((r as any).statutory?.esiOptIn ?? true) as boolean,
      tdsRegime: ((r as any).statutory?.tdsRegime ?? 'NEW') as 'NEW' | 'OLD',
      oldRegimeDeductions: String((r as any).statutory?.oldRegimeDeductions ?? 0),
      tdsMonthlyOverride: (r as any).statutory?.tdsMonthlyOverride != null ? String((r as any).statutory.tdsMonthlyOverride) : '',
    })
    setOpen(true)
  }

  const addComponent = () => {
    setForm((f) => ({ ...f, components: [...f.components, { payComponentId: '', amount: '' }] }))
  }
  const updateComponent = (idx: number, patch: Partial<{ payComponentId: string; amount: string }>) => {
    setForm((f) => ({
      ...f,
      components: f.components.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    }))
  }
  const removeComponent = (idx: number) => {
    setForm((f) => ({ ...f, components: f.components.filter((_, i) => i !== idx) }))
  }

  const submit = () => {
    if (!orgId || !form.employeeId || !form.effectiveFrom) return
    const input: any = {
      organizationId: orgId,
      employeeId: form.employeeId,
      effectiveFrom: new Date(form.effectiveFrom + 'T00:00:00').toISOString(),
      effectiveTo: form.effectiveTo ? new Date(form.effectiveTo + 'T00:00:00').toISOString() : null,
      basicMonthly: parseFloat(form.basicMonthly) || 0,
      ctcAnnual: parseFloat(form.ctcAnnual) || 0,
      status: form.status,
      components: form.components
        .filter((c) => c.payComponentId)
        .map((c) => ({ payComponentId: c.payComponentId, amount: parseFloat(c.amount) || 0 })),
      statutory: {
        pfOptIn: form.pfOptIn,
        pfRate: parseFloat(form.pfRate) || 12,
        pfWageCeiling: parseFloat(form.pfWageCeiling) || null,
        esiOptIn: form.esiOptIn,
        tdsRegime: form.tdsRegime,
        oldRegimeDeductions: parseFloat(form.oldRegimeDeductions) || 0,
        tdsMonthlyOverride: form.tdsMonthlyOverride === '' ? null : parseFloat(form.tdsMonthlyOverride),
      },
    }
    if (form.id) updateMut({ variables: { id: form.id, input } })
    else createMut({ variables: { input } })
  }

  const componentOptions = payComponents.map((c) => ({
    value: c.id,
    label: `${c.shortCode} — ${c.name} (${c.kind})`,
  }))

  return (
    <div className="erp-shell">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="erp-page-title">Employee Salary Structure</h1>
          <p className="text-gray-500 text-sm">
            Links employees to pay components with amounts and per-employee statutory settings.
            Drives the payroll calculation engine.
          </p>
        </div>
        <Button onClick={openCreate} disabled={!payComponents.length}>
          <Plus className="h-4 w-4 mr-2" /> New structure
        </Button>
      </div>

      {!payComponents.length ? (
        <Card>
          <CardContent className="p-6 text-amber-700 bg-amber-50 border border-amber-200 rounded">
            Define pay components first at /payroll/setup/pay-component before assigning structures.
          </CardContent>
        </Card>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="[&>button]:hidden max-w-3xl">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit salary structure' : 'New salary structure'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
            <SelectFloating
              label="Employee"
              value={form.employeeId}
              onChange={(v) => setForm((f) => ({ ...f, employeeId: typeof v === 'string' ? v : (v as any).target.value }))}
              options={employees.map((e: any) => ({ value: e.id, label: `${e.firstName} ${e.lastName} — ${e.employeeCode}` }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputFloating
                label="Effective from"
                type="date"
                value={form.effectiveFrom}
                onChange={(e) => setForm((f) => ({ ...f, effectiveFrom: e.target.value }))}
              />
              <InputFloating
                label="Effective to (optional)"
                type="date"
                value={form.effectiveTo}
                onChange={(e) => setForm((f) => ({ ...f, effectiveTo: e.target.value }))}
              />
              <InputFloating
                label="Basic (monthly)"
                type="number"
                value={form.basicMonthly}
                onChange={(e) => setForm((f) => ({ ...f, basicMonthly: e.target.value }))}
              />
              <InputFloating
                label="CTC (annual)"
                type="number"
                value={form.ctcAnnual}
                onChange={(e) => setForm((f) => ({ ...f, ctcAnnual: e.target.value }))}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Pay components</p>
                <Button size="sm" variant="outline" onClick={addComponent}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add component
                </Button>
              </div>
              {form.components.length === 0 ? (
                <p className="text-xs text-gray-500">No components assigned. Without these, only basic salary is paid.</p>
              ) : (
                <div className="space-y-2">
                  {form.components.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1">
                        <SelectFloating
                          label="Component"
                          value={c.payComponentId}
                          onChange={(v) =>
                            updateComponent(i, { payComponentId: typeof v === 'string' ? v : (v as any).target.value })
                          }
                          options={componentOptions}
                        />
                      </div>
                      <div className="w-32">
                        <InputFloating
                          label="Amount/%"
                          type="number"
                          value={c.amount}
                          onChange={(e) => updateComponent(i, { amount: e.target.value })}
                        />
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => removeComponent(i)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border rounded p-3 space-y-3 bg-slate-50">
              <p className="text-sm font-medium">Statutory (per-employee overrides)</p>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.pfOptIn} onChange={(e) => setForm((f) => ({ ...f, pfOptIn: e.target.checked }))} />
                  PF applicable
                </label>
                <InputFloating
                  label="PF rate %"
                  type="number"
                  value={form.pfRate}
                  onChange={(e) => setForm((f) => ({ ...f, pfRate: e.target.value }))}
                />
                <InputFloating
                  label="PF wage ceiling"
                  type="number"
                  value={form.pfWageCeiling}
                  onChange={(e) => setForm((f) => ({ ...f, pfWageCeiling: e.target.value }))}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.esiOptIn} onChange={(e) => setForm((f) => ({ ...f, esiOptIn: e.target.checked }))} />
                  ESI applicable
                </label>
                <SelectFloating
                  label="TDS regime"
                  value={form.tdsRegime}
                  onChange={(v) => setForm((f) => ({ ...f, tdsRegime: (typeof v === 'string' ? v : (v as any).target.value) as 'NEW' | 'OLD' }))}
                  options={[{ value: 'NEW', label: 'New regime' }, { value: 'OLD', label: 'Old regime' }]}
                />
                <InputFloating
                  label="80C/HRA decl. (old regime)"
                  type="number"
                  value={form.oldRegimeDeductions}
                  onChange={(e) => setForm((f) => ({ ...f, oldRegimeDeductions: e.target.value }))}
                />
                <InputFloating
                  label="TDS override (monthly)"
                  type="number"
                  value={form.tdsMonthlyOverride}
                  onChange={(e) => setForm((f) => ({ ...f, tdsMonthlyOverride: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={submit} disabled={saving || updating || !form.employeeId}>
              {saving || updating ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle>Active structures</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-gray-500">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-gray-500">No salary structures defined.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Effective</TableHead>
                  <TableHead className="text-right">Basic/mo</TableHead>
                  <TableHead className="text-right">CTC/yr</TableHead>
                  <TableHead>Components</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{empLookup.get(r.employeeId) ?? r.employeeId}</TableCell>
                    <TableCell className="text-xs">
                      {r.effectiveFrom?.slice(0, 10)} → {r.effectiveTo?.slice(0, 10) ?? '∞'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{inr(r.basicMonthly)}</TableCell>
                    <TableCell className="text-right tabular-nums">{inr(r.ctcAnnual)}</TableCell>
                    <TableCell className="text-xs">
                      {r.components.length === 0
                        ? <span className="text-gray-400">—</span>
                        : r.components.map((c, i) => (
                            <span key={i} className="inline-block mr-2">
                              {compLookup.get(c.payComponentId)?.shortCode ?? c.payComponentId}: {inr(c.amount)}
                            </span>
                          ))}
                    </TableCell>
                    <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.confirm('Delete this salary structure?')) {
                            deleteMut({ variables: { id: r.id } })
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
