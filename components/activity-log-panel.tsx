'use client'

/**
 * Generic "chatter" / activity-log timeline panel — renders AuditLog entries for any
 * entity (VENDOR, PRODUCT, PURCHASE_ORDER, ...). Distinct from approval-request history:
 * this shows every create/update/approve/decline action recorded via AuditLogService,
 * not just the approval-routing lifecycle.
 */
import { useQuery } from '@apollo/client'
import { GET_AUDIT_LOGS } from '@/gql/queries'
import { Activity } from 'lucide-react'

type AuditLogRow = {
  id: string
  action: string
  entityType: string
  createdAt: string
  user?: { firstName?: string | null; lastName?: string | null; email?: string | null } | null
  newValuesJson?: string | null
}

function fmtDate(iso?: string | null): string {
  if (!iso) return '—'
  const t = Date.parse(iso)
  return Number.isNaN(t) ? iso : new Date(t).toLocaleString()
}

function actionLabel(action: string, entityType: string): string {
  const entity = entityType
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
  switch (action) {
    case 'CREATE':
      return `${entity} created`
    case 'UPDATE':
      return `${entity} updated`
    case 'APPROVE':
      return `${entity} approved`
    case 'DECLINE':
      return `${entity} declined`
    default:
      return `${entity} ${action.toLowerCase()}`
  }
}

function actorLabel(row: AuditLogRow): string {
  if (!row.user) return 'System'
  const name = `${row.user.firstName ?? ''} ${row.user.lastName ?? ''}`.trim()
  return name || row.user.email || 'Unknown user'
}

export function ActivityLogPanel({ entityType, entityId }: { entityType: string; entityId: string }) {
  const { data, loading } = useQuery(GET_AUDIT_LOGS, {
    variables: { entityType, entityId, limit: 50 },
    skip: !entityId,
    fetchPolicy: 'cache-and-network',
  })

  const rows: AuditLogRow[] = data?.auditLogs?.data ?? []
  const sorted = [...rows].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="h-3.5 w-3.5 text-slate-500" />
        <p className="text-xs text-slate-600">Activity log — every create/update/approve/decline recorded on this record.</p>
      </div>
      {loading ? (
        <p className="text-xs text-slate-500 italic">Loading…</p>
      ) : sorted.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No activity yet.</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((r) => (
            <li key={r.id} className="rounded-md bg-white border border-slate-200 px-3 py-2 text-xs text-slate-700">
              <div className="flex flex-wrap gap-2 justify-between items-start">
                <span className="font-semibold">{actionLabel(r.action, r.entityType)}</span>
                <span className="text-slate-500">{fmtDate(r.createdAt)}</span>
              </div>
              <p className="mt-1 text-slate-600">By {actorLabel(r)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
