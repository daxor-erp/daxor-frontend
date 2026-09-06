'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_HR_MASTERS,
  CREATE_HR_MASTER,
  UPDATE_HR_MASTER,
  DELETE_HR_MASTER,
  GET_EMPLOYEE_MASTERS,
} from '@/gql/queries'
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { toast } from 'sonner'
import { Boxes, Plus, Pencil, Trash2, Undo2, List } from 'lucide-react'

const KIND = 'ASSET_ISSUE'
const CATALOG_KIND = 'ASSET_NAME'

type IssueStatus = 'ISSUED' | 'RETURNED' | 'LOST' | 'DAMAGED'

interface IssueForm {
  id?: string
  code: string
  employeeId: string
  assetNameId: string
  serialNumber: string
  issueDate: string
  expectedReturnDate: string
  condition: string
  status: IssueStatus
  notes: string
}

const EMPTY: IssueForm = {
  code: '',
  employeeId: '',
  assetNameId: '',
  serialNumber: '',
  issueDate: new Date().toISOString().slice(0, 10),
  expectedReturnDate: '',
  condition: 'GOOD',
  status: 'ISSUED',
  notes: '',
}

function parseMeta(json?: string | null): Record<string, any> {
  try {
    return JSON.parse(json ?? '{}')
  } catch {
    return {}
  }
}

function nextIssueCode(existing: { code?: string }[]) {
  const n = existing.length + 1
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `ISS-${stamp}-${String(n).padStart(3, '0')}`
}

export default function AssetIssuePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<IssueForm>(EMPTY)

  const issuesQ = useQuery(GET_HR_MASTERS, {
    variables: { organizationId: orgId, kind: KIND, active: null, search: null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const catalogQ = useQuery(GET_HR_MASTERS, {
    variables: { organizationId: orgId, kind: CATALOG_KIND, active: true, search: null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const employeesQ = useQuery(GET_EMPLOYEE_MASTERS, {
    variables: { organizationId: orgId, status: null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_HR_MASTER, {
    onCompleted: () => {
      void issuesQ.refetch()
      setOpen(false)
      setForm(EMPTY)
      toast.success('Asset issued to employee')
    },
    onError: (e) => toast.error(e.message),
  })

  const [updateMutation, { loading: updating }] = useMutation(UPDATE_HR_MASTER, {
    onCompleted: () => {
      void issuesQ.refetch()
      setOpen(false)
      setForm(EMPTY)
      toast.success('Issue updated')
    },
    onError: (e) => toast.error(e.message),
  })

  const [deleteMutation] = useMutation(DELETE_HR_MASTER, {
    onCompleted: () => {
      void issuesQ.refetch()
      toast.success('Issue deleted')
    },
    onError: (e) => toast.error(e.message),
  })

  const rows: any[] = issuesQ.data?.hrMasters ?? []
  const catalog: any[] = catalogQ.data?.hrMasters ?? []
  const employees: any[] = employeesQ.data?.employeeMasters ?? []

  const enriched = useMemo(
    () =>
      rows.map((r) => {
        const meta = parseMeta(r.metadataJson)
        return {
          ...r,
          employeeName: meta.employeeName ?? '—',
          employeeCode: meta.employeeCode ?? '',
          assetName: meta.assetName ?? r.name,
          assetCode: meta.assetCode ?? '',
          serialNumber: meta.serialNumber ?? '',
          issueDate: meta.issueDate ?? r.createdAt,
          expectedReturnDate: meta.expectedReturnDate ?? '',
          condition: meta.condition ?? '—',
          issueStatus: meta.status ?? (r.active ? 'ISSUED' : 'RETURNED'),
        }
      }),
    [rows],
  )

  const issuedCount = enriched.filter((r) => r.issueStatus === 'ISSUED').length
  const returnedCount = enriched.filter((r) => r.issueStatus === 'RETURNED').length

  const employeeOptions = useMemo(
    () =>
      employees.map((e) => ({
        value: e.id,
        label: `${e.employeeCode ? `${e.employeeCode} — ` : ''}${e.firstName} ${e.lastName}`.trim(),
      })),
    [employees],
  )

  const assetOptions = useMemo(
    () =>
      catalog.map((a) => ({
        value: a.id,
        label: `${a.code} — ${a.name}`,
      })),
    [catalog],
  )

  const openNew = () => {
    setForm({ ...EMPTY, code: nextIssueCode(rows) })
    setOpen(true)
  }

  const openEdit = (row: any) => {
    const meta = parseMeta(row.metadataJson)
    setForm({
      id: row.id,
      code: row.code ?? '',
      employeeId: meta.employeeId ?? '',
      assetNameId: meta.assetNameId ?? '',
      serialNumber: meta.serialNumber ?? '',
      issueDate: meta.issueDate ?? new Date().toISOString().slice(0, 10),
      expectedReturnDate: meta.expectedReturnDate ?? '',
      condition: meta.condition ?? 'GOOD',
      status: (meta.status as IssueStatus) || 'ISSUED',
      notes: meta.notes ?? row.description ?? '',
    })
    setOpen(true)
  }

  const markReturned = (row: any) => {
    const meta = parseMeta(row.metadataJson)
    updateMutation({
      variables: {
        id: row.id,
        input: {
          active: false,
          metadataJson: JSON.stringify({
            ...meta,
            status: 'RETURNED',
            returnDate: new Date().toISOString().slice(0, 10),
          }),
        },
      },
    })
  }

  const submit = () => {
    if (!form.employeeId) return toast.error('Select an employee')
    if (!form.assetNameId) return toast.error('Select an asset from the catalogue')
    if (!form.issueDate) return toast.error('Issue date is required')

    const emp = employees.find((e) => e.id === form.employeeId)
    const asset = catalog.find((a) => a.id === form.assetNameId)
    if (!emp) return toast.error('Employee not found')
    if (!asset) return toast.error('Asset not found — add it under Asset Name List first')

    const employeeName = `${emp.firstName ?? ''} ${emp.lastName ?? ''}`.trim()
    const code = (form.code || nextIssueCode(rows)).trim().toUpperCase()
    const metadata = {
      employeeId: emp.id,
      employeeCode: emp.employeeCode ?? '',
      employeeName,
      assetNameId: asset.id,
      assetCode: asset.code,
      assetName: asset.name,
      serialNumber: form.serialNumber.trim(),
      issueDate: form.issueDate,
      expectedReturnDate: form.expectedReturnDate || null,
      condition: form.condition,
      status: form.status,
      notes: form.notes.trim(),
    }

    const payload = {
      code,
      name: `${asset.name} → ${employeeName}`,
      description: form.notes.trim() || undefined,
      metadataJson: JSON.stringify(metadata),
      active: form.status === 'ISSUED',
      sortOrder: 0,
    }

    if (form.id) {
      updateMutation({ variables: { id: form.id, input: payload } })
    } else {
      createMutation({
        variables: {
          input: { ...payload, organizationId: orgId, kind: KIND },
        },
      })
    }
  }

  const columns: Column[] = [
    {
      key: 'code',
      label: 'Issue #',
      width: '140px',
      render: (v) => <MonoCell value={v} className="font-semibold text-foreground" />,
    },
    {
      key: 'assetName',
      label: 'Asset',
      sortable: true,
      render: (v, r) => (
        <div>
          <div className="text-sm font-medium">{v || '—'}</div>
          {r.assetCode ? <div className="text-[11px] text-muted-foreground font-mono">{r.assetCode}</div> : null}
        </div>
      ),
    },
    {
      key: 'employeeName',
      label: 'Employee',
      render: (v, r) => (
        <div>
          <div className="text-sm font-medium">{v || '—'}</div>
          {r.employeeCode ? <div className="text-[11px] text-muted-foreground font-mono">{r.employeeCode}</div> : null}
        </div>
      ),
    },
    {
      key: 'serialNumber',
      label: 'Serial',
      width: '120px',
      render: (v) => <MonoCell value={v || '—'} />,
    },
    {
      key: 'issueDate',
      label: 'Issued',
      width: '110px',
      render: (v) => <DateCell value={v} />,
    },
    {
      key: 'condition',
      label: 'Condition',
      width: '100px',
      render: (v) => <span className="text-xs text-muted-foreground">{v || '—'}</span>,
    },
    {
      key: 'issueStatus',
      label: 'Status',
      width: '110px',
      render: (v) => <ErpBadge status={String(v ?? 'ISSUED')} />,
    },
  ]

  const catalogEmpty = catalog.length === 0
  const employeesEmpty = employees.length === 0

  return (
    <div className="erp-shell">
      <PageHeader
        title="Asset Issue to Employee"
        subtitle="Issue catalogue assets to employees and track returns."
        icon={<Boxes className="h-5 w-5" />}
        breadcrumbs={[{ label: 'HR' }, { label: 'Masters' }, { label: 'Asset Issue' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/hr/masters/asset-name-list">
                <List className="h-4 w-4 mr-1.5" /> Manage catalogue
              </Link>
            </Button>
            <Button
              onClick={openNew}
              disabled={catalogEmpty || employeesEmpty}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Issue asset
            </Button>
          </div>
        }
      />

      <StatsRow cols={3}>
        <StatCard label="Total issues" value={enriched.length} icon={<Boxes className="h-5 w-5" />} variant="blue" />
        <StatCard label="Currently issued" value={issuedCount} icon={<Boxes className="h-5 w-5" />} variant="green" />
        <StatCard label="Returned" value={returnedCount} icon={<Undo2 className="h-5 w-5" />} variant="slate" />
      </StatsRow>

      {(catalogEmpty || employeesEmpty) && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {catalogEmpty && (
            <p>
              No assets in the catalogue yet.{' '}
              <Link href="/hr/masters/asset-name-list" className="font-medium underline">
                Add an asset name
              </Link>{' '}
              first (e.g. Laptop).
            </p>
          )}
          {employeesEmpty && (
            <p className={catalogEmpty ? 'mt-1' : undefined}>
              No employees found.{' '}
              <Link href="/hr/masters/employee-master" className="font-medium underline">
                Create an employee
              </Link>{' '}
              before issuing assets.
            </p>
          )}
        </div>
      )}

      <DataTable
        data={enriched}
        columns={columns}
        loading={issuesQ.loading}
        title="All Issued Assets"
        searchable
        searchPlaceholder="Search issue # / asset / employee…"
        emptyMessage="No assets issued yet. Click “Issue asset” to assign a catalogue item to an employee."
        pageSize={25}
        onRowClick={(r: any) => openEdit(r)}
        actions={[
          {
            label: 'Edit',
            icon: <Pencil className="h-3.5 w-3.5" />,
            onClick: (r: any) => openEdit(r),
          },
          {
            label: 'Mark returned',
            icon: <Undo2 className="h-3.5 w-3.5" />,
            show: (r: any) => r.issueStatus === 'ISSUED',
            onClick: (r: any) => markReturned(r),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: (r: any) => {
              if (confirm(`Delete issue ${r.code}?`)) deleteMutation({ variables: { id: r.id } })
            },
          },
        ]}
      />

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={form.id ? 'Edit asset issue' : 'Issue asset to employee'}
        description="Select employee and catalogue asset, then record serial and issue date."
        icon={<Boxes className="h-5 w-5" />}
        size="md"
        submitting={creating || updating}
        onSubmit={submit}
        submitLabel={form.id ? 'Save changes' : 'Issue asset'}
      >
        <FormSection>
          <FieldGrid cols={2}>
            <InputFloating
              label="Issue # *"
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
            />
            <InputFloating
              label="Issue date *"
              type="date"
              value={form.issueDate}
              onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))}
            />
            <SelectFloating
              label="Employee *"
              value={form.employeeId}
              onChange={(v) => setForm((p) => ({ ...p, employeeId: typeof v === 'string' ? v : v.target.value }))}
              options={[{ value: '', label: 'Select employee…' }, ...employeeOptions]}
            />
            <SelectFloating
              label="Asset (catalogue) *"
              value={form.assetNameId}
              onChange={(v) => setForm((p) => ({ ...p, assetNameId: typeof v === 'string' ? v : v.target.value }))}
              options={[{ value: '', label: 'Select asset…' }, ...assetOptions]}
            />
            <InputFloating
              label="Serial number"
              value={form.serialNumber}
              onChange={(e) => setForm((p) => ({ ...p, serialNumber: e.target.value }))}
              placeholder="e.g. SN-LAP-001"
            />
            <InputFloating
              label="Expected return"
              type="date"
              value={form.expectedReturnDate}
              onChange={(e) => setForm((p) => ({ ...p, expectedReturnDate: e.target.value }))}
            />
            <SelectFloating
              label="Condition"
              value={form.condition}
              onChange={(v) => setForm((p) => ({ ...p, condition: typeof v === 'string' ? v : v.target.value }))}
              options={[
                { value: 'GOOD', label: 'Good' },
                { value: 'FAIR', label: 'Fair' },
                { value: 'POOR', label: 'Poor' },
                { value: 'NEW', label: 'New' },
              ]}
            />
            <SelectFloating
              label="Status"
              value={form.status}
              onChange={(v) =>
                setForm((p) => ({
                  ...p,
                  status: (typeof v === 'string' ? v : v.target.value) as IssueStatus,
                }))
              }
              options={[
                { value: 'ISSUED', label: 'Issued' },
                { value: 'RETURNED', label: 'Returned' },
                { value: 'LOST', label: 'Lost' },
                { value: 'DAMAGED', label: 'Damaged' },
              ]}
            />
            <div className="sm:col-span-2">
              <InputFloating
                label="Notes"
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Optional notes"
              />
            </div>
          </FieldGrid>
        </FormSection>
      </FormModal>
    </div>
  )
}
