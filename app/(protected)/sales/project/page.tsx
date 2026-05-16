'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PROJECTS, CREATE_PROJECT, SUBMIT_PROJECT_FOR_APPROVAL } from '@/gql/queries'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X, Save, FolderKanban, CheckCircle2, Clock, Archive } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  active:    { label: 'Active',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  inactive:  { label: 'Inactive',  cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  deleted:   { label: 'Deleted',   cls: 'bg-red-50 text-red-600 border-red-200' },
}

const COLS = [
  { key: 'seqNo',       label: 'Code',        w: 'w-24' },
  { key: 'name',        label: 'Project Name', w: 'w-48' },
  { key: 'description', label: 'Description',  w: 'flex-1' },
  { key: 'startDate',   label: 'Start Date',   w: 'w-32' },
  { key: 'endDate',     label: 'End Date',     w: 'w-32' },
  { key: 'status',      label: 'Status',       w: 'w-28' },
  { key: 'orgApproval', label: 'Org approval',   w: 'w-44' },
]

export default function SalesProjectPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data, loading, refetch } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const [create, { loading: saving, error: saveError }] = useMutation(CREATE_PROJECT, {
    onCompleted: () => { setAdding(false); setForm({ name: '', description: '', startDate: '', endDate: '' }); setErrors({}); refetch() },
  })

  const [submitProjectForApproval] = useMutation(SUBMIT_PROJECT_FOR_APPROVAL, {
    onCompleted: () => refetch(),
  })

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', startDate: '', endDate: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const projects = data?.projects ?? []
  const stats = {
    total: projects.length,
    active: projects.filter((p: any) => p.status === 'active').length,
    completed: projects.filter((p: any) => p.status === 'completed').length,
    inactive: projects.filter((p: any) => p.status === 'inactive').length,
  }

  const set = (f: string, v: string) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })) }

  const handleSave = () => {
    if (!form.name.trim()) { setErrors({ name: 'Required' }); return }
    create({ variables: { input: { name: form.name.trim(), description: form.description || undefined, startDate: form.startDate || undefined, endDate: form.endDate || undefined, organizationId: orgId } } })
  }

  return (
    
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-500">Manage and track all sales projects</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', value: stats.total, icon: FolderKanban, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: stats.active, icon: Clock, cls: 'text-emerald-600 bg-emerald-50' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, cls: 'text-indigo-600 bg-indigo-50' },
          { label: 'Inactive', value: stats.inactive, icon: Archive, cls: 'text-gray-500 bg-gray-100' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Excel Grid */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-semibold text-gray-700">Projects</span>
          {!adding && (
            <Button size="sm" onClick={() => setAdding(true)} className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Row
            </Button>
          )}
        </div>

        {/* Header row */}
        <div className="flex border-b border-gray-300 bg-[#f0f0f0]">
          <div className="w-8 border-r border-gray-300 flex items-center justify-center text-xs text-gray-400 font-medium py-2">#</div>
          {COLS.map(c => (
            <div key={c.key} className={`${c.w} border-r border-gray-300 last:border-r-0 px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide`}>
              {c.label}
            </div>
          ))}
        </div>

        {/* New row input */}
        {adding && (
          <div className="flex border-b border-blue-300 bg-blue-50/40">
            <div className="w-8 border-r border-gray-300 flex items-center justify-center text-xs text-blue-400 py-1">*</div>

            {/* Code — auto */}
            <div className="w-24 border-r border-gray-300 px-1 py-1">
              <input disabled placeholder="Auto" className="w-full h-7 px-2 text-xs bg-transparent text-gray-400 outline-none" />
            </div>

            {/* Name */}
            <div className="w-48 border-r border-gray-300 px-1 py-1">
              <input
                autoFocus
                value={form.name}
                onChange={e => set('name', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="Project name *"
                className={`w-full h-7 px-2 text-xs border rounded outline-none focus:ring-1 focus:ring-blue-400 ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
              />
            </div>

            {/* Description */}
            <div className="flex-1 border-r border-gray-300 px-1 py-1">
              <input
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Description"
                className="w-full h-7 px-2 text-xs border border-gray-300 rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Start Date */}
            <div className="w-32 border-r border-gray-300 px-1 py-1">
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
                className="w-full h-7 px-2 text-xs border border-gray-300 rounded bg-white outline-none focus:ring-1 focus:ring-blue-400" />
            </div>

            {/* End Date */}
            <div className="w-32 border-r border-gray-300 px-1 py-1">
              <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
                className="w-full h-7 px-2 text-xs border border-gray-300 rounded bg-white outline-none focus:ring-1 focus:ring-blue-400" />
            </div>

            {/* Status — inactive until approved */}
            <div className="w-28 border-r border-gray-300 px-2 py-1 flex items-center">
              <span className="text-xs text-gray-400 italic">inactive</span>
              <div className="ml-auto flex gap-1">
                <button onClick={handleSave} disabled={saving}
                  className="h-6 w-6 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  <Save className="h-3 w-3" />
                </button>
                <button onClick={() => { setAdding(false); setErrors({}) }}
                  className="h-6 w-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="w-44 px-2 py-1 flex items-center text-xs text-gray-400">—</div>
          </div>
        )}

        {/* Error row */}
        {(errors.name || saveError) && adding && (
          <div className="flex bg-red-50 border-b border-red-200 px-3 py-1">
            <p className="text-xs text-red-600">{errors.name || saveError?.message}</p>
          </div>
        )}

        {/* Data rows */}
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : projects.length === 0 && !adding ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FolderKanban className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">No projects yet. Click "Add Row" to create one.</p>
          </div>
        ) : (
          projects.map((p: any, idx: number) => {
            const s = STATUS_CFG[p.status] ?? STATUS_CFG.inactive
            return (
              <div key={p.id} className={`flex border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <div className="w-8 border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-2">{idx + 1}</div>
                <div className="w-24 border-r border-gray-200 px-2 py-2 text-xs font-mono text-gray-400">{p.seqNo || '—'}</div>
                <div className="w-48 border-r border-gray-200 px-2 py-2 text-xs font-medium text-gray-800 truncate">{p.name}</div>
                <div className="flex-1 border-r border-gray-200 px-2 py-2 text-xs text-gray-500 truncate">{p.description || '—'}</div>
                <div className="w-32 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{p.startDate ? new Date(p.startDate).toLocaleDateString() : '—'}</div>
                <div className="w-32 border-r border-gray-200 px-2 py-2 text-xs text-gray-600">{p.endDate ? new Date(p.endDate).toLocaleDateString() : '—'}</div>
                <div className="w-28 border-r border-gray-200 px-2 py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${s.cls}`}>{s.label}</span>
                </div>
                <div className="w-44 px-2 py-2">
                  {(() => {
                    const ap = String(p.orgApprovalStatus ?? 'approved')
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
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600">{label}</span>
                        {showSubmit ? (
                          <select
                            aria-label="Project approval action"
                            className="h-7 text-xs rounded-md border border-gray-200 bg-white px-2 max-w-[160px]"
                            defaultValue=""
                            onChange={(e) => {
                              const val = e.target.value
                              e.target.value = ''
                              if (val === 'submit') void submitProjectForApproval({ variables: { id: p.id } })
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
                  })()}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
