'use client'

import { useQuery } from '@apollo/client'
import { GET_ITEMS } from '@/gql/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'

export default function ItemsPage() {
  const { user } = useAuth()
  const { data, loading } = useQuery(GET_ITEMS, {
    variables: { organizationId: user?.organizationId || '', page: 1, limit: 50 },
    skip: !user?.organizationId,
  })

  return (
    <div className="erp-shell">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="erp-page-title">Items</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.seqNo}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{formatMoney(Number(item.rate) || 0)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
