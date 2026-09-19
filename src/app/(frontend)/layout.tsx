import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { GoogleTagManagerNoScript, GoogleTagManagerScript } from '@/components/GoogleTagManager'
import { JsonLd } from '@/components/JsonLd'
import { getSiteNav } from '@/lib/nav'
import { getSiteSettings } from '@/lib/payload'
import { SITE_NAME, organizationSchema, websiteSchema } from '@/lib/seo'
import { getServerUrl } from '@/lib/utils'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getServerUrl()),
  title: {
    default: 'Digital Kingz | We Build Digital Systems That Grow Businesses',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Digital Kingz builds connected digital growth systems: high-performance websites, SEO, paid media, conversion optimization, CRM and AI automation engineered to turn attention into revenue.',
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: getServerUrl() }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false, address: false, email: false },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0a0d14',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [nav, settings] = await Promise.all([getSiteNav(), getSiteSettings()])

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        {gtmId ? <GoogleTagManagerNoScript id={gtmId} /> : null}
        {gtmId ? <GoogleTagManagerScript id={gtmId} /> : null}
        <JsonLd nodes={[organizationSchema(settings), websiteSchema(settings)]} />
        <Header nav={nav} bookingUrl={settings.bookingUrl} />
        <main id="main" className="pt-16 lg:pt-[4.5rem]">
          {children}
        </main>
        <Footer nav={nav} settings={settings} />
      </body>
    </html>
  )
}
