const STATUS_STYLES: Record<string, string> = {
  pending: 'text-white/60 border-white/20',
  confirmed: 'text-km-gold border-km-gold/40',
  completed: 'text-emerald-400 border-emerald-400/40',
  cancelled: 'text-red-400 border-red-400/40',
  unpaid: 'text-white/60 border-white/20',
  deposit_paid: 'text-km-gold border-km-gold/40',
  paid_in_full: 'text-emerald-400 border-emerald-400/40',
}

export default function StatusBadge({ value, label }: { value: string; label: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border rounded-sm ${
        STATUS_STYLES[value] || 'text-white/60 border-white/20'
      }`}
    >
      {label}
    </span>
  )
}
