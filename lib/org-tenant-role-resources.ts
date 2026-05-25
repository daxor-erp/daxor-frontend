import { RESOURCES } from '@/lib/rbac/permissions'

const FORBIDDEN = new Set<string>([
  RESOURCES.USER,
  RESOURCES.ROLE,
  RESOURCES.PERMISSION,
  RESOURCES.AUDIT_LOG,
  RESOURCES.ORGANIZATION,
])

/** Frontend lists this resource, but API RBAC does not define it yet — omit from tenant role editor to avoid save errors. */
const RESOURCES_NOT_IN_API_YET = new Set<string>(['intercompany_transfer'])

function labelForResource(resource: string): string {
  return resource
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Resources org admins may grant on tenant-defined roles (must match API allowlist). */
export const ORG_TENANT_ROLE_RESOURCE_OPTIONS: ReadonlyArray<{ resource: string; label: string }> =
  Object.values(RESOURCES)
    .filter((r) => !FORBIDDEN.has(r) && !RESOURCES_NOT_IN_API_YET.has(r))
    .sort((a, b) => labelForResource(a).localeCompare(labelForResource(b)))
    .map((resource) => ({ resource, label: labelForResource(resource) }))
