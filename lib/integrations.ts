// External API integrations for Flex.IA

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  description: string
}

export interface LocationData {
  lat: number
  lng: number
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface InsuranceCarrierData {
  name: string
  code: string
  contactInfo: {
    phone: string
    email: string
    website: string
  }
  claimReportingInfo: {
    phone: string
    website: string
    email: string
  }
  coverage: string[]
}

export class IntegrationsService {
  // Google Maps API integration
  async geocodeAddress(address: string): Promise<LocationData | null> {
    try {
      if (!process.env.GOOGLE_MAPS_API_KEY) {
        console.log('Google Maps API key not configured')
        return null
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      )

      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0]
        const location = result.geometry.location
        
        // Extract address components
        const components = result.address_components
        const getComponent = (type: string) => 
          components.find((c: any) => c.types.includes(type))?.long_name || ''

        return {
          lat: location.lat,
          lng: location.lng,
          address: result.formatted_address,
          city: getComponent('locality') || getComponent('sublocality'),
          state: getComponent('administrative_area_level_1'),
          zipCode: getComponent('postal_code'),
          country: getComponent('country')
        }
      }

      return null
    } catch (error) {
      console.error('Geocoding failed:', error)
      return null
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<LocationData | null> {
    try {
      if (!process.env.GOOGLE_MAPS_API_KEY) {
        console.log('Google Maps API key not configured')
        return null
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      )

      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0]
        const components = result.address_components
        const getComponent = (type: string) => 
          components.find((c: any) => c.types.includes(type))?.long_name || ''

        return {
          lat,
          lng,
          address: result.formatted_address,
          city: getComponent('locality') || getComponent('sublocality'),
          state: getComponent('administrative_area_level_1'),
          zipCode: getComponent('postal_code'),
          country: getComponent('country')
        }
      }

      return null
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      return null
    }
  }

  // OpenWeather API integration
  async getWeatherData(lat: number, lng: number): Promise<WeatherData | null> {
    try {
      if (!process.env.OPENWEATHER_API_KEY) {
        console.log('OpenWeather API key not configured')
        return null
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`
      )

      const data = await response.json()

      if (response.ok) {
        return {
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          visibility: Math.round(data.visibility / 1609.34), // Convert to miles
          description: data.weather[0].description
        }
      }

      return null
    } catch (error) {
      console.error('Weather data fetch failed:', error)
      return null
    }
  }

  async getWeatherByAddress(address: string): Promise<WeatherData | null> {
    const location = await this.geocodeAddress(address)
    if (!location) return null
    
    return this.getWeatherData(location.lat, location.lng)
  }

  // Insurance carrier lookup (mock data - replace with real API)
  async getInsuranceCarrierInfo(carrierCode: string): Promise<InsuranceCarrierData | null> {
    // This would typically connect to a real insurance carrier database
    const carriers: Record<string, InsuranceCarrierData> = {
      'STAT': {
        name: 'State Farm',
        code: 'STAT',
        contactInfo: {
          phone: '1-800-STATE-FARM',
          email: 'claims@statefarm.com',
          website: 'https://www.statefarm.com'
        },
        claimReportingInfo: {
          phone: '1-800-SF-CLAIM',
          website: 'https://www.statefarm.com/claims',
          email: 'claims@statefarm.com'
        },
        coverage: ['Auto', 'Home', 'Life', 'Health']
      },
      'GEIC': {
        name: 'GEICO',
        code: 'GEIC',
        contactInfo: {
          phone: '1-800-GEICO',
          email: 'service@geico.com',
          website: 'https://www.geico.com'
        },
        claimReportingInfo: {
          phone: '1-800-841-3000',
          website: 'https://www.geico.com/claims',
          email: 'claims@geico.com'
        },
        coverage: ['Auto', 'Home', 'Motorcycle', 'RV']
      },
      'PROG': {
        name: 'Progressive',
        code: 'PROG',
        contactInfo: {
          phone: '1-800-PROGRESSIVE',
          email: 'customer.service@progressive.com',
          website: 'https://www.progressive.com'
        },
        claimReportingInfo: {
          phone: '1-800-274-4499',
          website: 'https://www.progressive.com/claims',
          email: 'claims@progressive.com'
        },
        coverage: ['Auto', 'Home', 'Commercial', 'Motorcycle']
      }
    }

    return carriers[carrierCode.toUpperCase()] || null
  }

  // Zapier webhook integration
  async sendToZapier(webhookUrl: string, data: Record<string, any>): Promise<boolean> {
    try {
      if (!webhookUrl) {
        console.log('Zapier webhook URL not configured')
        return false
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'flex-ia'
        })
      })

      return response.ok
    } catch (error) {
      console.error('Zapier webhook failed:', error)
      return false
    }
  }

  // Slack notification integration
  async sendSlackNotification(message: string, channel?: string): Promise<boolean> {
    try {
      if (!process.env.SLACK_WEBHOOK_URL) {
        console.log('Slack webhook URL not configured')
        return false
      }

      const payload = {
        text: message,
        channel: channel || '#general',
        username: 'Flex.IA',
        icon_emoji: ':briefcase:'
      }

      const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      return response.ok
    } catch (error) {
      console.error('Slack notification failed:', error)
      return false
    }
  }

  // Calculate distance between two points
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959 // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  // Get driving directions
  async getDirections(origin: string, destination: string): Promise<any> {
    try {
      if (!process.env.GOOGLE_MAPS_API_KEY) {
        console.log('Google Maps API key not configured')
        return null
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      )

      const data = await response.json()

      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0]
        const leg = route.legs[0]

        return {
          distance: leg.distance.text,
          duration: leg.duration.text,
          steps: leg.steps.map((step: any) => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
            distance: step.distance.text,
            duration: step.duration.text
          }))
        }
      }

      return null
    } catch (error) {
      console.error('Directions fetch failed:', error)
      return null
    }
  }

  // Validate address
  async validateAddress(address: string): Promise<{ valid: boolean; suggestion?: string }> {
    const location = await this.geocodeAddress(address)
    
    if (!location) {
      return { valid: false }
    }

    // If the geocoded address is significantly different, suggest the corrected version
    const similarity = this.calculateStringSimilarity(address.toLowerCase(), location.address.toLowerCase())
    
    if (similarity < 0.8) {
      return {
        valid: true,
        suggestion: location.address
      }
    }

    return { valid: true }
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }
}

export const integrationsService = new IntegrationsService()
