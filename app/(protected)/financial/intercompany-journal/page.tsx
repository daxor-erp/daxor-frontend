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
import { DataTable, type Column } from '@/components/DataTable'
import { PageHeader, StatsRow, StatCard, ErpBadge, AmountCell, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { FormModal, FormSection, FieldGrid } from '@/components/forms/form-modal'
import { LineItemsEditor, type LineColumn } from '@/components/forms/line-items-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, BookOpen, CheckCircle2, RotateCcw, Send, CircleDollarSign } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'

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
    const draft = entries.filter((e) => e.status === 'DRAFT').length
    const totalDebit = entries.reduce((s, e) => s + Number(e.totalDebit ?? 0), 0)
    return { posted, draft, totalDebit }
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

  const columns: Column[] = [
    { key: 'docNumber', label: 'Doc', width: '130px', render: (v) => <MonoCell value={v} /> },
    { key: 'entryDate', label: 'Date', width: '110px', render: (v) => <DateCell value={v} /> },
    { key: 'description', label: 'Description', render: (v) => <span className="text-sm text-muted-foreground truncate max-w-[20rem] block">{v || '—'}</span> },
    { key: 'totalDebit', label: 'Debit', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'totalCredit', label: 'Credit', width: '120px', align: 'right', render: (v) => <AmountCell value={v} /> },
    { key: 'status', label: 'Status', width: '110px', render: (v) => <ErpBadge status={String(v)} /> },
  ]

  return (
    <div className="erp-shell">
      <PageHeader
        title="Intercompany Journal"
        subtitle="Manual journal entries that span two or more organizations"
        icon={<BookOpen className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Financial' }, { label: 'Intercompany Journal' }]}
        actions={
          <Button onClick={() => { resetForm(); setOpen(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> New entry
          </Button>
        }
      />

      <StatsRow cols={4}>
        <StatCard label="Entries" value={entries.length} icon={<BookOpen className="h-5 w-5" />} variant="slate" />
        <StatCard label="Draft" value={stats.draft} icon={<BookOpen className="h-5 w-5" />} variant="amber" />
        <StatCard label="Posted" value={stats.posted} icon={<CheckCircle2 className="h-5 w-5" />} variant="green" />
        <StatCard label="Total debit" value={`₹${(stats.totalDebit / 1000).toFixed(1)}k`} icon={<CircleDollarSign className="h-5 w-5" />} variant="rose" />
      </StatsRow>

      <DataTable
        data={entries}
        columns={columns}
        loading={listQ.loading}
        title="All Intercompany Journals"
        searchable
        searchPlaceholder="Search entries…"
        emptyMessage="No journal entries found."
        pageSize={25}
        actions={[
          {
            label: 'Post',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r: any) => postMutation({ variables: { id: r.id } }),
            show: (r: any) => r.status === 'DRAFT',
          },
          {
            label: 'Reverse',
            icon: <RotateCcw className="h-3.5 w-3.5" />,
            onClick: (r: any) => { if (confirm(`Reverse ${r.docNumber}? A reversal entry will be created.`)) reverseMutation({ variables: { id: r.id } }) },
            show: (r: any) => r.status === 'POSTED',
          },
        ]}
      />

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
