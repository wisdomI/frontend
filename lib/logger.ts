type LogLevel = 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp: string
}

const pushToBuffer = (entry: LogEntry) => {
  if (typeof window === 'undefined') return
  const bufferKey = '__EVENT_HUB_LOGS__'
  const existing = (window as any)[bufferKey] as LogEntry[] | undefined
  if (existing) {
    existing.push(entry)
  } else {
    ;(window as any)[bufferKey] = [entry]
  }
}

const emit = (level: LogLevel, message: string, context?: Record<string, unknown>) => {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  }
  pushToBuffer(entry)

  const logPayload = context ? [message, context] : [message]
  switch (level) {
    case 'info':
      console.info('[EventHub]', ...logPayload)
      break
    case 'warn':
      console.warn('[EventHub]', ...logPayload)
      break
    case 'error':
      console.error('[EventHub]', ...logPayload)
      break
  }
}

export const logInfo = (message: string, context?: Record<string, unknown>) =>
  emit('info', message, context)

export const logWarn = (message: string, context?: Record<string, unknown>) =>
  emit('warn', message, context)

export const logError = (message: string, context?: Record<string, unknown>) =>
  emit('error', message, context)

export const reportNetworkFailure = (context: {
  operation: string
  endpoint?: string
  error?: unknown
}) => {
  logError('Network request failed', context as Record<string, unknown>)
}

