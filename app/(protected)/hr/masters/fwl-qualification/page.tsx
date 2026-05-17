'use client'

import { GraduationCap } from 'lucide-react'
import { HrMasterRegistry } from '@/components/hr-master-registry'

export default function FwlQualificationPage() {
  return (
    <HrMasterRegistry
      kind="FWL_QUALIFICATION"
      title="FWL Qualification"
      description="Foreign Worker Levy qualification tiers used by payroll statutory calculations."
      icon={<GraduationCap className="h-5 w-5" />}
      metadataFields={[
        { key: 'tier', label: 'Tier', type: 'select', options: ['BASIC', 'HIGHER', 'SKILLED', 'PROFESSIONAL'] },
        { key: 'levyAmount', label: 'Monthly levy (₹)', type: 'number' },
        { key: 'validUntil', label: 'Valid until', type: 'date' },
      ]}
    />
  )
}
