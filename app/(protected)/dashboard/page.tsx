'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, Package, ShoppingCart, TrendingUp, DollarSign, FileText, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    { title: 'Total Users', value: '0', icon: Users, trend: '+0%', color: 'text-blue-600' },
    { title: 'Organizations', value: '0', icon: Building2, trend: '+0%', color: 'text-green-600' },
    { title: 'Items', value: '0', icon: Package, trend: '+0%', color: 'text-orange-600' },
    { title: 'Orders', value: '0', icon: ShoppingCart, trend: '+0%', color: 'text-purple-600' },
    { title: 'Revenue', value: '$0', icon: DollarSign, trend: '+0%', color: 'text-emerald-600' },
    { title: 'Invoices', value: '0', icon: FileText, trend: '+0%', color: 'text-pink-600' },
    { title: 'Projects', value: '0', icon: Calendar, trend: '+0%', color: 'text-indigo-600' },
    { title: 'Growth', value: '0%', icon: TrendingUp, trend: '+0%', color: 'text-cyan-600' },
  ]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.firstName}! Here's what's happening today.</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">{stat.trend}</span> from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Your business metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Chart placeholder - Connect your data to see analytics
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">No recent activity</p>
                  <p className="text-sm text-muted-foreground">Start by creating users, items, or orders</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
