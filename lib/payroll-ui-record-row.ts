/** Shape returned for payroll UI records from GET_PAYROLL_UI_RECORDS */
export type PayrollUiRecordQueryRow = {
  id: string
  data: string
  approvalStatus?: string | null
}

/** Merge parsed JSON payload with org-level approval from the GraphQL record */
export function withOrgApproval<T extends { approvalStatus: string }>(
  rec: PayrollUiRecordQueryRow,
  parsed: Omit<T, 'approvalStatus'>,
): T {
  return { ...parsed, approvalStatus: rec.approvalStatus ?? 'none' } as T
}
