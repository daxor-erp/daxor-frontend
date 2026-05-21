'use client'
import { AgentChat, AgentConfig } from '@/components/ai-assistant/AgentChat'

const config: AgentConfig = {
  name: 'CRM Agent',
  module: 'crm',
  role: 'Customer Relationship Intelligence',
  description: 'Ask about clients, leads, opportunities, and customer activity.',
  color: 'bg-pink-500',
  colorHex: '#ec4899',
  contextPrefix: 'You are a CRM Agent. Focus on clients, customers, leads, opportunities, quotations, and customer relationship data.',
  suggestions: [
    'Show all active clients',
    'List clients with no recent orders',
    'How many new clients this month?',
    'Show clients with the highest order value',
    'List all open opportunities',
    'Which clients have pending quotations?',
  ],
}

export default function CRMAgentPage() {
  return <AgentChat config={config} />
}
