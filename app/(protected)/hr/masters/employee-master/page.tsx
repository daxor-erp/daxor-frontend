'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_EMPLOYEE_MASTERS,
  GET_EMPLOYEE_MASTER,
  CREATE_EMPLOYEE_MASTER,
  UPDATE_EMPLOYEE_MASTER,
  DELETE_EMPLOYEE_MASTER,
} from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  UserPlus, Pencil, Trash2, Search, Users, Building2, Briefcase, IdCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatMoneyCompact, formatNumber } from '@/lib/format-money'
import { DocumentAttachments } from '@/components/widgets/document-attachments'
import { formatDate } from '@/lib/format-date'

const STATUSES = ['ACTIVE', 'ON_LEAVE', 'NOTICE_PERIOD', 'TERMINATED', 'RESIGNED', 'RETIRED', 'PROBATION']
const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'CONSULTANT']

interface EmployeeForm {
  id?: string
  employeeCode: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  bloodGroup: string
  nationality: string
  maritalStatus: string
  personalEmail: string
  workEmail: string
  phone: string
  alternatePhone: string
  address: string
  city: string
  state: string
  country: string
  pincode: string
  designation: string
  department: string
  dateOfJoining: string
  dateOfConfirmation: string
  employmentType: string
  workLocation: string
  basicSalary: number
  panNumber: string
  aadhaarNumber: string
  uanNumber: string
  esiNumber: string
  bankName: string
  accountNumber: string
  ifscCode: string
  branchName: string
  emergencyName: string
  emergencyRelation: string
  emergencyPhone: string
  status: string
  notes: string
}

const EMPTY: EmployeeForm = {
  employeeCode: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  nationality: 'Indian',
  maritalStatus: '',
  personalEmail: '',
  workEmail: '',
  phone: '',
  alternatePhone: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  designation: '',
  department: '',
  dateOfJoining: new Date().toISOString().slice(0, 10),
  dateOfConfirmation: '',
  employmentType: 'FULL_TIME',
  workLocation: '',
  basicSalary: 0,
  panNumber: '',
  aadhaarNumber: '',
  uanNumber: '',
  esiNumber: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  branchName: '',
  emergencyName: '',
  emergencyRelation: '',
  emergencyPhone: '',
  status: 'ACTIVE',
  notes: '',
}

export default function EmployeeMasterPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<EmployeeForm>(EMPTY)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const listQ = useQuery(GET_EMPLOYEE_MASTERS, {
    variables: { organizationId: orgId, status: statusFilter || null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_EMPLOYEE_MASTER, {
    onCompleted: () => { listQ.refetch(); setOpen(false); setForm(EMPTY); toast.success('Employee added') },
    onError: (e) => toast.error(e.message),
  })
  const [updateMutation, { loading: updating }] = useMutation(UPDATE_EMPLOYEE_MASTER, {
    onCompleted: () => { listQ.refetch(); setOpen(false); setForm(EMPTY); toast.success('Employee updated') },
    onError: (e) => toast.error(e.message),
  })
  const [deleteMutation] = useMutation(DELETE_EMPLOYEE_MASTER, {
    onCompleted: () => { listQ.refetch(); toast.success('Employee removed') },
    onError: (e) => toast.error(e.message),
  })

  const employees: any[] = listQ.data?.employeeMasters ?? []
  const filtered = useMemo(() => {
    if (!search.trim()) return employees
    const q = search.toLowerCase()
    return employees.filter(
      (e) =>
        e.employeeCode?.toLowerCase().includes(q) ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.workEmail?.toLowerCase().includes(q) ||
        e.designation?.toLowerCase().includes(q),
    )
  }, [employees, search])

  const stats = useMemo(() => {
    const active = employees.filter((e) => String(e.status).toUpperCase() === 'ACTIVE').length
    const departments = new Set(employees.map((e) => e.department).filter(Boolean)).size
    const totalPayroll = employees.reduce((s, e) => s + Number(e.basicSalary ?? 0), 0)
    return { active, departments, totalPayroll }
  }, [employees])

  const openNew = () => { setForm(EMPTY); setOpen(true) }

  const openEdit = (row: any) => {
    setForm({
      ...EMPTY,
      id: row.id,
      employeeCode: row.employeeCode ?? '',
      firstName: row.firstName ?? '',
      lastName: row.lastName ?? '',
      designation: row.designation ?? '',
      department: row.department ?? '',
      workEmail: row.workEmail ?? '',
      phone: row.phone ?? '',
      dateOfJoining: row.dateOfJoining ? new Date(row.dateOfJoining).toISOString().slice(0, 10) : '',
      employmentType: row.employmentType ?? 'FULL_TIME',
      basicSalary: Number(row.basicSalary ?? 0),
      status: row.status ?? 'ACTIVE',
    })
    setOpen(true)
  }

  const submit = () => {
    if (!form.employeeCode.trim() || !form.firstName.trim() || !form.lastName.trim()) {
      return toast.error('Code + first + last name are required')
    }
    if (!form.dateOfJoining) return toast.error('Date of joining is required')

    const payload: any = {
      employeeCode: form.employeeCode.trim().toUpperCase(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dateOfBirth: form.dateOfBirth || undefined,
      gender: form.gender || undefined,
      bloodGroup: form.bloodGroup || undefined,
      nationality: form.nationality || undefined,
      maritalStatus: form.maritalStatus || undefined,
      personalEmail: form.personalEmail || undefined,
      workEmail: form.workEmail || undefined,
      phone: form.phone || undefined,
      alternatePhone: form.alternatePhone || undefined,
      address: form.address || undefined,
      city: form.city || undefined,
      state: form.state || undefined,
      country: form.country || 'India',
      pincode: form.pincode || undefined,
      designation: form.designation || undefined,
      department: form.department || undefined,
      dateOfJoining: form.dateOfJoining,
      dateOfConfirmation: form.dateOfConfirmation || undefined,
      employmentType: form.employmentType,
      workLocation: form.workLocation || undefined,
      basicSalary: Number(form.basicSalary ?? 0),
      panNumber: form.panNumber || undefined,
      aadhaarNumber: form.aadhaarNumber || undefined,
      uanNumber: form.uanNumber || undefined,
      esiNumber: form.esiNumber || undefined,
      bankDetails: form.bankName || form.accountNumber
        ? {
            bankName: form.bankName || undefined,
            accountNumber: form.accountNumber || undefined,
            ifscCode: form.ifscCode || undefined,
            branchName: form.branchName || undefined,
          }
        : undefined,
      emergencyContact: form.emergencyName || form.emergencyPhone
        ? {
            name: form.emergencyName || undefined,
            relation: form.emergencyRelation || undefined,
            phone: form.emergencyPhone || undefined,
          }
        : undefined,
      status: form.status,
      notes: form.notes || undefined,
    }
    if (form.id) {
      updateMutation({ variables: { id: form.id, input: payload } })
    } else {
      createMutation({ variables: { input: { ...payload, organizationId: orgId } } })
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Employee Master"
        description="Single source of truth for every employee's personal, contact, employment, statutory and bank details."
        actions={
          <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
            <UserPlus className="h-4 w-4" />
            New employee
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Employees" value={formatNumber(employees.length)} icon={<Users className="h-5 w-5" />} tone="brand" />
        <StatCard label="Active" value={formatNumber(stats.active)} icon={<Users className="h-5 w-5" />} tone="emerald" />
        <StatCard label="Departments" value={formatNumber(stats.departments)} icon={<Building2 className="h-5 w-5" />} tone="sky" />
        <StatCard label="Payroll (basic)" value={formatMoneyCompact(stats.totalPayroll)} icon={<Briefcase className="h-5 w-5" />} tone="warn" />
      </div>

      <SectionCard
        title="Employee register"
        description={`${filtered.length} of ${employees.length} employees`}
        action={
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-border bg-secondary/40 py-1.5 px-2 text-xs">
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Code / name / email"
                className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs w-56 focus:ring-2 focus:ring-primary/40 outline-none"
              />
            </div>
          </div>
        }
        bodyClassName="p-0"
      >
        {listQ.loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No employees yet</p>
            <p className="text-xs text-muted-foreground mb-3">Add your first employee record.</p>
            <Button onClick={openNew} className="bg-grad-brand text-white border-none gap-1.5">
              <UserPlus className="h-4 w-4" /> New employee
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Designation</th>
                  <th className="px-3 py-3 font-medium">Department</th>
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">Joined</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e: any) => {
                  const ini = ((e.firstName?.[0] ?? '') + (e.lastName?.[0] ?? '')).toUpperCase() || 'E'
                  return (
                    <tr key={e.id} className="border-t hover:bg-secondary/30 cursor-pointer" onClick={() => openEdit(e)}>
                      <td className="px-5 py-3 font-mono text-xs font-semibold">{e.employeeCode}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-grad-brand text-white grid place-items-center font-semibold text-xs">{ini}</div>
                          <span className="font-medium">{e.firstName} {e.lastName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{e.designation || '—'}</td>
                      <td className="px-3 py-3 text-muted-foreground">{e.department || '—'}</td>
                      <td className="px-3 py-3 text-xs">{e.workEmail || '—'}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{e.dateOfJoining ? formatDate(e.dateOfJoining) : '—'}</td>
                      <td className="px-3 py-3">
                        <EmpStatusBadge status={e.status} />
                      </td>
                      <td className="px-5 py-3 text-right" onClick={(ev) => ev.stopPropagation()}>
                        <div className="inline-flex items-center gap-1">
                          <button onClick={() => openEdit(e)} className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Remove ${e.firstName} ${e.lastName}?`)) deleteMutation({ variables: { id: e.id } }) }}
                            className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={form.id ? 'Edit employee' : 'Add employee'}
        description="Personal, employment, statutory and bank details."
        icon={<UserPlus className="h-5 w-5" />}
        size="xl"
        submitting={creating || updating}
        onSubmit={submit}
        submitLabel={form.id ? 'Save changes' : 'Create employee'}
      >
        <FormSection title="Identification">
          <FieldGrid cols={3}>
            <Field label="Employee code *" value={form.employeeCode} onChange={(v) => setForm({ ...form, employeeCode: v.toUpperCase() })} mono />
            <Field label="First name *" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
            <Field label="Last name *" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
            <Field label="Date of birth" type="date" value={form.dateOfBirth} onChange={(v) => setForm({ ...form, dateOfBirth: v })} />
            <SelectField label="Gender" value={form.gender} onChange={(v) => setForm({ ...form, gender: v })} options={['', 'MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']} />
            <Field label="Blood group" value={form.bloodGroup} onChange={(v) => setForm({ ...form, bloodGroup: v })} placeholder="O+" />
            <Field label="Nationality" value={form.nationality} onChange={(v) => setForm({ ...form, nationality: v })} />
            <SelectField label="Marital status" value={form.maritalStatus} onChange={(v) => setForm({ ...form, maritalStatus: v })} options={['', 'SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']} />
          </FieldGrid>
        </FormSection>

        <FormSection title="Contact" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={2}>
            <Field label="Work email" type="email" value={form.workEmail} onChange={(v) => setForm({ ...form, workEmail: v })} />
            <Field label="Personal email" type="email" value={form.personalEmail} onChange={(v) => setForm({ ...form, personalEmail: v })} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Alternate phone" value={form.alternatePhone} onChange={(v) => setForm({ ...form, alternatePhone: v })} />
          </FieldGrid>
          <FieldGrid cols={3} className="mt-3">
            <div className="sm:col-span-3">
              <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            </div>
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
            <Field label="Pincode" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} />
          </FieldGrid>
        </FormSection>

        <FormSection title="Employment" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={3}>
            <Field label="Designation" value={form.designation} onChange={(v) => setForm({ ...form, designation: v })} />
            <Field label="Department" value={form.department} onChange={(v) => setForm({ ...form, department: v })} />
            <SelectField label="Employment type" value={form.employmentType} onChange={(v) => setForm({ ...form, employmentType: v })} options={EMPLOYMENT_TYPES} />
            <Field label="Date of joining *" type="date" value={form.dateOfJoining} onChange={(v) => setForm({ ...form, dateOfJoining: v })} />
            <Field label="Date of confirmation" type="date" value={form.dateOfConfirmation} onChange={(v) => setForm({ ...form, dateOfConfirmation: v })} />
            <Field label="Work location" value={form.workLocation} onChange={(v) => setForm({ ...form, workLocation: v })} />
            <Field label="Basic salary (₹/mo)" type="number" value={String(form.basicSalary)} onChange={(v) => setForm({ ...form, basicSalary: Number(v) })} />
            <SelectField label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={STATUSES} />
          </FieldGrid>
        </FormSection>

        <FormSection title="Statutory IDs (India)" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={4}>
            <Field label="PAN" value={form.panNumber} onChange={(v) => setForm({ ...form, panNumber: v.toUpperCase() })} mono />
            <Field label="Aadhaar" value={form.aadhaarNumber} onChange={(v) => setForm({ ...form, aadhaarNumber: v })} mono />
            <Field label="UAN (EPF)" value={form.uanNumber} onChange={(v) => setForm({ ...form, uanNumber: v })} mono />
            <Field label="ESI" value={form.esiNumber} onChange={(v) => setForm({ ...form, esiNumber: v })} mono />
          </FieldGrid>
        </FormSection>

        <FormSection title="Bank details" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={2}>
            <Field label="Bank name" value={form.bankName} onChange={(v) => setForm({ ...form, bankName: v })} />
            <Field label="Account number" value={form.accountNumber} onChange={(v) => setForm({ ...form, accountNumber: v })} mono />
            <Field label="IFSC code" value={form.ifscCode} onChange={(v) => setForm({ ...form, ifscCode: v.toUpperCase() })} mono />
            <Field label="Branch" value={form.branchName} onChange={(v) => setForm({ ...form, branchName: v })} />
          </FieldGrid>
        </FormSection>

        <FormSection title="Emergency contact" className="pt-5 border-t border-border mt-5">
          <FieldGrid cols={3}>
            <Field label="Name" value={form.emergencyName} onChange={(v) => setForm({ ...form, emergencyName: v })} />
            <Field label="Relation" value={form.emergencyRelation} onChange={(v) => setForm({ ...form, emergencyRelation: v })} />
            <Field label="Phone" value={form.emergencyPhone} onChange={(v) => setForm({ ...form, emergencyPhone: v })} />
          </FieldGrid>
        </FormSection>

        {form.id && (
          <FormSection title="Attachments" description="Offer letters, ID copies, certificates…" className="pt-5 border-t border-border mt-5">
            <DocumentAttachments parentModule="employee" parentId={form.id} hideHeader compact />
          </FormSection>
        )}
      </FormModal>
    </div>
  )
}

function Field({ label, value, onChange, type, placeholder, mono }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; mono?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type={type ?? 'text'} placeholder={placeholder} className={mono ? 'font-mono' : ''} />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
        {options.map((o) => <option key={o} value={o}>{o ? o.replace('_', ' ') : '—'}</option>)}
      </select>
    </div>
  )
}

function EmpStatusBadge({ status }: { status: string }) {
  const s = String(status || '').toUpperCase()
  const tone =
    s === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : s === 'ON_LEAVE' ? 'bg-sky-50 text-sky-700 border-sky-200'
        : s === 'NOTICE_PERIOD' ? 'bg-amber-50 text-amber-700 border-amber-200'
          : s === 'TERMINATED' || s === 'RESIGNED' ? 'bg-rose-50 text-rose-700 border-rose-200'
            : 'bg-slate-100 text-slate-700 border-slate-200'
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase', tone)}>{s.replace('_', ' ')}</span>
}
