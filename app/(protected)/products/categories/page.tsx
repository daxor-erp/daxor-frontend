'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_PRODUCT_CATEGORIES,
  CREATE_PRODUCT_CATEGORY,
  UPDATE_PRODUCT_CATEGORY,
  DELETE_PRODUCT_CATEGORY,
} from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { FormModal, FormSection } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react'

type CategoryRow = { id: string; name: string; parentId: string | null; fullPath: string; isActive: boolean }

type CategoryForm = { id?: string; name: string; parentId: string; isActive: boolean }

const EMPTY: CategoryForm = { name: '', parentId: '', isActive: true }

export default function ProductCategoriesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CategoryForm>(EMPTY)

  const { data, loading, refetch } = useQuery(GET_PRODUCT_CATEGORIES, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const categories: CategoryRow[] = useMemo(() => data?.productCategories ?? [], [data])
  const sorted = useMemo(() => [...categories].sort((a, b) => a.fullPath.localeCompare(b.fullPath)), [categories])

  const [createMutation, { loading: creating }] = useMutation(CREATE_PRODUCT_CATEGORY, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      toast.success('Category created')
    },
    onError: (e) => toast.error(e.message),
  })
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_PRODUCT_CATEGORY, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      toast.success('Category updated')
    },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_PRODUCT_CATEGORY, {
    onCompleted: () => {
      refetch()
      toast.success('Category deleted')
    },
    onError: (e) => toast.error(e.message),
  })

  const openNew = () => {
    setForm(EMPTY)
    setOpen(true)
  }
  const openEdit = (row: CategoryRow) => {
    setForm({ id: row.id, name: row.name, parentId: row.parentId ?? '', isActive: row.isActive })
    setOpen(true)
  }

  const submit = () => {
    if (!form.name.trim()) return toast.error('Category name is required')
    const payload = { name: form.name.trim(), parentId: form.parentId || null, isActive: form.isActive }
    if (form.id) {
      updateMutation({ variables: { id: form.id, input: payload } })
    } else {
      createMutation({ variables: { input: { ...payload, organizationId: orgId } } })
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Product Categories"
        description="Hierarchical tree used to organize the product catalog, e.g. All → Tools → Tools Consumables."
        actions={
          <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" /> New category
          </Button>
        }
      />

      <SectionCard title="Category tree" bodyClassName="p-0">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : sorted.length === 0 ? (
          <div className="p-10 text-center">
            <FolderTree className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No categories yet</p>
            <Button onClick={openNew} className="mt-3 bg-grad-brand text-white border-none gap-1.5">
              <Plus className="h-4 w-4" /> New category
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sorted.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-secondary/30 cursor-pointer" onClick={() => openEdit(c)}>
                <div>
                  <p className="text-sm font-medium">{c.fullPath}</p>
                  {!c.isActive && <span className="text-xs text-muted-foreground">Inactive</span>}
                </div>
                <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openEdit(c)} className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${c.name}"?`)) deleteMutation({ variables: { id: c.id } })
                    }}
                    className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={form.id ? 'Edit category' : 'New category'}
        icon={<FolderTree className="h-5 w-5" />}
        size="sm"
        submitting={creating || updating}
        onSubmit={submit}
        submitLabel={form.id ? 'Save changes' : 'Create category'}
      >
        <FormSection>
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Name *</Label>
            <Input id="c-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Tools Consumables" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-parent">Parent category</Label>
            <select
              id="c-parent"
              value={form.parentId}
              onChange={(e) => setForm((p) => ({ ...p, parentId: e.target.value }))}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">No parent (top level)</option>
              {sorted.filter((c) => c.id !== form.id).map((c) => (
                <option key={c.id} value={c.id}>{c.fullPath}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            Active
          </label>
        </FormSection>
      </FormModal>
    </div>
  )
}
