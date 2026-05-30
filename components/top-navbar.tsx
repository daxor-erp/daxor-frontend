'use client'

/**
 * Horizontal "top navbar" alternative to the sidebar. Each top-level module
 * is a button that opens a dropdown panel. Sub-groups (e.g. Payroll → Data
 * Preparation) open as nested side panels on hover.
 *
 * Dropdowns are portaled to <body> so they never get clipped by parent
 * `overflow-hidden` / sticky layers, and they stay on top of the rest of
 * the app chrome regardless of z-index stacking contexts.
 */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '@/contexts/AuthContext'
import { filterNavigationByModuleView, type ErpNavItem } from '@/lib/erp-module-access'
import { filterNavigationByPackageModules } from '@/lib/package-module-access'
import { NAVIGATION, type NavItem } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react'

interface TopNavbarProps {
  showBrand?: boolean
}

interface AnchorRect {
  left: number
  right: number
  top: number
  bottom: number
}

export function TopNavbar({ showBrand = true }: TopNavbarProps) {
  const pathname = usePathname() ?? ''
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState<string | null>(null)
  const [anchor, setAnchor] = useState<AnchorRect | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const [moreAnchor, setMoreAnchor] = useState<AnchorRect | null>(null)
  const [visibleCount, setVisibleCount] = useState<number>(99)
  const containerRef = useRef<HTMLDivElement>(null)
  const ulRef = useRef<HTMLUListElement>(null)

  const visibleNavigation = useMemo(
    () => {
      const byRole = filterNavigationByModuleView(
        NAVIGATION as unknown as ErpNavItem[],
        user?.modulePermissions,
        user?.roles,
      ) as unknown as NavItem[]
      return filterNavigationByPackageModules(
        byRole as ErpNavItem[],
        user?.packageEnabledModules,
        user?.roles,
      ) as unknown as NavItem[]
    },
    [user?.modulePermissions, user?.packageEnabledModules, user?.roles],
  )

  // Close on route change
  useEffect(() => {
    setOpen(null)
    setMoreOpen(false)
  }, [pathname])

  // Dismiss on outside click / Escape / scroll / resize
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('[data-nav-root]') && !t.closest('[data-nav-dropdown]')) {
        setOpen(null)
        setMoreOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null)
        setMoreOpen(false)
      }
    }
    const onScroll = () => {
      setOpen(null)
      setMoreOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Responsive overflow: measure available width vs. children width.
  useLayoutEffect(() => {
    const ul = ulRef.current
    if (!ul) return
    const measure = () => {
      const container = containerRef.current
      if (!container) return
      // Available width = container width − brand block − "More" button reserve.
      const RESERVE_FOR_MORE = 96
      const containerWidth = container.clientWidth
      const brandWidth =
        container.querySelector('[data-brand]')?.getBoundingClientRect().width ?? 0
      const available = containerWidth - brandWidth - RESERVE_FOR_MORE
      let acc = 0
      let count = 0
      const items = Array.from(ul.children) as HTMLElement[]
      for (let i = 0; i < items.length; i++) {
        // include gap
        acc += items[i].offsetWidth + 4
        if (acc < available) count = i + 1
        else break
      }
      setVisibleCount(count || items.length)
    }
    // Show all on first paint, then measure on next frame
    setVisibleCount(visibleNavigation.length)
    requestAnimationFrame(measure)
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [visibleNavigation])

  const isItemActive = (item: NavItem): boolean => {
    if (item.href && (pathname === item.href || pathname.startsWith(item.href + '/'))) return true
    if (item.subItems) return item.subItems.some((s) => isItemActive(s))
    return false
  }

  const openDropdownFor = (name: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (open === name) {
      setOpen(null)
      setAnchor(null)
      return
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setAnchor({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom })
    setOpen(name)
    setMoreOpen(false)
  }

  const openMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (moreOpen) {
      setMoreOpen(false)
      setMoreAnchor(null)
      return
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setMoreAnchor({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom })
    setMoreOpen(true)
    setOpen(null)
  }

  const visibleItems = visibleNavigation.slice(0, visibleCount)
  const overflowItems = visibleNavigation.slice(visibleCount)
  const openItem = useMemo(
    () => visibleNavigation.find((i) => i.name === open) ?? null,
    [open, visibleNavigation],
  )

  return (
    <nav
      data-nav-root
      className="sticky top-16 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85"
    >
      <div ref={containerRef} className="flex h-12 items-center gap-2 px-3 sm:px-4 lg:px-6">
        {showBrand && (
          <Link href="/dashboard" data-brand className="hidden sm:flex items-center gap-2 mr-2 pr-3 border-r border-border">
            <div className="h-7 w-7 rounded-lg bg-grad-brand grid place-items-center text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight">Daxor</span>
          </Link>
        )}
        <ul ref={ulRef} className="flex items-center gap-0.5 min-w-0 flex-1">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const hasChildren = !!item.subItems?.length
            const isOpen = open === item.name
            const active = isItemActive(item)
            const baseBtn = cn(
              'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
              active
                ? 'bg-primary-soft text-primary'
                : 'text-foreground/80 hover:bg-secondary hover:text-foreground',
              isOpen && 'bg-secondary text-foreground',
            )
            if (!hasChildren) {
              return (
                <li key={item.name}>
                  <Link href={item.href ?? '#'} className={baseBtn}>
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            }
            return (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={(e) => openDropdownFor(item.name, e)}
                  className={baseBtn}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} />
                </button>
              </li>
            )
          })}
        </ul>
        {overflowItems.length > 0 && (
          <button
            type="button"
            onClick={openMore}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap shrink-0',
              moreOpen ? 'bg-secondary text-foreground' : 'text-foreground/80 hover:bg-secondary',
            )}
            aria-expanded={moreOpen}
            aria-haspopup="true"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span>More</span>
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', moreOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      {/* Portaled dropdowns */}
      {open && openItem && anchor && (
        <NavDropdownPortal
          item={openItem}
          anchor={anchor}
          onClose={() => { setOpen(null); setAnchor(null) }}
          onNavigate={(href) => { router.push(href); setOpen(null); setAnchor(null) }}
        />
      )}
      {moreOpen && moreAnchor && overflowItems.length > 0 && (
        <MoreDropdownPortal
          items={overflowItems}
          anchor={moreAnchor}
          pathname={pathname}
          onClose={() => { setMoreOpen(false); setMoreAnchor(null) }}
          onNavigate={(href) => { router.push(href); setMoreOpen(false); setMoreAnchor(null) }}
        />
      )}
    </nav>
  )
}

/* ───────────────── Portal-rendered dropdown ───────────────── */

function NavDropdownPortal({
  item,
  anchor,
  onClose,
  onNavigate,
}: {
  item: NavItem
  anchor: AnchorRect
  onClose: () => void
  onNavigate: (href: string) => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const groups = (item.subItems ?? []).filter((s) => s.subItems?.length)
  const leaves = (item.subItems ?? []).filter((s) => !s.subItems?.length)
  const wide = groups.length > 0
  const width = wide ? Math.min(720, window.innerWidth - 32) : 280

  // Position: align under the trigger, but flip if overflowing right edge
  const viewportRight = window.innerWidth - 16
  let left = anchor.left
  if (left + width > viewportRight) {
    left = Math.max(16, viewportRight - width)
  }
  const top = anchor.bottom + 6

  return createPortal(
    <div
      data-nav-dropdown
      role="menu"
      className="fixed z-[60] rounded-xl border border-border bg-popover text-popover-foreground elev-3 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100"
      style={{ left, top, width }}
    >
      <div className={cn('p-2 grid gap-2', wide ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1')}>
        {leaves.length > 0 && (
          <div className="space-y-0.5">
            {wide && (
              <p className="px-2 pt-1 pb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Quick links
              </p>
            )}
            {leaves.map((sub) => (
              <DropdownLink key={sub.name} item={sub} onNavigate={onNavigate} />
            ))}
          </div>
        )}
        {groups.map((g) => (
          <DropdownGroup key={g.name} item={g} onNavigate={onNavigate} />
        ))}
      </div>
      {item.href && (
        <button
          type="button"
          onClick={() => onNavigate(item.href!)}
          className="block w-full text-left border-t bg-secondary/40 px-3 py-2 text-xs font-medium text-primary hover:bg-secondary/60"
        >
          Open {item.name} →
        </button>
      )}
    </div>,
    document.body,
  )
}

/** A second-level submenu group. Hover/click to expand its own panel. */
function DropdownGroup({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate: (href: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [anchorRect, setAnchorRect] = useState<AnchorRect | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const refresh = () => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setAnchorRect({ left: r.left, right: r.right, top: r.top, bottom: r.bottom })
  }

  return (
    <div
      ref={ref}
      className="space-y-0.5 relative"
      onMouseEnter={() => { refresh(); setOpen(true) }}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => { refresh(); setOpen((v) => !v) }}
        className="flex items-center justify-between gap-2 w-full rounded-md px-2 py-1.5 text-[10px] uppercase tracking-wider font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
      >
        <span>{item.name}</span>
        <ChevronRight className="h-3 w-3 opacity-60" />
      </button>
      {/* Inline list (always visible) */}
      {(item.subItems ?? []).slice(0, 5).map((sub) => (
        <DropdownLink key={sub.name} item={sub} onNavigate={onNavigate} />
      ))}
      {/* Plus side-panel if hovered (shows full list when there are many) */}
      {open && (item.subItems?.length ?? 0) > 5 && anchorRect && (
        <NestedPanel
          parent={item}
          anchor={anchorRect}
          onNavigate={onNavigate}
        />
      )}
    </div>
  )
}

/** Side-popping nested submenu (rendered via portal so it isn't clipped). */
function NestedPanel({
  parent,
  anchor,
  onNavigate,
}: {
  parent: NavItem
  anchor: AnchorRect
  onNavigate: (href: string) => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const width = 260
  const viewportRight = window.innerWidth - 16
  let left = anchor.right + 6
  if (left + width > viewportRight) {
    left = Math.max(16, anchor.left - width - 6)
  }
  const top = anchor.top

  return createPortal(
    <div
      data-nav-dropdown
      role="menu"
      className="fixed z-[61] rounded-xl border border-border bg-popover elev-3 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100"
      style={{ left, top, width }}
    >
      <div className="p-2">
        <p className="px-2 pt-1 pb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {parent.name}
        </p>
        {(parent.subItems ?? []).map((sub) => (
          <DropdownLink key={sub.name} item={sub} onNavigate={onNavigate} />
        ))}
      </div>
    </div>,
    document.body,
  )
}

function DropdownLink({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate: (href: string) => void
}) {
  if (!item.href) {
    return <div className="px-2 py-1.5 text-xs text-muted-foreground">{item.name}</div>
  }
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => onNavigate(item.href!)}
      className="w-full text-left flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary transition-colors group"
    >
      <span className="truncate">{item.name}</span>
      <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
    </button>
  )
}

function MoreDropdownPortal({
  items,
  anchor,
  pathname,
  onClose,
  onNavigate,
}: {
  items: NavItem[]
  anchor: AnchorRect
  pathname: string
  onClose: () => void
  onNavigate: (href: string) => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const width = Math.min(360, window.innerWidth - 32)
  const viewportRight = window.innerWidth - 16
  let left = anchor.right - width
  if (left < 16) left = 16
  if (left + width > viewportRight) left = viewportRight - width
  const top = anchor.bottom + 6

  return createPortal(
    <div
      data-nav-dropdown
      role="menu"
      className="fixed z-[60] rounded-xl border border-border bg-popover elev-3 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100"
      style={{ left, top, width }}
    >
      <div className="max-h-[60vh] overflow-y-auto p-1">
        {items.map((item) => (
          <div key={item.name} className="border-b last:border-b-0 border-border/50">
            <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              {item.name}
            </div>
            <div className="pb-1.5">
              {item.href && (
                <button
                  type="button"
                  onClick={() => onNavigate(item.href!)}
                  className="w-full text-left rounded-md px-2 py-1.5 text-sm hover:bg-secondary"
                >
                  Open {item.name}
                </button>
              )}
              {(item.subItems ?? []).slice(0, 8).map((s) => {
                // Render sub-groups inline
                if (s.subItems?.length) {
                  return (
                    <div key={s.name} className="mt-1">
                      <p className="px-2 pt-1 pb-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/80">
                        {s.name}
                      </p>
                      {s.subItems.slice(0, 6).map((leaf) =>
                        leaf.href ? (
                          <button
                            key={leaf.name}
                            type="button"
                            onClick={() => onNavigate(leaf.href!)}
                            className={cn(
                              'w-full text-left rounded-md px-2 py-1.5 text-sm hover:bg-secondary',
                              pathname.startsWith(leaf.href) && 'text-primary',
                            )}
                          >
                            {leaf.name}
                          </button>
                        ) : null,
                      )}
                    </div>
                  )
                }
                return s.href ? (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => onNavigate(s.href!)}
                    className={cn(
                      'w-full text-left rounded-md px-2 py-1.5 text-sm hover:bg-secondary',
                      pathname.startsWith(s.href) && 'text-primary',
                    )}
                  >
                    {s.name}
                  </button>
                ) : null
              })}
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body,
  )
}
