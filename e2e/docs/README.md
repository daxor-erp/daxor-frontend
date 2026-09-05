# E2E flow documentation

Source PDFs: **`flows/`** (see `flows/README.md`).
Cross-module diagrams: **`../erp-flows/`**.

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

### Deep lifecycle flows (API + UI smoke)

| Spec | Coverage |
|------|----------|
| `auth-login.spec.ts` | Login success / failure |
| `sales-flow.spec.ts` | Enquiry → quotation → SO → delivery → invoice → payment |
| `accounting-ar.spec.ts` | AR-INV / AR-PAY journals + GL UI |
| `payables-flow.spec.ts` | Vendor bill → payment + AP journals |
| `inventory-debit-flow.spec.ts` | GRN, debit note, stock transfer |
| `inventory-flow.spec.ts` | GRN, adjustment, transfer |
| `crm-flow.spec.ts` | Lead → opportunity → closed-won |
| `customers-banks-flow.spec.ts` | Customer, deposit, bank account |
| `payroll-flow.spec.ts` | Payroll run create → approve → compute |
| `production-flow.spec.ts` | BOM → production plan |
| `vendors-flow.spec.ts` | Vendor master + approval |
| `products-flow.spec.ts` | Categories, UoM, attributes, variants |
| `purchase-orders-flow.spec.ts` | RFQ → approve → receive |
| `hr-leave-flow.spec.ts` | Employee → leave type → enrollment → approve |
| `returns-flow.spec.ts` | RA create → approve → receive goods |
| `fixed-assets-flow.spec.ts` | Asset create → post depreciation |
| `work-orders-flow.spec.ts` | Work order create → status update |

### Full-module smoke (every backend module + every frontend page)

| Spec | Coverage |
|------|----------|
| `backend-modules-smoke.spec.ts` | All `apps/api/src/modules/*` list queries — clear `[backend:module]` errors |
| `module-pages-smoke.spec.ts` | All static pages in `app/(protected)` — clear `[frontend:group/page]` errors |

Full matrix: [`COVERAGE.md`](./COVERAGE.md)

## How to run

```bash
# credentials
cp .env.e2e.example .env.e2e.local   # fill E2E_USER_ORG_ADMIN_* + E2E_GRAPHQL_URL

# start API (port 4000) + frontend (port 3000), then:
npm run test:e2e:smoke          # backend modules + all frontend pages
npm run test:e2e:smoke:be       # backend GraphQL only
npm run test:e2e:smoke:fe       # frontend pages only
npm run test:e2e:flows          # deep lifecycle flows
npm run test:e2e:flows:all      # auth + smoke + all deep flows
```

## Credentials

Copy `.env.e2e.example` → `.env.e2e.local` (gitignored).
