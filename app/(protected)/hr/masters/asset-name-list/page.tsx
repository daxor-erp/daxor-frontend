'use client'

import { Boxes } from 'lucide-react'
import { HrMasterRegistry } from '@/components/hr-master-registry'

export default function AssetNameListPage() {
  return (
    <HrMasterRegistry
      kind="ASSET_NAME"
      title="Asset Name List"
      description="Catalog of asset types that can be issued to employees (laptops, phones, IDs)."
      icon={<Boxes className="h-5 w-5" />}
      metadataFields={[
        { key: 'category', label: 'Category', type: 'select', options: ['ELECTRONICS', 'FURNITURE', 'STATIONERY', 'TOOLS', 'VEHICLE', 'OTHER'] },
        { key: 'estimatedValue', label: 'Estimated value (₹)', type: 'number' },
        { key: 'tracksSerialNumber', label: 'Track serial', type: 'select', options: ['YES', 'NO'] },
      ]}
    />
  )
}
