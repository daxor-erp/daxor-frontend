import { redirect } from 'next/navigation'

/** Legacy route: consolidated under Inventory control. */
export default function AdjustInventoryRedirectPage() {
  redirect('/inventory-control')
}
