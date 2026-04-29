/** Minimal CSV read/write for payroll prep sheets (commas, quotes, newlines). */

export function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export function rowsToCsv(headers: string[], rows: string[][]): string {
  const all = [headers, ...rows]
  return all.map((line) => line.map(escapeCsvField).join(',')).join('\r\n')
}

export function parseCsv(text: string): string[][] {
  const res: string[][] = []
  let row: string[] = []
  let i = 0
  let field = ''
  let inQuotes = false
  const pushField = () => {
    row.push(field)
    field = ''
  }
  const pushRow = () => {
    if (row.length > 0 && row.some((c) => c.length > 0)) res.push(row)
    row = []
  }
  while (i < text.length) {
    const c = text[i]!
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += c
      i++
      continue
    }
    if (c === '"') {
      inQuotes = true
      i++
      continue
    }
    if (c === ',') {
      pushField()
      i++
      continue
    }
    if (c === '\n') {
      pushField()
      pushRow()
      i++
      continue
    }
    if (c === '\r') {
      if (text[i + 1] === '\n') {
        i += 2
      } else {
        i++
      }
      pushField()
      pushRow()
      continue
    }
    field += c
    i++
  }
  pushField()
  pushRow()
  return res
}
