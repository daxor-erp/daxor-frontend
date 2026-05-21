'use client'
import { AgentChat, AgentConfig } from '@/components/ai-assistant/AgentChat'

const config: AgentConfig = {
  name: 'Sales Agent',
  module: 'sales',
  role: 'Sales & Revenue Intelligence',
  description: 'Ask about sales orders, customer invoices, revenue trends, and sales performance.',
  color: 'bg-blue-500',
  colorHex: '#3b82f6',
  contextPrefix: 'You are a Sales Agent. Focus on sales orders, customer invoices, quotations, customer payments, sales performance, and revenue analysis.',
  suggestions: [
    'Show me top customers by revenue this month',
    'Which sales orders are still pending?',
    'What are our best-selling products?',
    'List customers with overdue invoices',
    'Compare sales this month vs last month',
    'Show all open quotations',
  ],
}

export default function SalesAgentPage() {
  return <AgentChat config={config} />
}
