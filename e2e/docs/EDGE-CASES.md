# A–Z Edge Case Coverage (Odoo-style)

## Backend — `npm run test:edge-cases` (local Mongo `daxor_edge_test`)

| Letter | Area | Guards covered |
|--------|------|----------------|
| A | Actors | Org / admin / vendor / customer seed |
| B | Blank fields | Empty vendor name, RA lines/qty, empty PO lines |
| C | Create | Vendor draft baseline |
| D | Double actions | Re-approve vendor / leave |
| E | Edit locks | Submitted vendor, confirmed PO |
| F | Finance | Pay draft bill, overpay, zero debit alloc |
| G | Goods / bill policy | `received_quantities` vs `ordered_quantities` |
| H | HR types | Duplicate leave code |
| I | Inventory | Adjustment, transfer conservation, no double-deduct on DO |
| J | Invoice status | Re-submit, pay draft |
| K | Cancel / reject | RA cancel, PO reject status |
| L | Lock / unlock | PO lock machine |
| M | Manufacturing | Work order status |
| N | Negative amounts | Cash sale over-refund |
| O | Over-receive | RA before approve; qty cap |
| P | PO status machine | Confirm/mark-sent illegal paths |
| Q | Sales policy | Delivered vs ordered invoicing |
| R | Returns | Stock IN on RA receive |
| S | Soft-delete | Unknown IDs |
| T | Tax IDs | Invalid GSTIN / PAN |
| U | Fixed assets | Dep before purchase; SL book value |
| V | Vendor approval | Draft → submit → approve (separate approver) |
| W | Illegal transitions | Approve RFQ before submit |
| X | Cross-check | Receive then bill |
| Y | Leave balance | Over-entitlement on approve |
| Z | Zero amounts | Invalid credit memo |

Also run: `npm run test:erp-flows` · `npm run test:gap-fixes` · `npm run test:all-edge`

## Frontend — `npm run test:e2e:edge`

Auth empty/wrong password, protected-route bounce, module load edges A–Z (vendors wizard, products, PO, sales, inventory, GL, returns, leave, assets, payables, approvals, reports, CRM, rapid nav, XSS input, multi-tab auth).

Requires API + FE up and `.env.e2e.local` credentials.
