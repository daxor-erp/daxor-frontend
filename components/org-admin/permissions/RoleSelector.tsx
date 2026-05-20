'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type UserPermissionSelectorProps = {
  users: Array<{ id: string; email: string; firstName: string; lastName: string }>
  value: string
  onChange: (userId: string) => void
  disabled?: boolean
  loading?: boolean
}

/** Org-admin matrix: pick which user receives submodule permissions (not a DB “role” template). */
export function UserPermissionSelector({
  users,
  value,
  onChange,
  disabled,
  loading,
}: UserPermissionSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">User</p>
      <Select value={value || undefined} onValueChange={onChange} disabled={disabled || loading}>
        <SelectTrigger className="w-full max-w-md bg-slate-900/60 border-slate-600 text-slate-100">
          <SelectValue placeholder={loading ? 'Loading users…' : 'Select a user'} />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700">
          {users.map((u) => (
            <SelectItem key={u.id} value={u.id} className="text-slate-100 focus:bg-slate-800">
              {u.firstName} {u.lastName} ({u.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { UserPermissionSelector as RoleSelector }
