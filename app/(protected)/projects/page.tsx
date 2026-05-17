'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_PROJECTS, CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT, SUBMIT_PROJECT_FOR_APPROVAL } from '@/gql/queries'
import { Trash2, Edit, X, Save, FolderKanban, CheckCircle, Clock, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

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

  const statusColor: Record<string, string> = {
    active: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    inactive: 'bg-gray-100 text-gray-600 border-gray-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '120px', render: v => <span className="font-mono text-xs text-gray-500">{v || '—'}</span> },
    { key: 'name', label: 'Project Name', sortable: true, render: v => <span className="font-medium text-gray-800">{v}</span> },
    { key: 'description', label: 'Description', render: v => <span className="text-gray-500 text-xs">{v || '—'}</span> },
    { key: 'startDate', label: 'Start Date', width: '110px', render: v => v ? formatDate(v) : '—' },
    { key: 'endDate', label: 'End Date', width: '110px', render: v => v ? formatDate(v) : '—' },
    {
      key: 'status', label: 'Status', width: '110px',
      render: v => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColor[v] || statusColor.inactive}`}>{v}</span>
    },
    {
      key: '_orgApproval',
      label: 'Org approval',
      width: '168px',
      render: (_v, row: any) => {
        const ap = String(row.orgApprovalStatus ?? 'approved')
        const showSubmit = ap === 'draft' || ap === 'approval_declined'
        const label =
          ap === 'draft'
            ? 'Draft'
            : ap === 'submitted'
              ? 'Pending approval'
              : ap === 'approval_declined'
                ? 'Declined'
                : 'Approved'
        return (
          <div className="flex flex-col gap-1 min-w-[140px]">
            <span className="text-xs text-gray-600">{label}</span>
            {showSubmit ? (
              <select
                aria-label="Project approval action"
                className="h-7 text-xs rounded-md border border-gray-200 bg-white px-2"
                defaultValue=""
                onChange={(e) => {
                  const val = e.target.value
                  e.target.value = ''
                  if (val === 'submit') void submitProjectForApproval({ variables: { id: row.id } })
                }}
              >
                <option value="">Change status…</option>
                <option value="submit">Send for approval</option>
              </select>
            ) : (
              <span className="text-xs text-gray-400">—</span>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-gray-500">Manage your projects and track progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: FolderKanban, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: stats.active, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Inactive', value: stats.inactive, icon: XCircle, cls: 'text-gray-600 bg-gray-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Form */}
      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Project' : 'New Project'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
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
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
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
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Project"
        searchable
        searchPlaceholder="Search projects..."
        emptyMessage="No projects yet. Click 'New Project' to create one."
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete this project?')) deleteProject({ variables: { id: row.id } }) }, variant: 'ghost' },
        ]}
      />
    </div>
  )
}
