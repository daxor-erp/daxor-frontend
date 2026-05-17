'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

const AI_BASE = process.env.NEXT_PUBLIC_AI_URL || 'http://13.206.39.63:8002'

export type MessageRole = 'user' | 'assistant'

export interface ReasoningStep {
  tool: string
  input: string
}

export interface VisualizationColumn {
  key: string
  label: string
}

export interface VisualizationYKey {
  key: string
  label: string
  color: string
}

export interface Visualization {
  type: 'table' | 'bar_chart' | 'line_chart' | 'pie_chart'
  title: string
  data: Record<string, unknown>[]
  columns?: VisualizationColumn[]
  total?: number
  x_key?: string
  y_keys?: VisualizationYKey[]
  name_key?: string
  value_key?: string
}

export interface WorkflowGraphNode {
  id: string
  node_type: string
  label: string
  sub?: string
  status?: string
  data?: Record<string, string>
}

export interface WorkflowGraphEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface WorkflowGraphData {
  nodes: WorkflowGraphNode[]
  edges: WorkflowGraphEdge[]
  title?: string
}

// SSE event types streamed from /api/ai/stream
export type StreamEvent =
  | { type: 'status';         content: string }
  | { type: 'intent';         value: string; confidence: number }
  | { type: 'reasoning';      content: string }
  | { type: 'tool_call';      tool: string; input_summary: string }
  | { type: 'tool_result';    content: string }
  | { type: 'answer';         content: string }
  | { type: 'visualization';  data: Visualization }
  | { type: 'workflow_graph'; data: WorkflowGraphData }
  | { type: 'error';          content: string }
  | { type: 'done' }

export interface AgentStep {
  tool: string
  inputSummary: string
  result?: string
}

export interface AiMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  visualization?: Visualization
  workflowGraph?: WorkflowGraphData
  agentSteps?: AgentStep[]         // tool calls made during this response
  reasoning?: string               // model's extended-thinking scratchpad (intent reasoning)
  intent?: string
  metadata?: {
    intent?: string
    confidence?: number
    agent_type?: string
    tools_used?: string[]
    reasoning_steps?: ReasoningStep[]
    execution_time?: string
    success?: boolean
  }
}

// Transient streaming state (not persisted)
export interface StreamingState {
  status: string
  intent?: string
  reasoning?: string
  steps: AgentStep[]
  currentTool?: string
}

function storageKey(userId: string, orgId: string) {
  return `daxor_ai_chat_${userId}_${orgId}`
}

function loadMessages(userId: string, orgId: string): AiMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKey(userId, orgId))
    return raw ? (JSON.parse(raw) as AiMessage[]) : []
  } catch {
    return []
  }
}

function saveMessages(userId: string, orgId: string, messages: AiMessage[]) {
  if (typeof window === 'undefined') return
  // Keep last 40 messages. Strip agentSteps (verbose tool logs) but keep visualization
  // so tables/charts are still visible after a page refresh.
  const trimmed = messages.slice(-40).map((m) => {
    const { agentSteps, ...rest } = m
    return rest
  })
  localStorage.setItem(storageKey(userId, orgId), JSON.stringify(trimmed))
}

export function useAiChat(userId: string, orgId: string) {
  const [messages, setMessages]         = useState<AiMessage[]>([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [streaming, setStreaming]       = useState<StreamingState | null>(null)
  const abortRef                        = useRef<AbortController | null>(null)
  const messagesRef                     = useRef<AiMessage[]>([])
  // Pending streaming state — batched to reduce re-renders during rapid SSE events
  const streamingBufRef                 = useRef<StreamingState | null>(null)
  const streamingRafRef                 = useRef<number | null>(null)

  useEffect(() => {
    if (!userId || !orgId) return
    const loaded = loadMessages(userId, orgId)
    setMessages(loaded)
    messagesRef.current = loaded
  }, [userId, orgId])

  useEffect(() => {
    messagesRef.current = messages
    if (!userId || !orgId || messages.length === 0) return
    saveMessages(userId, orgId, messages)
  }, [messages, userId, orgId])

  const sendMessage = useCallback(
    async (text: string, pageContext?: { page: string; title: string }) => {
      if (!text.trim() || loading) return

      const userMsg: AiMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMsg])
      setLoading(true)
      setError(null)
      streamingBufRef.current = { status: 'Connecting…', steps: [] }
      setStreaming({ status: 'Connecting…', steps: [] })

      abortRef.current = new AbortController()

      // Flush the streaming buffer to React state (called via RAF)
      const flushStreaming = () => {
        if (streamingBufRef.current) {
          setStreaming({ ...streamingBufRef.current })
        }
        streamingRafRef.current = null
      }

      // Update streaming state via buffer — batches rapid SSE events into one render per frame
      const updateStreaming = (updater: (s: StreamingState) => StreamingState) => {
        streamingBufRef.current = updater(
          streamingBufRef.current ?? { status: '', steps: [] }
        )
        if (!streamingRafRef.current) {
          streamingRafRef.current = requestAnimationFrame(flushStreaming)
        }
      }

      // Accumulate streamed data
      let finalAnswer    = ''
      let visualization: Visualization | undefined
      let workflowGraph: WorkflowGraphData | undefined
      const agentSteps: AgentStep[] = []
      let intentValue    = ''
      let reasoningText  = ''
      let lastToolCall: AgentStep | null = null

      try {
        // Use ref snapshot so this callback always sees the latest messages
        // regardless of the [loading] closure dependency
        const historySnapshot = messagesRef.current
          .slice(-6)   // last 6 turns (3 exchanges)
          .map((m) => ({ role: m.role, content: m.content }))

        const res = await fetch(`${AI_BASE}/api/ai/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: text.trim(),
            context: pageContext ? `User is on page: ${pageContext.title}` : undefined,
            conversation_history: historySnapshot.length > 0 ? historySnapshot : undefined,
          }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) throw new Error(`AI service error: ${res.status}`)
        if (!res.body) throw new Error('No response body')

        const reader  = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer    = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Process complete SSE lines from buffer
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''   // keep incomplete last line

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (!raw) continue

            let event: StreamEvent
            try { event = JSON.parse(raw) } catch { continue }

            switch (event.type) {
              case 'status':
                updateStreaming((s) => ({ ...s, status: event.content }))
                break

              case 'intent':
                intentValue = event.value
                updateStreaming((s) => ({ ...s, status: `Intent: ${event.value}`, intent: event.value }))
                break

              case 'reasoning':
                reasoningText = reasoningText
                  ? `${reasoningText}\n\n${event.content}`
                  : event.content
                updateStreaming((s) => ({ ...s, status: 'Thinking…', reasoning: reasoningText }))
                break

              case 'tool_call':
                lastToolCall = { tool: event.tool, inputSummary: event.input_summary }
                agentSteps.push(lastToolCall)
                updateStreaming((s) => ({
                  ...s,
                  status: `Using ${event.tool}…`,
                  currentTool: event.tool,
                  steps: [...agentSteps],
                }))
                break

              case 'tool_result':
                if (lastToolCall) {
                  lastToolCall.result = event.content
                  updateStreaming((s) => ({ ...s, steps: [...agentSteps], currentTool: undefined }))
                }
                break

              case 'answer':
                finalAnswer = event.content
                updateStreaming((s) => ({ ...s, status: 'Writing answer…' }))
                break

              case 'visualization':
                visualization = event.data
                break

              case 'workflow_graph':
                workflowGraph = event.data
                break

              case 'error':
                throw new Error(event.content)

              case 'done':
                break
            }
          }
        }

        const assistantMsg: AiMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: finalAnswer || 'No response received.',
          timestamp: Date.now(),
          visualization,
          workflowGraph,
          agentSteps: agentSteps.length > 0 ? agentSteps : undefined,
          reasoning: reasoningText || undefined,
          intent: intentValue || undefined,
          metadata: { success: true },
        }
        setMessages((prev) => [...prev, assistantMsg])

      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        const msg = err instanceof Error ? err.message : 'Failed to reach the AI service.'
        setError(msg)
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `Something went wrong: ${msg}`,
            timestamp: Date.now(),
            metadata: { success: false },
          },
        ])
      } finally {
        // Cancel any pending RAF flush and clear buffers
        if (streamingRafRef.current) {
          cancelAnimationFrame(streamingRafRef.current)
          streamingRafRef.current = null
        }
        streamingBufRef.current = null
        setLoading(false)
        setStreaming(null)
      }
    },
    [loading]
  )

  const clearHistory = useCallback(() => {
    if (!userId || !orgId) return
    localStorage.removeItem(storageKey(userId, orgId))
    setMessages([])
  }, [userId, orgId])

  const cancelRequest = useCallback(() => {
    abortRef.current?.abort()
    if (streamingRafRef.current) {
      cancelAnimationFrame(streamingRafRef.current)
      streamingRafRef.current = null
    }
    streamingBufRef.current = null
    setLoading(false)
    setStreaming(null)
  }, [])

  return { messages, loading, error, streaming, sendMessage, clearHistory, cancelRequest }
}
