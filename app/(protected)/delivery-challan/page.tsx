'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_DELIVERY_CHALLANS, CREATE_DELIVERY_CHALLAN, SUBMIT_DELIVERY_CHALLAN_FOR_APPROVAL } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { Plus, Save, X, Send, Truck, Clock, CheckCircle2 } from 'lucide-react'

function dcStatusLabel(st: string) {
  const u = String(st || '').toUpperCase()
  if (u === 'DRAFT') return 'Draft'
  if (u === 'SUBMITTED') return 'Pending approval'
  if (u === 'APPROVED') return 'Approved'
  if (u === 'APPROVAL_DECLINED') return 'Declined'
  return st || '—'
}

export default function DeliveryChallansPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    docDate: new Date().toISOString().split('T')[0],
    organizationId: orgId,
  })

  const { data, loading, refetch } = useQuery(GET_DELIVERY_CHALLANS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
  })

  const [createDeliveryChallan, { loading: creating }] = useMutation(CREATE_DELIVERY_CHALLAN, {
    onCompleted: () => {
      setAdding(false)
      setError('')
      setForm({ docDate: new Date().toISOString().split('T')[0], organizationId: orgId })
      refetch()
    },
    onError: (err) => setError(err.message),
  })

  const [submitDeliveryChallanForApproval] = useMutation(SUBMIT_DELIVERY_CHALLAN_FOR_APPROVAL, {
    onCompleted: () => refetch(),
  })

  const items: any[] = data?.deliverychallans || []
  const draft = items.filter((i) => ['DRAFT', 'APPROVAL_DECLINED'].includes(String(i.status).toUpperCase())).length
  const approved = items.filter((i) => String(i.status).toUpperCase() === 'APPROVED').length

  const handleSave = () => {
    if (!form.docDate) {
      setError('Document date is required.')
      return
    }
    createDeliveryChallan({
      variables: { input: { docDate: form.docDate, organizationId: orgId } },
    })
  }

  const columns: Column[] = [
    { key: 'docNumber', label: 'Document #', width: '140px', render: (v) => <MonoCell value={v || '—'} /> },
    { key: 'docDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    {
      key: 'status',
      label: 'Status',
      width: '140px',
      render: (v) => <ErpBadge status={dcStatusLabel(v)} />,
    },
    { key: 'createdAt', label: 'Created', width: '110px', render: (v) => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Delivery Challans"
        subtitle="Manage delivery challans"
        icon={<Truck className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Delivery Challans' }]}
        actions={
          <Button
            onClick={() => { setAdding(true); setError('') }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Challan
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total" value={items.length} icon={<Truck className="h-5 w-5" />} variant="slate" />
        <StatCard label="Awaiting action" value={draft} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Approved" value={approved} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </StatsRow>

      {adding && (
        <div className="bg-card border border-primary/30 rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="flex items-center justify-between px-3 py-2 bg-primary">
            <span className="text-xs font-semibold text-white">New Delivery Challan</span>
            <button type="button" onClick={() => { setAdding(false); setError('') }} className="text-primary-foreground/80 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3 max-w-md">
            <InputFloating
              label="Doc Date *"
              type="date"
              value={form.docDate}
              onChange={(e) => setForm((p) => ({ ...p, docDate: e.target.value }))}
              className="h-7 text-xs"
            />
            <p className="text-xs text-muted-foreground">Saves as Draft. Send for approval from the list.</p>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setError('') }}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={creating}>
                <Save className="h-3.5 w-3.5 mr-1" /> {creating ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        title="All Delivery Challans"
        searchable
        searchPlaceholder="Search challans…"
        emptyMessage="No delivery challans found."
        pageSize={25}
        actions={[
          {
            label: 'Send for approval',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r) => submitDeliveryChallanForApproval({ variables: { id: r.id } }),
            show: (r) => ['DRAFT', 'APPROVAL_DECLINED'].includes(String(r.status || '').toUpperCase()),
          },
        ]}
      />
    </div>
  )
}
