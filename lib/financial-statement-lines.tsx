import { formatMoney } from '@/lib/format-money'

export type StatementLine = {
  accountCode: string
  accountName: string
  amount: number
}

export function StatementLinesTable({
  lines,
  emptyLabel = 'No activity',
}: {
  lines: StatementLine[]
  emptyLabel?: string
}) {
  if (!lines.length) {
    return <p className="text-sm text-muted-foreground py-4">{emptyLabel}</p>
  }
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60">
          <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-2.5 font-medium">Account</th>
            <th className="px-4 py-2.5 font-medium text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.accountCode} className="border-t hover:bg-secondary/30">
              <td className="px-4 py-2.5">
                <span className="font-mono text-xs text-muted-foreground mr-2">{l.accountCode}</span>
                {l.accountName}
              </td>
              <td className="px-4 py-2.5 text-right tabular-nums font-medium">{formatMoney(l.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
