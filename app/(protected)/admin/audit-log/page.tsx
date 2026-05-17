'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_AUDIT_LOGS } from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { Activity, Search, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AuditLogPage() {
  const [page, setPage] = useState(1)
  const limit = 50
  const [entityType, setEntityType] = useState('')
  const [action, setAction] = useState('')
  const [search, setSearch] = useState('')

  const { data, loading, refetch } = useQuery(GET_AUDIT_LOGS, {
    variables: { page, limit, entityType: entityType || null, action: action || null },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const result = data?.auditLogs ?? { data: [], total: 0, page: 1, pages: 0 }
  const rows: any[] = result.data ?? []

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter(
      (r) =>
        r.action?.toLowerCase().includes(q) ||
        r.entityType?.toLowerCase().includes(q) ||
        String(r.userId ?? '').includes(q),
    )
  }, [rows, search])

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Audit Log"
        description="Every create / update / delete tracked across the platform."
      />

      <div className="flex flex-wrap gap-2">
        <select
          value={entityType}
          onChange={(e) => { setEntityType(e.target.value); setPage(1) }}
          className="rounded-lg border border-border bg-secondary/40 py-1.5 px-2 text-xs focus:ring-2 focus:ring-primary/40"
        >
          <option value="">All entities</option>
          {['User', 'Organization', 'CustomerInvoice', 'PurchaseOrder', 'SalesOrder', 'Vendor', 'Customer', 'Item', 'Quotation'].map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1) }}
          className="rounded-lg border border-border bg-secondary/40 py-1.5 px-2 text-xs focus:ring-2 focus:ring-primary/40"
        >
          <option value="">All actions</option>
          {['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'].map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action / entity / user id"
            className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 w-64"
          />
        </div>
      </div>

      <SectionCard
        title={`Entries (${result.total ?? 0})`}
        description={`Page ${result.page ?? page} of ${result.pages ?? 0}`}
        action={
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-secondary disabled:opacity-40"
            >
              <ArrowLeft className="h-3 w-3" /> Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= (result.pages ?? 0) || loading}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-secondary disabled:opacity-40"
            >
              Next <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        }
        bodyClassName="p-0"
      >
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No audit entries</p>
            <p className="text-xs text-muted-foreground">As users perform actions, they&apos;ll appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">When</th>
                  <th className="px-3 py-3 font-medium">User</th>
                  <th className="px-3 py-3 font-medium">Action</th>
                  <th className="px-3 py-3 font-medium">Entity</th>
                  <th className="px-3 py-3 font-medium">Entity ID</th>
                  <th className="px-5 py-3 font-medium">IP / agent</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any) => (
                  <tr key={r.id} className="border-t hover:bg-secondary/30">
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</td>
                    <td className="px-3 py-3 font-mono text-xs">{r.userId ? r.userId.slice(-6) : '—'}</td>
                    <td className="px-3 py-3">
                      <span className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                        r.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : r.action === 'UPDATE' ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : r.action === 'DELETE' ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200',
                      )}>{r.action}</span>
                    </td>
                    <td className="px-3 py-3 font-medium">{r.entityType}</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{r.entityId ? String(r.entityId).slice(-8) : '—'}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground truncate max-w-[20rem]" title={r.userAgent || ''}>{r.ipAddress || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
