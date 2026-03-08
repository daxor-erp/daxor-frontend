import { Table as ShadTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  onRowClick?: (item: T) => void
}

export function Table<T extends { id: string }>({ data, columns, loading, onRowClick }: TableProps<T>) {
  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading...</div>
  }

  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No data available</div>
  }

  return (
    <ShadTable>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow
            key={item.id}
            onClick={() => onRowClick?.(item)}
            className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
          >
            {columns.map((col) => (
              <TableCell key={col.key}>
                {col.render ? col.render(item) : (item as any)[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </ShadTable>
  )
}
