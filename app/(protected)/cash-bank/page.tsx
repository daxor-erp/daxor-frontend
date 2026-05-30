'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, Column } from '@/components/DataTable'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import {
  GET_CASH_BANKS,
  CREATE_CASH_BANK,
  GET_BANK_ACCOUNTS,
  CREATE_BANK_ACCOUNT,
} from '@/gql/queries'
import { formatMoney, formatMoneyCompact } from '@/lib/format-money'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Building2,
  Plus,
  X,
  Save,
  Trash2,
  CreditCard,
  Edit,
} from 'lucide-react'

type Tab = 'transactions' | 'accounts'

const emptyTxForm = {
  transactionDate: '',
  transactionType: '',
  description: '',
  amount: '',
  paymentMethod: '',
  referenceNumber: '',
  bankAccount: '',
  referenceModule: 'manual',
  referenceId: 'manual',
  notes: '',
}

const emptyAcctForm = {
  accountName: '',
  bankName: '',
  accountNumber: '',
  branchName: '',
  accountType: '',
  openingBalance: '',
  currency: 'INR',
}

export default function CashBankPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [activeTab, setActiveTab] = useState<Tab>('transactions')

  // Transactions state
  const [addingTx, setAddingTx] = useState(false)
  const [txForm, setTxForm] = useState({ ...emptyTxForm })
  const [txErrors, setTxErrors] = useState<Record<string, string>>({})
  const [savingTx, setSavingTx] = useState(false)

  // Bank accounts state
  const [addingAcct, setAddingAcct] = useState(false)
  const [acctForm, setAcctForm] = useState({ ...emptyAcctForm })
  const [acctErrors, setAcctErrors] = useState<Record<string, string>>({})
  const [savingAcct, setSavingAcct] = useState(false)
  const [editingAcct, setEditingAcct] = useState<any>(null)

  const { data: txData, loading: txLoading, refetch: refetchTx } = useQuery(GET_CASH_BANKS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const { data: acctData, loading: acctLoading, refetch: refetchAcct } = useQuery(GET_BANK_ACCOUNTS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [createCashBank] = useMutation(CREATE_CASH_BANK)
  const [createBankAccount] = useMutation(CREATE_BANK_ACCOUNT)

  const transactions = txData?.cashBanks ?? []
  const bankAccounts = acctData?.bankAccounts ?? []

  // Helpers
  const setTxF = (key: string, val: string) => setTxForm(f => ({ ...f, [key]: val }))
  const setAcctF = (key: string, val: string) => setAcctForm(f => ({ ...f, [key]: val }))

  // Stats
  const totalReceipts = transactions
    .filter((t: any) => t.transactionType === 'receipt')
    .reduce((s: number, t: any) => s + (t.amount ?? 0), 0)
  const totalPayments = transactions
    .filter((t: any) => t.transactionType === 'payment')
    .reduce((s: number, t: any) => s + (t.amount ?? 0), 0)

  // Transaction form submit
  const handleTxSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!txForm.transactionDate) errs.transactionDate = 'Required'
    if (!txForm.transactionType) errs.transactionType = 'Required'
    if (!txForm.description) errs.description = 'Required'
    if (!txForm.amount || isNaN(Number(txForm.amount))) errs.amount = 'Valid amount required'
    if (Object.keys(errs).length) { setTxErrors(errs); return }
    setSavingTx(true)
    try {
      await createCashBank({
        variables: {
          input: {
            transactionDate: txForm.transactionDate,
            transactionType: txForm.transactionType,
            description: txForm.description,
            amount: Number(txForm.amount),
            paymentMethod: txForm.paymentMethod || 'cash',
            chequeNumber: txForm.referenceNumber || undefined,
            bankAccount: txForm.bankAccount || 'N/A',
            referenceModule: txForm.referenceModule || 'manual',
            referenceId: txForm.referenceId || 'manual',
            organizationId: orgId,
          },
        },
      })
      setTxForm({ ...emptyTxForm })
      setTxErrors({})
      setAddingTx(false)
      refetchTx()
    } catch (e) {
      console.error(e)
    } finally {
      setSavingTx(false)
    }
  }

  const closeTxForm = () => {
    setAddingTx(false)
    setTxForm({ ...emptyTxForm })
    setTxErrors({})
  }

  // Bank account form submit
  const handleAcctSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!acctForm.accountName) errs.accountName = 'Required'
    if (!acctForm.bankName) errs.bankName = 'Required'
    if (!acctForm.accountNumber) errs.accountNumber = 'Required'
    if (Object.keys(errs).length) { setAcctErrors(errs); return }
    setSavingAcct(true)
    try {
      await createBankAccount({
        variables: {
          input: {
            accountName: acctForm.accountName,
            bankName: acctForm.bankName,
            accountNumber: acctForm.accountNumber,
            branchName: acctForm.branchName || 'Main',
            accountType: acctForm.accountType || 'current',
            currency: acctForm.currency || 'INR',
            openingBalance: acctForm.openingBalance ? parseFloat(acctForm.openingBalance) : 0,
            organizationId: orgId,
          },
        },
      })
      setAcctForm({ ...emptyAcctForm })
      setAcctErrors({})
      setAddingAcct(false)
      setEditingAcct(null)
      refetchAcct()
    } catch (e) {
      console.error(e)
    } finally {
      setSavingAcct(false)
    }
  }

  const closeAcctForm = () => {
    setAddingAcct(false)
    setEditingAcct(null)
    setAcctForm({ ...emptyAcctForm })
    setAcctErrors({})
  }

  const handleEditAcct = (row: any) => {
    setEditingAcct(row)
    setAcctForm({
      accountName: row.accountName ?? '',
      bankName: row.bankName ?? '',
      accountNumber: row.accountNumber ?? '',
      branchName: row.branchName ?? '',
      accountType: row.accountType ?? '',
      openingBalance: '',
      currency: row.currency ?? 'INR',
    })
    setAddingAcct(true)
  }

  // Transaction columns
  const txColumns: Column[] = [
    { key: 'transactionNumber', label: 'Transaction #', sortable: true, width: '120px' },
    {
      key: 'transactionDate',
      label: 'Date',
      width: '100px',
      render: (v: any) => v ? new Date(v).toLocaleDateString('en-IN') : '—',
    },
    {
      key: 'transactionType',
      label: 'Type',
      width: '90px',
      render: (v: string) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
          v === 'receipt' ? 'bg-green-100 text-green-700' :
          v === 'payment' ? 'bg-red-100 text-red-700' :
          v === 'transfer' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-600'
        }`}>{v}</span>
      ),
    },
    { key: 'description', label: 'Description' },
    {
      key: 'paymentMethod',
      label: 'Method',
      width: '100px',
      render: (v: string) => v ? v.replace('_', ' ') : '—',
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '110px',
      align: 'right',
      render: (v: any, row: any) => (
        <span className={`font-medium ${
          row.transactionType === 'receipt' ? 'text-green-600' :
          row.transactionType === 'payment' ? 'text-red-600' :
          'text-gray-700'
        }`}>
          {formatMoney(Number(v))}
        </span>
      ),
    },
    { key: 'bankAccount', label: 'Account', width: '120px' },
    {
      key: 'reconciliationStatus',
      label: 'Status',
      width: '90px',
      render: (v: string) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
          v === 'RECONCILED' ? 'bg-green-100 text-green-700' :
          v === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-600'
        }`}>{v}</span>
      ),
    },
  ]

  // Bank account columns
  const acctColumns: Column[] = [
    { key: 'accountName', label: 'Account Name', sortable: true },
    { key: 'bankName', label: 'Bank', width: '130px' },
    { key: 'accountNumber', label: 'Account Number', width: '140px' },
    {
      key: 'accountType',
      label: 'Type',
      width: '90px',
      render: (v: string) => v ? (
        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium capitalize">{v}</span>
      ) : '—',
    },
    {
      key: 'currentBalance',
      label: 'Balance',
      width: '110px',
      align: 'right',
      render: (v: any, row: any) => (
        <span className="font-medium text-gray-800">
          {row.currency ?? 'INR'} {Number(v ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    { key: 'currency', label: 'Currency', width: '80px' },
    {
      key: 'isActive',
      label: 'Active',
      width: '70px',
      align: 'center',
      render: (v: boolean) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {v ? 'Yes' : 'No'}
        </span>
      ),
    },
  ]

  const acctActions = [
    {
      label: 'Edit',
      icon: <Edit className="h-3.5 w-3.5" />,
      onClick: (row: any) => handleEditAcct(row),
      variant: 'ghost' as const,
    },
  ]

  const bankAccountOptions = bankAccounts.map((a: any) => ({
    value: a.accountNumber,
    label: `${a.accountName} (${a.accountNumber})`,
  }))

  return (
    <div className="p-4 space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Cash &amp; Bank</h1>
          <p className="text-xs text-gray-500">Manage cash transactions and bank accounts</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'transactions', label: 'Transactions' },
          { key: 'accounts', label: 'Bank Accounts' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Transactions', value: transactions.length, icon: Wallet, cls: 'text-blue-600 bg-blue-50' },
              { label: 'Total Receipts', value: formatMoneyCompact(totalReceipts), icon: TrendingUp, cls: 'text-green-600 bg-green-50' },
              { label: 'Total Payments', value: formatMoneyCompact(totalPayments), icon: TrendingDown, cls: 'text-red-600 bg-red-50' },
              { label: 'Bank Accounts', value: bankAccounts.length, icon: Building2, cls: 'text-purple-600 bg-purple-50' },
            ].map(({ label, value, icon: Icon, cls }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
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

          {/* Inline form */}
          {addingTx && (
            <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
                <span className="text-xs font-semibold text-white">New Transaction</span>
                <button onClick={closeTxForm} className="text-blue-200 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  <InputFloating
                    label="Transaction Date *"
                    type="date"
                    value={txForm.transactionDate}
                    onChange={e => setTxF('transactionDate', e.target.value)}
                    error={txErrors.transactionDate}
                    className="h-7 text-xs"
                  />
                  <SelectFloating
                    label="Transaction Type *"
                    value={txForm.transactionType}
                    onChange={e => setTxF('transactionType', typeof e === 'string' ? e : e.target.value)}
                    options={[
                      { value: 'receipt', label: 'Receipt' },
                      { value: 'payment', label: 'Payment' },
                      { value: 'transfer', label: 'Transfer' },
                      { value: 'journal', label: 'Journal' },
                    ]}
                    error={txErrors.transactionType}
                    className="h-7 text-xs"
                  />
                  <InputFloating
                    label="Description *"
                    value={txForm.description}
                    onChange={e => setTxF('description', e.target.value)}
                    error={txErrors.description}
                    className="h-7 text-xs"
                  />
                  <InputFloating
                    label="Amount *"
                    type="number"
                    value={txForm.amount}
                    onChange={e => setTxF('amount', e.target.value)}
                    error={txErrors.amount}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <SelectFloating
                    label="Payment Method"
                    value={txForm.paymentMethod}
                    onChange={e => setTxF('paymentMethod', typeof e === 'string' ? e : e.target.value)}
                    options={[
                      { value: 'bank_transfer', label: 'Bank Transfer' },
                      { value: 'cheque', label: 'Cheque' },
                      { value: 'cash', label: 'Cash' },
                      { value: 'online', label: 'Online' },
                      { value: 'card', label: 'Card' },
                    ]}
                    className="h-7 text-xs"
                  />
                  <InputFloating
                    label="Reference Number"
                    value={txForm.referenceNumber}
                    onChange={e => setTxF('referenceNumber', e.target.value)}
                    className="h-7 text-xs"
                  />
                  <SelectFloating
                    label="Bank Account"
                    value={txForm.bankAccount}
                    onChange={e => setTxF('bankAccount', typeof e === 'string' ? e : e.target.value)}
                    options={bankAccountOptions}
                    className="h-7 text-xs"
                  />
                  <InputFloating
                    label="Notes"
                    value={txForm.notes}
                    onChange={e => setTxF('notes', e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1 border-t">
                  <Button variant="outline" size="sm" onClick={closeTxForm} className="h-8 text-xs">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleTxSubmit} disabled={savingTx} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="h-3.5 w-3.5 mr-1" />
                    {savingTx ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Transactions DataTable */}
          <DataTable
            data={transactions}
            columns={txColumns}
            loading={txLoading}
            title="Transactions"
            onAdd={() => setAddingTx(true)}
            addLabel="New Transaction"
            searchable
            searchPlaceholder="Search transactions…"
            emptyMessage="No transactions recorded"
          />
        </div>
      )}

      {/* BANK ACCOUNTS TAB */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {/* Inline form */}
          {addingAcct && (
            <div className="bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-blue-600">
                <span className="text-xs font-semibold text-white">
                  {editingAcct ? 'Edit Bank Account' : 'New Bank Account'}
                </span>
                <button onClick={closeAcctForm} className="text-blue-200 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  <InputFloating
                    label="Account Name *"
                    value={acctForm.accountName}
                    onChange={e => setAcctF('accountName', e.target.value)}
                    error={acctErrors.accountName}
                    className="h-7 text-xs"
                  />
                  <InputFloating
                    label="Bank Name *"
                    value={acctForm.bankName}
                    onChange={e => setAcctF('bankName', e.target.value)}
                    error={acctErrors.bankName}
                    className="h-7 text-xs"
                  />
                  <InputFloating
                    label="Account Number *"
                    value={acctForm.accountNumber}
                    onChange={e => setAcctF('accountNumber', e.target.value)}
                    error={acctErrors.accountNumber}
                    className="h-7 text-xs"
                  />
                  <InputFloating
                    label="Branch Name"
                    value={acctForm.branchName}
                    onChange={e => setAcctF('branchName', e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <SelectFloating
                    label="Account Type"
                    value={acctForm.accountType}
                    onChange={e => setAcctF('accountType', typeof e === 'string' ? e : e.target.value)}
                    options={[
                      { value: 'current', label: 'Current' },
                      { value: 'savings', label: 'Savings' },
                      { value: 'overdraft', label: 'Overdraft' },
                    ]}
                    className="h-7 text-xs"
                  />
                  <InputFloating
                    label="Opening Balance"
                    type="number"
                    value={acctForm.openingBalance}
                    onChange={e => setAcctF('openingBalance', e.target.value)}
                    className="h-7 text-xs"
                  />
                  <SelectFloating
                    label="Currency"
                    value={acctForm.currency}
                    onChange={e => setAcctF('currency', typeof e === 'string' ? e : e.target.value)}
                    options={[
                      { value: 'INR', label: 'INR' },
                      { value: 'USD', label: 'USD' },
                      { value: 'EUR', label: 'EUR' },
                      { value: 'GBP', label: 'GBP' },
                    ]}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1 border-t">
                  <Button variant="outline" size="sm" onClick={closeAcctForm} className="h-8 text-xs">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAcctSubmit} disabled={savingAcct} className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="h-3.5 w-3.5 mr-1" />
                    {savingAcct ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bank Accounts DataTable */}
          <DataTable
            data={bankAccounts}
            columns={acctColumns}
            loading={acctLoading}
            actions={acctActions}
            title="Bank Accounts"
            onAdd={() => { setEditingAcct(null); setAcctForm({ ...emptyAcctForm }); setAddingAcct(true) }}
            addLabel="Add Account"
            searchable
            searchPlaceholder="Search accounts…"
            emptyMessage="No bank accounts configured"
            onRowClick={handleEditAcct}
          />
        </div>
      )}
    </div>
  )
}
