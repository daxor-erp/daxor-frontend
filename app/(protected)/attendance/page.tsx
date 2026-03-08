'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function AttendancePage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Attendance</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Mark Attendance
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Attendance records will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  )
}
