'use client'

/**
 * Reusable attachments widget. Drop into any form/detail page that has a
 * concrete record (parentModule + parentId) — it lists existing docs and
 * lets users upload more.
 *
 *   <DocumentAttachments parentModule="invoice" parentId={invoiceId} />
 *
 * Uses the backend Document module + REST upload endpoint (lib/upload.ts).
 */

import { useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_DOCUMENTS, DELETE_DOCUMENT } from '@/gql/queries'
import { useAuth } from '@/contexts/AuthContext'
import { buildDownloadUrl, humanFileSize, uploadDocument } from '@/lib/upload'
import { toast } from 'sonner'
import { Paperclip, Upload, Download, Trash2, FileText, FileImage, FileSpreadsheet, FileCode, File as FileIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentAttachmentsProps {
  parentModule: string
  parentId: string | null | undefined
  /** Compact list view (no border, fewer paddings) — for embedding inside an existing card. */
  compact?: boolean
  /** Optional title override. */
  title?: string
  /** Hide title bar. */
  hideHeader?: boolean
}

export function DocumentAttachments({
  parentModule,
  parentId,
  compact = false,
  title = 'Attachments',
  hideHeader,
}: DocumentAttachmentsProps) {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const canQuery = Boolean(parentId)
  const { data, loading, refetch } = useQuery(GET_DOCUMENTS, {
    variables: { parentModule, parentId: parentId ?? '' },
    skip: !canQuery,
    fetchPolicy: 'cache-and-network',
  })

  const [deleteMutation] = useMutation(DELETE_DOCUMENT, {
    onCompleted: () => { refetch(); toast.success('Attachment removed') },
    onError: (e) => toast.error(e.message),
  })

  const docs: any[] = data?.documents ?? []

  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files || !orgId || !parentId) return
    const list = Array.from(files)
    if (list.length === 0) return
    setUploading(true)
    try {
      for (const file of list) {
        await uploadDocument({
          file,
          organizationId: orgId,
          parentModule,
          parentId,
          uploadedByUserId: user?.id,
        })
      }
      toast.success(`${list.length} file${list.length === 1 ? '' : 's'} uploaded`)
      refetch()
    } catch (e: any) {
      toast.error(e?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const disabled = !parentId

  return (
    <div className={cn('space-y-2', !compact && 'rounded-xl border border-border bg-card elev-1 p-4')}>
      {!hideHeader && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
            <span className="rounded-full bg-secondary text-muted-foreground px-2 py-0.5 text-[10px] tabular-nums">
              {docs.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={disabled || uploading}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium hover:bg-secondary disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Upload
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            onChange={(e) => { handleFiles(e.target.files); e.currentTarget.value = '' }}
          />
        </div>
      )}

      {disabled ? (
        <div className="rounded-lg border border-dashed bg-secondary/30 px-3 py-4 text-center text-xs text-muted-foreground">
          Save this record first to attach documents.
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            'rounded-lg border-2 border-dashed transition-colors',
            dragging ? 'border-primary bg-primary-soft/40' : 'border-border bg-secondary/20',
          )}
        >
          {loading ? (
            <div className="p-4 text-center text-xs text-muted-foreground">Loading…</div>
          ) : docs.length === 0 ? (
            <div className="p-5 text-center">
              <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-1.5" />
              <p className="text-xs text-muted-foreground">Drop files here or click <strong>Upload</strong> above</p>
              <p className="text-[11px] text-muted-foreground/70 mt-0.5">Up to 25 MB per file</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {docs.map((d: any) => (
                <li key={d.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-secondary/40 transition-colors">
                  <DocIcon mimeType={d.mimeType} />
                  <div className="min-w-0 flex-1">
                    <a
                      href={buildDownloadUrl(d.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium truncate hover:underline block"
                    >
                      {d.filename}
                    </a>
                    <p className="text-[10px] text-muted-foreground tabular-nums">
                      {humanFileSize(Number(d.sizeBytes ?? 0))} · {new Date(d.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={buildDownloadUrl(d.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary"
                    title="Download"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => { if (confirm(`Remove ${d.filename}?`)) deleteMutation({ variables: { id: d.id } }) }}
                    className="h-7 w-7 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function DocIcon({ mimeType }: { mimeType?: string | null }) {
  const t = String(mimeType ?? '').toLowerCase()
  let Icon: any = FileIcon
  let cls = 'bg-slate-100 text-slate-700'
  if (t.startsWith('image/')) { Icon = FileImage; cls = 'bg-sky-50 text-sky-700' }
  else if (t.includes('pdf')) { Icon = FileText; cls = 'bg-rose-50 text-rose-700' }
  else if (t.includes('sheet') || t.includes('excel') || t.includes('csv')) { Icon = FileSpreadsheet; cls = 'bg-emerald-50 text-emerald-700' }
  else if (t.includes('json') || t.includes('xml') || t.includes('text/')) { Icon = FileCode; cls = 'bg-violet-50 text-violet-700' }
  return (
    <div className={cn('h-8 w-8 rounded-md grid place-items-center shrink-0', cls)}>
      <Icon className="h-4 w-4" />
    </div>
  )
}
