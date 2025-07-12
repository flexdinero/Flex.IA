'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'

interface Claim {
  id: string
  claimNumber: string
  title: string
  description?: string
  type: string
  status: string
  priority: string
  estimatedValue?: number
  finalValue?: number
  adjusterFee?: number
  address: string
  city: string
  state: string
  zipCode: string
  incidentDate: string
  deadline: string
  firm: {
    id: string
    name: string
    logo?: string
  }
  adjuster?: {
    id: string
    firstName: string
    lastName: string
    profileImage?: string
  }
  _count?: {
    documents: number
    messages: number
    reports: number
  }
  createdAt: string
  updatedAt: string
}

interface ClaimsResponse {
  claims: Claim[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useClaims(params?: {
  page?: number
  limit?: number
  status?: string
  type?: string
  priority?: string
  search?: string
  assigned?: boolean
}) {
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.set('page', params.page.toString())
  if (params?.limit) queryParams.set('limit', params.limit.toString())
  if (params?.status) queryParams.set('status', params.status)
  if (params?.type) queryParams.set('type', params.type)
  if (params?.priority) queryParams.set('priority', params.priority)
  if (params?.search) queryParams.set('search', params.search)
  if (params?.assigned !== undefined) queryParams.set('assigned', params.assigned.toString())

  const { data, error, mutate } = useSWR<ClaimsResponse>(
    `/api/claims?${queryParams.toString()}`,
    fetcher
  )

  return {
    claims: data?.claims || [],
    pagination: data?.pagination,
    loading: !error && !data,
    error,
    mutate
  }
}

export function useClaim(id: string) {
  const { data, error, mutate } = useSWR<Claim>(
    id ? `/api/claims/${id}` : null,
    fetcher
  )

  return {
    claim: data,
    loading: !error && !data,
    error,
    mutate
  }
}

export function useClaimActions() {
  const [loading, setLoading] = useState(false)

  const assignClaim = async (claimId: string, adjusterId?: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/claims/${claimId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjusterId })
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  const unassignClaim = async (claimId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/claims/${claimId}/assign`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  const updateClaim = async (claimId: string, updates: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/claims/${claimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  const createClaim = async (claimData: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData)
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  const deleteClaim = async (claimId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/claims/${claimId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  return {
    assignClaim,
    unassignClaim,
    updateClaim,
    createClaim,
    deleteClaim,
    loading
  }
}
