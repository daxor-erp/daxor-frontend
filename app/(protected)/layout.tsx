'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Building2, Users, Package, Truck, FolderKanban, 
  ShoppingCart, FileText, Receipt, Clock, LayoutDashboard 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Organizations', href: '/organizations', icon: Building2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Items', href: '/items', icon: Package },
  { name: 'Vendors', href: '/vendors', icon: Truck },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
  { name: 'Sales Orders', href: '/sales-orders', icon: FileText },
  { name: 'Customer Invoices', href: '/customer-invoices', icon: Receipt },
  { name: 'Attendance', href: '/attendance', icon: Clock },
]

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Daxor ERP</h1>
          <p className="text-sm text-muted-foreground">{user?.firstName}</p>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button variant="ghost" className="w-full justify-start">
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button onClick={logout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
