'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_ALLOCATION_SCHEDULES, CREATE_ALLOCATION_SCHEDULE, UPDATE_ALLOCATION_SCHEDULE, DELETE_ALLOCATION_SCHEDULE, GET_CHART_OF_ACCOUNTS } from '@/gql/queries'
import { Trash2, Edit, X, Save, Plus, Minus } from 'lucide-react'

const EMPTY_LINE = { destinationAccount: '', percentage: '' }

export default function CreateAllocationSchedulesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({
    scheduleName: '',
    sourceAccount: '',
    allocationMethod: 'percentage',
    lines: [{ ...EMPTY_LINE }],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data, loading, refetch } = useQuery(GET_ALLOCATION_SCHEDULES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: accountsData } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createSchedule, { loading: saving }] = useMutation(CREATE_ALLOCATION_SCHEDULE, {
    onCompleted: () => { refetch(); setAdding(false); reset() },
  })

  const [updateSchedule, { loading: updating }] = useMutation(UPDATE_ALLOCATION_SCHEDULE, {
    onCompleted: () => { refetch(); setEditing(null); reset() },
  })

  const [deleteSchedule] = useMutation(DELETE_ALLOCATION_SCHEDULE, {
    onCompleted: () => refetch(),
  })

  const reset = () => {
    setForm({
      scheduleName: '',
      sourceAccount: '',
      allocationMethod: 'percentage',
      lines: [{ ...EMPTY_LINE }],
    })
    setErrors({})
  }

  const setF = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const setLine = (idx: number, k: string, v: string) => {
    const newLines = [...form.lines]
    newLines[idx] = { ...newLines[idx], [k]: v }
    setForm(p => ({ ...p, lines: newLines }))
  }

  const addLine = () => {
    setForm(p => ({ ...p, lines: [...p.lines, { ...EMPTY_LINE }] }))
  }

  const removeLine = (idx: number) => {
    if (form.lines.length > 1) {
      setForm(p => ({ ...p, lines: p.lines.filter((_, i) => i !== idx) }))
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.scheduleName.trim()) e.scheduleName = 'Required'
    if (!form.sourceAccount.trim()) e.sourceAccount = 'Required'
    
    const totalPercentage = form.lines.reduce((sum, l) => sum + (parseFloat(l.percentage) || 0), 0)
    if (form.allocationMethod === 'percentage' && Math.abs(totalPercentage - 100) > 0.01) {
      e.percentage = 'Total percentage must equal 100%'
    }
    
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = () => {
    if (!validate()) return
    const input = {
      scheduleName: form.scheduleName,
      sourceAccount: form.sourceAccount,
      allocationMethod: form.allocationMethod,
      lines: form.lines.map(l => ({
        destinationAccount: l.destinationAccount,
        percentage: parseFloat(l.percentage) || 0,
      })),
      isActive: true,
      organizationId: orgId,
    }
    if (editing) {
      updateSchedule({ variables: { id: editing, input } })
    } else {
      createSchedule({ variables: { input } })
    }
  }

  const handleEdit = (schedule: any) => {
    setForm({
      scheduleName: schedule.scheduleName || '',
      sourceAccount: schedule.sourceAccount || '',
      allocationMethod: schedule.allocationMethod || 'percentage',
      lines: schedule.lines?.length ? schedule.lines.map((l: any) => ({
        destinationAccount: l.destinationAccount || '',
        percentage: l.percentage?.toString() || '',
      })) : [{ ...EMPTY_LINE }],
    })
    setEditing(schedule.id)
    setAdding(true)
  }

  const schedules = data?.allocationSchedules || []
  const accounts = accountsData?.chartOfAccounts || []
  const totalPercentage = form.lines.reduce((sum, l) => sum + (parseFloat(l.percentage) || 0), 0)

  const columns: Column[] = [
    { key: 'seqNo', label: 'Code', width: '100px', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'scheduleName', label: 'Schedule Name', sortable: true, render: v => <span className="font-medium">{v}</span> },
    { key: 'sourceAccount', label: 'Source Account', render: v => <span className="text-xs">{v}</span> },
    { key: 'allocationMethod', label: 'Method', width: '110px', render: v => <span className="text-xs capitalize">{v}</span> },
    { key: 'isActive', label: 'Status', width: '90px', render: v => <span className={`px-2 py-0.5 rounded text-xs ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{v ? 'Active' : 'Inactive'}</span> },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Allocation Schedules</h1>
        <p className="text-gray-500">Define cost allocation rules</p>
      </div>

      {adding && (
        <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-blue-600">
            <span className="text-xs font-semibold text-white">{editing ? 'Edit Schedule' : 'New Schedule'}</span>
            <button onClick={() => { setAdding(false); setEditing(null); reset() }} className="text-blue-200 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <InputFloating label="Schedule Name *" value={form.scheduleName} onChange={e => setF('scheduleName', e.target.value)} error={errors.scheduleName} className="h-7 text-xs" />
              <InputFloating label="Source Account *" value={form.sourceAccount} onChange={e => setF('sourceAccount', e.target.value)} error={errors.sourceAccount} className="h-7 text-xs" />
              <SelectFloating label="Allocation Method" value={form.allocationMethod} onChange={e => setF('allocationMethod', typeof e === 'string' ? e : e.target.value)} options={[
                { value: 'percentage', label: 'Percentage' },
                { value: 'amount', label: 'Amount' },
              ]} className="h-7 text-xs" />
            </div>

            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Allocation Lines</span>
                <Button size="sm" onClick={addLine} className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />Add Line</Button>
              </div>
              
              {form.lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-8">
                    <InputFloating label="Destination Account" value={line.destinationAccount} onChange={e => setLine(idx, 'destinationAccount', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-3">
                    <InputFloating label="Percentage %" type="number" value={line.percentage} onChange={e => setLine(idx, 'percentage', e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-6">
                    {form.lines.length > 1 && (
                      <button onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700">
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-semibold">Total: {totalPercentage.toFixed(2)}%</span>
                {Math.abs(totalPercentage - 100) < 0.01 ? (
                  <span className="text-green-600 text-xs">✓ Valid</span>
                ) : (
                  <span className="text-red-600 text-xs">Must equal 100%</span>
                )}
              </div>
            </div>

            {errors.percentage && <p className="text-red-500 text-xs">{errors.percentage}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => { setAdding(false); setEditing(null); reset() }} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={saving || updating} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
                <Save className="h-3.5 w-3.5 mr-1" />{saving || updating ? 'Saving…' : editing ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={schedules}
        columns={columns}
        loading={loading}
        title="All Allocation Schedules"
        onAdd={() => { reset(); setAdding(true) }}
        addLabel="New Schedule"
        searchable
        searchPlaceholder="Search schedules..."
        emptyMessage="No allocation schedules yet. Click 'New Schedule' to create one."
        actions={[
          { label: 'Edit', icon: <Edit className="h-3.5 w-3.5" />, onClick: row => handleEdit(row), variant: 'ghost' },
          { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: row => { if (confirm('Delete this schedule?')) deleteSchedule({ variables: { id: row.id } }) }, variant: 'ghost' },
        ]}
      />
    </div>
  )
}
