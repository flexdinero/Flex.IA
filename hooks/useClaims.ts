import { useState, useEffect } from 'react'

export interface Claim {
  id: string
  claimNumber: string
  title: string
  description?: string
  type: string
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  estimatedValue?: number
  adjusterFee?: number
  address: string
  city: string
  state: string
  zipCode: string
  incidentDate: string
  reportedDate: string
  deadline: string
  assignedAt?: string
  completedAt?: string
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

export interface ClaimsFilters {
  status?: string
  priority?: string
  type?: string
  search?: string
  firmId?: string
  assigned?: boolean
  page?: number
  limit?: number
}

export interface ClaimsPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface ClaimsResponse {
  claims: Claim[]
  pagination: ClaimsPagination
}

export function useClaims(filters: ClaimsFilters = {}) {
  const [data, setData] = useState<ClaimsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClaims = async () => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      
      if (filters.status && filters.status !== 'all') {
        searchParams.append('status', filters.status.toUpperCase())
      }
      if (filters.priority && filters.priority !== 'all') {
        searchParams.append('priority', filters.priority.toUpperCase())
      }
      if (filters.type && filters.type !== 'all') {
        searchParams.append('type', filters.type.toUpperCase().replace(' ', '_'))
      }
      if (filters.search) {
        searchParams.append('search', filters.search)
      }
      if (filters.firmId) {
        searchParams.append('firmId', filters.firmId)
      }
      if (filters.assigned !== undefined) {
        searchParams.append('assigned', filters.assigned.toString())
      }
      if (filters.page) {
        searchParams.append('page', filters.page.toString())
      }
      if (filters.limit) {
        searchParams.append('limit', filters.limit.toString())
      }

      const response = await fetch(`/api/claims?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch claims')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClaims()
  }, [
    filters.status,
    filters.priority,
    filters.type,
    filters.search,
    filters.firmId,
    filters.assigned,
    filters.page,
    filters.limit
  ])

  const refetch = () => {
    fetchClaims()
  }

  return {
    claims: data?.claims || [],
    pagination: data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
    loading,
    error,
    refetch
  }
}

export async function assignClaim(claimId: string, adjusterId?: string) {
  const response = await fetch(`/api/claims/${claimId}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(adjusterId ? { adjusterId } : {})
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to assign claim')
  }

  return response.json()
}

export async function unassignClaim(claimId: string) {
  const response = await fetch(`/api/claims/${claimId}/assign`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to unassign claim')
  }

  return response.json()
}

export async function updateClaimStatus(claimId: string, status: string, data?: any) {
  const response = await fetch(`/api/claims/${claimId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status, ...data })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update claim status')
  }

  return response.json()
}
