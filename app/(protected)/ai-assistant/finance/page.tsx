'use client'
import { AgentChat, AgentConfig } from '@/components/ai-assistant/AgentChat'

const config: AgentConfig = {
  name: 'Finance Agent',
  module: 'financial',
  role: 'Financial Intelligence',
  description: 'Ask about cash flow, outstanding payments, expenses, and financial health.',
  color: 'bg-emerald-500',
  colorHex: '#10b981',
  contextPrefix: 'You are a Finance Agent. Focus on vendor payments, customer payments, general ledger, cash flow, outstanding balances, expenses, and financial performance.',
  suggestions: [
    'What is our total outstanding payables?',
    'Show overdue customer invoices',
    'What is our cash position this month?',
    'List the largest unpaid vendor bills',
    'Show expense breakdown by category',
    'What payments are due this week?',
  ],
}

export default function FinanceAgentPage() {
  return <AgentChat config={config} />
}
