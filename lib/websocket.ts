import { WebSocketMessage, MessageWebSocketData, NotificationWebSocketData } from '@/types/api'

export interface WebSocketConfig {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
}

export interface WebSocketEventHandlers {
  onMessage?: (message: WebSocketMessage) => void
  onNotification?: (notification: NotificationWebSocketData) => void
  onStatusUpdate?: (data: any) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
}

export class WebSocketManager {
  private ws: WebSocket | null = null
  private config: WebSocketConfig
  private handlers: WebSocketEventHandlers
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private isManualClose = false

  constructor(config: WebSocketConfig, handlers: WebSocketEventHandlers = {}) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...config
    }
    this.handlers = handlers
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      this.ws = new WebSocket(this.config.url)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.startHeartbeat()
        this.handlers.onConnect?.()
      }

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        this.stopHeartbeat()
        this.handlers.onDisconnect?.()

        if (!this.isManualClose && this.reconnectAttempts < this.config.maxReconnectAttempts!) {
          this.scheduleReconnect()
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.handlers.onError?.(error)
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
    }
  }

  disconnect(): void {
    this.isManualClose = true
    this.stopHeartbeat()
    this.clearReconnectTimer()
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(data: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
      return true
    }
    return false
  }

  sendMessage(messageData: MessageWebSocketData): boolean {
    return this.send({
      type: 'message',
      data: messageData,
      timestamp: new Date().toISOString()
    })
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'message':
        this.handlers.onMessage?.(message)
        break
      case 'notification':
        this.handlers.onNotification?.(message.data)
        break
      case 'status_update':
        this.handlers.onStatusUpdate?.(message.data)
        break
      default:
        console.log('Unknown message type:', message.type)
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`)
      this.connect()
    }, this.config.reconnectInterval)
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()
    
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' })
      }
    }, this.config.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// React hook for WebSocket connection
export function useWebSocket(
  url: string,
  handlers: WebSocketEventHandlers = {},
  options: Partial<WebSocketConfig> = {}
) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Event | null>(null)
  const wsManagerRef = useRef<WebSocketManager | null>(null)

  useEffect(() => {
    const config: WebSocketConfig = {
      url,
      ...options
    }

    const wsHandlers: WebSocketEventHandlers = {
      ...handlers,
      onConnect: () => {
        setIsConnected(true)
        setError(null)
        handlers.onConnect?.()
      },
      onDisconnect: () => {
        setIsConnected(false)
        handlers.onDisconnect?.()
      },
      onError: (error) => {
        setError(error)
        handlers.onError?.(error)
      }
    }

    wsManagerRef.current = new WebSocketManager(config, wsHandlers)
    wsManagerRef.current.connect()

    return () => {
      wsManagerRef.current?.disconnect()
    }
  }, [url, handlers, options])

  const send = useCallback((data: any): boolean => {
    return wsManagerRef.current?.send(data) ?? false
  }, [])

  const sendMessage = useCallback((messageData: MessageWebSocketData): boolean => {
    return wsManagerRef.current?.sendMessage(messageData) ?? false
  }, [])

  const disconnect = useCallback(() => {
    wsManagerRef.current?.disconnect()
  }, [])

  const connect = useCallback(() => {
    wsManagerRef.current?.connect()
  }, [])

  return {
    isConnected,
    error,
    send,
    sendMessage,
    disconnect,
    connect,
    readyState: wsManagerRef.current?.readyState ?? WebSocket.CLOSED
  }
}

// Import React hooks
import { useState, useEffect, useRef, useCallback } from 'react'
