"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, FileText, Building, MessageSquare, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface SearchResult {
  id: string
  type: 'claim' | 'message' | 'firm' | 'document' | 'payout'
  title: string
  description: string
  metadata?: string
  url: string
}

interface GlobalSearchProps {
  onClose?: () => void
  isOpen?: boolean
}

export function GlobalSearch({ onClose, isOpen = false }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock search data
  const mockData: SearchResult[] = [
    {
      id: "1",
      type: "claim",
      title: "CLM-2024-001 - Hurricane Damage",
      description: "Property damage claim from Hurricane Milton",
      metadata: "Crawford & Company • $32,500 • In Progress",
      url: "/dashboard/claims/CLM-2024-001"
    },
    {
      id: "2",
      type: "message",
      title: "Urgent: Documentation Required",
      description: "Additional photos needed for claim assessment",
      metadata: "Sarah Johnson • 2 hours ago",
      url: "/dashboard/messages/2"
    },
    {
      id: "3",
      type: "firm",
      title: "Sedgwick Claims Management",
      description: "Insurance claims management company",
      metadata: "4.6 rating • 32 active claims",
      url: "/dashboard/firms/sedgwick"
    },
    {
      id: "4",
      type: "document",
      title: "Inspection Report - CLM-2024-001",
      description: "Detailed property inspection report",
      metadata: "PDF • 2.3 MB • Jan 10, 2024",
      url: "/dashboard/documents/inspection-report-001"
    },
    {
      id: "5",
      type: "payout",
      title: "Payment - CLM-2023-089",
      description: "Completed claim payment",
      metadata: "$2,850.00 • Paid Jan 5, 2024",
      url: "/dashboard/payouts/CLM-2023-089"
    }
  ]

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Perform search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const filtered = mockData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.metadata?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose?.()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setSelectedIndex(-1)
  }

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
    
    // Navigate to result (would be handled by Next.js router in real app)
    console.log('Navigate to:', result.url)
    onClose?.()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'claim': return <FileText className="h-4 w-4" />
      case 'message': return <MessageSquare className="h-4 w-4" />
      case 'firm': return <Building className="h-4 w-4" />
      case 'document': return <FileText className="h-4 w-4" />
      case 'payout': return <FileText className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'claim': return 'bg-blue-100 text-blue-800'
      case 'message': return 'bg-green-100 text-green-800'
      case 'firm': return 'bg-purple-100 text-purple-800'
      case 'document': return 'bg-orange-100 text-orange-800'
      case 'payout': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search claims, messages, firms, documents..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="border-0 focus-visible:ring-0 text-lg"
            />
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
                    <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="flex items-center gap-2 w-full p-2 text-left hover:bg-muted rounded-md"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Start typing to search across claims, messages, firms, and documents...
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="divide-y">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                    selectedIndex === index ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded ${getTypeColor(result.type)}`}>
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{result.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {result.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{result.description}</p>
                      {result.metadata && (
                        <p className="text-xs text-muted-foreground">{result.metadata}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>

        {results.length > 0 && (
          <div className="p-3 border-t bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{results.length} results found</span>
              <div className="flex items-center gap-2">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
                <span>esc to close</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
