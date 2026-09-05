'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { summarizeJournalPage } from '@/lib/ledger-totals'
import { LedgerSummaryCards } from '@/components/financial/ledger-summary-cards'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import {
  GET_JOURNAL_ENTRIES,
  CREATE_JOURNAL_ENTRY,
  POST_JOURNAL_ENTRY,
  DELETE_JOURNAL_ENTRY,
  GET_CHART_OF_ACCOUNTS,
  GET_CUSTOMER_INVOICES,
  GET_OUTSTANDING_VENDOR_BILLS,
} from '@/gql/queries'
import { Trash2, X, Save, Plus, Minus, CheckCircle, Download, Eye, BookOpen, CheckCircle2, Clock, CircleDollarSign } from 'lucide-react'
import { downloadDocumentPdf } from '@/lib/pdf-download'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'
import { downloadCsv } from '@/lib/csv-download'
import { JournalEntryViewPanel, type JournalEntryView } from '@/components/financial/journal-entry-view-panel'

const EMPTY_LINE = { accountCode: '', accountName: '', debit: '', credit: '', description: '' }

export default function MakeJournalEntriesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [viewEntry, setViewEntry] = useState<JournalEntryView | null>(null)
  const viewPanelRef = useRef<HTMLDivElement>(null)

  const openView = (row: JournalEntryView) => {
    setAdding(false)
    reset()
    setViewEntry(row)
  }

  useEffect(() => {
    if (!viewEntry) return
    viewPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [viewEntry])
  const [form, setForm] = useState({
    entryNumber: '',
    entryDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    description: '',
    lines: [{ ...EMPTY_LINE }, { ...EMPTY_LINE }],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_JOURNAL_ENTRIES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: accountsData } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
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

  const [createEntry, { loading: saving }] = useMutation(CREATE_JOURNAL_ENTRY, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [postEntry] = useMutation(POST_JOURNAL_ENTRY, {
    onCompleted: () => refetch(),
  })

  const [deleteEntry] = useMutation(DELETE_JOURNAL_ENTRY, {
    onCompleted: () => refetch(),
  })

  const reset = () => {
    setForm({
      entryNumber: '',
      entryDate: new Date().toISOString().split('T')[0],
      referenceNumber: '',
      description: '',
      lines: [{ ...EMPTY_LINE }, { ...EMPTY_LINE }],
    })
    setErrors({})
  }

  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const setLine = (idx: number, k: string, v: string) => {
    const newLines = [...form.lines]
    newLines[idx] = { ...newLines[idx], [k]: v }
    setForm(p => ({ ...p, lines: newLines }))
  }

  const addLine = () => {
    setForm(p => ({ ...p, lines: [...p.lines, { ...EMPTY_LINE }] }))
  }

  const removeLine = (idx: number) => {
    if (form.lines.length > 2) {
      setForm(p => ({ ...p, lines: p.lines.filter((_, i) => i !== idx) }))
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.entryNumber.trim()) e.entryNumber = 'Required'
    if (!form.description.trim()) e.description = 'Required'

    const totalDebit = form.lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0)
    const totalCredit = form.lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0)

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      e.balance = 'Debits must equal credits'
    }

    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      entryNumber: form.entryNumber,
      entryDate: form.entryDate,
      referenceNumber: form.referenceNumber || undefined,
      description: form.description,
      lines: form.lines.map(l => ({
        accountCode: l.accountCode,
        accountName: l.accountName,
        debit: parseFloat(l.debit) || 0,
        credit: parseFloat(l.credit) || 0,
        description: l.description || undefined,
      })),
      organizationId: orgId,
    }
    createEntry({ variables: { input } })
  }

  const entries: JournalEntryView[] = data?.journalEntries || []
  const accounts = accountsData?.chartOfAccounts || []

  const customerInvoices = invoiceData?.customerinvoices ?? []
  const vendorBills = vendorBillData?.outstandingVendorBills ?? []

  const summary = useMemo(
    () =>
      summarizeJournalPage(
        entries,
        accounts,
        { customerInvoices, vendorBills },
        { postedOnly: false },
      ),
    [entries, accounts, customerInvoices, vendorBills],
  )

  const totalDebit = form.lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0)
  const totalCredit = form.lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  const pageStats = useMemo(() => {
    const draft = entries.filter((e) => e.status === 'draft').length
    const posted = entries.filter((e) => e.status === 'posted').length
    const debitSum = entries.reduce((s, e) => s + Number(e.totalDebit ?? 0), 0)
    return { draft, posted, debitSum }
  }, [entries])

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: (v) => <MonoCell value={v} /> },
    { key: 'entryNumber', label: 'Entry #', sortable: true, render: (v) => <MonoCell value={v} className="font-medium text-foreground" /> },
    { key: 'entryDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'description', label: 'Description', render: (v) => <span className="text-sm">{v}</span> },
    { key: 'totalDebit', label: 'Debit', width: '110px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'totalCredit', label: 'Credit', width: '110px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '90px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  const exportCsv = () => {
    downloadCsv(
      'journal-entries',
      ['Code', 'Entry #', 'Date', 'Reference', 'Description', 'Debit', 'Credit', 'Status'],
      entries.map((e) => [
        e.seqNo ?? '',
        e.entryNumber ?? '',
        e.entryDate ? formatDate(e.entryDate) : '',
        e.referenceNumber ?? '',
        e.description ?? '',
        String(e.totalDebit ?? 0),
        String(e.totalCredit ?? 0),
        e.status ?? '',
      ]),
    )
  }

  return (
    <div className="erp-shell">
      <PageHeader
        title="Make Journal Entries"
        subtitle="Create manual journal entries — click a row to view details"
        icon={<BookOpen className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'Journal Entries' }]}
        actions={
          <Button
            onClick={() => { reset(); setAdding(true); setViewEntry(null) }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Entry
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total Entries" value={entries.length} icon={<BookOpen className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={pageStats.draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Posted" value={pageStats.posted} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Total Debit" value={`₹${(pageStats.debitSum / 1000).toFixed(1)}k`} icon={<CircleDollarSign className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      {adding && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">New Journal Entry</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <InputFloating label="Entry Number *" value={form.entryNumber} onChange={e => setF('entryNumber', e.target.value)} error={errors.entryNumber} className="h-7 text-xs" />
              <InputFloating label="Entry Date" type="date" value={form.entryDate} onChange={e => setF('entryDate', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Reference #" value={form.referenceNumber} onChange={e => setF('referenceNumber', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Description *" value={form.description} onChange={e => setF('description', e.target.value)} error={errors.description} className="h-7 text-xs" />
            </div>

            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Journal Lines</span>
                <Button size="sm" onClick={addLine} className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />Add Line</Button>
              </div>

              {form.lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-2">
                    <InputFloating label="Account Code" value={line.accountCode} onChange={e => setLine(idx, 'accountCode', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-3">
                    <InputFloating label="Account Name" value={line.accountName} onChange={e => setLine(idx, 'accountName', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-2">
                    <InputFloating label="Debit" type="number" value={line.debit} onChange={e => setLine(idx, 'debit', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-2">
                    <InputFloating label="Credit" type="number" value={line.credit} onChange={e => setLine(idx, 'credit', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-2">
                    <InputFloating label="Description" value={line.description} onChange={e => setLine(idx, 'description', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-6">
                    {form.lines.length > 2 && (
                      <button onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700">
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex gap-4">
                  <span className="text-sm">Total Debit: <strong>{formatMoney(totalDebit)}</strong></span>
                  <span className="text-sm">Total Credit: <strong>{formatMoney(totalCredit)}</strong></span>
                  {isBalanced ? (
                    <span className="text-green-600 text-sm flex items-center gap-1"><CheckCircle className="h-4 w-4" />Balanced</span>
                  ) : (
                    <span className="text-red-600 text-sm">Not Balanced</span>
                  )}
                </div>
              </div>
            </div>

            {errors.balance && <p className="text-red-500 text-xs">{errors.balance}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || !isBalanced} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {orgId && !loading && (
        <LedgerSummaryCards summary={summary} variant="journal" />
      )}

      {viewEntry && (
        <div ref={viewPanelRef}>
          <JournalEntryViewPanel entry={viewEntry} onClose={() => setViewEntry(null)} />
        </div>
      )}

      <DataTable
        data={entries}
        columns={columns}
        loading={loading}
        title="All Journal Entries"
        description={viewEntry ? 'Click another row to switch entry' : 'Click a row to view in the panel above'}
        searchable
        searchPlaceholder="Search entries…"
        emptyMessage="No journal entries found."
        pageSize={25}
        exportable
        onExport={exportCsv}
        onRowClick={(row) => openView(row as JournalEntryView)}
        actions={[
          { label: 'View', icon: <Eye className="h-3.5 w-3.5" />, onClick: (row) => openView(row as JournalEntryView) },
          { label: 'Post', icon: <CheckCircle className="h-3.5 w-3.5" />, onClick: (row) => { if (confirm('Post this entry?')) postEntry({ variables: { id: row.id } }) }, show: (row: any) => row.status === 'draft' },
          { label: 'Download PDF', icon: <Download className="h-3.5 w-3.5" />, onClick: (row) => downloadDocumentPdf('journal-entry', row.id, row.entryNumber ?? row.seqNo ?? undefined).catch(() => {}) },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: (row) => { if (confirm('Delete this entry?')) { deleteEntry({ variables: { id: row.id } }); if (viewEntry?.id === row.id) setViewEntry(null) } }, show: (row: any) => row.status === 'draft' },
        ]}
      />

      {accounts.length > 0 && (
        <p className="text-xs text-muted-foreground">{accounts.length} chart of accounts loaded for line coding.</p>
      )}
    </div>
  )
}
