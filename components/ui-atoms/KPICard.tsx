'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface KPICardProps {
  icon: LucideIcon
  title: string
  value: string
  trend?: { value: string; positive: boolean }
  subtitle?: string
  color?: string
}

export function KPICard({ icon: Icon, title, value, trend, subtitle, color = 'blue' }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-primary/10 text-primary',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
            <Icon size={20} />
          </div>
          {trend && (
            <span className={`flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend.value}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
