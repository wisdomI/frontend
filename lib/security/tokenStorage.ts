const ACCESS_KEY = 'eh::access'
const REFRESH_KEY = 'eh::refresh'
const SECRET = process.env.NEXT_PUBLIC_TOKEN_SECRET || 'event-hub-secret'

const isBrowser = () => typeof window !== 'undefined'

const encode = (value: string) => {
  if (!isBrowser()) return value
  return btoa(`${SECRET}:${value}`)
}

const decode = (value: string | null) => {
  if (!isBrowser() || !value) return value || null
  try {
    const decoded = atob(value)
    const [, token = ''] = decoded.split(`${SECRET}:`)
    return token || null
  } catch {
    return null
  }
}

const setItem = (key: string, value: string | null) => {
  if (!isBrowser()) return
  if (value) {
    sessionStorage.setItem(key, encode(value))
  } else {
    sessionStorage.removeItem(key)
  }
}

const getItem = (key: string) => {
  if (!isBrowser()) return null
  return decode(sessionStorage.getItem(key))
}

export const tokenStorage = {
  setTokens: (tokens: { accessToken?: string | null; refreshToken?: string | null }) => {
    if (tokens.accessToken !== undefined) {
      setItem(ACCESS_KEY, tokens.accessToken)
    }
    if (tokens.refreshToken !== undefined) {
      setItem(REFRESH_KEY, tokens.refreshToken)
    }
  },
  getAccessToken: () => getItem(ACCESS_KEY),
  getRefreshToken: () => getItem(REFRESH_KEY),
  clear: () => {
    if (!isBrowser()) return
    sessionStorage.removeItem(ACCESS_KEY)
    sessionStorage.removeItem(REFRESH_KEY)
  },
}

