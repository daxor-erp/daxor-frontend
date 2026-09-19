'use client'

import { useMemo } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
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
 * User-scoped notifications only:
 *  - backend Notification rows addressed to the current user (approvals, decisions, broadcasts)
 *  - pending approval requests assigned to the current user (fallback if a backend row is missing)
 *
 * Org-wide operational signals (low stock, overdue bills/invoices, new leads) are NOT
 * derived here — those were incorrectly shown to every user in the org.
 */
export function useNotifications() {
  const { user } = useAuth()

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

  // Assignee-only pending approvals (server filters by current user id).
  const approvalsQ = useQuery(MY_PENDING_APPROVAL_REQUESTS, {
    skip: !user?.id,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
    pollInterval: 60_000,
  })

  const [markReadMutation] = useMutation(MARK_NOTIFICATION_READ, {
    onCompleted: () => {
      backendQ.refetch?.()
      unreadCountQ.refetch?.()
    },
  })
  const [markAllReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    onCompleted: () => {
      backendQ.refetch?.()
      unreadCountQ.refetch?.()
    },
  })
  const [archiveMutation] = useMutation(ARCHIVE_NOTIFICATION, {
    onCompleted: () => {
      backendQ.refetch?.()
      unreadCountQ.refetch?.()
    },
  })
  const [archiveAllMutation] = useMutation(ARCHIVE_ALL_NOTIFICATIONS, {
    onCompleted: () => {
      backendQ.refetch?.()
      unreadCountQ.refetch?.()
    },
  })

  const items = useMemo<NotificationItem[]>(() => {
    const backendRows = backendQ.data?.myNotifications ?? []

    const backendItems: NotificationItem[] = backendRows.map((n: any) => ({
      id: `nb:${n.id}`,
      kind: mapBackendKind(n.kind),
      title: n.title,
      description: n.message ?? undefined,
      href: n.link ?? undefined,
      createdAt: n.createdAt,
      severity: mapBackendSeverity(n.severity),
      meta: { backendId: n.id, isRead: n.isRead },
    }))

    // Only derive approval alerts for the current assignee — never org-wide ops signals.
    const derivedApprovals = buildNotifications({
      approvals: approvalsQ.data?.myPendingApprovalRequests ?? [],
    })

    const backendApprovalRefs = new Set(
      backendRows
        .filter((n: any) => n.kind === 'APPROVAL_REQUEST')
        .map((n: any) => String(n.referenceId ?? '')),
    )
    const filteredDerived = derivedApprovals.filter((d) => {
      if (d.kind !== 'approval_request') return false
      const id = d.id.replace(/^approval:/, '')
      return !backendApprovalRefs.has(id)
    })

    return [...backendItems, ...filteredDerived].sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt)),
    )
  }, [backendQ.data, approvalsQ.data])

  const isLoading = backendQ.loading || approvalsQ.loading

  const backendUnread = Number(unreadCountQ.data?.myUnreadNotificationCount ?? 0)

  const unread = items.filter((i) => {
    if (i.meta && typeof i.meta.isRead === 'boolean') return !i.meta.isRead
    return true
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
        approvalsQ.refetch?.()
      }
    },
    clearAll: async () => {
      await archiveAllMutation()
    },
    refetch: () => {
      backendQ.refetch?.()
      unreadCountQ.refetch?.()
      approvalsQ.refetch?.()
    },
  }
}

function mapBackendKind(k: string): NotificationItem['kind'] {
  switch (k) {
    case 'APPROVAL_REQUEST':
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
