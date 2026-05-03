export const ADJ_TYPES = ['recount', 'increase', 'decrease', 'write-off'] as const

export const EMPTY_ADJ_FORM = {
  adjDate: new Date().toISOString().split('T')[0],
  warehouseId: '',
  warehouseName: '',
  adjustmentType: 'recount',
  reason: '',
  notes: '',
}

export const EMPTY_ADJ_LINE = {
  itemDescription: '',
  currentQty: 0,
  adjustedQty: 0,
  difference: 0,
  unit: '',
}

export type AdjFormState = typeof EMPTY_ADJ_FORM
export type AdjLineState = typeof EMPTY_ADJ_LINE

export function formatAdjDate(value: string | null | undefined): string {
  if (value == null || value === '') return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
}

export function buildCreateStockAdjustmentInput(
  form: AdjFormState,
  lines: AdjLineState[],
  orgId: string,
): Record<string, unknown> {
  const input: Record<string, unknown> = {
    adjDate: form.adjDate,
    adjustmentType: form.adjustmentType,
    organizationId: orgId,
    lineItems: lines.map((l) => ({
      itemDescription: l.itemDescription.trim(),
      currentQty: Number(l.currentQty),
      adjustedQty: Number(l.adjustedQty),
      difference: Number(l.adjustedQty) - Number(l.currentQty),
      ...(l.unit?.trim() ? { unit: l.unit.trim() } : {}),
    })),
  }
  if (form.reason.trim()) input.reason = form.reason.trim()
  if (form.notes.trim()) input.notes = form.notes.trim()
  if (form.warehouseId) {
    input.warehouseId = form.warehouseId
    const name = form.warehouseName?.trim()
    if (name) input.warehouseName = name
  }
  return input
}
