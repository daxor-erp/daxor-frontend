'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  GET_FINANCE_CHARGE_ASSESSMENTS,
  DRAFT_FINANCE_CHARGE_ASSESSMENT,
  POST_FINANCE_CHARGE_ASSESSMENT,
  CANCEL_FINANCE_CHARGE_ASSESSMENT,
} from '@/gql/queries'
import { wsCell, wsHeaderCell, wsLabelCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { Calculator, CheckCircle, RefreshCw, Percent, FileSpreadsheet } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

export default function AssessFinanceChargesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split('T')[0])
  const [annualRatePercent, setAnnualRatePercent] = useState('12')
  const [notes, setNotes] = useState('')
  const [draftId, setDraftId] = useState<string | null>(null)
  const [draftLines, setDraftLines] = useState<any[]>([])
  const [draftNumber, setDraftNumber] = useState('')
  const [draftTotal, setDraftTotal] = useState(0)
  const [error, setError] = useState('')

  const { data: listData, loading: listLoading, refetch: refetchList } = useQuery(
    GET_FINANCE_CHARGE_ASSESSMENTS,
    {
      variables: { organizationId: orgId, page: 1, limit: 50 },
      skip: !orgId,
    },
  )

  const [draftAssessment, { loading: drafting }] = useMutation(DRAFT_FINANCE_CHARGE_ASSESSMENT, {
    onCompleted: (res) => {
      const d = res.draftFinanceChargeAssessment
      setDraftId(d.id)
      setDraftLines(d.lines ?? [])
      setDraftNumber(d.assessmentNumber)
      setDraftTotal(d.totalChargeAmount ?? 0)
      setError('')
      void refetchList()
    },
    onError: (e) => setError(e.message),
  })

  const [postAssessment, { loading: posting }] = useMutation(POST_FINANCE_CHARGE_ASSESSMENT, {
    onCompleted: () => {
      setDraftId(null)
      setDraftLines([])
      setDraftNumber('')
      setDraftTotal(0)
      setError('')
      void refetchList()
    },
    onError: (e) => setError(e.message),
  })

  const [cancelAssessment] = useMutation(CANCEL_FINANCE_CHARGE_ASSESSMENT, {
    onCompleted: () => {
      setDraftId(null)
      setDraftLines([])
      setDraftNumber('')
      setDraftTotal(0)
      void refetchList()
    },
    onError: (e) => setError(e.message),
  })

  const runDraft = () => {
    const rate = parseFloat(annualRatePercent)
    if (Number.isNaN(rate) || rate < 0) {
      setError('Enter a valid annual rate (0 or greater).')
      return
    }
    setError('')
    draftAssessment({
      variables: {
        input: {
          organizationId: orgId,
          asOfDate,
          annualRatePercent: rate,
          notes: notes || undefined,
        },
      },
    })
  }

  const assessments = listData?.financeChargeAssessments ?? []
  const posted = assessments.filter((a: { status: string }) => a.status === 'posted').length
  const draftsCount = assessments.filter((a: { status: string }) => a.status === 'draft').length

  return (
    <div className="p-6 space-y-6 max-w-[1100px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Percent className="h-8 w-8 text-indigo-700" />
          Assess Finance Charges
        </h1>
        <p className="text-gray-500 mt-1">
          Draft finance charges on overdue open invoices using a simple annual rate: charge ≈ outstanding ×
          (rate ÷ 100) × (days overdue ÷ 365). Invoices without a due date use invoice date + 30 days.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Posted assessments', value: posted, icon: CheckCircle, cls: 'text-green-700 bg-green-50' },
          { label: 'Drafts on file', value: draftsCount, icon: FileSpreadsheet, cls: 'text-amber-700 bg-amber-50' },
          {
            label: 'Current draft total',
            value: draftId ? `$${formatMoney(draftTotal)}` : '—',
            icon: Calculator,
            cls: 'text-indigo-700 bg-indigo-50',
          },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm"
          >
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}>
              <Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-lg font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-[#5c6bc0] text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>Assessment parameters</span>
          <span className="opacity-90">Organization-wide overdue scan</span>
        </div>
        <div className="p-3">
          <table className="w-full border-collapse text-xs max-w-[720px]">
            <tbody>
              <tr>
                <td className={wsLabelCell}>As-of date</td>
                <td className={wsCell}>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none font-mono"
                    value={asOfDate}
                    onChange={(e) => setAsOfDate(e.target.value)}
                  />
                </td>
                <td className={wsLabelCell}>Annual rate %</td>
                <td className={wsCell}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full bg-transparent outline-none font-mono"
                    value={annualRatePercent}
                    onChange={(e) => setAnnualRatePercent(e.target.value)}
                    placeholder="e.g. 12"
                  />
                </td>
              </tr>
              <tr>
                <td className={wsLabelCell}>Notes</td>
                <td className={wsCell} colSpan={3}>
                  <input
                    type="text"
                    className="w-full bg-transparent outline-none text-xs"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              type="button"
              size="sm"
              className="h-9 text-xs bg-[#5c6bc0] hover:bg-[#4a5ab9] text-white"
              onClick={runDraft}
              disabled={drafting || !orgId}
            >
              {drafting ? 'Building draft…' : 'Run draft assessment'}
            </Button>
            {draftId && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-9 text-xs"
                  onClick={() => {
                    if (
                      confirm(
                        `Post ${draftNumber} and add ${draftLines.length} finance charge line(s) to invoices?`,
                      )
                    ) {
                      postAssessment({ variables: { id: draftId } })
                    }
                  }}
                  disabled={posting || !draftLines.length}
                >
                  {posting ? 'Posting…' : 'Post charges to invoices'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-9 text-xs"
                  onClick={() => {
                    if (confirm('Cancel this draft assessment?')) {
                      cancelAssessment({ variables: { id: draftId } })
                    }
                  }}
                >
                  Cancel draft
                </Button>
              </>
            )}
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5 mt-2">
              {error}
            </p>
          )}
        </div>
      </div>

      {draftId && (
        <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-800">
            Draft preview — {draftNumber}{' '}
            <span className="font-mono text-indigo-700">
              (total ${formatMoney(draftTotal)})
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs min-w-[800px]">
              <thead>
                <tr>
                  <th className={`${wsHeaderCell} text-left`}>Invoice</th>
                  <th className={`${wsHeaderCell} text-left`}>Bill-to</th>
                  <th className={`${wsHeaderCell} text-right`}>Days overdue</th>
                  <th className={`${wsHeaderCell} ${wsMoney}`}>Outstanding</th>
                  <th className={`${wsHeaderCell} ${wsMoney}`}>Charge</th>
                </tr>
              </thead>
              <tbody>
                {!draftLines.length && (
                  <tr>
                    <td colSpan={5} className={`${wsCell} text-center text-gray-500 py-8`}>
                      No qualifying overdue invoices (or all charges round to zero).
                    </td>
                  </tr>
                )}
                {draftLines.map((row: any) => (
                  <tr key={row.invoiceId} className="hover:bg-gray-50">
                    <td className={`${wsCell} font-mono`}>{row.invoiceNumber || row.invoiceId}</td>
                    <td className={wsCell}>{row.customer?.name || '—'}</td>
                    <td className={`${wsCell} text-right`}>{row.daysOverdue}</td>
                    <td className={`${wsCell} ${wsMoney}`}>{formatMoney(row.outstandingBefore)}</td>
                    <td className={`${wsCell} ${wsMoney} font-semibold text-indigo-800`}>
                      {formatMoney(row.chargeAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Recent assessments</h2>
          <button
            type="button"
            onClick={() => refetchList()}
            className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${listLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className={wsHeaderCell}>#</th>
                <th className={wsHeaderCell}>As-of</th>
                <th className={wsHeaderCell}>Rate %</th>
                <th className={wsHeaderCell}>Status</th>
                <th className={`${wsHeaderCell} ${wsMoney}`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {!assessments.length && (
                <tr>
                  <td colSpan={5} className={`${wsCell} text-center text-gray-400 py-6`}>
                    No assessments yet. Run a draft above.
                  </td>
                </tr>
              )}
              {assessments.map((a: any) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className={`${wsCell} font-mono`}>{a.assessmentNumber}</td>
                  <td className={wsCell}>
                    {a.asOfDate ? formatDate(a.asOfDate) : '—'}
                  </td>
                  <td className={wsCell}>{Number(a.annualRatePercent).toFixed(2)}%</td>
                  <td className={wsCell}>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${
                        a.status === 'posted'
                          ? 'bg-green-50 text-green-800 border-green-200'
                          : a.status === 'draft'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className={`${wsCell} ${wsMoney}`}>{formatMoney(a.totalChargeAmount ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
