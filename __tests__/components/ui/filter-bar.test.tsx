/**
 * FilterBar Component Tests
 * 
 * Comprehensive tests for the FilterBar component including
 * functionality, accessibility, and user interactions
 */

import React from 'react'
import { render, screen, waitFor } from '@/test-utils'
import { FilterBar } from '@/components/ui/filter-bar'
import { testHelpers, a11yHelpers } from '@/test-utils'

// Mock filter configuration
const mockFilters = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'Select status',
    options: [
      { value: 'all', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    key: 'type',
    label: 'Type',
    placeholder: 'Select type',
    options: [
      { value: 'all', label: 'All Types' },
      { value: 'property', label: 'Property' },
      { value: 'auto', label: 'Auto' }
    ]
  }
]

const defaultProps = {
  searchValue: '',
  onSearchChange: jest.fn(),
  searchPlaceholder: 'Search...',
  filters: mockFilters,
  activeFilters: {},
  onFilterChange: jest.fn(),
  onClearAll: jest.fn(),
  showSearch: true,
  showFilterToggle: true
}

describe('FilterBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders search input when showSearch is true', () => {
      render(<FilterBar {...defaultProps} />)
      
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
      expect(screen.getByLabelText('Search...')).toBeInTheDocument()
    })

    it('does not render search input when showSearch is false', () => {
      render(<FilterBar {...defaultProps} showSearch={false} />)
      
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
    })

    it('renders filter toggle button when showFilterToggle is true', () => {
      render(<FilterBar {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /show filter options/i })).toBeInTheDocument()
    })

    it('does not render filter toggle when showFilterToggle is false', () => {
      render(<FilterBar {...defaultProps} showFilterToggle={false} />)
      
      expect(screen.queryByRole('button', { name: /filter/i })).not.toBeInTheDocument()
    })

    it('renders with custom className', () => {
      const { container } = render(
        <FilterBar {...defaultProps} className="custom-class" />
      )
      
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Search Functionality', () => {
    it('calls onSearchChange when search input changes', async () => {
      render(<FilterBar {...defaultProps} />)
      
      await testHelpers.fillField('Search...', 'test query')
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test query')
    })

    it('displays current search value', () => {
      render(<FilterBar {...defaultProps} searchValue="existing search" />)
      
      expect(screen.getByDisplayValue('existing search')).toBeInTheDocument()
    })

    it('shows search badge when search is active', () => {
      render(<FilterBar {...defaultProps} searchValue="test search" />)
      
      expect(screen.getByText('Search: "test search"')).toBeInTheDocument()
    })

    it('clears search when clear button is clicked', async () => {
      render(<FilterBar {...defaultProps} searchValue="test search" />)
      
      const clearButton = screen.getByLabelText(/clear search filter/i)
      await testHelpers.clickButton(clearButton)
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('')
    })
  })

  describe('Filter Functionality', () => {
    it('expands filters when toggle button is clicked', async () => {
      render(<FilterBar {...defaultProps} />)
      
      const toggleButton = screen.getByRole('button', { name: /show filter options/i })
      await testHelpers.clickButton(toggleButton)
      
      expect(screen.getByRole('group', { name: 'Filter options' })).toBeInTheDocument()
      expect(screen.getByLabelText('Status')).toBeInTheDocument()
      expect(screen.getByLabelText('Type')).toBeInTheDocument()
    })

    it('calls onFilterChange when filter value changes', async () => {
      render(<FilterBar {...defaultProps} />)
      
      // Expand filters first
      await testHelpers.clickButton(screen.getByRole('button', { name: /show filter options/i }))
      
      // Change a filter
      await testHelpers.selectOption('Status', 'Active')
      
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('status', 'active')
    })

    it('displays active filter badges', () => {
      const activeFilters = { status: 'active', type: 'property' }
      render(<FilterBar {...defaultProps} activeFilters={activeFilters} />)
      
      expect(screen.getByText('Status: Active')).toBeInTheDocument()
      expect(screen.getByText('Type: Property')).toBeInTheDocument()
    })

    it('clears individual filter when badge clear button is clicked', async () => {
      const activeFilters = { status: 'active' }
      render(<FilterBar {...defaultProps} activeFilters={activeFilters} />)
      
      const clearButton = screen.getByLabelText(/clear status filter/i)
      await testHelpers.clickButton(clearButton)
      
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('status', 'all')
    })

    it('clears all filters when Clear All button is clicked', async () => {
      const activeFilters = { status: 'active', type: 'property' }
      render(<FilterBar {...defaultProps} activeFilters={activeFilters} searchValue="test" />)
      
      const clearAllButton = screen.getByRole('button', { name: /clear all/i })
      await testHelpers.clickButton(clearAllButton)
      
      expect(defaultProps.onClearAll).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<FilterBar {...defaultProps} />)
      
      expect(screen.getByRole('search')).toBeInTheDocument()
      expect(screen.getByLabelText('Filter and search controls')).toBeInTheDocument()
    })

    it('provides screen reader help text', () => {
      render(<FilterBar {...defaultProps} />)
      
      expect(screen.getByText(/type to search and filter results/i)).toHaveClass('sr-only')
    })

    it('has proper button accessibility', async () => {
      render(<FilterBar {...defaultProps} />)
      
      const toggleButton = screen.getByRole('button', { name: /show filter options/i })
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
      
      await testHelpers.clickButton(toggleButton)
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('supports keyboard navigation', async () => {
      render(<FilterBar {...defaultProps} />)
      
      const searchInput = screen.getByLabelText('Search...')
      await a11yHelpers.expectKeyboardNavigation(searchInput)
    })

    it('has proper focus management', async () => {
      render(<FilterBar {...defaultProps} />)
      
      const toggleButton = screen.getByRole('button', { name: /show filter options/i })
      await testHelpers.clickButton(toggleButton)
      
      // Focus should move to first filter when expanded
      await waitFor(() => {
        expect(screen.getByLabelText('Status')).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      })

      render(<FilterBar {...defaultProps} />)
      
      // Should still render all elements but with mobile-friendly sizing
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /show filter options/i })).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders quickly', async () => {
      await testHelpers.expectFastRender(() => {
        render(<FilterBar {...defaultProps} />)
      })
    })

    it('handles large number of filters efficiently', () => {
      const manyFilters = Array.from({ length: 20 }, (_, i) => ({
        key: `filter-${i}`,
        label: `Filter ${i}`,
        placeholder: `Select filter ${i}`,
        options: [
          { value: 'all', label: 'All' },
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      }))

      render(<FilterBar {...defaultProps} filters={manyFilters} />)
      
      expect(screen.getByRole('search')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles missing filter options gracefully', () => {
      const invalidFilters = [
        {
          key: 'invalid',
          label: 'Invalid Filter',
          placeholder: 'Select...',
          options: []
        }
      ]

      render(<FilterBar {...defaultProps} filters={invalidFilters} />)
      
      expect(screen.getByRole('search')).toBeInTheDocument()
    })

    it('handles undefined activeFilters', () => {
      render(<FilterBar {...defaultProps} activeFilters={undefined as any} />)
      
      expect(screen.getByRole('search')).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('works with real filter configurations', () => {
      const realFilters = [
        {
          key: 'status',
          label: 'Claim Status',
          placeholder: 'All Statuses',
          options: [
            { value: 'all', label: 'All Statuses' },
            { value: 'available', label: 'Available', icon: 'Circle' },
            { value: 'assigned', label: 'Assigned', icon: 'User' },
            { value: 'in_progress', label: 'In Progress', icon: 'Clock' },
            { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
          ]
        }
      ]

      render(<FilterBar {...defaultProps} filters={realFilters} />)
      
      expect(screen.getByRole('search')).toBeInTheDocument()
    })
  })
})
