import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Flex.IA - Independent Insurance Adjuster Platform',
    short_name: 'Flex.IA',
    description: 'Connect with insurance firms, manage claims efficiently, and grow your independent adjusting business with Flex.IA\'s comprehensive platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6366f1',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en-US',
    categories: ['business', 'productivity', 'finance'],
    
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ],
    
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Access your main dashboard',
        url: '/dashboard',
        icons: [
          {
            src: '/icons/dashboard-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Claims',
        short_name: 'Claims',
        description: 'Manage your claims',
        url: '/dashboard/claims',
        icons: [
          {
            src: '/icons/claims-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Messages',
        short_name: 'Messages',
        description: 'Check your messages',
        url: '/dashboard/messages',
        icons: [
          {
            src: '/icons/messages-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],
    
    screenshots: [
      {
        src: '/screenshots/dashboard-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Dashboard view on desktop'
      },
      {
        src: '/screenshots/dashboard-mobile.png',
        sizes: '375x667',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Dashboard view on mobile'
      },
      {
        src: '/screenshots/claims-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Claims management on desktop'
      },
      {
        src: '/screenshots/claims-mobile.png',
        sizes: '375x667',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Claims management on mobile'
      }
    ],
    
    related_applications: [
      {
        platform: 'webapp',
        url: 'https://flex-ia.com/manifest.json'
      }
    ],
    
    prefer_related_applications: false,
    
    edge_side_panel: {
      preferred_width: 400
    }
  }
}
