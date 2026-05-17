'use client'

/**
 * Cross-module search bar used in the app header. Opens a command-palette
 * overlay with results grouped by kind. Hits the backend `globalSearch`
 * GraphQL query — debounces and cancels in-flight calls.
 *
 * Triggers: clicking the bar OR ⌘/Ctrl+K from anywhere.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { GLOBAL_SEARCH } from '@/gql/queries'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Hit {
  id: string
  kind: string
  title: string
  subtitle?: string | null
  link: string
}

const KIND_TONE: Record<string, string> = {
  Customer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Vendor: 'bg-violet-50 text-violet-700 border-violet-200',
  Item: 'bg-sky-50 text-sky-700 border-sky-200',
  Invoice: 'bg-amber-50 text-amber-700 border-amber-200',
  PurchaseOrder: 'bg-rose-50 text-rose-700 border-rose-200',
  SalesOrder: 'bg-primary-soft text-primary border-primary/20',
  Quotation: 'bg-teal-50 text-teal-700 border-teal-200',
  Employee: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

export function GlobalSearch() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [runSearch, { data, loading }] = useLazyQuery(GLOBAL_SEARCH, {
    fetchPolicy: 'no-cache',
  })

  // Debounce: search when query changes (after 220ms idle)
  useEffect(() => {
    if (!open) return
    const q = query.trim()
    if (q.length < 2) return
    if (!orgId) return
    const t = setTimeout(() => {
      runSearch({ variables: { organizationId: orgId, query: q, limitPerKind: 5 } })
    }, 220)
    return () => clearTimeout(t)
  }, [query, open, orgId, runSearch])

  // Global ⌘/Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 30)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Outside click closes overlay
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!overlayRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const hits: Hit[] = data?.globalSearch ?? []
  const grouped = useMemo(() => {
    const map = new Map<string, Hit[]>()
    for (const h of hits) {
      if (!map.has(h.kind)) map.set(h.kind, [])
      map.get(h.kind)!.push(h)
    }
    return Array.from(map.entries())
  }, [hits])

  const flatHits = hits

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(flatHits.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = flatHits[active]
      if (hit) {
        router.push(hit.link)
        setOpen(false)
      }
    }
  }

  return (
    <>
      {/* Trigger (looks like the existing search input on desktop, icon on mobile) */}
      <button
        type="button"
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 30) }}
        className="hidden sm:flex items-center w-full max-w-xl rounded-lg border border-border bg-secondary/40 py-2 pl-10 pr-12 text-sm text-left text-muted-foreground hover:bg-secondary transition-colors relative"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        Search customers, invoices, items…
        <kbd className="hidden md:inline-flex pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-6 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      {/* Mobile fallback icon */}
      <button
        type="button"
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 30) }}
        className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary"
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/30 backdrop-blur-sm pt-[8vh] px-4">
          <div
            ref={overlayRef}
            className="w-full max-w-2xl rounded-2xl border border-border bg-popover elev-3 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
          >
            <div className="relative border-b border-border">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0) }}
                onKeyDown={handleKey}
                placeholder="Search customers, invoices, items, vendors…"
                className="w-full h-14 bg-transparent border-0 outline-none pl-12 pr-12 text-base placeholder:text-muted-foreground"
              />
              {loading ? (
                <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
              ) : (
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length < 2 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm font-medium">Type to search</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Results from customers, vendors, items, invoices, POs, sales orders, quotations and employees.
                  </p>
                  <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
                    <Shortcut keys={['↑', '↓']} note="navigate" />
                    <Shortcut keys={['↵']} note="open" />
                    <Shortcut keys={['Esc']} note="close" />
                  </div>
                </div>
              ) : grouped.length === 0 && !loading ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm font-medium">No results</p>
                  <p className="text-xs text-muted-foreground mt-1">Try a different keyword or shorter query.</p>
                </div>
              ) : (
                <ul>
                  {(() => {
                    let idx = -1
                    return grouped.map(([kind, list]) => (
                      <li key={kind}>
                        <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                          {kind}
                        </p>
                        <ul className="pb-1">
                          {list.map((h) => {
                            idx += 1
                            const isActive = idx === active
                            return (
                              <li key={`${kind}-${h.id}`}>
                                <button
                                  type="button"
                                  onClick={() => { router.push(h.link); setOpen(false) }}
                                  onMouseEnter={() => setActive(idx)}
                                  className={cn(
                                    'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                                    isActive ? 'bg-secondary' : 'hover:bg-secondary/60',
                                  )}
                                >
                                  <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium', KIND_TONE[kind] ?? 'bg-secondary text-foreground border-border')}>
                                    {kind}
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="font-medium block truncate">{h.title}</span>
                                    {h.subtitle && (
                                      <span className="text-xs text-muted-foreground truncate block">{h.subtitle}</span>
                                    )}
                                  </span>
                                  <ArrowRight className={cn('h-4 w-4 text-muted-foreground transition-opacity', isActive ? 'opacity-100' : 'opacity-0')} />
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                    ))
                  })()}
                </ul>
              )}
            </div>
            <div className="border-t border-border bg-secondary/40 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Daxor global search</span>
              <span className="inline-flex items-center gap-2">
                <Shortcut keys={['↑', '↓']} note="nav" />
                <Shortcut keys={['↵']} note="open" />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Shortcut({ keys, note }: { keys: string[]; note: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((k) => (
        <kbd key={k} className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border bg-background px-1 font-mono text-[10px] font-medium text-foreground/70">
          {k}
        </kbd>
      ))}
      <span>{note}</span>
    </span>
  )
}
