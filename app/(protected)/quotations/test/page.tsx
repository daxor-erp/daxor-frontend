'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { SEND_TEST_EMAIL } from '@/gql/queries'
import { PageHeader } from '@/components/ui/erp-shared'
import { Button } from '@/components/ui/button'
import { InputFloating } from '@/components/ui/input-floating'
import { FormSection } from '@/components/ui/form-drawer'

export default function QuotationEmailTestPage() {
  const [toEmail, setToEmail] = useState('')
  const [message, setMessage] = useState('Hello — this is a Daxor SMTP test. If you got this, email is working.')
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const [sendTest, { loading }] = useMutation(SEND_TEST_EMAIL, {
    onCompleted: () => {
      setBanner({
        type: 'ok',
        text: `Test email sent to ${toEmail.trim()}. Check inbox (and spam). SMTP is working.`,
      })
    },
    onError: (e) => {
      setBanner({ type: 'err', text: e.message })
    },
  })

  const handleSend = () => {
    const to = toEmail.trim()
    if (!to) {
      setBanner({ type: 'err', text: 'Enter a destination email address.' })
      return
    }
    setBanner(null)
    sendTest({ variables: { to, message: message.trim() || null } })
  }

  return (
    <div className="erp-shell">
      <PageHeader
        title="Test email (SMTP)"
        subtitle="Send a plain test message to any address to verify EMAIL_* settings before sending quotations"
        icon={<Mail className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Quotations' }, { label: 'Test' }]}
      />

      {banner?.type === 'ok' && (
        <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{banner.text}</span>
        </div>
      )}
      {banner?.type === 'err' && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{banner.text}</span>
        </div>
      )}

      <div className="max-w-lg rounded-xl border bg-card p-5 space-y-4">
        <FormSection title="Destination" columns={1}>
          <InputFloating
            label="To email *"
            type="email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            placeholder="you@gmail.com"
          />
          <InputFloating
            label="Message"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FormSection>
        <p className="text-xs text-muted-foreground">
          Uses the API SMTP settings (<code className="text-[11px]">EMAIL_USER</code> /{' '}
          <code className="text-[11px]">EMAIL_PASSWORD</code>). Put credentials in{' '}
          <code className="text-[11px]">.env.development</code> and restart the API.
        </p>
        <Button onClick={handleSend} disabled={loading} className="gap-1.5">
          <Send className="h-4 w-4" />
          {loading ? 'Sending…' : 'Send test email'}
        </Button>
      </div>
    </div>
  )
}
