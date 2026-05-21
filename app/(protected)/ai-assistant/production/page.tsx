'use client'
import { AgentChat, AgentConfig } from '@/components/ai-assistant/AgentChat'

const config: AgentConfig = {
  name: 'Production Agent',
  module: 'production',
  role: 'Manufacturing & Operations Intelligence',
  description: 'Ask about work orders, production status, and manufacturing operations.',
  color: 'bg-red-500',
  colorHex: '#ef4444',
  contextPrefix: 'You are a Production Agent. Focus on work orders, production planning, manufacturing operations, production status, and operational data.',
  suggestions: [
    'Show all active work orders',
    'Which work orders are overdue?',
    'Production status summary this week',
    'How many work orders completed this month?',
    'Show work orders by status',
    'Which projects are behind schedule?',
  ],
}

export default function ProductionAgentPage() {
  return <AgentChat config={config} />
}
