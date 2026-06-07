'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useMemo, useRef, useState } from 'react'
import { filterNavigationByModuleView, type ErpNavItem } from '@/lib/erp-module-access'
import { filterNavigationByPackageModules } from '@/lib/package-module-access'
import {
  Building2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Shield,
  Sparkles,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAVIGATION } from '@/lib/navigation'
import { getAdminConsoleBackLink, isPlatformAdminRole } from '@/lib/admin-console-link'

interface SidebarProps {
  collapsed?: boolean
  onCollapseToggle?: () => void
  mobile?: boolean
  onMobileClose?: () => void
}

type NavItem = {
  name: string
  href?: string
  icon?: any
  subItems?: NavItem[]
}

const SIDE_RAIL_WIDTH = 68 // px, must match w-[68px] below

export function Sidebar({ collapsed = false, onCollapseToggle, mobile = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname() ?? ''
  const { user } = useAuth()
  // Accordion: top-level is single-open; nested keys (parent::child) can also be open.
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [openNested, setOpenNested] = useState<Set<string>>(new Set())
  // Flyout (collapsed/icon-only mode): which top-level section is hovered.
  const [flyoutName, setFlyoutName] = useState<string | null>(null)
  const [flyoutTop, setFlyoutTop] = useState(0)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const adminBack = getAdminConsoleBackLink(user?.roles)
  const AdminBackIcon = isPlatformAdminRole(user?.roles) ? Shield : Building2

  const visibleNavigation = useMemo(
    () => {
      const byRole = filterNavigationByModuleView(
        NAVIGATION as unknown as ErpNavItem[],
        user?.modulePermissions,
        user?.roles,
      ) as NavItem[]
      return filterNavigationByPackageModules(
        byRole as ErpNavItem[],
        user?.packageEnabledModules,
        user?.roles,
      ) as NavItem[]
    },
    [user?.modulePermissions, user?.packageEnabledModules, user?.roles],
  )

  // Find the single best matching leaf for the current route (longest prefix wins),
  // so siblings whose hrefs share a prefix don't both light up.
  const activeHref = useMemo(() => {
    const leaves: string[] = []
    const collect = (items: NavItem[]) => {
      for (const it of items) {
        if (it.href) leaves.push(it.href)
        if (it.subItems?.length) collect(it.subItems)
      }
    }
    collect(visibleNavigation)
    let best: string | null = null
    for (const href of leaves) {
      if (pathname === href || pathname.startsWith(href + '/')) {
        if (!best || href.length > best.length) best = href
      }
    }
    return best
  }, [pathname, visibleNavigation])

  const isItemActive = (item: NavItem): boolean => {
    if (item.href) return item.href === activeHref
    if (item.subItems) return item.subItems.some((s) => isItemActive(s))
    return false
  }

  // Auto-open the active section (top + nested groups) in expanded mode.
  useEffect(() => {
    if (!pathname || collapsed) return
    const activeTop = visibleNavigation.find((it) => isItemActive(it))
    if (activeTop?.subItems?.length) setOpenMenu(activeTop.name)
    if (!activeTop) return
    const toOpen = new Set<string>()
    const walk = (items: NavItem[], parentKey: string) => {
      for (const it of items) {
        if (it.subItems?.length && isItemActive(it)) {
          const key = `${parentKey}::${it.name}`
          toOpen.add(key)
          walk(it.subItems, key)
        }
      }
    }
    walk(activeTop.subItems ?? [], activeTop.name)
    if (toOpen.size) setOpenNested((prev) => new Set([...prev, ...toOpen]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, collapsed, visibleNavigation])

  // Close any open flyout when entering expanded mode or unmounting.
  useEffect(() => {
    if (!collapsed) setFlyoutName(null)
  }, [collapsed])

  const showFlyout = (name: string, top: number) => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setFlyoutName(name)
    setFlyoutTop(top)
  }
  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setFlyoutName(null), 120)
  }
  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }

  /* ---------- render: collapsed icon rail ---------- */

  const renderCollapsedItem = (item: NavItem) => {
    const Icon = item.icon
    const hasSub = !!item.subItems?.length
    const active = isItemActive(item)
    const isFlyoutOpen = flyoutName === item.name

    return (
      <div
        key={item.name}
        className="relative"
        onMouseEnter={(e) => {
          if (!hasSub) return
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
          showFlyout(item.name, rect.top)
        }}
        onMouseLeave={scheduleHide}
      >
        <Link
          href={item.href ?? '#'}
          onClick={(e) => {
            if (hasSub && !item.href) e.preventDefault()
            else if (mobile) onMobileClose?.()
          }}
          aria-label={item.name}
          className={cn(
            'group relative mx-auto flex h-11 w-11 items-center justify-center rounded-lg transition-colors',
            active
              ? 'bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-[0_8px_18px_-10px_hsl(var(--sidebar-primary)/0.7)]'
              : isFlyoutOpen
                ? 'bg-[hsl(var(--sidebar-accent))] text-white'
                : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-white',
          )}
        >
          {active && (
            <span className="absolute left-[-10px] top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white/90" />
          )}
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </Link>
      </div>
    )
  }

  /* ---------- render: expanded sections ---------- */

  const renderNestedSub = (sub: NavItem, parentKey: string) => {
    const subActive = isItemActive(sub)
    const hasChildren = !!sub.subItems?.length
    const nestedKey = `${parentKey}::${sub.name}`
    const nestedOpen = openNested.has(nestedKey)

    if (hasChildren) {
      return (
        <li key={sub.name}>
          <button
            type="button"
            onClick={() =>
              setOpenNested((prev) => {
                const next = new Set(prev)
                if (next.has(nestedKey)) next.delete(nestedKey)
                else next.add(nestedKey)
                return next
              })
            }
            aria-expanded={nestedOpen}
            className={cn(
              'group flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-[12.5px] transition-colors',
              subActive
                ? 'text-white font-medium'
                : 'text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-accent))]/70 hover:text-white',
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
                subActive ? 'bg-white' : 'bg-[hsl(var(--sidebar-muted))] group-hover:bg-white',
              )}
            />
            <span className="flex-1 truncate text-left">{sub.name}</span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 shrink-0 opacity-80 transition-transform duration-200',
                nestedOpen ? 'rotate-0' : '-rotate-90',
              )}
            />
          </button>
          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-200 ease-out',
              nestedOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            )}
          >
            <div className="overflow-hidden">
              <ul className="mt-0.5 space-y-0.5 pb-1 pl-4">
                {sub.subItems!.map((leaf) => renderNestedSub(leaf, nestedKey))}
              </ul>
            </div>
          </div>
        </li>
      )
    }

    return (
      <li key={sub.name}>
        <Link
          href={sub.href ?? '#'}
          onClick={() => mobile && onMobileClose?.()}
          className={cn(
            'group flex h-8 items-center gap-2.5 rounded-md px-2 text-[12.5px] transition-colors',
            subActive
              ? 'bg-[hsl(var(--sidebar-primary))]/85 text-white font-medium'
              : 'text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-accent))]/70 hover:text-white',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
              subActive ? 'bg-white' : 'bg-[hsl(var(--sidebar-muted))] group-hover:bg-white',
            )}
          />
          <span className="truncate">{sub.name}</span>
        </Link>
      </li>
    )
  }

  const renderExpandedItem = (item: NavItem) => {
    const Icon = item.icon
    const hasSub = !!item.subItems?.length
    const active = isItemActive(item)
    const isOpen = openMenu === item.name

    if (!hasSub && item.href) {
      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => mobile && onMobileClose?.()}
          className={cn(
            'relative flex h-9 items-center gap-2.5 rounded-lg px-3 text-[13px] transition-colors',
            active
              ? 'bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] font-semibold shadow-[0_8px_18px_-10px_hsl(var(--sidebar-primary)/0.7)]'
              : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-white',
          )}
        >
          {active && (
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-white/90" />
          )}
          {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
          <span className="truncate">{item.name}</span>
        </Link>
      )
    }

    return (
      <div key={item.name}>
        <button
          type="button"
          onClick={() => setOpenMenu((prev) => (prev === item.name ? null : item.name))}
          aria-expanded={isOpen}
          className={cn(
            'relative flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[13px] transition-colors',
            isOpen
              ? 'bg-[hsl(var(--sidebar-accent))] text-white font-medium'
              : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-white',
          )}
        >
          {active && !isOpen && (
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[hsl(var(--sidebar-primary))]" />
          )}
          {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
          <span className="flex-1 truncate text-left">{item.name}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 opacity-80 transition-transform duration-200',
              isOpen ? 'rotate-0' : '-rotate-90',
            )}
          />
        </button>
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-200 ease-out',
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <ul className="mt-0.5 space-y-0.5 pb-1 pl-7 pr-1">
              {item.subItems!.map((sub) => renderNestedSub(sub, item.name))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- flyout (collapsed mode) ---------- */

  const flyoutItem =
    collapsed && !mobile && flyoutName
      ? visibleNavigation.find((i) => i.name === flyoutName)
      : null

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] transition-[width] duration-300 ease-out',
        collapsed ? 'w-[68px]' : 'w-72',
        mobile && 'w-72 shadow-2xl',
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center gap-2.5 border-b border-[hsl(var(--sidebar-border))] px-4',
          collapsed && 'justify-center px-2',
        )}
      >
        <div className="bg-grad-brand elev-brand grid h-9 w-9 place-items-center rounded-xl text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="font-bold leading-none tracking-tight text-white">Daxor</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--sidebar-muted))]">
              ERP Suite
            </p>
          </div>
        )}
        {mobile && (
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-md p-1 text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav
        className={cn(
          'scrollbar-thin min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-visible py-3',
          collapsed ? 'px-2' : 'px-2.5',
        )}
      >
        {!collapsed && (
          <p className="px-2 pb-2 pt-1 text-[10px] uppercase tracking-wider text-[hsl(var(--sidebar-muted))]">
            Workspace
          </p>
        )}
        {visibleNavigation.map((item) =>
          collapsed && !mobile ? renderCollapsedItem(item) : renderExpandedItem(item),
        )}
      </nav>

      {/* Footer */}
      <div className="shrink-0 space-y-1 border-t border-[hsl(var(--sidebar-border))] p-2">
        {!mobile && onCollapseToggle && (
          <button
            type="button"
            onClick={onCollapseToggle}
            className={cn(
              'flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[13px] text-[hsl(var(--sidebar-foreground))] transition-colors hover:bg-[hsl(var(--sidebar-accent))] hover:text-white',
              collapsed && 'mx-auto h-11 w-11 justify-center px-0',
            )}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
        {adminBack ? (
          <Link
            href={adminBack.href}
            title={adminBack.label}
            onClick={() => mobile && onMobileClose?.()}
            className={cn(
              'flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[13px] text-[hsl(var(--sidebar-foreground))] transition-colors hover:bg-[hsl(var(--sidebar-accent))] hover:text-white',
              collapsed && !mobile && 'mx-auto h-11 w-11 justify-center px-0',
            )}
          >
            <AdminBackIcon className="h-4 w-4 shrink-0" />
            {(!collapsed || mobile) && <span>{adminBack.label}</span>}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }}
          className={cn(
            'flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[13px] text-rose-300 transition-colors hover:!bg-rose-500/15 hover:!text-rose-200',
            collapsed && 'mx-auto h-11 w-11 justify-center px-0',
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Flyout (collapsed only, desktop) */}
      {flyoutItem?.subItems?.length ? (
        <div
          className="fixed z-50"
          style={{ left: `${SIDE_RAIL_WIDTH + 4}px`, top: Math.max(8, flyoutTop) }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          <div className="min-w-[220px] rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] p-2 shadow-2xl">
            <p className="px-2 pb-1.5 pt-0.5 text-[10px] uppercase tracking-wider text-[hsl(var(--sidebar-muted))]">
              {flyoutItem.name}
            </p>
            <ul className="space-y-0.5">
              {flyoutItem.subItems.flatMap((sub) => {
                if (sub.subItems?.length) {
                  return [
                    <li
                      key={`${sub.name}-label`}
                      className="px-2 pb-1 pt-2 text-[10px] uppercase tracking-wider text-[hsl(var(--sidebar-muted))]"
                    >
                      {sub.name}
                    </li>,
                    ...sub.subItems.map((leaf) => {
                      const leafActive = isItemActive(leaf)
                      return (
                        <li key={`${sub.name}-${leaf.name}`}>
                          <Link
                            href={leaf.href ?? '#'}
                            onClick={() => {
                              setFlyoutName(null)
                              if (mobile) onMobileClose?.()
                            }}
                            className={cn(
                              'flex h-8 items-center gap-2 rounded-md px-2 text-[12.5px] transition-colors',
                              leafActive
                                ? 'bg-[hsl(var(--sidebar-primary))] font-medium text-white'
                                : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-white',
                            )}
                          >
                            <span
                              className={cn(
                                'h-1.5 w-1.5 shrink-0 rounded-full',
                                leafActive ? 'bg-white' : 'bg-[hsl(var(--sidebar-muted))]',
                              )}
                            />
                            <span className="truncate">{leaf.name}</span>
                          </Link>
                        </li>
                      )
                    }),
                  ]
                }
                const subActive = isItemActive(sub)
                return [
                  <li key={sub.name}>
                    <Link
                      href={sub.href ?? '#'}
                      onClick={() => {
                        setFlyoutName(null)
                        if (mobile) onMobileClose?.()
                      }}
                      className={cn(
                        'flex h-8 items-center gap-2 rounded-md px-2 text-[12.5px] transition-colors',
                        subActive
                          ? 'bg-[hsl(var(--sidebar-primary))] font-medium text-white'
                          : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-white',
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 shrink-0 rounded-full',
                          subActive ? 'bg-white' : 'bg-[hsl(var(--sidebar-muted))]',
                        )}
                      />
                      <span className="truncate">{sub.name}</span>
                    </Link>
                  </li>,
                ]
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
