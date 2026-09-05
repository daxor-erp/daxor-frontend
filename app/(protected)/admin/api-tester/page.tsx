'use client'

/**
 * In-app API Tester. Three tabs:
 *  1. GraphQL Console — query + variables + run, auto-attached auth, response viewer
 *  2. REST Console — method/URL/headers/body + run
 *  3. Health Check — runs all curated read-only queries in parallel and shows pass/fail/timing
 *
 * Admin-only — registered under /admin/api-tester.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Activity, CheckCircle2, XCircle, Loader2, Play, Code, Globe,
  Copy, Trash2, ChevronDown, ChevronRight, Zap, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { GQL_PRESETS, HEALTH_CHECKS, type GqlPreset, type HealthCheck } from '@/lib/api-tester-presets'

function apiBase(): string {
  const gql = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql'
  return gql.replace(/\/graphql\/?$/, '').replace(/\/+$/, '')
}
function graphqlUrl(): string {
  return process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql'
}

interface GqlResult {
  status: number
  durationMs: number
  body: any
  ok: boolean
}

interface RestResult {
  status: number
  statusText: string
  durationMs: number
  headers: Record<string, string>
  body: any
  ok: boolean
}

interface HealthResult {
  name: string
  group: string
  status: 'pending' | 'pass' | 'fail'
  durationMs?: number
  error?: string
  rowCount?: number
}

function authHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function substituteOrg(query: string, vars: Record<string, unknown> | undefined, orgId: string): { query: string; variables: Record<string, unknown> | undefined } {
  if (!vars) return { query, variables: undefined }
  const next: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(vars)) {
    next[k] = typeof v === 'string' && v === '{{org}}' ? orgId : v
  }
  return { query, variables: next }
}

async function runGraphQL(query: string, variables: Record<string, unknown> | undefined): Promise<GqlResult> {
  const t0 = performance.now()
  const res = await fetch(graphqlUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ query, variables }),
  })
  const body = await res.json().catch(() => ({}))
  const t1 = performance.now()
  return {
    status: res.status,
    durationMs: t1 - t0,
    body,
    ok: res.ok && !body?.errors?.length,
  }
}

export default function ApiTesterPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  return (
    <div className="erp-shell">
      <PageHeader
        title="API Tester"
        description="Run GraphQL queries, hit REST endpoints, and check the health of every backend operation — all from inside Daxor."
      />

      {!orgId && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>You have no organization assigned, so queries that require an organization will return empty results. The tester still works.</span>
        </div>
      )}

      <Tabs defaultValue="graphql">
        <TabsList className="overflow-x-auto no-scrollbar w-full justify-start">
          <TabsTrigger value="graphql"><Code className="h-4 w-4 mr-1.5" />GraphQL Console</TabsTrigger>
          <TabsTrigger value="rest"><Globe className="h-4 w-4 mr-1.5" />REST Console</TabsTrigger>
          <TabsTrigger value="health"><Activity className="h-4 w-4 mr-1.5" />Health Check</TabsTrigger>
        </TabsList>

        <TabsContent value="graphql" className="mt-6">
          <GraphQLConsole orgId={orgId} />
        </TabsContent>
        <TabsContent value="rest" className="mt-6">
          <RestConsole />
        </TabsContent>
        <TabsContent value="health" className="mt-6">
          <HealthCheckPanel orgId={orgId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ───────────────── GraphQL Console ───────────────── */

function GraphQLConsole({ orgId }: { orgId: string }) {
  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>({})
  const [activePreset, setActivePreset] = useState<GqlPreset>(GQL_PRESETS[0])
  const [query, setQuery] = useState(GQL_PRESETS[0].query)
  const [varsText, setVarsText] = useState(
    GQL_PRESETS[0].variables ? JSON.stringify(GQL_PRESETS[0].variables, null, 2) : '{}',
  )
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<GqlResult | null>(null)

  const grouped = useMemo(() => {
    const map = new Map<string, GqlPreset[]>()
    for (const p of GQL_PRESETS) {
      if (!map.has(p.group)) map.set(p.group, [])
      map.get(p.group)!.push(p)
    }
    return Array.from(map.entries())
  }, [])

  useEffect(() => {
    // Default-open the first group
    if (grouped[0] && groupOpen[grouped[0][0]] === undefined) {
      setGroupOpen((s) => ({ ...s, [grouped[0][0]]: true }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadPreset = (p: GqlPreset) => {
    setActivePreset(p)
    setQuery(p.query)
    setVarsText(p.variables ? JSON.stringify(p.variables, null, 2) : '{}')
    setResult(null)
  }

  const run = async () => {
    let parsedVars: Record<string, unknown> | undefined
    try {
      parsedVars = varsText.trim() ? JSON.parse(varsText) : undefined
    } catch (e: any) {
      toast.error(`Variables JSON invalid: ${e?.message ?? 'parse error'}`)
      return
    }
    const { query: q, variables } = substituteOrg(query, parsedVars, orgId)
    setRunning(true)
    setResult(null)
    try {
      const res = await runGraphQL(q, variables)
      setResult(res)
      if (res.ok) toast.success(`OK · ${res.durationMs.toFixed(0)} ms`)
      else toast.error(`Failed · ${res.status}${res.body?.errors?.[0]?.message ? ' · ' + res.body.errors[0].message : ''}`)
    } catch (e: any) {
      setResult({ status: 0, durationMs: 0, body: { error: e?.message ?? 'Network error' }, ok: false })
      toast.error(e?.message ?? 'Network error')
    } finally {
      setRunning(false)
    }
  }

  const copyResponse = () => {
    if (!result) return
    navigator.clipboard.writeText(JSON.stringify(result.body, null, 2))
    toast.success('Response copied')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      {/* Preset library */}
      <SectionCard
        title="Presets"
        description={`${GQL_PRESETS.length} curated operations`}
        bodyClassName="p-2 max-h-[70vh] overflow-y-auto"
      >
        <ul className="space-y-1">
          {grouped.map(([group, items]) => {
            const isOpen = groupOpen[group] ?? false
            return (
              <li key={group}>
                <button
                  onClick={() => setGroupOpen((s) => ({ ...s, [group]: !isOpen }))}
                  className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-secondary"
                >
                  <span>{group}</span>
                  {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
                {isOpen && (
                  <ul className="mt-0.5 space-y-0.5">
                    {items.map((p) => (
                      <li key={p.name}>
                        <button
                          onClick={() => loadPreset(p)}
                          className={cn(
                            'w-full text-left rounded-md px-2 py-1.5 text-xs hover:bg-secondary',
                            activePreset.name === p.name && activePreset.group === p.group && 'bg-primary-soft text-primary font-medium',
                          )}
                        >
                          {p.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </SectionCard>

      <div className="space-y-4 min-w-0">
        {/* Query editor */}
        <SectionCard
          title={activePreset.name}
          description={`${activePreset.group} · ${graphqlUrl()}`}
          action={
            <Button onClick={run} disabled={running} className="gap-1.5">
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run
            </Button>
          }
        >
          <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
            <div className="space-y-1.5 min-w-0">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Query</Label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full rounded-lg border border-border bg-secondary/30 p-3 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Variables (JSON)</Label>
              <textarea
                value={varsText}
                onChange={(e) => setVarsText(e.target.value)}
                rows={16}
                spellCheck={false}
                placeholder="{}"
                className="w-full rounded-lg border border-border bg-secondary/30 p-3 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-primary/40"
              />
              <p className="text-[10px] text-muted-foreground">
                Use <code className="bg-secondary px-1 rounded">{`{{org}}`}</code> as a placeholder — it is replaced with your current organization id.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Response */}
        {result && (
          <SectionCard
            title="Response"
            description={`${result.status} · ${result.durationMs.toFixed(0)} ms`}
            action={
              <div className="flex items-center gap-2">
                <span className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                  result.ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200',
                )}>
                  {result.ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {result.ok ? 'OK' : 'Error'}
                </span>
                <Button variant="outline" size="sm" onClick={copyResponse} className="gap-1.5">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => setResult(null)} className="gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" /> Clear
                </Button>
              </div>
            }
          >
            <pre className="rounded-lg border border-border bg-slate-950 text-emerald-200 p-3 font-mono text-[11px] leading-relaxed overflow-auto max-h-[40vh]">
              {JSON.stringify(result.body, null, 2)}
            </pre>
          </SectionCard>
        )}
      </div>
    </div>
  )
}

/* ───────────────── REST Console ───────────────── */

function RestConsole() {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET')
  const [url, setUrl] = useState(apiBase() + '/ping')
  const [body, setBody] = useState('')
  const [contentType, setContentType] = useState('application/json')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<RestResult | null>(null)
  const [authOn, setAuthOn] = useState(true)

  const presets = [
    { label: 'Ping', method: 'GET' as const, url: apiBase() + '/ping', body: '' },
    { label: 'API root', method: 'GET' as const, url: apiBase() + '/api', body: '' },
    {
      label: 'PDF generate',
      method: 'POST' as const,
      url: apiBase() + '/api/pdf',
      body: JSON.stringify(
        { html: '<h1>Daxor PDF test</h1><p>Hello!</p>', filename: 'test' },
        null,
        2,
      ),
    },
    {
      label: 'Document upload (base64)',
      method: 'POST' as const,
      url: apiBase() + '/api/documents/upload',
      body: JSON.stringify(
        {
          organizationId: 'PUT_ORG_ID',
          parentModule: 'invoice',
          parentId: 'PUT_INVOICE_ID',
          filename: 'hello.txt',
          mimeType: 'text/plain',
          base64: 'SGVsbG8gZnJvbSBEYXhvciB1cGxvYWQ=',
        },
        null,
        2,
      ),
    },
  ]

  const run = async () => {
    setRunning(true)
    setResult(null)
    const headers: Record<string, string> = {}
    if (method !== 'GET' && body) headers['Content-Type'] = contentType
    if (authOn) Object.assign(headers, authHeader())
    const t0 = performance.now()
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: method === 'GET' ? undefined : body || undefined,
      })
      const t1 = performance.now()
      const ct = res.headers.get('content-type') ?? ''
      let parsed: any
      if (ct.includes('application/json')) {
        parsed = await res.json().catch(() => null)
      } else if (ct.includes('text/')) {
        parsed = await res.text()
      } else {
        // Binary — show size
        const blob = await res.blob()
        parsed = { binary: true, size: blob.size, mime: blob.type }
      }
      const headerObj: Record<string, string> = {}
      res.headers.forEach((v, k) => { headerObj[k] = v })
      setResult({
        status: res.status,
        statusText: res.statusText,
        durationMs: t1 - t0,
        headers: headerObj,
        body: parsed,
        ok: res.ok,
      })
    } catch (e: any) {
      const t1 = performance.now()
      setResult({
        status: 0,
        statusText: 'Network error',
        durationMs: t1 - t0,
        headers: {},
        body: { error: e?.message ?? 'fetch failed' },
        ok: false,
      })
    } finally {
      setRunning(false)
    }
  }

  return (
    <SectionCard
      title="REST endpoints"
      description="GET/POST/PUT/DELETE — Bearer token attached automatically when 'Authenticated' is on."
    >
      {/* Preset chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => { setMethod(p.method); setUrl(p.url); setBody(p.body) }}
            className="inline-flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-[11px] font-medium hover:bg-secondary"
          >
            <span className="text-primary font-mono">{p.method}</span>
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-2 items-end">
        <div className="space-y-1.5">
          <Label>Method</Label>
          <select value={method} onChange={(e) => setMethod(e.target.value as any)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>URL</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono text-xs" />
        </div>
        <Button onClick={run} disabled={running} className="gap-1.5 h-10">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Send
        </Button>
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs">
        <label className="inline-flex items-center gap-1.5">
          <input type="checkbox" checked={authOn} onChange={(e) => setAuthOn(e.target.checked)} className="h-3.5 w-3.5 rounded border-border text-primary" />
          Send Authorization header
        </label>
        {method !== 'GET' && (
          <span>Content-Type: <code className="bg-secondary px-1 rounded">{contentType}</code></span>
        )}
      </div>

      {method !== 'GET' && (
        <div className="space-y-1.5 mt-3">
          <Label>Body</Label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder="JSON body…"
            className="w-full rounded-lg border border-border bg-secondary/30 p-3 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      )}

      {result && (
        <div className="mt-5 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
              result.ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200',
            )}>
              {result.ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {result.status} {result.statusText}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">{result.durationMs.toFixed(0)} ms</span>
          </div>
          <details open>
            <summary className="cursor-pointer text-xs font-semibold">Response body</summary>
            <pre className="mt-2 rounded-lg border border-border bg-slate-950 text-emerald-200 p-3 font-mono text-[11px] leading-relaxed overflow-auto max-h-[40vh]">
              {typeof result.body === 'string' ? result.body : JSON.stringify(result.body, null, 2)}
            </pre>
          </details>
          <details>
            <summary className="cursor-pointer text-xs font-semibold text-muted-foreground">Response headers</summary>
            <pre className="mt-2 rounded-lg border border-border bg-secondary/40 p-3 font-mono text-[10px] leading-relaxed overflow-auto max-h-[20vh]">
              {Object.entries(result.headers).map(([k, v]) => `${k}: ${v}`).join('\n')}
            </pre>
          </details>
        </div>
      )}
    </SectionCard>
  )
}

/* ───────────────── Health Check ───────────────── */

function HealthCheckPanel({ orgId }: { orgId: string }) {
  const [results, setResults] = useState<HealthResult[]>(
    HEALTH_CHECKS.map((c) => ({ name: c.name, group: c.group, status: 'pending' as const })),
  )
  const [running, setRunning] = useState(false)
  const [concurrency, setConcurrency] = useState(6)

  const runAll = async () => {
    setRunning(true)
    setResults(HEALTH_CHECKS.map((c) => ({ name: c.name, group: c.group, status: 'pending' as const })))

    // Run with a small concurrency limit so we don't hammer the server.
    const queue: HealthCheck[] = [...HEALTH_CHECKS]
    const workers: Promise<void>[] = []
    const updateOne = (idx: number, patch: Partial<HealthResult>) => {
      setResults((prev) => {
        const next = prev.slice()
        next[idx] = { ...next[idx], ...patch }
        return next
      })
    }

    const worker = async () => {
      while (queue.length > 0) {
        const check = queue.shift()
        if (!check) break
        const idx = HEALTH_CHECKS.indexOf(check)
        const { query, variables } = substituteOrg(check.query, check.variables, orgId)
        const t0 = performance.now()
        try {
          const res = await runGraphQL(query, variables)
          const t1 = performance.now()
          if (res.ok) {
            // Try to estimate row count from the response shape (heuristic)
            let rowCount: number | undefined
            const data = res.body?.data
            if (data && typeof data === 'object') {
              const firstKey = Object.keys(data)[0]
              const v = (data as any)[firstKey]
              if (Array.isArray(v)) rowCount = v.length
              else if (v && typeof v === 'object') {
                if (Array.isArray((v as any).users)) rowCount = (v as any).users.length
                else if (Array.isArray((v as any).data)) rowCount = (v as any).data.length
              }
            }
            updateOne(idx, { status: 'pass', durationMs: t1 - t0, rowCount })
          } else {
            const msg = res.body?.errors?.[0]?.message ?? `HTTP ${res.status}`
            updateOne(idx, { status: 'fail', durationMs: t1 - t0, error: msg })
          }
        } catch (e: any) {
          const t1 = performance.now()
          updateOne(idx, { status: 'fail', durationMs: t1 - t0, error: e?.message ?? 'network error' })
        }
      }
    }

    for (let i = 0; i < Math.max(1, Math.min(concurrency, 12)); i++) workers.push(worker())
    await Promise.all(workers)
    setRunning(false)
  }

  const passed = results.filter((r) => r.status === 'pass').length
  const failed = results.filter((r) => r.status === 'fail').length
  const totalMs = results.reduce((s, r) => s + (r.durationMs ?? 0), 0)
  const avg = results.filter((r) => r.durationMs != null).length ? totalMs / results.filter((r) => r.durationMs != null).length : 0

  const grouped = useMemo(() => {
    const map = new Map<string, HealthResult[]>()
    for (const r of results) {
      if (!map.has(r.group)) map.set(r.group, [])
      map.get(r.group)!.push(r)
    }
    return Array.from(map.entries())
  }, [results])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total checks" value={results.length} icon={<Activity className="h-5 w-5" />} tone="brand" />
        <StatCard label="Passed" value={passed} icon={<CheckCircle2 className="h-5 w-5" />} tone="emerald" />
        <StatCard label="Failed" value={failed} icon={<XCircle className="h-5 w-5" />} tone="rose" />
        <StatCard label="Avg latency" value={`${avg.toFixed(0)} ms`} icon={<Zap className="h-5 w-5" />} tone="sky" />
      </div>

      <SectionCard
        title={`Health checks (${HEALTH_CHECKS.length})`}
        description={running ? 'Running…' : 'Click run to hit every read-only endpoint in parallel.'}
        action={
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              Concurrency
              <input
                type="number"
                min={1}
                max={12}
                value={concurrency}
                onChange={(e) => setConcurrency(Math.max(1, Math.min(12, Number(e.target.value))))}
                className="w-14 rounded-md border border-input bg-background px-2 py-1 text-xs"
              />
            </label>
            <Button onClick={runAll} disabled={running} className="gap-1.5">
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {running ? 'Running…' : 'Run all'}
            </Button>
          </div>
        }
        bodyClassName="p-0"
      >
        <ul className="divide-y">
          {grouped.map(([group, rows]) => (
            <li key={group}>
              <div className="px-5 pt-3 pb-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{group}</div>
              <ul>
                {rows.map((r) => (
                  <li key={r.name} className="flex items-center gap-3 px-5 py-2 hover:bg-secondary/30">
                    <span className="shrink-0">
                      {r.status === 'pass' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : r.status === 'fail' ? (
                        <XCircle className="h-4 w-4 text-rose-600" />
                      ) : (
                        <span className="block h-2.5 w-2.5 rounded-full bg-border" />
                      )}
                    </span>
                    <span className="font-medium text-sm flex-1 truncate">{r.name}</span>
                    {r.rowCount != null && (
                      <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                        {r.rowCount} row{r.rowCount === 1 ? '' : 's'}
                      </span>
                    )}
                    {r.durationMs != null && (
                      <span className={cn(
                        'text-[11px] tabular-nums shrink-0',
                        r.durationMs < 200 ? 'text-emerald-600' : r.durationMs < 600 ? 'text-amber-600' : 'text-rose-600',
                      )}>
                        {r.durationMs.toFixed(0)} ms
                      </span>
                    )}
                    {r.error && (
                      <span className="text-[11px] text-rose-600 truncate max-w-[40%]" title={r.error}>{r.error}</span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  )
}
