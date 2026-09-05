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
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
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

  const columns: Column[] = [
    { key: 'transactionNumber', label: 'Transaction #', sortable: true, render: (v) => <MonoCell value={v} /> },
    { key: 'transactionDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'transactionType', label: 'Type', width: '120px', render: (v) => <span className="text-sm capitalize">{v}</span> },
    { key: 'debitAccount', label: 'Debit Account', render: (v) => <span className="text-sm">{v}</span> },
    { key: 'creditAccount', label: 'Credit Account', render: (v) => <span className="text-sm">{v}</span> },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '90px', render: (v) => <ErpBadge status={String(v)} /> },
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
    <div className="erp-shell">
      <PageHeader
        title="General Ledger"
        subtitle="View financial transactions — click a row to open details"
        icon={<BookOpen className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'General Ledger' }]}
      />

      {orgId && !ledgerLoading && (
        <LedgerSummaryCards summary={summary} variant="ledger" />
      )}

      <StatsRow cols={3}>
        <StatCard label="Chart of Accounts" value={accounts.length} icon={<BookOpen className="h-5 w-5" />} variant="green" />
        <StatCard label="Current Fiscal Year" value={new Date().getFullYear()} icon={<Calendar className="h-5 w-5" />} variant="violet" />
        <StatCard label="Open Receivable" value={formatMoney(summary.openReceivable ?? 0)} icon={<DollarSign className="h-5 w-5" />} variant="teal" />
      </StatsRow>

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
        searchPlaceholder="Search transactions…"
        emptyMessage="No transactions found."
        pageSize={25}
        exportable
        onExport={exportCsv}
        onRowClick={(row) => openView(row as GeneralLedgerView)}
        actions={[
          {
            label: 'View',
            icon: <Eye className="h-3.5 w-3.5" />,
            onClick: (row) => openView(row as GeneralLedgerView),
          },
          {
            label: 'Download journal PDF',
            icon: <Download className="h-3.5 w-3.5" />,
            onClick: (row) =>
              downloadGeneralLedgerJournalPdf(row as GeneralLedgerView, journalEntries),
          },
        ]}
      />
    </div>
  )
}
