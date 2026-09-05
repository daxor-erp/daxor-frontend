'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_UOMS, CREATE_UOM, UPDATE_UOM, DELETE_UOM, ENSURE_DEFAULT_UOMS } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Ruler, Layers } from 'lucide-react'

type UomRow = { id: string; name: string; category: string; ratio: number; type: string; gstUqc?: string | null; isActive: boolean }

type UomForm = { id?: string; name: string; category: string; ratio: number; type: string; gstUqc: string; isActive: boolean }

const EMPTY: UomForm = { name: '', category: '', ratio: 1, type: 'reference', gstUqc: '', isActive: true }

export default function UomPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<UomForm>(EMPTY)

  const { data, loading, refetch } = useQuery(GET_UOMS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const [ensureDefaults] = useMutation(ENSURE_DEFAULT_UOMS)

  useEffect(() => {
    if (orgId && data && (data.uoms ?? []).length === 0) {
      void ensureDefaults({ variables: { organizationId: orgId } }).then(() => refetch())
    }
  }, [orgId, data, ensureDefaults, refetch])

  const uoms: UomRow[] = useMemo(() => data?.uoms ?? [], [data])
  const categoryCount = useMemo(() => new Set(uoms.map((u) => u.category)).size, [uoms])
  const activeCount = useMemo(() => uoms.filter((u) => u.isActive).length, [uoms])

  const [createMutation, { loading: creating }] = useMutation(CREATE_UOM, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      toast.success('Unit of measure created')
    },
    onError: (e) => toast.error(e.message),
  })
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_UOM, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      toast.success('Unit of measure updated')
    },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_UOM, {
    onCompleted: () => {
      refetch()
      toast.success('Unit of measure deleted')
    },
    onError: (e) => toast.error(e.message),
  })

  const openNew = () => {
    setForm(EMPTY)
    setOpen(true)
  }
  const openEdit = (row: UomRow) => {
    setForm({ id: row.id, name: row.name, category: row.category, ratio: row.ratio, type: row.type, gstUqc: row.gstUqc ?? '', isActive: row.isActive })
    setOpen(true)
  }

  const submit = () => {
    if (!form.name.trim()) return toast.error('Name is required')
    if (!form.category.trim()) return toast.error('Category is required')
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      ratio: Number(form.ratio) || 1,
      type: form.type,
      gstUqc: form.gstUqc.trim() || undefined,
      isActive: form.isActive,
    }
    if (form.id) {
      updateMutation({ variables: { id: form.id, input: payload } })
    } else {
      createMutation({ variables: { input: { ...payload, organizationId: orgId } } })
    }
  }

  const columns: Column[] = [
    { key: 'name', label: 'Name', sortable: true, render: (v) => <span className="text-sm font-medium">{v}</span> },
    { key: 'category', label: 'Category', width: '140px', render: (v) => <span className="text-sm">{v}</span> },
    { key: 'type', label: 'Type', width: '130px', render: (v) => <span className="text-sm capitalize text-muted-foreground">{v}</span> },
    { key: 'ratio', label: 'Ratio', width: '90px', align: 'right', render: (v) => <span className="tabular-nums text-sm">{v}</span> },
    { key: 'gstUqc', label: 'GST UQC', width: '100px', render: (v) => <MonoCell value={v} /> },
    { key: 'isActive', label: 'Status', width: '100px', render: (v) => <ErpBadge status={v ? 'active' : 'inactive'} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Units of Measure"
        subtitle="Nos, Box, kg, … — grouped by convertible category, with Indian GST UQC codes for HSN/GST filing."
        icon={<Ruler className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Products' }, { label: 'Units of Measure' }]}
        actions={
          <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New UoM
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total UoMs" value={uoms.length} icon={<Ruler className="h-5 w-5" />} variant="slate" />
        <StatCard label="Categories" value={categoryCount} icon={<Layers className="h-5 w-5" />} variant="blue" />
        <StatCard label="Active" value={activeCount} icon={<Ruler className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <DataTable
        data={uoms}
        columns={columns}
        loading={loading}
        title="All Units of Measure"
        searchable
        searchPlaceholder="Search UoMs…"
        emptyMessage="No units of measure found."
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
            onClick: (r: any) => { if (confirm(`Delete ${r.name}?`)) deleteMutation({ variables: { id: r.id } }) },
          },
        ]}
      />

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={form.id ? 'Edit unit of measure' : 'New unit of measure'}
        icon={<Ruler className="h-5 w-5" />}
        size="sm"
        submitting={creating || updating}
        onSubmit={submit}
        submitLabel={form.id ? 'Save changes' : 'Create UoM'}
      >
        <FormSection>
          <FieldGrid cols={2}>
            <div className="space-y-1.5">
              <Label htmlFor="u-name">Name *</Label>
              <Input id="u-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Box" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-category">Category *</Label>
              <Input id="u-category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="Unit" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-ratio">Ratio (vs reference unit)</Label>
              <Input id="u-ratio" type="number" step="0.0001" value={form.ratio} onChange={(e) => setForm((p) => ({ ...p, ratio: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-type">Type</Label>
              <select
                id="u-type"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="reference">Reference unit</option>
                <option value="bigger">Bigger than reference</option>
                <option value="smaller">Smaller than reference</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-uqc">GST UQC</Label>
              <Input id="u-uqc" value={form.gstUqc} onChange={(e) => setForm((p) => ({ ...p, gstUqc: e.target.value.toUpperCase() }))} placeholder="BOX" className="font-mono" />
            </div>
          </FieldGrid>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            Active
          </label>
        </FormSection>
      </FormModal>
    </div>
  )
}
