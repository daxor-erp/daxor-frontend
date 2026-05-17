'use client'

import { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  MarkerType,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Dagre from '@dagrejs/dagre'

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface WorkflowNode {
  id: string
  node_type: 'vendor' | 'customer' | 'purchaseorder' | 'salesorder' | 'bill' | 'invoice' | 'payment' | 'summary' | 'product' | 'inventory' | 'workorder' | 'project' | 'employee' | 'quotation' | string
  label: string
  sub?: string
  status?: string
  data?: Record<string, string>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
}

interface Props {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

/* ── Status colour mapping ─────────────────────────────────────────────── */

const STATUS_COLORS: Record<string, string> = {
  active:          '#10b981',
  paid:            '#10b981',
  completed:       '#10b981',
  delivered:       '#10b981',
  approved:        '#3b82f6',
  pending:         '#f59e0b',
  partially_paid:  '#f97316',
  overdue:         '#ef4444',
  cancelled:       '#6b7280',
  draft:           '#8b5cf6',
  unknown:         '#6b7280',
}

function statusColor(s?: string) {
  if (!s) return '#6b7280'
  return STATUS_COLORS[s.toLowerCase()] ?? '#6b7280'
}

/* ── Node border colours by type ───────────────────────────────────────── */

const NODE_ACCENT: Record<string, string> = {
  vendor:        '#14b8a6',  // teal
  customer:      '#14b8a6',
  purchaseorder: '#3b82f6',  // blue
  salesorder:    '#3b82f6',
  bill:          '#8b5cf6',  // purple
  invoice:       '#8b5cf6',
  payment:       '#10b981',  // green
  summary:       '#f59e0b',  // amber
  product:       '#ec4899',  // pink
  inventory:     '#f97316',  // orange
  workorder:     '#06b6d4',  // cyan
  project:       '#6366f1',  // indigo
  quotation:     '#84cc16',  // lime
  employee:      '#a78bfa',  // violet
}

const NODE_BADGE: Record<string, string> = {
  vendor:        'V',
  customer:      'C',
  purchaseorder: 'PO',
  salesorder:    'SO',
  bill:          'B',
  invoice:       'INV',
  payment:       'PAY',
  summary:       'Σ',
  product:       'P',
  inventory:     'INV',
  workorder:     'WO',
  project:       'PRJ',
  quotation:     'Q',
  employee:      'EMP',
}

/* ── Custom node component ─────────────────────────────────────────────── */

function ErpNode({ data }: { data: WorkflowNode & { accent: string; badge: string } }) {
  const { label, sub, status, data: fields, accent, badge } = data
  const sc = statusColor(status)

  return (
    <div
      style={{ borderColor: accent }}
      className="min-w-[180px] max-w-[220px] rounded-xl border-2 bg-white text-gray-900 shadow-md overflow-hidden"
    >
      <Handle type="target" position={Position.Left}  style={{ background: accent, border: 'none', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} style={{ background: accent, border: 'none', width: 8, height: 8 }} />

      {/* Header */}
      <div style={{ backgroundColor: accent + '18' }} className="px-3 py-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">{label}</p>
          {sub && <p className="text-[11px] text-gray-500 mt-0.5 font-mono">{sub}</p>}
        </div>
        <span
          style={{ backgroundColor: accent + '22', color: accent }}
          className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
        >
          {badge}
        </span>
      </div>

      {/* Status */}
      {status && (
        <div className="px-3 py-1.5 flex items-center gap-1.5 border-b border-gray-100">
          <span style={{ backgroundColor: sc }} className="w-1.5 h-1.5 rounded-full shrink-0" />
          <span style={{ color: sc }} className="text-[10px] font-medium capitalize">
            {status.replace(/_/g, ' ')}
          </span>
        </div>
      )}

      {/* Fields */}
      {fields && Object.keys(fields).length > 0 && (
        <div className="px-3 py-2 space-y-1">
          {Object.entries(fields).map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] text-gray-400 shrink-0">{k}</span>
              <span className="text-[10px] text-gray-600 truncate font-mono">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const nodeTypes = { erpNode: ErpNode }

/* ── Layout algorithm — Dagre LR (proper directed graph layout) ─────────── */

// Node box dimensions used by the layout engine. Matches ErpNode visual size.
const NODE_W = 220
const NODE_H = 72

function buildFlowNodes(rawNodes: WorkflowNode[], rawEdges: WorkflowEdge[]): Node[] {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  // Left-to-right flow, generous spacing — graphs can have 50+ nodes.
  g.setGraph({
    rankdir: 'LR',
    nodesep: 28,
    ranksep: 110,
    edgesep: 12,
    marginx: 24,
    marginy: 24,
  })

  for (const n of rawNodes) {
    g.setNode(n.id, { width: NODE_W, height: NODE_H })
  }
  for (const e of rawEdges) {
    if (g.hasNode(e.source) && g.hasNode(e.target)) {
      g.setEdge(e.source, e.target)
    }
  }

  Dagre.layout(g)

  return rawNodes.map((n) => {
    const pos = g.node(n.id)
    return {
      id: n.id,
      type: 'erpNode',
      // Dagre returns center coordinates; React Flow uses top-left.
      position: { x: (pos?.x ?? 0) - NODE_W / 2, y: (pos?.y ?? 0) - NODE_H / 2 },
      data: {
        ...n,
        accent: NODE_ACCENT[n.node_type] ?? '#6b7280',
        badge:  NODE_BADGE[n.node_type] ?? '?',
      },
    }
  })
}

function buildFlowEdges(rawEdges: WorkflowEdge[]): Edge[] {
  return rawEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af', width: 14, height: 14 },
    style: { stroke: '#d1d5db', strokeWidth: 1.5 },
    labelStyle: { fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' },
    labelBgStyle: { fill: '#f9fafb', fillOpacity: 0.95 },
    labelBgPadding: [4, 4],
    labelBgBorderRadius: 4,
  }))
}

/* ── Main export ────────────────────────────────────────────────────────── */

export function WorkflowGraph({ nodes: rawNodes, edges: rawEdges }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  useEffect(() => {
    setNodes(buildFlowNodes(rawNodes, rawEdges))
    setEdges(buildFlowEdges(rawEdges))
  }, [rawNodes, rawEdges, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  return (
    <div className="w-full h-full" style={{ background: '#f9fafb' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        colorMode="light"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e7eb"
        />
        <Controls
          style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
        />
        <MiniMap
          style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
          nodeColor={(n) => NODE_ACCENT[(n.data as unknown as WorkflowNode).node_type] ?? '#9ca3af'}
          maskColor="rgba(0,0,0,0.05)"
        />
      </ReactFlow>
    </div>
  )
}
