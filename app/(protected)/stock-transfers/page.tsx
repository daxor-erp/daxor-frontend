'use client'

import { StockTransfersView } from '@/components/inventory/StockTransfersView'

export default function StockTransfersPage() {
  return (
    <StockTransfersView
      title="Stock transfers"
      description="Draft a transfer, then confirm to move qty between bins. GL (INV-ST) posts when from and to differ; same bin moves qty only."
      newPanelHeading="New stock transfer"
      tableTitle="All stock transfers"
      addLabel="New transfer"
      searchPlaceholder="Search transfers…"
      emptyMessage="No stock transfers yet."
      accent="indigo"
    />
  )
}
