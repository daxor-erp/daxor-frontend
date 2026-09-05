'use client'

import { useMemo, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_ORG_DOCUMENTS, DELETE_DOCUMENT } from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { StatCard } from '@/components/dashboard/stat-card'
import { FormModal, FormSection } from '@/components/forms/form-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  FileText, Upload, Download, Trash2, Search, FileImage, FileSpreadsheet,
  Paperclip, FilePlus, File as FileIcon, FileCode,
} from 'lucide-react'
import { buildDownloadUrl, humanFileSize, uploadDocument } from '@/lib/upload'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'

const MODULES = [
  { value: '', label: 'All modules' },
  { value: 'invoice', label: 'Invoices' },
  { value: 'purchase-order', label: 'Purchase orders' },
  { value: 'quotation', label: 'Quotations' },
  { value: 'fixed-asset', label: 'Fixed assets' },
  { value: 'vendor-bill', label: 'Vendor bills' },
  { value: 'employee', label: 'Employees' },
  { value: 'project', label: 'Projects' },
  { value: 'other', label: 'Other' },
]

export default function DocumentsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [search, setSearch] = useState('')
  const [parentFilter, setParentFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ parentModule: 'other', parentId: '', category: '', description: '' })
  const [file, setFile] = useState<File | null>(null)

  const { data, loading, refetch } = useQuery(GET_ORG_DOCUMENTS, {
    variables: { organizationId: orgId, parentModule: parentFilter || null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const [deleteMutation] = useMutation(DELETE_DOCUMENT, {
    onCompleted: () => { refetch(); toast.success('Document deleted') },
    onError: (e) => toast.error(e.message),
  })

  const docs: any[] = data?.organizationDocuments ?? []
  const filtered = useMemo(() => {
    if (!search.trim()) return docs
    const q = search.toLowerCase()
    return docs.filter(
      (d) =>
        d.filename?.toLowerCase().includes(q) ||
        d.parentModule?.toLowerCase().includes(q) ||
        d.category?.toLowerCase().includes(q),
    )
  }, [docs, search])

  const stats = useMemo(() => {
    const total = docs.length
    const bytes = docs.reduce((s, d) => s + Number(d.sizeBytes ?? 0), 0)
    const modules = new Set(docs.map((d) => d.parentModule)).size
    return { total, bytes, modules }
  }, [docs])

  const submit = async () => {
    if (!file) return toast.error('Select a file')
    if (!form.parentModule || !form.parentId.trim()) return toast.error('Parent module + id required')
    setUploading(true)
    try {
      await uploadDocument({
        file,
        organizationId: orgId,
        parentModule: form.parentModule,
        parentId: form.parentId.trim(),
        category: form.category || undefined,
        description: form.description || undefined,
        uploadedByUserId: user?.id,
      })
      toast.success('Document uploaded')
      setOpen(false)
      setFile(null)
      setForm({ parentModule: 'other', parentId: '', category: '', description: '' })
      refetch()
    } catch (e: any) {
      toast.error(e?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="erp-shell">
      <PageHeader
        title="Documents"
        description="Attachments uploaded across the workspace — invoices, contracts, drawings, exports."
        actions={
          <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5">
            <Upload className="h-4 w-4" />
            Upload document
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Total documents" value={stats.total} icon={<FileText className="h-5 w-5" />} tone="brand" />
        <StatCard label="Storage used" value={humanFileSize(stats.bytes)} icon={<Paperclip className="h-5 w-5" />} tone="sky" />
        <StatCard label="Modules covered" value={stats.modules} icon={<FilePlus className="h-5 w-5" />} tone="emerald" />
      </div>

      <SectionCard
        title="All documents"
        description={`${filtered.length} of ${docs.length} files`}
        action={
          <div className="flex items-center gap-2">
            <select
              value={parentFilter}
              onChange={(e) => setParentFilter(e.target.value)}
              className="rounded-lg border border-border bg-secondary/40 py-1.5 px-2 text-xs focus:ring-2 focus:ring-primary/40"
            >
              {MODULES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search filename / category"
                className="rounded-lg border border-border bg-secondary/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 w-56"
              />
            </div>
          </div>
        }
        bodyClassName="p-0"
      >
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No documents yet</p>
            <p className="text-xs text-muted-foreground mb-3">Upload contracts, invoices, drawings, exports — anything.</p>
            <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5">
              <Upload className="h-4 w-4" /> Upload your first document
            </Button>
          </div>
        ) : (
          <ul className="divide-y">
            {filtered.map((d: any) => (
              <li key={d.id} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/30 transition-colors">
                <FileTypeIcon mimeType={d.mimeType} />
                <div className="min-w-0 flex-1">
                  <a
                    href={buildDownloadUrl(d.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium truncate hover:underline"
                  >
                    {d.filename}
                  </a>
                  <p className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="capitalize">{d.parentModule}</span>
                    <span>·</span>
                    <span>{humanFileSize(Number(d.sizeBytes ?? 0))}</span>
                    {d.category && <><span>·</span><span>{d.category}</span></>}
                    <span>·</span>
                    <span>{formatDate(d.createdAt)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={buildDownloadUrl(d.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:bg-secondary"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => { if (confirm(`Delete ${d.filename}?`)) deleteMutation({ variables: { id: d.id } }) }}
                    className="h-8 w-8 grid place-items-center rounded-md text-rose-600 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* Upload modal */}
      <FormModal
        open={open}
        onOpenChange={setOpen}
        title="Upload document"
        description="Attach a file to any ERP record. Max 25 MB."
        icon={<Upload className="h-5 w-5" />}
        size="md"
        submitting={uploading}
        onSubmit={submit}
        submitLabel="Upload"
      >
        <FormSection>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const f = e.dataTransfer.files?.[0]
              if (f) setFile(f)
            }}
            className={cn(
              'cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center hover:border-primary hover:bg-primary-soft/30 transition-colors',
              file && 'border-emerald-400 bg-emerald-50/40',
            )}
          >
            <input
              ref={fileRef}
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            {file ? (
              <div>
                <p className="text-sm font-semibold">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{humanFileSize(file.size)} · click to choose another</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium">Drop a file here, or click to browse</p>
                <p className="text-xs text-muted-foreground mt-0.5">PDF, image, spreadsheet — anything up to 25 MB</p>
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title="Metadata" className="pt-5 border-t border-border mt-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Parent module *</Label>
              <select
                value={form.parentModule}
                onChange={(e) => setForm((p) => ({ ...p, parentModule: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {MODULES.filter((m) => m.value).map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Parent record ID *</Label>
              <Input
                value={form.parentId}
                onChange={(e) => setForm((p) => ({ ...p, parentId: e.target.value }))}
                placeholder="ObjectId of the record"
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. contract, drawing, invoice-pdf" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Optional notes" />
            </div>
          </div>
        </FormSection>
      </FormModal>
    </div>
  )
}

function FileTypeIcon({ mimeType }: { mimeType?: string | null }) {
  const t = String(mimeType ?? '').toLowerCase()
  let Icon: any = FileIcon
  let cls = 'bg-slate-100 text-slate-700'
  if (t.startsWith('image/')) { Icon = FileImage; cls = 'bg-sky-50 text-sky-700' }
  else if (t.includes('pdf')) { Icon = FileText; cls = 'bg-rose-50 text-rose-700' }
  else if (t.includes('sheet') || t.includes('excel') || t.includes('csv')) { Icon = FileSpreadsheet; cls = 'bg-emerald-50 text-emerald-700' }
  else if (t.includes('json') || t.includes('xml') || t.includes('text/')) { Icon = FileCode; cls = 'bg-violet-50 text-violet-700' }
  return (
    <div className={`h-10 w-10 rounded-lg grid place-items-center shrink-0 ${cls}`}>
      <Icon className="h-5 w-5" />
    </div>
  )
}
