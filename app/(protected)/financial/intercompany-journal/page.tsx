'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_INTERCOMPANY_JOURNALS,
  CREATE_INTERCOMPANY_JOURNAL,
  POST_INTERCOMPANY_JOURNAL,
  REVERSE_INTERCOMPANY_JOURNAL,
  GET_ORGANIZATIONS,
} from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, BookOpen, CheckCircle2, RotateCcw, Send } from 'lucide-react'
import { formatMoney, formatMoneyCompact, formatNumber } from '@/lib/format-money'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'

interface JournalLineRow {
  id?: string
  organizationId: string
  account: string
  accountName?: string
  costCenter?: string
  debit: number
  credit: number
  description?: string
}

export default function IntercompanyJournalPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    docNumber: '',
    entryDate: new Date().toISOString().slice(0, 10),
    description: '',
    lines: [] as JournalLineRow[],
    notes: '',
  })

  const listQ = useQuery(GET_INTERCOMPANY_JOURNALS, {
    variables: { originatingOrganizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const orgsQ = useQuery(GET_ORGANIZATIONS, {
    variables: { page: 1, limit: 500, search: null },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_INTERCOMPANY_JOURNAL, {
    onCompleted: () => { listQ.refetch(); setOpen(false); resetForm(); toast.success('Journal entry created') },
    onError: (e) => toast.error(e.message),
  })
  const [postMutation] = useMutation(POST_INTERCOMPANY_JOURNAL, {
    onCompleted: () => { listQ.refetch(); toast.success('Posted to GL') },
    onError: (e) => toast.error(e.message),
  })
  const [reverseMutation] = useMutation(REVERSE_INTERCOMPANY_JOURNAL, {
    onCompleted: () => { listQ.refetch(); toast.success('Reversed') },
    onError: (e) => toast.error(e.message),
  })

  const entries: any[] = listQ.data?.intercompanyJournalEntries ?? []
  const orgs: any[] = orgsQ.data?.organizations ?? []
  const orgOptions = useMemo(() => [{ value: '', label: '— Org —' }, ...orgs.map((o: any) => ({ value: o.id, label: o.name }))], [orgs])

  const stats = useMemo(() => {
    const posted = entries.filter((e) => e.status === 'POSTED').length
    const totalDebit = entries.reduce((s, e) => s + Number(e.totalDebit ?? 0), 0)
    return { posted, totalDebit }
  }, [entries])

  function resetForm() {
    setForm({
      docNumber: '',
      entryDate: new Date().toISOString().slice(0, 10),
      description: '',
      lines: [],
      notes: '',
    })
  }

  const lineColumns: LineColumn<JournalLineRow>[] = [
    { key: 'organizationId', header: 'Org', type: 'select', options: orgOptions, minWidth: 180 },
    { key: 'account', header: 'Account', minWidth: 140, placeholder: '5100' },
    { key: 'accountName', header: 'Account name', minWidth: 180 },
    { key: 'costCenter', header: 'Cost center', minWidth: 120 },
    { key: 'debit', header: 'Debit', type: 'money', align: 'right', minWidth: 110 },
    { key: 'credit', header: 'Credit', type: 'money', align: 'right', minWidth: 110 },
    { key: 'description', header: 'Description', minWidth: 200 },
  ]

  const totals = useMemo(() => form.lines.reduce(
    (s, l) => ({ debit: s.debit + Number(l.debit ?? 0), credit: s.credit + Number(l.credit ?? 0) }),
    { debit: 0, credit: 0 },
  ), [form.lines])

  const balanced = Math.abs(totals.debit - totals.credit) < 0.01

  const submit = () => {
    if (!form.docNumber.trim()) return toast.error('Doc number required')
    if (form.lines.length < 2) return toast.error('At least 2 lines required')
    if (!balanced) return toast.error('Journal must balance (debit = credit)')
    const orgsTouched = new Set(form.lines.map((l) => l.organizationId).filter(Boolean))
    if (orgsTouched.size < 2) return toast.error('Must touch at least 2 organizations')
    const cleanLines = form.lines
      .filter((l) => l.organizationId && l.account?.trim())
      .map((l) => ({
        organizationId: l.organizationId,
        account: l.account.trim(),
        accountName: l.accountName,
        costCenter: l.costCenter || undefined,
        debit: Number(l.debit ?? 0),
        credit: Number(l.credit ?? 0),
        description: l.description || undefined,
      }))
    createMutation({
      variables: {
        input: {
          originatingOrganizationId: orgId,
          docNumber: form.docNumber.trim().toUpperCase(),
          entryDate: form.entryDate,
          description: form.description || undefined,
          lines: cleanLines,
          notes: form.notes || undefined,
        },
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Intercompany Journal"
        description="Manual journal entries that span two or more organizations. Auto-balanced reversals supported."
        actions={
          <Button onClick={() => { resetForm(); setOpen(true) }} className="bg-grad-brand text-white border-none gap-1.5">
            <Plus className="h-4 w-4" /> New entry
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Entries" value={formatNumber(entries.length)} icon={<BookOpen className="h-5 w-5" />} tone="brand" />
        <StatCard label="Posted" value={formatNumber(stats.posted)} icon={<CheckCircle2 className="h-5 w-5" />} tone="emerald" />
        <StatCard label="Total debit (all)" value={formatMoneyCompact(stats.totalDebit)} icon={<BookOpen className="h-5 w-5" />} tone="warn" />
      </div>

      <SectionCard title="Journal entries" bodyClassName="p-0">
        {listQ.loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No journal entries yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Doc</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Description</th>
                  <th className="px-3 py-3 font-medium text-right">Debit</th>
                  <th className="px-3 py-3 font-medium text-right">Credit</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e: any) => (
                  <tr key={e.id} className="border-t hover:bg-secondary/30">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{e.docNumber}</td>
                    <td className="px-3 py-3 text-muted-foreground">{e.entryDate ? formatDate(e.entryDate) : '—'}</td>
                    <td className="px-3 py-3 text-muted-foreground truncate max-w-[20rem]">{e.description || '—'}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatMoney(e.totalDebit ?? 0)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatMoney(e.totalCredit ?? 0)}</td>
                    <td className="px-3 py-3"><JournalStatus status={e.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {e.status === 'DRAFT' && (
                          <button onClick={() => postMutation({ variables: { id: e.id } })} className="h-7 w-7 grid place-items-center rounded-md text-emerald-600 hover:bg-emerald-50" title="Post">
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {e.status === 'POSTED' && (
                          <button onClick={() => { if (confirm(`Reverse ${e.docNumber}? A reversal entry will be created.`)) reverseMutation({ variables: { id: e.id } }) }} className="h-7 w-7 grid place-items-center rounded-md text-amber-600 hover:bg-amber-50" title="Reverse">
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title="New intercompany journal entry"
        description="Lines must balance (Σ debit = Σ credit) and touch ≥ 2 organizations."
        icon={<BookOpen className="h-5 w-5" />}
        size="xl"
        submitting={creating}
        onSubmit={submit}
        submitLabel="Create entry"
        footerStart={
          <span>
            Debit <strong className="font-semibold">{formatMoney(totals.debit)}</strong> · Credit <strong className="font-semibold">{formatMoney(totals.credit)}</strong>{' '}
            {balanced
              ? <span className="text-emerald-600 font-semibold">· balanced</span>
              : <span className="text-rose-600 font-semibold">· off by {formatMoney(Math.abs(totals.debit - totals.credit))}</span>}
          </span>
        }
      >
        <FormSection title="Header">
          <FieldGrid cols={3}>
            <div className="space-y-1.5">
              <Label>Doc number *</Label>
              <Input value={form.docNumber} onChange={(e) => setForm({ ...form, docNumber: e.target.value.toUpperCase() })} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label>Entry date *</Label>
              <Input type="date" value={form.entryDate} onChange={(e) => setForm({ ...form, entryDate: e.target.value })} />
            </div>
            <div className="space-y-1.5 sm:col-span-3">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </FieldGrid>
        </FormSection>

        <FormSection title="Lines" description="A line can be debit OR credit (not both)." className="pt-5 border-t border-border mt-5">
          <LineItemsEditor<JournalLineRow>
            columns={lineColumns}
            rows={form.lines}
            onChange={(rows) => setForm({ ...form, lines: rows })}
            buildRow={() => ({ organizationId: '', account: '', debit: 0, credit: 0 })}
            totals={[{ key: 'debit', label: 'Debit', format: 'money' }, { key: 'credit', label: 'Credit', format: 'money' }]}
            minRows={2}
            maxRows={50}
          />
        </FormSection>
      </FormModal>
    </div>
  )
}

function JournalStatus({ status }: { status: string }) {
  const s = String(status || '').toUpperCase()
  const tone =
    s === 'POSTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : s === 'REVERSED' ? 'bg-rose-50 text-rose-700 border-rose-200'
        : 'bg-slate-100 text-slate-700 border-slate-200'
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase', tone)}>{s}</span>
}
