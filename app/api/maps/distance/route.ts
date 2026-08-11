import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

function normalize(address: string) {
  return address.trim().toLowerCase().replace(/\s+/g, ' ')
}

// Demo fallback — used only when GOOGLE_MAPS_API_KEY isn't configured yet,
// so the booking flow (and the pricing engine) can be clicked through
// end-to-end before Maps is wired up. Deterministic per address pair, not
// random, so the same demo addresses always produce the same numbers.
// Automatically stops being used the moment a real key is set — nothing
// else needs to change.
function mockDistance(origin: string, destination: string) {
  let hash = 0
  const combined = `${origin}|${destination}`
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) >>> 0
  }
  const distanceMiles = 5 + (hash % 41) // 5–45 miles
  const durationMinutes = Math.round(distanceMiles * 2.4) // roughly city-driving pace
  return { distanceMiles, durationMinutes }
}

export async function POST(req: NextRequest) {
  const { origin, destination } = await req.json()

  if (!origin || !destination) {
    return NextResponse.json({ error: 'origin and destination are required' }, { status: 400 })
  }

  const originNorm = normalize(origin)
  const destinationNorm = normalize(destination)

  const supabase = getServiceSupabase()

  const { data: cached } = await supabase
    .from('distance_cache')
    .select('distance_miles, duration_minutes')
    .eq('origin_normalized', originNorm)
    .eq('destination_normalized', destinationNorm)
    .maybeSingle()

  if (cached) {
    return NextResponse.json({
      distanceMiles: cached.distance_miles,
      durationMinutes: cached.duration_minutes,
      distanceText: `${cached.distance_miles} mi`,
      durationText: `${cached.duration_minutes} min`,
    })
  }

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    const { distanceMiles, durationMinutes } = mockDistance(originNorm, destinationNorm)
    return NextResponse.json({
      distanceMiles,
      durationMinutes,
      distanceText: `${distanceMiles} mi`,
      durationText: `${durationMinutes} min`,
      demo: true,
    })
  }

  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json')
  url.searchParams.set('origins', origin)
  url.searchParams.set('destinations', destination)
  url.searchParams.set('mode', 'driving')
  url.searchParams.set('units', 'imperial')
  url.searchParams.set('key', process.env.GOOGLE_MAPS_API_KEY!)

  const res = await fetch(url.toString())
  const data = await res.json()

  const element = data?.rows?.[0]?.elements?.[0]
  if (!element || element.status !== 'OK') {
    return NextResponse.json({ error: 'Could not calculate distance for the given addresses' }, { status: 422 })
  }

  const distanceMiles = Math.round((element.distance.value / 1609.34) * 100) / 100
  const durationMinutes = Math.round(element.duration.value / 60)

  await supabase.from('distance_cache').upsert(
    {
      origin_normalized: originNorm,
      destination_normalized: destinationNorm,
      distance_miles: distanceMiles,
      duration_minutes: durationMinutes,
    },
    { onConflict: 'origin_normalized,destination_normalized' }
  )

  return NextResponse.json({
    distanceMiles,
    durationMinutes,
    distanceText: element.distance.text,
    durationText: element.duration.text,
  })
}
