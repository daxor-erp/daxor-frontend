'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bell, Settings, User, Search, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function EnterPurchaseOrdersPage() {
  const [showProfile, setShowProfile] = useState(false)
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    vendorId: '',
    projectId: '',
    totalAmount: '',
    orderDate: '',
    organizationId: user?.organizationId || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Purchase Order Data:', formData)
    // TODO: Implement GraphQL mutation
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Enter Purchase Orders</h1>
          <p className="text-sm text-gray-500">Create new purchase order</p>
        </div>

        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vendorId" className="text-sm font-medium">
                    Vendor ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vendorId"
                    name="vendorId"
                    type="text"
                    value={formData.vendorId}
                    onChange={handleChange}
                    placeholder="Enter vendor ID"
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectId" className="text-sm font-medium">
                    Project ID <span className="text-gray-400">(Optional)</span>
                  </Label>
                  <Input
                    id="projectId"
                    name="projectId"
                    type="text"
                    value={formData.projectId}
                    onChange={handleChange}
                    placeholder="Enter project ID"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalAmount" className="text-sm font-medium">
                    Total Amount <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderDate" className="text-sm font-medium">
                    Order Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="orderDate"
                    name="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationId" className="text-sm font-medium">
                    Organization ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="organizationId"
                    name="organizationId"
                    type="text"
                    value={formData.organizationId}
                    onChange={handleChange}
                    placeholder="Enter organization ID"
                    required
                    className="h-10"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Create Purchase Order
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setFormData({
                    vendorId: '',
                    projectId: '',
                    totalAmount: '',
                    orderDate: '',
                    organizationId: user?.organizationId || ''
                  })}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
