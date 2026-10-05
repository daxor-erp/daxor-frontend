import { toast } from 'sonner'

/** Pull the real GraphQL / network error text (avoids generic "status code 400"). */
export function apolloErrorMessage(error: unknown): string {
  const e = error as {
    message?: string
    graphQLErrors?: Array<{ message?: string }>
    networkError?: { result?: { errors?: Array<{ message?: string }> }; message?: string }
  } | null

  return (
    e?.graphQLErrors?.[0]?.message ||
    e?.networkError?.result?.errors?.[0]?.message ||
    e?.networkError?.message ||
    e?.message ||
    'Something went wrong'
  )
}

export function toastApolloError(error: unknown) {
  toast.error(apolloErrorMessage(error))
}

export function toastSuccess(message: string) {
  toast.success(message)
}
