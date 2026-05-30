# ERP process flows (source PDFs)

Canonical business flows for Playwright E2E. Convert PDFs to PNG reference images before writing or updating tests.

## PDFs

| PDF | Module | E2E spec |
|-----|--------|----------|
| `sales-flow.pdf` | Sales | `e2e/sales-flow.spec.ts` |
| `crm-flow.pdf` | CRM | `e2e/crm-flow.spec.ts` |
| `customers-banks-flow.pdf` | Customers & banking | `e2e/customers-banks-flow.spec.ts` |
| `inventory-flow.pdf` | Inventory | `e2e/inventory-flow.spec.ts` |
| `inventory-flow.pdf` (payables slice) | GRN + debit note | `e2e/inventory-debit-flow.spec.ts` |
| `payroll-flow.pdf` | Payroll | `e2e/payroll-flow.spec.ts` |
| `production-flow.pdf` | Production | `e2e/production-flow.spec.ts` |
| `purchases-payables-flow.pdf` | Payables | `e2e/payables-flow.spec.ts` |

## Convert all PDFs to images

```bash
npm run e2e:pdf-images
# or
npm run e2e:pdf-images:all
```

Writes `e2e/docs/<flow-name>/page-*.png` for each PDF in this folder.

Single PDF:

```bash
npm run e2e:pdf-images -- flows/crm-flow.pdf e2e/docs/crm-flow
```

Requires **poppler-utils** (`pdftoppm`).

## Run E2E

Prerequisites: API `:4000`, frontend `:3000`, `.env.e2e.local` with org admin credentials.

```bash
npm run test:e2e:flows          # all flow specs (serial)
npm run test:e2e:flows:all      # + auth login
npm run test:e2e:flows:remaining  # CRM, customers, inventory, payroll, production only
```

Per flow:

```bash
npm run test:e2e:sales
npm run test:e2e:crm
npm run test:e2e:customers-banks
npm run test:e2e:inventory-flow
npm run test:e2e:inventory-debit
npm run test:e2e:payroll
npm run test:e2e:production
npm run test:e2e:payables
npm run test:e2e:accounting
```
