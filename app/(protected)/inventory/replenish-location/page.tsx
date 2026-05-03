'use client'

import { StockTransfersView } from '@/components/inventory/StockTransfersView'

/**
 * Replenish a low or empty location by recording an inter-warehouse stock transfer.
 * Draft transfers can be confirmed when ready (same Stock Transfer module as elsewhere).
 */
export default function ReplenishLocationPage() {
  return (
    <StockTransfersView
      title="Replenish location by inventory transfer"
      description="Move stock from a source warehouse into a destination that needs replenishment. Select both warehouses, add line items (item description, quantity, unit), then save. Confirm the transfer when the physical move is complete."
      newPanelHeading="New replenishment transfer"
      tableTitle="Replenishment transfers"
      addLabel="New replenishment transfer"
      searchPlaceholder="Search transfers…"
      emptyMessage="No replenishment transfers yet. Create one to record inventory moved into a low location."
      accent="teal"
      requireFromWarehouse
      requireToWarehouse
    />
  )
}
