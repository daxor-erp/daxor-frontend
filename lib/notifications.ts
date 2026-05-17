/**
 * Smart notifications system — derives in-app alerts from existing ERP data
 * (low stock, overdue invoices, pending approvals, ...) and persists read-state
 * in localStorage. No backend notification model required.
 */

export type NotificationKind =
  | 'low_stock'
  | 'out_of_stock'
  | 'overdue_invoice'
  | 'bill_due'
  | 'approval_request'
  | 'new_lead'
  | 'system'

export interface NotificationItem {
  id: string
  kind: NotificationKind
  title: string
  description?: string
  href?: string
  createdAt: string // ISO
  severity: 'info' | 'warning' | 'danger' | 'success'
  meta?: Record<string, unknown>
}

const READ_KEY = 'daxor:notifications:read'
const HIDDEN_KEY = 'daxor:notifications:hidden'

function safeGetSet(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

function safeSetSet(key: string, set: Set<string>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(set)))
  } catch { /* localStorage write blocked */ }
}

export function getReadIds(): Set<string> {
  return safeGetSet(READ_KEY)
}
export function getHiddenIds(): Set<string> {
  return safeGetSet(HIDDEN_KEY)
}

export function markRead(ids: string[] | string) {
  const set = getReadIds()
  const arr = Array.isArray(ids) ? ids : [ids]
  arr.forEach((id) => set.add(id))
  safeSetSet(READ_KEY, set)
}

export function markAllRead(ids: string[]) {
  markRead(ids)
}

export function hideNotification(id: string) {
  const set = getHiddenIds()
  set.add(id)
  safeSetSet(HIDDEN_KEY, set)
}

export function clearAll(ids: string[]) {
  const hidden = getHiddenIds()
  ids.forEach((id) => hidden.add(id))
  safeSetSet(HIDDEN_KEY, hidden)
  markRead(ids)
}

/* ---------- Builders ---------- */

interface InvoiceLike {
  id: string
  seqNo?: number | string
  dueDate?: string
  outstandingAmount?: number | string
  totalAmount?: number | string
  status?: string
}
interface BillLike {
  id: string
  billNumber?: string
  dueDate?: string
  outstandingAmount?: number | string
  status?: string
}
interface LowStockLike {
  id: string
  itemName?: string
  quantity?: number
  reorderPoint?: number
  stockStatus?: string
}
interface ApprovalLike {
  id: string
  title?: string | null
  moduleKey?: string
  createdAt?: string
}
interface LeadLike {
  id: string
  firstName?: string
  lastName?: string
  company?: string
  status?: string
  createdAt?: string
}

export function buildNotifications(input: {
  invoices?: InvoiceLike[]
  bills?: BillLike[]
  lowStock?: LowStockLike[]
  approvals?: ApprovalLike[]
  leads?: LeadLike[]
}): NotificationItem[] {
  const out: NotificationItem[] = []
  const now = Date.now()
  const inDays = (iso?: string) => {
    if (!iso) return Infinity
    const t = new Date(iso).getTime()
    return (t - now) / (1000 * 60 * 60 * 24)
  }

  // Overdue invoices
  for (const inv of input.invoices ?? []) {
    const out_ = Number(inv.outstandingAmount ?? 0)
    if (out_ <= 0) continue
    const d = inDays(inv.dueDate)
    if (d < 0) {
      out.push({
        id: `overdue-invoice:${inv.id}`,
        kind: 'overdue_invoice',
        title: `Invoice #${inv.seqNo ?? inv.id.slice(-6)} is overdue`,
        description: `Outstanding ₹${out_.toLocaleString('en-IN', { minimumFractionDigits: 2 })} · ${Math.abs(Math.floor(d))} day(s) past due`,
        href: '/sales/create-invoices',
        createdAt: inv.dueDate ?? new Date().toISOString(),
        severity: 'danger',
      })
    }
  }

  // Vendor bills due in 7 days
  for (const b of input.bills ?? []) {
    const out_ = Number(b.outstandingAmount ?? 0)
    if (out_ <= 0) continue
    const d = inDays(b.dueDate)
    if (d <= 7 && d >= 0) {
      out.push({
        id: `bill-due:${b.id}`,
        kind: 'bill_due',
        title: `Vendor bill ${b.billNumber ?? `#${b.id.slice(-6)}`} due soon`,
        description: `Outstanding ₹${out_.toLocaleString('en-IN', { minimumFractionDigits: 2 })} · due in ${Math.ceil(d)} day(s)`,
        href: '/payables/pay-bills',
        createdAt: b.dueDate ?? new Date().toISOString(),
        severity: d <= 2 ? 'danger' : 'warning',
      })
    } else if (d < 0) {
      out.push({
        id: `bill-overdue:${b.id}`,
        kind: 'bill_due',
        title: `Vendor bill ${b.billNumber ?? `#${b.id.slice(-6)}`} is overdue`,
        description: `Outstanding ₹${out_.toLocaleString('en-IN', { minimumFractionDigits: 2 })} · ${Math.abs(Math.floor(d))} day(s) past due`,
        href: '/payables/pay-bills',
        createdAt: b.dueDate ?? new Date().toISOString(),
        severity: 'danger',
      })
    }
  }

  // Low stock
  for (const it of input.lowStock ?? []) {
    const oos = String(it.stockStatus ?? '').toUpperCase() === 'OUT_OF_STOCK'
    out.push({
      id: `low-stock:${it.id}`,
      kind: oos ? 'out_of_stock' : 'low_stock',
      title: oos
        ? `${it.itemName ?? 'Item'} is out of stock`
        : `${it.itemName ?? 'Item'} below reorder point`,
      description: `Qty ${it.quantity ?? 0} · reorder at ${it.reorderPoint ?? 0}`,
      href: '/inventory-control',
      createdAt: new Date().toISOString(),
      severity: oos ? 'danger' : 'warning',
    })
  }

  // Approvals
  for (const a of input.approvals ?? []) {
    out.push({
      id: `approval:${a.id}`,
      kind: 'approval_request',
      title: a.title ?? 'Approval request',
      description: `${a.moduleKey ?? 'module'} · awaiting your decision`,
      href: '/org-admin/approvals',
      createdAt: a.createdAt ?? new Date().toISOString(),
      severity: 'info',
    })
  }

  // New leads (last 24h, status NEW)
  for (const l of input.leads ?? []) {
    if (String(l.status ?? '').toUpperCase() !== 'NEW') continue
    const created = l.createdAt ? new Date(l.createdAt).getTime() : 0
    if (now - created > 24 * 60 * 60 * 1000) continue
    out.push({
      id: `new-lead:${l.id}`,
      kind: 'new_lead',
      title: `New lead: ${(l.firstName ?? '') + ' ' + (l.lastName ?? '')}`.trim() || `New lead${l.company ? ' · ' + l.company : ''}`,
      description: l.company ? `From ${l.company}` : 'Newly added contact',
      href: '/crm/lead-management',
      createdAt: l.createdAt ?? new Date().toISOString(),
      severity: 'success',
    })
  }

  // Filter hidden
  const hidden = getHiddenIds()
  return out
    .filter((n) => !hidden.has(n.id))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}

export function unreadCount(items: NotificationItem[]): number {
  const read = getReadIds()
  return items.filter((i) => !read.has(i.id)).length
}

export function isRead(id: string): boolean {
  return getReadIds().has(id)
}
