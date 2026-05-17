'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_SALES_ORDERS, CREATE_CASH_SALE, GET_ORGANIZATIONS, GET_ITEMS, GET_PROJECTS } from '@/gql/queries'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, ShoppingBag, DollarSign, Receipt, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const today = () => new Date().toISOString().split('T')[0]

interface LineItem { description: string; qty: string; unitPrice: string }
const emptyLine = (): LineItem => ({ description: '', qty: '', unitPrice: '' })

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  active:    { label: 'Active',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200' },
}

export default function EnterCashSalesPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: soData, loading: soLoading, refetch } = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 100, cashSale: true, status: 'active' },
    skip: !orgId,
  })
  const { data: orgsData } = useQuery(GET_ORGANIZATIONS, { variables: { page: 1, limit: 200 } })
  const { data: itemsData } = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: projectsData } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })

  const [createCashSale, { loading: saving, error: saveError }] = useMutation(CREATE_CASH_SALE, {
    onCompleted: () => { setOpen(false); reset(); refetch() },
  })

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ customerId: '', projectId: '', saleDate: today(), notes: '' })
  const [lines, setLines] = useState<LineItem[]>([emptyLine()])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const orgs = orgsData?.organizations ?? []
  const items = itemsData?.items ?? []
  const projects = projectsData?.projects ?? []
  // Cash sales = sales orders with status active (immediate)
  const cashSales = (soData?.salesorders ?? []).filter((s: any) => s.status === 'active')

  const subtotal = lines.reduce((s, l) => s + (parseFloat(l.qty) || 0) * (parseFloat(l.unitPrice) || 0), 0)

  const reset = () => {
    setForm({ customerId: '', projectId: '', saleDate: today(), notes: '' })
    setLines([emptyLine()])
    setErrors({})
  }

  const updateLine = (i: number, f: keyof LineItem, v: string) =>
    setLines(p => p.map((l, idx) => idx === i ? { ...l, [f]: v } : l))

  const pickItem = (i: number, itemId: string) => {
    const item = items.find((it: any) => it.id === itemId)
    if (item) setLines(p => p.map((l, idx) => idx === i
      ? { ...l, description: item.name, unitPrice: String(item.rate ?? '') }
      : l))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.customerId) e.customerId = 'Customer is required'
    if (!form.saleDate) e.saleDate = 'Sale date is required'
    lines.forEach((l, i) => {
      if (!l.description.trim()) e[`d${i}`] = 'Required'
      if (!(parseFloat(l.qty) > 0)) e[`q${i}`] = 'Required'
      if (!(parseFloat(l.unitPrice) > 0)) e[`p${i}`] = 'Required'
    })
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    createCashSale({
      variables: {
        input: {
          customerId: form.customerId,
          projectId: form.projectId || undefined,
          orderDate: form.saleDate,
          totalAmount: subtotal,
          organizationId: orgId,
          cashSale: true,
        },
      },
    })
  }

  const stats = {
    total: cashSales.length,
    revenue: cashSales.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0),
    today: cashSales.filter((o: any) => o.orderDate?.startsWith(today())).length,
  }

  return (
    
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold">Enter Cash Sales</h1>
          <p className="text-gray-500">Record immediate cash sale transactions</p>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Sales',   value: stats.total,   icon: ShoppingBag, color: 'text-blue-600',    bg: 'bg-blue-50',    fmt: (v: number) => String(v) },
          { label: "Today's Sales", value: stats.today,   icon: TrendingUp,  color: 'text-emerald-600', bg: 'bg-emerald-50', fmt: (v: number) => String(v) },
          { label: 'Total Revenue', value: stats.revenue, icon: DollarSign,  color: 'text-indigo-600',  bg: 'bg-indigo-50',  fmt: (v: number) => formatMoney(v) },
        ].map(({ label, value, icon: Icon, color, bg, fmt }) => (
          <Card key={label} className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${bg} p-2 rounded-lg`}><Icon className={`h-5 w-5 ${color}`} /></div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-800">{fmt(value)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-sm border">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b">
          <CardTitle className="text-base font-semibold text-gray-800">Cash Sales</CardTitle>
          <Button size="sm" onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-1.5 h-4 w-4" /> New Cash Sale
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {soLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading…</div>
          ) : cashSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ShoppingBag className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No cash sales recorded yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  {['Ref #', 'Customer', 'Project', 'Sale Date', 'Amount', 'Status'].map(h => (
                    <TableHead key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wide first:pl-6">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashSales.map((s: any) => {
                  const cfg = STATUS_CFG[s.status] ?? STATUS_CFG.draft
                  const org = orgs.find((o: any) => o.id === s.customerId)
                  const proj = projects.find((p: any) => p.id === s.projectId)
                  return (
                    <TableRow key={s.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="pl-6 font-mono text-xs text-gray-400">{s.seqNo || '—'}</TableCell>
                      <TableCell className="text-sm font-medium text-gray-800">{org?.name ?? s.customerId}</TableCell>
                      <TableCell className="text-sm text-gray-500">{proj?.name ?? '—'}</TableCell>
                      <TableCell className="text-sm text-gray-600">{s.orderDate ? formatDate(s.orderDate) : '—'}</TableCell>
                      <TableCell className="text-sm font-semibold text-gray-800">{formatMoney(s.totalAmount)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>{cfg.label}</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) reset() }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="bg-blue-50 p-1.5 rounded-md"><ShoppingBag className="h-4 w-4 text-blue-600" /></div>
              New Cash Sale
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-1">
            <div className="grid grid-cols-2 gap-4">
              {/* Customer */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Customer <span className="text-red-500">*</span></Label>
                <Select value={form.customerId} onValueChange={v => { setForm(p => ({ ...p, customerId: v })); setErrors(p => ({ ...p, customerId: '' })) }}>
                  <SelectTrigger className={errors.customerId ? 'border-red-400' : ''}>
                    <SelectValue placeholder="Select customer…" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgs.map((o: any) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.customerId && <p className="text-xs text-red-500">{errors.customerId}</p>}
              </div>

              {/* Sale Date */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Sale Date <span className="text-red-500">*</span></Label>
                <Input type="date" value={form.saleDate}
                  onChange={e => { setForm(p => ({ ...p, saleDate: e.target.value })); setErrors(p => ({ ...p, saleDate: '' })) }}
                  className={errors.saleDate ? 'border-red-400' : ''} />
                {errors.saleDate && <p className="text-xs text-red-500">{errors.saleDate}</p>}
              </div>

              {/* Project */}
              <div className="space-y-1.5 col-span-2">
                <Label className="text-sm font-medium">Project <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Select value={form.projectId} onValueChange={v => setForm(p => ({ ...p, projectId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Link to project…" /></SelectTrigger>
                  <SelectContent>
                    {projects.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Line items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Items</p>
                <Button type="button" variant="outline" size="sm" onClick={() => setLines(p => [...p, emptyLine()])} className="text-xs h-7">
                  <Plus className="h-3 w-3 mr-1" /> Add Item
                </Button>
              </div>
              <div className="grid grid-cols-12 gap-2 px-1 mb-1">
                <p className="col-span-1 text-xs text-gray-400 font-medium">Catalogue</p>
                <p className="col-span-5 text-xs text-gray-400 font-medium">Description</p>
                <p className="col-span-2 text-xs text-gray-400 font-medium">Qty</p>
                <p className="col-span-3 text-xs text-gray-400 font-medium">Unit Price</p>
                <p className="col-span-1 text-xs text-gray-400 font-medium text-right">Total</p>
              </div>
              <div className="space-y-2">
                {lines.map((l, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-start">
                    {/* Item picker */}
                    <div className="col-span-1">
                      <Select onValueChange={v => pickItem(i, v)}>
                        <SelectTrigger className="h-9 px-2"><SelectValue placeholder="…" /></SelectTrigger>
                        <SelectContent>
                          {items.map((it: any) => <SelectItem key={it.id} value={it.id}>{it.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-5">
                      <Input placeholder="Description" value={l.description}
                        onChange={e => updateLine(i, 'description', e.target.value)}
                        className={`text-sm ${errors[`d${i}`] ? 'border-red-400' : ''}`} />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" min="0" placeholder="0" value={l.qty}
                        onChange={e => updateLine(i, 'qty', e.target.value)}
                        className={`text-sm ${errors[`q${i}`] ? 'border-red-400' : ''}`} />
                    </div>
                    <div className="col-span-3">
                      <Input type="number" min="0" step="0.01" placeholder="0.00" value={l.unitPrice}
                        onChange={e => updateLine(i, 'unitPrice', e.target.value)}
                        className={`text-sm ${errors[`p${i}`] ? 'border-red-400' : ''}`} />
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-1 pt-2">
                      <span className="text-xs text-gray-600 font-medium">
                        {formatMoney((parseFloat(l.qty) || 0) * (parseFloat(l.unitPrice) || 0))}
                      </span>
                      {lines.length > 1 && (
                        <button type="button" onClick={() => setLines(p => p.filter((_, idx) => idx !== i))}
                          className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-52 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>{formatMoney(subtotal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold text-gray-800">
                  <span>Total</span><span>{formatMoney(subtotal)}</span>
                </div>
              </div>
            </div>

            {saveError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{saveError.message}</p>}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]">
                {saving ? 'Saving…' : 'Record Sale'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
