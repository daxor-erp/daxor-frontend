'use client'

import { StockTransfersView } from '@/components/inventory/StockTransfersView'

export default function StockTransfersPage() {
  return (
    <StockTransfersView
      title="Stock transfers"
      description="Move inventory between warehouses with draft → confirm workflow."
      newPanelHeading="New stock transfer"
      tableTitle="All stock transfers"
      addLabel="New transfer"
      searchPlaceholder="Search transfers…"
      emptyMessage="No stock transfers yet."
      accent="indigo"
    />
  )
}
