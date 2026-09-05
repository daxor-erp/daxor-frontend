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
import { formatMoneyCompact } from '@/lib/format-money'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Building2,
  Plus,
  X,
  Save,
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
    { key: 'transactionNumber', label: 'Transaction #', sortable: true, width: '120px', render: (v) => <MonoCell value={v} /> },
    {
      key: 'transactionDate',
      label: 'Date',
      width: '100px',
      render: (v: any) => <DateCell value={v} />,
    },
    {
      key: 'transactionType',
      label: 'Type',
      width: '90px',
      render: (v: string) => <ErpBadge status={String(v)} />,
    },
    { key: 'description', label: 'Description', render: (v) => <span className="text-sm">{v}</span> },
    {
      key: 'paymentMethod',
      label: 'Method',
      width: '100px',
      render: (v: string) => v ? <span className="text-sm capitalize">{v.replace('_', ' ')}</span> : '—',
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '110px',
      align: 'right',
      render: (v: any) => <AmountCell value={v} />,
    },
    { key: 'bankAccount', label: 'Account', width: '120px', render: (v) => <MonoCell value={v} /> },
    {
      key: 'reconciliationStatus',
      label: 'Status',
      width: '90px',
      render: (v: string) => <ErpBadge status={String(v)} />,
    },
  ]

  // Bank account columns
  const acctColumns: Column[] = [
    { key: 'accountName', label: 'Account Name', sortable: true, render: (v) => <span className="text-sm font-medium">{v}</span> },
    { key: 'bankName', label: 'Bank', width: '130px', render: (v) => <span className="text-sm">{v}</span> },
    { key: 'accountNumber', label: 'Account Number', width: '140px', render: (v) => <MonoCell value={v} /> },
    {
      key: 'accountType',
      label: 'Type',
      width: '90px',
      render: (v: string) => v ? <ErpBadge status={String(v)} /> : '—',
    },
    {
      key: 'currentBalance',
      label: 'Balance',
      width: '110px',
      align: 'right',
      render: (v: any) => <AmountCell value={v ?? 0} />,
    },
    { key: 'currency', label: 'Currency', width: '80px' },
    {
      key: 'isActive',
      label: 'Active',
      width: '70px',
      align: 'center',
      render: (v: boolean) => <ErpBadge status={v ? 'active' : 'inactive'} label={v ? 'Yes' : 'No'} />,
    },
  ]

  const acctActions = [
    {
      label: 'Edit',
      icon: <Edit className="h-3.5 w-3.5" />,
      onClick: (row: any) => handleEditAcct(row),
    },
  ]

  const bankAccountOptions = bankAccounts.map((a: any) => ({
    value: a.accountNumber,
    label: `${a.accountName} (${a.accountNumber})`,
  }))

  return (
    <div className="erp-shell">
      <PageHeader
        title="Cash & Bank"
        subtitle="Manage cash transactions and bank accounts"
        icon={<Wallet className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'Cash & Bank' }]}
      />

      {/* Tab switcher */}
      <div className="flex border-b border-border">
        {[
          { key: 'transactions', label: 'Transactions' },
          { key: 'accounts', label: 'Bank Accounts' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <StatsRow cols={4}>
            <StatCard label="Total Transactions" value={transactions.length} icon={<Wallet className="h-5 w-5" />} variant="blue" />
            <StatCard label="Total Receipts" value={formatMoneyCompact(totalReceipts)} icon={<TrendingUp className="h-5 w-5" />} variant="green" />
            <StatCard label="Total Payments" value={formatMoneyCompact(totalPayments)} icon={<TrendingDown className="h-5 w-5" />} variant="rose" />
            <StatCard label="Bank Accounts" value={bankAccounts.length} icon={<Building2 className="h-5 w-5" />} variant="violet" />
          </StatsRow>

          {/* Inline form */}
          {addingTx && (
            <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-primary">
                <span className="text-xs font-semibold text-white">New Transaction</span>
                <button onClick={closeTxForm} className="text-primary-foreground/80 hover:text-white">
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
                  <Button variant="outline" size="sm" onClick={closeTxForm}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleTxSubmit} disabled={savingTx} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
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
            title="All Transactions"
            onAdd={() => setAddingTx(true)}
            addLabel="New Transaction"
            searchable
            searchPlaceholder="Search transactions…"
            emptyMessage="No transactions recorded"
            pageSize={25}
          />
        </div>
      )}

      {/* BANK ACCOUNTS TAB */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {/* Inline form */}
          {addingAcct && (
            <div className="bg-white border border-primary/30 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-primary">
                <span className="text-xs font-semibold text-white">
                  {editingAcct ? 'Edit Bank Account' : 'New Bank Account'}
                </span>
                <button onClick={closeAcctForm} className="text-primary-foreground/80 hover:text-white">
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
                  <Button variant="outline" size="sm" onClick={closeAcctForm}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAcctSubmit} disabled={savingAcct} className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
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
            title="All Bank Accounts"
            onAdd={() => { setEditingAcct(null); setAcctForm({ ...emptyAcctForm }); setAddingAcct(true) }}
            addLabel="Add Account"
            searchable
            searchPlaceholder="Search accounts…"
            emptyMessage="No bank accounts configured"
            pageSize={25}
            onRowClick={handleEditAcct}
          />
        </div>
      )}
    </div>
  )
}
