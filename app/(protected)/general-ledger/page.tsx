'use client'

import { useQuery } from '@apollo/client'
import { GET_GENERAL_LEDGERS, GET_CHART_OF_ACCOUNTS } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function GeneralLedgerPage() {
  const { user } = useAuth()
  
  const { data: ledgerData, loading: ledgerLoading } = useQuery(GET_GENERAL_LEDGERS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
  })

  const { data: accountsData } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">General Ledger</h1>
          <p className="text-gray-500">Manage financial transactions and chart of accounts</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{ledgerData?.generalLedgers?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chart of Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{accountsData?.chartOfAccounts?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Fiscal Year</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{new Date().getFullYear()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {ledgerLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Transaction #</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Debit Account</th>
                    <th className="text-left p-2">Credit Account</th>
                    <th className="text-right p-2">Amount</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerData?.generalLedgers?.map((ledger: any) => (
                    <tr key={ledger.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{ledger.transactionNumber}</td>
                      <td className="p-2">{new Date(ledger.transactionDate).toLocaleDateString()}</td>
                      <td className="p-2">{ledger.transactionType}</td>
                      <td className="p-2">{ledger.debitAccount}</td>
                      <td className="p-2">{ledger.creditAccount}</td>
                      <td className="p-2 text-right">${ledger.amount.toFixed(2)}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {ledger.status}
                        </span>
                      </td>
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
