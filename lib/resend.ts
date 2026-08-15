import { Resend } from 'resend'

export function getResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}

// Sandbox sender — works with zero domain setup, but Resend restricts
// delivery to the account owner's own email until a domain is verified.
// Swap this to a verified address (e.g. 'KM Executive Transportation
// <bookings@kmexecutivetransportation.com>') once that's done — nothing
// else needs to change.
export const FROM_EMAIL = 'KM Executive Transportation <onboarding@resend.dev>'
