'use client'

import { useState, useRef } from 'react'
import {
  Sparkles, Check, X, Trash2, Loader2, AlertCircle,
  BarChart2, TrendingUp, PieChart, Target, Layers, Table2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWidgetBuilder, type SavedWidget } from '@/hooks/useWidgetBuilder'
import { WidgetRenderer } from './WidgetRenderer'

const SUGGESTIONS = [
  'Top 8 products by price as a bar chart',
  'Warehouse utilization as a donut chart',
  'Order status distribution as a pie chart',
  'Inventory stock vs reorder level (multi-series bar)',
  'Revenue trend over time as a line chart',
  'Supplier ratings comparison as a bar chart',
]

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'table':       <Table2 className="h-3.5 w-3.5" />,
  'chart-bar':   <BarChart2 className="h-3.5 w-3.5" />,
  'chart-line':  <TrendingUp className="h-3.5 w-3.5" />,
  'chart-area':  <TrendingUp className="h-3.5 w-3.5" />,
  'chart-pie':   <PieChart className="h-3.5 w-3.5" />,
  'chart-donut': <PieChart className="h-3.5 w-3.5" />,
  'chart-radar': <Layers className="h-3.5 w-3.5" />,
  'kpi':         <Target className="h-3.5 w-3.5" />,
}

/* ── Saved widget card ───────────────────────────────────────────────────── */
function WidgetCard({ saved, onDelete }: { saved: SavedWidget; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-gray-400">{TYPE_ICONS[saved.widget.type] ?? <BarChart2 className="h-3.5 w-3.5" />}</span>
          <p className="text-sm font-semibold text-gray-700 truncate">{saved.widget.title}</p>
        </div>
        <button
          onClick={onDelete}
          className="ml-2 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
          title="Remove widget"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1 px-2 py-2 min-h-0">
        <WidgetRenderer widget={saved.widget} />
      </div>

      {/* Prompt footer */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/60">
        <p className="text-[11px] text-gray-400 italic truncate">"{saved.prompt}"</p>
      </div>
    </div>
  )
}

/* ── Main panel ─────────────────────────────────────────────────────────── */
interface WidgetBuilderPanelProps {
  userId: string
  orgId: string
  page: string
}

export function WidgetBuilderPanel({ userId, orgId, page }: WidgetBuilderPanelProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    loading, preview, error, currentPrompt,
    savedWidgets, generate, approve, discard, deleteWidget,
  } = useWidgetBuilder(userId, orgId, page)

  const handleGenerate = () => {
    if (input.trim()) generate(input)
  }

  const handleSuggestion = (s: string) => {
    setInput(s)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Builder prompt bar ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-gray-700">AI Widget Builder</h2>
          <span className="ml-auto text-xs text-gray-400">Powered by Gemini</span>
        </div>

        {/* Input row */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder='Describe the chart you want — e.g. "Top 5 products by price as a bar chart"'
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            disabled={loading}
          />
          <Button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Generating…' : 'Generate'}
          </Button>
        </div>

        {/* Suggestions */}
        {!loading && !preview && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-4 flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
            <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-primary">Building your widget…</p>
              <p className="text-xs text-primary mt-0.5">
                AI is querying your data and selecting the best chart type
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-700">Generation failed</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
            <button onClick={discard} className="text-red-400 hover:text-red-600 p-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Preview state */}
        {preview && !loading && (
          <div className="mt-4 border border-primary/20 rounded-xl overflow-hidden bg-primary/10/30">
            {/* Preview header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border-b border-primary/15">
              <div className="flex items-center gap-2">
                <span className="text-primary">{TYPE_ICONS[preview.type] ?? <BarChart2 className="h-3.5 w-3.5" />}</span>
                <p className="text-sm font-semibold text-primary">{preview.title}</p>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Preview</span>
              </div>
              <p className="text-xs text-primary hidden sm:block">
                "{currentPrompt}"
              </p>
            </div>

            {/* Chart preview */}
            <div className="bg-white px-3 py-3">
              <WidgetRenderer widget={preview} />
            </div>

            {/* Approve / Discard */}
            <div className="flex items-center justify-end gap-3 px-4 py-3 bg-primary/10 border-t border-primary/15">
              <button
                onClick={discard}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300 bg-white rounded-lg transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Discard
              </button>
              <button
                onClick={approve}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
              >
                <Check className="h-3.5 w-3.5" />
                Approve &amp; Add to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Saved widgets gallery ──────────────────────────────────────── */}
      {savedWidgets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-600">
              My Widgets
              <span className="ml-2 text-xs font-normal text-gray-400">
                {savedWidgets.length} {savedWidgets.length === 1 ? 'widget' : 'widgets'}
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {savedWidgets.map((saved) => (
              <WidgetCard
                key={saved.id}
                saved={saved}
                onDelete={() => deleteWidget(saved.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {savedWidgets.length === 0 && !preview && !loading && (
        <div className="text-center py-12 text-gray-400">
          <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No widgets yet. Describe a chart above to get started.</p>
        </div>
      )}
    </div>
  )
}
