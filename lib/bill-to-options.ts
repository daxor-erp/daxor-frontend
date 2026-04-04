export type BillToClient = { id: string; name: string; company?: string | null }
export type BillToCustomer = { id: string; docNumber: string; name: string }

/**
 * Merged dropdown options for CRM clients and registered customers (deduped by id).
 */
export function buildBillToOptions(
  clients: BillToClient[],
  customers: BillToCustomer[],
  emptyLabel = 'Select bill-to…',
): { value: string; label: string }[] {
  const seen = new Set<string>()
  const opts: { value: string; label: string }[] = [{ value: '', label: emptyLabel }]
  for (const cl of clients) {
    if (seen.has(cl.id)) continue
    seen.add(cl.id)
    opts.push({
      value: cl.id,
      label: `[Client] ${cl.name}${cl.company ? ` (${cl.company})` : ''}`,
    })
  }
  for (const c of customers) {
    if (seen.has(c.id)) continue
    seen.add(c.id)
    opts.push({ value: c.id, label: `[Customer] ${c.docNumber} — ${c.name}` })
  }
  return opts
}
