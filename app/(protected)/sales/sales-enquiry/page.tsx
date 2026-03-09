'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bell, Settings, User, Search, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function SalesEnquiryPage() {
  const [showProfile, setShowProfile] = useState(false)
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    clientId: '',
    enquirySource: '',
    subject: '',
    projectType: '',
    projectScope: '',
    location: '',
    estimatedStartDate: '',
    estimatedEndDate: '',
    budget: '',
    currency: 'SGD',
    assignedTo: '',
    priority: 'normal',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // TODO: Implement GraphQL mutation
      console.log('Sales Enquiry Data:', formData)
      alert('Sales enquiry created successfully')
      
      // Reset form
      setFormData({
        clientId: '',
        enquirySource: '',
        subject: '',
        projectType: '',
        projectScope: '',
        location: '',
        estimatedStartDate: '',
        estimatedEndDate: '',
        budget: '',
        currency: 'SGD',
        assignedTo: '',
        priority: 'normal',
        notes: ''
      })
    } catch (error: any) {
      alert(error.message || 'Failed to create sales enquiry')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
          <h1 className="text-2xl font-bold mb-1">Sales Enquiry</h1>
          <p className="text-sm text-gray-500">Create new sales enquiry</p>
        </div>

        <Card className="max-w-5xl">
          <CardHeader>
            <CardTitle>Enquiry Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clientId" className="text-sm font-medium">
                      Client ID <span className="text-gray-400">(Optional - defaults to current user)</span>
                    </Label>
                    <Input
                      id="clientId"
                      name="clientId"
                      type="text"
                      value={formData.clientId}
                      onChange={handleChange}
                      placeholder="Enter client ID"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enquirySource" className="text-sm font-medium">
                      Enquiry Source
                    </Label>
                    <select
                      id="enquirySource"
                      name="enquirySource"
                      value={formData.enquirySource}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select source</option>
                      <option value="Website">Website</option>
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="Referral">Referral</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Social Media">Social Media</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter enquiry subject"
                      maxLength={255}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectType" className="text-sm font-medium">
                      Project Type
                    </Label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select project type</option>
                      <option value="Construction">Construction</option>
                      <option value="MEP">MEP</option>
                      <option value="Renovation">Renovation</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter project location"
                      maxLength={255}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="projectScope" className="text-sm font-medium">
                      Project Scope
                    </Label>
                    <textarea
                      id="projectScope"
                      name="projectScope"
                      value={formData.projectScope}
                      onChange={handleChange}
                      placeholder="Describe the project scope in detail"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Timeline & Budget */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Timeline & Budget</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedStartDate" className="text-sm font-medium">
                      Estimated Start Date
                    </Label>
                    <Input
                      id="estimatedStartDate"
                      name="estimatedStartDate"
                      type="date"
                      value={formData.estimatedStartDate}
                      onChange={handleChange}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedEndDate" className="text-sm font-medium">
                      Estimated End Date
                    </Label>
                    <Input
                      id="estimatedEndDate"
                      name="estimatedEndDate"
                      type="date"
                      value={formData.estimatedEndDate}
                      onChange={handleChange}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm font-medium">
                      Budget
                    </Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      step="0.01"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">
                      Currency
                    </Label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="SGD">SGD - Singapore Dollar</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Assignment & Priority */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Assignment & Priority</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo" className="text-sm font-medium">
                      Assigned To (User ID)
                    </Label>
                    <Input
                      id="assignedTo"
                      name="assignedTo"
                      type="text"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      placeholder="Enter user ID"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </Label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes or comments"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Create Sales Enquiry
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setFormData({
                    clientId: '',
                    enquirySource: '',
                    subject: '',
                    projectType: '',
                    projectScope: '',
                    location: '',
                    estimatedStartDate: '',
                    estimatedEndDate: '',
                    budget: '',
                    currency: 'SGD',
                    assignedTo: '',
                    priority: 'normal',
                    notes: ''
                  })}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
