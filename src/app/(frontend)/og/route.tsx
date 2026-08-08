import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 86400

/**
 * Dynamic social card.
 *
 * Rendered on demand and cached, so every page gets a branded, readable
 * preview without anyone having to design one per page.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const rawTitle = searchParams.get('title') ?? 'We Build Digital Systems That Grow Businesses'
  const title = rawTitle.length > 110 ? `${rawTitle.slice(0, 108)}…` : rawTitle
  const eyebrow = searchParams.get('eyebrow') ?? 'Digital Kingz'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#08090b',
          backgroundImage:
            'radial-gradient(circle at 78% 8%, rgba(212,164,65,0.20), transparent 46%), radial-gradient(circle at 6% 96%, rgba(56,132,196,0.10), transparent 42%)',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              width: 52,
              height: 52,
              borderRadius: 14,
              border: '1.5px solid rgba(245,246,247,0.14)',
              backgroundColor: '#101318',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M7 21.5 L7 12 L11.75 16.5 L16 9.5 L20.25 16.5 L25 12 L25 21.5 Z"
                stroke="#e3b341"
                strokeWidth="1.8"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="7" cy="12" r="2" fill="#e3b341" />
              <circle cx="16" cy="9.5" r="2.2" fill="#f0c561" />
              <circle cx="25" cy="12" r="2" fill="#e3b341" />
              <path d="M7 24.5 H25" stroke="#b08a2e" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#f5f6f7', fontSize: 24, fontWeight: 600, letterSpacing: -0.4 }}>
              Digital Kingz
            </span>
            <span style={{ color: '#6b7280', fontSize: 13, letterSpacing: 2.4 }}>
              DEVELOPMENT
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <span
            style={{
              color: '#e3b341',
              fontSize: 15,
              letterSpacing: 3.2,
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              color: '#f5f6f7',
              fontSize: title.length > 64 ? 52 : 64,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: -1.8,
              maxWidth: 1000,
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {['Build', 'Grow', 'Automate', 'Transform'].map((item, i) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: '#9ba1aa', fontSize: 17 }}>{item}</span>
              {i < 3 ? <span style={{ color: '#3a3f47', fontSize: 17 }}>/</span> : null}
            </div>
          ))}
          <span style={{ marginLeft: 'auto', color: '#6b7280', fontSize: 17 }}>
            digitalkingz.com
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
