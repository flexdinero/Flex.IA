"use client"

import { useState } from 'react'

export default function TestLoginPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'demo@flex.ia', 
          password: 'demo123' 
        })
      })
      
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testLoginWith2FA = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'demo@flex.ia', 
          password: 'demo123',
          twoFactorToken: '123456'
        })
      })
      
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Login Test Page</h1>
        
        <div className="space-y-4 mb-6">
          <button 
            onClick={testLogin}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Login (without 2FA)
          </button>
          
          <button 
            onClick={testLoginWith2FA}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
          >
            Test Login (with 2FA)
          </button>
          
          <button 
            onClick={testProfile}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 ml-4"
          >
            Test Profile
          </button>
        </div>

        <div className="bg-white p-4 rounded border">
          <h2 className="font-semibold mb-2">Result:</h2>
          <pre className="text-sm overflow-auto">
            {result ? JSON.stringify(result, null, 2) : 'No test run yet'}
          </pre>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Demo Credentials:</h3>
          <p className="text-yellow-700">Email: demo@flex.ia</p>
          <p className="text-yellow-700">Password: demo123</p>
          <p className="text-yellow-700">2FA Code: 123456</p>
        </div>
      </div>
    </div>
  )
}
