import { gql } from '@apollo/client'

/** Registered customers (bill-to) for sales, quotations, and invoicing. */
export const GET_CUSTOMERS_FOR_SALES = gql`
  query GetCustomersForSales($organizationId: String!) {
    customers(organizationId: $organizationId) {
      id
      docNumber
      name
      email
      phone
      status
      invoiceBillable
    }
  }
`

export type SalesCustomer = {
  id: string
  docNumber?: string | null
  name: string
  email?: string | null
  phone?: string | null
  status?: string
  invoiceBillable?: boolean
}

export function mapSalesCustomers(customers: SalesCustomer[] | undefined | null) {
  return (customers ?? []).filter((c) => c.status !== 'inactive')
}

export function customerSelectOptions(
  customers: SalesCustomer[],
  emptyLabel = 'Select customer…',
): { value: string; label: string }[] {
  return [
    { value: '', label: emptyLabel },
    ...customers.map((c) => ({
      value: c.id,
      label: c.docNumber ? `${c.docNumber} — ${c.name}` : c.name,
    })),
  ]
}

export function customerDisplayName(
  customers: SalesCustomer[],
  id: string | null | undefined,
): string {
  if (!id) return '—'
  const c = customers.find((x) => x.id === id)
  if (!c) return String(id)
  return c.docNumber ? `${c.name} (${c.docNumber})` : c.name
}

/** Party id on quotations / legacy rows (customerId or clientId). */
export function quotationPartyId(q: {
  customerId?: { id?: string } | string | null
  clientId?: { id?: string } | string | null
}): string {
  const c = q.customerId
  const cl = q.clientId
  if (c && typeof c === 'object' && c.id) return c.id
  if (typeof c === 'string') return c
  if (cl && typeof cl === 'object' && cl.id) return cl.id
  if (typeof cl === 'string') return cl
  return ''
}

export function quotationPartyName(q: {
  customerId?: { name?: string; docNumber?: string | null } | null
  clientId?: { name?: string; docNumber?: string | null } | null
}): string {
  const c = q.customerId
  if (c && typeof c === 'object' && c.name) {
    return c.docNumber ? `${c.name} (${c.docNumber})` : c.name
  }
  return q.clientId?.name ?? '—'
}

export function quotationPartyEmail(q: {
  customerId?: { email?: string | null } | null
  clientId?: { email?: string | null } | null
}): string {
  return (q.customerId?.email ?? q.clientId?.email ?? '').trim()
}
