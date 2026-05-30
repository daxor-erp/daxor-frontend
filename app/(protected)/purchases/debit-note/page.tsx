'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_PURCHASE_ORDERS,
  GET_VENDORS,
  GET_VENDOR_DEBIT_NOTES,
  CREATE_VENDOR_DEBIT_NOTE,
  GET_OUTSTANDING_VENDOR_BILLS,
  APPLY_VENDOR_DEBIT_NOTE_TO_BILL,
} from '@/gql/queries'
import { PageTemplate } from '@/components/page-template'
import { Button } from '@/components/ui/button'
import { FileText, X, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney, getCurrencySymbol } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'

const cell = 'border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 text-xs px-2 h-7 w-full rounded-sm'
const cellErr = 'border border-red-400 bg-red-50 outline-none focus:ring-1 focus:ring-red-400 text-xs px-2 h-7 w-full rounded-sm'
const today = () => new Date().toISOString().split('T')[0]

const REASONS = [
  'Overcharged by vendor',
  'Goods returned to vendor',
  'Defective / damaged goods',
  'Short delivery',
  'Wrong items delivered',
  'Duplicate invoice',
  'Other',
]

type TabId = 'eligible' | 'bills' | 'issued'
type SourceKind = 'po' | 'bill'

export default function DebitNotePage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const { data: poData, loading: poLoading, refetch: refetchPo } = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: vendorData } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 200 },
    skip: !orgId,
  })
  const { data: debitData, refetch: refetchDebits } = useQuery(GET_VENDOR_DEBIT_NOTES, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })
  const { data: outstandingBillsData, refetch: refetchBills } = useQuery(GET_OUTSTANDING_VENDOR_BILLS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [issueError, setIssueError] = useState<string | null>(null)
  const [applyError, setApplyError] = useState<string | null>(null)

  const [createDebit, { loading: issuing }] = useMutation(CREATE_VENDOR_DEBIT_NOTE, {
    onCompleted: () => {
      setIssueError(null)
      setSelected(null)
      resetForm()
      refetchPo()
      refetchDebits()
      refetchBills()
    },
    onError: (e) => setIssueError(e.message ?? 'Failed to create debit note'),
  })
  const [applyToBill, { loading: applying }] = useMutation(APPLY_VENDOR_DEBIT_NOTE_TO_BILL, {
    onCompleted: () => {
      setApplyError(null)
      setApplyTarget(null)
      setApplyBillId('')
      setApplyAmount('')
      refetchDebits()
      refetchBills()
    },
    onError: (e) => setApplyError(e.message ?? 'Failed to apply debit note'),
  })

  const [tab, setTab] = useState<TabId>('eligible')
  const [selected, setSelected] = useState<any>(null)
  const [sourceKind, setSourceKind] = useState<SourceKind>('po')
  const [applyTarget, setApplyTarget] = useState<any>(null)
  const [applyBillId, setApplyBillId] = useState('')
  const [applyAmount, setApplyAmount] = useState('')

  const [form, setForm] = useState({ amount: '', reason: '', date: today(), notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const orders: any[] = poData?.purchaseorders ?? []
  const vendors: any[] = vendorData?.vendors ?? []
  const getVendor = (id: string) => vendors.find((v) => v.id === id)?.name ?? id

  const debitNotes: any[] = debitData?.vendorDebitNotes ?? []
  const debitedPoIds = new Set(debitNotes.map((d) => d.purchaseOrderId).filter(Boolean))

  const eligible = orders.filter(
    (o) => ['received', 'billed'].includes(o.status) && !debitedPoIds.has(o.id),
  )
  const billsEligible: any[] = outstandingBillsData?.outstandingVendorBills ?? []
  const issued = debitNotes

  const resetForm = () => {
    setForm({ amount: '', reason: '', date: today(), notes: '' })
    setErrors({})
    setIssueError(null)
  }

  const openIssue = (row: any, kind: SourceKind) => {
    setSourceKind(kind)
    setSelected(row)
    resetForm()
    const max =
      kind === 'po' ? Number(row.totalAmount) : Number(row.outstandingAmount ?? row.totalAmount)
    if (max > 0) setForm((p) => ({ ...p, amount: String(max) }))
  }

  const setF = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: '' }))
  }

  const maxDebitAmount = () => {
    if (!selected) return 0
    if (sourceKind === 'po') return Number(selected.totalAmount) || 0
    return Number(selected.outstandingAmount ?? selected.totalAmount) || 0
  }

  const validate = () => {
    const e: Record<string, string> = {}
    const amt = parseFloat(form.amount)
    const max = maxDebitAmount()
    if (!form.amount || !(amt > 0)) e.amount = 'Enter a valid amount'
    else if (amt > max + 0.009) {
      e.amount =
        sourceKind === 'po'
          ? 'Cannot exceed PO total'
          : `Cannot exceed bill outstanding (${formatMoney(max)})`
    }
    if (!form.reason) e.reason = 'Required'
    if (!form.date) e.date = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleIssue = () => {
    if (!validate() || !selected) return
    const reason = [form.reason, form.notes].filter(Boolean).join(' — ')
    const input: Record<string, unknown> = {
      vendorId: selected.vendorId,
      debitDate: form.date,
      totalAmount: parseFloat(form.amount),
      reason: reason || form.reason,
      notes: form.notes || undefined,
      organizationId: orgId,
    }
    if (sourceKind === 'po') input.purchaseOrderId = selected.id
    else input.vendorBillId = selected.id

    createDebit({ variables: { input } })
  }

  const rows =
    tab === 'eligible' ? eligible : tab === 'bills' ? billsEligible : issued

  const loading = tab === 'eligible' ? poLoading : tab === 'bills' ? false : false

  const billsForVendor =
    outstandingBillsData?.outstandingVendorBills?.filter(
      (b: any) => b.vendorId === applyTarget?.vendorId,
    ) ?? []

  const handleApplyToBill = () => {
    if (!applyTarget || !applyBillId) return
    const amt = parseFloat(applyAmount)
    if (!(amt > 0)) return
    applyToBill({
      variables: { debitNoteId: applyTarget.id, billId: applyBillId, amount: amt },
    })
  }

  return (
    <PageTemplate
      title="Debit Notes"
      description="Raise debit notes against POs or vendor bills; apply open credits to reduce bill outstanding."
    >
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Eligible POs', value: eligible.length, icon: Clock, cls: 'text-amber-600 bg-amber-50' },
          { label: 'Bills w/ balance', value: billsEligible.length, icon: FileText, cls: 'text-violet-600 bg-violet-50' },
          { label: 'Debit notes', value: issued.length, icon: CheckCircle2, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Total POs', value: orders.length, icon: CheckCircle2, cls: 'text-gray-500 bg-gray-100' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm"
          >
            <div className={`p-2 rounded-md ${cls.split(' ')[1]}`}>
              <Icon className={`h-4 w-4 ${cls.split(' ')[0]}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-lg font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 bg-blue-600 rounded-t-lg">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="h-4 w-4" /> Issue Debit Note
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelected(null)
                  resetForm()
                }}
                className="text-blue-200 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {issueError && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1.5">
                  {issueError}
                </p>
              )}
              <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs space-y-1">
                {sourceKind === 'po' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">PO #</span>
                      <span className="font-mono text-gray-700">{selected.seqNo || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">PO Total</span>
                      <span className="font-semibold">{formatMoney(selected.totalAmount)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bill #</span>
                      <span className="font-mono text-gray-700">{selected.billNumber || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Outstanding</span>
                      <span className="font-semibold text-red-600">
                        {formatMoney(selected.outstandingAmount)}
                      </span>
                    </div>
                    {Number(selected.debitNotesApplied) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Already debited</span>
                        <span>{formatMoney(selected.debitNotesApplied)}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Vendor</span>
                  <span className="font-medium">{getVendor(selected.vendorId)}</span>
                </div>
              </div>

              <div>
                <p className={`text-xs mb-1 font-medium ${errors.amount ? 'text-red-500' : 'text-gray-500'}`}>
                  Debit Amount *{errors.amount ? ` — ${errors.amount}` : ''}
                </p>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {getCurrencySymbol()}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setF('amount', e.target.value)}
                    placeholder="0.00"
                    className={`${errors.amount ? cellErr : cell} pl-5`}
                  />
                </div>
              </div>

              <div>
                <p className={`text-xs mb-1 font-medium ${errors.reason ? 'text-red-500' : 'text-gray-500'}`}>
                  Reason *{errors.reason ? ` — ${errors.reason}` : ''}
                </p>
                <select
                  value={form.reason}
                  onChange={(e) => setF('reason', e.target.value)}
                  className={errors.reason ? cellErr : cell}
                >
                  <option value="">— select reason —</option>
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className={`text-xs mb-1 font-medium ${errors.date ? 'text-red-500' : 'text-gray-500'}`}>
                  Debit Note Date *{errors.date ? ` — ${errors.date}` : ''}
                </p>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setF('date', e.target.value)}
                  className={errors.date ? cellErr : cell}
                />
              </div>

              <div>
                <p className="text-xs mb-1 font-medium text-gray-500">Notes</p>
                <textarea
                  value={form.notes}
                  onChange={(e) => setF('notes', e.target.value)}
                  rows={2}
                  placeholder="Additional details…"
                  className="border border-gray-300 bg-white outline-none focus:ring-1 focus:ring-blue-400 text-xs px-2 py-1.5 w-full rounded-sm resize-none"
                />
              </div>

              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded p-2.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">
                  Posts AP-VDN (Dr AP, Cr expense).
                  {sourceKind === 'bill'
                    ? ' Creating against a bill applies the amount to that bill immediately.'
                    : ' PO is marked debited.'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 pb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelected(null)
                  resetForm()
                }}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleIssue}
                disabled={issuing}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[130px]"
              >
                <FileText className="h-3.5 w-3.5 mr-1" />
                {issuing ? 'Issuing…' : 'Issue Debit Note'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {applyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Apply {applyTarget.debitNumber} to bill</span>
              <button type="button" onClick={() => setApplyTarget(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            {applyError && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1.5">
                {applyError}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Remaining on debit note: {formatMoney(applyTarget.remainingAmount ?? applyTarget.totalAmount)}
            </p>
            <select value={applyBillId} onChange={(e) => setApplyBillId(e.target.value)} className={cell}>
              <option value="">Select vendor bill…</option>
              {billsForVendor.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.billNumber} — outstanding {formatMoney(b.outstandingAmount)}
                  {Number(b.debitNotesApplied) > 0 ? ` (debited ${formatMoney(b.debitNotesApplied)})` : ''}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount to apply"
              value={applyAmount}
              onChange={(e) => setApplyAmount(e.target.value)}
              className={cell}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setApplyTarget(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApplyToBill} disabled={applying || !applyBillId}>
                {applying ? 'Applying…' : 'Apply to bill'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-300">
          {(
            [
              ['eligible', `POs (${eligible.length})`],
              ['bills', `Bills (${billsEligible.length})`],
              ['issued', `Issued (${issued.length})`],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                tab === t ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'bg-gray-50 text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex bg-[#f0f0f0] border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {tab === 'issued' ? (
            <>
              <div className="w-8 border-r border-gray-300 px-2 py-2">#</div>
              <div className="w-28 border-r border-gray-300 px-2 py-2">Debit #</div>
              <div className="flex-1 border-r border-gray-300 px-2 py-2">Vendor</div>
              <div className="w-24 border-r border-gray-300 px-2 py-2">Date</div>
              <div className="w-20 border-r border-gray-300 px-2 py-2 text-right">Total</div>
              <div className="w-20 border-r border-gray-300 px-2 py-2 text-right">Applied</div>
              <div className="w-20 border-r border-gray-300 px-2 py-2 text-right">Left</div>
              <div className="w-20 border-r border-gray-300 px-2 py-2">Status</div>
              <div className="w-24 px-2 py-2" />
            </>
          ) : tab === 'bills' ? (
            <>
              <div className="w-8 border-r border-gray-300 px-2 py-2">#</div>
              <div className="w-28 border-r border-gray-300 px-2 py-2">Bill #</div>
              <div className="flex-1 border-r border-gray-300 px-2 py-2">Vendor</div>
              <div className="w-24 border-r border-gray-300 px-2 py-2">Due</div>
              <div className="w-24 border-r border-gray-300 px-2 py-2 text-right">Outstanding</div>
              <div className="w-24 border-r border-gray-300 px-2 py-2 text-right">Debited</div>
              <div className="w-28 px-2 py-2" />
            </>
          ) : (
            <>
              <div className="w-8 border-r border-gray-300 px-2 py-2">#</div>
              <div className="w-24 border-r border-gray-300 px-2 py-2">PO #</div>
              <div className="flex-1 border-r border-gray-300 px-2 py-2">Vendor</div>
              <div className="w-28 border-r border-gray-300 px-2 py-2">Order Date</div>
              <div className="w-24 border-r border-gray-300 px-2 py-2 text-right">Amount</div>
              <div className="w-24 border-r border-gray-300 px-2 py-2">Status</div>
              <div className="w-28 px-2 py-2" />
            </>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-xs">
              {tab === 'eligible'
                ? 'No received POs eligible for debit notes.'
                : tab === 'bills'
                  ? 'No outstanding vendor bills.'
                  : 'No debit notes issued yet.'}
            </p>
          </div>
        ) : (
          rows.map((o, idx) => (
            <div
              key={o.id}
              className={`flex border-b border-gray-200 last:border-b-0 hover:bg-blue-50/30 text-xs ${
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <div className="w-8 border-r border-gray-200 flex items-center justify-center text-gray-300 py-2">
                {idx + 1}
              </div>

              {tab === 'issued' ? (
                <>
                  <div className="w-28 border-r border-gray-200 px-2 py-2 font-mono text-gray-600">
                    {o.debitNumber || '—'}
                  </div>
                  <div className="flex-1 border-r border-gray-200 px-2 py-2 font-medium truncate">
                    {getVendor(o.vendorId)}
                  </div>
                  <div className="w-24 border-r border-gray-200 px-2 py-2">
                    {o.debitDate ? formatDate(o.debitDate) : '—'}
                  </div>
                  <div className="w-20 border-r border-gray-200 px-2 py-2 text-right font-semibold">
                    {formatMoney(o.totalAmount)}
                  </div>
                  <div className="w-20 border-r border-gray-200 px-2 py-2 text-right text-emerald-700">
                    {formatMoney(o.appliedAmount ?? 0)}
                  </div>
                  <div className="w-20 border-r border-gray-200 px-2 py-2 text-right text-amber-700">
                    {formatMoney(o.remainingAmount ?? 0)}
                  </div>
                  <div className="w-20 border-r border-gray-200 px-2 py-2">
                    <span className="inline-flex px-2 py-0.5 rounded text-xs border bg-blue-50 text-blue-700 border-blue-200">
                      {o.status}
                    </span>
                  </div>
                  <div className="w-24 px-2 py-1.5 flex items-center">
                    {Number(o.remainingAmount ?? 0) > 0.009 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setApplyTarget(o)
                          setApplyBillId('')
                          setApplyAmount(String(o.remainingAmount ?? ''))
                          setApplyError(null)
                        }}
                        className="h-6 text-xs px-2"
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                </>
              ) : tab === 'bills' ? (
                <>
                  <div className="w-28 border-r border-gray-200 px-2 py-2 font-mono text-gray-600">
                    {o.billNumber || '—'}
                  </div>
                  <div className="flex-1 border-r border-gray-200 px-2 py-2 font-medium truncate">
                    {o.vendor?.name ?? getVendor(o.vendorId)}
                  </div>
                  <div className="w-24 border-r border-gray-200 px-2 py-2">
                    {o.dueDate ? formatDate(o.dueDate) : '—'}
                  </div>
                  <div className="w-24 border-r border-gray-200 px-2 py-2 text-right font-semibold text-red-600">
                    {formatMoney(o.outstandingAmount)}
                  </div>
                  <div className="w-24 border-r border-gray-200 px-2 py-2 text-right text-gray-600">
                    {formatMoney(o.debitNotesApplied ?? 0)}
                  </div>
                  <div className="w-28 px-2 py-1.5 flex items-center">
                    <Button
                      size="sm"
                      onClick={() => openIssue(o, 'bill')}
                      className="h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2"
                    >
                      <FileText className="h-3 w-3 mr-1" /> Issue
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 border-r border-gray-200 px-2 py-2 font-mono text-gray-400">
                    {o.seqNo || '—'}
                  </div>
                  <div className="flex-1 border-r border-gray-200 px-2 py-2 font-medium truncate">
                    {getVendor(o.vendorId)}
                  </div>
                  <div className="w-28 border-r border-gray-200 px-2 py-2">
                    {o.orderDate ? formatDate(o.orderDate) : '—'}
                  </div>
                  <div className="w-24 border-r border-gray-200 px-2 py-2 text-right font-semibold">
                    {formatMoney(o.totalAmount)}
                  </div>
                  <div className="w-24 border-r border-gray-200 px-2 py-2">
                    <span className="inline-flex px-2 py-0.5 rounded text-xs border bg-emerald-50 text-emerald-700 border-emerald-200">
                      {o.status}
                    </span>
                  </div>
                  <div className="w-28 px-2 py-1.5 flex items-center">
                    <Button
                      size="sm"
                      onClick={() => openIssue(o, 'po')}
                      className="h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2"
                    >
                      <FileText className="h-3 w-3 mr-1" /> Issue
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </PageTemplate>
  )
}
