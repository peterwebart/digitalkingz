import type { MetadataRoute } from 'next'
import { absoluteUrl, getServerUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The admin panel and REST layer are behind auth, but keeping them out
        // of the index avoids wasted crawl budget and stray login pages in
        // search results.
        disallow: ['/admin', '/api/', '/og'],
      },
      // AI answer engines are allowed deliberately. Being citable in ChatGPT,
      // Claude, Gemini and Perplexity is a channel, not a leak.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getServerUrl(),
  }
}
