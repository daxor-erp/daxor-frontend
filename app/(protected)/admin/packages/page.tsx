'use client'

import { useEffect, useMemo, useState, Fragment } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  CREATE_PACKAGE,
  DELETE_PACKAGE_MODULE_ASSIGNMENT,
  GET_ORGANIZATIONS,
  GET_PACKAGE_MODULE_ASSIGNMENT,
  GET_PACKAGE_MODULE_ASSIGNMENTS,
  GET_PACKAGES,
  SET_PACKAGE_MODULE_ASSIGNMENT,
  UPDATE_PACKAGE,
} from '@/gql/queries'
import { PageHeader } from '@/components/ui/erp-shared'
import { SectionCard } from '@/components/dashboard/section-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar,
  Check,
  Clock,
  Pencil,
  Plus,
  Save,
  Trash2,
  CheckCircle2,
  Users,
} from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/format-date'
import {
  enabledModulesToSet,
  getPackageNavGroups,
  packageModuleKey,
  setToEnabledModules,
} from '@/lib/package-nav-groups'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type DurationType = '30' | '90' | 'custom'

interface PackageRow {
  id: string
  packageName: string
  externalName: string
  price: number
  durationDays: number
  createdAt: string
  updatedAt: string
}

type PackageFormState = {
  packageName: string
  externalName: string
  price: string
  durationType: DurationType
  customDays: string
}

interface OrgRow {
  id: string
  name: string
  parentOrganizationId?: string | null
  packageId?: string | null
}

interface SavedAssignmentRow {
  id: string
  organizationId: string
  organizationName?: string | null
  enabledModules: Array<{ moduleKey: string; submoduleKey: string }>
  updatedAt: string
  createdAt: string
}

const CARD_TONES = [
  'bg-grad-brand',
  'bg-grad-violet',
  'bg-grad-sky',
  'bg-grad-accent',
  'bg-grad-rose',
  'bg-grad-warn',
] as const

const MODULE_GROUPS = getPackageNavGroups()

const MODULE_LABEL_BY_KEY = new Map<string, string>()
for (const group of MODULE_GROUPS) {
  for (const item of group.items) {
    MODULE_LABEL_BY_KEY.set(packageModuleKey(item.moduleKey, item.submoduleKey), item.label)
  }
}

const EMPTY_FORM: PackageFormState = {
  packageName: '',
  externalName: '',
  price: '',
  durationType: '30',
  customDays: '',
}

function resolveDurationDays(type: DurationType, customDays: string): number | null {
  if (type === '30') return 30
  if (type === '90') return 90
  const n = parseInt(customDays, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

function packageToForm(pkg: PackageRow): PackageFormState {
  if (pkg.durationDays === 30) {
    return {
      packageName: pkg.packageName,
      externalName: pkg.externalName,
      price: String(pkg.price),
      durationType: '30',
      customDays: '',
    }
  }
  if (pkg.durationDays === 90) {
    return {
      packageName: pkg.packageName,
      externalName: pkg.externalName,
      price: String(pkg.price),
      durationType: '90',
      customDays: '',
    }
  }
  return {
    packageName: pkg.packageName,
    externalName: pkg.externalName,
    price: String(pkg.price),
    durationType: 'custom',
    customDays: String(pkg.durationDays),
  }
}

function formatDuration(days: number): string {
  if (days === 30) return '30 Days'
  if (days === 90) return '90 Days'
  return `${days} Days`
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR' }).format(price)
}

function validatePackageForm(form: PackageFormState) {
  const packageName = form.packageName.trim()
  const externalName = form.externalName.trim()
  const price = parseFloat(form.price)
  const durationDays = resolveDurationDays(form.durationType, form.customDays)

  if (!packageName) return { ok: false as const, message: 'Package name is required' }
  if (!externalName) return { ok: false as const, message: 'External name is required' }
  if (!Number.isFinite(price) || price <= 0) return { ok: false as const, message: 'Pricing must be greater than 0' }
  if (durationDays == null) return { ok: false as const, message: 'Number of days must be greater than 0' }

  return {
    ok: true as const,
    input: { packageName, externalName, price, durationDays },
  }
}

export default function AdminPackagesPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState<PackageRow | null>(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [selectedOrgId, setSelectedOrgId] = useState('')
  const [checkedModules, setCheckedModules] = useState<Set<string>>(new Set())
  const [lastSavedAssignment, setLastSavedAssignment] = useState<SavedAssignmentRow | null>(null)
  const [deletingAssignment, setDeletingAssignment] = useState<SavedAssignmentRow | null>(null)

  const { data, loading, refetch } = useQuery(GET_PACKAGES, {
    fetchPolicy: 'cache-and-network',
  })

  const { data: orgData } = useQuery(GET_ORGANIZATIONS, {
    variables: { page: 1, limit: 500 },
    fetchPolicy: 'cache-and-network',
  })

  const packages: PackageRow[] = data?.packages ?? []
  const selectedPackage = packages.find((p) => p.id === selectedPackageId) ?? null

  useEffect(() => {
    if (!selectedPackageId && packages.length > 0) {
      setSelectedPackageId(packages[0].id)
    }
  }, [packages, selectedPackageId])

  useEffect(() => {
    setSelectedOrgId('')
    setCheckedModules(new Set())
    setLastSavedAssignment(null)
  }, [selectedPackageId])

  const orgOptions = useMemo(() => {
    const orgs: OrgRow[] = orgData?.organizations ?? []
    const byId = new Map(orgs.map((o) => [o.id, o]))
    return orgs
      .map((o) => {
        const parent = o.parentOrganizationId ? byId.get(o.parentOrganizationId) : null
        const label = parent
          ? `${parent.name} / ${o.name} (Sub-tenant)`
          : `${o.name} (Tenant)`
        return { id: o.id, label }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [orgData?.organizations])

  const { data: assignmentData, loading: assignmentLoading, refetch: refetchAssignment } = useQuery(
    GET_PACKAGE_MODULE_ASSIGNMENT,
    {
      variables: { packageId: selectedPackageId!, organizationId: selectedOrgId },
      skip: !selectedPackageId || !selectedOrgId,
      fetchPolicy: 'network-only',
    },
  )

  const {
    data: assignmentsListData,
    loading: assignmentsListLoading,
    error: assignmentsListError,
    refetch: refetchAssignmentsList,
  } = useQuery(GET_PACKAGE_MODULE_ASSIGNMENTS, {
    variables: { packageId: selectedPackageId! },
    skip: !selectedPackageId,
    fetchPolicy: 'network-only',
  })

  const savedAssignments: SavedAssignmentRow[] =
    assignmentsListData?.packageModuleAssignments ?? []

  const currentAssignment: SavedAssignmentRow | null = assignmentData?.packageModuleAssignment
    ? {
        id: assignmentData.packageModuleAssignment.id,
        organizationId: assignmentData.packageModuleAssignment.organizationId,
        organizationName: orgOptions.find((o) => o.id === selectedOrgId)?.label ?? null,
        enabledModules: assignmentData.packageModuleAssignment.enabledModules ?? [],
        updatedAt: assignmentData.packageModuleAssignment.updatedAt,
        createdAt: assignmentData.packageModuleAssignment.createdAt,
      }
    : null

  const activeAssignment = useMemo(() => {
    if (currentAssignment?.organizationId === selectedOrgId) return currentAssignment
    if (lastSavedAssignment?.organizationId === selectedOrgId) return lastSavedAssignment
    return null
  }, [currentAssignment, lastSavedAssignment, selectedOrgId])

  useEffect(() => {
    if (assignmentLoading) return
    const rows = assignmentData?.packageModuleAssignment?.enabledModules
    if (rows?.length) {
      setCheckedModules(enabledModulesToSet(rows))
    } else if (selectedOrgId) {
      setCheckedModules(new Set())
    }
  }, [assignmentData, assignmentLoading, selectedOrgId])

  const [createPackage, { loading: creating }] = useMutation(CREATE_PACKAGE, {
    onCompleted: (result) => {
      toast.success('Package created successfully')
      setCreateOpen(false)
      setCreateForm(EMPTY_FORM)
      const id = result?.createPackage?.id
      if (id) setSelectedPackageId(id)
      refetch()
    },
    onError: (err) => toast.error(err.message),
  })

  const [updatePackage, { loading: updating }] = useMutation(UPDATE_PACKAGE, {
    onCompleted: () => {
      toast.success('Package updated successfully')
      setEditing(null)
      setEditForm(EMPTY_FORM)
      refetch()
    },
    onError: (err) => toast.error(err.message),
  })

  const [saveAssignment, { loading: savingAssignment }] = useMutation(SET_PACKAGE_MODULE_ASSIGNMENT, {
    onCompleted: async (result) => {
      const saved = result?.setPackageModuleAssignment
      if (saved) {
        const orgLabel = orgOptions.find((o) => o.id === saved.organizationId)?.label ?? 'Tenant'
        setLastSavedAssignment({
          id: saved.id,
          organizationId: saved.organizationId,
          organizationName: orgLabel,
          enabledModules: saved.enabledModules ?? [],
          updatedAt: saved.updatedAt,
          createdAt: saved.createdAt ?? saved.updatedAt,
        })
        setCheckedModules(enabledModulesToSet(saved.enabledModules))
      }
      toast.success('Assignment saved successfully')
      await Promise.all([refetchAssignment(), refetchAssignmentsList()])
    },
    onError: (err) => toast.error(err.message),
  })

  const [deleteAssignment, { loading: deletingAssignmentPending }] = useMutation(
    DELETE_PACKAGE_MODULE_ASSIGNMENT,
    {
      onError: (err) => toast.error(err.message),
    },
  )

  useEffect(() => {
    if (editing) setEditForm(packageToForm(editing))
  }, [editing])

  const submitCreate = () => {
    const result = validatePackageForm(createForm)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    createPackage({ variables: { input: result.input } })
  }

  const submitEdit = () => {
    if (!editing) return
    const result = validatePackageForm(editForm)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    updatePackage({ variables: { id: editing.id, input: result.input } })
  }

  const toggleModule = (moduleKey: string, submoduleKey: string, checked: boolean) => {
    const key = packageModuleKey(moduleKey, submoduleKey)
    setCheckedModules((prev) => {
      const next = new Set(prev)
      if (checked) next.add(key)
      else next.delete(key)
      return next
    })
  }

  const toggleGroup = (moduleKey: string, submoduleKeys: string[], checked: boolean) => {
    setCheckedModules((prev) => {
      const next = new Set(prev)
      for (const sk of submoduleKeys) {
        const key = packageModuleKey(moduleKey, sk)
        if (checked) next.add(key)
        else next.delete(key)
      }
      return next
    })
  }

  const loadSavedAssignment = (row: SavedAssignmentRow) => {
    setSelectedOrgId(row.organizationId)
    setCheckedModules(enabledModulesToSet(row.enabledModules))
    setLastSavedAssignment(row)
  }

  const assignedOrgIds = useMemo(
    () => new Set(savedAssignments.map((a) => a.organizationId)),
    [savedAssignments],
  )

  const saveModuleAssignment = () => {
    if (!selectedPackageId || !selectedOrgId) {
      toast.error('Select a package and tenant first')
      return
    }
    const enabledModules = setToEnabledModules(checkedModules)
    if (!enabledModules.length) {
      toast.error('Select at least one module')
      return
    }
    saveAssignment({
      variables: {
        packageId: selectedPackageId,
        organizationId: selectedOrgId,
        enabledModules,
      },
    })
  }

  const handleDeleteAssignment = async () => {
    if (!selectedPackageId || !deletingAssignment) return
    try {
      await deleteAssignment({
        variables: {
          packageId: selectedPackageId,
          organizationId: deletingAssignment.organizationId,
        },
      })
      toast.success('Assignment deleted')
      if (selectedOrgId === deletingAssignment.organizationId) {
        setSelectedOrgId('')
        setCheckedModules(new Set())
        setLastSavedAssignment(null)
      }
      setDeletingAssignment(null)
      await Promise.all([refetchAssignmentsList(), refetchAssignment()])
    } catch {
      /* onError toast */
    }
  }

  return (
    <div className="erp-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Packages"
          subtitle="Create packages and control which ERP modules each tenant can access."
          icon={<Users className="h-5 w-5" />}
          breadcrumbs={[{ label: 'Admin' }, { label: 'Packages' }]}
          className="mb-0"
        />
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-1.5 shrink-0 self-start bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Package
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="Packages"
            description={
              loading && packages.length === 0
                ? 'Loading…'
                : `${packages.length} package${packages.length === 1 ? '' : 's'}`
            }
            bodyClassName="p-3 sm:p-4"
          >
            {loading && packages.length === 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-xl bg-secondary/40 animate-pulse" />
                ))}
              </div>
            ) : packages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No packages yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {packages.map((pkg, index) => {
                  const assignmentCount = selectedPackageId === pkg.id ? savedAssignments.length : undefined
                  return (
                  <CompactPackageCard
                    key={pkg.id}
                    pkg={pkg}
                    tone={CARD_TONES[index % CARD_TONES.length]}
                    selected={selectedPackageId === pkg.id}
                    assignmentCount={assignmentCount}
                    onSelect={() => setSelectedPackageId(pkg.id)}
                    onEdit={(e) => {
                      e.stopPropagation()
                      setEditing(pkg)
                    }}
                  />
                  )
                })}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="lg:col-span-3">
          <SectionCard
            title={
              selectedPackage
                ? `Assign modules to ${selectedPackage.packageName}`
                : 'Assign modules'
            }
            description="Choose a tenant or sub-tenant, then select which ERP modules they can see."
            bodyClassName="p-4 sm:p-5"
          >
            {!selectedPackage ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Create or select a package to assign modules.
              </p>
            ) : (
              <div className="space-y-5">
                {/* Saved assignments for this package */}
                <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold">Saved assignments</h4>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {assignmentsListLoading
                        ? 'Loading…'
                        : `${savedAssignments.length} tenant${savedAssignments.length === 1 ? '' : 's'}`}
                    </span>
                  </div>
                  {assignmentsListError ? (
                    <p className="text-xs text-rose-600">
                      Could not load assignments: {assignmentsListError.message}. Ensure the API is running and refresh.
                    </p>
                  ) : assignmentsListLoading ? (
                    <div className="h-16 rounded-lg bg-secondary/40 animate-pulse" />
                  ) : savedAssignments.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No assignments saved yet for this package. Select a tenant below and save.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {savedAssignments.map((row) => {
                        const isActive =
                          selectedOrgId === row.organizationId &&
                          activeAssignment?.organizationId === row.organizationId
                        const orgLabel =
                          row.organizationName ||
                          orgOptions.find((o) => o.id === row.organizationId)?.label ||
                          'Organization'
                        return (
                          <div
                            key={row.id}
                            className={cn(
                              'rounded-lg border px-3 py-2.5 transition-colors',
                              isActive
                                ? 'border-primary bg-primary-soft/50 ring-1 ring-primary/30'
                                : 'border-border bg-card',
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => loadSavedAssignment(row)}
                                className="min-w-0 flex-1 text-left hover:opacity-90"
                              >
                                <p className="text-sm font-medium truncate">{orgLabel}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {row.enabledModules.length} module
                                  {row.enabledModules.length === 1 ? '' : 's'} · Updated{' '}
                                  {formatDateTime(row.updatedAt)}
                                </p>
                              </button>
                              <div className="flex shrink-0 items-center gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-xs gap-1"
                                  onClick={() => loadSavedAssignment(row)}
                                >
                                  <Pencil className="h-3 w-3" />
                                  Edit
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                                  onClick={() => setDeletingAssignment(row)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Tenant / Sub-tenant</Label>
                  <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization…" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgOptions.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.label}
                          {assignedOrgIds.has(o.id) ? ' · Assigned' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activeAssignment && selectedOrgId ? (
                  <AssignmentSummaryBanner
                    assignment={activeAssignment}
                    moduleLabels={MODULE_LABEL_BY_KEY}
                  />
                ) : null}

                {!selectedOrgId ? (
                  <p className="text-sm text-muted-foreground py-6 text-center border border-dashed rounded-xl">
                    Select a tenant or sub-tenant to configure module access.
                  </p>
                ) : assignmentLoading ? (
                  <div className="space-y-2 py-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-10 rounded-lg bg-secondary/40 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    {activeAssignment ? (
                      <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-border bg-secondary/20 px-3 py-2">
                        Editing assignment — check or uncheck modules below to add or remove access, then click{' '}
                        <span className="font-medium text-foreground">Update assignment</span>.
                      </p>
                    ) : null}
                    <div className="rounded-xl border border-border overflow-hidden max-h-[52vh] overflow-y-auto">
                      <table className="erp-table">
                        <thead className="sticky top-0 bg-secondary/80 backdrop-blur-sm border-b border-border">
                          <tr>
                            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Module / Submodule
                            </th>
                            <th className="text-center px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-24">
                              Enabled
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {MODULE_GROUPS.map((group) => {
                            const submoduleKeys = group.items.map((i) => i.submoduleKey)
                            const allChecked = submoduleKeys.every((sk) =>
                              checkedModules.has(packageModuleKey(group.moduleKey, sk)),
                            )
                            const someChecked = submoduleKeys.some((sk) =>
                              checkedModules.has(packageModuleKey(group.moduleKey, sk)),
                            )
                            return (
                              <Fragment key={group.label}>
                                <tr className="bg-secondary/30 border-b border-border">
                                  <td className="px-4 py-2.5 font-semibold text-foreground">
                                    {group.label}
                                  </td>
                                  <td className="px-4 py-2.5 text-center">
                                    <input
                                      type="checkbox"
                                      checked={allChecked}
                                      ref={(el) => {
                                        if (el) el.indeterminate = someChecked && !allChecked
                                      }}
                                      onChange={(e) =>
                                        toggleGroup(group.moduleKey, submoduleKeys, e.target.checked)
                                      }
                                      className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                                      aria-label={`Toggle all ${group.label}`}
                                    />
                                  </td>
                                </tr>
                                {group.items.map((item) => {
                                  const key = packageModuleKey(item.moduleKey, item.submoduleKey)
                                  return (
                                    <tr
                                      key={key}
                                      className="border-b border-border/60 hover:bg-secondary/20"
                                    >
                                      <td className="px-4 py-2 pl-8 text-muted-foreground">
                                        {item.label}
                                      </td>
                                      <td className="px-4 py-2 text-center">
                                        <input
                                          type="checkbox"
                                          checked={checkedModules.has(key)}
                                          onChange={(e) =>
                                            toggleModule(item.moduleKey, item.submoduleKey, e.target.checked)
                                          }
                                          className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                                        />
                                      </td>
                                    </tr>
                                  )
                                })}
                              </Fragment>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <p className="text-xs text-muted-foreground">
                        {checkedModules.size} module{checkedModules.size === 1 ? '' : 's'} selected
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {activeAssignment ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 gap-1.5"
                            onClick={() =>
                              setDeletingAssignment(
                                savedAssignments.find((a) => a.organizationId === selectedOrgId) ??
                                  activeAssignment,
                              )
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete assignment
                          </Button>
                        ) : null}
                        <Button
                          onClick={saveModuleAssignment}
                          disabled={savingAssignment || checkedModules.size === 0}
                          className="gap-1.5"
                        >
                          <Save className="h-4 w-4" />
                          {savingAssignment
                            ? 'Saving…'
                            : activeAssignment
                              ? 'Update assignment'
                              : 'Save assignment'}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      <PackageFormDialog
        open={createOpen}
        saving={creating}
        title="Create Package"
        submitLabel="Create Package"
        savingLabel="Creating…"
        form={createForm}
        onFormChange={setCreateForm}
        onClose={() => {
          setCreateOpen(false)
          setCreateForm(EMPTY_FORM)
        }}
        onSubmit={submitCreate}
      />

      <PackageFormDialog
        open={!!editing}
        saving={updating}
        title="Edit Package"
        submitLabel="Save changes"
        savingLabel="Saving…"
        form={editForm}
        onFormChange={setEditForm}
        onClose={() => {
          setEditing(null)
          setEditForm(EMPTY_FORM)
        }}
        onSubmit={submitEdit}
      />

      <AlertDialog open={!!deletingAssignment} onOpenChange={(open) => !open && setDeletingAssignment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the module assignment for{' '}
              <span className="font-medium text-foreground">
                {deletingAssignment?.organizationName ??
                  orgOptions.find((o) => o.id === deletingAssignment?.organizationId)?.label ??
                  'this tenant'}
              </span>{' '}
              from package <span className="font-medium text-foreground">{selectedPackage?.packageName}</span>.
              Users under that organization will no longer be restricted by this package&apos;s modules.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingAssignmentPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                void handleDeleteAssignment()
              }}
              disabled={deletingAssignmentPending}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deletingAssignmentPending ? 'Deleting…' : 'Delete assignment'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function AssignmentSummaryBanner({
  assignment,
  moduleLabels,
}: {
  assignment: SavedAssignmentRow
  moduleLabels: Map<string, string>
}) {
  const labels = assignment.enabledModules
    .map((m) => moduleLabels.get(packageModuleKey(m.moduleKey, m.submoduleKey)) ?? m.submoduleKey)
    .slice(0, 8)
  const remaining = Math.max(0, assignment.enabledModules.length - labels.length)

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
      <div className="flex items-start gap-2">
        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            Assignment saved for{' '}
            <span className="font-semibold">{assignment.organizationName ?? 'this tenant'}</span>
          </p>
          <p className="text-xs text-emerald-800/80 mt-1">
            {assignment.enabledModules.length} modules enabled · Last updated{' '}
            {formatDateTime(assignment.updatedAt)}
          </p>
          {labels.length > 0 && (
            <p className="text-xs text-emerald-800/90 mt-2 leading-relaxed">
              Includes: {labels.join(', ')}
              {remaining > 0 ? ` and ${remaining} more…` : ''}
            </p>
          )}
          <p className="text-[11px] text-emerald-700/80 mt-1">
            Check more modules below to grant access, uncheck to remove, then click Update assignment.
          </p>
        </div>
      </div>
    </div>
  )
}

function CompactPackageCard({
  pkg,
  tone,
  selected,
  assignmentCount,
  onSelect,
  onEdit,
}: {
  pkg: PackageRow
  tone: (typeof CARD_TONES)[number]
  selected: boolean
  assignmentCount?: number
  onSelect: () => void
  onEdit: (e: React.MouseEvent) => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      data-package-id={pkg.id}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all',
        selected
          ? 'border-primary ring-2 ring-primary/30 elev-2'
          : 'border-border bg-card elev-1 hover:elev-2 hover:border-primary/40',
      )}
    >
      <div className={cn('px-3 py-2.5 text-white', tone)}>
        <div className="flex items-start justify-between gap-1">
          <p className="text-xs font-bold leading-tight line-clamp-2">{pkg.packageName}</p>
          {selected && <Check className="h-3.5 w-3.5 shrink-0 text-white" />}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5 text-[11px]">
        <p className="text-muted-foreground line-clamp-1">{pkg.externalName}</p>
        <p className="font-semibold text-foreground">{formatPrice(pkg.price)}</p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <Clock className="h-3 w-3" />
            {formatDuration(pkg.durationDays)}
          </span>
          {assignmentCount != null && assignmentCount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-primary font-medium">
              <Users className="h-3 w-3" />
              {assignmentCount} assigned
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-1 pt-1 border-t border-border/60">
          <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <Calendar className="h-2.5 w-2.5" />
            {formatDate(pkg.createdAt)}
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={onEdit}
            onKeyDown={(e) => e.key === 'Enter' && onEdit(e as unknown as React.MouseEvent)}
            className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary-soft"
          >
            <Pencil className="h-2.5 w-2.5" />
            Edit
          </span>
        </div>
      </div>
    </button>
  )
}

function PackageFormDialog({
  open,
  saving,
  title,
  submitLabel,
  savingLabel,
  form,
  onFormChange,
  onClose,
  onSubmit,
}: {
  open: boolean
  saving: boolean
  title: string
  submitLabel: string
  savingLabel: string
  form: PackageFormState
  onFormChange: (form: PackageFormState) => void
  onClose: () => void
  onSubmit: () => void
}) {
  const validation = validatePackageForm(form)
  const canSubmit = validation.ok

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor={`${title}-name`}>Package Name *</Label>
            <Input
              id={`${title}-name`}
              value={form.packageName}
              onChange={(e) => onFormChange({ ...form, packageName: e.target.value })}
              placeholder="e.g. Starter Plan"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${title}-external`}>External Name *</Label>
            <Input
              id={`${title}-external`}
              value={form.externalName}
              onChange={(e) => onFormChange({ ...form, externalName: e.target.value })}
              placeholder="Name shown to customers"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${title}-price`}>Pricing *</Label>
            <Input
              id={`${title}-price`}
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(e) => onFormChange({ ...form, price: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Duration Type *</Label>
            <Select
              value={form.durationType}
              onValueChange={(v) => onFormChange({ ...form, durationType: v as DurationType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.durationType === 'custom' && (
            <div className="space-y-1.5">
              <Label htmlFor={`${title}-custom-days`}>Number of Days *</Label>
              <Input
                id={`${title}-custom-days`}
                type="number"
                min="1"
                step="1"
                value={form.customDays}
                onChange={(e) => onFormChange({ ...form, customDays: e.target.value })}
                placeholder="Enter number of days"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={saving || !canSubmit}
          >
            {saving ? savingLabel : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
