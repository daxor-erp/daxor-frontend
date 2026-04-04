'use client'

import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { Switch } from '@/components/ui/switch'
import { GET_CUSTOMERS, UPDATE_CUSTOMER } from '@/gql/queries'
import { wsCell, wsHeaderCell } from '@/lib/worksheet-styles'
import { FileSpreadsheet, RefreshCw, Search } from 'lucide-react'

export default function InvoiceBillableCustomersPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId || ''

  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const { data, loading, refetch } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: orgId },
    skip: !orgId,
  })

  const [updateCustomer, { loading: updating }] = useMutation(UPDATE_CUSTOMER, {
    onError: (e) => setError(e.message),
    onCompleted: () => {
      setError('')
      void refetch()
    },
  })

  const customers = data?.customers ?? []

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c: { name: string; docNumber?: string; email?: string }) => {
      return (
        c.name.toLowerCase().includes(q) ||
        (c.docNumber && c.docNumber.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
      )
    })
  }, [customers, search])

  const billableCount = useMemo(
    () => customers.filter((c: { invoiceBillable?: boolean }) => c.invoiceBillable !== false).length,
    [customers],
  )

  const toggleBillable = (id: string, next: boolean) => {
    updateCustomer({
      variables: { id, input: { invoiceBillable: next } },
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-[1100px]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileSpreadsheet className="h-8 w-8 text-sky-700" />
          Invoice Billable Customers
        </h1>
        <p className="text-gray-500 mt-1">
          Control which registered customers appear in invoice billing workflows. Non-billable customers stay in the
          register but are excluded from billable selections.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-400">Registered</p>
          <p className="text-lg font-bold text-gray-800">{customers.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-400">Invoice billable</p>
          <p className="text-lg font-bold text-emerald-800">{billableCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-400">Not billable</p>
          <p className="text-lg font-bold text-amber-800">{customers.length - billableCount}</p>
        </div>
      </div>

      <div className="rounded border-2 border-gray-400 overflow-hidden bg-white shadow-sm">
        <div className="bg-sky-700 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
          <span>Customer worksheet</span>
          <span className="opacity-90">Toggle invoice billable</span>
        </div>
        <div className="p-4 space-y-3 border-b border-gray-200">
          <div className="flex flex-wrap gap-3 items-end max-w-xl">
            <div className="flex-1 min-w-[200px]">
              <InputFloating
                label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 text-xs"
                placeholder="Name, doc #, email"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1.5">{error}</p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[720px]">
            <thead>
              <tr>
                <th className={`${wsHeaderCell} text-left w-32`}>Doc #</th>
                <th className={`${wsHeaderCell} text-left`}>Name</th>
                <th className={`${wsHeaderCell} text-left`}>Email</th>
                <th className={`${wsHeaderCell} text-left w-24`}>Status</th>
                <th className={`${wsHeaderCell} text-center w-40`}>
                  <span className="inline-flex items-center gap-1 justify-center">
                    <Search className="h-3 w-3 opacity-60" />
                    Invoice billable
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {!filtered.length && (
                <tr>
                  <td colSpan={5} className={`${wsCell} text-center text-gray-500 py-10`}>
                    {loading ? 'Loading…' : 'No customers match your search.'}
                  </td>
                </tr>
              )}
              {filtered.map((c: { id: string; docNumber: string; name: string; email?: string; status: string; invoiceBillable?: boolean }) => {
                const on = c.invoiceBillable !== false
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className={`${wsCell} font-mono`}>{c.docNumber}</td>
                    <td className={`${wsCell} font-medium`}>{c.name}</td>
                    <td className={wsCell}>{c.email || '—'}</td>
                    <td className={wsCell}>{c.status}</td>
                    <td className={`${wsCell} text-center`}>
                      <div className="inline-flex items-center justify-center gap-2 py-0.5">
                        <Switch
                          checked={on}
                          disabled={updating}
                          onCheckedChange={(v) => toggleBillable(c.id, v)}
                          aria-label={`Invoice billable for ${c.name}`}
                        />
                        <span className="text-[10px] text-gray-500 w-8">{on ? 'Yes' : 'No'}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
