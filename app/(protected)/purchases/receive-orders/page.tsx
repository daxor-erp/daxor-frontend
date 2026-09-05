'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PURCHASE_ORDERS, GET_VENDORS, RECEIVE_PURCHASE_ORDER, APPROVE_PURCHASE_ORDER } from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PackageCheck, Clock, CheckCircle2, CheckCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const today = () => new Date().toISOString().split('T')[0]

const LIST_STATUSES = new Set(['submitted', 'approved', 'sent', 'received'])

export default function ReceiveOrdersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: poData, loading, refetch } = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: vendorData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const [update, { loading: confirming }] = useMutation(RECEIVE_PURCHASE_ORDER, {
    onCompleted: () => {
      setSelected(null)
      setReceiveDate('')
      setDateErr('')
      refetch()
    },
  })
  const [approvePO] = useMutation(APPROVE_PURCHASE_ORDER, { onCompleted: () => refetch() })

  const [selected, setSelected] = useState<any>(null)
  const [receiveDate, setReceiveDate] = useState('')
  const [dateErr, setDateErr] = useState('')

  const orders: any[] = (poData?.purchaseorders ?? []).filter((o: any) => LIST_STATUSES.has(o.status))
  const vendors: any[] = vendorData?.vendors ?? []

  const getVendor = (id: string) => vendors.find((v) => v.id === id || String(v._id) === id)?.name ?? '—'

  const pending = orders.filter((o) => ['submitted', 'approved', 'sent'].includes(o.status))
  const received = orders.filter((o) => o.status === 'received')

  const handleConfirm = () => {
    if (!receiveDate) {
      setDateErr('Required')
      return
    }
    update({ variables: { id: selected.id } })
  }

  const columns: Column[] = [
    { key: 'seqNo', label: 'PO #', width: '140px', render: v => <MonoCell value={v} /> },
    {
      key: 'vendorName',
      label: 'Vendor',
      render: (v, r) => (
        <span className="text-sm font-medium">
          {v || (r.vendorId ? getVendor(r.vendorId) : '—')}
        </span>
      ),
    },
    { key: 'orderDate', label: 'Order Date', width: '110px', render: v => <DateCell value={v} /> },
    { key: 'totalAmount', label: 'Amount', width: '120px', align: 'right', render: v => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '130px', render: v => <ErpBadge status={v} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Receive Orders"
        subtitle="Record receipt of goods against purchase orders"
        icon={<PackageCheck className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Purchases' }, { label: 'Receive Orders' }]}
      />

      <StatsRow cols={3}>
        <StatCard label="Pending Receipt" value={pending.length} icon={<Clock className="h-5 w-5" />} variant="amber" />
        <StatCard label="Received" value={received.length} icon={<PackageCheck className="h-5 w-5" />} variant="green" />
        <StatCard label="Total POs" value={orders.length} icon={<CheckCircle2 className="h-5 w-5" />} variant="slate" />
      </StatsRow>

      <DataTable
        data={orders}
        columns={columns}
        loading={loading}
        title="All Purchase Orders"
        searchable
        searchPlaceholder="Search orders…"
        emptyMessage="No purchase orders to receive."
        pageSize={25}
        actions={[
          {
            label: 'Approve',
            icon: <CheckCheck className="h-3.5 w-3.5" />,
            onClick: (r: any) => approvePO({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'submitted',
          },
          {
            label: 'Receive',
            icon: <PackageCheck className="h-3.5 w-3.5" />,
            onClick: (r: any) => {
              setSelected(r)
              setReceiveDate(today())
            },
            show: (r: any) => r.status === 'approved' || r.status === 'sent',
          },
        ]}
      />

      <FormModal
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null)
            setReceiveDate('')
            setDateErr('')
          }
        }}
        title="Confirm receipt"
        description={selected ? `PO ${selected.seqNo || ''}` : undefined}
        icon={<PackageCheck className="h-5 w-5" />}
        onSubmit={handleConfirm}
        submitLabel={confirming ? 'Saving…' : 'Mark as received'}
        submitting={confirming}
      >
        {selected && (
          <FormSection>
            <div className="mb-4 space-y-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Vendor</span>
                <span className="font-medium truncate">
                  {selected.vendorName || getVendor(selected.vendorId)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium tabular-nums">{formatMoney(selected.totalAmount)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Order date</span>
                <span>{selected.orderDate ? formatDate(selected.orderDate) : '—'}</span>
              </div>
            </div>
            <FieldGrid cols={1}>
              <div className="space-y-1.5">
                <Label className={dateErr ? 'text-destructive' : undefined}>
                  Received date *{dateErr ? ` — ${dateErr}` : ''}
                </Label>
                <Input
                  type="date"
                  value={receiveDate}
                  onChange={(e) => {
                    setReceiveDate(e.target.value)
                    setDateErr('')
                  }}
                />
              </div>
            </FieldGrid>
          </FormSection>
        )}
      </FormModal>
    </div>
  )
}
