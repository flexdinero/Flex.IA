"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CheckCircle,
  Star,
  ArrowRight,
  Users,
  TrendingUp,
  Building2,
  FileText,
  DollarSign,
  Calendar,
  MessageSquare,
  Trophy,
  Sparkles,
  ChevronRight,
  Play,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [isYearly, setIsYearly] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')



  const stats = [
    { label: "Time Saved Weekly", value: "15+ hrs", icon: Clock, subtext: "Automated workflows & efficiency" },
    { label: "Real-Time Notifications", value: "Instant", icon: MessageSquare, subtext: "Get notified when firms release new claims" },
    { label: "Income Potential", value: "+40%", icon: TrendingUp, subtext: "Average earnings increase in first year" },
    { label: "Firm Network", value: "150+", icon: Building2, subtext: "Compatible with all major IA firms" }
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleWaitlistSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!waitlistEmail) return

    setWaitlistStatus('loading')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: waitlistEmail,
          source: 'ai-automation'
        })
      })

      if (response.ok) {
        setWaitlistStatus('success')
        setWaitlistEmail('')
      } else {
        setWaitlistStatus('error')
      }
    } catch (error) {
      setWaitlistStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-purple-200 dark:border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Flex.IA
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Guarantee Your Success
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">As an Independent Adjuster</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            The complete platform for independent adjusters. Maximize earnings, streamline workflows, and grow your business.
          </p>

          <div className="flex justify-center mb-16">
            <Link href="/payment">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 h-auto shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Get Flex.IA
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center transition-all duration-1000 delay-${index * 100}`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-100 dark:border-purple-800 h-48 flex flex-col justify-center">
                  <stat.icon className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-base text-gray-600 dark:text-gray-300 font-medium mb-2">{stat.label}</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">{stat.subtext}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive tools designed specifically for independent adjusters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Claims Management",
                description: "Centralized dashboard for all your claims from multiple firms. Track progress, deadlines, and documentation in one place.",
                color: "text-blue-600",
                bgColor: "bg-blue-100 dark:bg-blue-900/20"
              },
              {
                icon: DollarSign,
                title: "Earnings Optimization",
                description: "Advanced analytics to track income, identify high-value opportunities, and maximize your earning potential.",
                color: "text-green-600",
                bgColor: "bg-green-100 dark:bg-green-900/20"
              },
              {
                icon: Building2,
                title: "Firm Network",
                description: "Connect with 150+ top-tier insurance firms including Crawford, Sedgwick, and other industry leaders.",
                color: "text-purple-600",
                bgColor: "bg-purple-100 dark:bg-purple-900/20"
              },
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description: "Intelligent calendar management with automated scheduling, route optimization, and deadline tracking.",
                color: "text-orange-600",
                bgColor: "bg-orange-100 dark:bg-orange-900/20"
              },
              {
                icon: MessageSquare,
                title: "Communication Hub",
                description: "Streamlined messaging with firms, claimants, and team members. Never miss important updates.",
                color: "text-indigo-600",
                bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
              },
              {
                icon: Trophy,
                title: "Performance Analytics",
                description: "Detailed insights into your performance metrics, claim completion rates, and growth opportunities.",
                color: "text-red-600",
                bgColor: "bg-red-100 dark:bg-red-900/20"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-gray-200 dark:border-gray-700">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              One plan with everything you need to maximize your adjusting business
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="p-8 shadow-2xl border-purple-200 dark:border-purple-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Flex.IA Professional
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete platform for independent adjusters
                </p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={() => setIsYearly(!isYearly)}
                  >
                    {isYearly ? 'Switch to Monthly' : 'Switch to Yearly (Save 15%)'}
                  </Button>
                </div>

                {!isYearly ? (
                  <div>
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                      $97
                      <span className="text-xl text-gray-600 dark:text-gray-400 font-normal">/month</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Billed monthly</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                      $82
                      <span className="text-xl text-gray-600 dark:text-gray-400 font-normal">/month</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Billed annually ($984/year)
                      <span className="text-green-600 font-semibold ml-2">Save $180</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
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

              <Link href="/payment" className="block">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-4 h-auto shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Get Flex.IA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                Cancel anytime. No setup fees.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Automation Waitlist */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 rounded-full p-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-4">
              Coming Soon: AI Automation
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Revolutionary AI-powered automation that will handle your entire claim workflow.
              Integrate with leading IA software platforms and automate 80% of your routine tasks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-4 mb-3">
                  <FileText className="h-6 w-6 text-white mx-auto" />
                </div>
                <h3 className="font-semibold text-white mb-2">Automated Reports</h3>
                <p className="text-blue-100 text-sm">AI generates comprehensive reports from photos and data</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-4 mb-3">
                  <MessageSquare className="h-6 w-6 text-white mx-auto" />
                </div>
                <h3 className="font-semibold text-white mb-2">Smart Communication</h3>
                <p className="text-blue-100 text-sm">Automated updates to firms and claimants</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-lg p-4 mb-3">
                  <Calendar className="h-6 w-6 text-white mx-auto" />
                </div>
                <h3 className="font-semibold text-white mb-2">Intelligent Scheduling</h3>
                <p className="text-blue-100 text-sm">AI optimizes your schedule and routes automatically</p>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleWaitlistSignup} className="flex gap-3 mb-4">
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter your email for early access"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <Button
                  type="submit"
                  disabled={waitlistStatus === 'loading'}
                  className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 font-semibold disabled:opacity-50"
                >
                  {waitlistStatus === 'loading' ? 'Joining...' : 'Join Waitlist'}
                </Button>
              </form>

              {waitlistStatus === 'success' && (
                <p className="text-green-200 text-sm mb-2">
                  ✅ Successfully joined! Check your email for confirmation.
                </p>
              )}

              {waitlistStatus === 'error' && (
                <p className="text-red-200 text-sm mb-2">
                  ❌ Something went wrong. Please try again.
                </p>
              )}

              <p className="text-blue-200 text-sm">
                Be among the first to access AI automation. Expected launch: Q2 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Adjusting Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of independent adjusters who are already maximizing their earning potential with Flex.IA.
          </p>
          <Link href="/payment">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 h-auto shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Flex.IA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
