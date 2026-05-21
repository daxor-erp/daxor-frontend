'use client'
import { AgentChat, AgentConfig } from '@/components/ai-assistant/AgentChat'

const config: AgentConfig = {
  name: 'HR Agent',
  module: 'hr',
  role: 'Human Resources Intelligence',
  description: 'Ask about employees, leave, hiring, and workforce analytics.',
  color: 'bg-violet-500',
  colorHex: '#8b5cf6',
  contextPrefix: 'You are an HR Agent. Focus on employees, leave management, workforce data, employee records, departments, and HR analytics.',
  suggestions: [
    'List all active employees',
    'Who has pending leave applications?',
    'Show employee headcount by department',
    'How many employees joined this year?',
    'List employees on leave this week',
    'Show employee exit records',
  ],
}

export default function HRAgentPage() {
  return <AgentChat config={config} />
}
