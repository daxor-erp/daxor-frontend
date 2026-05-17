'use client'

import { TrendingUp } from 'lucide-react'
import { HrMasterRegistry } from '@/components/hr-master-registry'

export default function CareerProgressSalaryPage() {
  return (
    <HrMasterRegistry
      kind="CAREER_GRADE"
      title="Career Progression Salary"
      description="Salary grade ladders by designation — base, allowance, ceiling."
      icon={<TrendingUp className="h-5 w-5" />}
      metadataFields={[
        { key: 'gradeLevel', label: 'Grade level', type: 'number', placeholder: '1' },
        { key: 'minSalary', label: 'Min salary (₹)', type: 'number' },
        { key: 'maxSalary', label: 'Max salary (₹)', type: 'number' },
        { key: 'incrementPercent', label: 'Annual increment %', type: 'number' },
      ]}
      renderMetadataSummary={(m) => (
        <span>
          {m.gradeLevel ? `Grade ${m.gradeLevel}` : '—'}
          {m.minSalary || m.maxSalary ? ` · ₹${m.minSalary ?? 0} – ₹${m.maxSalary ?? 0}` : ''}
        </span>
      )}
    />
  )
}
