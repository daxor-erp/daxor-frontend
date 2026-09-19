'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface ModulePermissionRow {
  moduleKey: string
  submoduleKey?: string | null
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  canView: boolean
}

export interface PackageEnabledModuleRow {
  moduleKey: string
  submoduleKey: string
}

export interface DashboardWidgetPrefs {
  hiddenWidgets: string[]
  widgetOrder: string[]
}

export interface DashboardPreferences {
  erp?: DashboardWidgetPrefs | null
  admin?: DashboardWidgetPrefs | null
  orgAdmin?: DashboardWidgetPrefs | null
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  organizationId?: string | null
  modulePermissions?: ModulePermissionRow[]
  packageEnabledModules?: PackageEnabledModuleRow[]
  dashboardPreferences?: DashboardPreferences | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User, opts?: { redirect?: boolean }) => string
  logout: () => void
  mergeUser: (partial: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function postLoginPath(roles: string[] | undefined): string {
  const r = roles ?? []
  if (r.includes('SUPER_ADMIN') || r.includes('ERP_ADMIN')) return '/admin/welcome'
  if (r.includes('ORG_ADMIN')) return '/org-admin/dashboard'
  return '/welcome'
}

function readStoredAuth(): { token: string | null; user: User | null } {
  if (typeof window === 'undefined') return { token: null, user: null }
  try {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (!storedToken || !storedUser) return { token: storedToken, user: null }
    return { token: storedToken, user: JSON.parse(storedUser) as User }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Hydrate from localStorage on the first client render so org-scoped pages
  // (dashboard KPIs, etc.) do not briefly skip queries and show all zeros.
  const [user, setUser] = useState<User | null>(() => readStoredAuth().user)
  const [token, setToken] = useState<string | null>(() => readStoredAuth().token)

  const mergeUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...partial }
      localStorage.setItem('user', JSON.stringify(next))
      return next
    })
  }, [])

  useEffect(() => {
    const stored = readStoredAuth()
    if (stored.token && stored.user) {
      setToken(stored.token)
      setUser(stored.user)
    }
  }, [])

  const login = (newToken: string, newUser: User, opts?: { redirect?: boolean }) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    const path = postLoginPath(newUser.roles)
    if (opts?.redirect !== false) {
      window.location.href = path
    }
    return path
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    // Hard redirect to fully reset Apollo cache and all React state
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, mergeUser, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
