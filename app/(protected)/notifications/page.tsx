'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useNotifications } from '@/hooks/use-notifications'
import { SectionCard, PageHeader } from '@/components/dashboard/section-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { NotificationItem } from '@/lib/notifications'
import {
  Bell,
  Inbox,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Receipt,
  ShoppingCart,
  ClipboardCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react'
import { formatDate } from '@/lib/format-date'

const KIND_ICON: Record<string, React.ReactNode> = {
  low_stock: <AlertTriangle className="h-4 w-4" />,
  out_of_stock: <AlertTriangle className="h-4 w-4" />,
  overdue_invoice: <Receipt className="h-4 w-4" />,
  bill_due: <ShoppingCart className="h-4 w-4" />,
  approval_request: <ClipboardCheck className="h-4 w-4" />,
  new_lead: <TrendingUp className="h-4 w-4" />,
  system: <Sparkles className="h-4 w-4" />,
}

const SEV_TONE: Record<NotificationItem['severity'], string> = {
  info: 'bg-sky-50 text-sky-700 border-sky-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-rose-50 text-rose-700 border-rose-100',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
}

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime()
  if (!t) return ''
  const diff = Math.max(0, Date.now() - t)
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return formatDate(iso)
}

export default function NotificationsPage() {
  const { items, unreadCount, markRead, markAllRead, hide, clearAll, isRead } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts' | 'approvals'>('all')

  const filtered = items.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !isRead(n.id)
    if (filter === 'alerts') return ['low_stock', 'out_of_stock', 'overdue_invoice', 'bill_due'].includes(n.kind)
    if (filter === 'approvals') return n.kind === 'approval_request'
    return true
  })

  return (
    <div className="erp-shell">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread of ${items.length} total` : 'All caught up'}
        actions={
          <>
            <Button variant="outline" onClick={markAllRead} disabled={unreadCount === 0} className="gap-1.5">
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
            <Button
              variant="outline"
              onClick={clearAll}
              disabled={items.length === 0}
              className="gap-1.5 text-rose-700 hover:text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" /> Clear all
            </Button>
          </>
        }
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All <span className="ml-1.5 text-xs text-muted-foreground">({items.length})</span></TabsTrigger>
          <TabsTrigger value="unread">Unread <span className="ml-1.5 text-xs text-muted-foreground">({unreadCount})</span></TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>
      </Tabs>

      <SectionCard title="Inbox" description="Smart alerts derived from your ERP data" bodyClassName="p-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
              <Inbox className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-semibold">No notifications</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                You&apos;re all caught up. We&apos;ll alert you about low stock, overdue invoices, due bills,
                approvals, and new leads.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y">
            {filtered.map((n) => {
              const read = isRead(n.id)
              return (
                <li
                  key={n.id}
                  className={cn(
                    'group flex items-start gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors',
                    !read && 'bg-primary-soft/30',
                  )}
                >
                  <div className={cn('mt-0.5 h-10 w-10 rounded-lg grid place-items-center shrink-0 border', SEV_TONE[n.severity])}>
                    {KIND_ICON[n.kind]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p className={cn('text-sm leading-snug', !read && 'font-semibold')}>{n.title}</p>
                    </div>
                    {n.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">{n.description}</p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{timeAgo(n.createdAt)}</span>
                      <span className="capitalize">{n.kind.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1.5 items-start">
                    {n.kind === 'approval_request' ? (
                      <button
                        type="button"
                        onClick={() => {
                          markRead(n.id)
                          window.dispatchEvent(new Event('daxor:open-approvals-inbox'))
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-2.5 py-1 text-xs font-medium hover:opacity-90"
                      >
                        Open <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : n.href ? (
                      <Link
                        href={n.href}
                        onClick={() => markRead(n.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary text-primary-foreground px-2.5 py-1 text-xs font-medium hover:opacity-90"
                      >
                        Open <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : null}
                    {!read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => hide(n.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary"
                      aria-label="Dismiss"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </SectionCard>
    </div>
  )
}
