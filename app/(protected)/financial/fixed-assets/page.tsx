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
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { StatCard } from '@/components/dashboard/stat-card'
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
  Search,
  ArrowDownToLine,
  PackageX,
  CheckCircle2,
} from 'lucide-react'
import { formatMoney, formatMoneyCompact, formatNumber } from '@/lib/format-money'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'

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
  const [search, setSearch] = useState('')
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

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (search.trim()) {
        const q = search.toLowerCase()
        if (
          !a.name?.toLowerCase().includes(q) &&
          !a.assetCode?.toLowerCase().includes(q) &&
          !a.serialNumber?.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [assets, search])

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

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Fixed Assets"
        description="Asset register, depreciation schedules and disposal tracking."
        actions={
          <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" />
            Add asset
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Assets" value={formatNumber(assets.length)} icon={<Boxes className="h-5 w-5" />} tone="brand" />
        <StatCard label="Acquisition cost" value={formatMoneyCompact(totals.cost)} icon={<Building className="h-5 w-5" />} tone="sky" />
        <StatCard label="Accumulated depreciation" value={formatMoneyCompact(totals.accum)} icon={<TrendingDown className="h-5 w-5" />} tone="warn" />
        <StatCard label="Net book value" value={formatMoneyCompact(totals.book)} icon={<CheckCircle2 className="h-5 w-5" />} tone="emerald" />
      </div>

      {/* Category summary */}
      <SectionCard title="By category" description="Snapshot of assets grouped by class">
        {summary.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assets yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {summary.map((s) => (
              <div key={s.category} className="rounded-xl border border-border p-3">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">{s.category.replace('_', ' ')}</p>
                <p className="mt-1 text-base font-bold tabular-nums">{formatMoneyCompact(s.bookValue)}</p>
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {s.count} asset{s.count === 1 ? '' : 's'} · cost {formatMoneyCompact(s.acquisitionCost)}
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Register */}
      <SectionCard
        title="Asset register"
        description={`${filtered.length} of ${assets.length} assets`}
        action={
          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg border border-border bg-secondary/40 py-1.5 px-2 text-xs focus:ring-2 focus:ring-primary/40"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Code / name / serial"
                className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 w-48"
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
            <Boxes className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No fixed assets yet</p>
            <p className="text-xs text-muted-foreground mb-3">Add machinery, vehicles, computers, buildings — anything that depreciates.</p>
            <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
              <Plus className="h-4 w-4" /> Add first asset
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Purchased</th>
                  <th className="px-3 py-3 font-medium text-right">Cost</th>
                  <th className="px-3 py-3 font-medium text-right">Accum. dep.</th>
                  <th className="px-3 py-3 font-medium text-right">Book value</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a: any) => (
                  <tr key={a.id} className="border-t hover:bg-secondary/30">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{a.assetCode}</td>
                    <td className="px-3 py-3 font-medium">{a.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{a.category?.replace('_', ' ')}</td>
                    <td className="px-3 py-3 text-muted-foreground">{a.purchaseDate ? formatDate(a.purchaseDate) : '—'}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatMoney(a.acquisitionCost ?? 0)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-rose-700">{formatMoney(a.accumulatedDepreciation ?? 0)}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold">{formatMoney(a.bookValue ?? 0)}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setDepOpen({ id: a.id, name: a.name })}
                          title="Post depreciation"
                          className="h-7 w-7 grid place-items-center rounded-md text-amber-600 hover:bg-amber-50"
                        >
                          <ArrowDownToLine className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => openEdit(a)} title="Edit" className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const d = prompt('Disposal date (YYYY-MM-DD)', new Date().toISOString().slice(0, 10))
                            if (!d) return
                            disposeMutation({ variables: { id: a.id, disposalDate: d } })
                          }}
                          title="Dispose"
                          className="h-7 w-7 grid place-items-center rounded-md text-violet-600 hover:bg-violet-50"
                        >
                          <PackageX className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete ${a.assetCode}?`)) deleteMutation({ variables: { id: a.id } }) }}
                          title="Delete"
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

      {/* Add/Edit modal */}
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
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {STATUSES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
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
                {METHODS.map((m) => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
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

      {/* Depreciation modal */}
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

function StatusBadge({ status }: { status: string }) {
  const s = String(status || '').toUpperCase()
  const tone =
    s === 'ACTIVE'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : s === 'DISPOSED'
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : s === 'UNDER_MAINTENANCE'
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-slate-100 text-slate-700 border-slate-200'
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase', tone)}>
      {s.replace('_', ' ')}
    </span>
  )
}
