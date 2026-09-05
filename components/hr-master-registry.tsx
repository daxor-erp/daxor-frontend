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
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, List } from 'lucide-react'

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
  const activeCount = useMemo(() => rows.filter((r) => r.active).length, [rows])

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

  const columns: Column[] = useMemo(() => {
    const cols: Column[] = [
      { key: 'code', label: 'Code', width: '120px', render: (v) => <MonoCell value={v} className="font-semibold text-foreground" /> },
      { key: 'name', label: 'Name', sortable: true, render: (v) => <span className="text-sm font-medium">{v}</span> },
      { key: 'description', label: 'Description', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    ]
    if (metadataFields.length > 0) {
      cols.push({
        key: 'metadataJson',
        label: 'Details',
        render: (v) => {
          const metadata = parseMeta(v)
          if (renderMetadataSummary) return <span className="text-xs text-muted-foreground">{renderMetadataSummary(metadata)}</span>
          const summary = metadataFields
            .map((f) => (metadata[f.key] != null && metadata[f.key] !== '' ? `${f.label}: ${metadata[f.key]}` : null))
            .filter(Boolean)
            .join(' · ')
          return <span className="text-xs text-muted-foreground">{summary || '—'}</span>
        },
      })
    }
    cols.push({
      key: 'active',
      label: 'Status',
      width: '100px',
      render: (v) => <ErpBadge status={v ? 'active' : 'inactive'} />,
    })
    return cols
  }, [metadataFields, renderMetadataSummary])

  return (
    <div className="erp-shell">
      <PageHeader
        title={title}
        subtitle={description}
        icon={icon}
        breadcrumbs={[{ label: 'HR' }, { label: title }]}
        actions={
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="h-3.5 w-3.5 rounded border-border text-primary" />
              Show inactive
            </label>
            <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" /> New Entry
            </Button>
          </div>
        }
      />

      <StatsRow cols={2}>
        <StatCard label="Total Entries" value={rows.length} icon={icon ?? <List className="h-5 w-5" />} variant="slate" />
        <StatCard label="Active" value={activeCount} icon={<List className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <DataTable
        data={rows}
        columns={columns}
        loading={loading}
        title={`All ${title}`}
        searchable
        searchPlaceholder="Search code / name…"
        emptyMessage="No entries found."
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
            onClick: (r: any) => { if (confirm(`Delete ${r.code}?`)) deleteMutation({ variables: { id: r.id } }) },
          },
        ]}
      />

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
