/** Bearer token from browser session (GraphQL login stores `token` in localStorage). */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getAuthToken()
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/** Append access_token for GET links that cannot send Authorization headers. */
export function withAccessToken(url: string): string {
  const token = getAuthToken()
  if (!token) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}access_token=${encodeURIComponent(token)}`
}
