'use client'

import { ReactNode } from 'react'
import { ErpListPage, ErpPageHeader } from '@/components/erp/erp-list-page'

interface PageTemplateProps {
  title: string
  description: string
  children?: ReactNode
}

export function PageTemplate({ title, description, children }: PageTemplateProps) {
  return (
    <ErpListPage>
      <ErpPageHeader title={title} description={description} />
      <div className="min-w-0 [&_table]:min-w-max [&_.table-wrap]:overflow-x-auto">{children}</div>
    </ErpListPage>
  )
}

export default PageTemplate
