"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  X,
  Filter,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ARIA_ROLES, ARIA_PROPS, KEYBOARD_KEYS, focusUtils } from '@/lib/accessibility-utils'

export interface FilterOption {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  color?: string
}

export interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
  placeholder?: string
}

export interface FilterBarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: FilterConfig[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onClearAll?: () => void
  showSearch?: boolean
  showFilterToggle?: boolean
  className?: string
  compact?: boolean
}

export function FilterBar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearAll,
  showSearch = true,
  showFilterToggle = true,
  className,
  compact = false
}: FilterBarProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(!compact)

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== 'all' && value !== '')
  const hasActiveSearch = searchValue.length > 0

  const clearFilter = (key: string) => {
    onFilterChange?.(key, 'all')
  }

  const clearAllFilters = () => {
    onClearAll?.()
    if (onSearchChange) {
      onSearchChange('')
    }
  }

  const getActiveFilterLabel = (filterKey: string, value: string) => {
    const filter = filters.find(f => f.key === filterKey)
    const option = filter?.options.find(o => o.value === value)
    return option?.label || value
  }

  return (
    <div
      className={cn("border-b border-gray-200 bg-gray-50", className)}
      role={ARIA_ROLES.search}
      aria-label="Filter and search controls"
    >
      {/* Main Filter Bar */}
      <div className="p-4 space-y-4">
        {/* Top Row - Search and Filter Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 h-10 sm:h-9" // Larger touch target on mobile
                aria-label={searchPlaceholder}
                aria-describedby="search-help"
              />
              <span id="search-help" className="sr-only">
                Type to search and filter results. Use arrow keys to navigate filters.
              </span>
            </div>
          )}

          {/* Filter Toggle and Status */}
          <div className="flex items-center justify-between sm:justify-start gap-2 flex-shrink-0">
            {(hasActiveFilters || hasActiveSearch) && (
              <Badge variant="secondary" className="text-xs">
                {(hasActiveFilters ? Object.values(activeFilters).filter(v => v !== 'all' && v !== '').length : 0) + 
                 (hasActiveSearch ? 1 : 0)} active
              </Badge>
            )}
            
            {showFilterToggle && filters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="flex items-center gap-2"
                aria-expanded={filtersExpanded}
                aria-controls="filter-controls"
                aria-label={`${filtersExpanded ? 'Hide' : 'Show'} filter options`}
              >
                <Filter className="h-4 w-4" aria-hidden="true" />
                Filters
                {filtersExpanded ? (
                  <ChevronUp className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-3 w-3" aria-hidden="true" />
                )}
              </Button>
            )}

            {(hasActiveFilters || hasActiveSearch) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Clear all active filters and search"
                type="button"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        {filtersExpanded && filters.length > 0 && (
          <div
            id="filter-controls"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4"
            role="group"
            aria-label="Filter options"
          >
            {filters.map((filter, index) => (
              <div key={filter.key} className="space-y-2">
                <label
                  htmlFor={`filter-${filter.key}`}
                  className="text-xs font-medium text-gray-700 block"
                >
                  {filter.label}
                </label>
                <Select
                  value={activeFilters[filter.key] || 'all'}
                  onValueChange={(value) => onFilterChange?.(filter.key, value)}
                >
                  <SelectTrigger
                    id={`filter-${filter.key}`}
                    className="h-10 sm:h-8 text-sm sm:text-xs w-full"
                    aria-label={`Filter by ${filter.label}`}
                    aria-describedby={`filter-${filter.key}-help`}
                  >
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent role="listbox" aria-label={`${filter.label} options`}>
                    {filter.options.map(option => {
                      const Icon = option.icon
                      return (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          role="option"
                          aria-selected={activeFilters[filter.key] === option.value}
                        >
                          <div className="flex items-center gap-2">
                            {Icon && (
                              <Icon
                                className={cn("h-3 w-3", option.color || "text-gray-600")}
                                aria-hidden="true"
                              />
                            )}
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <span id={`filter-${filter.key}-help`} className="sr-only">
                  Use arrow keys to navigate options, Enter to select
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Active Filters Display */}
        {(hasActiveFilters || hasActiveSearch) && (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Active filters"
            aria-live="polite"
          >
            {/* Search Badge */}
            {hasActiveSearch && (
              <Badge variant="outline" className="text-xs flex items-center gap-1 max-w-full">
                <span className="truncate">Search: "{searchValue}"</span>
                <button
                  onClick={() => onSearchChange?.('')}
                  className="ml-1 hover:text-red-600 flex-shrink-0 p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Clear search filter: ${searchValue}`}
                  type="button"
                >
                  <X className="h-3 w-3 sm:h-2 sm:w-2" aria-hidden="true" />
                </button>
              </Badge>
            )}

            {/* Filter Badges */}
            {Object.entries(activeFilters).map(([key, value]) => {
              if (value === 'all' || value === '') return null

              const filterLabel = filters.find(f => f.key === key)?.label || key
              const valueLabel = getActiveFilterLabel(key, value)

              return (
                <Badge key={key} variant="outline" className="text-xs flex items-center gap-1 max-w-full">
                  <span className="truncate">
                    <span className="hidden sm:inline">{filterLabel}: </span>
                    {valueLabel}
                  </span>
                  <button
                    onClick={() => clearFilter(key)}
                    className="ml-1 hover:text-red-600 flex-shrink-0 p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Clear ${filterLabel} filter: ${valueLabel}`}
                    type="button"
                  >
                    <X className="h-3 w-3 sm:h-2 sm:w-2" aria-hidden="true" />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
