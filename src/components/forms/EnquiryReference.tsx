'use client'

import { useEffect, useState } from 'react'

/**
 * Shows the enquiry reference from the query string.
 *
 * Read from `window.location` on mount rather than with `useSearchParams`,
 * which would opt this route out of static rendering and require a Suspense
 * boundary. The page stays static; only this line is client-side.
 */
export function EnquiryReference() {
  const [reference, setReference] = useState<string | null>(null)

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('ref')
    if (value && /^DK-\d{4}-\d{6}$/.test(value)) setReference(value)
  }, [])

  if (!reference) {
    return (
      <p className="text-[1.0625rem] leading-relaxed text-ink-200">
        Your reference is in the confirmation we sent to your email address.
      </p>
    )
  }

  return (
    <p className="font-mono text-xl tracking-wide text-ink-50">{reference}</p>
  )
}
