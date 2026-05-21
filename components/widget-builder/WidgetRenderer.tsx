'use client'

import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { Widget, WidgetData } from '@/hooks/useWidgetBuilder'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16']
const TICK = { fontSize: 10, fill: '#6b7280' }
const TIP  = { fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }

/** Truncate x-axis labels based on bar count */
function xFmt(v: unknown, count: number): string {
  const s = String(v ?? '')
  const max = count > 10 ? 8 : count > 6 ? 11 : 14
  return s.length > max ? s.slice(0, max) + '…' : s
}

function fmt(v: unknown): string {
  if (v == null) return '—'
  if (typeof v === 'number') return v.toLocaleString()
  return String(v)
}

/* ── Table ───────────────────────────────────────────────────────────────── */
function TableWidget({ data }: { data: WidgetData }) {
  const [page, setPage] = useState(0)
  const PAGE_SIZE  = 8
  const rows       = data.rows ?? []
  const columns    = data.columns ?? (rows[0] ? Object.keys(rows[0]).map((k) => ({ key: k, label: k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) })) : [])
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pageRows   = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const from = page * PAGE_SIZE + 1
  const to   = Math.min((page + 1) * PAGE_SIZE, rows.length)

  if (!rows.length) return (
    <div className="flex items-center justify-center h-32 text-sm text-gray-400">No data</div>
  )

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="text-xs w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.key} className="px-2.5 py-2 text-left font-semibold text-gray-500 whitespace-nowrap">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-blue-50/30 transition-colors`}>
                {columns.map((col) => (
                  <td key={col.key} className="px-2.5 py-1.5 text-gray-700 whitespace-nowrap">
                    {fmt(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-100 bg-gray-50 text-[11px]">
        <span className="text-gray-400">{from}–{to} of {rows.length}</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              className="px-2 py-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">‹</button>
            <span className="text-gray-500 px-1">{page + 1}/{totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              className="px-2 py-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">›</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── KPI ─────────────────────────────────────────────────────────────────── */
function KpiWidget({ data }: { data: WidgetData }) {
  const raw = data.value
  const display =
    typeof raw === 'number'
      ? (data.prefix ?? '') + raw.toLocaleString() + (data.suffix ?? '')
      : (data.prefix ?? '') + String(raw ?? '—') + (data.suffix ?? '')

  return (
    <div className="flex flex-col items-center justify-center h-full py-6 gap-1">
      <p className="text-4xl font-bold text-gray-800 tracking-tight">{display}</p>
      {data.label && <p className="text-sm text-gray-500">{data.label}</p>}
      {data.change != null && (
        <p className={`text-xs font-medium mt-1 ${data.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {data.change >= 0 ? '↑' : '↓'} {Math.abs(data.change)}%
        </p>
      )}
    </div>
  )
}

/* ── Bar (single + multi-series) ─────────────────────────────────────────── */
function BarWidget({ data }: { data: WidgetData }) {
  const rows = data.chartData ?? []
  const rotated = rows.length > 5
  const bottomMargin = rows.length > 10 ? 72 : rows.length > 5 ? 56 : 8

  if (data.multiSeries && data.series?.length) {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={rows} margin={{ top: 4, right: 8, left: -10, bottom: bottomMargin }}>
          <XAxis dataKey={data.xAxisKey ?? 'name'} tick={TICK} tickLine={false} axisLine={false}
            interval={0} angle={rotated ? -45 : 0} textAnchor={rotated ? 'end' : 'middle'}
            tickFormatter={(v) => xFmt(v, rows.length)} height={rotated ? 60 : 20} />
          <YAxis tick={TICK} tickLine={false} axisLine={false} width={40} />
          <Tooltip contentStyle={TIP} formatter={(v) => [fmt(v)]} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          {data.series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} fill={s.color ?? COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} margin={{ top: 4, right: 8, left: -10, bottom: bottomMargin }}>
        <XAxis dataKey={data.xAxisKey ?? 'name'} tick={TICK} tickLine={false} axisLine={false}
          interval={0} angle={rotated ? -45 : 0} textAnchor={rotated ? 'end' : 'middle'}
          tickFormatter={(v) => xFmt(v, rows.length)} height={rotated ? 60 : 20} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={40} />
        <Tooltip contentStyle={TIP} formatter={(v) => [fmt(v)]} />
        <Bar dataKey={data.dataKey ?? 'value'} fill={data.color ?? COLORS[0]} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ── Line ────────────────────────────────────────────────────────────────── */
function LineWidget({ data }: { data: WidgetData }) {
  const rows = data.chartData ?? []
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={rows} margin={{ top: 4, right: 8, left: -10, bottom: rows.length > 5 ? 56 : 8 }}>
        <XAxis dataKey={data.xAxisKey ?? 'name'} tick={TICK} tickLine={false} axisLine={false}
          interval={0} angle={rows.length > 5 ? -45 : 0} textAnchor={rows.length > 5 ? 'end' : 'middle'}
          tickFormatter={(v) => xFmt(v, rows.length)} height={rows.length > 5 ? 60 : 20} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={40} />
        <Tooltip contentStyle={TIP} formatter={(v) => [fmt(v)]} />
        <Line dataKey={data.dataKey ?? 'value'} stroke={data.color ?? COLORS[0]}
          strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

/* ── Area ────────────────────────────────────────────────────────────────── */
function AreaWidget({ data }: { data: WidgetData }) {
  const rows = data.chartData ?? []
  const color = data.color ?? COLORS[0]
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={rows} margin={{ top: 4, right: 8, left: -10, bottom: rows.length > 5 ? 56 : 8 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey={data.xAxisKey ?? 'name'} tick={TICK} tickLine={false} axisLine={false}
          interval={0} angle={rows.length > 5 ? -45 : 0} textAnchor={rows.length > 5 ? 'end' : 'middle'}
          tickFormatter={(v) => xFmt(v, rows.length)} height={rows.length > 5 ? 60 : 20} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={40} />
        <Tooltip contentStyle={TIP} formatter={(v) => [fmt(v)]} />
        <Area dataKey={data.dataKey ?? 'value'} stroke={color} strokeWidth={2}
          fill="url(#areaGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ── Pie / Donut ─────────────────────────────────────────────────────────── */
function PieWidget({ data, donut = false }: { data: WidgetData; donut?: boolean }) {
  const rows = data.chartData ?? []
  const xk   = data.xAxisKey ?? data.dataKey ?? 'name'
  const yk   = 'value'

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={rows} dataKey={yk} nameKey={xk}
          cx="40%" cy="50%"
          outerRadius={80}
          innerRadius={donut ? 36 : 0}
          paddingAngle={2}>
          {rows.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={TIP} formatter={(v) => [fmt(v)]} />
        <Legend layout="vertical" align="right" verticalAlign="middle"
          iconSize={9} iconType="circle"
          wrapperStyle={{ fontSize: 11, lineHeight: '20px', paddingLeft: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

/* ── Radar ───────────────────────────────────────────────────────────────── */
function RadarWidget({ data }: { data: WidgetData }) {
  const rows = data.chartData ?? []
  const yk   = data.dataKey ?? 'value'
  const xk   = data.xAxisKey ?? 'name'

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={rows} cx="50%" cy="50%" outerRadius={80}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey={xk} tick={{ fontSize: 10, fill: '#6b7280' }} />
        <PolarRadiusAxis tick={{ fontSize: 9, fill: '#9ca3af' }} />
        <Radar dataKey={yk} stroke={data.color ?? COLORS[0]}
          fill={data.color ?? COLORS[0]} fillOpacity={0.25} />
        <Tooltip contentStyle={TIP} formatter={(v) => [fmt(v)]} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

/* ── Main renderer ───────────────────────────────────────────────────────── */
export function WidgetRenderer({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'table':        return <TableWidget data={widget.data} />
    case 'kpi':          return <KpiWidget  data={widget.data} />
    case 'chart-bar':    return <BarWidget  data={widget.data} />
    case 'chart-line':   return <LineWidget data={widget.data} />
    case 'chart-area':   return <AreaWidget data={widget.data} />
    case 'chart-pie':    return <PieWidget  data={widget.data} />
    case 'chart-donut':  return <PieWidget  data={widget.data} donut />
    case 'chart-radar':  return <RadarWidget data={widget.data} />
    default:             return <BarWidget  data={widget.data} />
  }
}
