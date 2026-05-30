/**
 * Frontend file upload helper. Posts base64 to /api/documents/upload (see
 * backend express.ts). Returns the created document metadata.
 */

import { authHeaders, withAccessToken } from '@/lib/api-auth'

export interface UploadedDoc {
  id: string
  filename: string
  mimeType?: string | null
  sizeBytes: number
  downloadUrl: string
  createdAt: string
}

function apiBase(): string {
  const gql = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql'
  return gql.replace(/\/graphql\/?$/, '').replace(/\/+$/, '')
}

export async function uploadDocument(params: {
  file: File
  organizationId: string
  parentModule: string
  parentId: string
  category?: string
  description?: string
  uploadedByUserId?: string
}): Promise<UploadedDoc> {
  const { file } = params
  if (file.size > 25 * 1024 * 1024) {
    throw new Error('File exceeds 25 MB limit')
  }
  const base64 = await readAsBase64(file)
  const res = await fetch(`${apiBase()}/api/documents/upload`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      organizationId: params.organizationId,
      parentModule: params.parentModule,
      parentId: params.parentId,
      filename: file.name,
      mimeType: file.type || undefined,
      base64,
      category: params.category,
      description: params.description,
      uploadedByUserId: params.uploadedByUserId,
    }),
  })
  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    throw new Error(j?.error || `Upload failed (${res.status})`)
  }
  return res.json()
}

export function buildDownloadUrl(idOrPath: string): string {
  if (idOrPath.startsWith('http') || idOrPath.startsWith('/api/')) {
    if (idOrPath.startsWith('/')) return `${apiBase()}${idOrPath}`
    return idOrPath
  }
  return withAccessToken(`${apiBase()}/api/documents/${idOrPath}/download`)
}

export function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      // result is data:<mime>;base64,<payload> — strip prefix for the API
      const idx = result.indexOf(',')
      resolve(idx >= 0 ? result.slice(idx + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('File read failed'))
    reader.readAsDataURL(file)
  })
}
