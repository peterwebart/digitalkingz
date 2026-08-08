import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Digital Kingz Development',
    short_name: 'Digital Kingz',
    description: 'We build digital systems that grow businesses.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0d14',
    theme_color: '#0a0d14',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
