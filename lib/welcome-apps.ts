/**
 * Helpers for the Odoo-style welcome apps grid and module header tabs.
 */

import type { LucideIcon } from 'lucide-react'
import type { NavItem } from '@/lib/navigation'
import { NAVIGATION } from '@/lib/navigation'

export type AppLeaf = {
  name: string
  href: string
}

export type WelcomeApp = {
  id: string
  name: string
  icon: LucideIcon
  moduleKey?: string
  /** Direct href when the app has no children (e.g. Dashboard). */
  href?: string
  /** Flattened leaf routes shown as header tabs inside the module. */
  leaves: AppLeaf[]
  /** Accent used on the icon card. */
  accent: string
}

/** Distinct Odoo-like accent colors for app tiles (hex so Tailwind purge cannot drop them). */
const ACCENTS = [
  '#0ea5e9',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#f43f5e',
  '#6366f1',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
  '#d946ef',
  '#65a30d',
  '#2563eb',
  '#ec4899',
  '#475569',
  '#ef4444',
  '#16a34a',
  '#9333ea',
  '#ca8a04',
]

export function flattenNavLeaves(item: NavItem): AppLeaf[] {
  const out: AppLeaf[] = []
  const walk = (nodes: NavItem[]) => {
    for (const n of nodes) {
      if (n.href) out.push({ name: n.name, href: n.href })
      if (n.subItems?.length) walk(n.subItems)
    }
  }
  if (item.href && !item.subItems?.length) {
    out.push({ name: item.name, href: item.href })
  }
  if (item.subItems?.length) walk(item.subItems)
  return out
}

export function firstAppHref(app: WelcomeApp): string | null {
  if (app.href) return app.href
  return app.leaves[0]?.href ?? null
}

export function navigationToWelcomeApps(items: NavItem[]): WelcomeApp[] {
  return items.map((item, index) => {
    const leaves = flattenNavLeaves(item)
    const slug = item.name.toLowerCase().replace(/\s+/g, '-')
    // moduleKey alone is not unique (e.g. Dashboard, AI Assistant, and Tenants
    // all share moduleKey "dashboard") — React list keys must be unique.
    const id = item.moduleKey ? `${item.moduleKey}:${slug}` : slug
    return {
      id,
      name: item.name,
      icon: item.icon!,
      moduleKey: item.moduleKey,
      href: item.href && !item.subItems?.length ? item.href : undefined,
      leaves,
      accent: ACCENTS[index % ACCENTS.length],
    }
  }).filter((app) => Boolean(app.icon) && (app.href || app.leaves.length > 0))
}

/** Longest-prefix match: which top-level NAVIGATION module owns this path. */
export function findModuleForPath(pathname: string, items: NavItem[] = NAVIGATION): NavItem | null {
  const path = pathname || '/'
  let best: { item: NavItem; len: number } | null = null

  for (const item of items) {
    const leaves = flattenNavLeaves(item)
    for (const leaf of leaves) {
      const href = leaf.href
      const match =
        path === href ||
        path.startsWith(href.endsWith('/') ? href : `${href}/`)
      if (!match) continue
      if (!best || href.length > best.len) {
        best = { item, len: href.length }
      }
    }
    // Exact top-level href (Dashboard)
    if (item.href && (path === item.href || path.startsWith(`${item.href}/`))) {
      if (!best || item.href.length > best.len) {
        best = { item, len: item.href.length }
      }
    }
  }

  return best?.item ?? null
}

export function findActiveLeafHref(pathname: string, leaves: AppLeaf[]): string | null {
  const path = pathname || '/'
  let best: string | null = null
  for (const leaf of leaves) {
    const href = leaf.href
    if (path === href || path.startsWith(href.endsWith('/') ? href : `${href}/`)) {
      if (!best || href.length > best.length) best = href
    }
  }
  return best
}

export function isWelcomePath(pathname: string): boolean {
  return pathname === '/welcome' || pathname.startsWith('/welcome/')
}
