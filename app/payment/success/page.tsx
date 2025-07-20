"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Mail, Download, Users } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function PaymentSuccessContent() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      fetchSessionData()
    }
  }, [sessionId])

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/payment/create-checkout?session_id=${sessionId}`)
      const data = await response.json()
      setSessionData(data.session)
    } catch (error) {
      console.error('Failed to fetch session data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Flex.IA!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your payment was successful. You now have full access to the Flex.IA Professional platform.
          </p>
        </div>

        {/* Payment Details */}
        {sessionData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Payment Confirmation</CardTitle>
              <CardDescription>Your subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-semibold">{sessionData.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Amount Paid</p>
                  <p className="font-semibold">${(sessionData.amount_total / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Subscription ID</p>
                  <p className="font-semibold text-xs">{sessionData.subscription_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-green-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We've sent you a welcome email with your login credentials and getting started guide.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Download Mobile App</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get the Flex.IA mobile app for iOS and Android to manage claims on the go.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Join Community</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with other independent adjusters in our exclusive Slack community.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link href="/dashboard">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 h-auto"
            >
              Access Your Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <div className="flex justify-center gap-4">
            <Link href="/onboarding">
              <Button variant="outline">
                Start Onboarding
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline">
                Get Support
              </Button>
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Need help getting started?
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Contact our support team at{" "}
            <a href="mailto:support@flex.ia" className="text-purple-600 hover:underline">
              support@flex.ia
            </a>{" "}
            or call{" "}
            <a href="tel:+1-555-FLEX-IA" className="text-purple-600 hover:underline">
              (555) FLEX-IA
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
