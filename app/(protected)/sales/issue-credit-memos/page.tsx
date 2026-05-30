'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_CUSTOMER_INVOICES,
  APPLY_CUSTOMER_CREDIT_MEMO,
  GET_ORGANIZATIONS,
} from '@/gql/queries'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  FileMinus, FileText, AlertCircle, CheckCircle2,
  Building2, CalendarDays, DollarSign, Hash, Info,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney, getCurrencySymbol } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const CREDIT_REASONS = [
  'Returned goods',
  'Billing error',
  'Duplicate charge',
  'Service not rendered',
  'Pricing adjustment',
  'Damaged goods',
  'Other',
]

const INV_STATUS: Record<string, { label: string; cls: string }> = {
  draft:          { label: 'Draft',         cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  approved:       { label: 'Approved',      cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  sent:           { label: 'Sent',          cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  partially_paid: { label: 'Partial',       cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  paid:           { label: 'Paid',          cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  overdue:        { label: 'Overdue',       cls: 'bg-red-50 text-red-700 border-red-200' },
  cancelled:      { label: 'Credit Issued', cls: 'bg-rose-50 text-rose-600 border-rose-200' },
}

// Statuses eligible for a credit memo
const ELIGIBLE = ['approved', 'sent', 'partially_paid', 'paid', 'overdue']

const today = () => new Date().toISOString().split('T')[0]

export default function IssueCreditMemosPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: invData, loading, refetch } = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: orgsData } = useQuery(GET_ORGANIZATIONS, { variables: { page: 1, limit: 200 } })

  const [issueMemo, { loading: issuing, error: issueError }] = useMutation(APPLY_CUSTOMER_CREDIT_MEMO, {
    onCompleted: () => {
      setSelected(null)
      resetForm()
      refetch()
    },
  })

  const [selected, setSelected] = useState<any>(null)
  const [form, setForm] = useState({ creditAmount: '', reason: '', notes: '', memoDate: today() })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'eligible' | 'issued'>('eligible')

  const orgs: any[] = orgsData?.organizations ?? []
  const allInvoices: any[] = invData?.customerinvoices ?? []
  const eligible = allInvoices.filter(inv => ELIGIBLE.includes(inv.status))
  const issued = allInvoices.filter(inv => inv.status === 'cancelled')

  const getOrgName = (id: string) => orgs.find(o => o.id === id)?.name ?? id

  const resetForm = () => {
    setForm({ creditAmount: '', reason: '', notes: '', memoDate: today() })
    setErrors({})
  }

  const openDialog = (inv: any) => {
    setSelected(inv)
    setForm({ creditAmount: String(inv.totalAmount), reason: '', notes: '', memoDate: today() })
    setErrors({})
  }

  const validate = () => {
    const e: Record<string, string> = {}
    const amt = parseFloat(form.creditAmount)
    if (!form.creditAmount || isNaN(amt) || amt <= 0)
      e.creditAmount = 'Enter a valid credit amount'
    else if (amt > selected.totalAmount)
      e.creditAmount = `Cannot exceed invoice total (${formatMoney(selected.totalAmount)})`
    if (!form.reason) e.reason = 'Reason is required'
    if (!form.memoDate) e.memoDate = 'Memo date is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !validate()) return
    const creditAmt = parseFloat(form.creditAmount)
    // Apply credit: reduce paidAmount by credit, mark as cancelled
    const reason = [form.reason, form.notes].filter(Boolean).join(' — ')
    issueMemo({
      variables: {
        id: selected.id,
        creditAmount: creditAmt,
        reason: reason || undefined,
      },
    })
  }

  const stats = {
    eligible: eligible.length,
    issued: issued.length,
    totalCredited: issued.reduce((s: number, inv: any) => s + (inv.totalAmount ?? 0), 0),
  }

  const InvoiceTable = ({ invoices, showAction }: { invoices: any[]; showAction: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 hover:bg-gray-50">
          {['Invoice #', 'Customer', 'Invoice Date', 'Due Date', 'Total', 'Paid', 'Status', showAction ? 'Action' : ''].filter(Boolean).map(h => (
            <TableHead key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wide first:pl-6">{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(inv => {
          const s = INV_STATUS[inv.status] ?? INV_STATUS.draft
          return (
            <TableRow key={inv.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="pl-6 font-mono text-xs text-gray-400">{inv.seqNo || '—'}</TableCell>
              <TableCell className="text-sm font-medium text-gray-800">{getOrgName(inv.customerId)}</TableCell>
              <TableCell className="text-sm text-gray-600">{inv.invoiceDate ? formatDate(inv.invoiceDate) : '—'}</TableCell>
              <TableCell className="text-sm text-gray-600">{inv.dueDate ? formatDate(inv.dueDate) : '—'}</TableCell>
              <TableCell className="text-sm font-semibold text-gray-800">
                {formatMoney(inv.totalAmount)}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {formatMoney(inv.paidAmount ?? 0)}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>
                  {s.label}
                </span>
              </TableCell>
              {showAction && (
                <TableCell>
                  <Button size="sm" onClick={() => openDialog(inv)}
                    className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white">
                    <FileMinus className="h-3 w-3 mr-1" /> Issue Credit
                  </Button>
                </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  return (
    
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold">Issue Credit Memos</h1>
          <p className="text-gray-500">Issue credit memos against customer invoices</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Eligible Invoices', value: stats.eligible,      icon: FileText,    color: 'text-blue-600',   bg: 'bg-blue-50',  fmt: (v: number) => String(v) },
          { label: 'Credits Issued',    value: stats.issued,        icon: FileMinus,   color: 'text-rose-600',   bg: 'bg-rose-50',  fmt: (v: number) => String(v) },
          { label: 'Total Credited',    value: stats.totalCredited, icon: DollarSign,  color: 'text-amber-600',  bg: 'bg-amber-50', fmt: (v: number) => formatMoney(v) },
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

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {(['eligible', 'issued'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {tab === 'eligible' ? `Eligible (${stats.eligible})` : `Credits Issued (${stats.issued})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-sm border">
        <CardHeader className="py-4 px-6 border-b">
          <CardTitle className="text-base font-semibold text-gray-800">
            {activeTab === 'eligible' ? 'Invoices Eligible for Credit' : 'Issued Credit Memos'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading…</div>
          ) : (activeTab === 'eligible' ? eligible : issued).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileMinus className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">
                {activeTab === 'eligible' ? 'No eligible invoices found.' : 'No credit memos issued yet.'}
              </p>
            </div>
          ) : (
            <InvoiceTable
              invoices={activeTab === 'eligible' ? eligible : issued}
              showAction={activeTab === 'eligible'}
            />
          )}
        </CardContent>
      </Card>

      {/* Credit Memo Dialog */}
      <Dialog open={!!selected} onOpenChange={v => { if (!v) { setSelected(null); resetForm() } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="bg-rose-50 p-1.5 rounded-md">
                <FileMinus className="h-4 w-4 text-rose-600" />
              </div>
              Issue Credit Memo
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <form onSubmit={handleSubmit} className="space-y-5 pt-1">

              {/* Invoice summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice Reference</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Hash className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Invoice #</p>
                      <p className="text-sm font-semibold font-mono text-gray-800">{selected.seqNo || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Customer</p>
                      <p className="text-sm font-medium text-gray-800">{getOrgName(selected.customerId)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Invoice Date</p>
                      <p className="text-sm text-gray-700">
                        {selected.invoiceDate ? formatDate(selected.invoiceDate) : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Invoice Total</p>
                      <p className="text-base font-bold text-gray-800">
                        {formatMoney(selected.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Credit memo fields */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Credit Memo Details</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Credit Amount */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Credit Amount <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{getCurrencySymbol()}</span>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      max={selected.totalAmount}
                      placeholder="0.00"
                      value={form.creditAmount}
                      onChange={e => { setForm(p => ({ ...p, creditAmount: e.target.value })); setErrors(p => ({ ...p, creditAmount: '' })) }}
                      className={`pl-7 ${errors.creditAmount ? 'border-red-400' : ''}`}
                    />
                  </div>
                  {errors.creditAmount
                    ? <p className="text-xs text-red-500">{errors.creditAmount}</p>
                    : <p className="text-xs text-gray-400">Max: {formatMoney(selected.totalAmount)}</p>
                  }
                </div>

                {/* Memo Date */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Memo Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={form.memoDate}
                    onChange={e => { setForm(p => ({ ...p, memoDate: e.target.value })); setErrors(p => ({ ...p, memoDate: '' })) }}
                    className={errors.memoDate ? 'border-red-400' : ''}
                  />
                  {errors.memoDate && <p className="text-xs text-red-500">{errors.memoDate}</p>}
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Reason <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.reason}
                  onValueChange={v => { setForm(p => ({ ...p, reason: v })); setErrors(p => ({ ...p, reason: '' })) }}
                >
                  <SelectTrigger className={errors.reason ? 'border-red-400' : ''}>
                    <SelectValue placeholder="Select reason…" />
                  </SelectTrigger>
                  <SelectContent>
                    {CREDIT_REASONS.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reason && <p className="text-xs text-red-500">{errors.reason}</p>}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Notes <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <Textarea
                  placeholder="Additional details about this credit memo…"
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Warning banner */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">
                  Issuing a credit memo will mark this invoice as <strong>Cancelled</strong> and cannot be undone.
                </p>
              </div>

              {issueError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {issueError.message}
                </p>
              )}

              <DialogFooter className="pt-1">
                <Button type="button" variant="outline" onClick={() => { setSelected(null); resetForm() }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={issuing} className="bg-rose-600 hover:bg-rose-700 text-white min-w-[150px]">
                  {issuing ? 'Issuing…' : 'Issue Credit Memo'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
