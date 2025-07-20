import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AIChatWidget } from '@/components/ai-chat-widget'

// Mock the fetch function
global.fetch = jest.fn()

describe('AIChatWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the chat trigger button when closed', () => {
    render(<AIChatWidget />)
    
    const triggerButton = screen.getByLabelText('Open AI Assistant')
    expect(triggerButton).toBeInTheDocument()
  })

  it('opens the chat widget when trigger button is clicked', () => {
    render(<AIChatWidget />)
    
    const triggerButton = screen.getByLabelText('Open AI Assistant')
    fireEvent.click(triggerButton)
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
  })

  it('closes the chat widget when close button is clicked', () => {
    render(<AIChatWidget />)
    
    // Open the widget
    const triggerButton = screen.getByLabelText('Open AI Assistant')
    fireEvent.click(triggerButton)
    
    // Close the widget
    const closeButton = screen.getByLabelText('Close chat')
    fireEvent.click(closeButton)
    
    expect(screen.queryByText('AI Assistant')).not.toBeInTheDocument()
  })

  it('sends a message when send button is clicked', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ message: 'Hello! How can I help you?' })
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    render(<AIChatWidget />)
    
    // Open the widget
    const triggerButton = screen.getByLabelText('Open AI Assistant')
    fireEvent.click(triggerButton)
    
    // Type a message
    const input = screen.getByPlaceholderText('Type your message...')
    fireEvent.change(input, { target: { value: 'Hello' } })
    
    // Send the message
    const sendButton = screen.getByLabelText('Send message')
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello' })
      })
    })
  })

  it('shows loading state when sending a message', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ message: 'Hello! How can I help you?' })
    }
    ;(global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
    )

    render(<AIChatWidget />)
    
    // Open the widget
    const triggerButton = screen.getByLabelText('Open AI Assistant')
    fireEvent.click(triggerButton)
    
    // Type a message
    const input = screen.getByPlaceholderText('Type your message...')
    fireEvent.change(input, { target: { value: 'Hello' } })
    
    // Send the message
    const sendButton = screen.getByLabelText('Send message')
    fireEvent.click(sendButton)
    
    // Check for loading state
    expect(sendButton).toBeDisabled()
    
    await waitFor(() => {
      expect(sendButton).not.toBeDisabled()
    })
  })

  it('handles API errors gracefully', async () => {
    const mockResponse = {
      ok: false,
      status: 500
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    render(<AIChatWidget />)
    
    // Open the widget
    const triggerButton = screen.getByLabelText('Open AI Assistant')
    fireEvent.click(triggerButton)
    
    // Type a message
    const input = screen.getByPlaceholderText('Type your message...')
    fireEvent.change(input, { target: { value: 'Hello' } })
    
    // Send the message
    const sendButton = screen.getByLabelText('Send message')
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/)).toBeInTheDocument()
    })
  })

  it('minimizes and maximizes the chat widget', () => {
    render(<AIChatWidget />)
    
    // Open the widget
    const triggerButton = screen.getByLabelText('Open AI Assistant')
    fireEvent.click(triggerButton)
    
    // Minimize the widget
    const minimizeButton = screen.getByLabelText('Minimize chat')
    fireEvent.click(minimizeButton)
    
    // Check that content is hidden but widget is still open
    expect(screen.queryByPlaceholderText('Type your message...')).not.toBeInTheDocument()
    
    // Maximize the widget
    const maximizeButton = screen.getByLabelText('Maximize chat')
    fireEvent.click(maximizeButton)
    
    // Check that content is visible again
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument()
  })
})
