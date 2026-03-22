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

const GET_QUOTATIONS = gql`
  query GetQuotationsForSend($organizationId: ID) {
    quotations(organizationId: $organizationId) {
      id
      quotationNumber
      clientId {
        id
        name
        email
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
  clientId: { id: string; name: string; email?: string | null }
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
        text: 'Quotation was emailed to the client via SMTP and marked as sent.',
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
  const draftQuotations = rows.filter((q) => q.status === 'draft')
  const sentQuotations = rows.filter((q) => q.status !== 'draft')

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Send quotations</h1>
        <p className="text-gray-500 mt-2">Review draft quotations, send them to clients by email, and browse history.</p>
      </div>

      {banner?.type === 'ok' && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
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

      <Card>
        <CardHeader>
          <CardTitle>Draft quotations — ready to send</CardTitle>
        </CardHeader>
        <CardContent>
          {draftQuotations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No draft quotations. Create one under Quotations, then return here to send it.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Valid until</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftQuotations.map((quotation) => {
                  const clientEmail = quotation.clientId?.email?.trim()
                  const canSend = Boolean(clientEmail)
                  return (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium font-mono text-xs">{quotation.quotationNumber}</TableCell>
                      <TableCell>{quotation.clientId.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">{clientEmail || '—'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{quotation.subject}</TableCell>
                      <TableCell>{new Date(quotation.quotationDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(quotation.validUntil).toLocaleDateString()}</TableCell>
                      <TableCell className="font-semibold">${Number(quotation.totalAmount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusStyle(quotation.status)}>{quotation.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => handlePreview(quotation)}>
                            <Eye className="w-4 h-4 mr-1" /> Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setSendConfirmId(quotation.id)}
                            disabled={sending || !canSend}
                            title={!canSend ? 'Add an email on the client record first' : 'Send to client'}
                          >
                            <Send className="w-4 h-4 mr-1" /> Send to client
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sent quotations — history</CardTitle>
        </CardHeader>
        <CardContent>
          {sentQuotations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sent or closed quotations yet. Sent items appear here after you send a draft.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent at</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium font-mono text-xs">{quotation.quotationNumber}</TableCell>
                    <TableCell>{quotation.clientId.name}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{quotation.subject}</TableCell>
                    <TableCell className="font-semibold">${Number(quotation.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusStyle(quotation.status)}>{quotation.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {quotation.sentAt ? new Date(quotation.sentAt).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => handlePreview(quotation)}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!sendConfirmId} onOpenChange={(open) => !open && setSendConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send quotation to client?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Sends the full quotation (lines, totals, terms) to the client using SMTP (Nodemailer). The API must have
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
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-semibold">{selectedQuotation.clientId.name}</p>
                    <p className="text-sm">{selectedQuotation.clientId.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quotation date</p>
                    <p className="font-semibold">{new Date(selectedQuotation.quotationDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500 mt-2">Valid until</p>
                    <p className="font-semibold">{new Date(selectedQuotation.validUntil).toLocaleDateString()}</p>
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
                          <TableCell className="text-right">${Number(item.unitPrice).toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.discount ?? 0}%</TableCell>
                          <TableCell className="text-right font-semibold">${Number(item.total).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-gray-50 p-4 rounded space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${Number(selectedQuotation.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-semibold">-${Number(selectedQuotation.discountAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-semibold">${Number(selectedQuotation.taxAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total amount:</span>
                    <span className="text-blue-600">${Number(selectedQuotation.totalAmount).toFixed(2)}</span>
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
