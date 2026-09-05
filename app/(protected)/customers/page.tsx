'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { GET_CUSTOMERS, CREATE_CUSTOMER, UPDATE_CUSTOMER, DELETE_CUSTOMER } from '@/gql/queries'
import { Trash2, Edit, Users, CheckCircle, XCircle, Plus } from 'lucide-react'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell } from '@/components/ui/erp-shared'
import { Button } from '@/components/ui/button'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'

const EMPTY_FORM = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  taxNumber: '',
  paymentTerms: '',
  bankName: '',
  bankAccountNumber: '',
  bankIfsc: '',
  bankBranch: '',
  notes: '',
}

export default function CustomersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createCustomer, { loading: saving }] = useMutation(CREATE_CUSTOMER, {
    onCompleted: () => {
      refetch()
      closeForm()
    },
  })

  const [updateCustomer, { loading: updating }] = useMutation(UPDATE_CUSTOMER, {
    onCompleted: () => {
      refetch()
      closeForm()
    },
  })

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER, {
    onCompleted: () => refetch(),
  })

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    reset()
  }

  const reset = () => {
    setForm({ ...EMPTY_FORM })
    setErrors({})
  }

  const setF = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (editing) {
      const { ...updateInput } = form as typeof form
      updateCustomer({ variables: { id: editing, input: updateInput } })
    } else {
      createCustomer({ variables: { input: { ...form, organizationId: orgId } } })
    }
  }

  const openCreate = () => {
    reset()
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (customer: Record<string, unknown>) => {
    setForm({
      name: String(customer.name ?? ''),
      contactPerson: String(customer.contactPerson ?? ''),
      email: String(customer.email ?? ''),
      phone: String(customer.phone ?? ''),
      address: String(customer.address ?? ''),
      city: String(customer.city ?? ''),
      state: String(customer.state ?? ''),
      country: String(customer.country ?? ''),
      zipCode: String(customer.zipCode ?? ''),
      taxNumber: String(customer.taxNumber ?? ''),
      paymentTerms: String(customer.paymentTerms ?? ''),
      bankName: String(customer.bankName ?? ''),
      bankAccountNumber: String(customer.bankAccountNumber ?? ''),
      bankIfsc: String(customer.bankIfsc ?? ''),
      bankBranch: String(customer.bankBranch ?? ''),
      notes: String(customer.notes ?? ''),
    })
    setEditing(String(customer.id))
    setFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this customer?')) deleteCustomer({ variables: { id } })
  }

  const customers = data?.customers ?? []
  const stats = {
    total: customers.length,
    active: customers.filter((c: { status?: string }) => c.status === 'active').length,
    inactive: customers.filter((c: { status?: string }) => c.status === 'inactive').length,
  }

  const columns: Column[] = [
    { key: 'docNumber', label: 'Code', width: '130px', render: (v) => <MonoCell value={v} /> },
    { key: 'name', label: 'Customer Name', sortable: true, render: (v) => <span className="text-sm font-medium">{v}</span> },
    { key: 'contactPerson', label: 'Contact', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'email', label: 'Email', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'phone', label: 'Phone', width: '130px', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'paymentTerms', label: 'Payment Terms', width: '130px', render: (v) => <span className="text-sm text-muted-foreground">{v || '—'}</span> },
    { key: 'status', label: 'Status', width: '100px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Customers"
        subtitle="Maintain customer masters, contacts, and payment terms."
        icon={<Users className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Customers' }]}
        actions={
          <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New Customer
          </Button>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total Customers" value={stats.total} icon={<Users className="h-5 w-5" />} variant="blue" />
        <StatCard label="Active" value={stats.active} icon={<CheckCircle className="h-5 w-5" />} variant="green" />
        <StatCard label="Inactive" value={stats.inactive} icon={<XCircle className="h-5 w-5" />} variant="slate" />
      </StatsRow>

      <DataTable
        data={customers}
        columns={columns}
        loading={loading}
        title="All Customers"
        searchable
        searchPlaceholder="Search customers…"
        emptyMessage="No customers found."
        pageSize={25}
        onRowClick={openEdit}
        actions={[
          {
            label: 'Edit',
            icon: <Edit className="h-3.5 w-3.5" />,
            onClick: (row) => openEdit(row),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (row) => handleDelete(String(row.id)),
          },
        ]}
      />

      <FormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setEditing(null)
            reset()
          }
        }}
        title={editing ? 'Edit customer' : 'New customer'}
        size="lg"
        onSubmit={handleSubmit}
        submitting={saving || updating}
        submitLabel={editing ? 'Update customer' : 'Save customer'}
      >
        <FormSection>
          <FieldGrid cols={3}>
            <InputFloating
              label="Customer name *"
              value={form.name}
              onChange={(e) => setF('name', e.target.value)}
              error={errors.name}
            />
            <InputFloating
              label="Contact person"
              value={form.contactPerson}
              onChange={(e) => setF('contactPerson', e.target.value)}
            />
            <InputFloating
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setF('email', e.target.value)}
            />
          </FieldGrid>
        </FormSection>

        <FormSection>
          <FieldGrid cols={3}>
            <InputFloating label="Phone" value={form.phone} onChange={(e) => setF('phone', e.target.value)} />
            <InputFloating
              label="Tax number"
              value={form.taxNumber}
              onChange={(e) => setF('taxNumber', e.target.value)}
            />
            <SelectFloating
              label="Payment terms"
              value={form.paymentTerms}
              onChange={(e) => setF('paymentTerms', typeof e === 'string' ? e : e.target.value)}
              options={[
                { value: '', label: 'Select…' },
                { value: 'Net 15', label: 'Net 15' },
                { value: 'Net 30', label: 'Net 30' },
                { value: 'Net 45', label: 'Net 45' },
                { value: 'Net 60', label: 'Net 60' },
                { value: 'Due on Receipt', label: 'Due on receipt' },
              ]}
            />
          </FieldGrid>
        </FormSection>

        <FormSection>
          <FieldGrid cols={4}>
            <InputFloating label="Bank name" value={form.bankName} onChange={(e) => setF('bankName', e.target.value)} />
            <InputFloating
              label="Account number"
              value={form.bankAccountNumber}
              onChange={(e) => setF('bankAccountNumber', e.target.value)}
            />
            <InputFloating
              label="IFSC / routing"
              value={form.bankIfsc}
              onChange={(e) => setF('bankIfsc', e.target.value)}
            />
            <InputFloating label="Branch" value={form.bankBranch} onChange={(e) => setF('bankBranch', e.target.value)} />
          </FieldGrid>
        </FormSection>

        <FormSection>
          <FieldGrid cols={4}>
            <InputFloating label="Address" value={form.address} onChange={(e) => setF('address', e.target.value)} />
            <InputFloating label="City" value={form.city} onChange={(e) => setF('city', e.target.value)} />
            <InputFloating label="State" value={form.state} onChange={(e) => setF('state', e.target.value)} />
            <InputFloating label="Country" value={form.country} onChange={(e) => setF('country', e.target.value)} />
          </FieldGrid>
        </FormSection>

        <FormSection>
          <InputFloating
            label="Notes"
            multiline
            rows={3}
            value={form.notes}
            onChange={(e) => setF('notes', e.target.value)}
          />
        </FormSection>
      </FormModal>
    </div>
  )
}
