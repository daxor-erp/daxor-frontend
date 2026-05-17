'use client'

import { useMemo } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_CUSTOMER_INVOICES,
  GET_VENDOR_BILLS,
  GET_LOW_STOCK_ITEMS,
  GET_LEADS,
  MY_PENDING_APPROVAL_REQUESTS,
  GET_MY_NOTIFICATIONS,
  GET_MY_UNREAD_NOTIFICATION_COUNT,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  ARCHIVE_NOTIFICATION,
  ARCHIVE_ALL_NOTIFICATIONS,
} from '@/gql/queries'
import {
  buildNotifications,
  hideNotification as hideDerivedClientSide,
  type NotificationItem,
} from '@/lib/notifications'

/**
 * Hybrid notifications:
 *  - persistent backend Notification rows (created by approvals + future workflows)
 *  - smart/derived alerts computed locally from invoices/bills/stock/leads
 *
 * Backend rows are authoritative for read-state. Derived rows have read-state
 * tracked in localStorage (via the existing helpers in `lib/notifications`).
 */
export function useNotifications() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const skip = !orgId

  // Backend notifications
  const backendQ = useQuery(GET_MY_NOTIFICATIONS, {
    variables: { unreadOnly: false, limit: 50, skip: 0 },
    skip: !user?.id,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
    pollInterval: 60_000,
  })
  const unreadCountQ = useQuery(GET_MY_UNREAD_NOTIFICATION_COUNT, {
    skip: !user?.id,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
    pollInterval: 60_000,
  })

  // Derived signals
  const invoicesQ = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
    pollInterval: 5 * 60_000,
  })
  const billsQ = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
    pollInterval: 5 * 60_000,
  })
  const lowStockQ = useQuery(GET_LOW_STOCK_ITEMS, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
    pollInterval: 5 * 60_000,
  })
  const leadsQ = useQuery(GET_LEADS, {
    variables: { organizationId: orgId },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })
  const approvalsQ = useQuery(MY_PENDING_APPROVAL_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
    pollInterval: 60_000,
  })

  const [markReadMutation] = useMutation(MARK_NOTIFICATION_READ, {
    onCompleted: () => { backendQ.refetch?.(); unreadCountQ.refetch?.() },
  })
  const [markAllReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    onCompleted: () => { backendQ.refetch?.(); unreadCountQ.refetch?.() },
  })
  const [archiveMutation] = useMutation(ARCHIVE_NOTIFICATION, {
    onCompleted: () => { backendQ.refetch?.(); unreadCountQ.refetch?.() },
  })
  const [archiveAllMutation] = useMutation(ARCHIVE_ALL_NOTIFICATIONS, {
    onCompleted: () => { backendQ.refetch?.(); unreadCountQ.refetch?.() },
  })

  const items = useMemo<NotificationItem[]>(() => {
    // 1) Backend rows mapped to UI shape
    const backendItems: NotificationItem[] = (backendQ.data?.myNotifications ?? []).map((n: any) => ({
      id: `nb:${n.id}`,
      kind: mapBackendKind(n.kind),
      title: n.title,
      description: n.message ?? undefined,
      href: n.link ?? undefined,
      createdAt: n.createdAt,
      severity: mapBackendSeverity(n.severity),
      meta: { backendId: n.id, isRead: n.isRead },
    }))

    // 2) Derived signals (de-duped from backend by avoiding approvals double-up)
    const derived = buildNotifications({
      invoices: invoicesQ.data?.customerinvoices ?? [],
      bills: billsQ.data?.vendorBills ?? [],
      lowStock: lowStockQ.data?.lowStockItems ?? [],
      approvals: approvalsQ.data?.myPendingApprovalRequests ?? [],
      leads: leadsQ.data?.leads ?? [],
    })

    // Backend may already have an APPROVAL_REQUEST row for a given approval-request id.
    // Drop the derived twin in that case (we keyed derived approvals as `approval:<id>`).
    const backendApprovalRefs = new Set(
      (backendQ.data?.myNotifications ?? [])
        .filter((n: any) => n.kind === 'APPROVAL_REQUEST')
        .map((n: any) => String(n.referenceId ?? '')),
    )
    const filteredDerived = derived.filter((d) => {
      if (d.kind !== 'approval_request') return true
      const id = d.id.replace(/^approval:/, '')
      return !backendApprovalRefs.has(id)
    })

    return [...backendItems, ...filteredDerived].sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt)),
    )
  }, [
    backendQ.data,
    invoicesQ.data,
    billsQ.data,
    lowStockQ.data,
    approvalsQ.data,
    leadsQ.data,
  ])

  const isLoading =
    backendQ.loading ||
    invoicesQ.loading ||
    billsQ.loading ||
    lowStockQ.loading ||
    approvalsQ.loading ||
    leadsQ.loading

  const backendUnread = Number(unreadCountQ.data?.myUnreadNotificationCount ?? 0)

  const unread = items.filter((i) => {
    if (i.meta && typeof i.meta.isRead === 'boolean') return !i.meta.isRead
    return true // derived items are treated as unread until dismissed/hidden
  })

  return {
    items,
    unreadCount: Math.max(backendUnread, unread.length),
    isLoading,
    isRead: (id: string) => {
      const item = items.find((i) => i.id === id)
      if (!item) return false
      if (item.meta && typeof item.meta.isRead === 'boolean') return !!item.meta.isRead
      return false
    },
    markRead: async (id: string) => {
      if (id.startsWith('nb:')) {
        const backendId = id.slice(3)
        await markReadMutation({ variables: { id: backendId } })
      }
    },
    markAllRead: async () => {
      await markAllReadMutation()
    },
    hide: async (id: string) => {
      if (id.startsWith('nb:')) {
        const backendId = id.slice(3)
        await archiveMutation({ variables: { id: backendId } })
      } else {
        hideDerivedClientSide(id)
        // Force refetch so the derived list rebuilds
        invoicesQ.refetch?.()
        lowStockQ.refetch?.()
      }
    },
    clearAll: async () => {
      await archiveAllMutation()
    },
    refetch: () => {
      backendQ.refetch?.()
      unreadCountQ.refetch?.()
      invoicesQ.refetch?.()
      billsQ.refetch?.()
      lowStockQ.refetch?.()
      leadsQ.refetch?.()
      approvalsQ.refetch?.()
    },
  }
}

function mapBackendKind(k: string): NotificationItem['kind'] {
  switch (k) {
    case 'APPROVAL_REQUEST':
      return 'approval_request'
    case 'APPROVAL_APPROVED':
    case 'APPROVAL_REJECTED':
      return 'approval_request'
    case 'INVOICE_OVERDUE':
      return 'overdue_invoice'
    case 'BILL_DUE':
      return 'bill_due'
    case 'LOW_STOCK':
      return 'low_stock'
    case 'NEW_LEAD':
      return 'new_lead'
    default:
      return 'system'
  }
}

function mapBackendSeverity(s: string): NotificationItem['severity'] {
  switch (s) {
    case 'SUCCESS':
      return 'success'
    case 'WARNING':
      return 'warning'
    case 'DANGER':
      return 'danger'
    default:
      return 'info'
  }
}
