'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_TIMESHEETS,
  GET_TIMESHEET_WEEKLY_SUMMARY,
  CREATE_TIMESHEET_ENTRY,
  DELETE_TIMESHEET_ENTRY,
  SUBMIT_TIMESHEET_ENTRY,
  RESOLVE_TIMESHEET_ENTRY,
  GET_PROJECTS,
} from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Plus, Clock, Send, CheckCircle2, XCircle, Trash2,
  Search, ChevronLeft, ChevronRight, Calendar,
} from 'lucide-react'
import { formatMoneyCompact, formatNumber } from '@/lib/format-money'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'

interface TimesheetRow {
  id?: string
  projectId?: string
  taskName?: string
  entryDate: string
  hours: number
  billable: boolean
  billRate: number
  costRate: number
  notes?: string
}

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  const day = x.getDay()
  const diff = (day === 0 ? -6 : 1) - day // Monday-based
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x
}
function endOfWeek(d: Date): Date {
  const x = startOfWeek(d)
  x.setDate(x.getDate() + 6)
  x.setHours(23, 59, 59, 999)
  return x
}
function fmtDay(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })
}

export default function TimesheetsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const uid = user?.id ?? ''
  const [weekAnchor, setWeekAnchor] = useState<Date>(new Date())
  const ws = startOfWeek(weekAnchor)
  const we = endOfWeek(weekAnchor)
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<TimesheetRow[]>([])

  const listQ = useQuery(GET_TIMESHEETS, {
    variables: {
      organizationId: orgId,
      employeeUserId: uid,
      startDate: ws.toISOString(),
      endDate: we.toISOString(),
    },
    skip: !orgId || !uid,
    fetchPolicy: 'cache-and-network',
  })
  const summaryQ = useQuery(GET_TIMESHEET_WEEKLY_SUMMARY, {
    variables: { organizationId: orgId, employeeUserId: uid, weekStart: ws.toISOString(), weekEnd: we.toISOString() },
    skip: !orgId || !uid,
    fetchPolicy: 'cache-and-network',
  })
  const projectsQ = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const entries: any[] = listQ.data?.timesheetEntries ?? []
  const summary = summaryQ.data?.timesheetWeeklySummary
  const projects: any[] = projectsQ.data?.projects ?? []
  const projectOptions = useMemo(
    () => [{ value: '', label: '— No project —' }, ...projects.map((p: any) => ({ value: p.id, label: p.name ?? p.projectName ?? p.id }))],
    [projects],
  )

  const [createMutation, { loading: creating }] = useMutation(CREATE_TIMESHEET_ENTRY, {
    onCompleted: () => { listQ.refetch(); summaryQ.refetch() },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_TIMESHEET_ENTRY, {
    onCompleted: () => { listQ.refetch(); summaryQ.refetch(); toast.success('Entry deleted') },
    onError: (e) => toast.error(e.message),
  })
  const [submitMutation] = useMutation(SUBMIT_TIMESHEET_ENTRY, {
    onCompleted: () => { listQ.refetch(); summaryQ.refetch(); toast.success('Submitted for approval') },
    onError: (e) => toast.error(e.message),
  })
  const [resolveMutation] = useMutation(RESOLVE_TIMESHEET_ENTRY, {
    onCompleted: () => { listQ.refetch(); summaryQ.refetch() },
    onError: (e) => toast.error(e.message),
  })

  const columns: LineColumn<TimesheetRow>[] = [
    { key: 'entryDate', header: 'Date', type: 'date', minWidth: 130 },
    { key: 'projectId', header: 'Project', type: 'select', options: projectOptions, minWidth: 160 },
    { key: 'taskName', header: 'Task', minWidth: 180, placeholder: 'What did you work on?' },
    { key: 'hours', header: 'Hours', type: 'number', align: 'right', minWidth: 80 },
    {
      key: 'billable',
      header: 'Billable',
      type: 'select',
      options: [{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }],
      minWidth: 90,
    },
    { key: 'billRate', header: 'Bill rate (₹/h)', type: 'money', align: 'right', minWidth: 120 },
    {
      key: 'costRate', header: 'Cost rate (₹/h)', type: 'money', align: 'right', minWidth: 120,
    },
    {
      key: 'lineTotal',
      header: 'Line total',
      align: 'right',
      type: 'money',
      readOnly: true,
      compute: (r) => Number(r.hours ?? 0) * Number(r.billRate ?? 0),
      minWidth: 130,
    },
  ]

  const bulkSubmit = () => {
    const valid = rows.filter((r) => r.entryDate && Number(r.hours) > 0)
    if (valid.length === 0) return toast.error('Add at least one valid entry')
    Promise.all(
      valid.map((r) =>
        createMutation({
          variables: {
            input: {
              organizationId: orgId,
              employeeUserId: uid,
              projectId: r.projectId || undefined,
              taskName: r.taskName || undefined,
              entryDate: new Date(r.entryDate).toISOString(),
              hours: Number(r.hours),
              billable: String(r.billable) === 'true' || r.billable === true,
              billRate: Number(r.billRate ?? 0),
              costRate: Number(r.costRate ?? 0),
              notes: r.notes,
            },
          },
        }),
      ),
    )
      .then(() => {
        toast.success(`${valid.length} entr${valid.length === 1 ? 'y' : 'ies'} added`)
        setRows([])
        setOpen(false)
      })
      .catch(() => {})
  }

  const dailyTotals = useMemo(() => {
    const map: Record<string, number> = {}
    for (const e of entries) {
      const key = new Date(e.entryDate).toDateString()
      map[key] = (map[key] ?? 0) + Number(e.hours ?? 0)
    }
    const days: { key: string; date: Date; hours: number }[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(ws)
      d.setDate(d.getDate() + i)
      days.push({ key: d.toDateString(), date: d, hours: map[d.toDateString()] ?? 0 })
    }
    return days
  }, [entries, ws])

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="My Timesheets"
        description="Log time against projects, submit for approval, get paid."
        actions={
          <Button onClick={() => { setRows([emptyRow()]); setOpen(true) }} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" />
            Log time
          </Button>
        }
      />

      {/* Week navigator */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-2">
        <button
          onClick={() => { const d = new Date(weekAnchor); d.setDate(d.getDate() - 7); setWeekAnchor(d) }}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <div className="text-sm font-medium inline-flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {fmtDay(ws)} — {fmtDay(we)}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setWeekAnchor(new Date())}
            className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
          >
            This week
          </button>
          <button
            onClick={() => { const d = new Date(weekAnchor); d.setDate(d.getDate() + 7); setWeekAnchor(d) }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total hours" value={(summary?.totalHours ?? 0).toFixed(1)} icon={<Clock className="h-5 w-5" />} tone="brand" />
        <StatCard label="Billable hours" value={(summary?.billableHours ?? 0).toFixed(1)} icon={<CheckCircle2 className="h-5 w-5" />} tone="emerald" />
        <StatCard label="Approved" value={(summary?.approvedHours ?? 0).toFixed(1)} icon={<CheckCircle2 className="h-5 w-5" />} tone="sky" />
        <StatCard label="Pending" value={(summary?.pending ?? 0).toFixed(1)} icon={<Send className="h-5 w-5" />} tone="warn" />
      </div>

      {/* Day-strip preview */}
      <SectionCard title="Hours by day" description={`Week of ${fmtDay(ws)}`}>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {dailyTotals.map((d) => (
            <div key={d.key} className="rounded-xl border border-border p-3">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                {d.date.toLocaleDateString(undefined, { weekday: 'short' })}
              </p>
              <p className="text-lg font-bold tabular-nums">{d.hours.toFixed(1)}h</p>
              <p className="text-[11px] text-muted-foreground">{d.date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Entries */}
      <SectionCard title="Entries this week" description={`${entries.length} record${entries.length === 1 ? '' : 's'}`} bodyClassName="p-0">
        {listQ.loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="p-10 text-center">
            <Clock className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No time logged this week</p>
            <Button onClick={() => { setRows([emptyRow()]); setOpen(true) }} className="mt-3 bg-grad-brand text-white border-none gap-1.5">
              <Plus className="h-4 w-4" /> Log time
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Task</th>
                  <th className="px-3 py-3 font-medium text-right">Hours</th>
                  <th className="px-3 py-3 font-medium">Billable</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e: any) => (
                  <tr key={e.id} className="border-t hover:bg-secondary/30">
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{formatDate(e.entryDate)}</td>
                    <td className="px-3 py-3">{e.taskName || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium">{Number(e.hours).toFixed(2)}</td>
                    <td className="px-3 py-3">
                      {e.billable ? (
                        <span className="inline-flex items-center rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 px-2 py-0.5 text-[10px] font-medium uppercase">Yes</span>
                      ) : <span className="text-muted-foreground">No</span>}
                    </td>
                    <td className="px-3 py-3"><TimesheetStatusBadge status={e.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {e.status === 'DRAFT' && (
                          <button
                            onClick={() => submitMutation({ variables: { id: e.id } })}
                            title="Submit for approval"
                            className="h-7 w-7 grid place-items-center rounded-md text-amber-600 hover:bg-amber-50"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {e.status === 'SUBMITTED' && (
                          <>
                            <button
                              onClick={() => resolveMutation({ variables: { id: e.id, decision: 'APPROVED' } })}
                              title="Approve"
                              className="h-7 w-7 grid place-items-center rounded-md text-emerald-600 hover:bg-emerald-50"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Reason for rejection (optional)') ?? undefined
                                resolveMutation({ variables: { id: e.id, decision: 'REJECTED', reason } })
                              }}
                              title="Reject"
                              className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => { if (confirm('Delete entry?')) deleteMutation({ variables: { id: e.id } }) }}
                          title="Delete"
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
        )}
      </SectionCard>

      {/* Bulk-entry modal */}
      <FormModal
        open={open}
        onOpenChange={setOpen}
        title="Log time entries"
        description="Add multiple days at once — Tab to move, Enter to add a row, paste from Excel supported."
        icon={<Clock className="h-5 w-5" />}
        size="xl"
        submitting={creating}
        onSubmit={bulkSubmit}
        submitLabel="Save entries"
        footerStart={
          <span>{rows.length} row{rows.length === 1 ? '' : 's'} · Total {rows.reduce((s, r) => s + (Number(r.hours) || 0), 0).toFixed(2)}h</span>
        }
      >
        <FormSection title="Daily entries">
          <LineItemsEditor<TimesheetRow>
            columns={columns}
            rows={rows}
            onChange={setRows}
            buildRow={() => emptyRow()}
            minRows={1}
            maxRows={50}
            totals={[
              { key: 'hours', label: 'Hours', format: 'number' },
              { key: 'lineTotal', label: 'Total', format: 'money' },
            ]}
          />
        </FormSection>
      </FormModal>
    </div>
  )
}

function emptyRow(): TimesheetRow {
  return {
    entryDate: new Date().toISOString().slice(0, 10),
    hours: 8,
    billable: false,
    billRate: 0,
    costRate: 0,
  }
}

function TimesheetStatusBadge({ status }: { status: string }) {
  const s = String(status || '').toUpperCase()
  const tone =
    s === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : s === 'SUBMITTED' ? 'bg-amber-50 text-amber-700 border-amber-200'
        : s === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200'
          : 'bg-slate-100 text-slate-700 border-slate-200'
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase', tone)}>{s}</span>
}
