'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_WORK_ORDER, GET_WORK_ORDERS } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Plus } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

export default function WorkOrdersPage() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [docDate, setDocDate] = useState(new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState('Active')

  const { data, loading, refetch } = useQuery(GET_WORK_ORDERS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
  })

  const [createWorkOrder, { loading: saving }] = useMutation(CREATE_WORK_ORDER, {
    onCompleted: () => {
      setOpen(false)
      refetch()
    },
  })

  const items = data?.workorders || []

  const handleSubmit = () => {
    if (!user?.organizationId) return
    createWorkOrder({
      variables: {
        input: { docDate, status, organizationId: user.organizationId },
      },
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-gray-500">Manage work orders</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Record
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>New Work Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <InputFloating
              label="Doc Date"
              type="date"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
            />
            <SelectFloating
              label="Status"
              value={status}
              onChange={(v) => setStatus(typeof v === 'string' ? v : v.target.value)}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Document #</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{item.docNumber || item.transactionNumber || item.warehouseCode || 'N/A'}</td>
                      <td className="p-2">{item.docDate ? formatDate(item.docDate) : 'N/A'}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {item.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-2">{formatDate(item.createdAt)}</td>
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
