export type SubmoduleCell = {
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  canView: boolean
}

export function permKey(moduleKey: string, submoduleKey: string) {
  return `${moduleKey}::${submoduleKey}`
}
