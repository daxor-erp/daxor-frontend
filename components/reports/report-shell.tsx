'use client'

import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Calendar, Download, Printer, RefreshCcw, Sliders } from 'lucide-react'
import { downloadPdf, wrapHtmlForPdf } from '@/lib/pdf-download'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { useQuery } from '@apollo/client'
import { GET_ORGANIZATION } from '@/gql/queries'

export type ReportPeriod = 'this_month' | 'last_month' | 'this_quarter' | 'this_year' | 'last_year' | 'all'

export const PERIOD_LABELS: Record<ReportPeriod, string> = {
  this_month: 'This month',
  last_month: 'Last month',
  this_quarter: 'This quarter',
  this_year: 'This year (YTD)',
  last_year: 'Last year',
  all: 'All time',
}

export function periodRange(p: ReportPeriod): { start: Date; end: Date } {
  const now = new Date()
  let start: Date
  let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  if (p === 'this_month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1)
  } else if (p === 'last_month') {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
  } else if (p === 'this_quarter') {
    const q = Math.floor(now.getMonth() / 3)
    start = new Date(now.getFullYear(), q * 3, 1)
  } else if (p === 'this_year') {
    start = new Date(now.getFullYear(), 0, 1)
  } else if (p === 'last_year') {
    start = new Date(now.getFullYear() - 1, 0, 1)
    end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59)
  } else {
    start = new Date(1970, 0, 1)
  }
  return { start, end }
}

export function inRange(iso?: string, range?: { start: Date; end: Date }): boolean {
  if (!range) return true
  if (!iso) return false
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return false
  return t >= range.start.getTime() && t <= range.end.getTime()
}

interface ReportShellProps {
  title: string
  description?: string
  period?: ReportPeriod
  onPeriodChange?: (p: ReportPeriod) => void
  onRefresh?: () => void
  loading?: boolean
  pdfBody: () => string
  pdfFilename?: string
  pdfSubtitle?: string
  toolbar?: ReactNode
  children: ReactNode
  printRef?: React.RefObject<HTMLDivElement>
}

export function ReportShell({
  title,
  description,
  period,
  onPeriodChange,
  onRefresh,
  loading,
  pdfBody,
  pdfFilename,
  pdfSubtitle,
  toolbar,
  children,
}: ReportShellProps) {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const { data } = useQuery(GET_ORGANIZATION, {
    variables: { id: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const orgName = data?.organization?.name as string | undefined
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const html = wrapHtmlForPdf({
        title,
        body: pdfBody(),
        orgName,
        subtitle: pdfSubtitle ?? (period ? PERIOD_LABELS[period] : undefined),
      })
      await downloadPdf({
        html,
        filename: (pdfFilename || title.toLowerCase().replace(/\s+/g, '-')) + '-' + new Date().toISOString().slice(0, 10),
      })
      toast.success('PDF downloaded')
    } catch (e: any) {
      toast.error(e?.message || 'PDF download failed — is the backend running?')
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between no-print">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {toolbar}
          {period && onPeriodChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {PERIOD_LABELS[period]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(PERIOD_LABELS) as ReportPeriod[]).map((p) => (
                  <DropdownMenuItem key={p} onClick={() => onPeriodChange(p)}>
                    {PERIOD_LABELS[p]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} disabled={loading} className="gap-1.5">
              <RefreshCcw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
              Refresh
            </Button>
          )}
          <Button variant="outline" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload} disabled={downloading} className="bg-grad-brand text-white border-none gap-1.5">
            <Download className="h-4 w-4" />
            {downloading ? 'Generating…' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card elev-1 print-page">
        <div className="p-4 sm:p-6">
          {/* Print header shows in printed output */}
          <div className="hidden print:flex items-center justify-between border-b pb-3 mb-4">
            <div>
              <p className="text-lg font-bold">{orgName ?? 'Daxor'}</p>
              <p className="text-xs text-muted-foreground">{title}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {period ? PERIOD_LABELS[period] : ''} · Generated {new Date().toLocaleDateString()}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
