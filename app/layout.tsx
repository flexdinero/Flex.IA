import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/toast"
import ErrorBoundary, { AsyncErrorBoundary } from "@/components/error-boundary"
import { AuthProvider } from "@/hooks/useAuth"
import { generateMetadata, generateStructuredData, SEO_CONFIG } from "@/lib/seo"

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  ...generateMetadata('home'),
  generator: 'Next.js',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover'
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Flex.IA'
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Generate structured data for the organization
  const organizationSchema = generateStructuredData('Organization')
  const webAppSchema = generateStructuredData('WebApplication')

  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//api.stripe.com" />
        <link rel="dns-prefetch" href="//js.stripe.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppSchema)
          }}
        />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Theme-aware styling fix
            function applyTheme() {
              const isDark = document.documentElement.classList.contains('dark');
              if (isDark) {
                document.documentElement.style.backgroundColor = '#0f0f23';
                document.documentElement.style.color = '#ffffff';
                if (document.body) {
                  document.body.style.backgroundColor = '#0f0f23';
                  document.body.style.color = '#ffffff';
                }
              } else {
                document.documentElement.style.backgroundColor = '#ffffff';
                document.documentElement.style.color = '#1a1a1a';
                if (document.body) {
                  document.body.style.backgroundColor = '#ffffff';
                  document.body.style.color = '#1a1a1a';
                }
              }
            }

            // Apply theme immediately
            applyTheme();

            // Watch for theme changes
            const observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                  applyTheme();
                }
              });
            });

            observer.observe(document.documentElement, {
              attributes: true,
              attributeFilter: ['class']
            });

            document.addEventListener('DOMContentLoaded', function() {
              applyTheme();
            });
          `
        }} />
      </head>
      <body className={inter.className} style={{ backgroundColor: '#ffffff', color: '#1a1a1a', margin: 0, padding: 0 }}>
        <ErrorBoundary>
          <AsyncErrorBoundary>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <ToastProvider>
                <AuthProvider>
                  {children}
                </AuthProvider>
              </ToastProvider>
            </ThemeProvider>
          </AsyncErrorBoundary>
        </ErrorBoundary>
      </body>
    </html>
  )
}
