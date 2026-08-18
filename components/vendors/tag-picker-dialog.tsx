'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { InputFloating } from '@/components/ui/input-floating'
import { GET_TAGS, CREATE_TAG } from '@/gql/queries'
import { Plus, Search, Tag as TagIcon } from 'lucide-react'
import { toast } from 'sonner'

export type VendorTagValue = { tagId: string; name: string; color: string; category?: string | null }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
  /** Currently selected tags on the vendor form (kept in local wizard state until save). */
  value: VendorTagValue[]
  onChange: (next: VendorTagValue[]) => void
}

const PALETTE = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#94a3b8']

export function TagPickerDialog({ open, onOpenChange, organizationId, value, onChange }: Props) {
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newColor, setNewColor] = useState(PALETTE[5])

  const { data, loading, refetch } = useQuery(GET_TAGS, {
    variables: { organizationId, search: search || undefined },
    skip: !open || !organizationId,
    fetchPolicy: 'cache-and-network',
  })

  const [createTag, { loading: savingTag }] = useMutation(CREATE_TAG, {
    onCompleted: (res) => {
      const t = res.createTag
      onChange([...value, { tagId: t.id, name: t.name, color: t.color, category: t.category }])
      setCreating(false)
      setNewName('')
      setNewCategory('')
      void refetch()
      toast.success(`Tag "${t.name}" created`)
    },
    onError: (e) => toast.error(e.message ?? 'Failed to create tag'),
  })

  const tags = (data?.tags ?? []) as Array<{ id: string; name: string; color: string; category?: string | null; isActive: boolean }>
  const selectedIds = useMemo(() => new Set(value.map((v) => v.tagId)), [value])

  const toggle = (t: { id: string; name: string; color: string; category?: string | null }) => {
    if (selectedIds.has(t.id)) {
      onChange(value.filter((v) => v.tagId !== t.id))
    } else {
      onChange([...value, { tagId: t.id, name: t.name, color: t.color, category: t.category }])
    }
  }

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error('Tag name is required')
      return
    }
    createTag({
      variables: {
        input: { name: newName.trim(), color: newColor, category: newCategory.trim() || undefined, organizationId },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <TagIcon className="h-4 w-4" /> Select tags
          </DialogTitle>
        </DialogHeader>

        {!creating ? (
          <>
            <InputFloating
              label="Search tags"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-3.5 w-3.5" />}
              className="h-9 text-xs"
            />
            <div className="max-h-64 overflow-y-auto rounded-md border border-border divide-y divide-border">
              {loading ? (
                <div className="p-4 text-xs text-muted-foreground text-center">Loading…</div>
              ) : tags.length === 0 ? (
                <div className="p-4 text-xs text-muted-foreground text-center">No tags found.</div>
              ) : (
                tags.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-muted/50"
                  >
                    <Checkbox checked={selectedIds.has(t.id)} onCheckedChange={() => toggle(t)} />
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="font-medium">{t.name}</span>
                    {t.category && <span className="text-xs text-muted-foreground ml-auto">{t.category}</span>}
                  </label>
                ))
              )}
            </div>
            <DialogFooter className="sm:justify-between">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreating(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Create tag
              </Button>
              <Button type="button" size="sm" onClick={() => onOpenChange(false)}>
                Done ({value.length} selected)
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <InputFloating label="Tag name *" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-9 text-xs" />
              <InputFloating label="Category (optional)" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="h-9 text-xs" />
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Color</p>
                <div className="flex gap-2">
                  {PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`h-6 w-6 rounded-full border-2 ${newColor === c ? 'border-foreground' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Choose color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setCreating(false)}>
                Back
              </Button>
              <Button type="button" size="sm" onClick={handleCreate} disabled={savingTag}>
                {savingTag ? 'Creating…' : 'Create & add'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
