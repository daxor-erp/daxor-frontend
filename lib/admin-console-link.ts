/** Where platform / org admins return after opening ERP from their console. */
export function getAdminConsoleBackLink(
  roles: string[] | undefined | null,
): { href: string; label: string; shortLabel: string } | null {
  const r = roles ?? []
  if (r.includes('SUPER_ADMIN') || r.includes('ERP_ADMIN')) {
    return {
      href: '/admin/dashboard',
      label: 'Admin dashboard',
      shortLabel: 'Admin',
    }
  }
  if (r.includes('ORG_ADMIN')) {
    return {
      href: '/org-admin/dashboard',
      label: 'Org admin dashboard',
      shortLabel: 'Org admin',
    }
  }
  return null
}

export function isPlatformAdminRole(roles: string[] | undefined | null): boolean {
  const r = roles ?? []
  return r.includes('SUPER_ADMIN') || r.includes('ERP_ADMIN')
}
