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
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  new: 'bg-slate-100 text-slate-700 border-slate-200',
  submitted: 'bg-amber-50 text-amber-800 border-amber-200',
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  pending_approval: 'bg-amber-50 text-amber-800 border-amber-200',
  under_review: 'bg-amber-50 text-amber-800 border-amber-200',
  approval_declined: 'bg-red-50 text-red-700 border-red-200',
  approval_rejected: 'bg-red-50 text-red-700 border-red-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  approved: 'bg-blue-50 text-blue-700 border-blue-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  sent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  won: 'bg-green-50 text-green-800 border-green-200',
  lost: 'bg-gray-100 text-gray-600 border-gray-200',
  partially_paid: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  canceled: 'bg-red-50 text-red-700 border-red-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-green-50 text-green-800 border-green-200',
  computed: 'bg-violet-50 text-violet-800 border-violet-200',
  posted: 'bg-green-50 text-green-700 border-green-200',
  ready: 'bg-blue-50 text-blue-700 border-blue-200',
  dispatched: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  in_transit: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-50 text-green-800 border-green-200',
  received: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  billed: 'bg-blue-50 text-blue-700 border-blue-200',
  applied: 'bg-violet-50 text-violet-800 border-violet-200',
  issued: 'bg-blue-50 text-blue-700 border-blue-200',
  inactive: 'bg-gray-100 text-gray-600 border-gray-200',
  converted: 'bg-gray-100 text-gray-600 border-gray-200',
  qualified: 'bg-green-50 text-green-800 border-green-200',
  closed_won: 'bg-green-100 text-green-800 border-green-200',
  closed_lost: 'bg-gray-100 text-gray-600 border-gray-200',
}

export function statusBadgeClass(status: string | null | undefined): string {
  const key = normalizeStatusKey(status)
  return STATUS_BADGE_CLASS[key] ?? 'bg-gray-100 text-gray-600 border-gray-200'
}
