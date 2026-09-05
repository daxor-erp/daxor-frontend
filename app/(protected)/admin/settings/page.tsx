'use client'

import { useQuery } from '@apollo/client'
import { GET_ORGANIZATIONS, ME } from '@/gql/queries'
import { PageHeader, SectionCard } from '@/components/dashboard/section-card'
import { Server, Database, ShieldCheck, Layers, Activity, ExternalLink, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function AdminSettingsPage() {
  const { data: orgsData } = useQuery(GET_ORGANIZATIONS)
  const { data: meData } = useQuery(ME)
  const orgs = orgsData?.organizations ?? []
  const me = meData?.me

  const [apiUrl, setApiUrl] = useState('—')
  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql')
  }, [])

  return (
    <div className="erp-shell">
      <PageHeader
        title="Platform settings"
        description="Read-only platform metadata. Use the Organizations and Users pages to manage tenants."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="System health" description="Backend & data plane">
          <ul className="space-y-3">
            {[
              { label: 'GraphQL gateway', value: 'Operational', icon: Server, tone: 'emerald' as const },
              { label: 'Database (MongoDB)', value: 'Operational', icon: Database, tone: 'emerald' as const },
              { label: 'Authentication', value: 'JWT', icon: ShieldCheck, tone: 'emerald' as const },
              { label: 'Background jobs', value: 'Not configured', icon: Activity, tone: 'warn' as const },
            ].map((r) => {
              const Icon = r.icon
              return (
                <li key={r.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {r.label}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                      r.tone === 'emerald'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200',
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', r.tone === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500')} />
                    {r.value}
                  </span>
                </li>
              )
            })}
          </ul>
        </SectionCard>

        <SectionCard title="Platform stats" description="Snapshot across all tenants">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Organizations" value={orgs.length} icon={Layers} />
            <Stat
              label="Active tenants"
              value={orgs.filter((o: any) => String(o.status).toUpperCase() === 'ACTIVE').length}
              icon={ShieldCheck}
            />
          </div>
        </SectionCard>

        <SectionCard title="Endpoints" description="Backend connectivity">
          <ul className="space-y-2.5">
            <li className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">GraphQL endpoint</span>
              <span className="font-mono text-xs flex items-center gap-1.5">
                {apiUrl}
                <a
                  href={apiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                  aria-label="Open endpoint"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">API tester</span>
              <a href="/admin/api-tester" className="text-primary text-xs hover:underline">Open</a>
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Signed-in administrator" description="Your platform account">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-xl grid place-items-center font-bold uppercase">
              {((me?.firstName?.[0] ?? '') + (me?.lastName?.[0] ?? '')).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="font-semibold text-sm">{me?.firstName} {me?.lastName}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                {me?.email}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {(me?.roles ?? []).map((r: string) => (
                  <span key={r} className="inline-flex items-center rounded-full bg-primary-soft text-primary px-2 py-0.5 text-[10px] font-medium">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border bg-secondary/30 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}
