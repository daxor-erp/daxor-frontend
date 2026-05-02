'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

function emptyFromKeys(keys: readonly string[]): Record<string, string> {
  return Object.fromEntries(keys.map((k) => [k, ''] as const))
}

export function usePayrollPrepRows(options: {
  orgId: string
  storageKey: string
  fieldKeys: readonly string[]
  minRows?: number
}) {
  const { orgId, storageKey, fieldKeys, minRows = 1 } = options
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const [ready, setReady] = useState(false)

  const keySig = useMemo(() => fieldKeys.join('\0'), [fieldKeys])

  useEffect(() => {
    if (!orgId) {
      setRows([])
      setReady(false)
      return
    }
    const fullKey = `daxor-payroll-prep:${storageKey}:${orgId}`
    const base = () => emptyFromKeys(fieldKeys)
    try {
      const raw = localStorage.getItem(fullKey)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRows(
            parsed.map((r) => ({
              ...base(),
              ...(r as object) as Record<string, string>,
            }))
          )
          setReady(true)
          return
        }
      }
    } catch {
      /* use default */
    }
    setRows(Array.from({ length: minRows }, () => base()))
    setReady(true)
  }, [orgId, storageKey, minRows, keySig])

  useEffect(() => {
    if (!orgId || !ready) return
    const fullKey = `daxor-payroll-prep:${storageKey}:${orgId}`
    try {
      localStorage.setItem(fullKey, JSON.stringify(rows))
    } catch {
      /* quota */
    }
  }, [orgId, storageKey, rows, ready])

  const addRow = useCallback(() => {
    setRows((r) => [...r, emptyFromKeys(fieldKeys)])
  }, [keySig])

  const removeLastRow = useCallback(() => {
    setRows((r) => (r.length <= minRows ? r : r.slice(0, -1)))
  }, [minRows])

  const clearSheet = useCallback(() => {
    setRows(Array.from({ length: minRows }, () => emptyFromKeys(fieldKeys)))
  }, [minRows, keySig])

  const replaceRows = useCallback(
    (next: Record<string, string>[]) => {
      if (next.length > 0) {
        setRows(next.map((row) => ({ ...emptyFromKeys(fieldKeys), ...row })))
      } else {
        setRows([emptyFromKeys(fieldKeys)])
      }
    },
    [keySig]
  )

  return {
    rows,
    setRows,
    ready: ready && Boolean(orgId),
    addRow,
    removeLastRow,
    clearSheet,
    replaceRows,
  }
}
