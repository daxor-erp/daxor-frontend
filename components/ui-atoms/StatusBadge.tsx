import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: string
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 hover:bg-green-100',
  inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  completed: 'bg-primary/10 text-primary hover:bg-primary/10',
  cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
  draft: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  approved: 'bg-green-100 text-green-800 hover:bg-green-100',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
  
  return (
    <Badge variant="outline" className={colorClass}>
      {status}
    </Badge>
  )
}
