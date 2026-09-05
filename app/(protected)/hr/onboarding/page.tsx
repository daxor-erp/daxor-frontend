'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SelectFloating } from '@/components/ui/select-floating'
import { Plus, CheckSquare, Square } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_ONBOARDINGS,
  CREATE_ONBOARDING,
  TOGGLE_ONBOARDING_TASK,
  GET_EMPLOYEE_MASTERS,
} from '@/gql/queries'

export default function OnboardingPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [employeeId, setEmployeeId] = useState('')

  const { data: empData } = useQuery(GET_EMPLOYEE_MASTERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })
  const { data, loading, refetch } = useQuery(GET_ONBOARDINGS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createOnboarding, { loading: saving }] = useMutation(CREATE_ONBOARDING, {
    onCompleted: () => { setOpen(false); setEmployeeId(''); refetch() },
  })
  const [toggleTask] = useMutation(TOGGLE_ONBOARDING_TASK, { onCompleted: () => refetch() })

  const employees: any[] = empData?.employeeMasters ?? []
  const empLookup = useMemo(() => {
    const m = new Map<string, string>()
    for (const e of employees) m.set(e.id, `${e.firstName} ${e.lastName} (${e.employeeCode})`)
    return m
  }, [employees])

  const rows: any[] = data?.onboardings ?? []

  return (
    <div className="erp-shell">
      <div className="flex justify-between items-center">
        <h1 className="erp-page-title">Onboarding</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Start onboarding
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader><DialogTitle>Start onboarding</DialogTitle></DialogHeader>
          <SelectFloating
            label="Employee"
            value={employeeId}
            onChange={(v) => setEmployeeId(typeof v === 'string' ? v : (v as any).target.value)}
            options={employees.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName} — ${e.employeeCode}` }))}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() =>
                createOnboarding({
                  variables: {
                    input: { organizationId: orgId, employeeId, startedAt: new Date().toISOString() },
                  },
                })
              }
              disabled={!employeeId || saving}
            >
              {saving ? 'Starting…' : 'Start'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <p className="erp-page-desc">Loading…</p>
      ) : rows.length === 0 ? (
        <Card><CardContent className="p-6 text-gray-500">No onboardings started.</CardContent></Card>
      ) : (
        rows.map((o) => {
          const completed = o.tasks.filter((t: any) => t.done).length
          return (
            <Card key={o.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{empLookup.get(o.employeeId) ?? o.employeeId}</CardTitle>
                  <p className="text-xs text-gray-500">Started {new Date(o.startedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{completed}/{o.tasks.length} done</span>
                  <Badge variant="outline" className={o.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}>
                    {o.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {o.tasks.map((t: any, i: number) => (
                    <li key={i}>
                      <button
                        className="flex items-center gap-2 text-sm text-left hover:bg-gray-50 w-full p-1 rounded"
                        onClick={() => toggleTask({ variables: { id: o.id, index: i, done: !t.done } })}
                      >
                        {t.done ? <CheckSquare className="h-4 w-4 text-emerald-600" /> : <Square className="h-4 w-4 text-gray-400" />}
                        <span className={t.done ? 'line-through text-gray-500' : ''}>{t.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
