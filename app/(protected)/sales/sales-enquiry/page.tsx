'use client'

import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { Save, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_CUSTOMERS_FOR_SALES,
  mapSalesCustomers,
  customerSelectOptions,
} from '@/lib/sales-customer-options'

const CREATE_SALES_ENQUIRY = gql`
  mutation CreateSalesEnquiry($input: CreateSalesEnquiryInput!) {
    createSalesEnquiry(input: $input) {
      id
      enquiryNumber
      subject
      status
    }
  }
`

const EMPTY_FORM = {
  customerId: '',
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

const ENQUIRY_SOURCE_OPTS = [
  { value: '', label: 'Select source...' },
  { value: 'Website', label: 'Website' },
  { value: 'Email', label: 'Email' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Walk-in', label: 'Walk-in' },
  { value: 'Social Media', label: 'Social Media' },
]

const PROJECT_TYPE_OPTS = [
  { value: '', label: 'Select project type...' },
  { value: 'Construction', label: 'Construction' },
  { value: 'MEP', label: 'MEP' },
  { value: 'Renovation', label: 'Renovation' },
  { value: 'Infrastructure', label: 'Infrastructure' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Residential', label: 'Residential' },
]

const CURRENCY_OPTS = [
  { value: 'SGD', label: 'SGD' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'AUD', label: 'AUD' },
  { value: 'INR', label: 'INR' },
]

const PRIORITY_OPTS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

const cellInput = 'w-full border border-gray-200 rounded px-2 py-1 text-xs'

export default function SalesEnquiryPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { data: customersData, loading: customersLoading } = useQuery(GET_CUSTOMERS_FOR_SALES, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createSalesEnquiry, { loading: submitting }] = useMutation(CREATE_SALES_ENQUIRY, {
    onCompleted: (res) => {
      setSuccessMsg(`Sales enquiry "${res.createSalesEnquiry.enquiryNumber}" created successfully!`)
      setErrorMsg('')
      setFormData(EMPTY_FORM)
      setTimeout(() => setSuccessMsg(''), 5000)
    },
    onError: (err) => {
      setErrorMsg(err.message)
    },
  })

  const setF = (k: string, v: string) => {
    setFormData((p) => ({ ...p, [k]: v }))
  }

  const handleSubmit = () => {
    setErrorMsg('')
    createSalesEnquiry({
      variables: {
        input: {
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          assignedTo: formData.assignedTo || undefined,
          customerId: formData.customerId || undefined,
        },
      },
    })
  }

  const customers = mapSalesCustomers(customersData?.customers)
  const customerOptions = customerSelectOptions(
    customers,
    customersLoading ? 'Loading customers…' : 'Select customer…',
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Enquiry</h1>
        <p className="text-gray-500">
          Create a new enquiry. Use the <span className="font-semibold text-slate-700">eye</span> button (top
          right) to open past enquiries, send them for approval, and inspect details.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{errorMsg}</div>
      )}

      <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
          <span className="text-xs font-semibold text-white">New Sales Enquiry</span>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <SelectFloating
              label="Customer"
              value={formData.customerId}
              onChange={(e) => setF('customerId', typeof e === 'string' ? e : e.target.value)}
              options={customerOptions}
              className="h-7 text-xs"
            />
            <SelectFloating
              label="Enquiry source"
              value={formData.enquirySource}
              onChange={(e) => setF('enquirySource', typeof e === 'string' ? e : e.target.value)}
              options={ENQUIRY_SOURCE_OPTS}
              className="h-7 text-xs"
            />
            <SelectFloating
              label="Priority"
              value={formData.priority}
              onChange={(e) => setF('priority', typeof e === 'string' ? e : e.target.value)}
              options={PRIORITY_OPTS}
              className="h-7 text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3">
              <InputFloating
                label="Subject"
                value={formData.subject}
                onChange={(e) => setF('subject', e.target.value)}
                placeholder=""
                maxLength={255}
                className="h-7 text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">Enquiry detail lines</span>
            </div>
            <table className="w-full text-xs border border-gray-200 rounded">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2 font-medium text-gray-600 w-36">Project type</th>
                  <th className="text-left p-2 font-medium text-gray-600">Location</th>
                  <th className="text-left p-2 font-medium text-gray-600 w-28">Currency</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="p-1">
                    <select
                      className={cellInput}
                      value={formData.projectType}
                      onChange={(e) => setF('projectType', e.target.value)}
                    >
                      {PROJECT_TYPE_OPTS.map((o) => (
                        <option key={`pt-${o.value || 'none'}`} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      className={cellInput}
                      value={formData.location}
                      onChange={(e) => setF('location', e.target.value)}
                      placeholder="Location"
                    />
                  </td>
                  <td className="p-1">
                    <select
                      className={cellInput}
                      value={formData.currency}
                      onChange={(e) => setF('currency', e.target.value)}
                    >
                      {CURRENCY_OPTS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <InputFloating
              label="Estimated start"
              type="date"
              value={formData.estimatedStartDate}
              onChange={(e) => setF('estimatedStartDate', e.target.value)}
              className="h-7 text-xs"
            />
            <InputFloating
              label="Estimated end"
              type="date"
              value={formData.estimatedEndDate}
              onChange={(e) => setF('estimatedEndDate', e.target.value)}
              className="h-7 text-xs"
            />
            <InputFloating
              label="Budget"
              type="number"
              step="0.01"
              value={formData.budget}
              onChange={(e) => setF('budget', e.target.value)}
              className="h-7 text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <InputFloating
              label="Assigned to (user ID)"
              value={formData.assignedTo}
              onChange={(e) => setF('assignedTo', e.target.value)}
              className="h-7 text-xs"
            />
          </div>

          <InputFloating
            label="Project scope"
            multiline
            rows={3}
            value={formData.projectScope}
            onChange={(e) => setF('projectScope', e.target.value)}
            className="text-xs min-h-[72px]"
          />

          <InputFloating
            label="Notes"
            multiline
            rows={2}
            value={formData.notes}
            onChange={(e) => setF('notes', e.target.value)}
            className="text-xs"
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData(EMPTY_FORM)
                setErrorMsg('')
              }}
              className="h-8 text-xs"
            >
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={submitting || !orgId}
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              {submitting ? 'Saving…' : 'Save Enquiry'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
