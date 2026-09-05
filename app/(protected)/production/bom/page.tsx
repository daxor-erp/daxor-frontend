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
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Layers, Boxes, Calculator, CircleDollarSign } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'

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

  const stats = useMemo(() => {
    const active = boms.filter((b) => String(b.status).toUpperCase() === 'ACTIVE').length
    const draft = boms.filter((b) => String(b.status).toUpperCase() === 'DRAFT').length
    const totalCost = boms.reduce((s, b) => s + Number(b.totalCost ?? 0), 0)
    const components = boms.reduce((s, b) => s + (b.components?.length ?? 0), 0)
    return { active, draft, totalCost, components }
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

  const columns: Column[] = [
    { key: 'bomCode', label: 'Code', width: '130px', render: (v) => <MonoCell value={v} /> },
    { key: 'parentItemName', label: 'Parent item', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    { key: 'version', label: 'Version', width: '90px', render: (v) => <MonoCell value={v} /> },
    { key: 'components', label: 'Components', width: '110px', align: 'right', render: (v) => <span className="text-sm tabular-nums">{Array.isArray(v) ? v.length : 0}</span> },
    { key: 'totalMaterialCost', label: 'Material cost', width: '130px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'totalCost', label: 'Total cost', width: '130px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Bill of Materials"
        subtitle="Define what items + costs go into producing each manufactured product"
        icon={<Layers className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Production' }, { label: 'BOM' }]}
        actions={
          <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New BOM
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total BOMs" value={boms.length} icon={<Layers className="h-5 w-5" />} variant="slate" />
        <StatCard label="Active" value={stats.active} icon={<Boxes className="h-5 w-5" />} variant="green" />
        <StatCard label="Draft" value={stats.draft} icon={<Calculator className="h-5 w-5" />} variant="amber" />
        <StatCard label="Total BOM cost" value={`₹${(stats.totalCost / 1000).toFixed(1)}k`} icon={<CircleDollarSign className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      <div className="flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-secondary/40 py-1.5 px-2 text-xs focus:ring-2 focus:ring-primary/40"
        >
          <option value="">All statuses</option>
          {['DRAFT', 'ACTIVE', 'OBSOLETE', 'ARCHIVED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <DataTable
        data={boms}
        columns={columns}
        loading={listQ.loading}
        title="All BOMs"
        searchable
        searchPlaceholder="Search code / parent…"
        emptyMessage="No BOMs found."
        pageSize={25}
        onRowClick={openEdit}
        actions={[
          {
            label: 'Edit',
            icon: <Pencil className="h-3.5 w-3.5" />,
            onClick: (r: any) => openEdit(r),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => { if (confirm(`Delete ${r.bomCode}?`)) deleteMutation({ variables: { id: r.id } }) },
          },
        ]}
      />

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
