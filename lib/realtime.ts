import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
})

// Client-side Pusher instance (for frontend)
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: '/api/pusher/auth',
    auth: {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
)

export interface NotificationData {
  id: string
  userId: string
  title: string
  message: string
  type: 'claim_assignment' | 'payment' | 'message' | 'firm_connection' | 'system' | 'urgent'
  data?: Record<string, any>
  timestamp: Date
}

export interface ClaimUpdateData {
  claimId: string
  status: string
  assignedTo?: string
  updatedBy: string
  timestamp: Date
  changes: Record<string, any>
}

export interface MessageData {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: 'text' | 'file' | 'system'
}

export class RealtimeService {
  // Send notification to specific user
  async sendNotification(notification: NotificationData) {
    try {
      const channel = `private-user-${notification.userId}`
      
      await pusher.trigger(channel, 'notification', {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        data: notification.data,
        timestamp: notification.timestamp.toISOString()
      })

      console.log(`Notification sent to user ${notification.userId}`)
      return true
    } catch (error) {
      console.error('Failed to send notification:', error)
      return false
    }
  }

  // Send claim update to all relevant users
  async sendClaimUpdate(claimUpdate: ClaimUpdateData, userIds: string[]) {
    try {
      const promises = userIds.map(userId => {
        const channel = `private-user-${userId}`
        return pusher.trigger(channel, 'claim-update', {
          claimId: claimUpdate.claimId,
          status: claimUpdate.status,
          assignedTo: claimUpdate.assignedTo,
          updatedBy: claimUpdate.updatedBy,
          timestamp: claimUpdate.timestamp.toISOString(),
          changes: claimUpdate.changes
        })
      })

      await Promise.all(promises)
      console.log(`Claim update sent to ${userIds.length} users`)
      return true
    } catch (error) {
      console.error('Failed to send claim update:', error)
      return false
    }
  }

  // Send message in conversation
  async sendMessage(message: MessageData, participantIds: string[]) {
    try {
      const channel = `private-conversation-${message.conversationId}`
      
      await pusher.trigger(channel, 'new-message', {
        id: message.id,
        senderId: message.senderId,
        senderName: message.senderName,
        content: message.content,
        timestamp: message.timestamp.toISOString(),
        type: message.type
      })

      // Also send notification to participants (except sender)
      const notificationPromises = participantIds
        .filter(id => id !== message.senderId)
        .map(userId => {
          return this.sendNotification({
            id: `msg-${message.id}`,
            userId,
            title: `New message from ${message.senderName}`,
            message: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : ''),
            type: 'message',
            data: {
              conversationId: message.conversationId,
              messageId: message.id
            },
            timestamp: message.timestamp
          })
        })

      await Promise.all(notificationPromises)
      console.log(`Message sent to conversation ${message.conversationId}`)
      return true
    } catch (error) {
      console.error('Failed to send message:', error)
      return false
    }
  }

  // Send system-wide announcement
  async sendSystemAnnouncement(title: string, message: string, userIds?: string[]) {
    try {
      if (userIds) {
        // Send to specific users
        const promises = userIds.map(userId => {
          return this.sendNotification({
            id: `system-${Date.now()}`,
            userId,
            title,
            message,
            type: 'system',
            timestamp: new Date()
          })
        })
        await Promise.all(promises)
      } else {
        // Send to all users via public channel
        await pusher.trigger('public-announcements', 'system-announcement', {
          title,
          message,
          timestamp: new Date().toISOString()
        })
      }

      console.log('System announcement sent')
      return true
    } catch (error) {
      console.error('Failed to send system announcement:', error)
      return false
    }
  }

  // Send urgent alert (high priority)
  async sendUrgentAlert(userId: string, title: string, message: string, data?: Record<string, any>) {
    try {
      const channel = `private-user-${userId}`
      
      await pusher.trigger(channel, 'urgent-alert', {
        title,
        message,
        data,
        timestamp: new Date().toISOString()
      })

      // Also send as notification
      await this.sendNotification({
        id: `urgent-${Date.now()}`,
        userId,
        title,
        message,
        type: 'urgent',
        data,
        timestamp: new Date()
      })

      console.log(`Urgent alert sent to user ${userId}`)
      return true
    } catch (error) {
      console.error('Failed to send urgent alert:', error)
      return false
    }
  }

  // Send typing indicator
  async sendTypingIndicator(conversationId: string, userId: string, isTyping: boolean) {
    try {
      const channel = `private-conversation-${conversationId}`
      
      await pusher.trigger(channel, 'typing', {
        userId,
        isTyping,
        timestamp: new Date().toISOString()
      })

      return true
    } catch (error) {
      console.error('Failed to send typing indicator:', error)
      return false
    }
  }

  // Send user presence update
  async updateUserPresence(userId: string, status: 'online' | 'away' | 'offline') {
    try {
      await pusher.trigger('presence-users', 'user-status', {
        userId,
        status,
        timestamp: new Date().toISOString()
      })

      console.log(`User ${userId} status updated to ${status}`)
      return true
    } catch (error) {
      console.error('Failed to update user presence:', error)
      return false
    }
  }

  // Authenticate user for private channels
  authenticateUser(socketId: string, channel: string, userId: string) {
    try {
      // Verify user has access to this channel
      if (channel.startsWith('private-user-') && !channel.endsWith(`-${userId}`)) {
        throw new Error('Unauthorized access to user channel')
      }

      if (channel.startsWith('private-conversation-')) {
        // Additional validation for conversation access would go here
        // Check if user is participant in the conversation
      }

      const auth = pusher.authenticate(socketId, channel, {
        user_id: userId,
        user_info: {
          id: userId
        }
      })

      return auth
    } catch (error) {
      console.error('Authentication failed:', error)
      throw error
    }
  }

  // Get channel info
  async getChannelInfo(channel: string) {
    try {
      const info = await pusher.get({ path: `/channels/${channel}` })
      return info
    } catch (error) {
      console.error('Failed to get channel info:', error)
      return null
    }
  }

  // Get all channels
  async getAllChannels() {
    try {
      const channels = await pusher.get({ path: '/channels' })
      return channels
    } catch (error) {
      console.error('Failed to get channels:', error)
      return null
    }
  }

  // Disconnect user from all channels
  async disconnectUser(userId: string) {
    try {
      // Update user presence to offline
      await this.updateUserPresence(userId, 'offline')
      
      // Additional cleanup if needed
      console.log(`User ${userId} disconnected`)
      return true
    } catch (error) {
      console.error('Failed to disconnect user:', error)
      return false
    }
  }
}

export const realtimeService = new RealtimeService()

// Client-side hooks for React components
export const useRealtime = () => {
  const subscribe = (channel: string, event: string, callback: (data: any) => void) => {
    const channelInstance = pusherClient.subscribe(channel)
    channelInstance.bind(event, callback)
    
    return () => {
      channelInstance.unbind(event, callback)
      pusherClient.unsubscribe(channel)
    }
  }

  const subscribeToUser = (userId: string, callback: (data: NotificationData) => void) => {
    return subscribe(`private-user-${userId}`, 'notification', callback)
  }

  const subscribeToConversation = (conversationId: string, callback: (data: MessageData) => void) => {
    return subscribe(`private-conversation-${conversationId}`, 'new-message', callback)
  }

  const subscribeToClaimUpdates = (userId: string, callback: (data: ClaimUpdateData) => void) => {
    return subscribe(`private-user-${userId}`, 'claim-update', callback)
  }

  const subscribeToUrgentAlerts = (userId: string, callback: (data: any) => void) => {
    return subscribe(`private-user-${userId}`, 'urgent-alert', callback)
  }

  return {
    subscribe,
    subscribeToUser,
    subscribeToConversation,
    subscribeToClaimUpdates,
    subscribeToUrgentAlerts
  }
}
