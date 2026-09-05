'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useAiChat, type Visualization, type AgentStep, type WorkflowGraphData, type WorkflowGraphNode, type WorkflowGraphEdge } from '@/hooks/useAiChat'
import { useAiPane } from '@/contexts/AiPaneContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Bot, Send, X, Trash2, ChevronRight, ChevronLeft,
  Loader2, Zap, AlertCircle,
  ChevronDown, ChevronUp, Maximize2, Minimize2,
  Hash, Search, BarChart2, Database, BookOpen, Package, Cpu, Globe,
  Check, AlertTriangle, Copy, GitBranch, Sparkles,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import dynamic from 'next/dynamic'

const WorkflowGraph = dynamic(
  () => import('@/components/workflow/WorkflowGraph').then((m) => ({ default: m.WorkflowGraph })),
  { ssr: false, loading: () => <div className="h-40 flex items-center justify-center text-xs text-gray-400">Loading graph…</div> },
)

function WorkflowGraphView({
  graph, large, onExpand,
}: {
  graph: WorkflowGraphData
  large: boolean
  onExpand?: () => void
}) {
  return (
    <div className="mt-2 rounded-lg border border-white/10 overflow-hidden bg-[#0d1117]">
      {/* Header — always clickable to expand */}
      <div
        onClick={onExpand}
        className={`px-3 py-1.5 bg-[#161b27] border-b border-white/8 flex items-center gap-1.5
          ${onExpand ? 'cursor-pointer hover:bg-white/5 transition-colors' : ''}`}
      >
        <GitBranch className="h-3 w-3 text-primary shrink-0" />
        <span className="text-[10px] text-gray-300 font-medium truncate">{graph.title ?? 'Workflow Graph'}</span>
        <span className="ml-auto text-[10px] text-gray-500 shrink-0">{graph.nodes.length} nodes · {graph.edges.length} edges</span>
        {onExpand && <Maximize2 className="h-3 w-3 text-gray-500 hover:text-primary transition-colors ml-1 shrink-0" />}
      </div>

      {/* Graph canvas — clicking it also expands */}
      <div
        className={`relative ${large ? 'h-96' : 'h-64'} ${onExpand ? 'cursor-pointer group' : ''}`}
        onClick={onExpand}
      >
        <WorkflowGraph nodes={graph.nodes as WorkflowGraphNode[]} edges={graph.edges as WorkflowGraphEdge[]} />
        {onExpand && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Maximize2 className="h-3 w-3" />
              Open full screen
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────── workflow intent detection ── */

const WORKFLOW_PATTERNS = [
  /\b(track|trace|workflow|journey|follow)\b/i,
  /\b(invoice|bill|payment)\b.{0,40}\b(vendor|supplier|customer)\b/i,
  /\b(vendor|supplier|customer)\b.{0,40}\b(invoice|bill|payment)\b/i,
  /\b(purchase.?order|sales.?order)\b.{0,30}\b(status|track|trace|workflow)\b/i,
  /\bshow.{0,20}workflow\b/i,
]

function isWorkflowQuery(text: string): boolean {
  return WORKFLOW_PATTERNS.some((p) => p.test(text))
}

/* ─────────────────────────────────────────────────────── page title map ── */
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/quotations': 'Quotations',
  '/vendors': 'Vendors',
  '/customers': 'Customers',
  '/sales/enter-sales-order': 'Sales Orders',
  '/sales/invoice-sales-order': 'Invoices',
  '/sales/sales-enquiry': 'Sales Enquiries',
  '/stock-adjustments': 'Stock Adjustments',
  '/stock-transfers': 'Stock Transfers',
  '/vendor-payments': 'Vendor Payments',
  '/warehouse': 'Warehouse',
  '/users': 'Users',
}

function getPageContext(pathname: string) {
  const title = PAGE_TITLES[pathname] ?? pathname.split('/').filter(Boolean).pop() ?? 'App'
  return { page: pathname, title: title.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) }
}

/* ──────────────────────────────────────────────── visualization helpers ── */

function formatCellValue(v: unknown): string {
  if (v == null) return '—'
  if (typeof v === 'number') return v.toLocaleString()
  const s = String(v)
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.slice(0, 10)
  return s
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16']
const TIP_SM = { fontSize: 10, padding: '4px 8px', borderRadius: 4 }
const TIP_LG = { fontSize: 12, padding: '6px 10px', borderRadius: 6 }
const TICK_SM = { fontSize: 8 }
const TICK_LG = { fontSize: 11 }

/* ───────────────────────────────────────── paginated table component ── */

function PaginatedTable({
  columns, data, total, large, textSz, thSz, footerSz,
}: {
  columns: { key: string; label: string }[] | undefined
  data: Record<string, unknown>[]
  total?: number
  large: boolean
  textSz: string
  thSz: string
  footerSz: string
}) {
  const PAGE_SIZE  = large ? 15 : 10
  const [page, setPage] = useState(0)
  const totalRows  = data.length
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE))
  const pageRows   = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const grandTotal = total ?? totalRows
  const from = page * PAGE_SIZE + 1
  const to   = Math.min((page + 1) * PAGE_SIZE, totalRows)

  return (
    <div>
      <div className="overflow-x-auto">
        <table className={`${textSz} w-full border-collapse`}>
          <thead>
            <tr className="bg-[hsl(var(--sidebar-accent))] border-b border-[hsl(var(--sidebar-border))]">
              {columns?.map((col) => (
                <th key={col.key} className={`px-2.5 py-2 text-left font-semibold text-[hsl(var(--sidebar-muted))] whitespace-nowrap ${thSz}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={i} className={`border-b border-[hsl(var(--sidebar-border))] ${i % 2 === 0 ? 'bg-[hsl(var(--sidebar-background))]' : 'bg-[hsl(var(--sidebar-accent))]/40'} hover:bg-[hsl(var(--sidebar-primary))]/10 transition-colors`}>
                {columns?.map((col) => (
                  <td key={col.key} className="px-2.5 py-1.5 text-[hsl(var(--sidebar-foreground))] whitespace-nowrap">
                    {formatCellValue(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination bar — always visible when there are rows */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-t border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))] ${footerSz}`}>
        <span className="text-[hsl(var(--sidebar-muted))]">
          {from}–{to} of {grandTotal.toLocaleString()}
          {grandTotal > totalRows ? ` (${totalRows} loaded)` : ''}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-0.5 rounded border border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-primary))]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            <span className="text-[hsl(var(--sidebar-muted))] px-1">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-2 py-0.5 rounded border border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-muted))] hover:bg-[hsl(var(--sidebar-primary))]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function VisualizationView({ viz, large = false }: { viz: Visualization; large?: boolean }) {
  const TIP  = large ? TIP_LG  : TIP_SM
  const TICK = large ? TICK_LG : TICK_SM
  const chartH     = large ? 280 : 160
  const pieH       = large ? 300 : 170
  const textSz     = large ? 'text-xs'    : 'text-[10px]'
  const thSz       = large ? 'text-xs'    : 'text-[10px]'
  const headerSz   = large ? 'text-xs'    : 'text-[10px]'
  const footerSz   = large ? 'text-[11px]' : 'text-[9px]'
  const maxCols    = large ? 8 : 6

  const columns = viz.columns
    ? large ? viz.columns : viz.columns.slice(0, maxCols)
    : undefined

  return (
    <div className="mt-2 not-prose rounded-lg border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] shadow-sm overflow-hidden">
      <div className="px-3 py-1.5 bg-[hsl(var(--sidebar-accent))] border-b border-[hsl(var(--sidebar-border))]">
        <p className={`${headerSz} font-semibold text-[hsl(var(--sidebar-muted))] uppercase tracking-wide`}>{viz.title}</p>
      </div>

      {/* TABLE — paginated */}
      {viz.type === 'table' && (
        <PaginatedTable columns={columns} data={viz.data} total={viz.total} large={large}
          textSz={textSz} thSz={thSz} footerSz={footerSz} />
      )}

      {/* BAR CHART */}
      {viz.type === 'bar_chart' && viz.x_key && viz.y_keys && (
        <div className="px-1 py-2">
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={viz.data} margin={{ top: 4, right: 8, left: large ? -8 : -20, bottom: viz.data.length > 6 ? (large ? 48 : 32) : 8 }}>
              <XAxis dataKey={viz.x_key} tick={{...TICK, fill: 'hsl(var(--sidebar-muted))'}} tickLine={false} axisLine={false}
                interval={0} angle={viz.data.length > 6 ? -35 : 0}
                textAnchor={viz.data.length > 6 ? 'end' : 'middle'}
                tickFormatter={(v: unknown) => String(v).slice(0, large ? 18 : 12)} />
              <YAxis tick={{...TICK, fill: 'hsl(var(--sidebar-muted))'}} tickLine={false} axisLine={false} width={large ? 44 : 32} />
              <Tooltip contentStyle={{ ...TIP, backgroundColor: 'hsl(var(--sidebar-background))', borderColor: 'hsl(var(--sidebar-border))', color: 'hsl(var(--sidebar-foreground))' }} itemStyle={TIP} />
              {viz.y_keys.map((yk) => (
                <Bar key={yk.key} dataKey={yk.key} fill={yk.color} radius={[3, 3, 0, 0]} name={yk.label} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* LINE CHART */}
      {viz.type === 'line_chart' && viz.x_key && viz.y_keys && (
        <div className="px-1 py-2">
          <ResponsiveContainer width="100%" height={chartH}>
            <LineChart data={viz.data} margin={{ top: 4, right: 8, left: large ? -8 : -20, bottom: large ? 48 : 32 }}>
              <XAxis dataKey={viz.x_key} tick={{...TICK, fill: 'hsl(var(--sidebar-muted))'}} tickLine={false} axisLine={false}
                interval={0} angle={-35} textAnchor="end"
                tickFormatter={(v: unknown) => String(v).slice(0, large ? 14 : 10)} />
              <YAxis tick={{...TICK, fill: 'hsl(var(--sidebar-muted))'}} tickLine={false} axisLine={false} width={large ? 44 : 32} />
              <Tooltip contentStyle={{ ...TIP, backgroundColor: 'hsl(var(--sidebar-background))', borderColor: 'hsl(var(--sidebar-border))', color: 'hsl(var(--sidebar-foreground))' }} itemStyle={TIP} />
              {viz.y_keys.map((yk) => (
                <Line key={yk.key} dataKey={yk.key} stroke={yk.color} strokeWidth={2}
                  dot={{ r: large ? 3 : 2, fill: yk.color }} name={yk.label} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* PIE CHART */}
      {viz.type === 'pie_chart' && viz.name_key && viz.value_key && (
        <div className="px-1 py-2">
          <ResponsiveContainer width="100%" height={pieH}>
            <PieChart>
              <Pie data={viz.data} dataKey={viz.value_key} nameKey={viz.name_key}
                cx="40%" cy="50%"
                outerRadius={large ? 100 : 60}
                innerRadius={large ? 40 : 24}
                paddingAngle={2}>
                {viz.data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ ...TIP, backgroundColor: 'hsl(var(--sidebar-background))', borderColor: 'hsl(var(--sidebar-border))', color: 'hsl(var(--sidebar-foreground))' }} itemStyle={TIP}
                formatter={(v: unknown) => typeof v === 'number' ? v.toLocaleString() : String(v)} />
              <Legend layout="vertical" align="right" verticalAlign="middle"
                iconSize={large ? 10 : 7} iconType="circle"
                wrapperStyle={{ fontSize: large ? 12 : 9, lineHeight: large ? '22px' : '18px', paddingLeft: large ? 12 : 8, color: 'hsl(var(--sidebar-muted))' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────── tool icon helper ── */

function ToolIcon({ tool, className = 'h-3 w-3' }: { tool: string; className?: string }) {
  const props = { className }
  if (tool === 'count')            return <Hash {...props} />
  if (tool === 'find')             return <Search {...props} />
  if (tool === 'aggregate')        return <BarChart2 {...props} />
  if (tool === 'schema')           return <Database {...props} />
  if (tool === 'knowledge_search') return <BookOpen {...props} />
  if (tool === 'inventory_health') return <Package {...props} />
  if (tool === 'web_search')       return <Globe {...props} />
  return <Cpu {...props} />
}

/* ─────────────────────────────────────────── agent steps (post response) ── */

function AgentStepsView({ steps, intent }: { steps: AgentStep[]; intent?: string }) {
  const [open, setOpen] = useState(false)
  if (!steps.length) return null

  const intentLabel = intent
    ? intent.replace('AGGREGATION_', '').replace('_', ' ').toLowerCase()
    : null

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--sidebar-muted))] hover:text-[hsl(var(--sidebar-foreground))] transition-colors select-none"
      >
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        <span className="tabular-nums">{steps.length} tool call{steps.length !== 1 ? 's' : ''}</span>
        {intentLabel && (
          <span className="text-[9px] text-[hsl(var(--sidebar-muted))] border border-[hsl(var(--sidebar-border))] rounded px-1 py-px font-mono tracking-wide">
            {intentLabel}
          </span>
        )}
      </button>

      {open && (
        <div className="mt-1.5 border border-[hsl(var(--sidebar-border))] rounded-lg overflow-hidden bg-[hsl(var(--sidebar-background))]">
          {steps.map((step, i) => {
            const isError = step.result?.startsWith('error')
            return (
              <div key={i} className={`px-2.5 py-2 flex flex-col gap-1 ${i > 0 ? 'border-t border-[hsl(var(--sidebar-border))]' : ''}`}>
                <div className="flex items-center gap-2">
                  <ToolIcon tool={step.tool} className="h-3 w-3 text-[hsl(var(--sidebar-muted))] shrink-0" />
                  <span className="text-[10px] font-mono text-[hsl(var(--sidebar-foreground))] font-medium">{step.tool}</span>
                  {step.inputSummary && (
                    <span className="text-[9px] text-[hsl(var(--sidebar-muted))] truncate">{step.inputSummary}</span>
                  )}
                </div>
                {step.result && (
                  <div className={`ml-5 flex items-start gap-1 text-[9px] font-mono ${isError ? 'text-red-400' : 'text-[hsl(var(--sidebar-muted))]'}`}>
                    {isError
                      ? <AlertTriangle className="h-2.5 w-2.5 shrink-0 mt-px text-red-400" />
                      : <Check className="h-2.5 w-2.5 shrink-0 mt-px text-[hsl(var(--sidebar-primary))]" />
                    }
                    <span className="break-all">{step.result}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ───────────────────────────────────────────── live streaming activity ── */

function StreamingActivity({ status, steps, currentTool, reasoning }: {
  status: string
  steps: AgentStep[]
  currentTool?: string
  reasoning?: string
}) {
  const [reasoningOpen, setReasoningOpen] = useState(true)
  return (
    <div className="bg-[hsl(var(--sidebar-background))] border border-[hsl(var(--sidebar-border))] rounded-xl rounded-bl-sm shadow-sm overflow-hidden max-w-[92%]">
      {/* Status bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[hsl(var(--sidebar-border))]">
        <Loader2 className="h-3 w-3 text-[hsl(var(--sidebar-primary))] animate-spin shrink-0" />
        <span className="text-[11px] text-[hsl(var(--sidebar-muted))]">{status}</span>
      </div>

      {/* Thinking panel — model's intent reasoning before tool calls */}
      {reasoning && reasoning.trim() && (
        <div className="border-b border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))]/40">
          <button
            type="button"
            onClick={() => setReasoningOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[hsl(var(--sidebar-accent))]/60 transition-colors"
          >
            <Sparkles className="h-3 w-3 text-purple-400 shrink-0" />
            <span className="text-[10px] font-medium text-purple-300 uppercase tracking-wide">
              Thinking
            </span>
            <span className="text-[9px] text-purple-400/60 ml-auto">
              {reasoningOpen ? 'hide' : 'show'}
            </span>
          </button>
          {reasoningOpen && (
            <div className="px-3 pb-2 text-[11px] text-purple-200/70 leading-relaxed whitespace-pre-wrap font-light italic">
              {reasoning}
            </div>
          )}
        </div>
      )}

      {/* Tool trace */}
      {steps.length > 0 && (
        <div>
          {steps.map((step, i) => {
            const isActive = i === steps.length - 1 && currentTool && !step.result
            const isError  = step.result?.startsWith('error')
            return (
              <div key={i} className={`px-3 py-1.5 flex flex-col gap-0.5 ${i > 0 ? 'border-t border-[hsl(var(--sidebar-border))]' : ''}`}>
                <div className="flex items-center gap-2">
                  <ToolIcon
                    tool={step.tool}
                    className={`h-3 w-3 shrink-0 ${isActive ? 'text-[hsl(var(--sidebar-primary))]' : 'text-[hsl(var(--sidebar-muted))]'}`}
                  />
                  <span className={`text-[10px] font-mono font-medium ${isActive ? 'text-[hsl(var(--sidebar-primary))]' : 'text-[hsl(var(--sidebar-foreground))]'}`}>
                    {step.tool}
                  </span>
                  {step.inputSummary && (
                    <span className="text-[9px] text-[hsl(var(--sidebar-muted))] truncate">{step.inputSummary}</span>
                  )}
                  {isActive && (
                    <span className="ml-auto flex gap-[3px] items-center">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="w-[3px] h-[3px] bg-[hsl(var(--sidebar-primary))] rounded-full animate-bounce"
                          style={{ animationDelay: `${d * 0.12}s` }}
                        />
                      ))}
                    </span>
                  )}
                </div>
                {step.result && (
                  <div className={`ml-5 flex items-start gap-1 text-[9px] font-mono ${isError ? 'text-red-400' : 'text-[hsl(var(--sidebar-muted))]'}`}>
                    {isError
                      ? <AlertTriangle className="h-2.5 w-2.5 shrink-0 mt-px text-red-400" />
                      : <Check className="h-2.5 w-2.5 shrink-0 mt-px text-[hsl(var(--sidebar-primary))]" />
                    }
                    <span className="break-all">{step.result}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────── reasoning reveal (chat) ── */

function ReasoningReveal({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 transition-colors"
      >
        <Sparkles className="h-3 w-3" />
        <span>{open ? 'Hide thinking' : 'Show thinking'}</span>
      </button>
      {open && (
        <div className="max-w-[460px] rounded-md border border-purple-900/30 bg-purple-900/10 px-2 py-1.5 text-[10px] italic font-light text-purple-200/70 whitespace-pre-wrap leading-relaxed">
          {text}
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────── message ── */

/* ─────────────────────────────── convert visualization → markdown text ── */

function vizToMarkdown(viz: Visualization): string {
  if (!viz || !viz.data?.length) return ''

  // Determine columns
  let headers: string[]
  let rows: Record<string, unknown>[]

  if (viz.type === 'table' && viz.columns?.length) {
    headers = viz.columns.map((c) => c.label)
    rows = viz.data.map((r) => {
      const out: Record<string, unknown> = {}
      viz.columns!.forEach((c) => { out[c.label] = r[c.key] })
      return out
    })
  } else if ((viz.type === 'bar_chart' || viz.type === 'line_chart') && viz.x_key && viz.y_keys?.length) {
    headers = [viz.x_key, ...viz.y_keys.map((y) => y.label)]
    rows = viz.data.map((r) => {
      const out: Record<string, unknown> = { [viz.x_key!]: r[viz.x_key!] }
      viz.y_keys!.forEach((y) => { out[y.label] = r[y.key] })
      return out
    })
  } else if (viz.type === 'pie_chart' && viz.name_key && viz.value_key) {
    headers = [viz.name_key, viz.value_key]
    rows = viz.data
  } else {
    // Generic: use first record's keys
    headers = Object.keys(viz.data[0])
    rows = viz.data
  }

  const sep = headers.map(() => '---')
  const fmtCell = (v: unknown) => {
    if (v == null) return ''
    const s = String(v)
    return s.replace(/\|/g, '\\|')   // escape pipes inside cells
  }

  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${sep.join(' | ')} |`,
    ...rows.map((r) => `| ${headers.map((h) => fmtCell(r[h])).join(' | ')} |`),
  ]
  if (viz.title) lines.unshift(`**${viz.title}**\n`)
  return lines.join('\n')
}

function CopyButton({ text, large = false }: { text: string; large?: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const sz = large ? 'h-3.5 w-3.5' : 'h-3 w-3'

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy response'}
      className={`flex items-center gap-1 text-[hsl(var(--sidebar-muted))] hover:text-[hsl(var(--sidebar-foreground))] transition-colors ${large ? 'text-xs' : 'text-[10px]'}`}
    >
      {copied
        ? <Check className={`${sz} text-[hsl(var(--sidebar-primary))]`} />
        : <Copy className={sz} />
      }
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

function Message({ msg, large = false, replyGraph, query }: {
  msg: ReturnType<typeof useAiChat>['messages'][number]
  large?: boolean
  replyGraph?: WorkflowGraphData
  query?: string   // preceding user message text (for assistant messages with a graph)
}) {
  const isUser = msg.role === 'user'
  const router = useRouter()
  const showWorkflow = isUser && isWorkflowQuery(msg.content)

  function handleExpandGraph(graph: WorkflowGraphData, q: string) {
    try {
      localStorage.setItem('daxor_inline_graph', JSON.stringify({ query: q, ...graph }))
    } catch { /* ignore */ }
    router.push(`/workflow?q=${encodeURIComponent(q)}&from=chat`)
  }

  return (
    <div className={`flex flex-col gap-0.5 w-full min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[96%] min-w-0 rounded-xl px-3 py-2 text-sm leading-relaxed ${
        isUser
          ? 'bg-[hsl(var(--sidebar-primary))] text-white rounded-br-sm shadow-sm'
          : 'bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-foreground))] rounded-bl-sm shadow-sm'
      }`}>
        {isUser ? (
          <p className={`${large ? 'text-sm' : 'text-[12px]'} break-words font-medium`}>{msg.content}</p>
        ) : (
          <>
            <div className={`prose prose-sm max-w-none leading-relaxed break-words overflow-hidden
              prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:my-2
              prose-headings:text-[13px] prose-strong:text-white
              prose-p:text-[hsl(var(--sidebar-foreground))]
              prose-li:text-[hsl(var(--sidebar-foreground))]
              prose-headings:text-[hsl(var(--sidebar-foreground))]
              prose-table:text-[10px] prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1
              prose-table:border-collapse prose-th:border prose-td:border prose-th:border-[hsl(var(--sidebar-border))] prose-td:border-[hsl(var(--sidebar-border))]
              ${large ? 'text-sm' : 'text-[12px]'}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
            {msg.visualization && <VisualizationView viz={msg.visualization} large={large} />}
            {msg.workflowGraph && (
              <WorkflowGraphView
                graph={msg.workflowGraph}
                large={large}
                onExpand={query ? () => handleExpandGraph(msg.workflowGraph!, query) : undefined}
              />
            )}
          </>
        )}
      </div>

      {!isUser && (
        <div className="px-1 flex items-center gap-3">
          <CopyButton
            text={msg.visualization
              ? `${msg.content}\n\n${vizToMarkdown(msg.visualization)}`
              : msg.content}
            large={large}
          />
          {msg.reasoning && <ReasoningReveal text={msg.reasoning} />}
          {msg.agentSteps && msg.agentSteps.length > 0 && (
            <AgentStepsView steps={msg.agentSteps} intent={msg.intent} />
          )}
          {msg.metadata?.success === false && (
            <span className="flex items-center gap-0.5 text-[10px] text-red-400">
              <AlertCircle className="h-2.5 w-2.5" /> failed
            </span>
          )}
        </div>
      )}

      {/* Workflow button on user messages — skip if the reply already shows the graph inline */}
      {showWorkflow && !replyGraph && (
        <button
          onClick={() => router.push(`/workflow?q=${encodeURIComponent(msg.content)}`)}
          className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--sidebar-primary))] hover:text-white bg-[hsl(var(--sidebar-primary))]/10 hover:bg-[hsl(var(--sidebar-primary))] border border-[hsl(var(--sidebar-primary))]/20 rounded-lg px-2.5 py-1 transition-all"
        >
          <GitBranch className="h-3 w-3" />
          View as Workflow Graph
        </button>
      )}

      <span className="text-[10px] text-[hsl(var(--sidebar-muted))] px-1">
        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── chat content ── */

function ChatContent({
  messages,
  loading,
  streaming,
  large = false,
}: {
  messages: ReturnType<typeof useAiChat>['messages']
  loading: boolean
  streaming: ReturnType<typeof useAiChat>['streaming']
  large?: boolean
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, streaming])

  return (
    <>
      <div className="space-y-4 w-full min-w-0">
        {messages.map((msg, i) => (
          <Message
            key={msg.id}
            msg={msg}
            large={large}
            replyGraph={msg.role === 'user' ? messages[i + 1]?.workflowGraph : undefined}
            query={msg.role === 'assistant' ? messages[i - 1]?.content : undefined}
          />
        ))}

        {/* Live streaming activity */}
        {loading && streaming && (
          <div className="flex items-start gap-2">
            <StreamingActivity
              status={streaming.status}
              steps={streaming.steps}
              currentTool={streaming.currentTool}
              reasoning={streaming.reasoning}
            />
          </div>
        )}

        {/* Plain spinner fallback (before first stream event) */}
        {loading && !streaming && (
          <div className="flex items-start gap-2">
            <div className="bg-white border border-gray-200 rounded-xl rounded-bl-sm px-3 py-2 shadow-sm flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
              <span className="text-xs text-gray-500">Connecting…</span>
            </div>
          </div>
        )}
      </div>
      <div ref={bottomRef} />
    </>
  )
}

/* ────────────────────────────────────────────────────────── modal ── */

function ChatModal({
  open,
  onClose,
  pageCtx,
  messages,
  loading,
  error,
  streaming,
  sendMessage,
  clearHistory,
  cancelRequest,
}: {
  open: boolean
  onClose: () => void
  pageCtx: { page: string; title: string }
  messages: ReturnType<typeof useAiChat>['messages']
  loading: boolean
  error: string | null
  streaming: ReturnType<typeof useAiChat>['streaming']
  sendMessage: ReturnType<typeof useAiChat>['sendMessage']
  clearHistory: ReturnType<typeof useAiChat>['clearHistory']
  cancelRequest: ReturnType<typeof useAiChat>['cancelRequest']
}) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Escape to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock body scroll while modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleSend = () => {
    if (!input.trim() || loading) return
    sendMessage(input, pageCtx)
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex flex-col w-[min(1000px,94vw)] h-[min(85vh,900px)] bg-[hsl(var(--sidebar-background))] rounded-2xl shadow-2xl overflow-hidden border border-[hsl(var(--sidebar-border))]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[hsl(var(--sidebar-background))] border-b border-[hsl(var(--sidebar-border))] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-grad-brand flex items-center justify-center shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold leading-none tracking-tight">Daxor AI Assistant</p>
              <p className="text-[11px] text-white/70 leading-none mt-1.5 uppercase tracking-widest font-medium">Context: {pageCtx.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={clearHistory} title="Clear chat" className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button onClick={onClose} title="Close (Esc)" className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-dotgrid">
          {messages.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-grad-brand elev-brand flex items-center justify-center animate-in zoom-in duration-500">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white tracking-tight">How can I help you today?</p>
                <p className="text-sm text-[hsl(var(--sidebar-muted))] max-w-md mx-auto leading-relaxed">
                  I can analyze your ERP data, generate visualizations, and help you automate complex workflows.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-4">
                {[
                  'How many accepted quotations?',
                  'Show top 5 vendors by purchase orders',
                  'Breakdown of sales orders by status',
                  'What is the total inventory value?',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); inputRef.current?.focus() }}
                    className="w-full text-left text-sm bg-[hsl(var(--sidebar-accent))]/50 border border-[hsl(var(--sidebar-border))] rounded-xl px-4 py-3 hover:border-[hsl(var(--sidebar-primary))] hover:bg-[hsl(var(--sidebar-accent))] transition-all text-[hsl(var(--sidebar-foreground))] group"
                  >
                    <span className="flex items-center justify-between">
                      {s}
                      <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[hsl(var(--sidebar-primary))]" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              <ChatContent messages={messages} loading={loading} streaming={streaming} large={true} />
            </div>
          )}
        </div>

        {/* Error bar */}
        {error && (
          <div className="mx-6 mb-2 text-sm text-red-200 bg-red-950/40 border border-red-900/50 rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" /> {error}
          </div>
        )}

        {/* Input */}
        <div className="px-6 pb-6 pt-3 shrink-0 border-t border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))]">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="relative flex-1 group">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about your data…"
                rows={2}
                className="w-full resize-none border border-[hsl(var(--sidebar-border))] rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-primary))]/50 focus:border-[hsl(var(--sidebar-primary))] placeholder:text-[hsl(var(--sidebar-muted))] bg-[hsl(var(--sidebar-accent))]/50 text-white transition-all"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                <span className="text-[10px] text-[hsl(var(--sidebar-muted))] font-mono">Shift + Enter for new line</span>
              </div>
            </div>
            {loading ? (
              <Button size="sm" variant="outline" onClick={cancelRequest}
                className="h-12 w-12 rounded-2xl p-0 shrink-0 border-rose-900/50 text-rose-500 hover:bg-rose-500/10 transition-colors">
                <X className="h-5 w-5" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleSend} disabled={!input.trim()}
                className="h-12 w-12 rounded-2xl p-0 shrink-0 bg-grad-brand hover:brightness-110 text-white shadow-lg elev-brand transition-all active:scale-95 disabled:opacity-50 disabled:grayscale">
                <Send className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ───────────────────────────────────────────────────────── main pane ── */

export function AiPane() {
  const { user }    = useAuth()
  const pathname    = usePathname()
  const { isOpen: open, setIsOpen: setOpen } = useAiPane()
  const [modalOpen, setModalOpen] = useState(false)
  const [input, setInput]         = useState('')
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLTextAreaElement>(null)

  const userId  = user?.id ?? ''
  const orgId   = user?.organizationId ?? ''
  const pageCtx = getPageContext(pathname ?? '')

  const { messages, loading, error, streaming, sendMessage, clearHistory, cancelRequest } = useAiChat(userId, orgId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, streaming])

  const handleSend = () => {
    if (!input.trim() || loading) return
    sendMessage(input, pageCtx)
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 px-2 py-5 rounded-l-2xl shadow-2xl hover:brightness-110 transition-all border border-white/10 group duration-300 ease-in-out",
          open ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
        )}
      >
        <div className="bg-white/20 p-1.5 rounded-lg mb-1 group-hover:scale-110 transition-transform">
          <Bot className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          AI Assistant
        </span>
        <ChevronLeft className="h-4 w-4 mt-1 opacity-70 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* ── Sidebar pane ── */}
      <div className={cn(
        "absolute inset-y-0 right-0 z-40 flex flex-col h-full w-80 border-l border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] shadow-2xl transition-all duration-300 ease-in-out overflow-hidden",
        open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[13px] font-bold leading-none tracking-tight">Daxor AI</p>
              <p className="text-[10px] text-white/70 leading-none mt-1 font-medium">{pageCtx.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setModalOpen(true)}
              title="Open in full window"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Maximize2 className="h-4 w-4 text-white/80 hover:text-white" />
            </button>
            {messages.length > 0 && (
              <button onClick={clearHistory} title="Clear chat" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <Trash2 className="h-4 w-4 text-white/80 hover:text-white" />
              </button>
            )}
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Collapse">
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 w-full min-w-0 bg-dotgrid/30">
          {messages.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-2">
              <div className="w-14 h-14 rounded-2xl bg-grad-brand elev-brand flex items-center justify-center animate-in zoom-in duration-500">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white tracking-tight">AI Insights</p>
                <p className="text-[12px] text-[hsl(var(--sidebar-muted))] leading-relaxed">
                  I can analyze your ERP data and automate complex workflows.
                </p>
              </div>
              <div className="space-y-2 w-full mt-2">
                {[
                  'How many accepted quotations?',
                  'Show top 5 vendors',
                  'Sales orders by status',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); inputRef.current?.focus() }}
                    className="w-full text-left text-[11.5px] bg-[hsl(var(--sidebar-accent))]/40 border border-[hsl(var(--sidebar-border))] rounded-xl px-3 py-2.5 hover:border-[hsl(var(--sidebar-primary))] hover:bg-[hsl(var(--sidebar-accent))] transition-all text-[hsl(var(--sidebar-foreground))] group"
                  >
                    <span className="flex items-center justify-between">
                      {s}
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[hsl(var(--sidebar-primary))]" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ChatContent messages={messages} loading={loading} streaming={streaming} />
          )}
        </div>

        {/* Error bar */}
        {error && (
          <div className="mx-4 mb-2 text-[11px] text-red-200 bg-red-950/40 border border-red-900/50 rounded-xl px-3 py-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" /> {error}
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-2 shrink-0 border-t border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] shadow-[0_-4px_12px_-8px_black]">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything…"
              rows={2}
              className="flex-1 resize-none border border-[hsl(var(--sidebar-border))] rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-primary))]/50 focus:border-[hsl(var(--sidebar-primary))] placeholder:text-[hsl(var(--sidebar-muted))] bg-[hsl(var(--sidebar-accent))]/50 text-white transition-all shadow-inner"
            />
            {loading ? (
              <Button size="sm" variant="outline" onClick={cancelRequest}
                className="h-10 w-10 p-0 shrink-0 border-rose-900/50 text-rose-500 hover:bg-rose-500/10 rounded-xl">
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleSend} disabled={!input.trim()}
                className="h-10 w-10 p-0 shrink-0 bg-grad-brand hover:brightness-110 text-white shadow-lg rounded-xl transition-all active:scale-95">
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-[10px] text-[hsl(var(--sidebar-muted))] mt-2 font-medium px-1 opacity-70">Enter to send</p>
        </div>
      </div>

      {/* ── Modal popup ── */}
      <ChatModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        pageCtx={pageCtx}
        messages={messages}
        loading={loading}
        error={error}
        streaming={streaming}
        sendMessage={sendMessage}
        clearHistory={clearHistory}
        cancelRequest={cancelRequest}
      />
    </>
  )
}
