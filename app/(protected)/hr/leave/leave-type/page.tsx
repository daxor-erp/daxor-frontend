'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Palmtree, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_LEAVE_TYPES,
  CREATE_LEAVE_TYPE,
  UPDATE_LEAVE_TYPE,
  DELETE_LEAVE_TYPE,
} from '@/gql/leave'

export default function LeaveTypePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)
  const [form, setForm] = useState({
    code: '',
    name: '',
    paid: true,
    defaultDaysPerYear: '12',
    allowCarryForward: false,
    maxCarryForwardDays: '0',
    active: true,
  })

  const { data, loading, refetch } = useQuery(GET_LEAVE_TYPES, {
    variables: { organizationId: orgId, activeOnly: false },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [createLt, { loading: creating }] = useMutation(CREATE_LEAVE_TYPE, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Leave type saved.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [updateLt, { loading: updating }] = useMutation(UPDATE_LEAVE_TYPE, {
    onCompleted: () => {
      refetch()
      closeDialog()
      setBanner({ ok: true, text: 'Leave type updated.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })
  const [deleteLt] = useMutation(DELETE_LEAVE_TYPE, {
    onCompleted: () => {
      refetch()
      setBanner({ ok: true, text: 'Leave type removed.' })
      setTimeout(() => setBanner(null), 4000)
    },
    onError: (e) => setBanner({ ok: false, text: e.message }),
  })

  const rows = data?.leaveTypes ?? []
  const busy = creating || updating

  const closeDialog = () => {
    setOpen(false)
    setEditingId(null)
    setForm({
      code: '',
      name: '',
      paid: true,
      defaultDaysPerYear: '12',
      allowCarryForward: false,
      maxCarryForwardDays: '0',
      active: true,
    })
  }

  const openCreate = () => {
    closeDialog()
    setEditingId(null)
    setOpen(true)
  }

  const openEdit = (r: (typeof rows)[0]) => {
    setEditingId(r.id)
    setForm({
      code: r.code,
      name: r.name,
      paid: r.paid,
      defaultDaysPerYear: String(r.defaultDaysPerYear),
      allowCarryForward: r.allowCarryForward,
      maxCarryForwardDays: String(r.maxCarryForwardDays ?? 0),
      active: r.active,
    })
    setOpen(true)
  }

  const submit = () => {
    if (!orgId) return
    const input = {
      code: form.code.trim(),
      name: form.name.trim(),
      paid: form.paid,
      defaultDaysPerYear: parseFloat(form.defaultDaysPerYear) || 0,
      allowCarryForward: form.allowCarryForward,
      maxCarryForwardDays: parseFloat(form.maxCarryForwardDays) || 0,
      organizationId: orgId,
      active: form.active,
    }
    if (!input.code || !input.name) return
    if (editingId) {
      updateLt({
        variables: {
          id: editingId,
          input: {
            code: input.code,
            name: input.name,
            paid: input.paid,
            defaultDaysPerYear: input.defaultDaysPerYear,
            allowCarryForward: input.allowCarryForward,
            maxCarryForwardDays: input.maxCarryForwardDays,
            active: input.active,
          },
        },
      })
    } else {
      createLt({ variables: { input } })
    }
  }

  if (!orgId) {
    return <p className="p-6 text-sm text-gray-500">Select an organization to manage leave types.</p>
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Palmtree className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wide">HR · Leave</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Leave type</h1>
          <p className="text-gray-500 mt-1">
            Define paid / unpaid categories, default entitlements, and carry-forward rules for salary processing.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          <Plus className="h-4 w-4 mr-2" /> New leave type
        </Button>
      </div>

      {banner && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm border ${
            banner.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {banner.ok && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {banner.text}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold">
          Master list
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No leave types yet. Create one to use in enrollment and applications.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Code</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Name</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Paid</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Days / yr</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Carry fwd</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-gray-600 w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r: (typeof rows)[0]) => (
                <TableRow key={r.id} className="hover:bg-blue-50/40">
                  <TableCell className="font-mono text-sm font-medium">{r.code}</TableCell>
                  <TableCell className="text-sm">{r.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={r.paid ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}>
                      {r.paid ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{r.defaultDaysPerYear}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {r.allowCarryForward ? `Yes (max ${r.maxCarryForwardDays})` : 'No'}
                  </TableCell>
                  <TableCell>
                    <Badge className={r.active ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-600'}>
                      {r.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}>
                      <Pencil className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (confirm(`Remove leave type “${r.name}”?`)) deleteLt({ variables: { id: r.id } })
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={(v) => !v && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit leave type' : 'New leave type'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Code</Label>
                <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className="mt-1" placeholder="AL" />
              </div>
              <div>
                <Label className="text-xs">Name</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1" placeholder="Annual leave" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="paid"
                checked={form.paid}
                onChange={(e) => setForm((f) => ({ ...f, paid: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="paid" className="text-sm font-normal">Paid leave (affects payroll)</Label>
            </div>
            <div>
              <Label className="text-xs">Default days per year</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={form.defaultDaysPerYear}
                onChange={(e) => setForm((f) => ({ ...f, defaultDaysPerYear: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cf"
                checked={form.allowCarryForward}
                onChange={(e) => setForm((f) => ({ ...f, allowCarryForward: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="cf" className="text-sm font-normal">Allow carry forward</Label>
            </div>
            {form.allowCarryForward && (
              <div>
                <Label className="text-xs">Max carry forward (days)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.maxCarryForwardDays}
                  onChange={(e) => setForm((f) => ({ ...f, maxCarryForwardDays: e.target.value }))}
                  className="mt-1"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="act"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="act" className="text-sm font-normal">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" disabled={busy} onClick={submit}>
              {busy ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
