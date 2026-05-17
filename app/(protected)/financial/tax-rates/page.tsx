'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_TAX_RATES,
  CREATE_TAX_RATE,
  UPDATE_TAX_RATE,
  DELETE_TAX_RATE,
} from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Percent, Search, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaxRateForm {
  id?: string
  name: string
  code: string
  ratePercent: number
  taxType: string
  appliesTo: string
  hsnSacCode: string
  description: string
  isCompound: boolean
  isInclusive: boolean
  status: string
}

const EMPTY: TaxRateForm = {
  name: '',
  code: '',
  ratePercent: 18,
  taxType: 'GST',
  appliesTo: 'BOTH',
  hsnSacCode: '',
  description: '',
  isCompound: false,
  isInclusive: false,
  status: 'ACTIVE',
}

export default function TaxRatesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<TaxRateForm>(EMPTY)
  const [search, setSearch] = useState('')

  const { data, loading, refetch } = useQuery(GET_TAX_RATES, {
    variables: { organizationId: orgId, search: null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_TAX_RATE, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      setForm(EMPTY)
      toast.success('Tax rate created')
    },
    onError: (e) => toast.error(e.message),
  })

  const [updateMutation, { loading: updating }] = useMutation(UPDATE_TAX_RATE, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      setForm(EMPTY)
      toast.success('Tax rate updated')
    },
    onError: (e) => toast.error(e.message),
  })

  const [deleteMutation] = useMutation(DELETE_TAX_RATE, {
    onCompleted: () => {
      refetch()
      toast.success('Tax rate deleted')
    },
    onError: (e) => toast.error(e.message),
  })

  const rates: any[] = data?.taxRates ?? []
  const filtered = useMemo(
    () =>
      rates.filter((r) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          r.name?.toLowerCase().includes(q) ||
          r.code?.toLowerCase().includes(q) ||
          r.hsnSacCode?.toLowerCase().includes(q)
        )
      }),
    [rates, search],
  )

  const stats = useMemo(() => {
    const active = rates.filter((r) => String(r.status).toUpperCase() === 'ACTIVE').length
    const gst = rates.filter((r) => String(r.taxType).toUpperCase().includes('GST')).length
    const avg = rates.length ? rates.reduce((s, r) => s + Number(r.ratePercent ?? 0), 0) / rates.length : 0
    return { active, gst, avg }
  }, [rates])

  const openNew = () => {
    setForm(EMPTY)
    setOpen(true)
  }
  const openEdit = (row: any) => {
    setForm({
      id: row.id,
      name: row.name ?? '',
      code: row.code ?? '',
      ratePercent: Number(row.ratePercent ?? 0),
      taxType: row.taxType ?? 'GST',
      appliesTo: row.appliesTo ?? 'BOTH',
      hsnSacCode: row.hsnSacCode ?? '',
      description: row.description ?? '',
      isCompound: !!row.isCompound,
      isInclusive: !!row.isInclusive,
      status: row.status ?? 'ACTIVE',
    })
    setOpen(true)
  }

  const submit = () => {
    if (!form.name.trim()) return toast.error('Name is required')
    if (!form.code.trim()) return toast.error('Code is required')
    const payload: any = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      ratePercent: Number(form.ratePercent),
      taxType: form.taxType,
      appliesTo: form.appliesTo,
      hsnSacCode: form.hsnSacCode || undefined,
      description: form.description || undefined,
      isCompound: !!form.isCompound,
      isInclusive: !!form.isInclusive,
      status: form.status,
    }
    if (form.id) {
      updateMutation({ variables: { id: form.id, input: payload } })
    } else {
      createMutation({ variables: { input: { ...payload, organizationId: orgId } } })
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1300px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Tax Rates"
        description="GST, IGST, CGST, SGST, VAT and custom tax codes used across sales and purchases."
        actions={
          <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" />
            New tax rate
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total" value={rates.length} icon={<Receipt className="h-4 w-4" />} />
        <Stat label="Active" value={stats.active} tone="emerald" />
        <Stat label="GST codes" value={stats.gst} />
        <Stat label="Avg. rate" value={`${stats.avg.toFixed(1)}%`} icon={<Percent className="h-4 w-4" />} />
      </div>

      <SectionCard
        title="Configured tax rates"
        description="Click a row to edit. Codes are uppercase and must be unique per organization."
        action={
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / code / HSN"
              className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary w-56"
            />
          </div>
        }
        bodyClassName="p-0"
      >
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Receipt className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No tax rates yet</p>
            <p className="text-xs text-muted-foreground mb-3">
              Create your first GST (5/12/18/28%) rate to apply on invoices and bills.
            </p>
            <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
              <Plus className="h-4 w-4" /> New tax rate
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Applies to</th>
                  <th className="px-3 py-3 font-medium">HSN/SAC</th>
                  <th className="px-3 py-3 font-medium text-right">Rate</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any) => (
                  <tr key={r.id} className="border-t hover:bg-secondary/30 cursor-pointer" onClick={() => openEdit(r)}>
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{r.code}</td>
                    <td className="px-3 py-3 font-medium">{r.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{r.taxType}</td>
                    <td className="px-3 py-3 text-muted-foreground">{r.appliesTo}</td>
                    <td className="px-3 py-3 font-mono text-xs">{r.hsnSacCode || '—'}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold">{Number(r.ratePercent).toFixed(2)}%</td>
                    <td className="px-3 py-3">
                      <span className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                        String(r.status).toUpperCase() === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200',
                      )}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openEdit(r)} className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete ${r.code}?`)) deleteMutation({ variables: { id: r.id } }) }}
                          className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Form modal */}
      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={form.id ? 'Edit tax rate' : 'New tax rate'}
        description="Tax codes are applied on invoice and bill line items."
        icon={<Percent className="h-5 w-5" />}
        size="lg"
        submitting={creating || updating}
        onSubmit={submit}
        submitLabel={form.id ? 'Save changes' : 'Create tax rate'}
      >
        <FormSection title="Identification">
          <FieldGrid cols={2}>
            <div className="space-y-1.5">
              <Label htmlFor="t-name">Name *</Label>
              <Input id="t-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="GST 18%" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-code">Code *</Label>
              <Input
                id="t-code"
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="GST18"
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-type">Tax type</Label>
              <select
                id="t-type"
                value={form.taxType}
                onChange={(e) => setForm((p) => ({ ...p, taxType: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {['GST', 'IGST', 'CGST', 'SGST', 'VAT', 'CESS', 'OTHER'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-applies">Applies to</Label>
              <select
                id="t-applies"
                value={form.appliesTo}
                onChange={(e) => setForm((p) => ({ ...p, appliesTo: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="BOTH">Both sales & purchases</option>
                <option value="SALES">Sales only</option>
                <option value="PURCHASE">Purchase only</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-rate">Rate (%) *</Label>
              <Input
                id="t-rate"
                type="number"
                step="0.01"
                min={0}
                max={100}
                value={form.ratePercent}
                onChange={(e) => setForm((p) => ({ ...p, ratePercent: Number(e.target.value) }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-hsn">HSN / SAC code</Label>
              <Input id="t-hsn" value={form.hsnSacCode} onChange={(e) => setForm((p) => ({ ...p, hsnSacCode: e.target.value }))} placeholder="998313" className="font-mono" />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Behavior" className="pt-5 border-t border-border mt-5">
          <div className="grid sm:grid-cols-2 gap-3">
            <Toggle label="Compound tax (calculated on top of other taxes)" checked={form.isCompound} onChange={(c) => setForm((p) => ({ ...p, isCompound: c }))} />
            <Toggle label="Inclusive in line price" checked={form.isInclusive} onChange={(c) => setForm((p) => ({ ...p, isInclusive: c }))} />
          </div>
        </FormSection>

        <FormSection title="Notes" className="pt-5 border-t border-border mt-5">
          <div className="space-y-1.5">
            <Label htmlFor="t-desc">Description</Label>
            <textarea
              id="t-desc"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="When this rate is used, accounting head it posts to, etc."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            />
          </div>
          <div className="space-y-1.5 mt-3 max-w-xs">
            <Label htmlFor="t-status">Status</Label>
            <select
              id="t-status"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </FormSection>
      </FormModal>
    </div>
  )
}

function Stat({ label, value, icon, tone }: { label: string; value: string | number; icon?: React.ReactNode; tone?: 'emerald' }) {
  return (
    <div className={cn('rounded-xl border p-3 flex items-center gap-3', tone === 'emerald' ? 'bg-emerald-50 border-emerald-200' : 'bg-card border-border')}>
      {icon && <div className={cn('h-9 w-9 rounded-lg grid place-items-center', tone === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-soft text-primary')}>{icon}</div>}
      <div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</p>
        <p className="text-lg font-bold tabular-nums">{value}</p>
      </div>
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border p-3 cursor-pointer hover:bg-secondary/40">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
      />
    </label>
  )
}
