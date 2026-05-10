'use client'

import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { InputFloating } from '@/components/ui/input-floating'
import { SelectFloating } from '@/components/ui/select-floating'
import { Button } from '@/components/ui/button'
import { CREATE_STOCK_ADJUSTMENT } from '@/gql/queries'
import { Save, Plus, Minus, ClipboardList } from 'lucide-react'
import {
  ADJ_TYPES,
  EMPTY_ADJ_FORM,
  EMPTY_ADJ_LINE,
  AdjFormState,
  AdjLineState,
  buildCreateStockAdjustmentInput,
} from '@/components/inventory/stock-adjustment-shared'

type WarehouseOpt = { id: string; warehouseName?: string; warehouseCode?: string }

type Props = {
  organizationId: string
  warehouses: WarehouseOpt[]
}

/** Physical count layout: book quantity vs counted quantity (creates a draft-style adjustment via same API). */
export function AdjustInventoryWorksheetSection({ organizationId: orgId, warehouses }: Props) {
  const [form, setForm] = useState<AdjFormState>(() => ({
    ...EMPTY_ADJ_FORM,
    adjustmentType: 'recount',
    reason: 'Physical count worksheet',
  }))
  const [lines, setLines] = useState<AdjLineState[]>(() =>
    Array.from({ length: 6 }, () => ({ ...EMPTY_ADJ_LINE })),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [saveHint, setSaveHint] = useState('')

  const [createAdj, { loading: saving }] = useMutation(CREATE_STOCK_ADJUSTMENT, {
    onCompleted: () => {
      setForm({
        ...EMPTY_ADJ_FORM,
        adjustmentType: 'recount',
        reason: 'Physical count worksheet',
      })
      setLines(Array.from({ length: 6 }, () => ({ ...EMPTY_ADJ_LINE })))
      setErrors({})
      setSaveHint('Worksheet saved as a stock adjustment. Confirm it in the Adjust inventory section on this page.')
      window.setTimeout(() => setSaveHint(''), 8000)
    },
    onError: (e) => alert(e.message),
  })

  const setF = (k: keyof AdjFormState, v: string) => {
    setForm((p) => {
      const updated = { ...p, [k]: v }
      if (k === 'warehouseId') {
        const wh = warehouses.find((w) => w.id === v)
        updated.warehouseName = wh?.warehouseName || ''
      }
      return updated
    })
    setErrors((e) => ({ ...e, [k]: '' }))
  }

  const setLine = (idx: number, k: keyof AdjLineState, v: string | number) => {
    setLines((prev) => {
      const updated = [...prev]
      const line = { ...updated[idx], [k]: v }
      if (k === 'adjustedQty' || k === 'currentQty') {
        const adj = k === 'adjustedQty' ? Number(v) : Number(line.adjustedQty)
        const cur = k === 'currentQty' ? Number(v) : Number(line.currentQty)
        line.difference = adj - cur
      }
      updated[idx] = line
      return updated
    })
  }

  const addLine = () => setLines((p) => [...p, { ...EMPTY_ADJ_LINE }])
  const removeLine = (idx: number) => setLines((p) => (p.length <= 1 ? p : p.filter((_, i) => i !== idx)))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.adjDate) e.adjDate = 'Required'
    if (!form.adjustmentType) e.adjustmentType = 'Required'
    const filled = lines.map((l, i) => ({ i, l, hasDesc: l.itemDescription.trim() !== '' }))
    const anyItem = filled.some((x) => x.hasDesc)
    if (!anyItem) e.lines = 'Enter at least one line with item description'
    filled.forEach(({ i, l, hasDesc }) => {
      const hasQty =
        Number(l.currentQty) !== 0 ||
        Number(l.adjustedQty) !== 0 ||
        (l.unit != null && String(l.unit).trim() !== '')
      if (hasQty && !hasDesc) e[`line_${i}_desc`] = 'Description required when quantities are entered'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!orgId) return
    if (!validate()) return
    const trimmed = lines.filter((l) => l.itemDescription.trim() !== '')
    const input = buildCreateStockAdjustmentInput(form, trimmed, orgId)
    createAdj({ variables: { input } })
  }

  if (!orgId) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#f3f2f1] border-b border-gray-300 text-xs text-gray-700">
        <ClipboardList className="h-4 w-4 shrink-0" />
        <span className="font-semibold">Adjust inventory worksheet</span>
        <span className="text-gray-500 hidden sm:inline">Book qty → count qty; saves as a stock adjustment</span>
      </div>
      <div className="p-4 space-y-3">
        {saveHint && (
          <p className="text-xs text-green-800 bg-green-50 border border-green-200 rounded-md px-3 py-2">{saveHint}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <InputFloating
            label="Count date *"
            type="date"
            value={form.adjDate}
            onChange={(e) => setF('adjDate', e.target.value)}
            error={errors.adjDate}
            className="h-7 text-xs"
          />
          <SelectFloating
            label="Warehouse"
            value={form.warehouseId}
            onChange={(e) => setF('warehouseId', typeof e === 'string' ? e : e.target.value)}
            options={[
              { value: '', label: 'Optional…' },
              ...warehouses.map((w) => ({
                value: w.id,
                label: w.warehouseCode ? `${w.warehouseCode} — ${w.warehouseName}` : (w.warehouseName ?? w.id),
              })),
            ]}
            className="h-7 text-xs"
          />
          <SelectFloating
            label="Adjustment type *"
            value={form.adjustmentType}
            onChange={(e) =>
              setF('adjustmentType', typeof e === 'string' ? e : e.target.value)
            }
            options={ADJ_TYPES.map((t) => ({
              value: t,
              label: t.charAt(0).toUpperCase() + t.slice(1),
            }))}
            className="h-7 text-xs"
          />
          <InputFloating
            label="Reason"
            value={form.reason}
            onChange={(e) => setF('reason', e.target.value)}
            className="h-7 text-xs"
          />
        </div>

        {errors.lines && <p className="text-xs text-red-600">{errors.lines}</p>}

        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <div
            className="min-w-[800px] grid text-xs"
            style={{
              gridTemplateColumns:
                '2rem minmax(8rem,1.2fr) 5.5rem 5.5rem 4rem 4.5rem 2rem',
            }}
          >
            <div className="px-2 py-2 font-semibold text-gray-600 bg-[#f0f0f0] border-b border-r border-gray-300">
              #
            </div>
            <div className="px-2 py-2 font-semibold text-gray-600 bg-[#f0f0f0] border-b border-r border-gray-300">
              Item / description
            </div>
            <div className="px-2 py-2 font-semibold text-gray-600 bg-[#f0f0f0] border-b border-r border-gray-300 text-right">
              Book qty
            </div>
            <div className="px-2 py-2 font-semibold text-gray-600 bg-[#f0f0f0] border-b border-r border-gray-300 text-right">
              Count qty
            </div>
            <div className="px-2 py-2 font-semibold text-gray-600 bg-[#f0f0f0] border-b border-r border-gray-300 text-right">
              Var
            </div>
            <div className="px-2 py-2 font-semibold text-gray-600 bg-[#f0f0f0] border-b border-r border-gray-300">
              Unit
            </div>
            <div className="px-2 py-2 font-semibold text-gray-600 bg-[#f0f0f0] border-b border-gray-300" />

            {lines.map((line, idx) => (
              <div key={idx} className="contents">
                <div className="border-b border-r border-gray-200 flex items-center justify-center text-gray-400 tabular-nums bg-[#fafafa]/80">
                  {idx + 1}
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    className="w-full h-8 px-2 border-0 text-xs focus:ring-1 focus:ring-blue-400 outline-none"
                    placeholder="SKU / description"
                    value={line.itemDescription}
                    onChange={(e) => setLine(idx, 'itemDescription', e.target.value)}
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    type="number"
                    className="w-full h-8 px-2 border-0 text-xs text-right tabular-nums focus:ring-1 focus:ring-blue-400 outline-none"
                    value={line.currentQty}
                    onChange={(e) => setLine(idx, 'currentQty', e.target.value)}
                  />
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    type="number"
                    className="w-full h-8 px-2 border-0 text-xs text-right tabular-nums focus:ring-1 focus:ring-blue-400 outline-none"
                    value={line.adjustedQty}
                    onChange={(e) => setLine(idx, 'adjustedQty', e.target.value)}
                  />
                </div>
                <div className="border-b border-r border-gray-200 px-2 py-1 flex items-center justify-end tabular-nums">
                  <span
                    className={
                      line.difference > 0
                        ? 'text-green-600 font-medium'
                        : line.difference < 0
                          ? 'text-red-600 font-medium'
                          : 'text-gray-500'
                    }
                  >
                    {line.difference > 0 ? '+' : ''}
                    {line.difference}
                  </span>
                </div>
                <div className="border-b border-r border-gray-200 p-0">
                  <input
                    className="w-full h-8 px-2 border-0 text-xs focus:ring-1 focus:ring-blue-400 outline-none"
                    placeholder="pcs"
                    value={line.unit}
                    onChange={(e) => setLine(idx, 'unit', e.target.value)}
                  />
                </div>
                <div className="border-b border-gray-200 flex items-center justify-center">
                  {lines.length > 1 && (
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-600 p-1"
                      onClick={() => removeLine(idx)}
                      aria-label="Remove row"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={addLine}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <Plus className="h-3.5 w-3.5" /> Add worksheet row
          </button>
          <Button
            type="button"
            size="sm"
            className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
            disabled={saving}
            onClick={handleSubmit}
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            {saving ? 'Saving…' : 'Save worksheet as adjustment'}
          </Button>
        </div>

        <InputFloating
          label="Worksheet notes"
          multiline
          rows={2}
          value={form.notes}
          onChange={(e) => setF('notes', e.target.value)}
          className="text-xs min-h-[48px]"
        />
      </div>
    </div>
  )
}
