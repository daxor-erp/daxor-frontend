import { ApolloError } from '@apollo/client'

/** GraphQL / network messages suitable for users (permissions, validation). */
export function formatApolloUserMessage(error: unknown): string {
  if (error instanceof ApolloError) {
    const gqlMsgs = error.graphQLErrors?.map((e) => e.message).filter(Boolean)
    if (gqlMsgs?.length) return gqlMsgs.join(' ')
    if (error.networkError && 'message' in error.networkError) {
      return String((error.networkError as Error).message)
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return String(error)
}

/** True when API denied the operation for ACL / auth reasons. */
export function isLikelyPermissionOrAuthDenial(message: string): boolean {
  const m = message.toLowerCase()
  return (
    m.includes('permission') ||
    m.includes('authorised') ||
    m.includes('authorized') ||
    m.includes('forbidden') ||
    m.includes('not authorised') ||
    m.includes('not authorized')
  )
}

/** Prefer backend wording; normalize graphql-shield “Not Authorised!” for mutations. */
export function friendlyMutationDeniedMessage(error: unknown): string {
  const raw = formatApolloUserMessage(error).trim()
  if (!raw) return "You don't have permission to perform this action."
  if (raw.toLowerCase().includes('sufficient permission')) return raw
  if (isLikelyPermissionOrAuthDenial(raw)) {
    if (raw.toLowerCase().includes('not authorised') || raw.toLowerCase().includes('not authorized')) {
      return "You don't have permission to perform this action."
    }
    return raw
  }
  return raw
}
