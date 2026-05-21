'use client'

import { useParams } from 'next/navigation'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { COMPUTE_PAYROLL_RUN, GET_PAYSLIPS_BY_RUN } from '@/gql/queries'
import { Calculator, Download, FileText } from 'lucide-react'
import { formatMoney } from '@/lib/format-money'

function inr(n: number) {
  return formatMoney(n)
}

export default function PayrollRunPayslipsPage() {
  const params = useParams<{ id: string }>()
  const payrollRunId = params?.id

  const { data, loading, refetch } = useQuery(GET_PAYSLIPS_BY_RUN, {
    variables: { payrollRunId },
    skip: !payrollRunId,
    fetchPolicy: 'network-only',
  })

  const [compute, { loading: computing }] = useMutation(COMPUTE_PAYROLL_RUN, {
    onCompleted: () => refetch(),
  })

  const rows = data?.payslipsByRun ?? []

  const totalGross = rows.reduce((s: number, r: any) => s + (r.grossEarnings || 0), 0)
  const totalNet = rows.reduce((s: number, r: any) => s + (r.netPay || 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payroll Run Payslips</h1>
          <p className="text-gray-500 text-sm">Run ID: {payrollRunId}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => compute({ variables: { payrollRunId } })}
            disabled={computing || !payrollRunId}
          >
            <Calculator className="h-4 w-4 mr-2" />
            {computing ? 'Computing…' : 'Compute payslips'}
          </Button>
          <Button
            variant="outline"
            disabled={!rows.length}
            onClick={() => {
              const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : ''
              fetch(`/api/payroll-run/${payrollRunId}/neft.csv`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              })
                .then((r) => r.blob())
                .then((b) => {
                  const url = URL.createObjectURL(b)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `payroll-${payrollRunId}-neft.csv`
                  a.click()
                  URL.revokeObjectURL(url)
                })
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download NEFT CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Payslips</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{rows.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Total Gross</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold tabular-nums">{inr(totalGross)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Total Net Payable</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold tabular-nums text-emerald-700">{inr(totalNet)}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Employee Payslips</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-gray-500">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-gray-500">No payslips yet. Click "Compute payslips" to generate them from active salary structures.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-right">Paid days</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">PF</TableHead>
                  <TableHead className="text-right">ESI</TableHead>
                  <TableHead className="text-right">TDS</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.employeeCode}</TableCell>
                    <TableCell>{p.employeeName}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.paidDays}</TableCell>
                    <TableCell className="text-right tabular-nums">{inr(p.grossEarnings)}</TableCell>
                    <TableCell className="text-right tabular-nums">{inr(p.pfEmployee)}</TableCell>
                    <TableCell className="text-right tabular-nums">{inr(p.esiEmployee)}</TableCell>
                    <TableCell className="text-right tabular-nums">{inr(p.tds)}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{inr(p.netPay)}</TableCell>
                    <TableCell>
                      <a
                        href={`/api/payslip/${p.id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-blue-600 hover:underline text-xs"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" /> PDF
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
