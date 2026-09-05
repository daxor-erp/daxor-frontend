# E2E Coverage Matrix — Backend ↔ Frontend

Generated from `apps/api/src/modules/*` and `app/(protected)/**/page.tsx`.

## How testing works

| Layer | Spec | What it asserts |
|-------|------|-----------------|
| Backend GraphQL | `backend-modules-smoke.spec.ts` | Every module list/query runs without GraphQL errors |
| Frontend pages | `module-pages-smoke.spec.ts` | Every static protected page loads (no 500 / login bounce / fatal UI) |
| Deep flows | `*-flow.spec.ts` | Full create → approve → post lifecycle for critical modules |

## Backend modules

Total folders: **104** · smokeable: **90** · skipped: **14**

| Backend module | Smoke query | Deep flow | Skip reason |
|----------------|-------------|-----------|-------------|
| `allocation-schedule` | `allocationSchedules` | — (API smoke only) |  |
| `applicant` | `applicants` | — (API smoke only) |  |
| `appraisal` | `appraisals` | — (API smoke only) |  |
| `approval` | `—` | — (API smoke only) | No GraphQL schema (internal/shared module) |
| `approval-request` | `myApprovalRequests` | — (API smoke only) |  |
| `asset` | `assets` | — (API smoke only) |  |
| `asset-maintenance` | `assetMaintenances` | — (API smoke only) |  |
| `attendance` | `attendances` | — (API smoke only) |  |
| `attribute` | `attributes` | products-flow.spec.ts |  |
| `audit-log` | `auditLogs` | — (API smoke only) |  |
| `auth` | `me` | auth-login.spec.ts |  |
| `bank` | `banks` | — (API smoke only) |  |
| `base` | `—` | — (API smoke only) | No GraphQL schema (internal/shared module) |
| `blanket-order` | `blanketOrders` | — (API smoke only) |  |
| `bom` | `billsOfMaterials` | production-flow.spec.ts |  |
| `budget` | `budgets` | — (API smoke only) |  |
| `career` | `careers` | — (API smoke only) |  |
| `cash-bank` | `cashBanks` | customers-banks-flow.spec.ts |  |
| `client` | `clients` | — (API smoke only) |  |
| `contractor` | `contractors` | — (API smoke only) |  |
| `counter` | `—` | — (API smoke only) | No GraphQL schema (internal/shared module) |
| `currency-revaluation` | `currencyRevaluations` | — (API smoke only) |  |
| `customer` | `customers` | customers-banks-flow.spec.ts |  |
| `customer-deposit` | `customerDeposits` | customers-banks-flow.spec.ts |  |
| `customer-invoice` | `customerinvoices` | sales-flow.spec.ts / accounting-ar.spec.ts |  |
| `customer-payment` | `customerPayments` | sales-flow.spec.ts / accounting-ar.spec.ts |  |
| `customer-refund` | `customerRefunds` | — (API smoke only) |  |
| `customer-statement` | `generateCustomerStatement` | — (API smoke only) |  |
| `delivery-challan` | `deliverychallans` | sales-flow.spec.ts |  |
| `delivery-order` | `deliveryOrders` | sales-flow.spec.ts |  |
| `document` | `organizationDocuments` | — (API smoke only) |  |
| `dvs` | `dvsRecords` | — (API smoke only) |  |
| `employee-master` | `employeeMasters` | hr-leave-flow.spec.ts |  |
| `employee-salary-structure` | `employeeSalaryStructures` | — (API smoke only) |  |
| `epm` | `epms` | — (API smoke only) |  |
| `excise-invoice` | `exciseinvoices` | — (API smoke only) |  |
| `extraction` | `extractions` | — (API smoke only) |  |
| `finance-charge-assessment` | `financeChargeAssessments` | — (API smoke only) |  |
| `fixed-asset` | `fixedAssets` | fixed-assets-flow.spec.ts |  |
| `general-ledger` | `generalLedgers` | accounting-ar.spec.ts / payables-flow.spec.ts |  |
| `global-search` | `globalSearch` | — (API smoke only) | List query requires fixtures: query (primary: globalSearch) |
| `goods-receipt` | `goodsreceipts` | — (API smoke only) |  |
| `grn` | `grns` | inventory-flow.spec.ts / inventory-debit-flow.spec.ts |  |
| `hr-master` | `hrMasters` | — (API smoke only) | List query requires fixtures: kind (primary: hrMasters) |
| `individual-price-list` | `individualPriceLists` | — (API smoke only) |  |
| `intercompany-allocation` | `intercompanyAllocations` | — (API smoke only) |  |
| `intercompany-journal` | `intercompanyJournalEntries` | — (API smoke only) | List query requires fixtures: originatingOrganizationId (primary: intercompanyJournalEntries) |
| `intercompany-transfer` | `intercompanyTransfers` | — (API smoke only) |  |
| `internal-order` | `internalorders` | — (API smoke only) |  |
| `inventory-control` | `lowStockItems` | — (API smoke only) |  |
| `inventory-return` | `inventoryreturns` | — (API smoke only) |  |
| `ip-inspection` | `ipinspections` | — (API smoke only) |  |
| `item` | `items` | — (API smoke only) |  |
| `journal-entry` | `journalEntries` | accounting-ar.spec.ts / payables-flow.spec.ts |  |
| `lead` | `leads` | crm-flow.spec.ts |  |
| `leave` | `leaveTypes` | hr-leave-flow.spec.ts |  |
| `loan-repayment` | `loanrepayments` | — (API smoke only) |  |
| `material-receipt` | `materialreceipts` | — (API smoke only) |  |
| `module-workspace-record` | `moduleWorkspaceRecords` | — (API smoke only) | List query requires fixtures: routePath (primary: moduleWorkspaceRecords) |
| `notification` | `myNotifications` | — (API smoke only) |  |
| `onboarding` | `onboardings` | — (API smoke only) |  |
| `opportunity` | `opportunities` | crm-flow.spec.ts |  |
| `organization` | `organizations` | — (API smoke only) |  |
| `package` | `packages` | — (API smoke only) |  |
| `package-assignment` | `packageModuleAssignments` | — (API smoke only) | List query requires fixtures: packageId (primary: packageModuleAssignments) |
| `payment-term` | `paymentTerms` | — (API smoke only) |  |
| `payroll-management` | `payrollmanagements` | payroll-flow.spec.ts |  |
| `payroll-ui-record` | `payrolluirecords` | — (API smoke only) | List query requires fixtures: category (primary: payrolluirecords) |
| `payslip` | `payslip` | — (API smoke only) | List query requires fixtures: id (primary: payslip) |
| `pdf` | `—` | — (API smoke only) | No GraphQL schema (internal/shared module) |
| `price-list` | `priceLists` | — (API smoke only) |  |
| `product` | `products` | products-flow.spec.ts |  |
| `product-category` | `productCategories` | products-flow.spec.ts |  |
| `product-stock` | `—` | — (API smoke only) | No GraphQL schema (internal/shared module) |
| `product-variant` | `productVariant` | — (API smoke only) | List query requires fixtures: id (primary: productVariant) |
| `production-planning` | `productionplannings` | production-flow.spec.ts |  |
| `project` | `projects` | — (API smoke only) |  |
| `purchase-order` | `purchaseorders` | purchase-orders-flow.spec.ts |  |
| `quality-control` | `qcInspections` | — (API smoke only) |  |
| `quotation` | `quotations` | sales-flow.spec.ts |  |
| `return-authorization` | `returnAuthorizations` | returns-flow.spec.ts |  |
| `role` | `roles` | — (API smoke only) |  |
| `salary-processing` | `salaryprocessings` | — (API smoke only) |  |
| `sales-enquiry` | `salesEnquiries` | sales-flow.spec.ts |  |
| `sales-order` | `salesorders` | sales-flow.spec.ts |  |
| `sales-quotation` | `salesQuotations` | — (API smoke only) |  |
| `sales-return` | `salesreturns` | — (API smoke only) |  |
| `site-location` | `siteLocations` | — (API smoke only) |  |
| `stock-adjustment` | `stockadjustments` | inventory-flow.spec.ts |  |
| `stock-transfer` | `stocktransfers` | inventory-flow.spec.ts / inventory-debit-flow.spec.ts |  |
| `tag` | `tags` | — (API smoke only) |  |
| `tax-compliance` | `checkGstinStatus` | — (API smoke only) | List query requires fixtures: gstin (primary: checkGstinStatus) |
| `tax-rate` | `taxRates` | — (API smoke only) |  |
| `timesheet` | `timesheetEntries` | — (API smoke only) |  |
| `uom` | `uoms` | products-flow.spec.ts |  |
| `user` | `usersByOrganization` | — (API smoke only) |  |
| `vendor` | `vendors` | vendors-flow.spec.ts / payables-flow.spec.ts |  |
| `vendor-bill` | `vendorBills` | payables-flow.spec.ts |  |
| `vendor-credit` | `vendorCredits` | — (API smoke only) |  |
| `vendor-debit-note` | `vendorDebitNotes` | inventory-debit-flow.spec.ts |  |
| `vendor-payment` | `vendorPayments` | payables-flow.spec.ts |  |
| `vendor-prepayment` | `vendorPrepayments` | — (API smoke only) |  |
| `warehouse` | `warehouses` | — (API smoke only) |  |
| `work-order` | `workorders` | work-orders-flow.spec.ts |  |

## Frontend pages

Total static protected pages: **202** (dynamic `[param]` routes excluded)

| Group | Pages |
|-------|-------|
| `admin` | 9 — `/admin/api-tester`, `/admin/audit-log`, `/admin/dashboard`, `/admin/notifications`, `/admin/organizations`, `/admin/packages`, `/admin/settings`, `/admin/sub-tenants`… |
| `ai-assistant` | 10 — `/ai-assistant/crm`, `/ai-assistant/finance`, `/ai-assistant/hr`, `/ai-assistant/inventory`, `/ai-assistant`, `/ai-assistant/payroll`, `/ai-assistant/production`, `/ai-assistant/projects`… |
| `approvals` | 1 — `/approvals/history` |
| `attendance` | 1 — `/attendance` |
| `banks` | 7 — `/banks/make-deposits`, `/banks/reconcile-account`, `/banks/reconcile-bank`, `/banks/reconciliation-rules`, `/banks/transfer-funds`, `/banks/write-checks`, `/banks/write-tax-liability` |
| `blanket-orders` | 1 — `/blanket-orders` |
| `cash-bank` | 1 — `/cash-bank` |
| `clients` | 1 — `/clients` |
| `crm` | 2 — `/crm/lead-management`, `/crm/opportunity-management` |
| `customer-invoices` | 1 — `/customer-invoices` |
| `customers` | 14 — `/customers/accept-payments`, `/customers/approve-returns`, `/customers/assess-finance-charges`, `/customers/generate-price-lists`, `/customers/generate-statements`, `/customers/individual-price-list`, `/customers/invoice-billable`, `/customers/issue-refund`… |
| `dashboard` | 1 — `/dashboard` |
| `delivery-challan` | 1 — `/delivery-challan` |
| `documents` | 1 — `/documents` |
| `extraction` | 1 — `/extraction` |
| `financial` | 13 — `/financial/advanced-intercompany-journal`, `/financial/asset-maintenance`, `/financial/chart-of-accounts`, `/financial/create-allocation-schedules`, `/financial/create-intercompany-allocation`, `/financial/fixed-assets`, `/financial/intercompany-allocation`, `/financial/intercompany-journal`… |
| `general-ledger` | 1 — `/general-ledger` |
| `goods-receipt` | 1 — `/goods-receipt` |
| `grn` | 1 — `/grn` |
| `hr` | 17 — `/hr/appraisal`, `/hr/leave/leave-application`, `/hr/leave/leave-enrollment`, `/hr/leave/leave-reinstatement`, `/hr/leave/leave-type`, `/hr/masters/asset-issue`, `/hr/masters/asset-name-list`, `/hr/masters/calendar-masters`… |
| `inventory` | 10 — `/inventory/adjust-inventory`, `/inventory/adjust-inventory-worksheet`, `/inventory/enter-transfer-orders`, `/inventory/equipment-masters`, `/inventory/intercompany-transfer`, `/inventory/items`, `/inventory`, `/inventory/replenish-location`… |
| `inventory-control` | 1 — `/inventory-control` |
| `items` | 1 — `/items` |
| `material-receipt` | 1 — `/material-receipt` |
| `notifications` | 1 — `/notifications` |
| `org-admin` | 7 — `/org-admin/approvals`, `/org-admin/dashboard`, `/org-admin/notifications`, `/org-admin/roles-permissions`, `/org-admin/sub-tenants`, `/org-admin/users`, `/org-admin/users-and-roles` |
| `organizations` | 1 — `/organizations` |
| `payables` | 6 — `/payables/approve-vendor-payments`, `/payables/bill-purchase-orders`, `/payables/enter-bills`, `/payables/enter-vendor-credits`, `/payables/enter-vendor-prepayment`, `/payables/pay-bills` |
| `payroll` | 18 — `/payroll/data-preparation/biometric-data`, `/payroll/data-preparation/manual-entry`, `/payroll/data-preparation`, `/payroll/data-preparation/yard-data`, `/payroll/others/loan-repayment`, `/payroll/processing/pay-batch`, `/payroll/processing/payee-employee`, `/payroll/processing/retroactive-payment`… |
| `payroll-management` | 1 — `/payroll-management` |
| `production` | 14 — `/production/bom`, `/production/dashboards/mep-overall`, `/production/dashboards/plant-modules`, `/production/dashboards/workshop`, `/production/drawings/project-documents`, `/production/drawings/upload`, `/production/masters/contractors`, `/production/masters/project-masters`… |
| `production-planning` | 1 — `/production-planning` |
| `products` | 4 — `/products/attributes`, `/products/categories`, `/products`, `/products/uom` |
| `project-management` | 6 — `/project-management/gantt-chart`, `/project-management/milestones`, `/project-management/project-masters`, `/project-management/reports-analytics`, `/project-management/resources`, `/project-management/tasks` |
| `projects` | 1 — `/projects` |
| `purchase-orders` | 1 — `/purchase-orders` |
| `purchases` | 6 — `/purchases/debit-note`, `/purchases/delivery-order`, `/purchases/enter-purchase-orders`, `/purchases/order-requisition`, `/purchases/purchase-requisition`, `/purchases/receive-orders` |
| `quotations` | 2 — `/quotations`, `/quotations/send` |
| `reports` | 13 — `/reports/financial/aged-payable`, `/reports/financial/aged-receivable`, `/reports/financial/balance-sheet`, `/reports/financial/cash-flow`, `/reports/financial/general-ledger`, `/reports/financial/income-statement`, `/reports/financial/transaction-detail`, `/reports/financial/trial-balance`… |
| `salary-processing` | 1 — `/salary-processing` |
| `sales` | 10 — `/sales/create-invoices`, `/sales/delivery-order`, `/sales/delivery-orders`, `/sales/enter-cash-sales`, `/sales/enter-sales-order`, `/sales/invoice-sales-order`, `/sales/issue-credit-memos`, `/sales`… |
| `sales-orders` | 1 — `/sales-orders` |
| `sales-returns` | 1 — `/sales-returns` |
| `settings` | 1 — `/settings` |
| `stock-adjustments` | 1 — `/stock-adjustments` |
| `stock-transfers` | 1 — `/stock-transfers` |
| `users` | 1 — `/users` |
| `vendor-payments` | 1 — `/vendor-payments` |
| `vendors` | 1 — `/vendors` |
| `warehouse` | 1 — `/warehouse` |
| `work-orders` | 1 — `/work-orders` |
| `workflow` | 1 — `/workflow` |

## Frontend domain components (covered via page smoke + deep flows)

| Component area | Path | Exercised by |
|----------------|------|--------------|
| Vendors wizard | `components/vendors/*` | vendors-flow + /vendors |
| Inventory transfers/adjustments | `components/inventory/*` | inventory-flow + stock pages |
| Financial ledger panels | `components/financial/*` | accounting-ar / payables |
| Approval UI | `components/approval/*` | sales/payables/crm flows |
| ERP list shell | `components/erp/erp-list-page.tsx` | most list pages |
| Org-admin permissions | `components/org-admin/permissions/*` | /org-admin/roles-permissions |
| Payroll grid | `components/payroll/*` | payroll-flow |
| Reports shell | `components/reports/*` | /reports/* pages |
| AI assistant | `components/ai-assistant/*` | /ai-assistant/* |
| Workflow graph | `components/workflow/*` | /workflow |
| Customers statement | `components/customers/*` | customers pages |
| Dashboard | `components/dashboard/*` | /dashboard |
| Shared UI atoms | `components/ui* / ui-atoms` | all pages |

## Clear error message format

- Backend: `[backend:<module>] GraphQL <query> failed: <message>`
- Frontend: `[frontend:<group>/<page>] <href> — <reason>`

