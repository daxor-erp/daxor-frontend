'use client'
import { AgentChat, AgentConfig } from '@/components/ai-assistant/AgentChat'

const config: AgentConfig = {
  name: 'Projects Agent',
  module: 'projects',
  role: 'Project Management Intelligence',
  description: 'Ask about project status, milestones, resources, and delivery timelines.',
  color: 'bg-indigo-500',
  colorHex: '#6366f1',
  contextPrefix: 'You are a Projects Agent. Focus on projects, project status, milestones, work orders, resources, tasks, and project delivery timelines.',
  suggestions: [
    'Show all active projects',
    'Which projects are behind schedule?',
    'List projects by status',
    'What milestones are due this month?',
    'Show project budget vs actual spend',
    'Which projects have open work orders?',
  ],
}

export default function ProjectsAgentPage() {
  return <AgentChat config={config} />
}
