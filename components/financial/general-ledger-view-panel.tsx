'use client'

import { X, Download, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'
import { downloadDocumentPdf, downloadPdf, escapeHtml, pdfMoney, wrapHtmlForPdf } from '@/lib/pdf-download'
import type { JournalEntryView } from './journal-entry-view-panel'
import { JournalEntryViewPanel } from './journal-entry-view-panel'
import { resolveJournalForLedger } from '@/lib/ledger-journal-link'

export type GeneralLedgerView = {
  id: string
  transactionNumber?: string | null
  transactionDate?: string | null
  transactionType?: string | null
  referenceModule?: string | null
  referenceId?: string | null
  debitAccount?: string | null
  creditAccount?: string | null
  amount?: number | null
  currency?: string | null
  description?: string | null
  fiscalYear?: string | null
  fiscalPeriod?: string | null
  status?: string | null
  createdAt?: string | null
}

function glTransactionPdfBody(row: GeneralLedgerView): string {
  return `
    <div class="pdf-meta">
      <div><strong>Transaction #:</strong> ${escapeHtml(row.transactionNumber)}</div>
      <div><strong>Date:</strong> ${escapeHtml(row.transactionDate ? formatDate(row.transactionDate) : '—')}</div>
      <div><strong>Type:</strong> ${escapeHtml(row.transactionType)}</div>
      <div><strong>Status:</strong> ${escapeHtml(row.status)}</div>
    </div>
    <table>
      <tbody>
        <tr><td>Debit account</td><td>${escapeHtml(row.debitAccount)}</td></tr>
        <tr><td>Credit account</td><td>${escapeHtml(row.creditAccount)}</td></tr>
        <tr><td>Amount</td><td class="num">${pdfMoney(row.amount)}</td></tr>
        <tr><td>Description</td><td>${escapeHtml(row.description)}</td></tr>
        <tr><td>Source module</td><td>${escapeHtml(row.referenceModule)}</td></tr>
        <tr><td>Source id</td><td class="font-mono">${escapeHtml(row.referenceId)}</td></tr>
        <tr><td>Fiscal year / period</td><td>${escapeHtml(row.fiscalYear)} / ${escapeHtml(row.fiscalPeriod)}</td></tr>
      </tbody>
    </table>
  `
}

function GlTransactionInlinePanel({ row, onClose }: { row: GeneralLedgerView; onClose: () => void }) {
  const statusColor: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    posted: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
        <span className="text-xs font-semibold text-white">
          Ledger transaction — {row.transactionNumber || row.id}
        </span>
        <button type="button" onClick={onClose} className="text-blue-200 hover:text-white" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 border-b border-gray-200 text-xs">
        <MetaCell label="Date" value={row.transactionDate ? formatDate(row.transactionDate) : '—'} />
        <MetaCell label="Type" value={row.transactionType || '—'} />
        <MetaCell label="Amount" value={formatMoney(row.amount ?? 0)} />
        <MetaCell label="Debit account" value={row.debitAccount || '—'} />
        <MetaCell label="Credit account" value={row.creditAccount || '—'} />
        <MetaCell label="Status" value={row.status || '—'} />
      </div>

      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 space-y-2 text-xs">
        {row.description && (
          <p className="text-gray-700">
            <span className="text-gray-400 font-medium">Description: </span>
            {row.description}
          </p>
        )}
        <p className="text-gray-600 font-mono text-[10px]">
          Source: {row.referenceModule || '—'} · {row.referenceId || '—'}
        </p>
        <p className="text-gray-500">
          Fiscal {row.fiscalYear || '—'} / {row.fiscalPeriod || '—'}
          {row.status && (
            <span className={`ml-2 px-2 py-0.5 rounded capitalize ${statusColor[row.status] ?? 'bg-gray-100 text-gray-700'}`}>
              {row.status}
            </span>
          )}
        </p>
        <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-amber-900">
          <BookOpen className="h-4 w-4 shrink-0" />
          <span>No linked journal entry for this row.</span>
        </div>
      </div>

      <div className="p-2 flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          onClick={() =>
            downloadPdf({
              html: wrapHtmlForPdf({
                title: 'General Ledger Transaction',
                subtitle: row.transactionNumber ?? undefined,
                body: glTransactionPdfBody(row),
              }),
              filename: `gl-${row.transactionNumber || row.id}`,
            }).catch(() => alert('Could not download PDF.'))
          }
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          Download PDF
        </Button>
      </div>
    </div>
  )
}

/** Inline panel above the ledger table (quotation-style). */
export function GeneralLedgerViewPanel({
  row,
  journalEntries,
  onClose,
}: {
  row: GeneralLedgerView
  journalEntries: JournalEntryView[]
  onClose: () => void
}) {
  const linked = resolveJournalForLedger(row, journalEntries)
  const fullJournal = linked
    ? journalEntries.find((e) => String(e.id) === linked.id)
    : null

  if (fullJournal) {
    return (
      <div className="space-y-2">
        <JournalEntryViewPanel
          entry={fullJournal}
          onClose={onClose}
          subtitle={`from ledger ${row.transactionNumber || row.id}`}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-gray-500"
            onClick={() =>
              downloadPdf({
                html: wrapHtmlForPdf({
                  title: 'General Ledger Transaction',
                  subtitle: row.transactionNumber ?? undefined,
                  body: glTransactionPdfBody(row),
                }),
                filename: `gl-${row.transactionNumber || row.id}`,
              }).catch(() => alert('Could not download transaction PDF.'))
            }
          >
            <Download className="h-3 w-3 mr-1" />
            Download GL transaction PDF
          </Button>
        </div>
      </div>
    )
  }

  return <GlTransactionInlinePanel row={row} onClose={onClose} />
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-gray-200 last:border-r-0 p-2">
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="mt-0.5 text-gray-800 font-medium">{value}</p>
    </div>
  )
}

export function downloadGeneralLedgerJournalPdf(
  row: GeneralLedgerView,
  journalEntries: JournalEntryView[],
): void {
  const linked = resolveJournalForLedger(row, journalEntries)
  if (!linked) {
    alert('No journal entry linked to this transaction.')
    return
  }
  downloadDocumentPdf('journal-entry', linked.id, linked.entryNumber).catch(() =>
    alert('Could not download journal PDF.'),
  )
}
