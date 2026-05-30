'use client'

import { useQuery } from '@apollo/client'
import {
  GET_GENERAL_LEDGERS,
  GET_CHART_OF_ACCOUNTS,
  GET_JOURNAL_ENTRIES,
  GET_CUSTOMER_INVOICES,
  GET_OUTSTANDING_VENDOR_BILLS,
} from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { DollarSign, BookOpen, Calendar, Download, Eye } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'
import { useState, useEffect, useRef, useMemo } from 'react'
import { summarizeLedgerPage } from '@/lib/ledger-totals'
import { LedgerSummaryCards } from '@/components/financial/ledger-summary-cards'
import { downloadCsv } from '@/lib/csv-download'
import {
  GeneralLedgerViewPanel,
  downloadGeneralLedgerJournalPdf,
  type GeneralLedgerView,
} from '@/components/financial/general-ledger-view-panel'
import type { JournalEntryView } from '@/components/financial/journal-entry-view-panel'

export default function GeneralLedgerPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [viewRow, setViewRow] = useState<GeneralLedgerView | null>(null)
  const viewPanelRef = useRef<HTMLDivElement>(null)

  const openView = (row: GeneralLedgerView) => setViewRow(row)

  useEffect(() => {
    if (!viewRow) return
    viewPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [viewRow])

  const { data: ledgerData, loading: ledgerLoading } = useQuery(GET_GENERAL_LEDGERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: accountsData } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: journalData } = useQuery(GET_JOURNAL_ENTRIES, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-first',
  })

  const { data: invoiceData } = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: !orgId,
    fetchPolicy: 'cache-first',
  })

  const { data: vendorBillData } = useQuery(GET_OUTSTANDING_VENDOR_BILLS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-first',
  })

  const ledgers: GeneralLedgerView[] = ledgerData?.generalLedgers || []
  const accounts = accountsData?.chartOfAccounts || []
  const journalEntries: JournalEntryView[] = journalData?.journalEntries || []
  const customerInvoices = invoiceData?.customerinvoices ?? []
  const vendorBills = vendorBillData?.outstandingVendorBills ?? []

  const summary = useMemo(
    () =>
      summarizeLedgerPage(ledgers, journalEntries, accounts, {
        customerInvoices,
        vendorBills,
      }),
    [ledgers, journalEntries, accounts, customerInvoices, vendorBills],
  )

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

  const exportCsv = () => {
    downloadCsv(
      'general-ledger',
      ['Transaction #', 'Date', 'Type', 'Debit', 'Credit', 'Amount', 'Description', 'Status', 'Source module', 'Source id'],
      ledgers.map((r) => [
        r.transactionNumber ?? '',
        r.transactionDate ? formatDate(r.transactionDate) : '',
        r.transactionType ?? '',
        r.debitAccount ?? '',
        r.creditAccount ?? '',
        String(r.amount ?? 0),
        r.description ?? '',
        r.status ?? '',
        r.referenceModule ?? '',
        r.referenceId ?? '',
      ]),
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">General Ledger</h1>
        <p className="text-gray-500">View financial transactions — click a row to open details in the panel above the table</p>
      </div>

      {orgId && !ledgerLoading && (
        <LedgerSummaryCards summary={summary} variant="ledger" />
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Chart of Accounts', value: accounts.length, icon: BookOpen, cls: 'text-green-600 bg-green-50' },
          { label: 'Current Fiscal Year', value: new Date().getFullYear(), icon: Calendar, cls: 'text-purple-600 bg-purple-50' },
          { label: 'Open receivable', value: formatMoney(summary.openReceivable ?? 0), icon: DollarSign, cls: 'text-emerald-600 bg-emerald-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800 tabular-nums">{value}</p></div>
          </div>
        ))}
      </div>

      {viewRow && (
        <div ref={viewPanelRef}>
          <GeneralLedgerViewPanel
            row={viewRow}
            journalEntries={journalEntries}
            onClose={() => setViewRow(null)}
          />
        </div>
      )}

      <DataTable
        data={ledgers}
        columns={columns}
        loading={ledgerLoading}
        title="All Transactions"
        description={viewRow ? 'Click another row to switch transaction' : 'Click a row to view in the panel above'}
        searchable
        searchPlaceholder="Search transactions..."
        emptyMessage="No transactions found."
        exportable
        onExport={exportCsv}
        onRowClick={(row) => openView(row as GeneralLedgerView)}
        actions={[
          {
            label: 'View',
            icon: <Eye className="h-3.5 w-3.5" />,
            onClick: (row) => openView(row as GeneralLedgerView),
            variant: 'ghost',
          },
          {
            label: 'Download journal PDF',
            icon: <Download className="h-3.5 w-3.5" />,
            onClick: (row) =>
              downloadGeneralLedgerJournalPdf(row as GeneralLedgerView, journalEntries),
            variant: 'ghost',
          },
        ]}
      />
    </div>
  )
}
