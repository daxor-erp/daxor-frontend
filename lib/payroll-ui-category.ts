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

/** Maps payroll sidebar routes to `payrolluirecords` category (no CRM). Returns null when this screen does not use payroll UI records. */
export function payrollUiCategoryForPath(pathname: string): PayrollUiCategory | null {
  const p = pathname || ''
  if (p.includes('/payroll/processing/pay-batch')) return PAYROLL_UI_CATEGORY.PAY_BATCH
  if (p.includes('/payroll/processing/payee-employee')) return PAYROLL_UI_CATEGORY.PAYEE_EMPLOYEE
  if (p.includes('/payroll/processing/retroactive-payment')) return PAYROLL_UI_CATEGORY.RETRO_PAYMENT
  if (p.includes('/payroll/setup/pay-component')) return PAYROLL_UI_CATEGORY.PAY_COMPONENT
  if (p.includes('/payroll/setup/pay-group')) return PAYROLL_UI_CATEGORY.PAY_GROUP
  if (p.includes('/payroll/setup/employee-pf')) return PAYROLL_UI_CATEGORY.EMPLOYEE_PF
  if (p.includes('/payroll/setup/fwl-qualification')) return PAYROLL_UI_CATEGORY.FWL_QUALIFICATION
  if (p.includes('/payroll/workflow/timesheet-pool')) return PAYROLL_UI_CATEGORY.TIMESHEET_POOL
  if (p.includes('/payroll/workflow/payroll-runs')) return PAYROLL_UI_CATEGORY.PAYROLL_RUN_WORKFLOW
  if (p.includes('/payroll/statutory/cpf-age-group')) return PAYROLL_UI_CATEGORY.CPF_AGE_GROUP
  if (p.includes('/payroll/statutory/community-fund')) return PAYROLL_UI_CATEGORY.COMMUNITY_FUND
  if (p.includes('/payroll/statutory/sdl-master')) return PAYROLL_UI_CATEGORY.SDL_MASTER
  if (p.includes('/payroll/statutory/ir8a-year')) return PAYROLL_UI_CATEGORY.IR8A_YEAR
  return null
}

export function payrollUiDataString(value: unknown): string {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value ?? {})
  } catch {
    return '{}'
  }
}
