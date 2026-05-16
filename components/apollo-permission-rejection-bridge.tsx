'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import {
  formatApolloUserMessage,
  friendlyMutationDeniedMessage,
  isLikelyPermissionOrAuthDenial,
} from '@/lib/apollo-user-errors'

/**
 * Prevents Next.js dev overlay from treating permission-related Apollo mutation failures as fatal:
 * shows a toast and suppresses the unhandled rejection default (narrow matcher).
 */
export function ApolloPermissionRejectionBridge() {
  useEffect(() => {
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const raw = formatApolloUserMessage(reason)
      const name = reason?.constructor?.name

      const looksApollo = name === 'ApolloError'

      if (!looksApollo) return

      if (!isLikelyPermissionOrAuthDenial(raw)) return

      event.preventDefault()
      toast.error(friendlyMutationDeniedMessage(reason))
    }

    window.addEventListener('unhandledrejection', onUnhandledRejection)
    return () => window.removeEventListener('unhandledrejection', onUnhandledRejection)
  }, [])

  return null
}
