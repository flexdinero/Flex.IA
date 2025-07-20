/**
 * SEO and Metadata Management for Flex.IA
 * 
 * Comprehensive SEO utilities including meta tags, Open Graph,
 * Twitter Cards, structured data, and page-specific optimization
 */

import { Metadata } from 'next'

// Base configuration
export const SEO_CONFIG = {
  siteName: 'Flex.IA',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://flex-ia.com',
  defaultTitle: 'Flex.IA - Independent Insurance Adjuster Platform',
  defaultDescription: 'Connect with insurance firms, manage claims efficiently, and grow your independent adjusting business with Flex.IA\'s comprehensive platform.',
  defaultKeywords: [
    'insurance adjuster',
    'independent adjuster',
    'claims management',
    'insurance platform',
    'adjuster network',
    'property damage',
    'auto claims',
    'insurance technology'
  ],
  twitterHandle: '@FlexIA_Platform',
  author: 'Flex.IA Team',
  language: 'en-US',
  themeColor: '#6366f1',
  backgroundColor: '#ffffff'
} as const

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: 'Flex.IA - Independent Insurance Adjuster Platform',
    description: 'Join the leading platform for independent insurance adjusters. Connect with top firms, manage claims efficiently, and grow your business with advanced tools and automation.',
    keywords: ['insurance adjuster platform', 'independent adjuster network', 'claims management software'],
    path: '/'
  },
  dashboard: {
    title: 'Dashboard - Flex.IA',
    description: 'Manage your claims, track earnings, and monitor your adjusting business performance with Flex.IA\'s comprehensive dashboard.',
    keywords: ['adjuster dashboard', 'claims tracking', 'earnings management'],
    path: '/dashboard'
  },
  claims: {
    title: 'Claims Management - Flex.IA',
    description: 'Browse available claims, manage assigned cases, and track claim progress with powerful filtering and organization tools.',
    keywords: ['claims management', 'insurance claims', 'claim tracking'],
    path: '/dashboard/claims'
  },
  earnings: {
    title: 'Earnings & Payments - Flex.IA',
    description: 'Track your earnings, view payment history, and manage your financial performance as an independent adjuster.',
    keywords: ['adjuster earnings', 'payment tracking', 'financial management'],
    path: '/dashboard/earnings'
  },
  firms: {
    title: 'Insurance Firms - Flex.IA',
    description: 'Connect with insurance firms, manage partnerships, and expand your network of professional relationships.',
    keywords: ['insurance firms', 'adjuster network', 'firm partnerships'],
    path: '/dashboard/firms'
  },
  messages: {
    title: 'Messages & Communication - Flex.IA',
    description: 'Communicate with firms, adjusters, and clients through our secure messaging platform.',
    keywords: ['adjuster communication', 'secure messaging', 'professional communication'],
    path: '/dashboard/messages'
  },
  calendar: {
    title: 'Calendar & Scheduling - Flex.IA',
    description: 'Manage your schedule, track deadlines, and organize inspections with our integrated calendar system.',
    keywords: ['adjuster calendar', 'inspection scheduling', 'deadline management'],
    path: '/dashboard/calendar'
  },
  analytics: {
    title: 'Analytics & Reports - Flex.IA',
    description: 'Analyze your performance, track key metrics, and generate reports to optimize your adjusting business.',
    keywords: ['adjuster analytics', 'performance tracking', 'business reports'],
    path: '/dashboard/analytics'
  },
  vault: {
    title: 'Document Vault - Flex.IA',
    description: 'Securely store, organize, and manage all your important documents, certificates, and claim files.',
    keywords: ['document management', 'secure storage', 'file organization'],
    path: '/dashboard/vault'
  },
  settings: {
    title: 'Account Settings - Flex.IA',
    description: 'Manage your profile, preferences, and account settings to customize your Flex.IA experience.',
    keywords: ['account settings', 'profile management', 'user preferences'],
    path: '/dashboard/settings'
  },
  login: {
    title: 'Login - Flex.IA',
    description: 'Access your Flex.IA account to manage claims, connect with firms, and grow your adjusting business.',
    keywords: ['adjuster login', 'account access', 'secure login'],
    path: '/auth/login'
  },
  register: {
    title: 'Join Flex.IA - Independent Adjuster Registration',
    description: 'Join thousands of independent adjusters using Flex.IA to connect with firms and manage their business efficiently.',
    keywords: ['adjuster registration', 'join platform', 'independent adjuster signup'],
    path: '/auth/register'
  },
  pricing: {
    title: 'Pricing - Flex.IA',
    description: 'Choose the perfect plan for your independent adjusting business. Transparent pricing with powerful features.',
    keywords: ['adjuster pricing', 'subscription plans', 'platform cost'],
    path: '/pricing'
  },
  about: {
    title: 'About Flex.IA - Empowering Independent Adjusters',
    description: 'Learn about Flex.IA\'s mission to revolutionize the independent adjusting industry through technology and innovation.',
    keywords: ['about flex.ia', 'company mission', 'adjuster platform'],
    path: '/about'
  },
  contact: {
    title: 'Contact Us - Flex.IA',
    description: 'Get in touch with the Flex.IA team for support, partnerships, or general inquiries.',
    keywords: ['contact support', 'customer service', 'help'],
    path: '/contact'
  }
} as const

// Generate metadata for a specific page
export function generateMetadata(pageKey: keyof typeof PAGE_SEO, customData?: Partial<Metadata>): Metadata {
  const pageConfig = PAGE_SEO[pageKey]
  const baseUrl = SEO_CONFIG.siteUrl
  const fullUrl = `${baseUrl}${pageConfig.path}`
  
  const metadata: Metadata = {
    title: pageConfig.title,
    description: pageConfig.description,
    keywords: [...SEO_CONFIG.defaultKeywords, ...pageConfig.keywords],
    authors: [{ name: SEO_CONFIG.author }],
    creator: SEO_CONFIG.author,
    publisher: SEO_CONFIG.siteName,
    
    // Open Graph
    openGraph: {
      title: pageConfig.title,
      description: pageConfig.description,
      url: fullUrl,
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.language,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: pageConfig.title
        }
      ]
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.twitterHandle,
      creator: SEO_CONFIG.twitterHandle,
      title: pageConfig.title,
      description: pageConfig.description,
      images: [`${baseUrl}/images/twitter-card.jpg`]
    },
    
    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    
    // Canonical URL
    alternates: {
      canonical: fullUrl
    },
    
    // App metadata
    applicationName: SEO_CONFIG.siteName,
    referrer: 'origin-when-cross-origin',
    colorScheme: 'light dark',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: SEO_CONFIG.themeColor },
      { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
    ],
    
    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION
    },
    
    // Icons
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ],
      other: [
        { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: SEO_CONFIG.themeColor }
      ]
    },
    
    // Manifest
    manifest: '/site.webmanifest',
    
    // Custom metadata
    ...customData
  }
  
  return metadata
}

// Generate structured data (JSON-LD)
export function generateStructuredData(type: 'Organization' | 'WebApplication' | 'SoftwareApplication' | 'Article', data?: any) {
  const baseUrl = SEO_CONFIG.siteUrl
  
  const schemas = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      url: baseUrl,
      logo: `${baseUrl}/images/logo.png`,
      description: SEO_CONFIG.defaultDescription,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-800-FLEX-IA',
        contactType: 'customer service',
        availableLanguage: 'English'
      },
      sameAs: [
        'https://twitter.com/FlexIA_Platform',
        'https://linkedin.com/company/flex-ia',
        'https://facebook.com/FlexIA.Platform'
      ]
    },
    
    WebApplication: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SEO_CONFIG.siteName,
      url: baseUrl,
      description: SEO_CONFIG.defaultDescription,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier available'
      },
      author: {
        '@type': 'Organization',
        name: SEO_CONFIG.siteName
      }
    },
    
    SoftwareApplication: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SEO_CONFIG.siteName,
      description: SEO_CONFIG.defaultDescription,
      url: baseUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      softwareVersion: '1.0.0',
      author: {
        '@type': 'Organization',
        name: SEO_CONFIG.siteName
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    },
    
    Article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data?.title || SEO_CONFIG.defaultTitle,
      description: data?.description || SEO_CONFIG.defaultDescription,
      author: {
        '@type': 'Organization',
        name: SEO_CONFIG.siteName
      },
      publisher: {
        '@type': 'Organization',
        name: SEO_CONFIG.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/logo.png`
        }
      },
      datePublished: data?.datePublished || new Date().toISOString(),
      dateModified: data?.dateModified || new Date().toISOString(),
      ...data
    }
  }
  
  return schemas[type]
}

// Generate breadcrumb structured data
export function generateBreadcrumbData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SEO_CONFIG.siteUrl}${crumb.url}`
    }))
  }
}

// SEO utilities
export const seoUtils = {
  // Generate page title with site name
  generateTitle: (pageTitle: string) => {
    return pageTitle.includes(SEO_CONFIG.siteName) 
      ? pageTitle 
      : `${pageTitle} | ${SEO_CONFIG.siteName}`
  },
  
  // Truncate description to optimal length
  truncateDescription: (description: string, maxLength: number = 160) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength - 3) + '...'
  },
  
  // Generate keywords string
  generateKeywords: (keywords: string[]) => {
    return [...new Set([...SEO_CONFIG.defaultKeywords, ...keywords])].join(', ')
  },
  
  // Generate canonical URL
  generateCanonicalUrl: (path: string) => {
    return `${SEO_CONFIG.siteUrl}${path}`
  },
  
  // Generate sitemap URLs
  generateSitemapUrls: () => {
    return Object.values(PAGE_SEO).map(page => ({
      url: `${SEO_CONFIG.siteUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page.path === '/' ? 1.0 : 0.8
    }))
  }
}

// Export types for TypeScript
export type PageSEOKey = keyof typeof PAGE_SEO
export type StructuredDataType = 'Organization' | 'WebApplication' | 'SoftwareApplication' | 'Article'
