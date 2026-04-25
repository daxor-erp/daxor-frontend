'use client'

import { useMutation, useQuery } from '@apollo/client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { GET_CASH_BANKS, GET_BANK_ACCOUNTS, CREATE_CASH_BANK, CREATE_BANK_ACCOUNT } from '@/gql/queries'
import { InputFloating } from '@/components/ui/input-floating'
import { wsCell, wsHeaderCell, wsLabelCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { FilePen, RefreshCw, Building2, ChevronDown, ChevronRight, Plus } from 'lucide-react'

const labelCell = wsLabelCell
const cell = wsCell
const headerCell = wsHeaderCell
const moneyClass = wsMoney

const REF_MODULE = 'bank_check'

const ACCOUNT_TYPE_OPTIONS = [
  { value: 'current', label: 'Current' },
  { value: 'savings', label: 'Savings' },
  { value: 'od', label: 'Overdraft' },
  { value: 'other', label: 'Other' },
]

const emptyNewBank = {
  accountHolder: '',
  accountName: '',
  accountNumber: '',
  bankName: '',
  branchName: '',
  accountType: 'current',
  currency: 'USD',
}

type CashBankRow = {
  id: string
  transactionNumber: string
  bankAccount: string
  transactionDate: string
  transactionType: string
  paymentMethod: string
  referenceId: string
  referenceModule?: string
  description: string
  amount: number
  currency?: string
  chequeNumber?: string | null
  reconciliationStatus: string
}

export default function WriteChecksPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [accountNumber, setAccountNumber] = useState('')
  const [checkDate, setCheckDate] = useState(() => new Date().toISOString().split('T')[0])
  const [checkNumber, setCheckNumber] = useState('')
  const [payee, setPayee] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [error, setError] = useState('')
  const [showAddBank, setShowAddBank] = useState(false)
  const [newBank, setNewBank] = useState({ ...emptyNewBank })

  const { data: acctData, loading: acctLoading, refetch: refetchAccounts } = useQuery(GET_BANK_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: txData, loading: txLoading, refetch: refetchTx } = useQuery(GET_CASH_BANKS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createBankAccount, { loading: savingBank }] = useMutation(CREATE_BANK_ACCOUNT, {
    onCompleted: (data) => {
      const num = data?.createBankAccount?.accountNumber
      if (num) setAccountNumber(num)
      setNewBank({ ...emptyNewBank })
      setShowAddBank(false)
      setError('')
      void refetchAccounts()
    },
    onError: (e) => setError(e.message),
  })

  const [createLine, { loading: saving }] = useMutation(CREATE_CASH_BANK, {
    onCompleted: () => {
      setCheckNumber('')
      setPayee('')
      setAmount('')
      setMemo('')
      setError('')
      void refetchTx()
    },
    onError: (e) => setError(e.message),
  })

  const bankAccounts = useMemo(
    () => (acctData?.bankAccounts ?? []).filter((a: { isActive?: boolean }) => a.isActive !== false),
    [acctData],
  )

  const bankOptions = useMemo(
    () =>
      bankAccounts.map(
        (a: {
          accountNumber: string
          accountName: string
          accountHolder?: string
          bankName: string
        }) => {
          const holder = (a.accountHolder && a.accountHolder.trim()) || a.accountName
          return {
            value: a.accountNumber,
            label: `${holder} — ${a.accountName} (${a.bankName} · ${a.accountNumber})`,
          }
        },
      ),
    [bankAccounts],
  )

  const selectedAcct = useMemo(
    () => bankAccounts.find((a: { accountNumber: string }) => a.accountNumber === accountNumber),
    [bankAccounts, accountNumber],
  ) as
    | {
        accountNumber: string
        currency?: string
        accountName?: string
        accountHolder?: string
        bankName?: string
      }
    | undefined

  const checks: CashBankRow[] = useMemo(() => {
    const rows = (txData?.cashBanks ?? []) as CashBankRow[]
    return rows.filter((t) => t.referenceModule === REF_MODULE)
  }, [txData])

  const holderByAccountNumber = useMemo(() => {
    const m = new Map<string, string>()
    for (const a of bankAccounts as { accountNumber: string; accountHolder?: string; accountName: string }[]) {
      m.set(a.accountNumber, (a.accountHolder && a.accountHolder.trim()) || a.accountName)
    }
    return m
  }, [bankAccounts])

  const buildDescription = () => {
    const p = payee.trim()
    const m = memo.trim()
    if (p && m) return `Check to ${p} — ${m}`
    if (p) return `Check to ${p}`
    if (m) return m
    return 'Bank check'
  }

  const submit = () => {
    setError('')
    if (!accountNumber) {
      setError('Select a bank account.')
      return
    }
    const chk = checkNumber.trim()
    if (!chk) {
      setError('Enter a check number.')
      return
    }
    const n = parseFloat(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a valid amount.')
      return
    }
    const desc = buildDescription()
    const refId = `chk-${chk}`

    createLine({
      variables: {
        input: {
          organizationId: orgId,
          transactionDate: new Date(checkDate).toISOString(),
          transactionType: 'payment',
          bankAccount: accountNumber,
          referenceModule: REF_MODULE,
          referenceId: refId,
          amount: n,
          currency: selectedAcct?.currency || 'USD',
          paymentMethod: 'cheque',
          chequeNumber: chk,
          description: desc,
        },
      },
    })
  }

  const submitNewBank = () => {
    setError('')
    if (!newBank.accountNumber.trim() || !newBank.accountName.trim() || !newBank.bankName.trim()) {
      setError('Account holder, account name, account number, and bank name are required.')
      return
    }
    createBankAccount({
      variables: {
        input: {
          organizationId: orgId,
          accountHolder: newBank.accountHolder.trim() || newBank.accountName.trim(),
          accountName: newBank.accountName.trim(),
          accountNumber: newBank.accountNumber.trim(),
          bankName: newBank.bankName.trim(),
          branchName: newBank.branchName.trim() || 'Main',
          accountType: newBank.accountType || 'current',
          currency: newBank.currency?.trim() || 'USD',
        },
      },
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-[1100px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FilePen className="h-8 w-8 text-slate-700" />
          Write Checks
        </h1>
        <p className="text-gray-500 mt-1">
          Record a check drawn on a company bank account. Creates a cash-bank <span className="font-mono">payment</span>{' '}
          with <span className="font-mono">referenceModule: {REF_MODULE}</span> for reconciliation and reporting.
        </p>
      </div>

      <div className="rounded border border-slate-200 bg-slate-50/80 overflow-hidden">
        <button
          type="button"
          onClick={() => {
            setShowAddBank((s) => !s)
            setError('')
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-100/80"
        >
          {showAddBank ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <Plus className="h-4 w-4" />
          Add bank account
        </button>
        {showAddBank && (
          <div className="px-3 pb-3 pt-0 space-y-3 border-t border-slate-200 bg-white">
            <p className="text-xs text-gray-500 pt-2">Same fields as on Make Deposits — creates an account you can select below.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <InputFloating
                label="Account holder *"
                value={newBank.accountHolder}
                onChange={(e) => setNewBank((b) => ({ ...b, accountHolder: e.target.value }))}
                className="h-9 text-xs"
              />
              <InputFloating
                label="Account name (alias) *"
                value={newBank.accountName}
                onChange={(e) => setNewBank((b) => ({ ...b, accountName: e.target.value }))}
                className="h-9 text-xs"
              />
              <InputFloating
                label="Account number *"
                value={newBank.accountNumber}
                onChange={(e) => setNewBank((b) => ({ ...b, accountNumber: e.target.value }))}
                className="h-9 text-xs"
              />
              <InputFloating
                label="Bank name *"
                value={newBank.bankName}
                onChange={(e) => setNewBank((b) => ({ ...b, bankName: e.target.value }))}
                className="h-9 text-xs"
              />
              <InputFloating
                label="Branch"
                value={newBank.branchName}
                onChange={(e) => setNewBank((b) => ({ ...b, branchName: e.target.value }))}
                className="h-9 text-xs"
                placeholder="Main"
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-500 block mb-0.5">Type</label>
                  <select
                    className="w-full h-9 text-xs border rounded-md px-2"
                    value={newBank.accountType}
                    onChange={(e) => setNewBank((b) => ({ ...b, accountType: e.target.value }))}
                  >
                    {ACCOUNT_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <InputFloating
                    label="Currency"
                    value={newBank.currency}
                    onChange={(e) => setNewBank((b) => ({ ...b, currency: e.target.value }))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs bg-slate-800 hover:bg-slate-900"
                disabled={!orgId || savingBank}
                onClick={submitNewBank}
              >
                {savingBank ? 'Saving…' : 'Save bank account'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setNewBank({ ...emptyNewBank })
                  setShowAddBank(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {acctLoading && <p className="text-sm text-gray-500">Loading bank accounts…</p>}

      {!acctLoading && orgId && bankAccounts.length === 0 && (
        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">No active bank account found.</p>
          <p className="mt-1 text-amber-800">
            Add a bank account above or in{' '}
            <Link href="/cash-bank" className="underline font-medium text-amber-950 hover:text-amber-700">
              Cash &amp; Bank
            </Link>
            .
          </p>
        </div>
      )}

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>Check</span>
          <span className="opacity-90 flex items-center gap-1 truncate max-w-[60%]">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            {selectedAcct
              ? `${(selectedAcct.accountHolder || selectedAcct.accountName) ?? '—'} · ${selectedAcct.bankName}`
              : '—'}
          </span>
        </div>

        <div className="p-3 overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[720px]">
            <tbody>
              <tr>
                <td className={labelCell}>Pay from (account)</td>
                <td className={`${cell} min-w-[300px]`} colSpan={3}>
                  <SelectFloating
                    label=""
                    value={accountNumber}
                    onChange={(v) => {
                      const next = typeof v === 'string' ? v : v.target.value
                      setAccountNumber(next)
                      setError('')
                    }}
                    options={bankOptions}
                    className="h-8 text-xs border-0 shadow-none bg-transparent p-0"
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Check date</td>
                <td className={cell}>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none font-mono"
                    value={checkDate}
                    onChange={(e) => setCheckDate(e.target.value)}
                  />
                </td>
                <td className={labelCell}>Check #</td>
                <td className={cell}>
                  <input
                    className="w-full bg-transparent outline-none font-mono"
                    placeholder="Required"
                    value={checkNumber}
                    onChange={(e) => setCheckNumber(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Pay to</td>
                <td className={cell} colSpan={3}>
                  <input
                    className="w-full bg-transparent outline-none"
                    placeholder="Vendor or person"
                    value={payee}
                    onChange={(e) => setPayee(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className={labelCell}>Amount</td>
                <td className={`${cell} ${moneyClass}`}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full bg-transparent outline-none font-mono text-right"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </td>
                <td className={labelCell}>Memo</td>
                <td className={cell}>
                  <input
                    className="w-full bg-transparent outline-none"
                    placeholder="Optional"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className="h-9 text-xs bg-slate-800 hover:bg-slate-900 text-white"
              onClick={submit}
              disabled={saving || !orgId || bankAccounts.length === 0}
            >
              {saving ? 'Saving…' : 'Record check'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => refetchTx()}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${txLoading ? 'animate-spin' : ''}`} />
              Refresh list
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5 mt-2">{error}</p>
          )}
        </div>
      </div>

      <div className="rounded border border-gray-300 overflow-hidden bg-white shadow-sm">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-800">
          Recent checks
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[880px]">
            <thead>
              <tr>
                <th className={`${headerCell} text-left`}>Transaction #</th>
                <th className={`${headerCell} text-left`}>Account holder</th>
                <th className={`${headerCell} text-left`}>Account #</th>
                <th className={`${headerCell} text-left`}>Date</th>
                <th className={`${headerCell} text-left`}>Check #</th>
                <th className={`${headerCell} text-left`}>Ref</th>
                <th className={`${headerCell} text-left`}>Description</th>
                <th className={`${headerCell} ${moneyClass}`}>Amount</th>
                <th className={`${headerCell} text-left w-24`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {!checks.length && (
                <tr>
                  <td colSpan={9} className={`${cell} text-center text-gray-500 py-8`}>
                    {txLoading ? 'Loading…' : 'No checks recorded yet.'}
                  </td>
                </tr>
              )}
              {checks.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className={`${cell} font-mono`}>{d.transactionNumber}</td>
                  <td className={cell}>{holderByAccountNumber.get(d.bankAccount) ?? '—'}</td>
                  <td className={`${cell} font-mono`}>{d.bankAccount}</td>
                  <td className={`${cell} font-mono`}>
                    {d.transactionDate ? new Date(d.transactionDate).toLocaleDateString() : '—'}
                  </td>
                  <td className={`${cell} font-mono`}>{d.chequeNumber || '—'}</td>
                  <td className={`${cell} font-mono`}>{d.referenceId || '—'}</td>
                  <td className={cell}>{d.description}</td>
                  <td className={`${cell} ${moneyClass} text-rose-800`}>
                    −{d.currency ? `${d.currency} ` : ''}
                    {formatMoney(Number(d.amount ?? 0))}
                  </td>
                  <td className={cell}>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        d.reconciliationStatus === 'RECONCILED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.reconciliationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
