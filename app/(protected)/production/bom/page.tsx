'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_BOMS,
  CREATE_BOM,
  UPDATE_BOM,
  DELETE_BOM,
  GET_ITEMS,
} from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Layers, Search, Boxes, Calculator, CircleDollarSign } from 'lucide-react'
import { formatMoney, formatMoneyCompact, formatNumber } from '@/lib/format-money'
import { cn } from '@/lib/utils'

interface BOMComponent {
  id?: string
  itemId?: string
  itemName: string
  quantity: number
  unit: string
  scrapPercent: number
  standardCost: number
  effectiveQty?: number
  lineTotal?: number
  notes?: string
}

interface BOMForm {
  id?: string
  parentItemId: string
  parentItemName: string
  bomCode: string
  version: string
  description: string
  quantityProduced: number
  unit: string
  components: BOMComponent[]
  laborCost: number
  overheadCost: number
  status: string
  notes: string
}

const EMPTY_FORM: BOMForm = {
  parentItemId: '',
  parentItemName: '',
  bomCode: '',
  version: 'v1',
  description: '',
  quantityProduced: 1,
  unit: 'unit',
  components: [],
  laborCost: 0,
  overheadCost: 0,
  status: 'DRAFT',
  notes: '',
}

export default function BOMPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<BOMForm>(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const listQ = useQuery(GET_BOMS, {
    variables: { organizationId: orgId, status: statusFilter || null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const itemsQ = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const items: any[] = itemsQ.data?.items ?? []
  const itemOptions = useMemo(
    () => items.map((it: any) => ({ value: it.id, label: it.name })),
    [items],
  )

  const [createMutation, { loading: creating }] = useMutation(CREATE_BOM, {
    onCompleted: () => { listQ.refetch(); setOpen(false); setForm(EMPTY_FORM); toast.success('BOM created') },
    onError: (e) => toast.error(e.message),
  })
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_BOM, {
    onCompleted: () => { listQ.refetch(); setOpen(false); setForm(EMPTY_FORM); toast.success('BOM updated') },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_BOM, {
    onCompleted: () => { listQ.refetch(); toast.success('BOM deleted') },
    onError: (e) => toast.error(e.message),
  })

  const boms: any[] = listQ.data?.billsOfMaterials ?? []

  const filtered = useMemo(() => {
    if (!search.trim()) return boms
    const q = search.toLowerCase()
    return boms.filter(
      (b) =>
        b.bomCode?.toLowerCase().includes(q) ||
        b.parentItemName?.toLowerCase().includes(q),
    )
  }, [boms, search])

  const stats = useMemo(() => {
    const active = boms.filter((b) => String(b.status).toUpperCase() === 'ACTIVE').length
    const totalCost = boms.reduce((s, b) => s + Number(b.totalCost ?? 0), 0)
    const components = boms.reduce((s, b) => s + (b.components?.length ?? 0), 0)
    return { active, totalCost, components }
  }, [boms])

  const componentColumns: LineColumn<BOMComponent>[] = [
    {
      key: 'itemId',
      header: 'Item',
      type: 'select',
      options: [{ value: '', label: '— Select item —' }, ...itemOptions],
      minWidth: 180,
    },
    { key: 'itemName', header: 'Description / Name', minWidth: 180, placeholder: 'Component name' },
    { key: 'quantity', header: 'Qty', type: 'number', align: 'right', minWidth: 90 },
    { key: 'unit', header: 'Unit', minWidth: 80 },
    { key: 'scrapPercent', header: 'Scrap %', type: 'number', align: 'right', minWidth: 90 },
    { key: 'standardCost', header: 'Std cost', type: 'money', align: 'right', minWidth: 110 },
    {
      key: 'effectiveQty',
      header: 'Effective qty',
      align: 'right',
      readOnly: true,
      compute: (row) => Number(row.quantity ?? 0) * (1 + Number(row.scrapPercent ?? 0) / 100),
      minWidth: 110,
    },
    {
      key: 'lineTotal',
      header: 'Line total',
      type: 'money',
      align: 'right',
      readOnly: true,
      compute: (row) => {
        const effective = Number(row.quantity ?? 0) * (1 + Number(row.scrapPercent ?? 0) / 100)
        return effective * Number(row.standardCost ?? 0)
      },
      minWidth: 130,
    },
  ]

  const totals = useMemo(() => {
    const material = form.components.reduce((s, c) => {
      const eff = Number(c.quantity ?? 0) * (1 + Number(c.scrapPercent ?? 0) / 100)
      return s + eff * Number(c.standardCost ?? 0)
    }, 0)
    const total = material + Number(form.laborCost ?? 0) + Number(form.overheadCost ?? 0)
    return { material, total }
  }, [form.components, form.laborCost, form.overheadCost])

  const openNew = () => { setForm(EMPTY_FORM); setOpen(true) }
  const openEdit = (row: any) => {
    setForm({
      id: row.id,
      parentItemId: row.parentItemId ?? '',
      parentItemName: row.parentItemName ?? '',
      bomCode: row.bomCode ?? '',
      version: row.version ?? 'v1',
      description: row.description ?? '',
      quantityProduced: Number(row.quantityProduced ?? 1),
      unit: row.unit ?? 'unit',
      components: (row.components ?? []).map((c: any) => ({
        itemId: c.itemId ?? '',
        itemName: c.itemName ?? '',
        quantity: Number(c.quantity ?? 0),
        unit: c.unit ?? 'unit',
        scrapPercent: Number(c.scrapPercent ?? 0),
        standardCost: Number(c.standardCost ?? 0),
        notes: c.notes ?? '',
      })),
      laborCost: Number(row.laborCost ?? 0),
      overheadCost: Number(row.overheadCost ?? 0),
      status: row.status ?? 'DRAFT',
      notes: row.notes ?? '',
    })
    setOpen(true)
  }

  const submit = () => {
    if (!form.parentItemId || !form.parentItemName) return toast.error('Parent item is required')
    if (!form.bomCode.trim()) return toast.error('BOM code is required')
    if (form.components.length === 0) return toast.error('Add at least one component')
    const cleanComponents = form.components
      .filter((c) => c.itemName?.trim() && Number(c.quantity) > 0)
      .map((c) => ({
        itemId: c.itemId || undefined,
        itemName: c.itemName.trim(),
        quantity: Number(c.quantity),
        unit: c.unit?.trim() || 'unit',
        scrapPercent: Number(c.scrapPercent ?? 0),
        standardCost: Number(c.standardCost ?? 0),
        notes: c.notes || undefined,
      }))
    if (cleanComponents.length === 0) return toast.error('Add at least one valid component')

    const payload: any = {
      parentItemId: form.parentItemId,
      parentItemName: form.parentItemName.trim(),
      bomCode: form.bomCode.trim().toUpperCase(),
      version: form.version || 'v1',
      description: form.description || undefined,
      quantityProduced: Number(form.quantityProduced) || 1,
      unit: form.unit?.trim() || 'unit',
      components: cleanComponents,
      laborCost: Number(form.laborCost ?? 0),
      overheadCost: Number(form.overheadCost ?? 0),
      status: form.status,
      notes: form.notes || undefined,
    }
    if (form.id) {
      updateMutation({ variables: { id: form.id, input: payload } })
    } else {
      createMutation({ variables: { input: { ...payload, organizationId: orgId } } })
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Bill of Materials"
        description="Define what items + costs go into producing each manufactured product."
        actions={
          <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" />
            New BOM
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total BOMs" value={formatNumber(boms.length)} icon={<Layers className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={formatNumber(stats.active)} icon={<Boxes className="h-5 w-5" />} tone="emerald" />
        <StatCard label="Components" value={formatNumber(stats.components)} icon={<Calculator className="h-5 w-5" />} tone="sky" />
        <StatCard label="Total BOM cost" value={formatMoneyCompact(stats.totalCost)} icon={<CircleDollarSign className="h-5 w-5" />} tone="warn" />
      </div>

      <SectionCard
        title="BOM register"
        description={`${filtered.length} of ${boms.length} BOMs`}
        action={
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-secondary/40 py-1.5 px-2 text-xs focus:ring-2 focus:ring-primary/40"
            >
              <option value="">All statuses</option>
              {['DRAFT', 'ACTIVE', 'OBSOLETE', 'ARCHIVED'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code / parent"
                className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 w-56"
              />
            </div>
          </div>
        }
        bodyClassName="p-0"
      >
        {listQ.loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Layers className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No BOMs yet</p>
            <p className="text-xs text-muted-foreground mb-3">Define the recipe for each manufactured product.</p>
            <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
              <Plus className="h-4 w-4" /> New BOM
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-3 py-3 font-medium">Parent item</th>
                  <th className="px-3 py-3 font-medium">Version</th>
                  <th className="px-3 py-3 font-medium text-right">Components</th>
                  <th className="px-3 py-3 font-medium text-right">Material cost</th>
                  <th className="px-3 py-3 font-medium text-right">Total cost</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b: any) => (
                  <tr key={b.id} className="border-t hover:bg-secondary/30 cursor-pointer" onClick={() => openEdit(b)}>
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{b.bomCode}</td>
                    <td className="px-3 py-3 font-medium">{b.parentItemName}</td>
                    <td className="px-3 py-3 text-muted-foreground font-mono text-xs">{b.version}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{b.components?.length ?? 0}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatMoney(b.totalMaterialCost ?? 0)}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold">{formatMoney(b.totalCost ?? 0)}</td>
                    <td className="px-3 py-3">
                      <BOMStatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openEdit(b)} className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete ${b.bomCode}?`)) deleteMutation({ variables: { id: b.id } }) }}
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

      {/* Add / Edit modal */}
      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={form.id ? 'Edit Bill of Materials' : 'New Bill of Materials'}
        description="Define the recipe for a manufactured product: components, scrap, costs."
        icon={<Layers className="h-5 w-5" />}
        size="xl"
        submitting={creating || updating}
        onSubmit={submit}
        submitLabel={form.id ? 'Save changes' : 'Create BOM'}
        footerStart={
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span>Material: <strong className="font-semibold">{formatMoney(totals.material)}</strong></span>
            <span>Total: <strong className="font-semibold text-primary">{formatMoney(totals.total)}</strong></span>
          </div>
        }
      >
        <FormSection title="Header">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label>Parent item *</Label>
              <select
                value={form.parentItemId}
                onChange={(e) => {
                  const sel = items.find((it: any) => it.id === e.target.value)
                  setForm((p) => ({
                    ...p,
                    parentItemId: e.target.value,
                    parentItemName: sel?.name ?? '',
                    unit: sel?.unit ?? p.unit,
                  }))
                }}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— Select —</option>
                {itemOptions.map((it) => <option key={it.value} value={it.value}>{it.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>BOM code *</Label>
              <Input value={form.bomCode} onChange={(e) => setForm((p) => ({ ...p, bomCode: e.target.value.toUpperCase() }))} className="font-mono" placeholder="BOM-001" required />
            </div>
            <div className="space-y-1.5">
              <Label>Version</Label>
              <Input value={form.version} onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))} className="font-mono" placeholder="v1" />
            </div>
            <div className="space-y-1.5">
              <Label>Qty produced</Label>
              <Input type="number" min={0} step="any" value={form.quantityProduced} onChange={(e) => setForm((p) => ({ ...p, quantityProduced: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Input value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {['DRAFT', 'ACTIVE', 'OBSOLETE', 'ARCHIVED'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-3">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short notes on this recipe…" />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Components" description="Add items consumed by this BOM. Tab to next cell, Enter to add a row, Ctrl/Cmd-D to duplicate." className="pt-5 border-t border-border mt-5">
          <LineItemsEditor<BOMComponent>
            columns={componentColumns}
            rows={form.components}
            onChange={(rows) => setForm((p) => ({ ...p, components: rows }))}
            buildRow={() => ({
              itemId: '',
              itemName: '',
              quantity: 1,
              unit: 'unit',
              scrapPercent: 0,
              standardCost: 0,
            })}
            totals={[
              { key: 'lineTotal', label: 'Material', format: 'money' },
            ]}
            minRows={1}
            maxRows={200}
            computeRow={(r) => {
              const next: any = { ...r }
              if (r.itemId) {
                const sel = items.find((it: any) => it.id === r.itemId)
                if (sel && !r.itemName) next.itemName = sel.name
                if (sel && !r.unit) next.unit = sel.unit ?? 'unit'
                if (sel && !r.standardCost) next.standardCost = Number(sel.rate ?? 0)
              }
              return next
            }}
          />
        </FormSection>

        <FormSection title="Additional cost" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label>Labor cost (₹)</Label>
              <Input type="number" min={0} step="0.01" value={form.laborCost} onChange={(e) => setForm((p) => ({ ...p, laborCost: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Overhead cost (₹)</Label>
              <Input type="number" min={0} step="0.01" value={form.overheadCost} onChange={(e) => setForm((p) => ({ ...p, overheadCost: Number(e.target.value) }))} />
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-3 flex flex-col justify-center">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Total cost</p>
              <p className="text-xl font-bold tabular-nums text-primary">{formatMoney(totals.total)}</p>
            </div>
          </FieldGrid>
        </FormSection>
      </FormModal>
    </div>
  )
}

function BOMStatusBadge({ status }: { status: string }) {
  const s = String(status || '').toUpperCase()
  const tone =
    s === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : s === 'DRAFT' ? 'bg-slate-100 text-slate-700 border-slate-200'
        : s === 'OBSOLETE' ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-rose-50 text-rose-700 border-rose-200'
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase', tone)}>{s}</span>
}
