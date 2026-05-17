'use client'
import { AgentChat, AgentConfig } from '@/components/ai-assistant/AgentChat'

const config: AgentConfig = {
  name: 'Inventory Agent',
  module: 'inventory',
  role: 'Inventory & Warehouse Intelligence',
  description: 'Ask about stock levels, warehouse movements, and inventory health.',
  color: 'bg-teal-500',
  colorHex: '#14b8a6',
  contextPrefix: 'You are an Inventory Agent. Focus on inventory levels, stock movements, warehouses, products, low-stock alerts, and inventory valuation.',
  suggestions: [
    'Which products are low on stock?',
    'Show current inventory across all warehouses',
    'What items need replenishment?',
    'Show stock movement for this week',
    'Which products have zero stock?',
    'Show inventory value by warehouse',
  ],
}

export default function InventoryAgentPage() {
  return <AgentChat config={config} />
}
