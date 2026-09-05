/** MongoDB ObjectId (24 hex) — never show in UI copy. */
const MONGO_ID = /^[a-f0-9]{24}$/i

export function isMongoObjectId(value: string | null | undefined): boolean {
  const s = String(value ?? '').trim()
  return s.length > 0 && MONGO_ID.test(s)
}

/** Prefer human document numbers; never fall back to a raw ObjectId. */
export function entityRefLabel(
  ...candidates: (string | null | undefined)[]
): string {
  for (const c of candidates) {
    const t = String(c ?? '').trim()
    if (t && !isMongoObjectId(t)) return t
  }
  return '—'
}

/** Resolve a related entity name; avoid exposing raw ids. */
export function lookupDisplayName(
  name?: string | null,
  id?: string | null,
  unknownLabel = 'Unknown',
): string {
  const n = String(name ?? '').trim()
  if (n) return n
  if (id && isMongoObjectId(String(id))) return unknownLabel
  const idStr = String(id ?? '').trim()
  if (idStr && !isMongoObjectId(idStr)) return idStr
  return '—'
}

export function normalizeStatusKey(status: string | null | undefined): string {
  return String(status ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  new: 'New',
  active: 'Active',
  inactive: 'Inactive',
  submitted: 'Pending approval',
  pending: 'Pending',
  pending_approval: 'Pending approval',
  under_review: 'Under review',
  approval_declined: 'Declined',
  approval_rejected: 'Declined',
  rejected: 'Rejected',
  approved: 'Approved',
  sent: 'Sent',
  won: 'Won',
  lost: 'Lost',
  quoted: 'Quoted',
  negotiation: 'Negotiation',
  converted: 'Converted',
  contacted: 'Contacted',
  qualified: 'Qualified',
  unqualified: 'Unqualified',
  partially_paid: 'Partially paid',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Canceled',
  canceled: 'Canceled',
  confirmed: 'Confirmed',
  completed: 'Completed',
  computed: 'Computed',
  posted: 'Posted',
  void: 'Void',
  open: 'Open',
  closed: 'Closed',
  received: 'Received',
  billed: 'Billed',
  debited: 'Debited',
  applied: 'Applied',
  ready: 'Ready',
  dispatched: 'Dispatched',
  in_transit: 'In transit',
  delivered: 'Delivered',
  closed_won: 'Closed won',
  closed_lost: 'Closed lost',
  prospecting: 'Prospecting',
  qualification: 'Qualification',
  needs_analysis: 'Needs analysis',
  proposal: 'Proposal',
  processing: 'Processing',
  on_hold: 'On hold',
  issued: 'Issued',
  rfq: 'RFQ',
  rfq_sent: 'RFQ Sent',
  purchase_order: 'Purchase Order',
  partially_received: 'Partially Received',
  partially_billed: 'Partially Billed',
  not_received: 'Not Received',
  not_billed: 'Not Billed',
  locked: 'Locked',
}

function titleCaseWords(raw: string): string {
  return raw
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

/** Human-readable status for tables, toasts, and badges. */
export function formatStatus(status: string | null | undefined): string {
  const raw = String(status ?? '').trim()
  if (!raw || raw === '—') return '—'
  const key = normalizeStatusKey(raw)
  if (STATUS_LABELS[key]) return STATUS_LABELS[key]
  return titleCaseWords(raw)
}

export const STATUS_BADGE_CLASS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground border-border',
  new: 'bg-muted text-muted-foreground border-border',
  submitted: 'bg-amber-50 text-amber-800 border-amber-200',
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  pending_approval: 'bg-amber-50 text-amber-800 border-amber-200',
  under_review: 'bg-amber-50 text-amber-800 border-amber-200',
  approval_declined: 'bg-red-50 text-red-700 border-red-200',
  approval_rejected: 'bg-red-50 text-red-700 border-red-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  approved: 'bg-primary/10 text-primary border-primary/20',
  active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  sent: 'bg-primary/10 text-primary border-primary/20',
  won: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  lost: 'bg-muted text-muted-foreground border-border',
  partially_paid: 'bg-amber-50 text-amber-800 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  canceled: 'bg-red-50 text-red-700 border-red-200',
  confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  computed: 'bg-primary/10 text-primary border-primary/20',
  posted: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  ready: 'bg-primary/10 text-primary border-primary/20',
  dispatched: 'bg-primary/10 text-primary border-primary/20',
  in_transit: 'bg-primary/10 text-primary border-primary/20',
  delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  received: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  billed: 'bg-primary/10 text-primary border-primary/20',
  applied: 'bg-primary/10 text-primary border-primary/20',
  issued: 'bg-primary/10 text-primary border-primary/20',
  inactive: 'bg-muted text-muted-foreground border-border',
  converted: 'bg-muted text-muted-foreground border-border',
  qualified: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  closed_won: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  closed_lost: 'bg-muted text-muted-foreground border-border',
  rfq: 'bg-muted text-muted-foreground border-border',
  rfq_sent: 'bg-primary/10 text-primary border-primary/20',
  purchase_order: 'bg-primary/10 text-primary border-primary/20',
  partially_received: 'bg-amber-50 text-amber-800 border-amber-200',
  partially_billed: 'bg-amber-50 text-amber-800 border-amber-200',
  not_received: 'bg-muted text-muted-foreground border-border',
  not_billed: 'bg-muted text-muted-foreground border-border',
  locked: 'bg-muted text-muted-foreground border-border',
}

export function statusBadgeClass(status: string | null | undefined): string {
  const key = normalizeStatusKey(status)
  return STATUS_BADGE_CLASS[key] ?? 'bg-muted text-muted-foreground border-border'
}
