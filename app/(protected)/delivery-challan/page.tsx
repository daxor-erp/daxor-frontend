'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_DELIVERY_CHALLANS, CREATE_DELIVERY_CHALLAN, SUBMIT_DELIVERY_CHALLAN_FOR_APPROVAL } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Save, X } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

function dcStatusLabel(st: string) {
  const u = String(st || '').toUpperCase()
  if (u === 'DRAFT') return 'Draft'
  if (u === 'SUBMITTED') return 'Pending approval'
  if (u === 'APPROVED') return 'Approved'
  if (u === 'APPROVAL_DECLINED') return 'Declined'
  return st || '—'
}

export default function DeliveryChallansPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    docDate: new Date().toISOString().split('T')[0],
    organizationId: orgId,
  })

  const { data, loading, refetch } = useQuery(GET_DELIVERY_CHALLANS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
  })
  const [createDeliveryChallan, { loading: creating }] = useMutation(CREATE_DELIVERY_CHALLAN, {
    onCompleted: () => {
      setAdding(false)
      setError('')
      setForm({
        docDate: new Date().toISOString().split('T')[0],
        organizationId: orgId,
      })
      refetch()
    },
    onError: (err) => setError(err.message),
  })

  const [submitDeliveryChallanForApproval] = useMutation(SUBMIT_DELIVERY_CHALLAN_FOR_APPROVAL, {
    onCompleted: () => refetch(),
  })

  const items = data?.deliverychallans || []
  const handleSave = () => {
    if (!form.docDate) {
      setError('Document date is required.')
      return
    }
    createDeliveryChallan({
      variables: {
        input: {
          docDate: form.docDate,
          organizationId: orgId,
        },
      },
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Delivery Challans</h1>
          <p className="text-gray-500">Manage delivery challans</p>
        </div>
        <Button onClick={() => { setAdding(true); setError('') }}>
          <Plus className="h-4 w-4 mr-2" />
          New Record
        </Button>
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">New Delivery Challan</span>
            <button type="button" onClick={() => { setAdding(false); setError('') }} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2">
            <div className="border border-gray-300 rounded overflow-x-auto">
              <div className="grid bg-[#f0f0f0] border-b border-gray-300" style={{ gridTemplateColumns: '11rem 14rem 7rem' }}>
                {['Doc Date', 'Organization', 'Action'].map((h, i) => (
                  <div key={i} className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</div>
                ))}
              </div>
              <div className="grid min-w-[32rem]" style={{ gridTemplateColumns: '11rem 14rem 7rem' }}>
                <div className="border-r border-gray-200 px-1 py-1">
                  <input
                    type="date"
                    value={form.docDate}
                    onChange={(e) => setForm((p) => ({ ...p, docDate: e.target.value }))}
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div className="border-r border-gray-200 px-1 py-1">
                  <input
                    type="text"
                    value={orgId}
                    readOnly
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-gray-50 text-gray-700"
                  />
                </div>
                <div className="px-1 py-1">
                  <Button size="sm" onClick={handleSave} disabled={creating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white w-full">
                    <Save className="h-3.5 w-3.5 mr-1" /> {creating ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 px-1">Saves as <strong>Draft</strong>. Send for approval from the list.</p>
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Total Records: {items.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500">No records found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-xs">
                <thead>
                  <tr className="bg-[#f0f0f0] border-b border-gray-300">
                    {['Document #', 'Date', 'Status', 'Org approval', 'Created'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, idx: number) => {
                    const st = String(item.status || '').toUpperCase()
                    const showSubmit = st === 'DRAFT' || st === 'APPROVAL_DECLINED'
                    return (
                      <tr key={item.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-3 py-2 border-r border-gray-200 font-mono">{item.docNumber || 'N/A'}</td>
                        <td className="px-3 py-2 border-r border-gray-200">{item.docDate ? formatDate(item.docDate) : 'N/A'}</td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs border border-blue-200">
                            {dcStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-3 py-2 border-r border-gray-200">
                          {showSubmit ? (
                            <select
                              aria-label="Delivery challan approval action"
                              className="h-7 text-xs rounded-md border border-gray-200 bg-white px-2 max-w-[160px]"
                              defaultValue=""
                              onChange={(e) => {
                                const val = e.target.value
                                e.target.value = ''
                                if (val === 'submit') void submitDeliveryChallanForApproval({ variables: { id: item.id } })
                              }}
                            >
                              <option value="">Change status…</option>
                              <option value="submit">Send for approval</option>
                            </select>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2">{item.createdAt ? formatDate(item.createdAt) : 'N/A'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
