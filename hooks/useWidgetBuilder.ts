'use client'

import { useState, useCallback, useEffect } from 'react'

const AI_BASE = process.env.NEXT_PUBLIC_AI_URL || 'http://13.206.39.63:8002'

export interface WidgetSeries {
  key: string
  color: string
}

export interface WidgetData {
  // Table variant
  rows?: Record<string, unknown>[]
  columns?: { key: string; label: string }[]
  total?: number
  // Chart variants
  chartData?: Record<string, unknown>[]
  dataKey?: string
  xAxisKey?: string
  color?: string
  series?: WidgetSeries[]
  multiSeries?: boolean
  // KPI variant
  value?: number | string
  label?: string
  change?: number | null
  prefix?: string
  suffix?: string
}

export type WidgetType =
  | 'table'
  | 'chart-bar'
  | 'chart-line'
  | 'chart-area'
  | 'chart-pie'
  | 'chart-donut'
  | 'chart-radar'
  | 'kpi'

export interface Widget {
  id: string
  type: WidgetType
  title: string
  minW: number
  minH: number
  data: WidgetData
  customData?: {
    content: string
    generatedAt: string
    collection: string
  }
}

export interface SavedWidget {
  id: string          // local UUID (not the widget id from backend)
  prompt: string
  widget: Widget
  savedAt: number
}

function storageKey(userId: string, orgId: string, page: string) {
  return `daxor_widgets_${userId}_${orgId}_${page}`
}

export function useWidgetBuilder(userId: string, orgId: string, page: string) {
  const [loading, setLoading]           = useState(false)
  const [preview, setPreview]           = useState<Widget | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [error, setError]               = useState<string | null>(null)
  const [savedWidgets, setSavedWidgets] = useState<SavedWidget[]>([])

  // Load saved widgets for this page on mount
  useEffect(() => {
    if (!userId || !orgId) return
    try {
      const raw = localStorage.getItem(storageKey(userId, orgId, page))
      if (raw) setSavedWidgets(JSON.parse(raw))
    } catch {}
  }, [userId, orgId, page])

  const _persist = useCallback((widgets: SavedWidget[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(storageKey(userId, orgId, page), JSON.stringify(widgets))
  }, [userId, orgId, page])

  const generate = useCallback(async (prompt: string) => {
    if (!prompt.trim() || loading) return
    setCurrentPrompt(prompt.trim())
    setPreview(null)
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${AI_BASE}/api/ai/generate-widget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })
      if (!res.ok) throw new Error(`Service error: ${res.status}`)
      const json = await res.json()
      if (!json.success || !json.widget) {
        throw new Error(json.message || 'Widget generation failed. Try rephrasing.')
      }
      setPreview(json.widget)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate widget.')
    } finally {
      setLoading(false)
    }
  }, [loading])

  const approve = useCallback(() => {
    if (!preview) return
    const saved: SavedWidget = {
      id: crypto.randomUUID(),
      prompt: currentPrompt,
      widget: { ...preview, id: crypto.randomUUID() },
      savedAt: Date.now(),
    }
    const updated = [...savedWidgets, saved]
    setSavedWidgets(updated)
    _persist(updated)
    setPreview(null)
    setCurrentPrompt('')
  }, [preview, currentPrompt, savedWidgets, _persist])

  const discard = useCallback(() => {
    setPreview(null)
    setError(null)
  }, [])

  const deleteWidget = useCallback((id: string) => {
    const updated = savedWidgets.filter((w) => w.id !== id)
    setSavedWidgets(updated)
    _persist(updated)
  }, [savedWidgets, _persist])

  return {
    loading,
    preview,
    error,
    currentPrompt,
    savedWidgets,
    generate,
    approve,
    discard,
    deleteWidget,
  }
}
