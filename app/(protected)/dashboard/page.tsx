'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Settings, User, Search, ChevronDown, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const [showProfile, setShowProfile] = useState(false)
  const { user } = useAuth()

  return (
    <div className="flex-1 bg-gray-50 h-screen overflow-y-auto">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="text-lg font-semibold text-gray-800">
            Welcome, <span className="text-blue-600">{user?.firstName || 'User'}</span>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center max-w-2xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors">My Profile</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors">Account Settings</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors">Preferences</button>
                <hr className="my-1" />
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors text-red-600">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of Latest Month</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold">$3,468</div>
              <div className="text-xs text-gray-500">Revenue</div>
              <div className="text-xs text-green-600 mt-1">+12.5%</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-purple-600" />
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold">1,245</div>
              <div className="text-xs text-gray-500">Customers</div>
              <div className="text-xs text-green-600 mt-1">+8.2%</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold">892</div>
              <div className="text-xs text-gray-500">Orders</div>
              <div className="text-xs text-green-600 mt-1">+15.3%</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-8 w-8 text-orange-600" />
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold">67%</div>
              <div className="text-xs text-gray-500">Conversion</div>
              <div className="text-xs text-red-600 mt-1">-2.4%</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 text-cyan-600 flex items-center justify-center text-xl">📊</div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold">234</div>
              <div className="text-xs text-gray-500">Leads</div>
              <div className="text-xs text-green-600 mt-1">+22.1%</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 text-pink-600 flex items-center justify-center text-xl">💼</div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold">45</div>
              <div className="text-xs text-gray-500">Deals Closed</div>
              <div className="text-xs text-green-600 mt-1">+18.7%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="salesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path d="M0,150 L50,140 L100,120 L150,130 L200,100 L250,110 L300,80 L350,90 L400,60 L450,70 L500,40 L550,50 L600,30" fill="url(#salesGrad)" />
                  <path d="M0,150 L50,140 L100,120 L150,130 L200,100 L250,110 L300,80 L350,90 L400,60 L450,70 L500,40 L550,50 L600,30" fill="none" stroke="#3b82f6" strokeWidth="3" />
                </svg>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <svg className="w-32 h-32" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="40 60" strokeDashoffset="25" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-15" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-45" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="-65" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    <span>Website</span>
                  </div>
                  <span className="font-semibold">40%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full" />
                    <span>Referral</span>
                  </div>
                  <span className="font-semibold">30%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span>Social Media</span>
                  </div>
                  <span className="font-semibold">20%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full" />
                    <span>Direct</span>
                  </div>
                  <span className="font-semibold">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="text-sm mb-2">Monthly Revenue</div>
              <div className="text-2xl font-bold mb-2">$45,231</div>
              <div className="flex gap-1 items-end h-12">
                {[60, 80, 70, 90, 75, 85, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/40 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="text-sm mb-2">New Customers</div>
              <div className="text-2xl font-bold mb-2">+156</div>
              <div className="flex gap-1 items-end h-12">
                {[50, 70, 60, 85, 70, 90, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/40 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="text-sm mb-2">Active Deals</div>
              <div className="text-2xl font-bold mb-2">89</div>
              <div className="flex gap-1 items-end h-12">
                {[70, 60, 80, 70, 85, 75, 90].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/40 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="text-sm mb-2">Conversion Rate</div>
              <div className="text-2xl font-bold mb-2">67.8%</div>
              <svg className="w-full h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path d="M0,30 Q25,20 50,25 T100,15 T150,20 T200,10" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
              </svg>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { stage: 'Prospecting', count: 45, value: '$125K', color: 'bg-blue-500', width: '90%' },
                  { stage: 'Qualification', count: 32, value: '$98K', color: 'bg-cyan-500', width: '70%' },
                  { stage: 'Proposal', count: 18, value: '$67K', color: 'bg-green-500', width: '50%' },
                  { stage: 'Negotiation', count: 12, value: '$45K', color: 'bg-yellow-500', width: '35%' },
                  { stage: 'Closed Won', count: 8, value: '$32K', color: 'bg-purple-600', width: '25%' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.stage}</span>
                      <span className="text-gray-600">{item.count} deals • {item.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full`} style={{ width: item.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Enterprise Plan', sales: 234, revenue: '$45,600', trend: '+12%', color: 'text-green-600' },
                  { name: 'Professional Plan', sales: 189, revenue: '$28,350', trend: '+8%', color: 'text-green-600' },
                  { name: 'Basic Plan', sales: 156, revenue: '$15,600', trend: '+5%', color: 'text-green-600' },
                  { name: 'Consulting Services', sales: 89, revenue: '$89,000', trend: '+18%', color: 'text-green-600' },
                  { name: 'Training Package', sales: 67, revenue: '$20,100', trend: '-3%', color: 'text-red-600' },
                ].map((product, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.sales} sales</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">{product.revenue}</div>
                      <div className={`text-xs ${product.color}`}>{product.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { user: 'John Doe', action: 'Closed deal with Acme Corp', time: '5 mins ago', color: 'bg-green-500' },
                { user: 'Sarah Smith', action: 'Added new lead', time: '12 mins ago', color: 'bg-blue-500' },
                { user: 'Mike Johnson', action: 'Updated proposal', time: '1 hour ago', color: 'bg-orange-500' },
                { user: 'Emily Davis', action: 'Scheduled meeting', time: '2 hours ago', color: 'bg-purple-500' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                    {activity.user[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.user}</div>
                    <div className="text-xs text-gray-500">{activity.action}</div>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Company</th>
                      <th className="px-4 py-2 text-left font-medium">Contact</th>
                      <th className="px-4 py-2 text-left font-medium">Value</th>
                      <th className="px-4 py-2 text-left font-medium">Stage</th>
                      <th className="px-4 py-2 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { company: 'Acme Corp', contact: 'John Smith', value: '$45,000', stage: 'Negotiation', status: 'Hot', statusColor: 'bg-red-500' },
                      { company: 'TechStart Inc', contact: 'Sarah Lee', value: '$32,000', stage: 'Proposal', status: 'Warm', statusColor: 'bg-orange-500' },
                      { company: 'Global Solutions', contact: 'Mike Brown', value: '$67,000', stage: 'Qualification', status: 'Cold', statusColor: 'bg-blue-500' },
                      { company: 'Innovation Labs', contact: 'Emma Wilson', value: '$28,000', stage: 'Closed Won', status: 'Won', statusColor: 'bg-green-500' },
                    ].map((deal, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{deal.company}</td>
                        <td className="px-4 py-3">{deal.contact}</td>
                        <td className="px-4 py-3 font-semibold">{deal.value}</td>
                        <td className="px-4 py-3">{deal.stage}</td>
                        <td className="px-4 py-3">
                          <span className={`${deal.statusColor} text-white px-2 py-1 rounded text-xs`}>
                            {deal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
