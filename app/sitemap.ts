import { MetadataRoute } from 'next'
import { seoUtils } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flex-ia.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3
    }
  ]
  
  // Dashboard pages (lower priority as they require authentication)
  const dashboardPages = [
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.5
    },
    {
      url: `${baseUrl}/dashboard/claims`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.5
    },
    {
      url: `${baseUrl}/dashboard/earnings`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.5
    },
    {
      url: `${baseUrl}/dashboard/firms`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4
    },
    {
      url: `${baseUrl}/dashboard/messages`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.4
    },
    {
      url: `${baseUrl}/dashboard/calendar`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.4
    },
    {
      url: `${baseUrl}/dashboard/analytics`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4
    },
    {
      url: `${baseUrl}/dashboard/vault`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4
    },
    {
      url: `${baseUrl}/dashboard/settings`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3
    }
  ]
  
  return [...staticPages, ...dashboardPages]
}
