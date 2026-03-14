'use client'

import { ReactNode } from 'react'

interface PageTemplateProps {
  title: string
  description: string
  children?: ReactNode
}

export function PageTemplate({ title, description, children }: PageTemplateProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default PageTemplate
