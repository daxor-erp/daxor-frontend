'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_ATTRIBUTES, CREATE_ATTRIBUTE, UPDATE_ATTRIBUTE, DELETE_ATTRIBUTE } from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { FormModal, FormSection } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Layers, X } from 'lucide-react'

type AttributeRow = { id: string; name: string; isActive: boolean; values: Array<{ id: string; value: string }> }

export default function AttributesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [values, setValues] = useState<string[]>([])
  const [newValue, setNewValue] = useState('')

  const { data, loading, refetch } = useQuery(GET_ATTRIBUTES, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const attributes: AttributeRow[] = data?.attributes ?? []

  const [createMutation, { loading: creating }] = useMutation(CREATE_ATTRIBUTE, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      toast.success('Attribute created')
    },
    onError: (e) => toast.error(e.message),
  })
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_ATTRIBUTE, {
    onCompleted: () => {
      refetch()
      setOpen(false)
      toast.success('Attribute updated')
    },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_ATTRIBUTE, {
    onCompleted: () => {
      refetch()
      toast.success('Attribute deleted')
    },
    onError: (e) => toast.error(e.message),
  })

  const openNew = () => {
    setEditingId(null)
    setName('')
    setValues([])
    setNewValue('')
    setOpen(true)
  }
  const openEdit = (row: AttributeRow) => {
    setEditingId(row.id)
    setName(row.name)
    setValues(row.values.map((v) => v.value))
    setNewValue('')
    setOpen(true)
  }

  const addValue = () => {
    const v = newValue.trim()
    if (!v || values.includes(v)) return
    setValues((p) => [...p, v])
    setNewValue('')
  }

  const submit = () => {
    if (!name.trim()) return toast.error('Attribute name is required')
    const payload = { name: name.trim(), values }
    if (editingId) {
      updateMutation({ variables: { id: editingId, input: payload } })
    } else {
      createMutation({ variables: { input: { ...payload, organizationId: orgId } } })
    }
  }

  return (
    <div className="erp-shell">
      <PageHeader
        title="Product Attributes"
        description="Reusable attributes (Make, Model, Size, ...) — combinations of selected values generate product variants."
        actions={
          <Button size="sm" onClick={openNew} className="gap-1.5">
            <Plus className="h-4 w-4" /> New attribute
          </Button>
        }
      />

      <SectionCard title="Attributes" bodyClassName="p-0">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : attributes.length === 0 ? (
          <div className="p-10 text-center">
            <Layers className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No attributes yet</p>
            <Button size="sm" onClick={openNew} className="mt-3 gap-1.5">
              <Plus className="h-4 w-4" /> New attribute
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {attributes.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3 px-5 py-3.5 hover:bg-secondary/30">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{a.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {a.values.length === 0 ? (
                      <span className="text-xs text-muted-foreground italic">No values yet</span>
                    ) : (
                      a.values.map((v) => (
                        <Badge key={v.id} variant="secondary" className="text-xs">{v.value}</Badge>
                      ))
                    )}
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(a)} className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete "${a.name}"?`)) deleteMutation({ variables: { id: a.id } }) }}
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
        title={editingId ? 'Edit attribute' : 'New attribute'}
        icon={<Layers className="h-5 w-5" />}
        size="sm"
        submitting={creating || updating}
        onSubmit={submit}
        submitLabel={editingId ? 'Save changes' : 'Create attribute'}
      >
        <FormSection>
          <div className="space-y-1.5">
            <Label htmlFor="a-name">Name *</Label>
            <Input id="a-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Make" />
          </div>
          <div className="space-y-1.5">
            <Label>Values</Label>
            <div className="flex gap-2">
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addValue()
                  }
                }}
                placeholder="NAKSHTRA"
              />
              <Button type="button" variant="outline" onClick={addValue}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {values.map((v) => (
                <Badge key={v} variant="secondary" className="text-xs gap-1">
                  {v}
                  <button type="button" onClick={() => setValues((p) => p.filter((x) => x !== v))}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </FormSection>
      </FormModal>
    </div>
  )
}
