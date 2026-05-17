'use client'

import { useMemo, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, RotateCcw } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useDashboardPreferences } from '@/hooks/use-dashboard-preferences'
import {
  type DashboardKey,
  type WidgetCategory,
  type WidgetDef,
  getManifest,
} from '@/lib/dashboard-manifest'
import { cn } from '@/lib/utils'

const CATEGORY_LABELS: Record<WidgetCategory, string> = {
  heroCta: 'Hero call-to-action buttons',
  kpi: 'KPI / stat cards',
  section: 'Charts, tables & sections',
}

const CATEGORY_DESCRIPTIONS: Record<WidgetCategory, string> = {
  heroCta: 'Quick action buttons shown at the top of the dashboard.',
  kpi: 'Toggle which summary tiles appear and drag to reorder.',
  section: 'Toggle which charts, tables and widget cards appear and drag to reorder.',
}

function SortableRow({
  widget,
  isVisible,
  onToggle,
}: {
  widget: WidgetDef
  isVisible: boolean
  onToggle: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 rounded-lg border bg-card px-3 py-2',
        isDragging && 'shadow-lg ring-1 ring-primary/40',
      )}
    >
      <button
        type="button"
        className="cursor-grab text-muted-foreground hover:text-foreground touch-none"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className={cn('flex-1 text-sm', !isVisible && 'text-muted-foreground')}>
        {widget.label}
      </span>
      <Switch checked={isVisible} onCheckedChange={() => onToggle(widget.id)} />
    </div>
  )
}

function CategoryList({
  dashboardKey,
  category,
}: {
  dashboardKey: DashboardKey
  category: WidgetCategory
}) {
  const manifest = getManifest(dashboardKey)
  const prefs = useDashboardPreferences(dashboardKey)
  const categoryWidgets = useMemo(
    () => manifest.widgets.filter((w) => w.category === category),
    [manifest, category],
  )

  // Build the list in saved order, appending any not-yet-in-order items.
  const orderedIds = useMemo(() => {
    const inCat = new Set(categoryWidgets.map((w) => w.id))
    const fromSaved = prefs.widgetOrder.filter((id) => inCat.has(id))
    const seen = new Set(fromSaved)
    for (const w of categoryWidgets) {
      if (!seen.has(w.id)) fromSaved.push(w.id)
    }
    return fromSaved
  }, [prefs.widgetOrder, categoryWidgets])

  const byId = useMemo(
    () => new Map(categoryWidgets.map((w) => [w.id, w])),
    [categoryWidgets],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = orderedIds.indexOf(String(active.id))
    const newIndex = orderedIds.indexOf(String(over.id))
    if (oldIndex < 0 || newIndex < 0) return
    const next = arrayMove(orderedIds, oldIndex, newIndex)
    prefs.setCategoryOrder(category, next)
  }

  if (categoryWidgets.length === 0) return null

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold">{CATEGORY_LABELS[category]}</p>
        <p className="text-xs text-muted-foreground">{CATEGORY_DESCRIPTIONS[category]}</p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {orderedIds.map((id) => {
              const w = byId.get(id)
              if (!w) return null
              return (
                <SortableRow
                  key={id}
                  widget={w}
                  isVisible={prefs.isVisible(id)}
                  onToggle={prefs.toggleVisible}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export function DashboardCustomizationCard({
  availableDashboards,
}: {
  availableDashboards: { key: DashboardKey; label: string }[]
}) {
  const [activeKey, setActiveKey] = useState<DashboardKey>(availableDashboards[0]?.key ?? 'erp')
  const prefs = useDashboardPreferences(activeKey)

  if (availableDashboards.length === 0) return null

  return (
    <div className="space-y-4">
      {availableDashboards.length > 1 && (
        <div className="flex flex-wrap gap-1.5 rounded-lg border bg-secondary/40 p-1">
          {availableDashboards.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setActiveKey(d.key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                activeKey === d.key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      <CategoryList dashboardKey={activeKey} category="heroCta" />
      <CategoryList dashboardKey={activeKey} category="kpi" />
      <CategoryList dashboardKey={activeKey} category="section" />

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          {prefs.saving ? 'Saving…' : 'Changes save automatically to your account.'}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => prefs.reset()}
          className="gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to defaults
        </Button>
      </div>
    </div>
  )
}
