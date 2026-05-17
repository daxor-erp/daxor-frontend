'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AiPaneContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const AiPaneContext = createContext<AiPaneContextType | undefined>(undefined)

export function AiPaneProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('daxor:aipane:open')
      if (saved === '1') setIsOpen(true)
    } catch (e) {}
  }, [])

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem('daxor:aipane:open', isOpen ? '1' : '0')
    } catch (e) {}
  }, [isOpen])

  return (
    <AiPaneContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AiPaneContext.Provider>
  )
}

export function useAiPane() {
  const context = useContext(AiPaneContext)
  if (context === undefined) {
    throw new Error('useAiPane must be used within an AiPaneProvider')
  }
  return context
}
