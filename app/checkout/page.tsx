"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, CreditCard, Shield, ArrowLeft, Lock, Gift } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get("plan") || "professional"

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    // Billing Address
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",

    // Professional Information
    licenseNumber: "",
    adjustingState: "",
    yearsExperience: "",
    specializations: [],
  })

  const plans = {
    starter: {
      name: "Starter",
      price: 29,
      yearlyPrice: 290,
      description: "Perfect for new adjusters",
      features: [
        "Up to 3 firm connections",
        "Basic analytics",
        "Mobile app access",
        "Email support",
        "Standard notifications",
      ],
    },
    professional: {
      name: "Professional",
      price: 79,
      yearlyPrice: 790,
      description: "Most popular for established adjusters",
      features: [
        "Unlimited firm connections",
        "Advanced analytics & forecasting",
        "Priority support",
        "Calendar integration",
        "Custom notifications",
        "Performance benchmarking",
      ],
    },
    enterprise: {
      name: "Enterprise",
      price: 149,
      yearlyPrice: 1490,
      description: "For high-volume adjusters",
      features: [
        "Everything in Professional",
        "White-label options",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced reporting",
      ],
    },
  }

  const [billingCycle, setBillingCycle] = useState("monthly")
  const currentPlan = plans[selectedPlan as keyof typeof plans]
  const basePrice = billingCycle === "monthly" ? currentPlan.price : currentPlan.yearlyPrice
  const finalPrice = basePrice - discount

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save20") {
      setDiscount(basePrice * 0.2)
      setPromoApplied(true)
    } else if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(basePrice * 0.1)
      setPromoApplied(true)
    } else {
      // Invalid promo code
      setPromoApplied(false)
      setDiscount(0)
    }
  }

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setLoading(false)
    setStep(5) // Success step
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  if (step === 5) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Flex.IA!</h1>
            <p className="text-muted-foreground mb-6">
              Your subscription has been activated successfully. You can now access all {currentPlan.name} features.
            </p>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/")}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">F</span>
            </div>
            <span className="text-xl font-bold">Flex.IA</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Complete Your Subscription</h1>
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-16 h-1 mx-2 ${step > stepNumber ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Plan Selection</span>
              <span>Personal Info</span>
              <span>Payment Details</span>
              <span>Review & Confirm</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Your Plan</CardTitle>
                    <CardDescription>Select the plan that best fits your adjusting business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Button
                        variant={billingCycle === "monthly" ? "default" : "outline"}
                        onClick={() => setBillingCycle("monthly")}
                      >
                        Monthly
                      </Button>
                      <Button
                        variant={billingCycle === "yearly" ? "default" : "outline"}
                        onClick={() => setBillingCycle("yearly")}
                      >
                        Yearly
                        <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(plans).map(([key, plan]) => (
                        <Card
                          key={key}
                          className={`cursor-pointer transition-all ${
                            selectedPlan === key ? "ring-2 ring-primary" : "hover:shadow-md"
                          }`}
                          onClick={() => router.push(`/checkout?plan=${key}`)}
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              {plan.name}
                              {selectedPlan === key && <CheckCircle className="h-5 w-5 text-primary" />}
                            </CardTitle>
                            <div className="text-2xl font-bold">
                              ${billingCycle === "monthly" ? plan.price : plan.yearlyPrice}
                              <span className="text-sm font-normal text-muted-foreground">
                                /{billingCycle === "monthly" ? "month" : "year"}
                              </span>
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleNextStep}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Tell us about yourself and your adjusting business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Adjuster License Number</Label>
                        <Input
                          id="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adjustingState">Primary Adjusting State</Label>
                        <Select
                          value={formData.adjustingState}
                          onValueChange={(value) => handleInputChange("adjustingState", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of Experience</Label>
                      <Select
                        value={formData.yearsExperience}
                        onValueChange={(value) => handleInputChange("yearsExperience", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="2-5">2-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="11-20">11-20 years</SelectItem>
                          <SelectItem value="20+">20+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Previous
                      </Button>
                      <Button onClick={handleNextStep}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>Secure payment processing with 256-bit SSL encryption</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        Your payment information is encrypted and secure. We never store your credit card details.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input
                          id="cardName"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange("cardName", e.target.value)}
                          required
                        />
                      </div>

                      <Separator />

                      <h3 className="font-semibold">Billing Address</h3>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TX">Texas</SelectItem>
                              <SelectItem value="FL">Florida</SelectItem>
                              <SelectItem value="CA">California</SelectItem>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="IL">Illinois</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <Select
                            value={formData.country}
                            onValueChange={(value) => handleInputChange("country", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Previous
                      </Button>
                      <Button onClick={handleNextStep}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Confirm</CardTitle>
                    <CardDescription>Please review your order before completing your purchase</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Personal Information</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                        {formData.licenseNumber && <p>License: {formData.licenseNumber}</p>}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        <span>•••• •••• •••• {formData.cardNumber.slice(-4)}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Billing Address</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{formData.address}</p>
                        <p>
                          {formData.city}, {formData.state} {formData.zipCode}
                        </p>
                        <p>{formData.country}</p>
                      </div>
                    </div>

                    {loading && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Processing payment...</span>
                          <span>Please wait</span>
                        </div>
                        <Progress value={33} className="h-2" />
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep} disabled={loading}>
                        Previous
                      </Button>
                      <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Processing..." : `Complete Purchase - $${finalPrice}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{currentPlan.name} Plan</span>
                      <span className="font-medium">${basePrice}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Billed {billingCycle}
                      {billingCycle === "yearly" && <Badge className="ml-2 bg-green-100 text-green-800">20% off</Badge>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentPlan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {currentPlan.features.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        +{currentPlan.features.length - 3} more features
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Promo Code */}
                  <div className="space-y-2">
                    <Label htmlFor="promoCode">Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="promoCode"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        disabled={promoApplied}
                      />
                      <Button variant="outline" onClick={handleApplyPromo} disabled={promoApplied || !promoCode}>
                        {promoApplied ? <CheckCircle className="h-4 w-4" /> : "Apply"}
                      </Button>
                    </div>
                    {promoApplied && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Gift className="h-4 w-4" />
                        <span>Promo code applied!</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>${basePrice}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${finalPrice}</span>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>30-day money-back guarantee. Cancel anytime.</AlertDescription>
                  </Alert>

                  <div className="text-xs text-muted-foreground">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy. Your subscription
                    will automatically renew unless cancelled.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
