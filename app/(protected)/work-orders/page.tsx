'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_WORK_ORDER, GET_WORK_ORDERS } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Plus, Wrench, Clock, CheckCircle2, Activity } from 'lucide-react'

export default function WorkOrdersPage() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [docDate, setDocDate] = useState(new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState('Active')

  const { data, loading, refetch } = useQuery(GET_WORK_ORDERS, {
    variables: { organizationId: user?.organizationId },
    skip: !user?.organizationId,
  })

  const [createWorkOrder, { loading: saving }] = useMutation(CREATE_WORK_ORDER, {
    onCompleted: () => {
      setOpen(false)
      refetch()
    },
  })

  const items: any[] = data?.workorders || []

  const stats = useMemo(() => {
    const active = items.filter((w) => !['CLOSED', 'COMPLETED', 'CANCELLED', 'Completed', 'Cancelled'].includes(String(w.status || ''))).length
    const completed = items.filter((w) => ['COMPLETED', 'CLOSED', 'Completed'].includes(String(w.status || ''))).length
    const inProgress = items.filter((w) => ['IN_PROGRESS', 'In Progress'].includes(String(w.status || ''))).length
    return { active, completed, inProgress }
  }, [items])

  const handleSubmit = () => {
    if (!user?.organizationId) return
    createWorkOrder({
      variables: {
        input: { docDate, status, organizationId: user.organizationId },
      },
    })
  }

  const columns: Column[] = [
    {
      key: 'docNumber',
      label: 'Document #',
      width: '150px',
      render: (v, r: any) => <MonoCell value={v || r.transactionNumber || r.warehouseCode || '—'} />,
    },
    { key: 'docDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'status', label: 'Status', width: '120px', render: (v) => <ErpBadge status={String(v || 'Active')} /> },
    { key: 'createdAt', label: 'Created', width: '110px', render: (v) => <DateCell value={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Work Orders"
        subtitle="Schedule and track shop-floor work orders"
        icon={<Wrench className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Production' }, { label: 'Work Orders' }]}
        actions={
          <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Work Order
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Total" value={items.length} icon={<Wrench className="h-5 w-5" />} variant="slate" />
        <StatCard label="Active" value={stats.active} icon={<Activity className="h-5 w-5" />} variant="blue" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
      </StatsRow>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>New Work Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <InputFloating
              label="Doc Date"
              type="date"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
            />
            <SelectFloating
              label="Status"
              value={status}
              onChange={(v) => setStatus(typeof v === 'string' ? v : v.target.value)}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        title="All Work Orders"
        searchable
        searchPlaceholder="Search work orders…"
        emptyMessage="No work orders found."
        pageSize={25}
      />
    </div>
  )
}
