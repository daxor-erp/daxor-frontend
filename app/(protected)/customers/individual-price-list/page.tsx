'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import {
  GET_CUSTOMERS,
  GET_INDIVIDUAL_PRICE_LIST_BY_CUSTOMER,
  SEED_INDIVIDUAL_PRICE_LIST_FROM_CATALOG,
  UPSERT_INDIVIDUAL_PRICE_LIST,
} from '@/gql/queries'
import { wsCell, wsHeaderCell, wsMoney } from '@/lib/worksheet-styles'
import { formatMoney } from '@/lib/format-money'
import { Database, Printer, RefreshCw, Save, UserCircle } from 'lucide-react'

type LineRow = {
  itemId: string
  seqNo?: string | null
  name: string
  unit?: string | null
  category?: string | null
  standardRate: number
  customerRate: number
}

export default function IndividualPriceListPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [customerId, setCustomerId] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [rows, setRows] = useState<LineRow[]>([])
  const [error, setError] = useState('')

  const { data: custData } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const {
    data: plData,
    loading: plLoading,
    refetch: refetchPl,
  } = useQuery(GET_INDIVIDUAL_PRICE_LIST_BY_CUSTOMER, {
    variables: { organizationId: orgId, customerId },
    skip: !orgId || !customerId,
    fetchPolicy: 'network-only',
  })

  const customers = useMemo(() => [...(custData?.customers ?? [])].sort((a, b) => a.name.localeCompare(b.name)), [custData])

  const syncFromQuery = useCallback(() => {
    const pl = plData?.individualPriceListByCustomer
    if (!pl?.lines?.length) {
      setRows([])
      setTitle('')
      setNotes('')
      return
    }
    setTitle(pl.title ?? '')
    setNotes(pl.notes ?? '')
    setRows(
      pl.lines.map((l: any) => ({
        itemId: l.itemId,
        seqNo: l.seqNo,
        name: l.name,
        unit: l.unit,
        category: l.category,
        standardRate: Number(l.standardRate ?? 0),
        customerRate: Number(l.customerRate ?? 0),
      })),
    )
  }, [plData])

  useEffect(() => {
    syncFromQuery()
  }, [syncFromQuery])

  const [seedFromCatalog, { loading: seeding }] = useMutation(SEED_INDIVIDUAL_PRICE_LIST_FROM_CATALOG, {
    onCompleted: () => {
      setError('')
      void refetchPl()
    },
    onError: (e) => setError(e.message),
  })

  const [saveList, { loading: saving }] = useMutation(UPSERT_INDIVIDUAL_PRICE_LIST, {
    onCompleted: () => {
      setError('')
      void refetchPl()
    },
    onError: (e) => setError(e.message),
  })

  const listMeta = plData?.individualPriceListByCustomer

  const handleCustomerChange = (id: string) => {
    setCustomerId(id)
    setError('')
    setRows([])
    setTitle('')
    setNotes('')
  }

  const updateRate = (index: number, value: string) => {
    const n = parseFloat(value)
    setRows((prev) => {
      const next = [...prev]
      if (!next[index]) return prev
      next[index] = { ...next[index], customerRate: Number.isFinite(n) ? n : 0 }
      return next
    })
  }

  const handleSeed = () => {
    if (!customerId) return
    setError('')
    seedFromCatalog({ variables: { organizationId: orgId, customerId } })
  }

  const handleSave = () => {
    if (!customerId || !rows.length) {
      setError('Select a customer and load lines from catalog (or ensure rows exist).')
      return
    }
    setError('')
    saveList({
      variables: {
        input: {
          organizationId: orgId,
          customerId,
          title: title.trim() || undefined,
          notes: notes.trim() || undefined,
          lines: rows.map((r) => ({
            itemId: r.itemId,
            seqNo: r.seqNo || undefined,
            name: r.name,
            unit: r.unit || undefined,
            category: r.category || undefined,
            standardRate: r.standardRate,
            customerRate: r.customerRate,
          })),
        },
      },
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-[1200px] print:max-w-none">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-sky-700" />
          Individual Price List
        </h1>
        <p className="text-gray-500 mt-1">
          Negotiated rates per customer. Load active catalog lines, then edit the customer rate column. Standard rate stays
          for reference.
        </p>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm print:border-0 print:shadow-none">
        <div className="bg-sky-700 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between print:bg-gray-800">
          <span>Customer &amp; list</span>
          <span className="opacity-90">Worksheet</span>
        </div>
        <div className="p-4 space-y-3 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Customer</label>
              <select
                className="w-full h-9 border border-gray-300 rounded-md px-2 text-xs bg-white"
                value={customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
              >
                <option value="">— Select —</option>
                {customers.map((c: { id: string; docNumber: string; name: string }) => (
                  <option key={c.id} value={c.id}>
                    {c.docNumber} — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <InputFloating
              label="List title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 text-xs"
              placeholder="e.g. Acme — Q2 pricing"
            />
          </div>
          <InputFloating
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-8 text-xs max-w-3xl"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className="h-9 text-xs bg-sky-700 hover:bg-sky-800 text-white"
              onClick={handleSeed}
              disabled={seeding || !orgId || !customerId}
            >
              {seeding ? 'Loading…' : (
                <>
                  <Database className="h-3.5 w-3.5 mr-1 inline" />
                  Load / refresh from catalog
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-9 text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSave}
              disabled={saving || !customerId || !rows.length}
            >
              {saving ? 'Saving…' : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1 inline" />
                  Save price list
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => refetchPl()}
              disabled={!customerId}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 inline ${plLoading ? 'animate-spin' : ''}`} />
              Reload
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => window.print()}
              disabled={!rows.length}
            >
              <Printer className="h-3.5 w-3.5 mr-1 inline" />
              Print
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5">{error}</p>
          )}
        </div>

        <div className="border-t border-gray-200 px-4 py-3 print:border-t-0">
          <p className="text-sm font-semibold text-gray-800 mb-2 print:text-center">
            {listMeta?.listNumber
              ? `${listMeta.listNumber} — ${title || listMeta.title}`
              : customerId
                ? 'No saved list yet — use “Load / refresh from catalog”.'
                : 'Select a customer to begin.'}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs min-w-[880px]">
              <thead>
                <tr>
                  <th className={`${wsHeaderCell} text-left w-24`}>Code</th>
                  <th className={`${wsHeaderCell} text-left`}>Item</th>
                  <th className={`${wsHeaderCell} text-left`}>Category</th>
                  <th className={`${wsHeaderCell} text-left w-16`}>Unit</th>
                  <th className={`${wsHeaderCell} ${wsMoney} w-28`}>Standard</th>
                  <th className={`${wsHeaderCell} ${wsMoney} w-32`}>Customer rate</th>
                </tr>
              </thead>
              <tbody>
                {!rows.length && (
                  <tr>
                    <td colSpan={6} className={`${wsCell} text-center text-gray-500 py-10`}>
                      {plLoading ? 'Loading…' : 'No lines. Choose a customer and load from catalog.'}
                    </td>
                  </tr>
                )}
                {rows.map((row, i) => (
                  <tr key={`${row.itemId}-${i}`} className="hover:bg-gray-50">
                    <td className={`${wsCell} font-mono`}>{row.seqNo || '—'}</td>
                    <td className={`${wsCell} font-medium`}>{row.name}</td>
                    <td className={wsCell}>{row.category || '—'}</td>
                    <td className={wsCell}>{row.unit || '—'}</td>
                    <td className={`${wsCell} ${wsMoney}`}>{formatMoney(row.standardRate)}</td>
                    <td className={`${wsCell} p-0`}>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full h-full min-h-[36px] px-2 py-1.5 text-xs font-mono tabular-nums text-right border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-inset"
                        value={Number.isFinite(row.customerRate) ? row.customerRate : 0}
                        onChange={(e) => updateRate(i, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
