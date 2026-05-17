'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const PAGE_SIZE = 25

export function usePagination<T>(data: T[], size = PAGE_SIZE) {
  const [page, setPage] = useState(0)
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / size))
  const safePage = Math.min(page, totalPages - 1)
  const paged = data.slice(safePage * size, (safePage + 1) * size)
  const from = total === 0 ? 0 : safePage * size + 1
  const to = Math.min((safePage + 1) * size, total)

  return { paged, page: safePage, setPage, totalPages, from, to, total }
}

interface Props {
  page: number
  totalPages: number
  from: number
  to: number
  total: number
  setPage: (p: number | ((prev: number) => number)) => void
}

export function TablePagination({ page, totalPages, from, to, total, setPage }: Props) {
  if (total === 0) return null
  return (
    <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-gray-50">
      <span className="text-xs text-gray-400">{from}–{to} of {total} records</span>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(0)} disabled={page === 0}
            className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs">«</button>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft className="h-3 w-3" />
          </button>
          <span className="text-xs text-gray-600 px-2">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
            className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight className="h-3 w-3" />
          </button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page === totalPages - 1}
            className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs">»</button>
        </div>
      )}
    </div>
  )
}
