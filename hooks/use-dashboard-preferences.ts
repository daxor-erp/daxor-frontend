'use client'

import { useCallback, useMemo } from 'react'
import { useMutation } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { UPDATE_MY_DASHBOARD_PREFERENCES } from '@/gql/queries'
import {
  type DashboardKey,
  type WidgetCategory,
  type WidgetDef,
  getManifest,
} from '@/lib/dashboard-manifest'

export interface DashboardPreferencesApi {
  /** Manifest-ordered list of all widget defs (including hidden). */
  allWidgets: WidgetDef[]
  /** Widget IDs that are currently hidden. */
  hiddenWidgets: Set<string>
  /** Saved order of all widget IDs (may be empty if user hasn't reordered). */
  widgetOrder: string[]
  /** True if the widget should be rendered. */
  isVisible: (id: string) => boolean
  /** Widget IDs to render, in saved order, filtered by visibility & category. */
  visibleIds: (category: WidgetCategory) => string[]
  /** Same as visibleIds but returns the full WidgetDef. */
  visibleWidgets: (category: WidgetCategory) => WidgetDef[]
  /** Toggle a single widget's visibility (optimistic + persists). */
  toggleVisible: (id: string) => void
  /** Replace the entire saved order (within category-aware grouping). */
  setOrder: (orderedIds: string[]) => void
  /** Replace the order for one category, leaving other categories untouched. */
  setCategoryOrder: (category: WidgetCategory, orderedIds: string[]) => void
  /** Hide or show a widget explicitly. */
  setVisible: (id: string, visible: boolean) => void
  /** Reset prefs for this dashboard back to defaults. */
  reset: () => void
  /** True while a server write is in flight. */
  saving: boolean
}

function orderWithinCategory(
  widgets: WidgetDef[],
  savedOrder: string[],
  category: WidgetCategory,
): string[] {
  const inCategory = widgets.filter((w) => w.category === category).map((w) => w.id)
  const inCategorySet = new Set(inCategory)
  const ordered: string[] = []
  for (const id of savedOrder) {
    if (inCategorySet.has(id) && !ordered.includes(id)) ordered.push(id)
  }
  for (const id of inCategory) {
    if (!ordered.includes(id)) ordered.push(id)
  }
  return ordered
}

export function useDashboardPreferences(dashboardKey: DashboardKey): DashboardPreferencesApi {
  const { user, mergeUser } = useAuth()
  const manifest = getManifest(dashboardKey)
  const allWidgets = manifest.widgets

  const saved = user?.dashboardPreferences?.[dashboardKey] ?? null
  const hiddenWidgets = useMemo(
    () => new Set(saved?.hiddenWidgets ?? allWidgets.filter((w) => w.defaultHidden).map((w) => w.id)),
    [saved, allWidgets],
  )
  const widgetOrder = useMemo(() => saved?.widgetOrder ?? [], [saved])

  const [mutate, { loading: saving }] = useMutation(UPDATE_MY_DASHBOARD_PREFERENCES)

  const persist = useCallback(
    (nextHidden: string[], nextOrder: string[]) => {
      const next = { hiddenWidgets: nextHidden, widgetOrder: nextOrder }
      mergeUser({
        dashboardPreferences: {
          ...(user?.dashboardPreferences ?? {}),
          [dashboardKey]: next,
        },
      })
      mutate({
        variables: { dashboard: dashboardKey, input: next },
      }).catch(() => {
        // Keep optimistic state; MeSync will eventually reconcile if mutation truly failed.
      })
    },
    [mergeUser, mutate, dashboardKey, user?.dashboardPreferences],
  )

  const isVisible = useCallback((id: string) => !hiddenWidgets.has(id), [hiddenWidgets])

  const visibleIds = useCallback(
    (category: WidgetCategory) =>
      orderWithinCategory(allWidgets, widgetOrder, category).filter((id) => !hiddenWidgets.has(id)),
    [allWidgets, widgetOrder, hiddenWidgets],
  )

  const visibleWidgets = useCallback(
    (category: WidgetCategory) => {
      const ids = visibleIds(category)
      const map = new Map(allWidgets.map((w) => [w.id, w]))
      return ids.map((id) => map.get(id)!).filter(Boolean)
    },
    [visibleIds, allWidgets],
  )

  const setVisible = useCallback(
    (id: string, visible: boolean) => {
      const next = new Set(hiddenWidgets)
      if (visible) next.delete(id)
      else next.add(id)
      persist(Array.from(next), widgetOrder)
    },
    [hiddenWidgets, widgetOrder, persist],
  )

  const toggleVisible = useCallback(
    (id: string) => setVisible(id, hiddenWidgets.has(id)),
    [hiddenWidgets, setVisible],
  )

  const setOrder = useCallback(
    (orderedIds: string[]) => {
      persist(Array.from(hiddenWidgets), orderedIds)
    },
    [hiddenWidgets, persist],
  )

  const setCategoryOrder = useCallback(
    (category: WidgetCategory, orderedIds: string[]) => {
      const otherIds = orderWithinCategory(allWidgets, widgetOrder, 'heroCta')
        .concat(orderWithinCategory(allWidgets, widgetOrder, 'kpi'))
        .concat(orderWithinCategory(allWidgets, widgetOrder, 'section'))
        .filter((id) => {
          const w = allWidgets.find((x) => x.id === id)
          return w && w.category !== category
        })
      const merged: string[] = []
      const seen = new Set<string>()
      const push = (id: string) => {
        if (!seen.has(id)) {
          merged.push(id)
          seen.add(id)
        }
      }
      // Preserve category-position by walking the current full order and substituting.
      const fullOrder = orderWithinCategory(allWidgets, widgetOrder, 'heroCta')
        .concat(orderWithinCategory(allWidgets, widgetOrder, 'kpi'))
        .concat(orderWithinCategory(allWidgets, widgetOrder, 'section'))
      const newIdsForCat = orderedIds.slice()
      for (const id of fullOrder) {
        const w = allWidgets.find((x) => x.id === id)
        if (!w) continue
        if (w.category === category) {
          if (newIdsForCat.length) push(newIdsForCat.shift()!)
        } else {
          push(id)
        }
      }
      for (const id of newIdsForCat) push(id)
      for (const id of otherIds) push(id)
      persist(Array.from(hiddenWidgets), merged)
    },
    [allWidgets, widgetOrder, hiddenWidgets, persist],
  )

  const reset = useCallback(() => {
    persist([], [])
  }, [persist])

  return {
    allWidgets,
    hiddenWidgets,
    widgetOrder,
    isVisible,
    visibleIds,
    visibleWidgets,
    toggleVisible,
    setOrder,
    setCategoryOrder,
    setVisible,
    reset,
    saving,
  }
}
