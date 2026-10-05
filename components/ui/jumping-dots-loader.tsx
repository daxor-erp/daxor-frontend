'use client'

import { cn } from '@/lib/utils'

const ACCENT = '#378ADD'

/** Four jumping dots loader in brand blue (#378ADD). */
export function JumpingDotsLoader({
  className,
  size = 'md',
  label = 'Loading',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}) {
  const dot =
    size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'
  const gap = size === 'sm' ? 'gap-1.5' : size === 'lg' ? 'gap-2.5' : 'gap-2'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn('inline-flex items-center', gap, className)}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn('jumping-dot rounded-full', dot)}
          style={{
            backgroundColor: ACCENT,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  )
}

/** Full-screen overlay used during app / tab navigation. */
export function JumpingDotsOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-[2px]"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-10 py-8 shadow-[0_12px_40px_-12px_rgba(55,138,221,0.35)]">
        <JumpingDotsLoader size="lg" label="Opening app" />
        <p className="text-sm font-medium text-slate-600">Opening…</p>
      </div>
    </div>
  )
}
