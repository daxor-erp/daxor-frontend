# E2E flow documentation

Source PDFs: **`flows/`** (see `flows/README.md`).

## Convert PDFs to PNG (do this first)

```bash
cd daxor-frontend
npm run e2e:pdf-images
```

Outputs:

| PDF | Images folder |
|-----|----------------|
| `sales-flow.pdf` | `e2e/docs/sales-flow/` |
| `crm-flow.pdf` | `e2e/docs/crm-flow/` |
| `customers-banks-flow.pdf` | `e2e/docs/customers-banks-flow/` |
| `inventory-flow.pdf` | `e2e/docs/inventory-flow/` |
| `payroll-flow.pdf` | `e2e/docs/payroll-flow/` |
| `production-flow.pdf` | `e2e/docs/production-flow/` |
| `purchases-payables-flow.pdf` | `e2e/docs/purchases-payables-flow/` |

## Spec mapping

| Spec | PDF |
|------|-----|
| `sales-flow.spec.ts` | sales-flow |
| `accounting-ar.spec.ts` | (AR slice of sales-flow) |
| `payables-flow.spec.ts` | purchases-payables-flow |
| `inventory-debit-flow.spec.ts` | purchases + inventory (GRN, debit note) |
| `crm-flow.spec.ts` | crm-flow |
| `customers-banks-flow.spec.ts` | customers-banks-flow |
| `inventory-flow.spec.ts` | inventory-flow |
| `payroll-flow.spec.ts` | payroll-flow |
| `production-flow.spec.ts` | production-flow |

## Credentials

Copy `.env.e2e.example` → `.env.e2e.local` (gitignored).
