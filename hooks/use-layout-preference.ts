'use client'

import { useEffect, useState } from 'react'

export type LayoutMode = 'sidebar' | 'navbar'

const STORAGE_KEY = 'daxor:layout-mode'

function readStored(): LayoutMode {
  if (typeof window === 'undefined') return 'sidebar'
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === 'navbar' || raw === 'sidebar') return raw
  } catch {}
  return 'sidebar'
}

/**
 * Persistent layout preference shared across all protected pages.
 * Uses a `storage` event so changes from the Settings page are picked up
 * immediately by other tabs / components.
 */
export function useLayoutPreference(): [LayoutMode, (m: LayoutMode) => void] {
  const [mode, setMode] = useState<LayoutMode>('sidebar')

  useEffect(() => {
    setMode(readStored())
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setMode(readStored())
    }
    const onCustom = () => setMode(readStored())
    window.addEventListener('storage', onStorage)
    window.addEventListener('daxor:layout-changed', onCustom as any)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('daxor:layout-changed', onCustom as any)
    }
  }, [])

  const update = (m: LayoutMode) => {
    setMode(m)
    try {
      window.localStorage.setItem(STORAGE_KEY, m)
      window.dispatchEvent(new Event('daxor:layout-changed'))
    } catch {}
  }

  return [mode, update]
}
