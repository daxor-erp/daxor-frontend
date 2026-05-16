'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Bell, ClipboardCheck, LogOut, Search, Settings, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { MY_PENDING_APPROVAL_REQUESTS, RESOLVE_APPROVAL_REQUEST, GET_ORGANIZATION } from '@/gql/queries'

function moduleLabel(moduleKey: string) {
	const map: Record<string, string> = {
		purchases: 'Purchases',
		sales: 'Sales',
		crm: 'CRM',
		quotations: 'Quotations',
		payables: 'Payables',
		inventory: 'Inventory',
		products: 'Products',
		financial: 'Financial',
		payroll: 'Payroll',
		hr: 'HR',
		customers: 'Customers',
		banks: 'Banks',
		reports: 'Reports',
	}
	return map[moduleKey] ?? moduleKey
}

function entityLabel(entityType: string) {
	const map: Record<string, string> = {
		PURCHASE_ORDER: 'Purchase order',
		SALES_ORDER: 'Sales order',
		MODULE_WORKSPACE_RECORD: 'Page workspace item',
		QUOTATION: 'Quotation',
		CUSTOMER_INVOICE: 'Customer invoice',
		SALES_ENQUIRY: 'Sales enquiry',
		LEAD: 'CRM lead',
		PAYROLL_UI_RECORD: 'Payroll record',
		PAYROLL_MANAGEMENT: 'Payroll management',
		VENDOR_BILL: 'Vendor bill',
		VENDOR: 'Vendor',
		PROJECT: 'Project',
		SALES_RETURN: 'Sales return',
		DELIVERY_CHALLAN: 'Delivery challan',
		GRN: 'GRN',
		MATERIAL_RECEIPT: 'Material receipt',
	}
	return map[entityType] ?? entityType
}

export function ErpAppHeader() {
	const { user, logout } = useAuth()
	const [showProfile, setShowProfile] = useState(false)
	const [inboxOpen, setInboxOpen] = useState(false)
	const [noteById, setNoteById] = useState<Record<string, string>>({})
	const [resolvingId, setResolvingId] = useState<string | null>(null)

	const orgId = user?.organizationId ?? ''

	const { data: orgData, loading: orgApproversLoading } = useQuery(GET_ORGANIZATION, {
		variables: { id: orgId },
		skip: !orgId,
		fetchPolicy: 'cache-and-network',
	})

	const isDesignatedApprover = useMemo(() => {
		const uid = user?.id
		if (!uid) return false
		const rows = orgData?.organization?.moduleApprovers ?? []
		return rows.some(
			(r: { approverUserId?: string | null }) =>
				r.approverUserId != null && r.approverUserId !== '' && String(r.approverUserId) === String(uid),
		)
	}, [orgData?.organization?.moduleApprovers, user?.id])

	const showApprovalsInbox =
		Boolean(orgId) && !orgApproversLoading && isDesignatedApprover

	useEffect(() => {
		if (!showApprovalsInbox) setInboxOpen(false)
	}, [showApprovalsInbox])

	const { data, loading, refetch } = useQuery(MY_PENDING_APPROVAL_REQUESTS, {
		fetchPolicy: 'network-only',
		pollInterval: showApprovalsInbox ? 45_000 : 0,
		skip: !showApprovalsInbox,
	})

	const [resolveApproval] = useMutation(RESOLVE_APPROVAL_REQUEST, {
		onCompleted: () => refetch(),
		onError: (e) => alert(e.message),
	})

	const rows = data?.myPendingApprovalRequests ?? []
	const badgeCount = rows.length

	const sortedRows = useMemo(
		() =>
			[...rows].sort((a: { createdAt?: string }, b: { createdAt?: string }) =>
				String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')),
			),
		[rows],
	)

	const resolve = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
		setResolvingId(id)
		try {
			await resolveApproval({
				variables: {
					id,
					decision,
					note: noteById[id]?.trim() || undefined,
				},
			})
			setNoteById((p) => {
				const n = { ...p }
				delete n[id]
				return n
			})
		} finally {
			setResolvingId(null)
		}
	}

	return (
		<header className="shrink-0 border-b bg-white px-6 py-3 flex items-center justify-between z-30">
				<div className="flex items-center gap-6 min-w-[12rem]">
					<div className="text-lg font-semibold text-gray-800">
						Welcome, <span className="text-blue-600">{user?.firstName || 'User'}</span>
					</div>
				</div>

				<div className="flex-1 flex justify-center max-w-2xl mx-auto">
					<div className="relative w-full">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="search"
							placeholder="Search..."
							className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<div className="flex items-center gap-1 sm:gap-2">
					{showApprovalsInbox ? (
					<Sheet open={inboxOpen} onOpenChange={setInboxOpen}>
						<SheetTrigger asChild>
							<button
								type="button"
								className="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
								aria-label="Approvals inbox"
								title="Approvals"
							>
								<ClipboardCheck className="h-5 w-5 text-gray-600" />
								{badgeCount > 0 ? (
									<span className="absolute right-1 top-1 inline-flex min-h-[0.625rem] min-w-[0.625rem] items-center justify-center rounded-full bg-amber-500 px-[3px] text-[10px] font-semibold leading-none text-white shadow-sm">
										{badgeCount > 9 ? '9+' : badgeCount}
									</span>
								) : null}
							</button>
						</SheetTrigger>
						<SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
							<div className="border-b px-6 py-4">
								<SheetHeader className="p-0 space-y-1 text-left">
									<SheetTitle>Approvals inbox</SheetTitle>
									<p className="text-xs font-normal text-muted-foreground">
										Requests sent for approval by your teammates. Approved or declined status updates immediately in each module&apos;s rows.
									</p>
								</SheetHeader>
								<p className="mt-3 text-[11px] text-muted-foreground">
									You are the designated approver for these modules according to Organization admin routing.
								</p>
							</div>
							<div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
								{loading ? (
									<p className="text-sm text-muted-foreground px-2">Loading requests…</p>
								) : sortedRows.length === 0 ? (
									<div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-4 py-12 text-center text-sm text-muted-foreground">
										No pending approval requests right now.
									</div>
								) : (
									sortedRows.map((r: { id: string; title?: string | null; moduleKey?: string; entityType?: string; requesterDisplayName?: string | null; createdAt?: string }) => (
										<div key={r.id} className="rounded-lg border border-gray-200 bg-card p-4 shadow-sm space-y-3">
											<div className="flex flex-wrap items-start justify-between gap-2">
												<p className="text-sm font-semibold text-gray-900 leading-snug pr-4">{r.title ?? 'Approval request'}</p>
												<span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-900 border border-amber-200">
													Awaiting approval
												</span>
											</div>
											<dl className="grid gap-1 text-xs text-muted-foreground">
												<div className="flex gap-2">
													<dt className="font-medium text-gray-500">Module</dt>
													<dd className="text-gray-700">{moduleLabel(String(r.moduleKey ?? ''))}</dd>
												</div>
												<div className="flex gap-2">
													<dt className="font-medium text-gray-500">Type</dt>
													<dd className="text-gray-700">{entityLabel(String(r.entityType ?? ''))}</dd>
												</div>
												{r.requesterDisplayName ? (
													<div className="flex gap-2">
														<dt className="font-medium text-gray-500">Requested by</dt>
														<dd className="text-gray-700">{r.requesterDisplayName}</dd>
													</div>
												) : null}
												{r.createdAt ? (
													<div className="flex gap-2">
														<dt className="font-medium text-gray-500">Sent</dt>
														<dd className="text-gray-700">{new Date(r.createdAt).toLocaleString()}</dd>
													</div>
												) : null}
											</dl>
											<div className="space-y-1.5">
												<label className="text-xs font-medium text-gray-600" htmlFor={`note-${r.id}`}>
													Note for requester <span className="text-gray-400 font-normal">(optional)</span>
												</label>
												<Textarea
													id={`note-${r.id}`}
													rows={2}
													placeholder="e.g. reason for declining or approval comment"
													className="resize-none text-sm"
													value={noteById[r.id] ?? ''}
													onChange={(e) =>
														setNoteById((prev) => ({ ...prev, [r.id]: e.target.value }))
													}
												/>
											</div>
											<div className="flex flex-wrap gap-2 pt-1">
												<Button
													type="button"
													size="sm"
													disabled={resolvingId === r.id}
													className="bg-emerald-600 hover:bg-emerald-700 text-white"
													onClick={() => resolve(r.id, 'APPROVED')}
												>
													Approve
												</Button>
												<Button
													type="button"
													size="sm"
													variant="outline"
													className="border-red-300 text-red-700 hover:bg-red-50"
													disabled={resolvingId === r.id}
													onClick={() => resolve(r.id, 'REJECTED')}
												>
													Decline
												</Button>
											</div>
										</div>
									))
								)}
							</div>
						</SheetContent>
					</Sheet>
					) : null}

					<button type="button" className="relative rounded-lg p-2 transition-colors hover:bg-gray-100" aria-label="Notifications">
						<Bell className="h-5 w-5 text-gray-600" />
						<span className="absolute right-2 top-1.5 inline-block h-2 w-2 rounded-full bg-red-500" />
					</button>

					<button type="button" className="rounded-lg p-2 transition-colors hover:bg-gray-100">
						<Settings className="h-5 w-5 text-gray-600" />
					</button>

					<div className="relative">
						<button
							type="button"
							onClick={() => setShowProfile(!showProfile)}
							className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-gray-100"
						>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
								<User className="h-4 w-4" />
							</div>
							<ChevronDown className="h-4 w-4 text-gray-600" />
						</button>
						{showProfile && (
							<div className="absolute right-0 mt-2 z-50 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
								<button
									type="button"
									onClick={() => logout()}
									className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-50"
								>
									<LogOut className="h-4 w-4" />
									Log out
								</button>
							</div>
						)}
					</div>
				</div>
			</header>
	)
}
