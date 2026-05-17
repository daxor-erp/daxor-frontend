'use client'

import { Calendar } from 'lucide-react'
import { HrMasterRegistry } from '@/components/hr-master-registry'
import { formatDate } from '@/lib/format-date'

export default function CalendarMastersPage() {
  return (
    <HrMasterRegistry
      kind="CALENDAR"
      title="Calendar Masters"
      description="Holidays, working days, and calendar entries for attendance + payroll."
      icon={<Calendar className="h-5 w-5" />}
      metadataFields={[
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'type', label: 'Type', type: 'select', options: ['HOLIDAY', 'WORKING_DAY', 'HALF_DAY', 'OPTIONAL'] },
        { key: 'locationScope', label: 'Applies to (location)', placeholder: 'All locations' },
      ]}
      renderMetadataSummary={(m) => (
        <span>
          {m.date ? formatDate(m.date) : '—'}
          {m.type ? ` · ${m.type.replace('_', ' ')}` : ''}
        </span>
      )}
    />
  )
}
