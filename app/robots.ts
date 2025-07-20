import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flex-ia.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/pricing',
          '/contact',
          '/auth/login',
          '/auth/register',
          '/privacy',
          '/terms'
        ],
        disallow: [
          '/dashboard/*',
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/auth/reset-password',
          '/auth/verify-email',
          '/auth/forgot-password'
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/about',
          '/pricing',
          '/contact',
          '/auth/login',
          '/auth/register',
          '/privacy',
          '/terms'
        ],
        disallow: [
          '/dashboard/*',
          '/api/*',
          '/admin/*'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
