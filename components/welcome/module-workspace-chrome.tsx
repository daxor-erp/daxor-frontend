'use client'

/**
 * Module workspace chrome (header + section tabs).
 *
 * OVERFLOW DROPDOWN: Production and Sales pin a primary tab set; remaining
 * leaves open from a chevron on the last primary tab. When an overflow leaf
 * is active, the tab strip hides and a breadcrumb returns to primary tabs.
 * Say "revert dropdown" to remove only this.
 */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouteTransition } from '@/contexts/RouteTransitionContext'
import { NAVIGATION, type NavItem } from '@/lib/navigation'
import { filterNavigationByModuleView, type ErpNavItem } from '@/lib/erp-module-access'
import { filterNavigationByPackageModules } from '@/lib/package-module-access'
import {
  findActiveLeafHref,
  findModuleForPath,
  flattenNavLeaves,
  type AppLeaf,
} from '@/lib/welcome-apps'
import { WelcomeChromeHeader } from '@/components/welcome/welcome-chrome-header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

/**
 * Production primary tab order:
 * Overview + MEP Overall Dashboard + former dropdown modules.
 * Everything else goes in the overflow dropdown.
 */
const PRODUCTION_PRIMARY_HREFS = [
  '/production',
  '/production/dashboards/mep-overall',
  '/production/masters/project-masters',
  '/production/masters/site-locations',
  '/production/masters/contractors',
  '/production/module-time-tracking',
  '/production/scan-qr-code',
  '/production/status-all-modules',
] as const

/** Sales: Sales Orders, Delivery Orders, Delivery Challan, Project, Sales Enquiry. */
const SALES_PRIMARY_HREFS = [
  '/sales-orders',
  '/sales/delivery-orders',
  '/delivery-challan',
  '/sales/project',
  '/sales/sales-enquiry',
] as const

/** Financial: through Create Allocation Schedules. Later leaves go in the dropdown. */
const FINANCIAL_PRIMARY_HREFS = [
  '/general-ledger',
  '/cash-bank',
  '/financial/chart-of-accounts',
  '/financial/tax-rates',
  '/financial/fixed-assets',
  '/financial/asset-maintenance',
  '/financial/intercompany-allocation',
  '/financial/intercompany-journal',
  '/financial/create-allocation-schedules',
] as const

/** HR: through Asset Issue to Employee. Later leaves go in the dropdown. */
const HR_PRIMARY_HREFS = [
  '/hr/timesheets',
  '/hr/leave/leave-type',
  '/hr/leave/leave-application',
  '/hr/leave/leave-enrollment',
  '/hr/leave/leave-reinstatement',
  '/hr/masters/employee-master',
  '/hr/masters/career-progress-salary',
  '/hr/masters/asset-name-list',
  '/hr/masters/asset-issue',
] as const

/** Customers: through Invoice Billable Customers. Later leaves go in the dropdown. */
const CUSTOMERS_PRIMARY_HREFS = [
  '/customers',
  '/customers/accept-payments',
  '/customers/approve-returns',
  '/customers/assess-finance-charges',
  '/customers/generate-price-lists',
  '/customers/generate-statements',
  '/customers/individual-price-list',
  '/customers/invoice-billable',
] as const

/** Payroll: through Pay Component. Later leaves go in the dropdown. */
const PAYROLL_PRIMARY_HREFS = [
  '/payroll-management',
  '/salary-processing',
  '/payroll/data-preparation',
  '/payroll/data-preparation/yard-data',
  '/payroll/data-preparation/biometric-data',
  '/payroll/data-preparation/manual-entry',
  '/payroll/others/loan-repayment',
  '/payroll/processing/pay-batch',
  '/payroll/processing/payee-employee',
  '/payroll/processing/retroactive-payment',
  '/payroll/setup/pay-component',
] as const

/** Inventory: through Items. Later leaves go in the dropdown. */
const INVENTORY_PRIMARY_HREFS = [
  '/inventory-control',
  '/warehouse',
  '/stock-adjustments',
  '/stock-transfers',
  '/goods-receipt',
  '/grn',
  '/inventory/enter-transfer-orders',
  '/inventory/equipment-masters',
  '/inventory/intercompany-transfer',
  '/inventory/items',
] as const

const PRIMARY_HREFS_BY_MODULE: Record<string, readonly string[]> = {
  production: PRODUCTION_PRIMARY_HREFS,
  sales: SALES_PRIMARY_HREFS,
  financial: FINANCIAL_PRIMARY_HREFS,
  hr: HR_PRIMARY_HREFS,
  customers: CUSTOMERS_PRIMARY_HREFS,
  payroll: PAYROLL_PRIMARY_HREFS,
  inventory: INVENTORY_PRIMARY_HREFS,
}

function splitByPrimaryHrefs(leaves: AppLeaf[], hrefs: readonly string[]): {
  primary: AppLeaf[]
  overflow: AppLeaf[]
} {
  const byHref = new Map(leaves.map((l) => [l.href, l]))
  const primary: AppLeaf[] = []
  for (const href of hrefs) {
    const leaf = byHref.get(href)
    if (leaf) primary.push(leaf)
  }
  const primarySet = new Set(primary.map((l) => l.href))
  const overflow = leaves.filter((l) => !primarySet.has(l.href))
  return { primary, overflow }
}

function splitModuleLeaves(moduleKey: string | undefined, leaves: AppLeaf[]): {
  primary: AppLeaf[]
  overflow: AppLeaf[]
} {
  const hrefs = moduleKey ? PRIMARY_HREFS_BY_MODULE[moduleKey] : undefined
  if (hrefs) return splitByPrimaryHrefs(leaves, hrefs)
  return { primary: leaves, overflow: [] }
}

export function ModuleWorkspaceChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const { user } = useAuth()
  const { startNavigation } = useRouteTransition()

  const visibleNav = useMemo(() => {
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
  }, [user?.modulePermissions, user?.packageEnabledModules, user?.roles])

  const moduleItem = useMemo(
    () => findModuleForPath(pathname, visibleNav),
    [pathname, visibleNav],
  )

  const leaves = useMemo(
    () => (moduleItem ? flattenNavLeaves(moduleItem) : []),
    [moduleItem],
  )

  const activeHref = useMemo(
    () => findActiveLeafHref(pathname, leaves),
    [pathname, leaves],
  )

  const { primary, overflow } = useMemo(
    () => splitModuleLeaves(moduleItem?.moduleKey, leaves),
    [moduleItem?.moduleKey, leaves],
  )

  const hasOverflow = overflow.length > 0
  const activeInOverflow = Boolean(
    hasOverflow && activeHref && overflow.some((l) => l.href === activeHref),
  )

  const moduleHomeHref = primary[0]?.href ?? leaves[0]?.href ?? '/welcome'
  const showTabs = leaves.length > 1 && !activeInOverflow
  const lastPrimaryHref = primary[primary.length - 1]?.href
  const activeLeaf = leaves.find((l) => l.href === activeHref) ?? null
  const breadcrumbCurrent =
    activeLeaf && activeLeaf.name !== moduleItem?.name ? activeLeaf.name : undefined

  // Prefetch primary + overflow tabs so switching feels instant.
  useEffect(() => {
    for (const leaf of leaves) {
      router.prefetch(leaf.href)
    }
  }, [leaves, router])

  const go = (href: string) => {
    startNavigation(href)
    router.push(href)
  }

  return (
    <div className="flex h-screen min-w-0 flex-col overflow-x-hidden bg-white">
      <WelcomeChromeHeader
        showAppsHome
        title={moduleItem?.name}
        titleHref={breadcrumbCurrent ? moduleHomeHref : undefined}
        breadcrumbCurrent={breadcrumbCurrent}
      />

      {showTabs ? (
        <div className="min-w-0 shrink-0 overflow-hidden border-b border-slate-200 bg-white">
          <nav
            aria-label={`${moduleItem?.name ?? 'Module'} sections`}
            className="flex min-w-0 gap-0 overflow-x-auto px-2 sm:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {primary.map((leaf) => {
              const active = leaf.href === activeHref
              const isLastWithDropdown = hasOverflow && leaf.href === lastPrimaryHref

              if (isLastWithDropdown) {
                return (
                  <div
                    key={leaf.href}
                    className="relative inline-flex shrink-0 items-stretch"
                  >
                    <Link
                      href={leaf.href}
                      prefetch
                      onClick={() => startNavigation(leaf.href)}
                      onMouseEnter={() => router.prefetch(leaf.href)}
                      className={cn(
                        'relative whitespace-nowrap py-2.5 pl-3 pr-1 text-[13px] font-medium transition-colors',
                        active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800',
                      )}
                    >
                      {leaf.name}
                      {active ? (
                        <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#378ADD]" />
                      ) : null}
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label="More modules"
                          className={cn(
                            'inline-flex items-center px-1.5 py-2.5 text-slate-500 transition-colors hover:text-slate-800',
                            'outline-none focus-visible:text-[#378ADD]',
                          )}
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-[220px]">
                        {overflow.map((item) => (
                          <DropdownMenuItem
                            key={item.href}
                            className={cn(
                              'cursor-pointer text-[13px]',
                              item.href === activeHref && 'bg-[#378ADD]/10 text-[#378ADD]',
                            )}
                            onSelect={() => {
                              go(item.href)
                            }}
                          >
                            {item.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              }

              return (
                <Link
                  key={leaf.href}
                  href={leaf.href}
                  prefetch
                  onClick={() => startNavigation(leaf.href)}
                  onMouseEnter={() => router.prefetch(leaf.href)}
                  className={cn(
                    'relative shrink-0 whitespace-nowrap px-3 py-2.5 text-[13px] font-medium transition-colors',
                    active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800',
                  )}
                >
                  {leaf.name}
                  {active ? (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#378ADD]" />
                  ) : null}
                </Link>
              )
            })}
          </nav>
        </div>
      ) : null}

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white">{children}</div>
    </div>
  )
}
