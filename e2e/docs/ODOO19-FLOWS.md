# Odoo 19.0 → Daxor E2E Flow Map

Source: [Odoo 19.0 documentation](https://www.odoo.com/documentation/19.0/)

Specs live under `e2e/odoo19/` and assert **official stage transitions**, not gap-fix extras.

| Odoo 19 doc | Official stages | Spec |
|-------------|-----------------|------|
| [Sales quotations](https://www.odoo.com/documentation/19.0/applications/sales/sales/sales_quotations.html) | Quotation → Sales order → Delivery → Invoice → Payment | `quote-to-cash.spec.ts` |
| [Invoicing policies](https://www.odoo.com/documentation/19.0/applications/sales/sales/invoicing/invoicing_policy.html) | Ordered vs delivered invoicing | Covered in quote-to-cash (delivered path) |
| [Requests for quotation](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/purchase/manage_deals/rfq.html) | RFQ → RFQ Sent → Confirm PO → Receive → Vendor bill | `procure-to-pay.spec.ts` |
| [CRM](https://www.odoo.com/documentation/19.0/applications/sales.html) | Lead → Opportunity → quote handoff | `crm-pipeline.spec.ts` |
| [Inventory / MRP](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp.html) | Receipt, adjustment, transfer; BOM → MO | `inventory-and-mrp.spec.ts` |
| [HR / Time off](https://www.odoo.com/documentation/19.0/applications/hr.html) | Employee → Leave type → Request → Approve | `hr-time-off.spec.ts` |
| Returns / Assets (Finance & Inventory apps) | RA approve→receive; asset + depreciation | `returns-and-assets.spec.ts` |

Run:

```bash
PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:odoo19
```
