'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_DELIVERY_CHALLANS, CREATE_DELIVERY_CHALLAN } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Save, X } from 'lucide-react'

export default function DeliveryChallansPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    docDate: new Date().toISOString().split('T')[0],
    status: 'DRAFT',
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
        status: 'DRAFT',
        organizationId: orgId,
      })
      refetch()
    },
    onError: (err) => setError(err.message),
  })

  const items = data?.deliverychallans || []
  const handleSave = () => {
    if (!form.docDate) {
      setError('Document date is required.')
      return
    }
    createDeliveryChallan({ variables: { input: form } })
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
            <button onClick={() => { setAdding(false); setError('') }} className="text-blue-200 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2">
            <div className="border border-gray-300 rounded overflow-x-auto">
              <div className="grid bg-[#f0f0f0] border-b border-gray-300" style={{ gridTemplateColumns: '11rem 10rem 14rem 7rem' }}>
                {['Doc Date', 'Status', 'Organization', 'Action'].map((h, i) => (
                  <div key={i} className="px-2 py-1.5 text-xs font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</div>
                ))}
              </div>
              <div className="grid min-w-[42rem]" style={{ gridTemplateColumns: '11rem 10rem 14rem 7rem' }}>
                <div className="border-r border-gray-200 px-1 py-1">
                  <input
                    type="date"
                    value={form.docDate}
                    onChange={(e) => setForm((p) => ({ ...p, docDate: e.target.value }))}
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div className="border-r border-gray-200 px-1 py-1">
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                    className="w-full h-8 px-2 border border-gray-300 rounded text-xs bg-white outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>
                <div className="border-r border-gray-200 px-1 py-1">
                  <input
                    type="text"
                    value={form.organizationId}
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
                    {['Document #', 'Date', 'Status', 'Created'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-gray-600 border-r border-gray-300 last:border-r-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, idx: number) => (
                    <tr key={item.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-3 py-2 border-r border-gray-200 font-mono">{item.docNumber || 'N/A'}</td>
                      <td className="px-3 py-2 border-r border-gray-200">{item.docDate ? new Date(item.docDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs border border-blue-200">
                          {item.status || 'DRAFT'}
                        </span>
                      </td>
                      <td className="px-3 py-2">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
