// Tampa Bay is the only market this business operates in, so bookings are
// always grouped onto the calendar by Eastern local date — not server UTC —
// or a pickup near midnight could render on the wrong day depending on
// where the serverless function happens to run.
const TIMEZONE = 'America/New_York'

export function toETDateKey(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: TIMEZONE })
}

export function todayETDateKey(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: TIMEZONE })
}

export interface CalendarCell {
  day: number
  dateKey: string // YYYY-MM-DD
}

// year/month are calendar values (month is 1-indexed, matching URL params).
export function buildMonthGrid(year: number, month: number): (CalendarCell | null)[] {
  const firstOfMonth = new Date(year, month - 1, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells: (CalendarCell | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    cells.push({ day: d, dateKey: `${year}-${mm}-${dd}` })
  }
  return cells
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
