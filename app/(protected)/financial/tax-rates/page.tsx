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
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Percent, Receipt } from 'lucide-react'

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

  const columns: Column[] = [
    { key: 'code', label: 'Code', width: '110px', render: (v) => <MonoCell value={v} className="font-semibold text-foreground" /> },
    { key: 'name', label: 'Name', sortable: true, render: (v) => <span className="text-sm font-medium">{v}</span> },
    { key: 'taxType', label: 'Type', width: '100px', render: (v) => <span className="text-sm text-muted-foreground">{v}</span> },
    { key: 'appliesTo', label: 'Applies to', width: '120px', render: (v) => <span className="text-sm text-muted-foreground">{v}</span> },
    { key: 'hsnSacCode', label: 'HSN/SAC', width: '110px', render: (v) => <MonoCell value={v} /> },
    {
      key: 'ratePercent',
      label: 'Rate',
      width: '90px',
      align: 'right',
      render: (v) => <span className="tabular-nums text-sm font-semibold">{Number(v).toFixed(2)}%</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (v) => <ErpBadge status={String(v).toLowerCase()} />,
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Tax Rates"
        subtitle="GST, IGST, CGST, SGST, VAT and custom tax codes used across sales and purchases."
        icon={<Percent className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'Tax Rates' }]}
        actions={
          <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Tax Rate
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total" value={rates.length} icon={<Receipt className="h-5 w-5" />} variant="slate" />
        <StatCard label="Active" value={stats.active} icon={<Receipt className="h-5 w-5" />} variant="green" />
        <StatCard label="GST Codes" value={stats.gst} icon={<Percent className="h-5 w-5" />} variant="blue" />
        <StatCard label="Avg. Rate" value={`${stats.avg.toFixed(1)}%`} icon={<Percent className="h-5 w-5" />} variant="amber" />
      </StatsRow>

      <DataTable
        data={rates}
        columns={columns}
        loading={loading}
        title="All Tax Rates"
        searchable
        searchPlaceholder="Search name / code / HSN…"
        emptyMessage="No tax rates found."
        pageSize={25}
        onRowClick={(r: any) => openEdit(r)}
        actions={[
          {
            label: 'Edit',
            icon: <Pencil className="h-3.5 w-3.5" />,
            onClick: (r: any) => openEdit(r),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => { if (confirm(`Delete ${r.code}?`)) deleteMutation({ variables: { id: r.id } }) },
          },
        ]}
      />

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
