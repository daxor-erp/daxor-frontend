'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { GET_CURRENCY_REVALUATIONS, CREATE_CURRENCY_REVALUATION, POST_CURRENCY_REVALUATION, DELETE_CURRENCY_REVALUATION } from '@/gql/queries'
import { Trash2, X, Save, CheckCircle } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { formatMoney } from '@/lib/format-money'

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

  const statusColor: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-700',
    posted: 'bg-green-100 text-green-700',
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'revaluationDate', label: 'Date', width: '110px', render: v => formatDate(v) },
    { key: 'baseCurrency', label: 'Base Currency', width: '120px' },
    { key: 'totalGainLoss', label: 'Gain/Loss', width: '120px', render: v => <span className={v >= 0 ? 'text-green-600' : 'text-red-600'}>{formatMoney(v)}</span> },
    { key: 'status', label: 'Status', width: '90px', render: v => <span className={`px-2 py-0.5 rounded text-xs capitalize ${statusColor[v]}`}>{v}</span> },
    { key: 'createdAt', label: 'Created', width: '110px', render: v => formatDate(v) },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revalue Open Currency Balances</h1>
        <p className="text-gray-500">Revalue foreign currency accounts at current exchange rates</p>
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">New Currency Revaluation</span>
            <button onClick={() => { setAdding(false); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputFloating label="Revaluation Date" type="date" value={form.revaluationDate} onChange={e => setF('revaluationDate', e.target.value)} className="h-7 text-xs" />
              <InputFloating label="Base Currency" value={form.baseCurrency} onChange={e => setF('baseCurrency', e.target.value)} className="h-7 text-xs" />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
              <p className="font-semibold mb-1">Note:</p>
              <p>This will calculate unrealized gains/losses on all open foreign currency balances based on current exchange rates.</p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
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
        title="Currency Revaluations"
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Revaluation"
        searchable
        searchPlaceholder="Search revaluations..."
        emptyMessage="No revaluations yet. Click 'New Revaluation' to create one."
        actions={[
          { label: 'Post', icon: <CheckCircle className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Post this revaluation?')) postRevaluation({ variables: { id: row.id } }) }, variant: 'ghost', show: (row: any) => row.status === 'draft' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete this revaluation?')) deleteRevaluation({ variables: { id: row.id } }) }, variant: 'ghost', show: (row: any) => row.status === 'draft' },
        ]}
      />
    </div>
  )
}
