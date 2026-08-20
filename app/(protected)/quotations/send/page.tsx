'use client'

import { useQuery, useMutation, gql } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Send, Eye, CheckCircle2, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatMoney } from '@/lib/format-money'
import { formatDate } from '@/lib/format-date'
import { quotationPartyName, quotationPartyEmail } from '@/lib/sales-customer-options'
import { PageHeader, ErpBadge, MonoCell, DateCell } from '@/components/ui/erp-shared'
import { DataTable, type Column } from '@/components/DataTable'

const GET_QUOTATIONS = gql`
  query GetQuotationsForSend($organizationId: ID) {
    quotations(organizationId: $organizationId) {
      id
      quotationNumber
      customerId {
        id
        name
        email
        docNumber
      }
      subject
      quotationDate
      validUntil
      lineItems {
        description
        quantity
        unitPrice
        discount
        tax
        total
      }
      subtotal
      taxAmount
      discountAmount
      totalAmount
      terms
      notes
      status
      sentAt
    }
  }
`

const SEND_QUOTATION = gql`
  mutation SendQuotation($id: ID!) {
    sendQuotation(id: $id) {
      emailSent
      quotation {
        id
        status
        sentAt
      }
    }
  }
`

type QuotationRow = {
  id: string
  quotationNumber: string
  customerId: { id: string; name: string; email?: string | null; docNumber?: string | null }
  clientId?: { id: string; name: string; email?: string | null }
  subject: string
  quotationDate: string
  validUntil: string
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
    discount?: number
    tax?: number
    total: number
  }>
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  terms?: string | null
  notes?: string | null
  status: string
  sentAt?: string | null
}

export default function SendQuotationsPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId

  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRow | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [sendConfirmId, setSendConfirmId] = useState<string | null>(null)

  const { data, loading, refetch } = useQuery(GET_QUOTATIONS, {
    variables: { organizationId: orgId },
    skip: !orgId,
    fetchPolicy: 'network-only',
  })

  const [sendQuotation, { loading: sending }] = useMutation(SEND_QUOTATION, {
    onCompleted: () => {
      refetch()
      setSendConfirmId(null)
      setBanner({
        type: 'ok',
        text: 'Quotation was emailed to the customer via SMTP and marked as sent.',
      })
      setTimeout(() => setBanner(null), 8000)
    },
    onError: (error) => {
      setSendConfirmId(null)
      setBanner({ type: 'err', text: error.message })
      setTimeout(() => setBanner(null), 10000)
    },
  })

  const handleSend = (id: string) => {
    sendQuotation({ variables: { id } })
  }

  const handlePreview = (quotation: QuotationRow) => {
    setSelectedQuotation(quotation)
    setPreviewOpen(true)
  }

  const getStatusStyle = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500 text-white border-transparent',
      submitted: 'bg-amber-600 text-white border-transparent',
      approval_declined: 'bg-red-500 text-white border-transparent',
      approved: 'bg-teal-600 text-white border-transparent',
      sent: 'bg-blue-600 text-white border-transparent',
      accepted: 'bg-emerald-600 text-white border-transparent',
      rejected: 'bg-red-600 text-white border-transparent',
      expired: 'bg-orange-600 text-white border-transparent',
    }
    return colors[status] || 'bg-gray-500 text-white border-transparent'
  }

  if (!orgId) {
    return (
      <div className="p-6">
        <p className="text-gray-500 text-sm">Select an organization to send quotations.</p>
      </div>
    )
  }

  if (loading) return <div className="p-6">Loading…</div>

  const rows: QuotationRow[] = data?.quotations ?? []
  const draftQuotations = rows.filter((q) => q.status === 'approved')
  const sentQuotations = rows.filter((q) => q.status !== 'approved')

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Send Quotations"
        subtitle="Internally approved quotations appear here ready to email to customers"
        icon={<Send className="h-5 w-5" />}
        breadcrumbs={[{ label: 'Sales' }, { label: 'Quotations' }, { label: 'Send' }]}
      />

      {banner?.type === 'ok' && (
        <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /><span>{banner.text}</span>
        </div>
      )}
      {banner?.type === 'err' && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{banner.text}</span>
        </div>
      )}

      {/* Ready to send */}
      <DataTable
        data={draftQuotations}
        columns={[
          { key: 'quotationNumber', label: 'Quotation #', width: '130px', render: (v) => <MonoCell value={v} /> },
          { key: 'customerId',      label: 'Customer',    render: (_v, r: any) => <span className="text-sm font-medium">{quotationPartyName(r)}</span> },
          { key: '_email',          label: 'Email',       render: (_v, r: any) => <span className="text-sm text-muted-foreground">{quotationPartyEmail(r) || '—'}</span> },
          { key: 'subject',         label: 'Subject',     render: (v) => <span className="text-sm">{v}</span> },
          { key: 'quotationDate',   label: 'Date',        width: '110px', render: (v) => <DateCell value={v} /> },
          { key: 'validUntil',      label: 'Valid Until', width: '110px', render: (v) => <DateCell value={v} /> },
          { key: 'totalAmount',     label: 'Amount',      width: '120px', align: 'right', render: (v) => <span className="font-semibold tabular-nums">{formatMoney(v)}</span> },
          { key: 'status',          label: 'Status',      width: '120px', render: (v) => <ErpBadge status={v} /> },
        ] as Column[]}
        title="Ready to Send (Internally Approved)"
        emptyMessage="No approved quotations. Submit for approval on the Quotations page first."
        actions={[
          {
            label: 'Preview',
            icon: <Eye className="h-3.5 w-3.5" />,
            onClick: (r: any) => { setSelectedQuotation(r); setPreviewOpen(true) },
          },
          {
            label: 'Send to Customer',
            icon: <Send className="h-3.5 w-3.5" />,
            onClick: (r: any) => setSendConfirmId(r.id),
            disabled: (r: any) => !quotationPartyEmail(r),
          },
        ]}
      />

      {/* History */}
      <DataTable
        data={sentQuotations}
        columns={[
          { key: 'quotationNumber', label: 'Quotation #', width: '130px', render: (v) => <MonoCell value={v} /> },
          { key: 'customerId',      label: 'Customer',    render: (_v, r: any) => <span className="text-sm font-medium">{quotationPartyName(r)}</span> },
          { key: 'subject',         label: 'Subject',     render: (v) => <span className="text-sm">{v}</span> },
          { key: 'totalAmount',     label: 'Amount',      width: '120px', align: 'right', render: (v) => <span className="font-semibold tabular-nums">{formatMoney(v)}</span> },
          { key: 'status',          label: 'Status',      width: '120px', render: (v) => <ErpBadge status={v} /> },
          { key: 'sentAt',          label: 'Sent At',     width: '160px', render: (v) => <span className="text-xs text-muted-foreground">{v ? new Date(v).toLocaleString() : '—'}</span> },
        ] as Column[]}
        title="Sent Quotations — History"
        emptyMessage="No sent quotations yet."
        actions={[{
          label: 'View',
          icon: <Eye className="h-3.5 w-3.5" />,
          onClick: (r: any) => { setSelectedQuotation(r); setPreviewOpen(true) },
        }]}
      />

      <Dialog open={!!sendConfirmId} onOpenChange={(open) => !open && setSendConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send quotation to customer?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Sends the full quotation (lines, totals, terms) to the customer using SMTP (Nodemailer). The API must have
            EMAIL_USER and EMAIL_PASSWORD set. The quotation is only marked sent after the email succeeds.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setSendConfirmId(null)} disabled={sending}>
              Cancel
            </Button>
            <Button size="sm" disabled={sending} onClick={() => sendConfirmId && handleSend(sendConfirmId)}>
              {sending ? 'Sending…' : 'Confirm send'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quotation preview</DialogTitle>
          </DialogHeader>
          {selectedQuotation && (
            <div className="space-y-4">
              <div className="bg-blue-600 text-white p-6 rounded-t-lg text-center">
                <h2 className="text-2xl font-bold">Quotation {selectedQuotation.quotationNumber}</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-semibold">{quotationPartyName(selectedQuotation)}</p>
                    <p className="text-sm">{quotationPartyEmail(selectedQuotation) || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quotation date</p>
                    <p className="font-semibold">{formatDate(selectedQuotation.quotationDate)}</p>
                    <p className="text-sm text-gray-500 mt-2">Valid until</p>
                    <p className="font-semibold">{formatDate(selectedQuotation.validUntil)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{selectedQuotation.subject}</h3>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Line items</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Unit price</TableHead>
                        <TableHead className="text-right">Disc %</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(selectedQuotation.lineItems ?? []).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatMoney(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{item.discount ?? 0}%</TableCell>
                          <TableCell className="text-right font-semibold">{formatMoney(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-gray-50 p-4 rounded space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatMoney(selectedQuotation.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-semibold">-{formatMoney(selectedQuotation.discountAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-semibold">{formatMoney(selectedQuotation.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total amount:</span>
                    <span className="text-blue-600">{formatMoney(selectedQuotation.totalAmount)}</span>
                  </div>
                </div>

                {selectedQuotation.terms && (
                  <div>
                    <h4 className="font-semibold mb-2">Terms & conditions</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedQuotation.terms}</p>
                  </div>
                )}

                {selectedQuotation.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedQuotation.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
