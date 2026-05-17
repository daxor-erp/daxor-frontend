'use client'

/**
 * Reusable "Download PDF" button. Caller provides a `buildHtml()` that
 * returns the inner body — we wrap it in the brand shell and stream through
 * the backend Puppeteer renderer.
 *
 *   <PdfDownloadButton
 *     title="Invoice INV-001"
 *     subtitle="Customer: Acme Corp"
 *     filename="invoice-INV-001"
 *     buildHtml={() => `<table>...</table>`}
 *   />
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@apollo/client'
import { GET_ORGANIZATION } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { downloadPdf, wrapHtmlForPdf } from '@/lib/pdf-download'
import { cn } from '@/lib/utils'

interface PdfDownloadButtonProps {
  title: string
  subtitle?: string
  filename: string
  buildHtml: () => string
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'default'
  label?: string
  className?: string
}

export function PdfDownloadButton({
  title,
  subtitle,
  filename,
  buildHtml,
  variant = 'outline',
  size = 'default',
  label = 'Download PDF',
  className,
}: PdfDownloadButtonProps) {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const { data } = useQuery(GET_ORGANIZATION, {
    variables: { id: orgId },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const orgName = data?.organization?.name as string | undefined
  const [downloading, setDownloading] = useState(false)

  const handle = async () => {
    setDownloading(true)
    try {
      const html = wrapHtmlForPdf({
        title,
        subtitle,
        orgName,
        body: buildHtml(),
      })
      await downloadPdf({
        html,
        filename: `${filename}-${new Date().toISOString().slice(0, 10)}`,
      })
      toast.success('PDF downloaded')
    } catch (e: any) {
      toast.error(e?.message || 'PDF download failed — is the backend running?')
    } finally {
      setDownloading(false)
    }
  }

  const cls = cn(
    'gap-1.5',
    variant === 'primary' && 'bg-grad-brand text-white border-none hover:opacity-95',
    className,
  )

  return (
    <Button
      type="button"
      variant={variant === 'primary' ? 'default' : variant}
      size={size}
      onClick={handle}
      disabled={downloading}
      className={cls}
    >
      {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {downloading ? 'Generating…' : label}
    </Button>
  )
}
