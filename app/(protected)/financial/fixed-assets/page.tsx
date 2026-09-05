'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_FIXED_ASSETS,
  GET_FIXED_ASSET_SUMMARY,
  CREATE_FIXED_ASSET,
  UPDATE_FIXED_ASSET,
  DELETE_FIXED_ASSET,
  POST_FIXED_ASSET_DEPRECIATION,
  DISPOSE_FIXED_ASSET,
} from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, SectionPanel, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Plus,
  Pencil,
  Trash2,
  TrendingDown,
  Calculator,
  Boxes,
  Building,
  ArrowDownToLine,
  PackageX,
  CheckCircle2,
} from 'lucide-react'
import { formatMoneyCompact } from '@/lib/format-money'

const CATEGORIES = ['LAND', 'BUILDING', 'PLANT_MACHINERY', 'FURNITURE', 'VEHICLE', 'COMPUTER', 'SOFTWARE', 'OFFICE_EQUIPMENT', 'OTHER']
const METHODS = ['STRAIGHT_LINE', 'DECLINING_BALANCE', 'WDV', 'UNITS']
const STATUSES = ['ACTIVE', 'UNDER_MAINTENANCE', 'DISPOSED', 'LOST', 'RETIRED']

interface AssetForm {
  id?: string
  assetCode: string
  name: string
  description: string
  category: string
  purchaseDate: string
  commissionedDate: string
  acquisitionCost: number
  salvageValue: number
  usefulLifeMonths: number
  depreciationMethod: string
  depreciationRatePercent: number | null
  serialNumber: string
  barcode: string
  warrantyExpiryDate: string
  notes: string
  status: string
}

const EMPTY: AssetForm = {
  assetCode: '',
  name: '',
  description: '',
  category: 'PLANT_MACHINERY',
  purchaseDate: new Date().toISOString().slice(0, 10),
  commissionedDate: '',
  acquisitionCost: 0,
  salvageValue: 0,
  usefulLifeMonths: 60,
  depreciationMethod: 'STRAIGHT_LINE',
  depreciationRatePercent: null,
  serialNumber: '',
  barcode: '',
  warrantyExpiryDate: '',
  notes: '',
  status: 'ACTIVE',
}

export default function FixedAssetsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<AssetForm>(EMPTY)
  const [filterCategory, setFilterCategory] = useState('')
  const [depOpen, setDepOpen] = useState<null | { id: string; name: string }>(null)
  const [depForm, setDepForm] = useState({ periodEndDate: new Date().toISOString().slice(0, 10), amount: '' as string | number, notes: '' })

  const listQ = useQuery(GET_FIXED_ASSETS, {
    variables: { organizationId: orgId, search: null, status: null, category: filterCategory || null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const summaryQ = useQuery(GET_FIXED_ASSET_SUMMARY, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_FIXED_ASSET, {
    onCompleted: () => { listQ.refetch(); summaryQ.refetch(); setOpen(false); setForm(EMPTY); toast.success('Asset added') },
    onError: (e) => toast.error(e.message),
  })
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_FIXED_ASSET, {
    onCompleted: () => { listQ.refetch(); setOpen(false); setForm(EMPTY); toast.success('Asset updated') },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_FIXED_ASSET, {
    onCompleted: () => { listQ.refetch(); summaryQ.refetch(); toast.success('Asset deleted') },
    onError: (e) => toast.error(e.message),
  })
  const [postDepMutation, { loading: posting }] = useMutation(POST_FIXED_ASSET_DEPRECIATION, {
    onCompleted: () => { listQ.refetch(); summaryQ.refetch(); setDepOpen(null); toast.success('Depreciation posted') },
    onError: (e) => toast.error(e.message),
  })
  const [disposeMutation] = useMutation(DISPOSE_FIXED_ASSET, {
    onCompleted: () => { listQ.refetch(); summaryQ.refetch(); toast.success('Asset disposed') },
    onError: (e) => toast.error(e.message),
  })

  const assets: any[] = listQ.data?.fixedAssets ?? []
  const summary: any[] = summaryQ.data?.fixedAssetSummaryByCategory ?? []

  const totals = useMemo(() => {
    return assets.reduce(
      (s, a) => ({
        cost: s.cost + Number(a.acquisitionCost ?? 0),
        accum: s.accum + Number(a.accumulatedDepreciation ?? 0),
        book: s.book + Number(a.bookValue ?? 0),
      }),
      { cost: 0, accum: 0, book: 0 },
    )
  }, [assets])

  const openNew = () => { setForm(EMPTY); setOpen(true) }
  const openEdit = (row: any) => {
    setForm({
      id: row.id,
      assetCode: row.assetCode ?? '',
      name: row.name ?? '',
      description: row.description ?? '',
      category: row.category ?? 'OTHER',
      purchaseDate: row.purchaseDate ? new Date(row.purchaseDate).toISOString().slice(0, 10) : '',
      commissionedDate: row.commissionedDate ? new Date(row.commissionedDate).toISOString().slice(0, 10) : '',
      acquisitionCost: Number(row.acquisitionCost ?? 0),
      salvageValue: Number(row.salvageValue ?? 0),
      usefulLifeMonths: Number(row.usefulLifeMonths ?? 60),
      depreciationMethod: row.depreciationMethod ?? 'STRAIGHT_LINE',
      depreciationRatePercent: row.depreciationRatePercent ?? null,
      serialNumber: row.serialNumber ?? '',
      barcode: row.barcode ?? '',
      warrantyExpiryDate: row.warrantyExpiryDate ? new Date(row.warrantyExpiryDate).toISOString().slice(0, 10) : '',
      notes: row.notes ?? '',
      status: row.status ?? 'ACTIVE',
    })
    setOpen(true)
  }

  const submit = () => {
    if (!form.assetCode.trim()) return toast.error('Asset code is required')
    if (!form.name.trim()) return toast.error('Name is required')
    if (!form.purchaseDate) return toast.error('Purchase date is required')
    if (form.acquisitionCost < 0) return toast.error('Cost must be ≥ 0')
    if (form.usefulLifeMonths < 1) return toast.error('Useful life must be ≥ 1 month')

    const payload: any = {
      assetCode: form.assetCode.trim().toUpperCase(),
      name: form.name.trim(),
      description: form.description || undefined,
      category: form.category,
      purchaseDate: form.purchaseDate,
      commissionedDate: form.commissionedDate || undefined,
      acquisitionCost: Number(form.acquisitionCost),
      salvageValue: Number(form.salvageValue ?? 0),
      usefulLifeMonths: Number(form.usefulLifeMonths),
      depreciationMethod: form.depreciationMethod,
      depreciationRatePercent: form.depreciationRatePercent ?? null,
      serialNumber: form.serialNumber || undefined,
      barcode: form.barcode || undefined,
      warrantyExpiryDate: form.warrantyExpiryDate || undefined,
      notes: form.notes || undefined,
      status: form.status,
    }
    if (form.id) {
      updateMutation({ variables: { id: form.id, input: payload } })
    } else {
      createMutation({ variables: { input: { ...payload, organizationId: orgId } } })
    }
  }

  const postDep = () => {
    if (!depOpen) return
    postDepMutation({
      variables: {
        id: depOpen.id,
        input: {
          periodEndDate: depForm.periodEndDate,
          amount: depForm.amount === '' ? undefined : Number(depForm.amount),
          notes: depForm.notes || undefined,
        },
      },
    })
  }

  const columns: Column[] = [
    { key: 'assetCode', label: 'Code', width: '110px', render: (v) => <MonoCell value={v} className="font-semibold text-foreground" /> },
    { key: 'name', label: 'Name', sortable: true, render: (v) => <span className="text-sm font-medium">{v}</span> },
    { key: 'category', label: 'Category', width: '140px', render: (v) => <span className="text-sm text-muted-foreground">{String(v || '').replace(/_/g, ' ')}</span> },
    { key: 'purchaseDate', label: 'Purchased', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'acquisitionCost', label: 'Cost', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'accumulatedDepreciation', label: 'Accum. Dep.', width: '120px', align: 'right', render: (v) => <AmountCell value={v} className="text-rose-700" /> },
    { key: 'bookValue', label: 'Book Value', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '130px', render: (v) => <ErpBadge status={String(v).toLowerCase()} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Fixed Assets"
        subtitle="Asset register, depreciation schedules and disposal tracking."
        icon={<Boxes className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'Fixed Assets' }]}
        actions={
          <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> Add Asset
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Assets" value={assets.length} icon={<Boxes className="h-5 w-5" />} variant="blue" />
        <StatCard label="Acquisition Cost" value={formatMoneyCompact(totals.cost)} icon={<Building className="h-5 w-5" />} variant="teal" />
        <StatCard label="Accum. Depreciation" value={formatMoneyCompact(totals.accum)} icon={<TrendingDown className="h-5 w-5" />} variant="amber" />
        <StatCard label="Net Book Value" value={formatMoneyCompact(totals.book)} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </StatsRow>

      {summary.length > 0 && (
        <SectionPanel title="By category" description="Snapshot of assets grouped by class">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {summary.map((s) => (
              <div key={s.category} className="rounded-lg border border-border p-3">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">{s.category.replace(/_/g, ' ')}</p>
                <p className="mt-1 text-base font-bold tabular-nums">{formatMoneyCompact(s.bookValue)}</p>
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {s.count} asset{s.count === 1 ? '' : 's'} · cost {formatMoneyCompact(s.acquisitionCost)}
                </p>
              </div>
            ))}
          </div>
        </SectionPanel>
      )}

      <div className="flex justify-end">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-border bg-card py-1.5 px-2 text-xs focus:ring-2 focus:ring-primary/40"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <DataTable
        data={assets}
        columns={columns}
        loading={listQ.loading}
        title="All Fixed Assets"
        searchable
        searchPlaceholder="Search code / name / serial…"
        emptyMessage="No fixed assets found."
        pageSize={25}
        onRowClick={(r: any) => openEdit(r)}
        actions={[
          {
            label: 'Post Depreciation',
            icon: <ArrowDownToLine className="h-3.5 w-3.5" />,
            onClick: (r: any) => setDepOpen({ id: r.id, name: r.name }),
          },
          {
            label: 'Edit',
            icon: <Pencil className="h-3.5 w-3.5" />,
            onClick: (r: any) => openEdit(r),
          },
          {
            label: 'Dispose',
            icon: <PackageX className="h-3.5 w-3.5" />,
            onClick: (r: any) => {
              const d = prompt('Disposal date (YYYY-MM-DD)', new Date().toISOString().slice(0, 10))
              if (!d) return
              disposeMutation({ variables: { id: r.id, disposalDate: d } })
            },
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => { if (confirm(`Delete ${r.assetCode}?`)) deleteMutation({ variables: { id: r.id } }) },
          },
        ]}
      />

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={form.id ? 'Edit asset' : 'Add fixed asset'}
        description="Identification, acquisition and depreciation parameters."
        icon={<Boxes className="h-5 w-5" />}
        size="lg"
        submitting={creating || updating}
        onSubmit={submit}
        submitLabel={form.id ? 'Save changes' : 'Create asset'}
      >
        <FormSection title="Identification">
          <FieldGrid cols={2}>
            <div className="space-y-1.5">
              <Label>Asset code *</Label>
              <Input value={form.assetCode} onChange={(e) => setForm((p) => ({ ...p, assetCode: e.target.value.toUpperCase() }))} className="font-mono" placeholder="FA-001" required />
            </div>
            <div className="space-y-1.5">
              <Label>Asset name *</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="CNC Lathe Machine" required />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {STATUSES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Serial number</Label>
              <Input value={form.serialNumber} onChange={(e) => setForm((p) => ({ ...p, serialNumber: e.target.value }))} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label>Barcode</Label>
              <Input value={form.barcode} onChange={(e) => setForm((p) => ({ ...p, barcode: e.target.value }))} className="font-mono" />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Acquisition" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label>Purchase date *</Label>
              <Input type="date" value={form.purchaseDate} onChange={(e) => setForm((p) => ({ ...p, purchaseDate: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Commissioned on</Label>
              <Input type="date" value={form.commissionedDate} onChange={(e) => setForm((p) => ({ ...p, commissionedDate: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Warranty until</Label>
              <Input type="date" value={form.warrantyExpiryDate} onChange={(e) => setForm((p) => ({ ...p, warrantyExpiryDate: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Acquisition cost (₹) *</Label>
              <Input type="number" min={0} step="0.01" value={form.acquisitionCost} onChange={(e) => setForm((p) => ({ ...p, acquisitionCost: Number(e.target.value) }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Salvage value (₹)</Label>
              <Input type="number" min={0} step="0.01" value={form.salvageValue} onChange={(e) => setForm((p) => ({ ...p, salvageValue: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Useful life (months) *</Label>
              <Input type="number" min={1} value={form.usefulLifeMonths} onChange={(e) => setForm((p) => ({ ...p, usefulLifeMonths: Number(e.target.value) }))} required />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Depreciation method" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={2}>
            <div className="space-y-1.5">
              <Label>Method</Label>
              <select value={form.depreciationMethod} onChange={(e) => setForm((p) => ({ ...p, depreciationMethod: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {METHODS.map((m) => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Rate % (for WDV/declining-balance)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                max={100}
                value={form.depreciationRatePercent ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, depreciationRatePercent: e.target.value === '' ? null : Number(e.target.value) }))}
                placeholder="e.g. 15.00 for WDV"
              />
            </div>
          </FieldGrid>
          <div className="mt-3 rounded-lg bg-secondary/40 border border-border p-3 flex items-start gap-2">
            <Calculator className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Straight-line</p>
              <p>Monthly depreciation = (cost − salvage) / useful life. Use the actions menu on a row to post a depreciation entry.</p>
            </div>
          </div>
        </FormSection>

        <FormSection title="Notes" className="pt-5 border-t border-border mt-5">
          <textarea
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            rows={3}
            placeholder="Service history, maintenance vendor, internal tag references…"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </FormSection>
      </FormModal>

      <FormModal
        open={!!depOpen}
        onOpenChange={(v) => !v && setDepOpen(null)}
        title="Post depreciation"
        description={depOpen ? `Asset: ${depOpen.name}` : ''}
        icon={<TrendingDown className="h-5 w-5" />}
        size="sm"
        submitting={posting}
        onSubmit={postDep}
        submitLabel="Post entry"
      >
        <FormSection>
          <div className="space-y-1.5">
            <Label>Period end date *</Label>
            <Input type="date" value={depForm.periodEndDate} onChange={(e) => setDepForm((p) => ({ ...p, periodEndDate: e.target.value }))} required />
          </div>
          <div className="space-y-1.5 mt-3">
            <Label>Amount (₹) — leave blank to auto-calc</Label>
            <Input
              type="number"
              step="0.01"
              min={0}
              placeholder="Auto from method"
              value={depForm.amount}
              onChange={(e) => setDepForm((p) => ({ ...p, amount: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5 mt-3">
            <Label>Notes</Label>
            <Input value={depForm.notes} onChange={(e) => setDepForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Period reference, accountant note…" />
          </div>
        </FormSection>
      </FormModal>
    </div>
  )
}
