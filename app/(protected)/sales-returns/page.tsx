'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_SALES_RETURNS, CREATE_SALES_RETURN, SUBMIT_SALES_RETURN_FOR_APPROVAL } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { InputFloating } from '@/components/ui/input-floating'
import { Button } from '@/components/ui/button'
import { Save, Plus, X, Send, RotateCcw, Clock, CheckCircle2 } from 'lucide-react'

function srStatusLabel(st: string) {
  const u = String(st || '').toUpperCase()
  if (u === 'DRAFT') return 'Draft'
  if (u === 'SUBMITTED') return 'Pending approval'
  if (u === 'APPROVED') return 'Approved'
  if (u === 'APPROVAL_DECLINED') return 'Declined'
  return st || '—'
}

export default function SalesReturnsPage() {
  const { user: authUser } = useAuth()
  const orgId = authUser?.organizationId || ''

  const [showNewRecord, setShowNewRecord] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({ docDate: '' })

  const { data, loading, refetch } = useQuery(GET_SALES_RETURNS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createSalesReturn, { loading: saving }] = useMutation(CREATE_SALES_RETURN, {
    onCompleted: () => {
      setFormError('')
      setFormData({ docDate: '' })
      setShowNewRecord(false)
      refetch()
    },
    onError: (err) => setFormError(err.message),
  })

  const [submitSalesReturnForApproval] = useMutation(SUBMIT_SALES_RETURN_FOR_APPROVAL, {
    onCompleted: () => refetch(),
  })

  const items: any[] = data?.salesreturns || []
  const draft = items.filter((i) => ['DRAFT', 'APPROVAL_DECLINED'].includes(String(i.status).toUpperCase())).length
  const approved = items.filter((i) => String(i.status).toUpperCase() === 'APPROVED').length

  const reset = () => {
    setFormData({ docDate: '' })
    setFormError('')
  }

  const openNew = () => {
    reset()
    setFormData({ docDate: new Date().toISOString().slice(0, 10) })
    setShowNewRecord(true)
  }

  const handleSubmit = () => {
    setFormError('')
    if (!orgId) {
      setFormError('Missing organization. Please sign in again.')
      return
    }
    if (!formData.docDate) {
      setFormError('Document date is required.')
      return
    }
    createSalesReturn({
      variables: { input: { docDate: formData.docDate, organizationId: orgId } },
    })
  }

  const columns: Column[] = [
    {
      key: 'docNumber',
      label: 'Document #',
      width: '140px',
      render: (v, r) => <MonoCell value={v || r.transactionNumber || r.warehouseCode || '—'} />,
    },
    { key: 'docDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'status',
      label: 'Status',
      width: '140px',
      render: (v) => <ErpBadge status={srStatusLabel(v)} />,
    },
    { key: 'createdAt', label: 'Created', width: '110px', render: (v) => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Sales Returns"
        subtitle="Manage sales returns"
        icon={<RotateCcw className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Sales Returns' }]}
        actions={
          <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Return
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total" value={items.length} icon={<RotateCcw className="h-5 w-5" />} variant="slate" />
        <StatCard label="Awaiting action" value={draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Approved" value={approved} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </StatsRow>

      {showNewRecord && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">New Sales Return</span>
            <button type="button" onClick={() => { setShowNewRecord(false); reset() }} className="text-primary-foreground/80 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-4 max-w-lg">
            {formError && <div className="text-xs text-red-500">{formError}</div>}
            <InputFloating
              label="Document date *"
              type="date"
              value={formData.docDate}
              onChange={(e) => { setFormData((p) => ({ ...p, docDate: e.target.value })); setFormError('') }}
              className="h-7 text-xs"
            />
            <p className="text-xs text-muted-foreground">New returns are saved as Draft. Use “Send for approval” from the list.</p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => { setShowNewRecord(false); reset() }}>Cancel</Button>
              <Button type="button" size="sm" onClick={handleSubmit} disabled={saving || !orgId}>
                <Save className="h-3.5 w-3.5 mr-1" />{saving ? 'Saving…' : 'Save Return'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        title="All Sales Returns"
        searchable
        searchPlaceholder="Search returns…"
        emptyMessage="No sales returns found."
        pageSize={25}
        actions={[
          {
            label: 'Send for approval',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r) => submitSalesReturnForApproval({ variables: { id: r.id } }),
            show: (r) => ['DRAFT', 'APPROVAL_DECLINED'].includes(String(r.status || '').toUpperCase()),
          },
        ]}
      />
    </div>
  )
}
