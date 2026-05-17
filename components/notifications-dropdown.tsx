'use client'

import { Bell, CheckCheck, Inbox, X, AlertTriangle, ShoppingCart, Receipt, ClipboardCheck, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'
import type { NotificationItem } from '@/lib/notifications'

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

const SEV_DOT: Record<NotificationItem['severity'], string> = {
  info: 'bg-sky-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  success: 'bg-emerald-500',
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
  return new Date(iso).toLocaleDateString()
}

export function NotificationsDropdown() {
  const { items, unreadCount, markRead, markAllRead, hide, clearAll, isRead, isLoading } = useNotifications()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-none text-white shadow-sm ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(380px,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-[11px] text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          </div>
        </div>

        <ScrollArea className="max-h-[26rem]">
          {isLoading && items.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
                <Inbox className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Inbox zero</p>
              <p className="text-xs text-muted-foreground max-w-[18rem]">
                We&apos;ll surface low stock, overdue invoices, approvals, and new leads here.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {items.slice(0, 20).map((n) => {
                const read = isRead(n.id)
                return (
                  <li
                    key={n.id}
                    className={cn(
                      'group flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors',
                      !read && 'bg-primary-soft/40',
                    )}
                  >
                    <div className={cn('mt-0.5 h-8 w-8 rounded-lg grid place-items-center shrink-0 border', SEV_TONE[n.severity])}>
                      {KIND_ICON[n.kind]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <p className={cn('text-sm leading-snug', !read && 'font-semibold')}>
                          {n.title}
                        </p>
                        {!read && (
                          <span className={cn('shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full', SEV_DOT[n.severity])} />
                        )}
                      </div>
                      {n.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                      )}
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{timeAgo(n.createdAt)}</span>
                        {n.kind === 'approval_request' ? (
                          <button
                            type="button"
                            onClick={() => {
                              markRead(n.id)
                              window.dispatchEvent(new Event('daxor:open-approvals-inbox'))
                            }}
                            className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                          >
                            Open <ArrowRight className="h-3 w-3" />
                          </button>
                        ) : n.href ? (
                          <Link
                            href={n.href}
                            onClick={() => markRead(n.id)}
                            className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                          >
                            Open <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                    <button
                      onClick={() => hide(n.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary"
                      aria-label="Dismiss"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between border-t px-3 py-2">
          <Link href="/notifications" className="text-[11px] font-medium text-primary hover:underline">
            View all
          </Link>
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[11px] font-medium text-muted-foreground hover:text-rose-600"
            >
              Clear all
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
