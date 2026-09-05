import Link from 'next/link'
import { Table2 } from 'lucide-react'

const CARDS = [
  {
    href: '/payroll/data-preparation/yard-data',
    title: 'Yard data',
    text: 'Gate and yard attendance: in/out times, hours, and yard codes in a worksheet.',
  },
  {
    href: '/payroll/data-preparation/biometric-data',
    title: 'Biometric data',
    text: 'Punch lines from devices: terminal, verification, in/out, and timestamps.',
  },
  {
    href: '/payroll/data-preparation/manual-entry',
    title: 'Manual entry',
    text: 'Ad-hoc amounts or hours by pay component when source files are not available.',
  },
] as const

export default function DataPreparationIndexPage() {
  return (
    <div className="erp-shell">
      <div>
        <h1 className="erp-page-title">Data preparation</h1>
        <p className="text-gray-500 mt-1 max-w-2xl">
          Enter or paste payroll source data in Excel-style sheets. Data is kept in the browser for this
          organization until you clear it or import a new file.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-3">
        {CARDS.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md"
            >
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-800">
                <Table2 className="h-4 w-4" />
              </div>
              <h2 className="font-semibold text-foreground">{c.title}</h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">{c.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
