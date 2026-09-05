import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const LINKS = [
  { href: '/payroll/workflow/timesheet-pool', label: 'Timesheet pool' },
  { href: '/payroll/workflow/payroll-runs', label: 'Payroll runs' },
] as const

export default function PayrollWorkflowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="erp-shell">
      <nav className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
        <Link href="/payroll-management" className="hover:text-gray-800 hover:underline">
          Payroll
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
        <span className="text-gray-700 font-medium">Payroll workflow</span>
        <span className="text-gray-300">·</span>
        {LINKS.map((l) => (
          <span key={l.href} className="inline-flex items-center">
            <Link
              href={l.href}
              className="rounded px-1.5 py-0.5 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
            >
              {l.label}
            </Link>
          </span>
        ))}
      </nav>
      {children}
    </div>
  )
}
