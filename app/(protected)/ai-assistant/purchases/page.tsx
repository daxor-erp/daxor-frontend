'use client'
import { AgentChat, AgentConfig } from '@/components/ai-assistant/AgentChat'

const config: AgentConfig = {
  name: 'Purchases Agent',
  module: 'purchase',
  role: 'Procurement Intelligence',
  description: 'Ask about purchase orders, vendors, bills, and procurement spending.',
  color: 'bg-orange-500',
  colorHex: '#f97316',
  contextPrefix: 'You are a Purchases Agent. Focus on purchase orders, vendors, vendor bills, vendor payments, procurement spending, and supply chain data.',
  suggestions: [
    'Show all open purchase orders',
    'Which vendors have unpaid bills?',
    'What is our total PO value this quarter?',
    'List overdue purchase orders',
    'Who are our top vendors by spend?',
    'Show bills pending approval',
  ],
}

export default function PurchasesAgentPage() {
  return <AgentChat config={config} />
}
