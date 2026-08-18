'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column, commonActions } from '@/components/DataTable'
import { VendorSendForApprovalSheet } from '@/components/vendors/vendor-send-for-approval-sheet'
import { VendorWizardDialog } from '@/components/vendors/vendor-wizard-dialog'
import { GET_VENDORS, DELETE_VENDOR } from '@/gql/queries'
import { useSendForApprovalSheet } from '@/hooks/use-send-for-approval-sheet'
import { Trash2, Edit, Building2, CheckCircle, XCircle } from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'

export default function VendorsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [wizardOpen, setWizardOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<any | null>(null)

  const vendorApprovalSheet = useSendForApprovalSheet<string>()

  const { data, loading, refetch } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 100 },
    skip: !orgId,
  })

  const [deleteVendor] = useMutation(DELETE_VENDOR, {
    onCompleted: () => refetch(),
  })

  const handleAdd = () => {
    setEditingVendor(null)
    setWizardOpen(true)
  }

  const handleEdit = (vendor: any) => {
    setEditingVendor(vendor)
    setWizardOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this vendor?')) deleteVendor({ variables: { id } })
  }

  const vendors = data?.vendors ?? []
  const stats = {
    total: vendors.length,
    active: vendors.filter((v: any) => v.status === 'active').length,
    inactive: vendors.filter((v: any) => v.status === 'inactive').length,
  }

  const formatAddress = (a: { street?: string; city?: string; zip?: string; country?: string } | null | undefined) =>
    a ? [a.street, a.city, a.zip, a.country].filter(Boolean).join(', ') : ''

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '140px', render: v => <span className="font-mono text-gray-500 text-xs">{v || '—'}</span> },
    { key: 'name', label: 'Vendor Name', width: '200px', sortable: true, render: v => <span className="font-medium text-gray-800">{v}</span> },
    { key: 'type', label: 'Type', width: '100px', render: v => <span className="text-gray-600 capitalize">{v || '—'}</span> },
    { key: 'email', label: 'Email', width: '190px', render: v => <span className="text-gray-600">{v || '—'}</span> },
    { key: 'phone', label: 'Phone', width: '140px', render: v => <span className="text-gray-600">{v || '—'}</span> },
    { key: 'gstin', label: 'GSTIN', width: '160px', render: v => <span className="text-gray-600 font-mono text-[11px]">{v || '—'}</span> },
    {
      key: 'address', label: 'Address', width: '220px',
      render: (v) => <span className="text-gray-600 truncate">{formatAddress(v) || '—'}</span>,
    },
    {
      key: 'status', label: 'Status', width: '100px',
      render: (v) => <StatusBadge status={String(v)} />,
    },
    {
      key: '_orgApproval',
      label: 'Org approval',
      width: '128px',
      render: (_v, row: { orgApprovalStatus?: string }) => {
        const ap = String(row.orgApprovalStatus ?? 'approved').toLowerCase()
        const label =
          ap === 'draft'
            ? 'Draft'
            : ap === 'submitted'
              ? 'Pending approval'
              : ap === 'approval_declined'
                ? 'Declined'
                : 'Approved'
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
            ap === 'draft'
              ? 'bg-slate-50 text-slate-700 border-slate-200'
              : ap === 'submitted'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : ap === 'approval_declined'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>{label}</span>
        )
      },
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendors</h1>
        <p className="text-gray-500">Manage your suppliers and vendors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Vendors', value: stats.total, icon: Building2, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Active', value: stats.active, icon: CheckCircle, cls: 'text-green-600 bg-green-50' },
          { label: 'Inactive', value: stats.inactive, icon: XCircle, cls: 'text-gray-600 bg-gray-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}><Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-gray-800">{value}</p></div>
          </div>
        ))}
      </div>

      <DataTable
        data={vendors}
        columns={columns}
        loading={loading}
        title="All Vendors"
        onAdd={handleAdd}
        addLabel="New Vendor"
        searchable
        searchPlaceholder="Search vendors..."
        emptyMessage="No vendors yet. Click 'New Vendor' to add one."
        onRowClick={handleEdit}
        actions={[
          commonActions.sendForApproval({
            entityLabel: 'vendor',
            eligibleTooltip: 'Open drawer to route this vendor to selected approvers',
            blockedTooltip: 'A vendor approval request is already pending',
            onOpenSheet: (row) => vendorApprovalSheet.openFor(row.id),
          }),
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => handleDelete(row.id), variant: 'ghost' },
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
