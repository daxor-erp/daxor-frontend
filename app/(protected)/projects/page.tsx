'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_PROJECTS, CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT, SUBMIT_PROJECT_FOR_APPROVAL } from '@/gql/queries'
import { Trash2, Edit, X, Save, FolderKanban, CheckCircle, Clock, XCircle, Plus, Send } from 'lucide-react'

const EMPTY_FORM = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'active',
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const [createProject, { loading: saving }] = useMutation(CREATE_PROJECT, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [updateProject, { loading: updating }] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => { refetch(); setEditing(null); reset() },
  })

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: () => refetch(),
  })

  const [submitProjectForApproval] = useMutation(SUBMIT_PROJECT_FOR_APPROVAL, {
    onCompleted: () => refetch(),
  })

  const reset = () => { setForm({ ...EMPTY_FORM }); setErrors({}) }
  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      name: form.name,
      description: form.description || undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      organizationId: orgId,
    }
    if (editing) {
      updateProject({ variables: { id: editing, input: { name: form.name, description: form.description || undefined, startDate: form.startDate || undefined, endDate: form.endDate || undefined, status: form.status } } })
    } else {
      createProject({ variables: { input } })
    }
  }

  const handleEdit = (project: any) => {
    setForm({
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      status: project.status || 'active',
    })
    setEditing(project.id)
    setAdding(true)
  }

  const projects = data?.projects ?? []
  const stats = {
    total: projects.length,
    active: projects.filter((p: any) => p.status === 'active').length,
    completed: projects.filter((p: any) => p.status === 'completed').length,
    inactive: projects.filter((p: any) => p.status === 'inactive').length,
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '120px', render: (v) => <MonoCell value={v} /> },
    { key: 'name', label: 'Project Name', sortable: true, render: (v) => <span className="text-sm font-medium">{v}</span> },
    { key: 'description', label: 'Description', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'startDate', label: 'Start Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'endDate', label: 'End Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <ErpBadge status={String(v)} /> },
    {
      key: 'orgApprovalStatus',
      label: 'Org Approval',
      width: '140px',
      render: (v) => {
        const ap = String(v ?? 'approved')
        const label =
          ap === 'draft' ? 'Draft'
            : ap === 'submitted' ? 'Pending approval'
              : ap === 'approval_declined' ? 'Declined'
                : 'Approved'
        return <ErpBadge status={ap === 'submitted' ? 'submitted' : ap} label={label} />
      },
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Projects"
        subtitle="Manage your projects and track progress"
        icon={<FolderKanban className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Projects' }]}
        actions={
          <Button onClick={() => { reset(); setEditing(null); setAdding(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Project
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total" value={stats.total} icon={<FolderKanban className="h-5 w-5" />} variant="blue" />
        <StatCard label="Active" value={stats.active} icon={<CheckCircle className="h-5 w-5" />} variant="green" />
        <StatCard label="Completed" value={stats.completed} icon={<Clock className="h-5 w-5" />} variant="slate" />
        <StatCard label="Inactive" value={stats.inactive} icon={<XCircle className="h-5 w-5" />} variant="amber" />
      </StatsRow>

      {adding && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Project' : 'New Project'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Project Name *" value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} className="h-7 text-xs" />
              <SelectFloating
                label="Status"
                value={form.status}
                onChange={e => setF('status', typeof e === 'string' ? e : e.target.value)}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Start Date" type="date" value={form.startDate} onChange={e => setF('startDate', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="End Date" type="date" value={form.endDate} onChange={e => setF('endDate', e.target.value)} className="h-7 text-xs" />
            </div>
            <InputFloating label="Description" multiline rows={2} value={form.description} onChange={e => setF('description', e.target.value)} className="text-xs min-h-[50px]" />
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setEditing(null); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update' : 'Save Project'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={projects}
        columns={columns}
        loading={loading}
        title="All Projects"
        searchable
        searchPlaceholder="Search projects…"
        emptyMessage="No projects yet. Click New Project to create one."
        pageSize={25}
        onRowClick={handleEdit}
        actions={[
          {
            label: 'Send for approval',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (row: any) => submitProjectForApproval({ variables: { id: row.id } }),
            show: (row: any) => {
              const ap = String(row.orgApprovalStatus ?? 'approved')
              return ap === 'draft' || ap === 'approval_declined'
            },
          },
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: (row) => handleEdit(row) },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (row) => { if (confirm('Delete this project?')) deleteProject({ variables: { id: row.id } }) },
          },
        ]}
      />
    </div>
  )
}
