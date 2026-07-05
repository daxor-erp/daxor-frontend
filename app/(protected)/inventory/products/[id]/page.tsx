'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { GET_PRODUCT } from '@/gql/queries'
import { ProductForm } from '@/components/inventory/product-form'

export default function EditInventoryProductPage() {
  const params = useParams()
  const id = String(params?.id ?? '')
  const { user } = useAuth()
  const orgId = user?.organizationId ?? ''

  const { data, loading } = useQuery(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  })

  const product = data?.product

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading product…</div>
  }

  if (!product) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-600">Product not found.</p>
        <Link href="/inventory/products" className="mt-2 inline-block text-sm text-teal-700 hover:underline">
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Link href="/inventory/products" className="hover:text-teal-700">
          Products
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-900">{product.name}</span>
      </div>
      <ProductForm
        mode="edit"
        productId={id}
        organizationId={orgId}
        initialValues={{
          name: product.name ?? '',
          sku: product.sku ?? '',
          description: product.description ?? '',
          category: product.category ?? '',
          brand: product.brand ?? '',
          unit: product.unit ?? 'pcs',
          price: product.price?.toString() ?? '',
          costPrice: product.costPrice?.toString() ?? '',
          taxRate: product.taxRate?.toString() ?? '',
          minStockLevel: product.minStockLevel?.toString() ?? '',
          maxStockLevel: product.maxStockLevel?.toString() ?? '',
          reorderPoint: product.reorderPoint?.toString() ?? '',
          barcode: product.barcode ?? '',
          status: product.status ?? 'active',
        }}
      />
    </div>
  )
}
