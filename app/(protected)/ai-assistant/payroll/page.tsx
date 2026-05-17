'use client'
import { AgentChat, AgentConfig } from '@/components/ai-assistant/AgentChat'

const config: AgentConfig = {
  name: 'Payroll Agent',
  module: 'payroll',
  role: 'Payroll & Compensation Intelligence',
  description: 'Ask about payroll runs, salary processing, and compensation data.',
  color: 'bg-amber-500',
  colorHex: '#f59e0b',
  contextPrefix: 'You are a Payroll Agent. Focus on payroll management, salary processing, employee compensation, payroll runs, and payroll expenses.',
  suggestions: [
    'Show payroll summary for this month',
    'Which employees have pending salary?',
    'What is the total payroll cost by department?',
    'List employees with salary changes this month',
    'Show overtime expenses this quarter',
    'What is the average salary by department?',
  ],
}

export default function PayrollAgentPage() {
  return <AgentChat config={config} />
}
