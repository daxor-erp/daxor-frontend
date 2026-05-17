'use client'

/**
 * Reusable CRUD page for any HR master that fits the generic
 * { code, name, description, metadata } shape — shift master, calendar
 * master, FWL qualification, asset name list, career grade, exit reason.
 *
 * Pages drop it in:
 *   <HrMasterRegistry
 *     kind="SHIFT"
 *     title="Shift Master"
 *     description="Define work shifts and their hours."
 *     icon={<Clock />}
 *     metadataFields={[
 *       { key: 'startTime', label: 'Start time', type: 'time' },
 *       { key: 'endTime', label: 'End time', type: 'time' },
 *       { key: 'breakMinutes', label: 'Break (mins)', type: 'number' },
 *     ]}
 *   />
 */

import { ReactNode, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_HR_MASTERS,
  CREATE_HR_MASTER,
  UPDATE_HR_MASTER,
  DELETE_HR_MASTER,
} from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MetadataFieldDef {
  key: string
  label: string
  type?: 'text' | 'number' | 'time' | 'date' | 'select'
  options?: string[]
  placeholder?: string
}

interface HrMasterRegistryProps {
  kind: string
  title: string
  description: string
  icon?: ReactNode
  metadataFields?: MetadataFieldDef[]
  /** Column header for metadata summary in the list. Receives parsed metadata. */
  renderMetadataSummary?: (metadata: Record<string, any>) => ReactNode
}

interface MasterForm {
  id?: string
  code: string
  name: string
  description: string
  metadata: Record<string, any>
  active: boolean
  sortOrder: number
}

const EMPTY: MasterForm = {
  code: '',
  name: '',
  description: '',
  metadata: {},
  active: true,
  sortOrder: 0,
}

export function HrMasterRegistry({
  kind,
  title,
  description,
  icon,
  metadataFields = [],
  renderMetadataSummary,
}: HrMasterRegistryProps) {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<MasterForm>(EMPTY)
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  const { data, loading, refetch } = useQuery(GET_HR_MASTERS, {
    variables: { organizationId: orgId, kind, active: showInactive ? null : true, search: null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_HR_MASTER, {
    onCompleted: () => { refetch(); setOpen(false); setForm(EMPTY); toast.success(`${title} entry created`) },
    onError: (e) => toast.error(e.message),
  })
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_HR_MASTER, {
    onCompleted: () => { refetch(); setOpen(false); setForm(EMPTY); toast.success(`${title} entry updated`) },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_HR_MASTER, {
    onCompleted: () => { refetch(); toast.success('Entry deleted') },
    onError: (e) => toast.error(e.message),
  })

  const rows: any[] = data?.hrMasters ?? []
  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => r.code?.toLowerCase().includes(q) || r.name?.toLowerCase().includes(q))
  }, [rows, search])

  const openNew = () => { setForm(EMPTY); setOpen(true) }
  const openEdit = (row: any) => {
    let metadata: Record<string, any> = {}
    try { metadata = JSON.parse(row.metadataJson ?? '{}') } catch { /* invalid JSON — fall back to empty */ }
    setForm({
      id: row.id,
      code: row.code ?? '',
      name: row.name ?? '',
      description: row.description ?? '',
      metadata,
      active: !!row.active,
      sortOrder: Number(row.sortOrder ?? 0),
    })
    setOpen(true)
  }

  const submit = () => {
    if (!form.code.trim()) return toast.error('Code is required')
    if (!form.name.trim()) return toast.error('Name is required')
    const payload: any = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      description: form.description || undefined,
      metadataJson: JSON.stringify(form.metadata ?? {}),
      active: form.active,
      sortOrder: Number(form.sortOrder ?? 0),
    }
    if (form.id) {
      updateMutation({ variables: { id: form.id, input: payload } })
    } else {
      createMutation({ variables: { input: { ...payload, organizationId: orgId, kind } } })
    }
  }

  const parseMeta = (json?: string | null) => {
    try { return JSON.parse(json ?? '{}') } catch { return {} }
  }

  return (
    <div className="mx-auto w-full max-w-[1300px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" />
            New entry
          </Button>
        }
      />

      <SectionCard
        title={`${rows.length} ${rows.length === 1 ? 'entry' : 'entries'}`}
        description={`Click a row to edit. Codes are uppercase and must be unique per ${kind.toLowerCase().replace('_', ' ')}.`}
        action={
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 text-xs">
              <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="h-3.5 w-3.5 rounded border-border text-primary" />
              Show inactive
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code / name"
                className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 w-48"
              />
            </div>
          </div>
        }
        bodyClassName="p-0"
      >
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-10 w-10 mb-2 grid place-items-center rounded-full bg-primary-soft text-primary">
              {icon}
            </div>
            <p className="text-sm font-medium">No entries yet</p>
            <p className="text-xs text-muted-foreground mb-3">Create your first {title.toLowerCase()} entry.</p>
            <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
              <Plus className="h-4 w-4" /> New entry
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Description</th>
                  {metadataFields.length > 0 && <th className="px-3 py-3 font-medium">Details</th>}
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any) => {
                  const metadata = parseMeta(r.metadataJson)
                  return (
                    <tr key={r.id} className="border-t hover:bg-secondary/30 cursor-pointer" onClick={() => openEdit(r)}>
                      <td className="px-5 py-3 font-mono text-xs font-semibold">{r.code}</td>
                      <td className="px-3 py-3 font-medium">{r.name}</td>
                      <td className="px-3 py-3 text-muted-foreground">{r.description || '—'}</td>
                      {metadataFields.length > 0 && (
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          {renderMetadataSummary
                            ? renderMetadataSummary(metadata)
                            : metadataFields
                              .map((f) => metadata[f.key] != null && metadata[f.key] !== '' ? `${f.label}: ${metadata[f.key]}` : null)
                              .filter(Boolean)
                              .join(' · ') || <span className="text-muted-foreground">—</span>}
                        </td>
                      )}
                      <td className="px-3 py-3">
                        <span className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                          r.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200',
                        )}>
                          {r.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1">
                          <button onClick={() => openEdit(r)} className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Delete ${r.code}?`)) deleteMutation({ variables: { id: r.id } }) }}
                            className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={form.id ? `Edit ${title}` : `New ${title}`}
        description={description}
        icon={icon}
        size="md"
        submitting={creating || updating}
        onSubmit={submit}
        submitLabel={form.id ? 'Save changes' : 'Create'}
      >
        <FormSection>
          <FieldGrid cols={2}>
            <div className="space-y-1.5">
              <Label>Code *</Label>
              <Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} className="font-mono" required />
            </div>
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Sort order</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select
                value={form.active ? '1' : '0'}
                onChange={(e) => setForm((p) => ({ ...p, active: e.target.value === '1' }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </FieldGrid>
        </FormSection>

        {metadataFields.length > 0 && (
          <FormSection title="Details" className="pt-5 border-t border-border mt-5">
            <FieldGrid cols={metadataFields.length >= 3 ? 3 : 2}>
              {metadataFields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label>{f.label}</Label>
                  {f.type === 'select' ? (
                    <select
                      value={String(form.metadata[f.key] ?? '')}
                      onChange={(e) => setForm((p) => ({ ...p, metadata: { ...p.metadata, [f.key]: e.target.value } }))}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">—</option>
                      {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <Input
                      type={f.type === 'number' ? 'number' : f.type === 'time' ? 'time' : f.type === 'date' ? 'date' : 'text'}
                      value={String(form.metadata[f.key] ?? '')}
                      onChange={(e) => setForm((p) => ({ ...p, metadata: { ...p.metadata, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value } }))}
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              ))}
            </FieldGrid>
          </FormSection>
        )}
      </FormModal>
    </div>
  )
}
