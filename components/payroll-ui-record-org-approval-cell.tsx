'use client'

import { useMutation } from '@apollo/client'
import { SUBMIT_PAYROLL_UI_RECORD_FOR_APPROVAL } from '@/gql/queries'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function badgeCls(st: string) {
  switch (st) {
    case 'pending':
      return 'bg-amber-50 text-amber-900 border-amber-200'
    case 'approved':
      return 'bg-emerald-50 text-emerald-900 border-emerald-200'
    case 'declined':
      return 'bg-red-50 text-red-900 border-red-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

function labelFor(st: string) {
  switch (st) {
    case 'none':
      return 'Draft'
    case 'pending':
      return 'Pending approval'
    case 'approved':
      return 'Approved'
    case 'declined':
      return 'Declined'
    default:
      return st
  }
}

type Props = {
  recordId: string
  approvalStatus: string
  onCompleted?: () => void
  disabled?: boolean
  className?: string
}

export function PayrollUiRecordOrgApprovalCell({
  recordId,
  approvalStatus,
  onCompleted,
  disabled,
  className,
}: Props) {
  const st = (approvalStatus || 'none').toLowerCase()
  const [submitMut, { loading }] = useMutation(SUBMIT_PAYROLL_UI_RECORD_FOR_APPROVAL, {
    onCompleted: () => onCompleted?.(),
  })

  const showSubmit = st === 'none' || st === 'declined'

  return (
    <div className={cn('flex flex-col gap-1 min-w-[132px]', className)}>
      <Badge variant="outline" className={badgeCls(st)}>
        {labelFor(st)}
      </Badge>
      {showSubmit ? (
        <select
          aria-label="Organization approval action"
          className="h-7 text-xs rounded-md border border-input bg-background px-2 max-w-[160px]"
          disabled={disabled || loading}
          defaultValue=""
          onChange={(e) => {
            const v = e.target.value
            e.target.value = ''
            if (v === 'submit') void submitMut({ variables: { id: recordId } })
          }}
        >
          <option value="">Change status…</option>
          <option value="submit">Send for approval</option>
        </select>
      ) : null}
    </div>
  )
}
