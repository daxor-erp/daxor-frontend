'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column, Action } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import {
  GET_INTERCOMPANY_TRANSFERS,
  GET_ORGANIZATIONS,
  CREATE_INTERCOMPANY_TRANSFER,
  CONFIRM_INTERCOMPANY_TRANSFER,
  CANCEL_INTERCOMPANY_TRANSFER,
  DELETE_INTERCOMPANY_TRANSFER,
} from '@/gql/queries'
import {
  Building2, ClipboardList, FileEdit, BadgeCheck, XCircle,
  Trash2, X, Save, Plus, Minus, CalendarDays, ArrowRightLeft,
} from 'lucide-react'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'

const STATUS_MAP: Record<string, string> = {
  draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const EMPTY_LINE = { itemDescription: '', qty: '', unit: '' }

function fmtDate(v: string | null | undefined) {
  if (v == null || v === '') return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
}

type IctRow = {
  id: string
  transferNumber?: string | null
  transferDate?: string | null
  fromOrganizationName?: string | null
  toOrganizationName?: string | null
  lineItems?: unknown[] | null
  status?: string | null
  createdAt?: string | null
}

export default function IntercompanyTransferPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [adding, setAdding] = useState(false)
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().split('T')[0])
  const [fromOrgId, setFromOrgId] = useState('')
  const [toOrgId, setToOrgId] = useState('')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState([{ ...EMPTY_LINE }])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, error: listError, refetch } = useQuery(GET_INTERCOMPANY_TRANSFERS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const { data: orgData } = useQuery(GET_ORGANIZATIONS, {
    variables: { page: 1, limit: 300, search: undefined },
    skip: !orgId,
  })

  const reset = () => {
    setTransferDate(new Date().toISOString().split('T')[0])
    setFromOrgId(orgId)
    setToOrgId('')
    setNotes('')
    setLines([{ ...EMPTY_LINE }])
    setErrors({})
  }

  const closeForm = () => {
    setAdding(false)
    reset()
  }

  const orgs: { id: string; name?: string | null }[] = orgData?.organizations ?? []

  const orgName = (id: string) => orgs.find((o) => o.id === id)?.name ?? ''

  const orgOptions = [
    { value: '', label: 'Select organization…' },
    ...orgs.map((o) => ({ value: o.id, label: o.name ?? o.id })),
  ]

  const [createIct, { loading: saving }] = useMutation(CREATE_INTERCOMPANY_TRANSFER, {
    onCompleted: () => {
      void refetch()
      closeForm()
    },
    onError: (e) => alert(e.message),
  })

  const [confirmIct] = useMutation(CONFIRM_INTERCOMPANY_TRANSFER, {
    onCompleted: () => void refetch(),
    onError: (e) => alert(e.message),
  })

  const [cancelIct] = useMutation(CANCEL_INTERCOMPANY_TRANSFER, {
    onCompleted: () => void refetch(),
    onError: (e) => alert(e.message),
  })

  const [deleteIct] = useMutation(DELETE_INTERCOMPANY_TRANSFER, {
    onCompleted: () => void refetch(),
    onError: (e) => alert(e.message),
  })

  useEffect(() => {
    if (!orgId) return
    setFromOrgId((prev) => (prev === '' ? orgId : prev))
  }, [orgId])

  const setLine = (idx: number, k: string, v: string) => {
    setLines((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [k]: v }
      return next
    })
  }

  const addLine = () => setLines((p) => [...p, { ...EMPTY_LINE }])
  const removeLine = (idx: number) => setLines((p) => p.filter((_, i) => i !== idx))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!transferDate) e.transferDate = 'Required'
    if (!fromOrgId) e.fromOrg = 'Required'
    if (!toOrgId) e.toOrg = 'Required'
    if (fromOrgId && toOrgId && fromOrgId === toOrgId) {
      e.toOrg = 'Must differ from source'
    }
    if (lines.length === 0) e.lines = 'At least one line'
    lines.forEach((l, i) => {
      if (!l.itemDescription.trim()) e[`d${i}`] = '!'
      if (!(parseFloat(String(l.qty)) > 0)) e[`q${i}`] = '!'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!orgId) {
      alert('Organization required')
      return
    }
    if (!validate()) return
    createIct({
      variables: {
        input: {
          transferDate,
          fromOrganizationId: fromOrgId,
          toOrganizationId: toOrgId,
          fromOrganizationName: orgName(fromOrgId) || undefined,
          toOrganizationName: orgName(toOrgId) || undefined,
          organizationId: orgId,
          lineItems: lines.map((l) => ({
            itemDescription: l.itemDescription.trim(),
            qty: parseFloat(String(l.qty)) || 0,
            ...(l.unit.trim() ? { unit: l.unit.trim() } : {}),
          })),
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        },
      },
    })
  }

  const records: IctRow[] = data?.intercompanyTransfers ?? []

  const now = new Date()
  const stats = {
    total: records.length,
    draft: records.filter((r) => r.status === 'draft').length,
    confirmed: records.filter((r) => r.status === 'confirmed').length,
    thisMonth: records.filter((r) => {
      if (!r.createdAt) return false
      const d = new Date(r.createdAt)
      return Number.isNaN(d.getTime())
        ? false
        : d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length,
  }

  const columns: Column<IctRow>[] = [
    {
      key: 'transferNumber',
      label: 'ICT #',
      width: '130px',
      render: (v) => <span className="font-mono text-xs">{v ?? '—'}</span>,
    },
    {
      key: 'transferDate',
      label: 'Date',
      width: '100px',
      render: (v) => <span className="text-xs">{fmtDate(v as string)}</span>,
    },
    {
      key: 'fromOrganizationName',
      label: 'From',
      render: (v) => <span className="text-xs">{v || '—'}</span>,
    },
    {
      key: 'toOrganizationName',
      label: 'To',
      render: (v) => <span className="text-xs">{v || '—'}</span>,
    },
    {
      key: 'lineItems',
      label: 'Lines',
      width: '64px',
      render: (v) => <span className="text-xs">{Array.isArray(v) ? v.length : 0}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (v) => <ErpBadge status={String(v ?? '')} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '100px',
      render: (v) => <span className="text-xs text-gray-500">{fmtDate(v as string)}</span>,
    },
  ]

  const actions: Action<IctRow>[] = [
    {
      label: 'Confirm',
      icon: <BadgeCheck className="h-3.5 w-3.5 text-green-600" />,
      show: (r) => r.status === 'draft',
      onClick: (r) => {
        if (!r.id) return
        if (confirm('Confirm this intercompany transfer?')) confirmIct({ variables: { id: r.id } })
      },
    },
    {
      label: 'Cancel',
      icon: <XCircle className="h-3.5 w-3.5 text-amber-600" />,
      show: (r) => r.status !== 'cancelled',
      onClick: (r) => {
        if (!r.id) return
        if (confirm('Cancel this transfer?')) cancelIct({ variables: { id: r.id } })
      },
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-3.5 w-3.5 text-red-600" />,
      onClick: (r) => {
        if (!r.id) return
        if (confirm('Delete this transfer?')) deleteIct({ variables: { id: r.id } })
      },
    },
  ]

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Intercompany Transfer"
        subtitle="Log stock movements between legal entities / organizations"
        icon={<ArrowRightLeft className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Intercompany Transfer' }]}
        actions={
          <button onClick={() => { reset(); setFromOrgId(orgId); setAdding(true) }} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> New Transfer
          </button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total"      value={stats.total}     icon={<ClipboardList className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft"      value={stats.draft}     icon={<FileEdit      className="h-5 w-5" />} variant="amber" />
        <StatCard label="Confirmed"  value={stats.confirmed} icon={<BadgeCheck    className="h-5 w-5" />} variant="green" />
        <StatCard label="This Month" value={stats.thisMonth} icon={<CalendarDays  className="h-5 w-5" />} variant="violet" />
      </StatsRow>

      {adding && (
        <div className="border border-slate-400 rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
            <span className="text-xs font-semibold text-white flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" /> New intercompany transfer
            </span>
            <button type="button" onClick={closeForm} className="text-slate-300 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InputFloating
                label="Transfer date *"
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                error={errors.transferDate}
                className="h-8"
              />
              <SelectFloating
                label="From organization *"
                value={fromOrgId}
                onChange={(e) =>
                  setFromOrgId(typeof e === 'string' ? e : e.target.value)
                }
                options={orgOptions}
                error={errors.fromOrg}
                className="h-8"
              />
              <SelectFloating
                label="To organization *"
                value={toOrgId}
                onChange={(e) => setToOrgId(typeof e === 'string' ? e : e.target.value)}
                options={orgOptions}
                error={errors.toOrg}
                className="h-8"
              />
            </div>
            <InputFloating label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="h-8" />

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-600">Lines</span>
                <button type="button" className="text-blue-600 flex items-center gap-1" onClick={addLine}>
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              {errors.lines && <p className="text-red-600 text-xs">{errors.lines}</p>}
              <div className="border rounded overflow-x-auto">
                <table className="w-full text-xs min-w-[500px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-2 py-1.5">Description *</th>
                      <th className="text-left px-2 py-1.5 w-24">Qty *</th>
                      <th className="text-left px-2 py-1.5 w-20">Unit</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-2 py-1">
                          <input
                            className="w-full border rounded px-2 py-1"
                            value={line.itemDescription}
                            onChange={(e) => setLine(idx, 'itemDescription', e.target.value)}
                          />
                          {errors[`d${idx}`] && (
                            <span className="text-red-500 text-[10px]">Required</span>
                          )}
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            className="w-full border rounded px-2 py-1"
                            value={line.qty}
                            onChange={(e) => setLine(idx, 'qty', e.target.value)}
                          />
                          {errors[`q${idx}`] && (
                            <span className="text-red-500 text-[10px]">&gt; 0</span>
                          )}
                        </td>
                        <td className="px-2 py-1">
                          <input
                            className="w-full border rounded px-2 py-1"
                            placeholder="pcs"
                            value={line.unit}
                            onChange={(e) => setLine(idx, 'unit', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1">
                          {lines.length > 1 && (
                            <button type="button" onClick={() => removeLine(idx)} className="text-gray-400">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={closeForm}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={submit}
                disabled={saving || !orgId}
                className="bg-slate-800 hover:bg-slate-900"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable<IctRow>
        data={records}
        columns={columns}
        loading={loading}
        title="Intercompany transfers"
        onAdd={() => {
          reset()
          setFromOrgId(orgId)
          setAdding(true)
        }}
        addLabel="New transfer"
        searchable
        searchPlaceholder="Search…"
        emptyMessage="No intercompany transfers yet."
        actions={actions}
        rowKey="id"
      />
    </div>
  )
}
