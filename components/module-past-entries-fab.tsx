'use client'

import { useMutation, useQuery } from '@apollo/client'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  GET_BANK_ACCOUNTS,
  GET_CASH_BANKS,
  GET_CHART_OF_ACCOUNTS,
  GET_CLIENTS,
  GET_CUSTOMERS,
  GET_CUSTOMER_INVOICES,
  GET_DELIVERY_CHALLANS,
  GET_GENERAL_LEDGERS,
  GET_GRNS,
  GET_INVENTORY_CONTROLS,
  GET_ITEMS,
  GET_LEADS,
  GET_MATERIAL_RECEIPTS,
  GET_MODULE_WORKSPACE_RECORDS,
  GET_OPPORTUNITIES,
  GET_ORGANIZATION,
  GET_PAYROLL_MANAGEMENTS,
  GET_PAYROLL_UI_RECORDS,
  GET_PROJECTS,
  GET_PURCHASE_ORDERS,
  GET_QUOTATIONS_BY_ORGANIZATION,
  GET_SALES_ENQUIRIES,
  GET_SALES_ORDERS,
  GET_SALES_RETURNS,
  GET_VENDOR_BILLS,
  GET_VENDORS,
  GET_WAREHOUSES,
  MY_PENDING_APPROVAL_REQUESTS,
  RESOLVE_APPROVAL_REQUEST,
  SUBMIT_CUSTOMER_INVOICE_FOR_APPROVAL,
  SUBMIT_DELIVERY_CHALLAN_FOR_APPROVAL,
  SUBMIT_GRN_FOR_APPROVAL,
  SUBMIT_MATERIAL_RECEIPT_FOR_APPROVAL,
  SUBMIT_PAYROLL_MANAGEMENT_FOR_APPROVAL,
  SUBMIT_PAYROLL_UI_RECORD_FOR_APPROVAL,
  SUBMIT_PROJECT_FOR_APPROVAL,
  SUBMIT_PURCHASE_ORDER,
  SUBMIT_QUOTATION_FOR_APPROVAL,
  SUBMIT_SALES_ENQUIRY_FOR_APPROVAL,
  SUBMIT_SALES_ORDER,
  SUBMIT_SALES_RETURN_FOR_APPROVAL,
  SUBMIT_VENDOR_BILL_FOR_APPROVAL,
  SUBMIT_VENDOR_FOR_APPROVAL,
} from '@/gql/queries'
import { PastEntryApprovalCell } from '@/components/past-entry-approval-cell'
import type { ApprovalBusy } from '@/components/approval/ApprovalDropdown'
import type { PendingApprovalRow } from '@/services/approvalService'
import type { PastEntryApprovalKind } from '@/lib/past-entry-approval-registry'
import {
  pastEntryDomainsUseApprovalInbox,
  resolvePastEntryDomains,
} from '@/lib/module-past-entries-domains'
import { payrollUiCategoryForPath } from '@/lib/payroll-ui-category'
import { entityRefLabel } from '@/lib/format-status'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function parseTime(iso: string | undefined | null): number {
  if (!iso) return 0
  const t = new Date(iso).getTime()
  return Number.isNaN(t) ? 0 : t
}

type EntryRow = {
  key: string
  sourceLabel: string
  sortAt: number
  label: string
  sub?: string
  status: string
  raw: Record<string, unknown>
  snapshot?: string
  domainKind?: PastEntryApprovalKind
}

export function ModulePastEntriesFab() {
  const pathname = usePathname() ?? ''
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''
  const [open, setOpen] = useState(false)
  const [detailPreview, setDetailPreview] = useState<{ title: string; body: string } | null>(null)
  type ApprovalOp =
    | null
    | { phase: 'send'; rowKey: string }
    | { phase: 'approve' | 'reject'; rowKey: string; requestId: string }
  const [approvalOp, setApprovalOp] = useState<ApprovalOp>(null)

  const routePath = pathname || '/'
  const domains = useMemo(() => resolvePastEntryDomains(routePath), [routePath])
  const payrollUiCategory = useMemo(() => payrollUiCategoryForPath(routePath), [routePath])
  const loadApprovalInbox = useMemo(() => pastEntryDomainsUseApprovalInbox(domains), [domains])

  const skipBase = !open || !orgId

  const { data: wsData, loading: wsLoading, refetch: refetchWs } = useQuery(GET_MODULE_WORKSPACE_RECORDS, {
    variables: { organizationId: orgId, routePath, limit: 200 },
    skip: skipBase || !routePath,
    fetchPolicy: 'network-only',
  })

  const skipEnq = skipBase || !domains.has('sales_enquiries')
  const { data: enqData, loading: enqLoading, refetch: refetchEnq } = useQuery(GET_SALES_ENQUIRIES, {
    variables: { organizationId: orgId, page: 1, limit: 500 },
    skip: skipEnq,
    fetchPolicy: 'network-only',
  })

  const { data: orgForApproval } = useQuery(GET_ORGANIZATION, {
    variables: { id: orgId },
    skip: skipBase || !orgId || !loadApprovalInbox,
    fetchPolicy: 'cache-first',
  })

  const { data: pendingApprovalData, refetch: refetchPendingApprovals } = useQuery(MY_PENDING_APPROVAL_REQUESTS, {
    skip: skipBase || !loadApprovalInbox,
    fetchPolicy: 'network-only',
  })

  const skipSo = skipBase || !domains.has('sales_orders')
  const { data: soData, loading: soLoading, refetch: refetchSo } = useQuery(GET_SALES_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 300 },
    skip: skipSo,
    fetchPolicy: 'network-only',
  })

  const skipInv = skipBase || !domains.has('customer_invoices')
  const { data: invData, loading: invLoading, refetch: refetchInv } = useQuery(GET_CUSTOMER_INVOICES, {
    variables: { organizationId: orgId, page: 1, limit: 300 },
    skip: skipInv,
    fetchPolicy: 'network-only',
  })

  const skipSr = skipBase || !domains.has('sales_returns')
  const { data: srData, loading: srLoading, refetch: refetchSr } = useQuery(GET_SALES_RETURNS, {
    variables: { organizationId: String(orgId) },
    skip: skipSr,
    fetchPolicy: 'network-only',
  })

  const skipClients = skipBase || !domains.has('clients')
  const { data: clientsData, loading: clientsLoading, refetch: refetchClients } = useQuery(GET_CLIENTS, {
    variables: { organizationId: orgId, page: 1, limit: 300 },
    skip: skipClients,
    fetchPolicy: 'network-only',
  })

  const skipLeads = skipBase || !domains.has('leads')
  const { data: leadsData, loading: leadsLoading, refetch: refetchLeads } = useQuery(GET_LEADS, {
    variables: { organizationId: String(orgId) },
    skip: skipLeads,
    fetchPolicy: 'network-only',
  })

  const skipOpp = skipBase || !domains.has('opportunities')
  const { data: oppData, loading: oppLoading, refetch: refetchOpp } = useQuery(GET_OPPORTUNITIES, {
    variables: { organizationId: String(orgId), stage: undefined },
    skip: skipOpp,
    fetchPolicy: 'network-only',
  })

  const skipQuot = skipBase || !domains.has('quotations_org')
  const { data: quotData, loading: quotLoading, refetch: refetchQuot } = useQuery(GET_QUOTATIONS_BY_ORGANIZATION, {
    variables: { organizationId: orgId },
    skip: skipQuot,
    fetchPolicy: 'network-only',
  })

  const skipVendors = skipBase || !domains.has('vendors')
  const { data: vendData, loading: vendLoading, refetch: refetchVend } = useQuery(GET_VENDORS, {
    variables: { organizationId: orgId, page: 1, limit: 300 },
    skip: skipVendors,
    fetchPolicy: 'network-only',
  })

  const skipProjects = skipBase || !domains.has('projects')
  const { data: projData, loading: projLoading, refetch: refetchProj } = useQuery(GET_PROJECTS, {
    variables: { organizationId: orgId, page: 1, limit: 300 },
    skip: skipProjects,
    fetchPolicy: 'network-only',
  })

  const skipPo = skipBase || !domains.has('purchase_orders')
  const { data: poData, loading: poLoading, refetch: refetchPo } = useQuery(GET_PURCHASE_ORDERS, {
    variables: { organizationId: orgId, page: 1, limit: 300 },
    skip: skipPo,
    fetchPolicy: 'network-only',
  })

  const skipVb = skipBase || !domains.has('vendor_bills')
  const { data: vbData, loading: vbLoading, refetch: refetchVb } = useQuery(GET_VENDOR_BILLS, {
    variables: { organizationId: orgId, page: 1, limit: 300 },
    skip: skipVb,
    fetchPolicy: 'network-only',
  })

  const skipCustReg = skipBase || !domains.has('customers_registry')
  const { data: custRegData, loading: custRegLoading, refetch: refetchCustReg } = useQuery(GET_CUSTOMERS, {
    variables: { organizationId: String(orgId) },
    skip: skipCustReg,
    fetchPolicy: 'network-only',
  })

  const skipItems = skipBase || !domains.has('items_catalog')
  const { data: itemsData, loading: itemsLoading, refetch: refetchItems } = useQuery(GET_ITEMS, {
    variables: { organizationId: orgId, page: 1, limit: 300 },
    skip: skipItems,
    fetchPolicy: 'network-only',
  })

  const skipWh = skipBase || !domains.has('warehouses')
  const { data: whData, loading: whLoading, refetch: refetchWh } = useQuery(GET_WAREHOUSES, {
    variables: { organizationId: String(orgId), isActive: undefined },
    skip: skipWh,
    fetchPolicy: 'network-only',
  })

  const skipInvCtl = skipBase || !domains.has('inventory_controls')
  const { data: invCtlData, loading: invCtlLoading, refetch: refetchInvCtl } = useQuery(GET_INVENTORY_CONTROLS, {
    variables: { organizationId: String(orgId), warehouseId: undefined, stockStatus: undefined },
    skip: skipInvCtl,
    fetchPolicy: 'network-only',
  })

  const skipGl = skipBase || !domains.has('general_ledgers')
  const { data: glData, loading: glLoading, refetch: refetchGl } = useQuery(GET_GENERAL_LEDGERS, {
    variables: { organizationId: String(orgId), fiscalYear: undefined, status: undefined },
    skip: skipGl,
    fetchPolicy: 'network-only',
  })

  const skipCash = skipBase || !domains.has('cash_banks')
  const { data: cashData, loading: cashLoading, refetch: refetchCash } = useQuery(GET_CASH_BANKS, {
    variables: { organizationId: String(orgId), reconciliationStatus: undefined, bankAccount: undefined },
    skip: skipCash,
    fetchPolicy: 'network-only',
  })

  const skipCoa = skipBase || !domains.has('chart_accounts')
  const { data: coaData, loading: coaLoading, refetch: refetchCoa } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organizationId: String(orgId), accountType: undefined },
    skip: skipCoa,
    fetchPolicy: 'network-only',
  })

  const skipBankAcct = skipBase || !domains.has('bank_accounts')
  const { data: bankAcctData, loading: bankAcctLoading, refetch: refetchBankAcct } = useQuery(GET_BANK_ACCOUNTS, {
    variables: { organizationId: String(orgId) },
    skip: skipBankAcct,
    fetchPolicy: 'network-only',
  })

  const skipDc = skipBase || !domains.has('delivery_challans')
  const { data: dcData, loading: dcLoading, refetch: refetchDc } = useQuery(GET_DELIVERY_CHALLANS, {
    variables: { organizationId: String(orgId) },
    skip: skipDc,
    fetchPolicy: 'network-only',
  })

  const skipMr = skipBase || !domains.has('material_receipts')
  const { data: mrData, loading: mrLoading, refetch: refetchMr } = useQuery(GET_MATERIAL_RECEIPTS, {
    variables: { organizationId: orgId, page: 1, limit: 400, status: undefined },
    skip: skipMr,
    fetchPolicy: 'network-only',
  })

  const skipGrn = skipBase || !domains.has('grns')
  const { data: grnData, loading: grnLoading, refetch: refetchGrn } = useQuery(GET_GRNS, {
    variables: { organizationId: orgId, page: 1, limit: 400 },
    skip: skipGrn,
    fetchPolicy: 'network-only',
  })

  const skipPm = skipBase || !domains.has('payroll_managements')
  const { data: pmData, loading: pmLoading, refetch: refetchPm } = useQuery(GET_PAYROLL_MANAGEMENTS, {
    variables: { organizationId: String(orgId) },
    skip: skipPm,
    fetchPolicy: 'network-only',
  })

  const skipPui = skipBase || !domains.has('payroll_ui') || payrollUiCategory == null
  const { data: puiData, loading: puiLoading, refetch: refetchPui } = useQuery(GET_PAYROLL_UI_RECORDS, {
    variables: { organizationId: String(orgId), category: payrollUiCategory ?? 'PAY_BATCH' },
    skip: skipPui,
    fetchPolicy: 'network-only',
  })

  const handleApprovalMutationDone = () => {
    setApprovalOp(null)
    void refetchPendingApprovals()
    void refetchWs()
    if (domains.has('sales_enquiries')) void refetchEnq()
    if (domains.has('sales_orders')) void refetchSo()
    if (domains.has('customer_invoices')) void refetchInv()
    if (domains.has('sales_returns')) void refetchSr()
    if (domains.has('delivery_challans')) void refetchDc()
    if (domains.has('quotations_org')) void refetchQuot()
    if (domains.has('vendors')) void refetchVend()
    if (domains.has('projects')) void refetchProj()
    if (domains.has('purchase_orders')) void refetchPo()
    if (domains.has('vendor_bills')) void refetchVb()
    if (domains.has('material_receipts')) void refetchMr()
    if (domains.has('grns')) void refetchGrn()
    if (domains.has('payroll_managements')) void refetchPm()
    if (domains.has('payroll_ui') && payrollUiCategory != null) void refetchPui()
  }

  const onApprovalMutErr = (e: unknown) => {
    setApprovalOp(null)
    alert(e instanceof Error ? e.message : String(e))
  }

  const [submitEnquiryApproval] = useMutation(SUBMIT_SALES_ENQUIRY_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitQuotationApproval] = useMutation(SUBMIT_QUOTATION_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitSalesOrder] = useMutation(SUBMIT_SALES_ORDER, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitCustomerInvoiceApproval] = useMutation(SUBMIT_CUSTOMER_INVOICE_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitSalesReturnApproval] = useMutation(SUBMIT_SALES_RETURN_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitDeliveryChallanApproval] = useMutation(SUBMIT_DELIVERY_CHALLAN_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitVendorBillApproval] = useMutation(SUBMIT_VENDOR_BILL_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitPurchaseOrder] = useMutation(SUBMIT_PURCHASE_ORDER, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitVendorApproval] = useMutation(SUBMIT_VENDOR_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitProjectApproval] = useMutation(SUBMIT_PROJECT_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitMaterialReceiptApproval] = useMutation(SUBMIT_MATERIAL_RECEIPT_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitGrnApproval] = useMutation(SUBMIT_GRN_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitPayrollMgmtApproval] = useMutation(SUBMIT_PAYROLL_MANAGEMENT_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })
  const [submitPayrollUiApproval] = useMutation(SUBMIT_PAYROLL_UI_RECORD_FOR_APPROVAL, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })

  const [resolveApprovalRequest] = useMutation(RESOLVE_APPROVAL_REQUEST, {
    onCompleted: handleApprovalMutationDone,
    onError: onApprovalMutErr,
  })

  const pendingApprovalRows = (pendingApprovalData?.myPendingApprovalRequests ?? []) as PendingApprovalRow[]

  const triggerSubmitForKind = (kind: PastEntryApprovalKind, id: string) => {
    const v = { variables: { id } }
    switch (kind) {
      case 'sales_enquiry':
        return void submitEnquiryApproval(v)
      case 'quotation':
        return void submitQuotationApproval(v)
      case 'sales_order':
        return void submitSalesOrder(v)
      case 'customer_invoice':
        return void submitCustomerInvoiceApproval(v)
      case 'sales_return':
        return void submitSalesReturnApproval(v)
      case 'delivery_challan':
        return void submitDeliveryChallanApproval(v)
      case 'vendor_bill':
        return void submitVendorBillApproval(v)
      case 'purchase_order':
        return void submitPurchaseOrder(v)
      case 'vendor':
        return void submitVendorApproval(v)
      case 'project':
        return void submitProjectApproval(v)
      case 'material_receipt':
        return void submitMaterialReceiptApproval(v)
      case 'grn':
        return void submitGrnApproval(v)
      case 'payroll_management':
        return void submitPayrollMgmtApproval(v)
      case 'payroll_ui_record':
        return void submitPayrollUiApproval(v)
      default:
        return
    }
  }

  const mergedRows = useMemo(() => {
    const rows: EntryRow[] = []

    const workspaceRows = wsData?.moduleWorkspaceRecords ?? []
    for (const r of workspaceRows) {
      rows.push({
        key: `ws:${r.id}`,
        sourceLabel: 'Workspace',
        sortAt: parseTime(r.createdAt),
        label: String(r.title ?? 'Workspace entry'),
        sub: r.detail ? String(r.detail) : undefined,
        status: String(r.status ?? '—'),
        raw: { ...(r as Record<string, unknown>) },
        snapshot: r.snapshot ? String(r.snapshot) : undefined,
      })
    }

    if (domains.has('sales_enquiries')) {
      for (const r of enqData?.salesEnquiries ?? []) {
        const raw = { ...(r as Record<string, unknown>) }
        rows.push({
          key: `enq:${r.id}`,
          sourceLabel: 'Sales enquiry',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.enquiryNumber, r.seqNo),
          sub: r.subject ? String(r.subject) : undefined,
          status: String(r.status ?? '—'),
          raw,
          domainKind: 'sales_enquiry',
        })
      }
    }

    if (domains.has('sales_orders')) {
      for (const r of soData?.salesorders ?? []) {
        rows.push({
          key: `so:${r.id}`,
          sourceLabel: 'Sales order',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.seqNo, r.docNumber),
          sub: r.cashSale ? 'Cash sale' : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'sales_order',
        })
      }
    }

    if (domains.has('customer_invoices')) {
      for (const r of invData?.customerinvoices ?? []) {
        rows.push({
          key: `ci:${r.id}`,
          sourceLabel: 'Customer invoice',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.seqNo, r.docNumber),
          sub: r.totalAmount != null ? String(r.totalAmount) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'customer_invoice',
        })
      }
    }

    if (domains.has('sales_returns')) {
      for (const r of srData?.salesreturns ?? []) {
        rows.push({
          key: `sr:${r.id}`,
          sourceLabel: 'Sales return',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.docNumber, r.seqNo),
          sub: undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'sales_return',
        })
      }
    }

    if (domains.has('clients')) {
      for (const r of clientsData?.clients ?? []) {
        rows.push({
          key: `cl:${r.id}`,
          sourceLabel: 'Client',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.seqNo, r.name, r.docNumber),
          sub: r.company ? String(r.company) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    if (domains.has('leads')) {
      for (const r of leadsData?.leads ?? []) {
        const name = `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim()
        rows.push({
          key: `lead:${r.id}`,
          sourceLabel: 'Lead',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(name, r.seqNo, r.docNumber),
          sub: r.company ? String(r.company) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    if (domains.has('opportunities')) {
      for (const r of oppData?.opportunities ?? []) {
        rows.push({
          key: `opp:${r.id}`,
          sourceLabel: 'Opportunity',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.name, r.seqNo, r.docNumber),
          sub: r.accountName ? String(r.accountName) : undefined,
          status: String(r.stage ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    if (domains.has('quotations_org')) {
      for (const r of quotData?.quotationsByOrganization ?? []) {
        rows.push({
          key: `qt:${r.id}`,
          sourceLabel: 'Quotation',
          sortAt: parseTime(r.quotationDate),
          label: entityRefLabel(r.quotationNumber, r.seqNo),
          sub: r.subject ? String(r.subject) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'quotation',
        })
      }
    }

    if (domains.has('vendors')) {
      for (const r of vendData?.vendors ?? []) {
        rows.push({
          key: `vn:${r.id}`,
          sourceLabel: 'Vendor',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.seqNo, r.name, r.docNumber),
          sub: r.contactPerson ? String(r.contactPerson) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'vendor',
        })
      }
    }

    if (domains.has('projects')) {
      for (const r of projData?.projects ?? []) {
        rows.push({
          key: `pj:${r.id}`,
          sourceLabel: 'Project',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.seqNo, r.name, r.docNumber),
          sub: r.description ? String(r.description).slice(0, 80) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'project',
        })
      }
    }

    if (domains.has('purchase_orders')) {
      for (const r of poData?.purchaseorders ?? []) {
        rows.push({
          key: `po:${r.id}`,
          sourceLabel: 'Purchase order',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.seqNo, r.docNumber),
          sub: r.vendorName ? String(r.vendorName) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'purchase_order',
        })
      }
    }

    if (domains.has('vendor_bills')) {
      for (const r of vbData?.vendorBills ?? []) {
        rows.push({
          key: `vb:${r.id}`,
          sourceLabel: 'Vendor bill',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.billNumber, r.seqNo),
          sub: r.vendor?.name ? String(r.vendor.name) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'vendor_bill',
        })
      }
    }

    if (domains.has('delivery_challans')) {
      for (const r of dcData?.deliverychallans ?? []) {
        rows.push({
          key: `dc:${r.id}`,
          sourceLabel: 'Delivery challan',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.docNumber, r.seqNo),
          sub: undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'delivery_challan',
        })
      }
    }

    if (domains.has('material_receipts')) {
      for (const r of mrData?.materialreceipts ?? []) {
        rows.push({
          key: `mr:${r.id}`,
          sourceLabel: 'Material receipt',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.mrnNumber, r.seqNo),
          sub: r.vendorName ? String(r.vendorName) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'material_receipt',
        })
      }
    }

    if (domains.has('grns')) {
      for (const r of grnData?.grns ?? []) {
        rows.push({
          key: `grn:${r.id}`,
          sourceLabel: 'GRN',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.grnNumber, r.seqNo),
          sub: r.vendorName ? String(r.vendorName) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'grn',
        })
      }
    }

    if (domains.has('payroll_managements')) {
      for (const r of pmData?.payrollmanagements ?? []) {
        rows.push({
          key: `pm:${r.id}`,
          sourceLabel: 'Payroll management',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.docNumber, r.seqNo),
          sub: r.title ? String(r.title) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'payroll_management',
        })
      }
    }

    if (domains.has('payroll_ui')) {
      for (const r of puiData?.payrolluirecords ?? []) {
        rows.push({
          key: `pui:${r.id}`,
          sourceLabel: 'Payroll data',
          sortAt: parseTime(r.updatedAt ?? r.createdAt),
          label: entityRefLabel(r.code, r.name),
          sub: r.category ? String(r.category) : undefined,
          status: String(r.approvalStatus ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
          domainKind: 'payroll_ui_record',
        })
      }
    }

    if (domains.has('customers_registry')) {
      for (const r of custRegData?.customers ?? []) {
        rows.push({
          key: `cust:${r.id}`,
          sourceLabel: 'Customer',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.docNumber, r.name),
          sub: r.email ? String(r.email) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    if (domains.has('items_catalog')) {
      for (const r of itemsData?.items ?? []) {
        rows.push({
          key: `it:${r.id}`,
          sourceLabel: 'Item',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.seqNo, r.name, r.docNumber),
          sub: r.category ? String(r.category) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    if (domains.has('warehouses')) {
      for (const r of whData?.warehouses ?? []) {
        rows.push({
          key: `wh:${r.id}`,
          sourceLabel: 'Warehouse',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(
            r.warehouseCode ? `${r.warehouseCode} — ${r.warehouseName}` : r.warehouseName,
          ),
          sub: r.location ? String(r.location) : undefined,
          status: r.isActive ? 'active' : 'inactive',
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    if (domains.has('inventory_controls')) {
      for (const r of invCtlData?.inventoryControls ?? []) {
        rows.push({
          key: `ic:${r.id}`,
          sourceLabel: 'Inventory',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.itemName, r.itemCode),
          sub: r.binLocation ? String(r.binLocation) : undefined,
          status: String(r.stockStatus ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    if (domains.has('general_ledgers')) {
      for (const r of glData?.generalLedgers ?? []) {
        rows.push({
          key: `gl:${r.id}`,
          sourceLabel: 'General ledger',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.transactionNumber, r.seqNo),
          sub: r.description ? String(r.description).slice(0, 80) : undefined,
          status: String(r.status ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    if (domains.has('cash_banks')) {
      for (const r of cashData?.cashBanks ?? []) {
        rows.push({
          key: `cb:${r.id}`,
          sourceLabel: 'Cash / bank',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.transactionNumber, r.seqNo),
          sub: r.bankAccount ? String(r.bankAccount) : undefined,
          status: String(r.reconciliationStatus ?? '—'),
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    if (domains.has('chart_accounts')) {
      for (const r of coaData?.chartOfAccounts ?? []) {
        rows.push({
          key: `coa:${r.id}`,
          sourceLabel: 'Chart of accounts',
          sortAt: parseTime(r.createdAt),
          label: `${r.accountCode ?? ''} ${r.accountName ?? ''}`.trim() || String(r.id),
          sub: r.accountType ? String(r.accountType) : undefined,
          status: r.isActive ? 'active' : 'inactive',
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    if (domains.has('bank_accounts')) {
      for (const r of bankAcctData?.bankAccounts ?? []) {
        rows.push({
          key: `ba:${r.id}`,
          sourceLabel: 'Bank account',
          sortAt: parseTime(r.createdAt),
          label: entityRefLabel(r.accountNumber, r.accountName),
          sub: r.bankName ? String(r.bankName) : undefined,
          status: r.isActive ? 'active' : 'inactive',
          raw: { ...(r as Record<string, unknown>) },
        })
      }
    }

    return rows.sort((a, b) => b.sortAt - a.sortAt)
  }, [
    wsData,
    enqData,
    soData,
    invData,
    srData,
    clientsData,
    leadsData,
    oppData,
    quotData,
    vendData,
    projData,
    poData,
    vbData,
    custRegData,
    itemsData,
    whData,
    invCtlData,
    glData,
    cashData,
    coaData,
    bankAcctData,
    dcData,
    mrData,
    grnData,
    pmData,
    puiData,
    domains,
  ])

  const loading =
    wsLoading ||
    (!skipEnq && enqLoading) ||
    (!skipSo && soLoading) ||
    (!skipInv && invLoading) ||
    (!skipSr && srLoading) ||
    (!skipClients && clientsLoading) ||
    (!skipLeads && leadsLoading) ||
    (!skipOpp && oppLoading) ||
    (!skipQuot && quotLoading) ||
    (!skipVendors && vendLoading) ||
    (!skipProjects && projLoading) ||
    (!skipPo && poLoading) ||
    (!skipVb && vbLoading) ||
    (!skipCustReg && custRegLoading) ||
    (!skipItems && itemsLoading) ||
    (!skipWh && whLoading) ||
    (!skipInvCtl && invCtlLoading) ||
    (!skipGl && glLoading) ||
    (!skipCash && cashLoading) ||
    (!skipCoa && coaLoading) ||
    (!skipBankAcct && bankAcctLoading) ||
    (!skipDc && dcLoading) ||
    (!skipMr && mrLoading) ||
    (!skipGrn && grnLoading) ||
    (!skipPm && pmLoading) ||
    (!skipPui && puiLoading)

  const refreshAll = () => {
    void refetchWs()
    if (loadApprovalInbox) void refetchPendingApprovals()
    if (domains.has('sales_enquiries')) void refetchEnq()
    if (domains.has('sales_orders')) void refetchSo()
    if (domains.has('customer_invoices')) void refetchInv()
    if (domains.has('sales_returns')) void refetchSr()
    if (domains.has('delivery_challans')) void refetchDc()
    if (domains.has('clients')) void refetchClients()
    if (domains.has('leads')) void refetchLeads()
    if (domains.has('opportunities')) void refetchOpp()
    if (domains.has('quotations_org')) void refetchQuot()
    if (domains.has('vendors')) void refetchVend()
    if (domains.has('projects')) void refetchProj()
    if (domains.has('purchase_orders')) void refetchPo()
    if (domains.has('vendor_bills')) void refetchVb()
    if (domains.has('material_receipts')) void refetchMr()
    if (domains.has('grns')) void refetchGrn()
    if (domains.has('payroll_managements')) void refetchPm()
    if (domains.has('payroll_ui') && payrollUiCategory != null) void refetchPui()
    if (domains.has('customers_registry')) void refetchCustReg()
    if (domains.has('items_catalog')) void refetchItems()
    if (domains.has('warehouses')) void refetchWh()
    if (domains.has('inventory_controls')) void refetchInvCtl()
    if (domains.has('general_ledgers')) void refetchGl()
    if (domains.has('cash_banks')) void refetchCash()
    if (domains.has('chart_accounts')) void refetchCoa()
    if (domains.has('bank_accounts')) void refetchBankAcct()
  }

  if (!orgId) return null

  const approvalBusyForRowKey = (rowKey: string): ApprovalBusy => {
    if (!approvalOp || approvalOp.rowKey !== rowKey) return null
    if (approvalOp.phase === 'send') return 'send'
    if (approvalOp.phase === 'approve') return 'approve'
    if (approvalOp.phase === 'reject') return 'reject'
    return null
  }

  const domainHint =
    domains.size === 0
      ? 'Workspace snapshots for this route only.'
      : `Workspace snapshots plus related records for this module (${domains.size} source${domains.size === 1 ? '' : 's'}).`

  return (
    <>
      <button
        type="button"
        title="Past entries — open to view history from the database"
        aria-label="View past entries"
        className="fixed z-40 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50 right-5 top-20"
        onClick={() => {
          setOpen(true)
          refreshAll()
        }}
      >
        <Eye className="h-5 w-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[88vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Past entries</DialogTitle>
            <p className="text-xs text-muted-foreground font-normal pt-1">
              Route <span className="font-mono">{routePath}</span>. {domainHint} Rows from ERP lists show an{' '}
              <strong>Approval</strong> workflow where supported (send for approval, view status; assigned module approvers
              can approve/reject). CRM-only lists are shown without that workflow. Org admins assign approvers per module.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-auto rounded-md border min-h-[220px]">
            {loading ? (
              <p className="p-4 text-sm text-muted-foreground">Loading…</p>
            ) : mergedRows.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No entries found for this screen.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Source</TableHead>
                    <TableHead className="w-[140px]">When</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="min-w-[180px] w-[200px]">Status</TableHead>
                    <TableHead className="w-[72px] text-right">Actions</TableHead>
                    <TableHead className="w-[80px] text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mergedRows.map((r) => (
                    <TableRow key={r.key}>
                      <TableCell className="text-xs align-top">{r.sourceLabel}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap align-top">
                        {r.sortAt ? new Date(r.sortAt).toLocaleString() : '—'}
                      </TableCell>
                      <TableCell className="text-xs align-top">
                        <div className="font-medium text-slate-900">{r.label}</div>
                        {r.sub ? <div className="text-muted-foreground mt-0.5 line-clamp-2">{r.sub}</div> : null}
                      </TableCell>
                      <TableCell className="text-xs align-top">
                        {r.domainKind ? (
                          <PastEntryApprovalCell
                            kind={r.domainKind}
                            raw={r.raw}
                            userId={user?.id}
                            moduleApprovers={orgForApproval?.organization?.moduleApprovers}
                            pendingRows={pendingApprovalRows}
                            busy={approvalBusyForRowKey(r.key)}
                            onSendForApproval={() => {
                              setApprovalOp({ phase: 'send', rowKey: r.key })
                              triggerSubmitForKind(r.domainKind!, String(r.raw.id))
                            }}
                            onApprove={(requestId) => {
                              setApprovalOp({ phase: 'approve', rowKey: r.key, requestId })
                              void resolveApprovalRequest({
                                variables: { id: requestId, decision: 'APPROVED' },
                              })
                            }}
                            onReject={(requestId) => {
                              setApprovalOp({ phase: 'reject', rowKey: r.key, requestId })
                              void resolveApprovalRequest({
                                variables: { id: requestId, decision: 'REJECTED' },
                              })
                            }}
                          />
                        ) : (
                          <StatusBadge status={r.status} />
                        )}
                      </TableCell>
                      <TableCell className="text-right align-top">—</TableCell>
                      <TableCell className="text-right align-top">
                        {r.snapshot ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              setDetailPreview({
                                title: 'Workspace snapshot',
                                body: (() => {
                                  try {
                                    return JSON.stringify(JSON.parse(r.snapshot!), null, 2)
                                  } catch {
                                    return r.snapshot!
                                  }
                                })(),
                              })
                            }
                          >
                            View
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              setDetailPreview({
                                title: r.label,
                                body: JSON.stringify(r.raw, null, 2),
                              })
                            }
                          >
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailPreview != null} onOpenChange={(o) => !o && setDetailPreview(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{detailPreview?.title ?? 'Details'}</DialogTitle>
          </DialogHeader>
          <pre className="text-[11px] rounded border bg-slate-50 p-3 overflow-auto max-h-[55vh] whitespace-pre-wrap">
            {detailPreview?.body ?? ''}
          </pre>
          <Button type="button" variant="outline" size="sm" onClick={() => setDetailPreview(null)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
