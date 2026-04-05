'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { GET_PRICE_LISTS, GENERATE_PRICE_LIST } from '@/gql/queries'
import { wsCell, wsHeaderCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { List, Printer, RefreshCw, Tag } from 'lucide-react'

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

  return (
    <div className="p-6 space-y-6 max-w-[1100px] print:max-w-none">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Tag className="h-8 w-8 text-sky-700" />
          Generate Price Lists
        </h1>
        <p className="text-gray-500 mt-1">
          Build a snapshot from active inventory items. Optionally filter by category. Each run saves a new list
          you can print or reference later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 print:hidden">
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-400">Saved lists</p>
          <p className="text-lg font-bold text-gray-800">{lists.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-400">Lines in preview</p>
          <p className="text-lg font-bold text-gray-800">{previewLines.length}</p>
        </div>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm print:border-0 print:shadow-none">
        <div className="bg-sky-700 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between print:bg-gray-800">
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
              className="h-9 text-xs bg-sky-700 hover:bg-sky-800 text-white"
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => refetch()}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5">{error}</p>
          )}
        </div>

        <div className="border-t border-gray-200 px-4 py-2 print:border-t-0">
          <p className="text-sm font-semibold text-gray-800 mb-2 print:text-center">
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
                    <td colSpan={5} className={`${wsCell} text-center text-gray-500 py-8`}>
                      No items yet. Generate a list from active inventory items.
                    </td>
                  </tr>
                )}
                {previewLines.map((row: any, i: number) => (
                  <tr key={`${row.itemId}-${i}`} className="hover:bg-gray-50">
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

      <div className="rounded border border-gray-200 bg-white shadow-sm overflow-hidden print:hidden">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-800 flex items-center gap-2">
          <List className="h-4 w-4" />
          Recent saved lists
        </div>
        <ul className="divide-y divide-gray-100 max-h-48 overflow-y-auto text-xs">
          {!lists.length && (
            <li className="px-3 py-4 text-gray-400 text-center">No saved price lists yet.</li>
          )}
          {lists.map((l: any) => (
            <li key={l.id} className="px-3 py-2 flex justify-between gap-2">
              <span className="font-mono text-gray-700">{l.listNumber}</span>
              <span className="text-gray-600 truncate">{l.title}</span>
              <span className="text-gray-400 shrink-0">
                {l.lines?.length ?? 0} lines · {l.categoryFilter || 'all categories'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
