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
  dashboardPreferences?: DashboardPreferences | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  mergeUser: (partial: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function postLoginPath(roles: string[] | undefined): string {
  const r = roles ?? []
  if (r.includes('SUPER_ADMIN') || r.includes('ERP_ADMIN')) return '/admin/dashboard'
  if (r.includes('ORG_ADMIN')) return '/org-admin/dashboard'
  return '/dashboard'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const mergeUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...partial }
      localStorage.setItem('user', JSON.stringify(next))
      return next
    })
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    window.location.href = postLoginPath(newUser.roles)
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
