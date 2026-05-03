'use client'

import { StockTransfersView } from '@/components/inventory/StockTransfersView'

/** ERP entry point for inter-warehouse transfer orders (same backend as Stock transfers). */
export default function EnterTransferOrdersPage() {
  return (
    <StockTransfersView
      title="Enter transfer orders"
      description="Create transfer orders to move stock between locations. Draft orders can be confirmed when ready. This uses the same records as Inventory → Stock transfers."
      newPanelHeading="New transfer order"
      tableTitle="Transfer orders"
      addLabel="New transfer order"
      searchPlaceholder="Search transfer orders…"
      emptyMessage="No transfer orders yet. Add a new transfer order above."
      accent="teal"
    />
  )
}
