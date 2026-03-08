'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function CustomerInvoicesPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Invoices</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Customer Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Customer invoices will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  )
}
