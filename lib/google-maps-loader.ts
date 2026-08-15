// Loads the Maps JavaScript API (with the places library) exactly once, no
// matter how many components ask for it. Browser-only — never call this
// during SSR.
//
// Uses the `callback` URL param rather than the script tag's `onload` event
// — with `loading=async`, onload fires as soon as the bootstrap script
// itself loads, which is *before* the places library it dynamically pulls
// in afterward has actually attached to `google.maps`. The callback param
// is Google's documented mechanism for "requested libraries are now ready."
let loadPromise: Promise<void> | null = null

declare global {
  interface Window {
    __onGoogleMapsLoaded__?: () => void
  }
}

export function loadGoogleMapsPlaces(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('loadGoogleMapsPlaces can only run in the browser'))
  }

  if ((window as any).google?.maps?.places) {
    return Promise.resolve()
  }

  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    window.__onGoogleMapsLoaded__ = () => resolve()

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=__onGoogleMapsLoaded__`
    script.async = true
    script.defer = true
    script.onerror = () => reject(new Error('Failed to load Google Maps script'))
    document.head.appendChild(script)
  })

  return loadPromise
}
