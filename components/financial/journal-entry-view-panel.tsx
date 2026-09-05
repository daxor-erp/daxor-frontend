'use client'

import { X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'
import { entityRefLabel } from '@/lib/format-status'
import { downloadDocumentPdf } from '@/lib/pdf-download'

export type JournalEntryLine = {
  accountCode?: string | null
  accountName?: string | null
  debit?: number | null
  credit?: number | null
  description?: string | null
}

export type JournalEntryView = {
  id: string
  seqNo?: string | null
  entryNumber?: string | null
  entryDate?: string | null
  referenceNumber?: string | null
  description?: string | null
  lines?: JournalEntryLine[] | null
  totalDebit?: number | null
  totalCredit?: number | null
  status?: string | null
  postedAt?: string | null
}

const statusColor: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-700',
  posted: 'bg-green-100 text-green-700',
}

/** Inline panel (quotation-style) — place above the list table. */
export function JournalEntryViewPanel({
  entry,
  onClose,
  subtitle,
}: {
  entry: JournalEntryView
  onClose: () => void
  subtitle?: string
}) {
  const lines = entry.lines ?? []
  const label = entityRefLabel(entry.entryNumber, entry.seqNo)

  return (
    <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-primary">
        <span className="text-xs font-semibold text-white">
          Journal entry — {label}
          {subtitle ? ` · ${subtitle}` : ''}
        </span>
        <button type="button" onClick={onClose} className="text-primary-foreground/80 hover:text-white" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-4 border-b border-gray-200 text-xs">
        <MetaCell label="Date" value={entry.entryDate ? formatDate(entry.entryDate) : '—'} />
        <MetaCell label="Reference" value={entry.referenceNumber || '—'} mono />
        <MetaCell label="Total debit" value={formatMoney(entry.totalDebit ?? 0)} />
        <MetaCell label="Total credit" value={formatMoney(entry.totalCredit ?? 0)} />
      </div>

      {(entry.description || entry.status || entry.postedAt) && (
        <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center gap-3 text-xs">
          {entry.description && (
            <span className="text-gray-700">
              <span className="text-gray-400 font-medium">Description: </span>
              {entry.description}
            </span>
          )}
          {entry.status && (
            <span className={`px-2 py-0.5 rounded capitalize ${statusColor[entry.status] ?? 'bg-gray-100 text-gray-700'}`}>
              {entry.status}
            </span>
          )}
          {entry.postedAt && (
            <span className="text-gray-500">Posted {formatDate(entry.postedAt)}</span>
          )}
        </div>
      )}

      <div className="p-2">
        <div className="border border-gray-300 rounded overflow-hidden">
          <div className="flex bg-muted/70 border-b border-gray-300">
            <div className="w-8 border-r border-gray-300 py-1.5 text-center text-xs font-semibold text-gray-600">#</div>
            <div className="flex-1 border-r border-gray-300 px-2 py-1.5 text-xs font-semibold text-gray-600">Account</div>
            <div className="w-28 border-r border-gray-300 px-2 py-1.5 text-xs font-semibold text-gray-600 text-right">Debit</div>
            <div className="w-28 px-2 py-1.5 text-xs font-semibold text-gray-600 text-right">Credit</div>
          </div>
          {lines.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">No lines</div>
          ) : (
            lines.map((line, i) => (
              <div
                key={i}
                className={`flex border-b border-gray-200 last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                <div className="w-8 border-r border-gray-200 flex items-center justify-center text-xs text-gray-300 py-2">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0 border-r border-gray-200 px-2 py-2">
                  <span className="font-mono text-[10px] text-gray-500">{line.accountCode}</span>
                  <span className="block text-xs text-gray-800">{line.accountName || '—'}</span>
                  {line.description && (
                    <span className="block text-[10px] text-gray-400">{line.description}</span>
                  )}
                </div>
                <div className="w-28 border-r border-gray-200 px-2 py-2 text-xs text-right tabular-nums">
                  {Number(line.debit) ? formatMoney(line.debit) : '—'}
                </div>
                <div className="w-28 px-2 py-2 text-xs text-right tabular-nums">
                  {Number(line.credit) ? formatMoney(line.credit) : '—'}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
           
            onClick={() =>
              downloadDocumentPdf('journal-entry', entry.id, label).catch(() =>
                alert('Could not download PDF. Sign in again or try later.'),
              )
            }
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  )
}

function MetaCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-r border-gray-200 last:border-r-0 p-2">
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`mt-0.5 text-gray-800 font-medium ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}
