# ERP process flows (source PDFs)

These PDFs are the canonical business flows for Playwright E2E coverage.

| PDF | Module |
|-----|--------|
| `sales-flow.pdf` | Sales (enquiry → quotation → SO → delivery → invoice → payment) |
| `crm-flow.pdf` | CRM |
| `customers-banks-flow.pdf` | Customers & banking |
| `inventory-flow.pdf` | Inventory |
| `payroll-flow.pdf` | Payroll |
| `production-flow.pdf` | Production |
| `purchases-payables-flow.pdf` | Purchases & payables |

## Sales flow (`sales-flow.pdf`)

High-level path:

1. Sales enquiry → optional approval → **won**
2. Quotation → internal approval → **send to customer** → **accepted**
3. Sales order → approval (non–cash sale) → active/approved
4. Delivery order → READY → DISPATCHED → (challan approval) → DELIVERED
5. Customer invoice → approval → **sent**
6. Customer payment → invoice paid
7. Optional branch: sales return & refund (not in default E2E yet)

E2E: `e2e/sales-flow.spec.ts` (run with `npm run test:e2e:sales`).

## Payables flow (`purchases-payables-flow.pdf`)

High-level path:

1. Vendor master
2. Vendor bill (enter bill) → **approve**
3. Accounting: **AP-BILL** (Dr Expense, Cr AP)
4. Pay bill (vendor payment)
5. Accounting: **AP-PAY** (Dr AP, Cr Cash)

E2E: `e2e/payables-flow.spec.ts` (`npm run test:e2e:payables`).

## Run all flow E2E (one command)

```bash
npm run test:e2e:flows
```

Runs: sales → AR accounting → payables (serial, one worker). Include auth with `npm run test:e2e:flows:all`.

Convert PDF pages to PNG for reference:

```bash
npm run e2e:pdf-images
# default: flows/sales-flow.pdf → e2e/docs/sales-flow/
```
