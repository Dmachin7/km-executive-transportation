const GOLD = '#C9A84C'
const BLACK = '#0A0A0A'
const DARK = '#111111'

const SERVICE_LABELS: Record<string, string> = {
  everyday: 'Everyday Transportation',
  airport: 'Airport Transportation',
  long_distance: 'Long Distance Transportation',
  chauffeur: 'Private Chauffeur',
  event: 'Event Transportation',
}

export interface BookingEmailData {
  id: string
  booking_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service_type: string
  pickup_address: string
  dropoff_address: string | null
  pickup_datetime: string
  passenger_count: number
  special_requests: string | null
  total_price: number
  deposit_amount: number | null
  balance_due: number
  payment_type: 'full' | 'deposit'
}

function money(n: number | string) {
  return `$${Number(n).toFixed(2)}`
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function serviceLabel(serviceType: string) {
  return SERVICE_LABELS[serviceType] || serviceType
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
const logoBlock = appUrl
  ? `<img src="${appUrl}/assets/logo/logo.png" alt="KM Executive Transportation" width="140" style="display:block;margin:0 auto;" />`
  : `<div style="font-family:Georgia,serif;color:#ffffff;font-size:18px;letter-spacing:2px;">KM <span style="color:${GOLD};">EXECUTIVE</span></div>`

function shell(bodyHtml: string): string {
  return `
<div style="background:${BLACK};padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:${DARK};border:1px solid rgba(201,168,76,0.25);">
    <div style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
      ${logoBlock}
    </div>
    <div style="padding:32px;">
      ${bodyHtml}
    </div>
    <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 4px;">KM Executive Transportation &mdash; Tampa Bay, Florida</p>
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">
        <a href="tel:+18139957275" style="color:${GOLD};text-decoration:none;">+1 813.995.7275</a>
      </p>
    </div>
  </div>
</div>`.trim()
}

function tripDetailsRows(b: BookingEmailData): string {
  const rows: Array<[string, string]> = [
    ['Service Type', serviceLabel(b.service_type)],
    ['Pickup Date & Time', formatDateTime(b.pickup_datetime)],
    ['Pickup Location', b.pickup_address],
  ]
  if (b.dropoff_address) rows.push(['Dropoff Location', b.dropoff_address])
  rows.push(['Passenger Count', String(b.passenger_count)])
  if (b.special_requests) rows.push(['Special Requests', b.special_requests])

  return rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px;vertical-align:top;width:40%;">${label}</td>
        <td style="padding:8px 0;color:#ffffff;font-size:13px;">${value}</td>
      </tr>`
    )
    .join('')
}

// ── 1. Booking confirmation (customer) ──────────────────────────────────
export function bookingConfirmationEmail(b: BookingEmailData) {
  const subject = `Your Ride is Confirmed — ${b.booking_number}`

  const paymentSummary =
    b.payment_type === 'deposit'
      ? `
      <tr>
        <td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px;">Deposit Charged Today</td>
        <td style="padding:8px 0;color:#ffffff;font-size:13px;">${money(b.deposit_amount || 0)} &#10003;</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px;">Remaining Balance</td>
        <td style="padding:8px 0;color:#ffffff;font-size:13px;">${money(b.balance_due)}</td>
      </tr>`
      : `
      <tr>
        <td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px;">Amount Charged</td>
        <td style="padding:8px 0;color:#ffffff;font-size:13px;">${money(b.total_price)} &#10003; Paid in Full</td>
      </tr>`

  const balanceNote =
    b.payment_type === 'deposit'
      ? `<p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.7;margin:16px 0 0;">
          Your remaining balance of <strong style="color:${GOLD};">${money(b.balance_due)}</strong> will be automatically
          charged to your card on file on <strong>${formatDateTime(b.pickup_datetime)}</strong>, prior to your scheduled
          pickup. No action is required from you. You'll receive a receipt once it's processed.
        </p>`
      : ''

  const html = shell(`
    <h1 style="font-family:Georgia,serif;color:#ffffff;font-size:22px;text-align:center;margin:0 0 24px;">
      Your Executive Ride is Confirmed
    </h1>
    <p style="text-align:center;margin:0 0 24px;">
      <span style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:2px;text-transform:uppercase;">Booking Number</span><br/>
      <span style="font-family:Georgia,serif;color:${GOLD};font-size:26px;">${b.booking_number}</span>
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:20px;">
      ${tripDetailsRows(b)}
    </table>
    <p style="color:${GOLD};font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;">Payment Summary</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      ${paymentSummary}
    </table>
    ${balanceNote}
    <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.7;margin:24px 0 0;">
      Your chauffeur will arrive promptly at your pickup location. If you need to make any changes, please contact us
      at least 24 hours before your ride.
    </p>
  `)

  const text = [
    `Your Executive Ride is Confirmed`,
    ``,
    `Booking Number: ${b.booking_number}`,
    `Service: ${serviceLabel(b.service_type)}`,
    `Pickup: ${formatDateTime(b.pickup_datetime)}`,
    `Pickup Location: ${b.pickup_address}`,
    b.dropoff_address ? `Dropoff Location: ${b.dropoff_address}` : '',
    `Passengers: ${b.passenger_count}`,
    ``,
    b.payment_type === 'deposit'
      ? `Deposit Charged Today: ${money(b.deposit_amount || 0)}\nRemaining Balance: ${money(
          b.balance_due
        )} (auto-charged on ${formatDateTime(b.pickup_datetime)})`
      : `Amount Charged: ${money(b.total_price)} (Paid in Full)`,
    ``,
    `Questions or changes? Call us at +1 813.995.7275, at least 24 hours before your ride.`,
  ]
    .filter(Boolean)
    .join('\n')

  return { subject, html, text }
}

// ── 2. New booking alert (admin) ─────────────────────────────────────────
export function adminNewBookingEmail(b: BookingEmailData) {
  const subject = `New Booking — ${b.booking_number} — ${serviceLabel(b.service_type)}`

  const dashboardUrl = appUrl ? `${appUrl}/admin/bookings/${b.id}` : null

  const html = shell(`
    <h1 style="font-family:Georgia,serif;color:#ffffff;font-size:20px;text-align:center;margin:0 0 24px;">
      New Booking Received
    </h1>
    <p style="text-align:center;margin:0 0 20px;">
      <span style="font-family:Georgia,serif;color:${GOLD};font-size:22px;">${b.booking_number}</span>
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:20px;">
      <tr>
        <td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px;width:40%;">Customer</td>
        <td style="padding:8px 0;color:#ffffff;font-size:13px;">${b.customer_name}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px;">Email</td>
        <td style="padding:8px 0;color:#ffffff;font-size:13px;">${b.customer_email}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px;">Phone</td>
        <td style="padding:8px 0;color:#ffffff;font-size:13px;">${b.customer_phone}</td>
      </tr>
      ${tripDetailsRows(b)}
      <tr>
        <td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:13px;">Total</td>
        <td style="padding:8px 0;color:#ffffff;font-size:13px;">${money(b.total_price)} (${
    b.payment_type === 'deposit' ? `deposit ${money(b.deposit_amount || 0)} charged` : 'paid in full'
  })</td>
      </tr>
    </table>
    ${
      dashboardUrl
        ? `<p style="text-align:center;margin:0;">
            <a href="${dashboardUrl}" style="display:inline-block;background:${GOLD};color:#000000;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:12px 24px;">View in Dashboard</a>
          </p>`
        : ''
    }
  `)

  const text = [
    `New Booking Received — ${b.booking_number}`,
    ``,
    `Customer: ${b.customer_name}`,
    `Email: ${b.customer_email}`,
    `Phone: ${b.customer_phone}`,
    `Service: ${serviceLabel(b.service_type)}`,
    `Pickup: ${formatDateTime(b.pickup_datetime)}`,
    `Pickup Location: ${b.pickup_address}`,
    b.dropoff_address ? `Dropoff Location: ${b.dropoff_address}` : '',
    `Passengers: ${b.passenger_count}`,
    `Total: ${money(b.total_price)} (${b.payment_type === 'deposit' ? 'deposit charged' : 'paid in full'})`,
    dashboardUrl ? `\nView in dashboard: ${dashboardUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return { subject, html, text }
}

// ── 3. Payment receipt (after balance charge) ────────────────────────────
export function paymentReceiptEmail(b: BookingEmailData, amountCharged: number) {
  const subject = `Receipt — KM Executive Transportation`

  const html = shell(`
    <h1 style="font-family:Georgia,serif;color:#ffffff;font-size:22px;text-align:center;margin:0 0 8px;">
      Payment Receipt
    </h1>
    <p style="text-align:center;color:rgba(255,255,255,0.45);font-size:13px;margin:0 0 24px;">${b.booking_number}</p>
    <p style="text-align:center;margin:0 0 24px;">
      <span style="font-family:Georgia,serif;color:${GOLD};font-size:32px;">${money(amountCharged)}</span>
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:20px;">
      ${tripDetailsRows(b)}
    </table>
    <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.7;text-align:center;margin:0;">
      Thank you for riding with KM Executive Transportation.
    </p>
  `)

  const text = [
    `Payment Receipt — ${b.booking_number}`,
    ``,
    `Amount Charged: ${money(amountCharged)}`,
    `Service: ${serviceLabel(b.service_type)}`,
    `Pickup: ${formatDateTime(b.pickup_datetime)}`,
    ``,
    `Thank you for riding with KM Executive Transportation.`,
  ].join('\n')

  return { subject, html, text }
}
