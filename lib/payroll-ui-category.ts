/**
 * GraphQL `payrolluirecords` category values — must match backend normalization (uppercase).
 */
export const PAYROLL_UI_CATEGORY = {
  PAY_BATCH: 'PAY_BATCH',
  PAYEE_EMPLOYEE: 'PAYEE_EMPLOYEE',
  RETRO_PAYMENT: 'RETRO_PAYMENT',
  PAY_COMPONENT: 'PAY_COMPONENT',
  PAY_GROUP: 'PAY_GROUP',
  EMPLOYEE_PF: 'EMPLOYEE_PF',
  FWL_QUALIFICATION: 'FWL_QUALIFICATION',
  TIMESHEET_POOL: 'TIMESHEET_POOL',
  PAYROLL_RUN_WORKFLOW: 'PAYROLL_RUN_WORKFLOW',
  CPF_AGE_GROUP: 'CPF_AGE_GROUP',
  COMMUNITY_FUND: 'COMMUNITY_FUND',
  SDL_MASTER: 'SDL_MASTER',
  IR8A_YEAR: 'IR8A_YEAR',
} as const

export type PayrollUiCategory = (typeof PAYROLL_UI_CATEGORY)[keyof typeof PAYROLL_UI_CATEGORY]

export function payrollUiDataString(value: unknown): string {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value ?? {})
  } catch {
    return '{}'
  }
}
