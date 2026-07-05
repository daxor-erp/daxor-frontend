'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ProductForm } from '@/components/inventory/product-form'

export default function NewInventoryProductPage() {
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Link href="/inventory/products" className="hover:text-teal-700">
          Products
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-900">New</span>
      </div>
      <ProductForm mode="create" organizationId={orgId} />
    </div>
  )
}
