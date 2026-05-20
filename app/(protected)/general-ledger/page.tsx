'use client'

import { useQuery } from '@apollo/client'
import { GET_GENERAL_LEDGERS, GET_CHART_OF_ACCOUNTS } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { useRouter } from 'next/navigation'
import { DollarSign, BookOpen, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'

export default function GeneralLedgerPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const { data: ledgerData, loading: ledgerLoading } = useQuery(GET_GENERAL_LEDGERS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
  })

  const { data: accountsData } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
  })

  const ledgers = ledgerData?.generalLedgers || []
  const accounts = accountsData?.chartOfAccounts || []

  const statusColor: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    posted: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
  }

  const columns: Column[] = [
    { key: 'transactionNumber', label: 'Transaction #', sortable: true, render: v => <span className="font-mono text-xs font-medium">{v}</span> },
    { key: 'transactionDate', label: 'Date', width: '110px', render: v => formatDate(v) },
    { key: 'transactionType', label: 'Type', width: '120px', render: v => <span className="text-xs capitalize">{v}</span> },
    { key: 'debitAccount', label: 'Debit Account', render: v => <span className="text-xs">{v}</span> },
    { key: 'creditAccount', label: 'Credit Account', render: v => <span className="text-xs">{v}</span> },
    { key: 'amount', label: 'Amount', width: '120px', render: v => formatMoney(v) },
    { key: 'status', label: 'Status', width: '90px', render: v => <span className={`px-2 py-0.5 rounded text-xs capitalize ${statusColor[v] || 'bg-gray-100 text-gray-700'}`}>{v}</span> },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">General Ledger</h1>
        <p className="text-gray-500">View all financial transactions</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Transactions', value: ledgers.length, icon: DollarSign, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Chart of Accounts', value: accounts.length, icon: BookOpen, cls: 'text-green-600 bg-green-50' },
          { label: 'Current Fiscal Year', value: new Date().getFullYear(), icon: Calendar, cls: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      <DataTable
        data={ledgers}
        columns={columns}
        loading={ledgerLoading}
        title="All Transactions"
        searchable
        searchPlaceholder="Search transactions..."
        emptyMessage="No transactions found."
      />
    </div>
  )
}
