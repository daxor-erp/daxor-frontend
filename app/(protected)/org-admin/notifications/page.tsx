'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_USERS, SEND_NOTIFICATION } from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Send, CheckCircle2, AlertCircle, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

type Kind = 'BROADCAST' | 'MAINTENANCE' | 'ANNOUNCEMENT' | 'ALERT' | 'SYSTEM'
type Severity = 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER'
type Audience = 'allUsersInOrg' | 'specificUsers'

const KIND_OPTIONS: { value: Kind; label: string; severity: Severity }[] = [
  { value: 'BROADCAST', label: 'Broadcast', severity: 'INFO' },
  { value: 'ANNOUNCEMENT', label: 'Announcement', severity: 'INFO' },
  { value: 'MAINTENANCE', label: 'Maintenance', severity: 'WARNING' },
  { value: 'ALERT', label: 'Alert', severity: 'DANGER' },
  { value: 'SYSTEM', label: 'System', severity: 'INFO' },
]

const SEVERITY_OPTIONS: Severity[] = ['INFO', 'SUCCESS', 'WARNING', 'DANGER']

export default function OrgAdminNotificationsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const [kind, setKind] = useState<Kind>('ANNOUNCEMENT')
  const [severity, setSeverity] = useState<Severity>('INFO')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [audience, setAudience] = useState<Audience>('allUsersInOrg')
  const [selectedUserIds, setSelectedUserIds] = useState<Record<string, boolean>>({})
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null)

  const { data: usersData } = useQuery(GET_USERS, {
    variables: { organizationId: orgId, page: 1, limit: 200, search: null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
  })
  const users: any[] = (usersData?.usersByOrganization?.users ?? []).filter((u: any) => u.id !== user?.id)

  const [send, { loading: sending }] = useMutation(SEND_NOTIFICATION, {
    onCompleted: (d) => {
      setBanner({ ok: true, text: `Sent ${d?.sendNotification ?? 0} notification(s).` })
      setTitle('')
      setMessage('')
      setLink('')
      setSelectedUserIds({})
    },
    onError: (err) => setBanner({ ok: false, text: err.message }),
  })

  const selectedUserCount = useMemo(
    () => Object.values(selectedUserIds).filter(Boolean).length,
    [selectedUserIds],
  )

  const handleSend = () => {
    if (!title.trim()) {
      setBanner({ ok: false, text: 'Title is required.' })
      return
    }
    if (!orgId) {
      setBanner({ ok: false, text: 'No organization in your session.' })
      return
    }
    const audienceInput: any = {}
    if (audience === 'allUsersInOrg') {
      audienceInput.allUsersInOrganizationId = orgId
    } else {
      const ids = Object.entries(selectedUserIds).filter(([, v]) => v).map(([k]) => k)
      if (!ids.length) {
        setBanner({ ok: false, text: 'Select at least one user.' })
        return
      }
      audienceInput.userIds = ids
    }
    send({
      variables: {
        input: {
          kind,
          severity,
          title: title.trim(),
          message: message.trim() || null,
          link: link.trim() || null,
          audience: audienceInput,
        },
      },
    })
  }

  const selectAllVisible = () => {
    const next: Record<string, boolean> = {}
    users.forEach((u) => { next[u.id] = true })
    setSelectedUserIds(next)
  }
  const clearSelection = () => setSelectedUserIds({})

  return (
    <div className="erp-shell">
      <PageHeader
        title="Send notification"
        description="Reach your team with announcements, maintenance windows or alerts."
      />

      {banner && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm',
            banner.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-800',
          )}
        >
          {banner.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {banner.text}
        </div>
      )}

      <SectionCard title="Compose" description="Choose type, recipients, and message">
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="kind">Type</Label>
              <select
                id="kind"
                value={kind}
                onChange={(e) => {
                  const next = e.target.value as Kind
                  setKind(next)
                  const opt = KIND_OPTIONS.find((o) => o.value === next)
                  if (opt) setSeverity(opt.severity)
                }}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
              >
                {KIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sev">Severity</Label>
              <select
                id="sev"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
              >
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reminder — submit timesheets by Friday" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="msg">Message</Label>
            <textarea
              id="msg"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Details about the announcement…"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="link">Link (optional)</Label>
            <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="/hr/timesheets" />
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label>Recipients</Label>
            <div className="flex flex-wrap gap-2">
              <AudienceTab label="Everyone in my organization" value="allUsersInOrg" current={audience} onSelect={setAudience} />
              <AudienceTab label="Specific users" value="specificUsers" current={audience} onSelect={setAudience} />
            </div>

            {audience === 'specificUsers' && (
              <div className="pt-2">
                <div className="rounded-lg border bg-card">
                  <div className="flex items-center justify-between border-b px-3 py-2 text-xs">
                    <span className="font-medium">{users.length} users · {selectedUserCount} selected</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={selectAllVisible} className="text-primary hover:underline">Select all</button>
                      <button type="button" onClick={clearSelection} className="text-muted-foreground hover:underline">Clear</button>
                    </div>
                  </div>
                  <ul className="max-h-64 overflow-y-auto divide-y">
                    {users.map((u) => (
                      <li key={u.id} className="flex items-center gap-3 px-3 py-2">
                        <input
                          type="checkbox"
                          id={`u-${u.id}`}
                          checked={!!selectedUserIds[u.id]}
                          onChange={(e) => setSelectedUserIds((p) => ({ ...p, [u.id]: e.target.checked }))}
                        />
                        <label htmlFor={`u-${u.id}`} className="flex-1 text-sm cursor-pointer">
                          <span className="font-medium">{u.firstName} {u.lastName}</span>
                          <span className="text-muted-foreground"> · {u.email}</span>
                        </label>
                      </li>
                    ))}
                    {users.length === 0 && (
                      <li className="p-4 text-center text-xs text-muted-foreground">No other users in this organization.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => { setTitle(''); setMessage(''); setLink(''); setSelectedUserIds({}) }} disabled={sending}>
              Reset
            </Button>
            <Button onClick={handleSend} disabled={sending} className="gap-1.5">
              <Send className="h-4 w-4" />
              {sending ? 'Sending…' : 'Send notification'}
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Tips" description="What each type does">
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2"><Megaphone className="h-4 w-4 mt-0.5 text-primary" /><span><strong>Announcement</strong> — general team news. Defaults to INFO.</span></li>
          <li className="flex items-start gap-2"><Megaphone className="h-4 w-4 mt-0.5 text-amber-600" /><span><strong>Maintenance</strong> — heads-up for downtime. Defaults to WARNING.</span></li>
          <li className="flex items-start gap-2"><Megaphone className="h-4 w-4 mt-0.5 text-rose-600" /><span><strong>Alert</strong> — urgent / action required. Defaults to DANGER.</span></li>
        </ul>
      </SectionCard>
    </div>
  )
}

function AudienceTab({
  label,
  value,
  current,
  onSelect,
}: {
  label: string
  value: Audience
  current: Audience
  onSelect: (v: Audience) => void
}) {
  const active = current === value
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
        active ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-card text-muted-foreground hover:bg-secondary',
      )}
    >
      {label}
    </button>
  )
}
