'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import {
  GET_FINANCE_CHARGE_ASSESSMENTS,
  DRAFT_FINANCE_CHARGE_ASSESSMENT,
  POST_FINANCE_CHARGE_ASSESSMENT,
  CANCEL_FINANCE_CHARGE_ASSESSMENT,
} from '@/gql/queries'
import { formatMoney } from '@/lib/format-money'
import { Calculator, CheckCircle2, Percent, Clock, DollarSign } from 'lucide-react'

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
      variables: { organizationId: orgId, page: 1, limit: 200 },
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

  const assessments: any[] = listData?.financeChargeAssessments ?? []
  const posted = assessments.filter((a: { status: string }) => a.status === 'posted').length
  const draftsCount = assessments.filter((a: { status: string }) => a.status === 'draft').length

  const assessmentColumns: Column[] = [
    { key: 'assessmentNumber', label: '#', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'asOfDate', label: 'As-of', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'annualRatePercent',
      label: 'Rate %',
      width: '90px',
      render: (v) => <span className="text-sm tabular-nums">{Number(v).toFixed(2)}%</span>,
    },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <ErpBadge status={v} /> },
    {
      key: 'totalChargeAmount',
      label: 'Total',
      width: '120px',
      align: 'right',
      render: (v) => <AmountCell value={v} />,
    },
  ]

  const draftColumns: Column[] = [
    {
      key: 'invoiceNumber',
      label: 'Invoice',
      width: '140px',
      render: (v, r: any) => <MonoCell value={v || r.invoiceId} />,
    },
    {
      key: 'customer',
      label: 'Bill-to',
      render: (v) => <span className="text-sm font-medium">{v?.name || '—'}</span>,
    },
    {
      key: 'daysOverdue',
      label: 'Days overdue',
      width: '110px',
      align: 'right',
      render: (v) => <span className="text-sm tabular-nums">{v}</span>,
    },
    {
      key: 'outstandingBefore',
      label: 'Outstanding',
      width: '120px',
      align: 'right',
      render: (v) => <AmountCell value={v} />,
    },
    {
      key: 'chargeAmount',
      label: 'Charge',
      width: '120px',
      align: 'right',
      render: (v) => <AmountCell value={v} />,
    },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Assess Finance Charges"
        subtitle="Draft finance charges on overdue open invoices using annual rate × days overdue ÷ 365"
        icon={<Percent className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Customers' }, { label: 'Assess Finance Charges' }]}
      />

      <StatsRow cols={3}>
        <StatCard label="Posted Assessments" value={posted} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Drafts on File" value={draftsCount} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard
          label="Current Draft Total"
          value={draftId ? `₹${(draftTotal / 1000).toFixed(1)}k` : '—'}
          icon={<DollarSign className="h-5 w-5" />}
          variant="blue"
        />
      </StatsRow>

      <div className="rounded-xl border border-border bg-card p-4 space-y-4 mb-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          Assessment parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          <InputFloating
            label="As-of date *"
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
          />
          <InputFloating
            label="Annual rate % *"
            type="number"
            value={annualRatePercent}
            onChange={(e) => setAnnualRatePercent(e.target.value)}
            placeholder="e.g. 12"
          />
          <div className="sm:col-span-2">
            <InputFloating
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={runDraft}
            disabled={drafting || !orgId}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {drafting ? 'Building draft…' : 'Run draft assessment'}
          </Button>
          {draftId && (
            <>
              <Button
                type="button"
                variant="outline"
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
                variant="outline"
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
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded px-2 py-1.5">
            {error}
          </p>
        )}
      </div>

      {draftId && (
        <div className="mb-4">
          <DataTable
            data={draftLines}
            columns={draftColumns}
            title={`Draft Preview — ${draftNumber} (₹${formatMoney(draftTotal)})`}
            emptyMessage="No qualifying overdue invoices (or all charges round to zero)."
            pageSize={50}
            rowKey="invoiceId"
          />
        </div>
      )}

      <DataTable
        data={assessments}
        columns={assessmentColumns}
        loading={listLoading}
        title="All Finance Charge Assessments"
        searchable
        searchPlaceholder="Search assessments…"
        emptyMessage="No assessments yet. Run a draft above."
        pageSize={25}
      />
    </div>
  )
}
