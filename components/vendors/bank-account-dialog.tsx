'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Switch } from '@/components/ui/switch'
import { GET_BANKS, CREATE_BANK } from '@/gql/queries'
import { toast } from 'sonner'
import { Landmark } from 'lucide-react'

export type VendorBankAccountValue = {
  accountNumber: string
  bankId?: string | null
  bankName?: string | null
  currency: string
  accountHolder: string
  sendMoney: boolean
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
  /** Vendor's name — pre-fills accountHolder per spec ("auto-filled from vendor name"). */
  vendorName: string
  onSave: (account: VendorBankAccountValue) => void
}

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'SGD', 'AED']

export function BankAccountDialog({ open, onOpenChange, organizationId, vendorName, onSave }: Props) {
  const [accountNumber, setAccountNumber] = useState('')
  const [bankId, setBankId] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [accountHolder, setAccountHolder] = useState(vendorName)
  const [sendMoney, setSendMoney] = useState(false)
  const [creatingBank, setCreatingBank] = useState(false)

  // Nested "Create Bank" master-record fields
  const [bankName, setBankName] = useState('')
  const [bic, setBic] = useState('')
  const [bankAddress, setBankAddress] = useState('')
  const [bankPhone, setBankPhone] = useState('')
  const [bankEmail, setBankEmail] = useState('')

  const { data, refetch } = useQuery(GET_BANKS, {
    variables: { organizationId },
    skip: !open || !organizationId,
  })
  const banks = (data?.banks ?? []) as Array<{ id: string; name: string; bankIdentifierCode?: string | null }>

  const [createBank, { loading: savingBank }] = useMutation(CREATE_BANK, {
    onCompleted: (res) => {
      const b = res.createBank
      setBankId(b.id)
      setCreatingBank(false)
      void refetch()
      toast.success(`Bank "${b.name}" created`)
    },
    onError: (e) => toast.error(e.message ?? 'Failed to create bank'),
  })

  const reset = () => {
    setAccountNumber('')
    setBankId('')
    setCurrency('INR')
    setAccountHolder(vendorName)
    setSendMoney(false)
    setCreatingBank(false)
    setBankName('')
    setBic('')
    setBankAddress('')
    setBankPhone('')
    setBankEmail('')
  }

  const handleCreateBank = () => {
    if (!bankName.trim()) {
      toast.error('Bank name is required')
      return
    }
    createBank({
      variables: {
        input: {
          name: bankName.trim(),
          bankIdentifierCode: bic.trim() || undefined,
          address: bankAddress.trim() || undefined,
          phone: bankPhone.trim() || undefined,
          email: bankEmail.trim() || undefined,
          organizationId,
        },
      },
    })
  }

  const handleSave = () => {
    if (!accountNumber.trim()) {
      toast.error('Account number is required')
      return
    }
    if (!bankId) {
      toast.error('Select or create a bank first')
      return
    }
    const bank = banks.find((b) => b.id === bankId)
    onSave({
      accountNumber: accountNumber.trim(),
      bankId,
      bankName: bank?.name,
      currency,
      accountHolder: accountHolder.trim() || vendorName,
      sendMoney,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset()
        onOpenChange(o)
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Landmark className="h-4 w-4" /> {creatingBank ? 'Create bank' : 'Create bank account'}
          </DialogTitle>
        </DialogHeader>

        {!creatingBank ? (
          <div className="space-y-3">
            <InputFloating
              label="Account number *"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="h-9 text-xs"
            />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <SelectFloating
                  label="Bank *"
                  value={bankId}
                  onChange={(v) => setBankId(typeof v === 'string' ? v : v.target.value)}
                  options={[
                    { value: '', label: 'Select a bank…' },
                    ...banks.map((b) => ({ value: b.id, label: b.bankIdentifierCode ? `${b.name} (${b.bankIdentifierCode})` : b.name })),
                  ]}
                  className="h-9 text-xs"
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setCreatingBank(true)}>
                + New bank
              </Button>
            </div>
            <SelectFloating
              label="Currency"
              value={currency}
              onChange={(v) => setCurrency(typeof v === 'string' ? v : v.target.value)}
              options={CURRENCIES.map((c) => ({ value: c, label: c }))}
              className="h-9 text-xs"
            />
            <InputFloating
              label="Account holder"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="h-9 text-xs"
            />
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">Send money</p>
                <p className="text-xs text-muted-foreground">Enable this account for outgoing vendor payments</p>
              </div>
              <Switch checked={sendMoney} onCheckedChange={setSendMoney} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <InputFloating label="Bank name *" value={bankName} onChange={(e) => setBankName(e.target.value)} className="h-9 text-xs" />
            <InputFloating label="Bank Identifier Code (BIC/SWIFT)" value={bic} onChange={(e) => setBic(e.target.value)} className="h-9 text-xs" />
            <InputFloating label="Address" value={bankAddress} onChange={(e) => setBankAddress(e.target.value)} className="h-9 text-xs" />
            <InputFloating label="Phone" value={bankPhone} onChange={(e) => setBankPhone(e.target.value)} className="h-9 text-xs" />
            <InputFloating label="Email" value={bankEmail} onChange={(e) => setBankEmail(e.target.value)} className="h-9 text-xs" />
          </div>
        )}

        <DialogFooter>
          {creatingBank ? (
            <>
              <Button type="button" variant="outline" size="sm" onClick={() => setCreatingBank(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleCreateBank} disabled={savingBank}>
                {savingBank ? 'Creating…' : 'Create bank'}
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleSave}>
                Save account
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
