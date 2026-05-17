'use client'

import { LogOut } from 'lucide-react'
import { HrMasterRegistry } from '@/components/hr-master-registry'

export default function ExitProcessPage() {
  return (
    <HrMasterRegistry
      kind="EXIT_REASON"
      title="Exit Process — Reasons"
      description="Catalog of exit / separation reasons used by the offboarding workflow."
      icon={<LogOut className="h-5 w-5" />}
      metadataFields={[
        { key: 'category', label: 'Category', type: 'select', options: ['VOLUNTARY', 'INVOLUNTARY', 'RETIREMENT', 'CONTRACT_END', 'OTHER'] },
        { key: 'noticePeriodDays', label: 'Notice period (days)', type: 'number' },
        { key: 'rehireEligible', label: 'Rehire eligible', type: 'select', options: ['YES', 'NO', 'CONDITIONAL'] },
      ]}
    />
  )
}
