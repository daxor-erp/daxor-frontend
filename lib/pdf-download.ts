/**
 * HTML → PDF download via backend Puppeteer (Chromium) endpoint.
 *
 * Workflow:
 *  1) Caller builds an HTML string (use `wrapHtmlForPdf` for a branded shell).
 *  2) `downloadPdf` POSTs to /api/pdf — backend renders with Chromium.
 *  3) Browser saves the returned PDF blob to disk.
 *
 * Backend route is defined in apps/api/src/server/express.ts.
 */

function apiBase(): string {
  const gql = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql'
  return gql.replace(/\/graphql\/?$/, '').replace(/\/+$/, '')
}

function pdfEndpoint(): string {
  return `${apiBase()}/api/pdf`
}

function documentPdfEndpoint(): string {
  return `${apiBase()}/api/pdf/document`
}

export type PdfDocumentType =
  | 'quotation'
  | 'sales-order'
  | 'customer-invoice'
  | 'customer-payment'
  | 'purchase-order'
  | 'vendor-bill'
  | 'vendor-payment'
  | 'journal-entry'

/**
 * Server-rendered document PDF. Backend fetches the document by id, joins related
 * entities, renders the HTML template, and Puppeteer produces the PDF.
 */
export async function downloadDocumentPdf(type: PdfDocumentType, id: string, filename?: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const res = await fetch(documentPdfEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ type, id }),
  })
  if (!res.ok) {
    let detail = ''
    try { detail = (await res.json())?.error || '' } catch { /* response wasn't JSON */ }
    throw new Error(`PDF download failed (${res.status})${detail ? `: ${detail}` : ''}`)
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const fallback = `${type}-${id}.pdf`
  const safe = filename
    ? (filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
    : fallback
  a.href = url
  a.download = safe
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 200)
}

export interface DownloadPdfOptions {
  html: string
  filename?: string
  pdfOptions?: Record<string, unknown>
}

export async function downloadPdf({ html, filename = 'document', pdfOptions }: DownloadPdfOptions): Promise<void> {
  const res = await fetch(pdfEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, filename, options: pdfOptions }),
  })
  if (!res.ok) {
    let detail = ''
    try {
      const j = await res.json()
      detail = j?.error || ''
    } catch { /* response wasn't JSON */ }
    throw new Error(`PDF generation failed (${res.status})${detail ? `: ${detail}` : ''}`)
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const safe = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  a.href = url
  a.download = safe
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 200)
}

/**
 * Renders the given title + inner body HTML inside a polished, brand-aware
 * print shell. The inner `body` is inserted as-is, so callers should already
 * escape any user content with `escapeHtml`.
 */
export function wrapHtmlForPdf({
  title,
  body,
  orgName,
  subtitle,
  accent = '#059669',
}: {
  title: string
  body: string
  orgName?: string
  subtitle?: string
  accent?: string
}): string {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 18mm 14mm 18mm 14mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; color: #1f2937; font-size: 12px; }
  .pdf-root { padding: 0; }
  .pdf-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; border-bottom: 2px solid ${accent}; padding-bottom: 14px; margin-bottom: 20px; }
  .pdf-brand { display: flex; align-items: center; gap: 10px; }
  .pdf-logo { width: 36px; height: 36px; border-radius: 9px; background: ${accent}; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
  .pdf-brand-name { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; color: #111827; }
  .pdf-brand-sub { font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: #6b7280; margin-top: 2px; }
  .pdf-title { text-align: right; }
  .pdf-title h1 { margin: 0; font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.01em; }
  .pdf-title .pdf-subtitle { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .pdf-org { font-size: 11px; color: #6b7280; }
  .pdf-meta { display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 16px; font-size: 11px; color: #4b5563; }
  .pdf-meta strong { color: #111827; }
  table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  th, td { padding: 8px 10px; text-align: left; }
  thead th { background: #f3f4f6; color: #374151; text-transform: uppercase; font-size: 10px; letter-spacing: 0.06em; border-bottom: 1px solid #e5e7eb; font-weight: 600; }
  tbody tr { border-bottom: 1px solid #f3f4f6; }
  tbody tr:nth-child(even) { background: #fafafa; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .pdf-section { margin-top: 22px; }
  .pdf-section-title { font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 8px; }
  .pdf-totals { display: flex; justify-content: flex-end; margin-top: 12px; }
  .pdf-totals table { width: auto; min-width: 280px; }
  .pdf-totals td { padding: 4px 8px; }
  .pdf-totals .pdf-total-row td { border-top: 1px solid ${accent}; font-weight: 700; color: #111827; }
  .pdf-footer { margin-top: 30px; padding-top: 12px; border-top: 1px dashed #e5e7eb; font-size: 10px; color: #6b7280; display: flex; justify-content: space-between; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
</style>
</head>
<body>
<div class="pdf-root">
  <div class="pdf-header">
    <div class="pdf-brand">
      <div class="pdf-logo">D</div>
      <div>
        <div class="pdf-brand-name">${escapeHtml(orgName || 'Daxor')}</div>
        <div class="pdf-brand-sub">Daxor ERP · Generated ${escapeHtml(today)}</div>
      </div>
    </div>
    <div class="pdf-title">
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<div class="pdf-subtitle">${escapeHtml(subtitle)}</div>` : ''}
    </div>
  </div>
  ${body}
  <div class="pdf-footer">
    <span>Generated by Daxor ERP</span>
    <span>${escapeHtml(today)}</span>
  </div>
</div>
</body>
</html>`
}

export function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Convenience formatter for INR amounts inside PDF templates. */
export function pdfMoney(n: number | string | null | undefined): string {
  const num = Number.isFinite(Number(n)) ? Number(n) : 0
  return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
