import { NextRequest, NextResponse } from 'next/server'
import { getAdminProfile } from '@/lib/admin-auth'
import { getServerSupabase } from '@/lib/supabase-server'

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminProfile()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await req.json()
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  // Uses the session-scoped client (not the service role) so the
  // bookings_update_admin_only RLS policy is the actual authority here —
  // the getAdminProfile() check above is a fast-fail, not the only gate.
  const supabase = getServerSupabase()
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ booking })
}
