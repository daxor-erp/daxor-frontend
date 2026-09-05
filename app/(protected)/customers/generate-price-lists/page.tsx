'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DataTable, type Column } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { PageHeader, StatsRow, StatCard, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { GET_PRICE_LISTS, GENERATE_PRICE_LIST } from '@/gql/queries'
import { wsCell, wsHeaderCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { List, Printer, RefreshCw, Tag, FileText } from 'lucide-react'

export default function GeneratePriceListsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [title, setTitle] = useState('Standard price list')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')

  const { data, loading, refetch } = useQuery(GET_PRICE_LISTS, {
    variables: { organizationId: orgId, page: 1, limit: 30 },
    skip: !orgId,
  })

  const [generate, { loading: generating, data: genData }] = useMutation(GENERATE_PRICE_LIST, {
    onCompleted: () => {
      setError('')
      void refetch()
    },
    onError: (e) => setError(e.message),
  })

  const latest = genData?.generatePriceList
  const lists = data?.priceLists ?? []

  const previewLines = useMemo(() => {
    if (latest?.lines?.length) return latest.lines
    return lists[0]?.lines ?? []
  }, [latest, lists])

  const handleGenerate = () => {
    setError('')
    generate({
      variables: {
        input: {
          organizationId: orgId,
          title: title.trim() || undefined,
          category: category.trim() || undefined,
        },
      },
    })
  }

  const columns: Column[] = [
    { key: 'listNumber', label: 'List #', width: '140px', render: (v) => <MonoCell value={v} /> },
    { key: 'title', label: 'Title', render: (v) => <span className="text-sm font-medium">{v || '—'}</span> },
    {
      key: 'lines',
      label: 'Lines',
      width: '90px',
      align: 'right',
      render: (_v, row) => <MonoCell value={String(row.lines?.length ?? 0)} />,
    },
    {
      key: 'categoryFilter',
      label: 'Category',
      width: '160px',
      render: (v) => <span className="text-sm text-muted-foreground">{v || 'All categories'}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '110px',
      render: (v) => <DateCell value={v} />,
    },
  ]

  return (
    <div className="erp-shell">
      <div className="print:hidden">
        <PageHeader
          title="Generate Price Lists"
          subtitle="Build a snapshot from active inventory items. Optionally filter by category. Each run saves a new list you can print or reference later."
          icon={<Tag className="h-5 w-5" />}
          breadcrumbs={[{ label: 'Customers' }, { label: 'Generate Price Lists' }]}
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          }
        />

        <StatsRow cols={2}>
          <StatCard
            label="Saved Lists"
            value={lists.length}
            icon={<List className="h-5 w-5" />}
            variant="slate"
          />
          <StatCard
            label="Lines in Preview"
            value={previewLines.length}
            icon={<FileText className="h-5 w-5" />}
            variant="blue"
          />
        </StatsRow>
      </div>

      <div className="rounded border-2 border-border overflow-hidden bg-card shadow-sm print:border-0 print:shadow-none">
        <div className="bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold flex items-center justify-between print:bg-muted print:text-foreground">
          <span>New price list</span>
          <span className="opacity-90">Items → snapshot</span>
        </div>
        <div className="p-4 space-y-3 print:hidden">
          <div className="grid grid-cols-2 gap-3 max-w-xl">
            <InputFloating
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 text-xs"
            />
            <InputFloating
              label="Category filter (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-8 text-xs"
              placeholder="e.g. Raw materials"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className="h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleGenerate}
              disabled={generating || !orgId}
            >
              {generating ? 'Generating…' : 'Generate & save list'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => window.print()}
              disabled={!previewLines.length}
            >
              <Printer className="h-3.5 w-3.5 mr-1" />
              Print preview
            </Button>
          </div>
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded px-2 py-1.5">{error}</p>
          )}
        </div>

        <div className="border-t border-border px-4 py-2 print:border-t-0">
          <p className="text-sm font-semibold text-foreground mb-2 print:text-center">
            {latest?.listNumber ? `${latest.listNumber} — ${latest.title}` : `Preview (${previewLines.length} lines)`}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs min-w-[640px]">
              <thead>
                <tr>
                  <th className={`${wsHeaderCell} text-left`}>Code</th>
                  <th className={`${wsHeaderCell} text-left`}>Item</th>
                  <th className={`${wsHeaderCell} text-left`}>Category</th>
                  <th className={`${wsHeaderCell} text-left`}>Unit</th>
                  <th className={`${wsHeaderCell} ${wsMoney}`}>Rate</th>
                </tr>
              </thead>
              <tbody>
                {!previewLines.length && (
                  <tr>
                    <td colSpan={5} className={`${wsCell} text-center text-muted-foreground py-8`}>
                      No items yet. Generate a list from active inventory items.
                    </td>
                  </tr>
                )}
                {previewLines.map((row: any, i: number) => (
                  <tr key={`${row.itemId}-${i}`} className="hover:bg-muted/50">
                    <td className={`${wsCell} font-mono`}>{row.seqNo || '—'}</td>
                    <td className={`${wsCell} font-medium`}>{row.name}</td>
                    <td className={wsCell}>{row.category || '—'}</td>
                    <td className={wsCell}>{row.unit || '—'}</td>
                    <td className={`${wsCell} ${wsMoney}`}>{formatMoney(Number(row.rate ?? 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <DataTable
          data={lists}
          columns={columns}
          loading={loading}
          title="All Price Lists"
          searchable
          searchPlaceholder="Search list #, title, category…"
          emptyMessage="No saved price lists yet."
          pageSize={25}
        />
      </div>
    </div>
  )
}
