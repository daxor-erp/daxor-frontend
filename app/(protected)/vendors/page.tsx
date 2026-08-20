'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column, commonActions } from '@/components/DataTable'
import { VendorSendForApprovalSheet } from '@/components/vendors/vendor-send-for-approval-sheet'
import { VendorWizardDialog } from '@/components/vendors/vendor-wizard-dialog'
import { GET_VENDORS, DELETE_VENDOR, DEACTIVATE_VENDOR, REACTIVATE_VENDOR } from '@/gql/queries'
import { useSendForApprovalSheet } from '@/hooks/use-send-for-approval-sheet'
import { Trash2, Edit, Building2, CheckCircle, XCircle, Plus, PowerOff, Power } from 'lucide-react'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell } from '@/components/ui/erp-shared'

export default function VendorsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [wizardOpen, setWizardOpen]       = useState(false)
  const [editingVendor, setEditingVendor] = useState<any | null>(null)
  const vendorApprovalSheet = useSendForApprovalSheet<string>()

  const { data, loading, refetch } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const [deleteVendor]     = useMutation(DELETE_VENDOR,     { onCompleted: () => refetch(), onError: (e) => alert(e.message) })
  const [deactivateVendor] = useMutation(DEACTIVATE_VENDOR, { onCompleted: () => refetch(), onError: (e) => alert(e.message) })
  const [reactivateVendor] = useMutation(REACTIVATE_VENDOR, { onCompleted: () => refetch(), onError: (e) => alert(e.message) })

  const handleAdd    = () => { setEditingVendor(null); setWizardOpen(true) }
  const handleEdit   = (v: any) => { setEditingVendor(v); setWizardOpen(true) }
  const handleDelete = (id: string) => { if (confirm('Delete this vendor?')) deleteVendor({ variables: { id } }) }

  const vendors = data?.vendors ?? []
  const stats = {
    total:    vendors.length,
    active:   vendors.filter((v: any) => v.status === 'active').length,
    inactive: vendors.filter((v: any) => v.status === 'inactive').length,
  }

  const fmtAddr = (a: any) => a ? [a.street, a.city, a.zip, a.country].filter(Boolean).join(', ') : ''

  const columns: Column[] = [
    { key: 'seqNo',   label: 'Code',        width: '130px', render: v => <MonoCell value={v} /> },
    { key: 'name',    label: 'Vendor Name', width: '200px', sortable: true, render: v => <span className="font-medium text-sm">{v}</span> },
    { key: 'type',    label: 'Type',        width: '100px', render: v => <span className="capitalize text-sm">{v || '—'}</span> },
    { key: 'email',   label: 'Email',       width: '190px', render: v => <span className="text-sm">{v || '—'}</span> },
    { key: 'phone',   label: 'Phone',       width: '130px', render: v => <span className="text-sm">{v || '—'}</span> },
    { key: 'gstin',   label: 'GSTIN',       width: '160px', render: v => <MonoCell value={v} /> },
    { key: 'address', label: 'Address',     width: '200px', render: v => <span className="text-xs text-muted-foreground truncate">{fmtAddr(v) || '—'}</span> },
    { key: 'status',  label: 'Status',      width: '100px', render: v => <ErpBadge status={String(v)} /> },
    {
      key: '_ap', label: 'Approval', width: '130px',
      render: (_v: any, row: any) => (
        <ErpBadge status={row.orgApprovalStatus === 'submitted' ? 'pending' : (row.orgApprovalStatus ?? 'approved')} />
      ),
    },
  ]

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Vendors"
        subtitle="Manage your suppliers and vendors"
        icon={<Building2 className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Vendors' }]}
        actions={
          <button onClick={handleAdd} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> New Vendor
          </button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total Vendors" value={stats.total}    icon={<Building2   className="h-5 w-5" />} variant="blue"  />
        <StatCard label="Active"        value={stats.active}   icon={<CheckCircle className="h-5 w-5" />} variant="green" />
        <StatCard label="Inactive"      value={stats.inactive} icon={<XCircle     className="h-5 w-5" />} variant="slate" />
      </StatsRow>

      <DataTable
        data={vendors}
        columns={columns}
        loading={loading}
        title="All Vendors"
        onAdd={handleAdd}
        addLabel="New Vendor"
        searchable
        searchPlaceholder="Search vendors..."
        emptyMessage="No vendors yet."
        onRowClick={handleEdit}
        actions={[
          commonActions.sendForApproval({
            entityLabel: 'vendor',
            eligibleTooltip: 'Route this vendor for approval',
            blockedTooltip: 'Approval pending',
            onOpenSheet: (row: any) => vendorApprovalSheet.openFor(row.id),
          }),
          { label: 'Edit',       icon: <Edit     className="h-3.5 w-3.5" />, onClick: (r: any) => handleEdit(r),                                                                                          variant: 'ghost' },
          { label: 'Deactivate', icon: <PowerOff className="h-3.5 w-3.5" />, onClick: (r: any) => { if (confirm(`Deactivate vendor "${r.name}"?`)) deactivateVendor({ variables: { id: r.id } }) }, show: (r: any) => r.status === 'active',   variant: 'ghost' },
          { label: 'Activate',   icon: <Power    className="h-3.5 w-3.5" />, onClick: (r: any) => reactivateVendor({ variables: { id: r.id } }),                                                     show: (r: any) => r.status === 'inactive', variant: 'ghost' },
          { label: 'Delete',     icon: <Trash2   className="h-3.5 w-3.5" />, onClick: (r: any) => handleDelete(r.id),                                                                                                variant: 'ghost' },
        ]}
      />

      <VendorWizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        organizationId={orgId}
        editingVendor={editingVendor}
        onSaved={() => refetch()}
      />

      <VendorSendForApprovalSheet
        open={vendorApprovalSheet.open}
        onOpenChange={vendorApprovalSheet.onOpenChange}
        vendorId={vendorApprovalSheet.entityId}
        organizationId={orgId}
        onSubmitted={() => void refetch()}
      />
    </div>
  )
}
