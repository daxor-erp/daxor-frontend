'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_UOMS, CREATE_UOM, UPDATE_UOM, DELETE_UOM, ENSURE_DEFAULT_UOMS } from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Ruler } from 'lucide-react'

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
  const grouped = useMemo(() => {
    const byCategory = new Map<string, UomRow[]>()
    for (const u of uoms) {
      const list = byCategory.get(u.category) ?? []
      list.push(u)
      byCategory.set(u.category, list)
    }
    return Array.from(byCategory.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [uoms])

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

  return (
    <div className="mx-auto w-full max-w-[1100px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Units of Measure"
        description="Nos, Box, kg, ... — grouped by convertible category, with Indian GST UQC codes for HSN/GST filing."
        actions={
          <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" /> New UoM
          </Button>
        }
      />

      {loading ? (
        <SectionCard><p className="text-sm text-muted-foreground text-center py-6">Loading…</p></SectionCard>
      ) : grouped.length === 0 ? (
        <SectionCard>
          <div className="text-center py-6">
            <Ruler className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No units of measure yet</p>
          </div>
        </SectionCard>
      ) : (
        grouped.map(([category, rows]) => (
          <SectionCard key={category} title={category} bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60">
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Name</th>
                    <th className="px-3 py-2.5 font-medium">Type</th>
                    <th className="px-3 py-2.5 font-medium text-right">Ratio</th>
                    <th className="px-3 py-2.5 font-medium">GST UQC</th>
                    <th className="px-5 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-secondary/30 cursor-pointer" onClick={() => openEdit(u)}>
                      <td className="px-5 py-2.5 font-medium">{u.name}</td>
                      <td className="px-3 py-2.5 text-muted-foreground capitalize">{u.type}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{u.ratio}</td>
                      <td className="px-3 py-2.5 font-mono text-xs">{u.gstUqc || '—'}</td>
                      <td className="px-5 py-2.5 text-right">
                        <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => openEdit(u)} className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Delete ${u.name}?`)) deleteMutation({ variables: { id: u.id } }) }}
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
          </SectionCard>
        ))
      )}

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
