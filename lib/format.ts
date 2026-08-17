export function formatCurrency(n: number | string | null | undefined): string {
  const num = Number(n) || 0
  return `$${num.toFixed(2)}`
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const SERVICE_LABELS: Record<string, string> = {
  everyday: 'Everyday',
  airport: 'Airport',
  long_distance: 'Long Distance',
  chauffeur: 'Chauffeur',
  event: 'Event',
}

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: 'Unpaid',
  deposit_paid: 'Deposit Paid',
  paid_in_full: 'Paid in Full',
}
