'use client'

import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { ApolloPermissionRejectionBridge } from '@/components/apollo-permission-rejection-bridge'
import { apolloClient } from '@/utils/apollo-client'
import { AuthProvider } from '@/contexts/AuthContext'
import { AiPaneProvider } from '@/contexts/AiPaneContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ApolloPermissionRejectionBridge />
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <AiPaneProvider>
            {children}
            <Toaster />
          </AiPaneProvider>
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}
