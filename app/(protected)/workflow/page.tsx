'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  Loader2, GitBranch, ArrowLeft,
  Package, DollarSign, FileText, CreditCard, BarChart2, AlertCircle,
} from 'lucide-react'
import type { WorkflowNode, WorkflowEdge } from '@/components/workflow/WorkflowGraph'
import { formatMoneyCompact } from '@/lib/format-money'

const WorkflowGraph = dynamic(
  () => import('@/components/workflow/WorkflowGraph').then((m) => ({ default: m.WorkflowGraph })),
  { ssr: false, loading: () => <GraphSkeleton /> },
)

interface WorkflowResponse {
  success: boolean
  workflow_type: string
  entity_type: string
  entity_name: string
  title: string
  summary: Record<string, number>
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  error?: string
}

/* ── Stat card ──────────────────────────────────────────────────────────── */

const STAT_ICONS: Record<string, React.ElementType> = {
  // Dedicated endpoint keys
  total_pos:          Package,
  total_bills:        FileText,
  total_payments:     CreditCard,
  po_value:           DollarSign,
  billed_amount:      DollarSign,
  paid_amount:        DollarSign,
  outstanding_amount: AlertCircle,
  total_orders:       Package,
  total_invoices:     FileText,
  // Node-type keys from inline graph path
  vendor:             Package,
  customer:           Package,
  product:            Package,
  purchaseorder:      FileText,
  salesorder:         FileText,
  bill:               FileText,
  invoice:            FileText,
  payment:            CreditCard,
  inventory:          BarChart2,
  quotation:          FileText,
  project:            BarChart2,
  workorder:          BarChart2,
  employee:           BarChart2,
}

const STAT_LABELS: Record<string, string> = {
  // Dedicated endpoint keys
  total_pos:          'Purchase Orders',
  total_bills:        'Bills',
  total_payments:     'Payments',
  po_value:           'PO Value',
  billed_amount:      'Total Billed',
  paid_amount:        'Paid',
  outstanding_amount: 'Outstanding',
  total_orders:       'Sales Orders',
  total_invoices:     'Invoices',
  // Node-type keys from inline graph path
  vendor:             'Vendors',
  customer:           'Customers',
  product:            'Products',
  purchaseorder:      'Purchase Orders',
  salesorder:         'Sales Orders',
  bill:               'Bills',
  invoice:            'Invoices',
  payment:            'Payments',
  inventory:          'Inventory Items',
  quotation:          'Quotations',
  project:            'Projects',
  workorder:          'Work Orders',
  employee:           'Employees',
}

function StatCard({ k, v }: { k: string; v: number }) {
  const Icon = STAT_ICONS[k] ?? BarChart2
  const isMoney = k.includes('amount') || k.includes('value')
  const isAlert = k === 'outstanding_amount'
  const label = STAT_LABELS[k] ?? k.replace(/_/g, ' ')
  const display = isMoney ? formatMoneyCompact(v) : v.toLocaleString()

  return (
    <div className={`rounded-lg border p-3 flex items-center gap-3 shadow-sm ${
      isAlert && v > 0
        ? 'bg-orange-50 border-orange-200'
        : 'bg-white border-gray-200'
    }`}>
      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
        isAlert && v > 0 ? 'bg-orange-100' : 'bg-primary/10'
      }`}>
        <Icon className={`h-4 w-4 ${isAlert && v > 0 ? 'text-orange-500' : 'text-primary'}`} />
      </div>
      <div>
        <p className="text-[11px] text-gray-400">{label}</p>
        <p className={`text-sm font-bold ${isAlert && v > 0 ? 'text-orange-600' : 'text-gray-800'}`}>
          {display}
        </p>
      </div>
    </div>
  )
}

function GraphSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

/* ── Inner page ─────────────────────────────────────────────────────────── */

function WorkflowPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') ?? ''

  const [data, setData] = useState<WorkflowResponse | null>(null)
  const consumedRef = useRef(false)

  useEffect(() => {
    if (!query) return
    // Guard against React StrictMode double-invocation
    if (consumedRef.current) return
    consumedRef.current = true

    try {
      const stored = localStorage.getItem('daxor_inline_graph')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.nodes?.length) {
          localStorage.removeItem('daxor_inline_graph')
          setData({
            success: true,
            workflow_type: 'product',
            entity_type: 'entity',
            entity_name: parsed.title ?? query,
            title: parsed.title ?? query,
            summary: parsed.summary ?? {},
            nodes: parsed.nodes,
            edges: parsed.edges,
          })
        }
      }
    } catch { /* ignore */ }
  }, [query])

  const summaryEntries = data
    ? Object.entries(data.summary).filter(([, v]) => v !== 0)
    : []

  return (
    <div className="flex flex-col h-full bg-gray-50 text-foreground">

      {/* Header */}
      <div className="shrink-0 border-b border-gray-200 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <GitBranch className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Workflow Graph</span>
          {data && (
            <>
              <span className="text-sm text-gray-500 truncate max-w-lg">— {data.title}</span>
              <span className="ml-2 text-xs text-gray-400">{data.nodes.length} nodes · {data.edges.length} edges</span>
            </>
          )}
          {query && !data && (
            <span className="text-sm text-gray-400 truncate max-w-lg">— "{query}"</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 flex flex-col">

        {/* No data — prompt to use chat */}
        {!data && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
            <GitBranch className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-700">No workflow loaded</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Ask the AI assistant a relational question — e.g. "show me the workflow for vendor Steel Corp" — then click the graph card to open it here.
            </p>
          </div>
        )}

        {/* Result */}
        {data && (
          <>
            {summaryEntries.length > 0 && (
              <div className="shrink-0 px-5 py-3 border-b border-gray-200 bg-white overflow-x-auto">
                <div className="flex gap-3 min-w-max">
                  {summaryEntries.map(([k, v]) => (
                    <StatCard key={k} k={k} v={v} />
                  ))}
                </div>
              </div>
            )}

            {data.nodes.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                No records found for&nbsp;<span className="text-gray-800 font-medium">"{data.entity_name}"</span>
              </div>
            )}

            {data.nodes.length > 0 && (
              <div className="flex-1 min-h-0">
                <WorkflowGraph nodes={data.nodes} edges={data.edges} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function WorkflowPage() {
  return (
    <Suspense fallback={<GraphSkeleton />}>
      <WorkflowPageInner />
    </Suspense>
  )
}
