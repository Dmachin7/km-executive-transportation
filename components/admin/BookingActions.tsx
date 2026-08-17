'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { STATUS_LABELS } from '@/lib/format'

const STATUS_OPTIONS = Object.keys(STATUS_LABELS)

interface Props {
  bookingId: string
  currentStatus: string
  canChargeBalance: boolean
  balanceDue: number
}

export default function BookingActions({ bookingId, currentStatus, canChargeBalance, balanceDue }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [savingStatus, setSavingStatus] = useState(false)
  const [charging, setCharging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleStatusChange = async (next: string) => {
    setStatus(next)
    setSavingStatus(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update status')
      setMessage('Status updated.')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setStatus(currentStatus)
    } finally {
      setSavingStatus(false)
    }
  }

  const handleChargeBalance = async () => {
    if (!confirm(`Charge the remaining $${balanceDue.toFixed(2)} balance to the saved card on file?`)) return
    setCharging(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/charge-balance`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to charge balance')
      setMessage(`Charged $${data.amountCharged.toFixed(2)} successfully.`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCharging(false)
    }
  }

  return (
    <div className="bg-km-darker border border-white/5 p-5 sm:p-6 space-y-5">
      <div>
        <label className="form-label" htmlFor="status">
          Booking Status
        </label>
        <select
          id="status"
          className="form-input"
          value={status}
          disabled={savingStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {canChargeBalance && (
        <button
          type="button"
          onClick={handleChargeBalance}
          disabled={charging}
          className="btn-gold w-full text-center disabled:opacity-50"
        >
          {charging ? 'Charging…' : `Charge Remaining Balance — $${balanceDue.toFixed(2)}`}
        </button>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {message && <p className="text-km-gold text-sm">{message}</p>}
    </div>
  )
}
