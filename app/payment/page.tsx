"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, CreditCard, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PaymentPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async (plan: 'monthly' | 'yearly') => {
    setIsProcessing(true)
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan,
          priceId: plan === 'monthly' ? 'price_monthly_97' : 'price_yearly_984'
        })
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Payment error:', error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-purple-200 dark:border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Flex.IA
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Payment Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get Flex.IA Professional
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start maximizing your adjusting business today with our comprehensive platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <Card className={`relative ${!isYearly ? 'ring-2 ring-purple-500 shadow-xl' : 'hover:shadow-lg'} transition-all duration-300`}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Monthly Plan</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-5xl font-bold text-gray-900 dark:text-white mt-4">
                $97
                <span className="text-xl text-gray-600 dark:text-gray-400 font-normal">/month</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Billed monthly • Cancel anytime</p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handlePayment('monthly')}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-4 h-auto mb-6"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {isProcessing ? 'Processing...' : 'Start Monthly Plan'}
              </Button>
              
              <div className="space-y-3">
                {[
                  "Unlimited claims management",
                  "150+ premium firm network",
                  "Advanced earnings analytics",
                  "Smart scheduling & routing",
                  "Real-time communication hub",
                  "Performance insights & reports",
                  "Mobile app access",
                  "Priority customer support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card className={`relative ${isYearly ? 'ring-2 ring-purple-500 shadow-xl' : 'hover:shadow-lg'} transition-all duration-300`}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1">
                Save $180
              </Badge>
            </div>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl">Yearly Plan</CardTitle>
              <CardDescription>Best value for serious adjusters</CardDescription>
              <div className="text-5xl font-bold text-gray-900 dark:text-white mt-4">
                $82
                <span className="text-xl text-gray-600 dark:text-gray-400 font-normal">/month</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Billed annually ($984/year) • 15% savings
              </p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handlePayment('yearly')}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-4 h-auto mb-6"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {isProcessing ? 'Processing...' : 'Start Yearly Plan'}
              </Button>
              
              <div className="space-y-3">
                {[
                  "Everything in Monthly Plan",
                  "15% discount ($180 savings)",
                  "Priority feature requests",
                  "Dedicated account manager",
                  "Advanced reporting suite",
                  "Custom integrations support",
                  "Early access to new features",
                  "Annual business review"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <span>Cancel Anytime</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Secure payment processing by Stripe. Your payment information is encrypted and secure. 
            Start using Flex.IA immediately after payment confirmation.
          </p>
        </div>
      </div>
    </div>
  )
}
