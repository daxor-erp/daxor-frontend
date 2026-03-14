'use client'

import { useQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Send, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'

const GET_QUOTATIONS = gql`
  query GetQuotations {
    quotations {
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
      id
      status
      sentAt
    }
  }
`

export default function SendQuotationsPage() {
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const { data, loading, refetch } = useQuery(GET_QUOTATIONS)
  const [sendQuotation, { loading: sending }] = useMutation(SEND_QUOTATION, {
    onCompleted: () => {
      refetch()
      alert('Quotation sent successfully via email!')
    },
    onError: (error) => {
      alert(`Error sending quotation: ${error.message}`)
    },
  })

  const handleSend = (id: string, clientEmail: string) => {
    if (confirm(`Send this quotation to ${clientEmail}?`)) {
      sendQuotation({ variables: { id } })
    }
  }

  const handlePreview = (quotation: any) => {
    setSelectedQuotation(quotation)
    setPreviewOpen(true)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      accepted: 'bg-green-500',
      rejected: 'bg-red-500',
      expired: 'bg-orange-500',
    }
    return colors[status] || 'bg-gray-500'
  }

  if (loading) return <div className="p-6">Loading...</div>

  const draftQuotations = data?.quotations?.filter((q: any) => q.status === 'draft') || []
  const sentQuotations = data?.quotations?.filter((q: any) => q.status !== 'draft') || []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Send Quotations</h1>
        <p className="text-gray-500 mt-2">Review and send quotations to clients via email</p>
      </div>

      {/* Draft Quotations - Ready to Send */}
      <Card>
        <CardHeader>
          <CardTitle>Draft Quotations - Ready to Send</CardTitle>
        </CardHeader>
        <CardContent>
          {draftQuotations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No draft quotations available</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftQuotations.map((quotation: any) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.quotationNumber}</TableCell>
                    <TableCell>{quotation.clientId.name}</TableCell>
                    <TableCell>{quotation.clientId.email}</TableCell>
                    <TableCell>{quotation.subject}</TableCell>
                    <TableCell>{new Date(quotation.quotationDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(quotation.validUntil).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold">${quotation.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quotation.status)}>
                        {quotation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(quotation)}
                        >
                          <Eye className="w-4 h-4 mr-1" /> Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSend(quotation.id, quotation.clientId.email)}
                          disabled={sending}
                        >
                          <Send className="w-4 h-4 mr-1" /> Send Email
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Sent Quotations - History */}
      <Card>
        <CardHeader>
          <CardTitle>Sent Quotations - History</CardTitle>
        </CardHeader>
        <CardContent>
          {sentQuotations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sent quotations yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentQuotations.map((quotation: any) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.quotationNumber}</TableCell>
                    <TableCell>{quotation.clientId.name}</TableCell>
                    <TableCell>{quotation.subject}</TableCell>
                    <TableCell className="font-semibold">${quotation.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quotation.status)}>
                        {quotation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {quotation.sentAt ? new Date(quotation.sentAt).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(quotation)}
                      >
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

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quotation Preview</DialogTitle>
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
                    <p className="text-sm">{selectedQuotation.clientId.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quotation Date</p>
                    <p className="font-semibold">{new Date(selectedQuotation.quotationDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500 mt-2">Valid Until</p>
                    <p className="font-semibold">{new Date(selectedQuotation.validUntil).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{selectedQuotation.subject}</h3>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Line Items</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedQuotation.lineItems.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.discount}%</TableCell>
                          <TableCell className="text-right font-semibold">${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-gray-50 p-4 rounded space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${selectedQuotation.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-semibold">-${selectedQuotation.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-semibold">${selectedQuotation.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">${selectedQuotation.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {selectedQuotation.terms && (
                  <div>
                    <h4 className="font-semibold mb-2">Terms & Conditions</h4>
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
