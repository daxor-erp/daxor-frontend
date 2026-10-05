'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from 'react'
import { usePathname } from 'next/navigation'
import { JumpingDotsOverlay } from '@/components/ui/jumping-dots-loader'

type RouteTransitionContextValue = {
  isNavigating: boolean
  /** Call when the user starts navigating to another module / tab. */
  startNavigation: (href?: string) => void
}

const RouteTransitionContext = createContext<RouteTransitionContextValue>({
  isNavigating: false,
  startNavigation: () => {},
})

export function useRouteTransition() {
  return useContext(RouteTransitionContext)
}

const MAX_MS = 12_000

function RouteTransitionInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingPathRef = useRef<string | null>(null)

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const stopNavigation = useCallback(() => {
    clearTimer()
    pendingPathRef.current = null
    setIsNavigating(false)
  }, [])

  const startNavigation = useCallback(
    (href?: string) => {
      if (href) {
        try {
          const url = new URL(href, typeof window !== 'undefined' ? window.location.origin : 'http://local')
          if (url.pathname === pathname) return
          pendingPathRef.current = url.pathname
        } catch {
          pendingPathRef.current = href
        }
      } else {
        pendingPathRef.current = null
      }
      setIsNavigating(true)
      clearTimer()
      timerRef.current = setTimeout(stopNavigation, MAX_MS)
    },
    [pathname, stopNavigation],
  )

  // Hide loader once the route has changed.
  useEffect(() => {
    if (!isNavigating) return
    stopNavigation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => () => clearTimer(), [])

  const value = useMemo(
    () => ({ isNavigating, startNavigation }),
    [isNavigating, startNavigation],
  )

  return (
    <RouteTransitionContext.Provider value={value}>
      {children}
      <JumpingDotsOverlay visible={isNavigating} />
    </RouteTransitionContext.Provider>
  )
}

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <RouteTransitionInner>{children}</RouteTransitionInner>
    </Suspense>
  )
}
