'use client'

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react'
import { Send, Bot, User, Loader2, Sparkles, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { formatMoney } from '@/lib/format-money'

/**
 * PaginatedTable — renders a markdown table with:
 *   - horizontal scroll scoped to the table only (the bubble itself doesn't scroll)
 *   - client-side pagination at PAGE_SIZE rows per page
 *
 * react-markdown calls this with the parsed <table> children (a <thead> + a <tbody>),
 * and we re-render them while slicing the tbody's <tr> list.
 */
function PaginatedTable({ children }: { children?: ReactNode }) {
  return (
    <div className="my-2 not-prose border border-border rounded-md overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs [&_th]:bg-secondary [&_th]:text-foreground [&_th]:font-semibold [&_th]:text-left [&_th]:px-2.5 [&_th]:py-1.5 [&_th]:whitespace-nowrap [&_th]:border-b [&_th]:border-border [&_td]:px-2.5 [&_td]:py-1.5 [&_td]:border-b [&_td]:border-border [&_td]:text-foreground [&_td]:whitespace-nowrap [&_tr:last-child_td]:border-b-0">
          {children}
        </table>
      </div>
    </div>
  )
}

const AI_BASE = process.env.NEXT_PUBLIC_AI_URL || 'http://13.206.39.63:8002'

export interface AgentConfig {
  name: string
  role: string
  description: string
  color: string          // tailwind bg color class for accent
  colorHex: string       // hex for inline styles
  suggestions: string[]
  contextPrefix: string  // prepended to every query so the backend knows the domain
  // Backend module key — payroll, sales, inventory, etc. When set, the
  // ai-backend skips keyword routing and uses the matching module agent.
  module?: string
}

interface ToolStep {
  tool: string
  inputSummary?: string
  result?: string
}

interface VizColumn { key: string; label: string }
interface VizTable {
  type: 'table'
  title?: string
  columns: VizColumn[]
  data: Record<string, any>[]
  total?: number
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
  status?: string             // current "Thinking… step N" line
  steps?: ToolStep[]          // tool calls observed during this answer
  visualizations?: VizTable[] // ALL structured tables — one per tool result
}

// Human-friendly column labels for known keys
const COLUMN_LABELS: Record<string, string> = {
  item_name: 'Item',
  product_name: 'Product',
  warehouse: 'Warehouse',
  quantity: 'Qty',
  reorder_point: 'Reorder Point',
  units_to_reorder: 'Units to Reorder',
  stock_status: 'Status',
  status: 'Status',
  totalAmount: 'Total',
  paidAmount: 'Paid',
  dueDate: 'Due Date',
  invoiceDate: 'Invoice Date',
  orderDate: 'Order Date',
  customerName: 'Customer',
  vendorName: 'Vendor',
  seqNo: 'No.',
  invoiceNumber: 'Invoice #',
  billNumber: 'Bill #',
  salesOrderNumber: 'SO #',
}

const NUMERIC_KEYS = new Set([
  'quantity', 'reorder_point', 'units_to_reorder', 'available', 'reserved',
  'totalAmount', 'subtotal', 'taxAmount', 'paidAmount', 'outstandingAmount',
  'amount', 'price', 'qty', 'lineTotal', 'unitPrice',
])

const MONEY_KEYS = new Set([
  'totalAmount', 'subtotal', 'taxAmount', 'paidAmount', 'outstandingAmount',
  'amount', 'price', 'lineTotal', 'unitPrice',
])

function StatusPill({ value }: { value: string }) {
  const v = String(value || '').toUpperCase()
  const color =
    v === 'OUT_OF_STOCK' || v === 'OVERDUE' || v === 'REJECTED' || v === 'CANCELLED'
      ? 'bg-red-50 text-red-700 ring-red-200'
      : v === 'LOW_STOCK' || v === 'DRAFT' || v === 'PARTIALLY_PAID' || v === 'PENDING_REVIEW'
      ? 'bg-amber-50 text-amber-700 ring-amber-200'
      : v === 'IN_STOCK' || v === 'PAID' || v === 'APPROVED' || v === 'COMPLETED' || v === 'ACTIVE'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : v === 'PROCESSED' || v === 'SENT' || v === 'SUBMITTED' || v === 'ACCEPTED'
      ? 'bg-blue-50 text-blue-700 ring-blue-200'
      : 'bg-gray-50 text-gray-700 ring-gray-200'
  const label = v.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ring-1 ring-inset ${color}`}>
      {label}
    </span>
  )
}

const PAGE_SIZE_VIZ = 25

function VisualizationTable({ viz, colorHex }: { viz: VizTable; colorHex: string }) {
  const [page, setPage] = useState(0)
  const total = viz.total ?? viz.data.length
  const totalPages = Math.max(1, Math.ceil(viz.data.length / PAGE_SIZE_VIZ))
  const safePage = Math.min(page, totalPages - 1)
  const rows = viz.data.slice(safePage * PAGE_SIZE_VIZ, safePage * PAGE_SIZE_VIZ + PAGE_SIZE_VIZ)
  const hasStatusColumn = viz.columns.some(c => c.key === 'stock_status' || c.key === 'status')

  const renderCell = (col: VizColumn, row: Record<string, any>) => {
    const v = row[col.key]
    if (v == null || v === '') return <span className="text-gray-300">—</span>
    if (col.key === 'stock_status' || col.key === 'status') return <StatusPill value={v} />
    if (MONEY_KEYS.has(col.key) && typeof v === 'number') {
      return <span className="tabular-nums">{formatMoney(v)}</span>
    }
    if (NUMERIC_KEYS.has(col.key) && typeof v === 'number') {
      return <span className="tabular-nums">{v.toLocaleString()}</span>
    }
    if (typeof v === 'object') return <span className="text-gray-400">{JSON.stringify(v).slice(0, 40)}</span>
    return String(v)
  }

  const showPager = viz.data.length > PAGE_SIZE_VIZ
  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide truncate">
          {viz.title ?? 'Results'}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-gray-400 whitespace-nowrap">
            {viz.data.length < total
              ? `${viz.data.length.toLocaleString()} of ${total.toLocaleString()} rows`
              : `${total.toLocaleString()} ${total === 1 ? 'row' : 'rows'}`}
          </span>
          {showPager && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={safePage === 0}
                aria-label="Previous page"
                className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:text-gray-800 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="text-[11px] text-gray-600 font-medium tabular-nums min-w-[3.5rem] text-center">
                {safePage + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={safePage >= totalPages - 1}
                aria-label="Next page"
                className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:text-gray-800 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-200">
              {viz.columns.map(c => (
                <th
                  key={c.key}
                  className={`px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap ${
                    NUMERIC_KEYS.has(c.key) ? 'text-right' : ''
                  }`}
                >
                  {COLUMN_LABELS[c.key] ?? c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                {viz.columns.map(c => (
                  <td
                    key={c.key}
                    className={`px-3 py-2 whitespace-nowrap text-gray-700 ${
                      NUMERIC_KEYS.has(c.key) ? 'text-right tabular-nums' : ''
                    } ${hasStatusColumn && c.key === viz.columns[0].key ? 'font-medium text-gray-900' : ''}`}
                  >
                    {renderCell(c, r)}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={viz.columns.length} className="px-3 py-6 text-center text-gray-400">No rows</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {viz.data.length > PAGE_SIZE_VIZ && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-gray-50 text-[11px]">
          <span className="text-gray-500">
            Showing <span className="font-medium text-gray-700">{safePage * PAGE_SIZE_VIZ + 1}</span>
            –<span className="font-medium text-gray-700">{Math.min((safePage + 1) * PAGE_SIZE_VIZ, viz.data.length)}</span>
            {' '}of <span className="font-medium text-gray-700">{viz.data.length.toLocaleString()}</span>
            {total > viz.data.length && <span className="text-gray-400"> (of {total.toLocaleString()} total)</span>}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(0)}
              disabled={safePage === 0}
              className="px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[11px]"
            >
              First
            </button>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-0.5"
            >
              <ChevronLeft className="h-3 w-3" /> Prev
            </button>
            <span className="text-gray-600 px-2 font-medium">{safePage + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-0.5"
            >
              Next <ChevronRight className="h-3 w-3" />
            </button>
            <button
              onClick={() => setPage(totalPages - 1)}
              disabled={safePage >= totalPages - 1}
              className="px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[11px]"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 0.18}s` }}
          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
        />
      ))}
    </span>
  )
}

function MessageBubble({ msg, colorHex }: { msg: Message; colorHex: string }) {
  const isUser = msg.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5"
        style={{ backgroundColor: isUser ? '#e5e7eb' : colorHex + '20', border: `1.5px solid ${isUser ? '#d1d5db' : colorHex + '40'}` }}
      >
        {isUser
          ? <User className="h-3.5 w-3.5 text-gray-500" />
          : <Bot className="h-3.5 w-3.5" style={{ color: colorHex }} />
        }
      </div>

      {/* Bubble */}
      <div
        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-gray-900 text-white rounded-tr-sm max-w-[75%]'
            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm max-w-[92%] min-w-0 flex-1'
        }`}
      >
        {/* Tool-call timeline (live during streaming, persisted after) */}
        {!isUser && msg.steps && msg.steps.length > 0 && (
          <div className="mb-2 pb-2 border-b border-gray-100 space-y-1">
            {msg.steps.map((s, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500">
                <span className="text-gray-400 mt-0.5">↳</span>
                <span className="font-mono">
                  <span className="text-gray-700 font-medium">{s.tool}</span>
                  {s.inputSummary ? <span className="text-gray-400">({s.inputSummary})</span> : null}
                </span>
              </div>
            ))}
          </div>
        )}
        {!isUser && msg.loading && msg.status && (
          <div className="text-[11px] text-gray-400 italic mb-1">{msg.status}</div>
        )}
        {msg.loading && !msg.content && !(msg.visualizations && msg.visualizations.length) ? <TypingDots /> : (
          isUser ? (
            <span className="whitespace-pre-wrap">{msg.content}</span>
          ) : (
            <div className="prose prose-sm max-w-none min-w-0 prose-headings:font-semibold prose-headings:text-gray-900 prose-p:my-1.5 prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0 prose-th:bg-gray-50 prose-th:px-2.5 prose-th:py-1.5 prose-th:text-left prose-th:font-semibold prose-th:text-gray-600 prose-th:text-xs prose-th:whitespace-nowrap prose-td:px-2.5 prose-td:py-1.5 prose-td:border-t prose-td:border-gray-100 prose-td:text-xs prose-td:whitespace-nowrap prose-code:px-1 prose-code:py-0.5 prose-code:bg-gray-100 prose-code:rounded prose-code:text-[11px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{ table: PaginatedTable }}
              >
                {msg.content}
              </ReactMarkdown>
              {msg.visualizations?.map((viz, i) => (
                <VisualizationTable key={i} viz={viz} colorHex={colorHex} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}

// localStorage key per agent module so each agent keeps its own thread
const storageKey = (module: string | undefined) =>
  `daxor.aiChat.${module ?? 'default'}.v1`

// Max messages kept in storage — keeps localStorage well under quota
const MAX_PERSISTED_MESSAGES = 50

function loadMessages(module: string | undefined): Message[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(storageKey(module))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Strip any leftover loading flags / transient state
    return parsed
      .filter((m: any) => m && m.id && m.role && typeof m.content === 'string')
      .map((m: any) => ({ ...m, loading: false }))
  } catch {
    return []
  }
}

function saveMessages(module: string | undefined, messages: Message[]) {
  if (typeof window === 'undefined') return
  try {
    // Don't persist mid-stream loading messages
    const persistable = messages.filter(m => !m.loading)
    const trimmed = persistable.slice(-MAX_PERSISTED_MESSAGES)
    window.localStorage.setItem(storageKey(module), JSON.stringify(trimmed))
  } catch {
    // Quota or serialization error — silent
  }
}

export function AgentChat({ config }: { config: AgentConfig }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Hydrate from localStorage on first mount per agent module
  useEffect(() => {
    setMessages(loadMessages(config.module))
    // We deliberately depend on config.module so switching agents loads
    // that agent's thread.
  }, [config.module])

  // Persist on every message change
  useEffect(() => {
    saveMessages(config.module, messages)
  }, [config.module, messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed }
    const loadingMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', loading: true }

    setMessages(prev => [...prev, userMsg, loadingMsg])
    setInput('')
    setBusy(true)

    // The backend uses the `module` parameter to load the right persona into
    // the (cached) system prompt — no need to also prepend it inline here,
    // which would duplicate the text uncached on every turn.
    const enriched = trimmed
    let accumulated = ''
    const collectedSteps: ToolStep[] = []
    const collectedVizs: VizTable[] = []

    // Build conversation history from the last 6 visible turns so the agent
    // can answer follow-ups ("show me the next 25", "what about by warehouse?")
    const conversationHistory = messages
      .filter(m => !m.loading && m.content)
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch(`${AI_BASE}/api/ai/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: enriched,
          display_query: trimmed,
          module: config.module,
          conversation_history: conversationHistory,
        }),
      })

      if (!res.ok || !res.body) throw new Error(`Server error ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Split on newlines; the last (possibly partial) line stays in the buffer
        // until the next chunk completes it. This is what previously caused the
        // tail of long answers (markdown tables) to be dropped.
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (!payload) continue
          try {
            const event = JSON.parse(payload)
            if (event.type === 'token') {
              accumulated += event.content
              setMessages(prev => prev.map(m =>
                m.id === loadingMsg.id ? { ...m, content: accumulated, loading: false, steps: collectedSteps } : m
              ))
            } else if (event.type === 'answer') {
              accumulated = event.content
              setMessages(prev => prev.map(m =>
                m.id === loadingMsg.id ? { ...m, content: accumulated, loading: false, status: undefined, steps: collectedSteps } : m
              ))
            } else if (event.type === 'status') {
              setMessages(prev => prev.map(m =>
                m.id === loadingMsg.id ? { ...m, status: event.content } : m
              ))
            } else if (event.type === 'tool_call') {
              collectedSteps.push({ tool: event.tool, inputSummary: event.input_summary })
              setMessages(prev => prev.map(m =>
                m.id === loadingMsg.id ? { ...m, steps: [...collectedSteps] } : m
              ))
            } else if (event.type === 'tool_result') {
              if (collectedSteps.length > 0) {
                collectedSteps[collectedSteps.length - 1].result = event.content
              }
            } else if (event.type === 'visualization') {
              const viz = event.data
              console.log('[AgentChat] visualization received:', viz?.type, viz?.data?.length, 'rows')
              if (viz && viz.type === 'table') {
                collectedVizs.push(viz)
                setMessages(prev => prev.map(m =>
                  m.id === loadingMsg.id ? { ...m, visualizations: [...collectedVizs], loading: false } : m
                ))
              }
            } else if (event.type === 'error') {
              accumulated = `Error: ${event.content}`
              setMessages(prev => prev.map(m =>
                m.id === loadingMsg.id ? { ...m, content: accumulated, loading: false, steps: collectedSteps } : m
              ))
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Something went wrong'
      setMessages(prev => prev.map(m =>
        m.id === loadingMsg.id ? { ...m, content: `Error: ${errMsg}`, loading: false } : m
      ))
    } finally {
      setBusy(false)
    }
  }, [busy, config.contextPrefix, config.module, messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full bg-background">

      {/* Header */}
      <div className="shrink-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: config.colorHex + '15', border: `1.5px solid ${config.colorHex}30` }}
          >
            <Bot className="h-5 w-5" style={{ color: config.colorHex }} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">{config.name}</h1>
            <p className="text-xs text-muted-foreground">{config.role}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Messages / Empty state */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 max-w-lg mx-auto text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: config.colorHex + '12', border: `1.5px solid ${config.colorHex}25` }}
            >
              <Sparkles className="h-6 w-6" style={{ color: config.colorHex }} />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{config.description}</p>
              <p className="text-sm text-muted-foreground mt-1">Ask anything or pick a suggestion below.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {config.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left px-4 py-3 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-sm text-xs text-muted-foreground hover:text-foreground transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-5">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} colorHex={config.colorHex} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 bg-card border-t border-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${config.name}…`}
              rows={1}
              className="w-full resize-none rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ maxHeight: 120, overflowY: 'auto', focusRingColor: config.colorHex } as React.CSSProperties}
              disabled={busy}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || busy}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: config.colorHex }}
          >
            {busy
              ? <Loader2 className="h-4 w-4 text-white animate-spin" />
              : <Send className="h-4 w-4 text-white" />
            }
          </button>
        </div>
        <p className="max-w-2xl mx-auto mt-2 text-[11px] text-muted-foreground text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

    </div>
  )
}
