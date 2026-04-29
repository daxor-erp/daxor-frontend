'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Construction } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Placeholder for nested payroll sidebar routes (data preparation, setup, workflow, statutory, etc.)
 * that are not yet built as full modules. "Payroll management" and "Salary processing" live at /payroll-management and /salary-processing.
 */
export default function PayrollModulePlaceholderPage() {
  const params = useParams()
  const raw = params?.slug
  const segments = Array.isArray(raw) ? raw : raw != null ? [String(raw)] : []
  const label = segments.length ? segments.join(' · ') : 'Payroll module'

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50/80 p-6">
        <div className="rounded-full bg-amber-100 p-3 text-amber-800">
          <Construction className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/80">Coming next</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{label}</h1>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            This screen is a fallback for routes that do not have a dedicated page yet. For{' '}
            <strong className="text-gray-800">Data preparation</strong> (yard, biometric, manual entry), use the
            links under Payroll in the sidebar. For payroll runs, open{' '}
            <strong className="text-gray-800">Payroll management</strong> or{' '}
            <strong className="text-gray-800">Salary processing</strong> for salary batches.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-slate-800 hover:bg-slate-900 text-white">
          <Link href="/payroll/data-preparation">Data preparation</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/payroll-management">Payroll management</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/salary-processing">Salary processing</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
