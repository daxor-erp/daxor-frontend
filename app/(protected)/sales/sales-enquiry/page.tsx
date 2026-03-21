'use client'

import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bell, Settings, User, Search, ChevronDown, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const GET_CLIENTS = gql`
  query GetClients($organizationId: ID) {
    clients(organizationId: $organizationId) {
      id
      name
      company
      status
    }
  }
`

const CREATE_SALES_ENQUIRY = gql`
  mutation CreateSalesEnquiry($input: CreateSalesEnquiryInput!) {
    createSalesEnquiry(input: $input) {
      id
      enquiryNumber
      subject
    }
  }
`

const EMPTY_FORM = {
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
  notes: '',
}

export default function SalesEnquiryPage() {
  const { user } = useAuth()
  const [showProfile, setShowProfile] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { data: clientsData, loading: clientsLoading } = useQuery(GET_CLIENTS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
    fetchPolicy: 'network-only',
  })

  const clients = clientsData?.clients ?? []
  const selectedClient = clients.find((c: any) => c.id === formData.clientId)

  const [createSalesEnquiry, { loading: submitting }] = useMutation(CREATE_SALES_ENQUIRY, {
    onCompleted: (res) => {
      setSuccessMsg(`Sales Enquiry "${res.createSalesEnquiry.enquiryNumber}" created successfully!`)
      setErrorMsg('')
      setFormData(EMPTY_FORM)
      setTimeout(() => setSuccessMsg(''), 5000)
    },
    onError: (err) => {
      setErrorMsg(err.message)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    createSalesEnquiry({
      variables: {
        input: {
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          assignedTo: formData.assignedTo || undefined,
          clientId: formData.clientId || undefined,
        },
      },
    })
  }

  const selectClass = 'w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white'

  return (
    <div className="flex-1 bg-gray-50 h-screen overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="text-lg font-semibold text-gray-800">
          Welcome, <span className="text-blue-600">{user?.firstName || 'User'}</span>
        </div>
        <div className="flex-1 flex justify-center max-w-2xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg"><Settings className="h-5 w-5 text-gray-600" /></button>
          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center"><User className="h-4 w-4" /></div>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">My Profile</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">Account Settings</button>
                <hr className="my-1" />
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Sales Enquiry</h1>
          <p className="text-sm text-gray-500">Create a new sales enquiry</p>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {errorMsg}
          </div>
        )}

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

                  {/* Client ID dropdown + resolved name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Client</Label>
                    <select
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="">{clientsLoading ? 'Loading clients…' : '— Select a client —'}</option>
                      {clients.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</option>
                      ))}
                    </select>
                    {/* Show resolved client name once selected */}
                    {selectedClient && (
                      <div className="flex items-center gap-2 mt-1 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {selectedClient.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-800">{selectedClient.name}</p>
                          {selectedClient.company && <p className="text-xs text-blue-500">{selectedClient.company}</p>}
                        </div>
                        <span className="ml-auto text-xs text-blue-400 font-mono">{selectedClient.id.slice(-8)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Enquiry Source</Label>
                    <select name="enquirySource" value={formData.enquirySource} onChange={handleChange} className={selectClass}>
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
                    <Label className="text-sm font-medium">Subject</Label>
                    <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter enquiry subject" maxLength={255} className="h-10" />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Project Type</Label>
                    <select name="projectType" value={formData.projectType} onChange={handleChange} className={selectClass}>
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
                    <Label className="text-sm font-medium">Location</Label>
                    <Input name="location" value={formData.location} onChange={handleChange} placeholder="Enter project location" className="h-10" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium">Project Scope</Label>
                    <textarea name="projectScope" value={formData.projectScope} onChange={handleChange} placeholder="Describe the project scope" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
              </div>

              {/* Timeline & Budget */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Timeline & Budget</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Estimated Start Date</Label>
                    <Input name="estimatedStartDate" type="date" value={formData.estimatedStartDate} onChange={handleChange} className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Estimated End Date</Label>
                    <Input name="estimatedEndDate" type="date" value={formData.estimatedEndDate} onChange={handleChange} className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Budget</Label>
                    <Input name="budget" type="number" step="0.01" value={formData.budget} onChange={handleChange} placeholder="0.00" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Currency</Label>
                    <select name="currency" value={formData.currency} onChange={handleChange} className={selectClass}>
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
                    <Label className="text-sm font-medium">Assigned To (User ID)</Label>
                    <Input name="assignedTo" value={formData.assignedTo} onChange={handleChange} placeholder="Enter user ID (optional)" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Priority</Label>
                    <select name="priority" value={formData.priority} onChange={handleChange} className={selectClass}>
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Additional Information</h3>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Notes</Label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Add any additional notes or comments" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  {submitting ? 'Creating…' : 'Create Sales Enquiry'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setFormData(EMPTY_FORM); setErrorMsg('') }}>
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
