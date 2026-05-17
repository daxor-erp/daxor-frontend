'use client'

import { Clock } from 'lucide-react'
import { HrMasterRegistry } from '@/components/hr-master-registry'

export default function ShiftMasterPage() {
  return (
    <HrMasterRegistry
      kind="SHIFT"
      title="Shift Master"
      description="Define work shifts (start/end time, break) for attendance and payroll."
      icon={<Clock className="h-5 w-5" />}
      metadataFields={[
        { key: 'startTime', label: 'Start time', type: 'time' },
        { key: 'endTime', label: 'End time', type: 'time' },
        { key: 'breakMinutes', label: 'Break (mins)', type: 'number', placeholder: '60' },
        { key: 'weeklyOffDay', label: 'Weekly off', type: 'select', options: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] },
      ]}
      renderMetadataSummary={(m) => (
        <span>
          {m.startTime && m.endTime ? `${m.startTime} – ${m.endTime}` : '—'}
          {m.breakMinutes ? ` · break ${m.breakMinutes}m` : ''}
        </span>
      )}
    />
  )
}
