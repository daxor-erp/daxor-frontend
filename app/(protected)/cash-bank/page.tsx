'use client'

import { useQuery } from '@apollo/client'
import { GET_CASH_BANKS } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Cash__TITLE_CAMEL__BankPage() {
  const { user } = useAuth()
  
  const { data, loading } = useQuery(GET_CASH_BANKS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
  })

  const items = data?.cashBanks || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cash __TITLE__ Bank</h1>
          <p className="text-gray-500">Manage cash __TITLE_LOWER__ bank</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Record
        </Button>
      </div>

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
                      <td className="p-2">{item.docDate ? new Date(item.docDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {item.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
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
