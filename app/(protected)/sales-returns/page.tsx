'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_SALES_RETURNS, CREATE_SALES_RETURN, SUBMIT_SALES_RETURN_FOR_APPROVAL } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { Save, Plus, X } from 'lucide-react'

function srStatusLabel(st: string) {
  const u = String(st || '').toUpperCase()
  if (u === 'DRAFT') return 'Draft'
  if (u === 'SUBMITTED') return 'Pending approval'
  if (u === 'APPROVED') return 'Approved'
  if (u === 'APPROVAL_DECLINED') return 'Declined'
  return st || '—'
}

export default function SalesReturnsPage() {
  const { user: authUser } = useAuth()
  const orgId = authUser?.organizationId || ''

  const [showNewRecord, setShowNewRecord] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({ docDate: '' })

  const { data, loading, refetch } = useQuery(GET_SALES_RETURNS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createSalesReturn, { loading: saving }] = useMutation(CREATE_SALES_RETURN, {
    onCompleted: () => {
      setFormError('')
      setFormData({ docDate: '' })
      setShowNewRecord(false)
      refetch()
    },
    onError: (err) => setFormError(err.message),
  })

  const [submitSalesReturnForApproval] = useMutation(SUBMIT_SALES_RETURN_FOR_APPROVAL, {
    onCompleted: () => refetch(),
  })

  const items = data?.salesreturns || []

  const reset = () => {
    setFormData({ docDate: '' })
    setFormError('')
  }

  const openNew = () => {
    reset()
    const today = new Date().toISOString().slice(0, 10)
    setFormData({ docDate: today })
    setShowNewRecord(true)
  }

  const setF = (k: keyof typeof formData, v: string) => {
    setFormData((p) => ({ ...p, [k]: v }))
    setFormError('')
  }

  const handleSubmit = () => {
    setFormError('')
    if (!orgId) {
      setFormError('Missing organization. Please sign in again.')
      return
    }
    if (!formData.docDate) {
      setFormError('Document date is required.')
      return
    }
    createSalesReturn({
      variables: {
        input: {
          docDate: formData.docDate,
          organizationId: orgId,
        },
      },
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Returns</h1>
          <p className="text-gray-500">Manage sales returns</p>
        </div>
        <Button type="button" onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Record
        </Button>
      </div>

      {showNewRecord && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">New Sales Return</span>
            <button
              type="button"
              onClick={() => {
                setShowNewRecord(false)
                reset()
              }}
              className="text-blue-200 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {formError && <div className="text-xs text-red-500">{formError}</div>}

            <div className="grid grid-cols-2 gap-3 max-w-lg">
              <InputFloating
                label="Document date *"
                type="date"
                value={formData.docDate}
                onChange={(e) => setF('docDate', e.target.value)}
                className="h-7 text-xs"
              />
              <div className="flex flex-col justify-end pb-1">
                <span className="text-[10px] text-gray-400 px-1">Organization</span>
                <span className="text-xs text-gray-700 border border-gray-200 rounded px-2 py-1.5 bg-gray-50 truncate" title={orgId}>
                  {orgId || '—'}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500">New returns are saved as <strong>Draft</strong>. Use “Send for approval” from the list.</p>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowNewRecord(false)
                  reset()
                }}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSubmit}
                disabled={saving || !orgId}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {saving ? 'Saving…' : 'Save Return'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">All Returns</h2>
          <p className="text-xs text-gray-500">Total records: {items.length}</p>
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500">No records found. Click New Record to add one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 font-medium text-gray-600">Document #</th>
                    <th className="text-left p-2 font-medium text-gray-600">Date</th>
                    <th className="text-left p-2 font-medium text-gray-600">Status</th>
                    <th className="text-left p-2 font-medium text-gray-600">Org approval</th>
                    <th className="text-left p-2 font-medium text-gray-600">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any) => {
                    const st = String(item.status || '').toUpperCase()
                    const showSubmit = st === 'DRAFT' || st === 'APPROVAL_DECLINED'
                    return (
                      <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50/80">
                        <td className="p-2 font-mono text-gray-600">{item.docNumber || item.transactionNumber || item.warehouseCode || 'N/A'}</td>
                        <td className="p-2">{item.docDate ? new Date(item.docDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-2">
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                            {srStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="p-2">
                          {showSubmit ? (
                            <select
                              aria-label="Sales return approval action"
                              className="h-7 text-xs rounded-md border border-gray-200 bg-white px-2 max-w-[160px]"
                              defaultValue=""
                              onChange={(e) => {
                                const val = e.target.value
                                e.target.value = ''
                                if (val === 'submit') void submitSalesReturnForApproval({ variables: { id: item.id } })
                              }}
                            >
                              <option value="">Change status…</option>
                              <option value="submit">Send for approval</option>
                            </select>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="p-2">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
