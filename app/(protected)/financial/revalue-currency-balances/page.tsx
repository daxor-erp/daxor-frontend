'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { GET_CURRENCY_REVALUATIONS, CREATE_CURRENCY_REVALUATION, POST_CURRENCY_REVALUATION, DELETE_CURRENCY_REVALUATION } from '@/gql/queries'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell, AmountCell } from '@/components/ui/erp-shared'
import { Trash2, X, Save, CheckCircle, Plus, RefreshCw, Clock } from 'lucide-react'

export default function RevalueCurrencyBalancesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    revaluationDate: new Date().toISOString().split('T')[0],
    baseCurrency: 'USD',
  })

  const { data, loading, refetch } = useQuery(GET_CURRENCY_REVALUATIONS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createRevaluation, { loading: saving }] = useMutation(CREATE_CURRENCY_REVALUATION, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [postRevaluation] = useMutation(POST_CURRENCY_REVALUATION, {
    onCompleted: () => refetch(),
  })

  const [deleteRevaluation] = useMutation(DELETE_CURRENCY_REVALUATION, {
    onCompleted: () => refetch(),
  })

  const reset = () => {
    setForm({
      revaluationDate: new Date().toISOString().split('T')[0],
      baseCurrency: 'USD',
    })
  }

  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
  }

  const handleSubmit = () => {
    const input = {
      revaluationDate: form.revaluationDate,
      baseCurrency: form.baseCurrency,
      organizationId: orgId,
    }
    createRevaluation({ variables: { input } })
  }

  const revaluations = data?.currencyRevaluations || []
  const draft = revaluations.filter((r: any) => r.status === 'draft').length
  const posted = revaluations.filter((r: any) => r.status === 'posted').length

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: v => <MonoCell value={v} /> },
    { key: 'revaluationDate', label: 'Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'baseCurrency', label: 'Base Currency', width: '120px' },
    { key: 'totalGainLoss', label: 'Gain/Loss', width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '90px', render: v => <ErpBadge status={String(v)} /> },
    { key: 'createdAt', label: 'Created', width: '110px', render: v => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Revalue Open Currency Balances"
        subtitle="Revalue foreign currency accounts at current exchange rates"
        icon={<RefreshCw className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'Currency Revaluation' }]}
        actions={
          <Button onClick={() => { reset(); setAdding(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Revaluation
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total" value={revaluations.length} icon={<RefreshCw className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Posted" value={posted} icon={<CheckCircle className="h-5 w-5" />} variant="green" />
      </StatsRow>

      {adding && (
        <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">New Currency Revaluation</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-primary-foreground/80 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Revaluation Date" type="date" value={form.revaluationDate} onChange={e => setF('revaluationDate', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Base Currency" value={form.baseCurrency} onChange={e => setF('baseCurrency', e.target.value)} className="h-7 text-xs" />
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded p-3 text-xs text-primary">
              <p className="font-semibold mb-1">Note:</p>
              <p>This will calculate unrealized gains/losses on all open foreign currency balances based on current exchange rates.</p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Processing…' : 'Calculate Revaluation'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={revaluations}
        columns={columns}
        loading={loading}
        title="All Currency Revaluations"
        searchable
        searchPlaceholder="Search revaluations…"
        emptyMessage="No revaluations yet. Click 'New Revaluation' to create one."
        pageSize={25}
        actions={[
          { label: 'Post', icon: <CheckCircle className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Post this revaluation?')) postRevaluation({ variables: { id: row.id } }) }, show: (row: any) => row.status === 'draft' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete this revaluation?')) deleteRevaluation({ variables: { id: row.id } }) }, show: (row: any) => row.status === 'draft' },
        ]}
      />
    </div>
  )
}
