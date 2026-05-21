'use client'

import { useCallback, useState } from 'react'

/**
 * Manages `{ open, entityId }` when a row action opens an approval drawer/sheet by id.
 * Clear `entityId` when the sheet closes so you can lazily reopen another row.
 *
 * Attach `onOpenChange` to your Sheet and pass `entityId` into module-specific loaders.
 *
 * @example
 * ```tsx
 * const sheet = useSendForApprovalSheet<string>()
 *
 * const actions = [sendForApprovalDataTableAction({ onOpenSheet: (row) => sheet.openFor(row.id), ... })]
 *
 * <VendorSendForApprovalSheet open={sheet.open} onOpenChange={sheet.onOpenChange} vendorId={sheet.entityId} />
 * ```
 */
export function useSendForApprovalSheet<T extends string>() {
  const [open, setOpen] = useState(false)
  const [entityId, setEntityId] = useState<T | null>(null)

  const openFor = useCallback((id: T) => {
    setEntityId(id)
    setOpen(true)
  }, [])

  const onOpenChange = useCallback((next: boolean) => {
    setOpen(next)
    if (!next) setEntityId(null)
  }, [])

  return { open, entityId, setOpen, openFor, onOpenChange }
}
