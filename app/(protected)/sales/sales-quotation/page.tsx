'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bell, Settings, User, Search, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface QuotationItem {
  itemName: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  discount: number
  tax: number
  amount: number
}

export default function SalesQuotationPage() {
  const [showProfile, setShowProfile] = useState(false)
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    enquiryId: '',
    clientId: '',
    quotationDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    subject: '',
    currency: 'SGD',
    paymentTerms: '',
    deliveryTerms: '',
    notes: '',
    termsAndConditions: '',
    assignedTo: ''
  })

  const [items, setItems] = useState<QuotationItem[]>([{
    itemName: '',
    description: '',
    quantity: 1,
    unit: 'pcs',
    unitPrice: 0,
    discount: 0,
    tax: 0,
    amount: 0
  }])

  const calculateItemAmount = (item: QuotationItem) => {
    return (item.quantity * item.unitPrice) - item.discount + item.tax
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0)
    const totalTax = items.reduce((sum, item) => sum + item.tax, 0)
    const grandTotal = subtotal - totalDiscount + totalTax
    return { subtotal, totalDiscount, totalTax, grandTotal }
  }

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (['quantity', 'unitPrice', 'discount', 'tax'].includes(field)) {
      newItems[index].amount = calculateItemAmount(newItems[index])
    }
    
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, {
      itemName: '',
      description: '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: 0,
      discount: 0,
      tax: 0,
      amount: 0
    }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const totals = calculateTotals()
    const quotationData = {
      ...formData,
      items,
      ...totals
    }
    
    console.log('Sales Quotation Data:', quotationData)
    alert('Sales quotation created successfully')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const totals = calculateTotals()

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
          <h1 className="text-2xl font-bold mb-1">Sales Quotation</h1>
          <p className="text-sm text-gray-500">Create new sales quotation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="max-w-6xl">
            <CardHeader>
              <CardTitle>Quotation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID <span className="text-red-500">*</span></Label>
                  <Input
                    id="clientId"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enquiryId">Enquiry ID</Label>
                  <Input
                    id="enquiryId"
                    name="enquiryId"
                    value={formData.enquiryId}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quotationDate">Quotation Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="quotationDate"
                    name="quotationDate"
                    type="date"
                    value={formData.quotationDate}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until <span className="text-red-500">*</span></Label>
                  <Input
                    id="validUntil"
                    name="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="SGD">SGD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    className="h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-6xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button type="button" onClick={addItem} size="sm" className="bg-blue-600">
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {items.length > 1 && (
                        <Button type="button" onClick={() => removeItem(index)} size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Item Name <span className="text-red-500">*</span></Label>
                        <Input
                          value={item.itemName}
                          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          required
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity <span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          required
                          min="0"
                          step="0.01"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Unit Price <span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          required
                          min="0"
                          step="0.01"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Discount</Label>
                        <Input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tax</Label>
                        <Input
                          type="number"
                          value={item.tax}
                          onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="h-10 bg-gray-50"
                        />
                      </div>

                      <div className="md:col-span-4 space-y-2">
                        <Label>Description</Label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formData.currency} {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Discount:</span>
                  <span className="font-semibold text-red-600">-{formData.currency} {totals.totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Tax:</span>
                  <span className="font-semibold">+{formData.currency} {totals.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">{formData.currency} {totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-6xl">
            <CardHeader>
              <CardTitle>Terms & Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <textarea
                  id="paymentTerms"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryTerms">Delivery Terms</Label>
                <textarea
                  id="deliveryTerms"
                  name="deliveryTerms"
                  value={formData.deliveryTerms}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                <textarea
                  id="termsAndConditions"
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 max-w-6xl">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8">
              Create Quotation
            </Button>
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="button" variant="outline">
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
