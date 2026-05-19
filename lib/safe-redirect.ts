const ALLOWED_REDIRECT_PATHS = ['/', '/dashboard', '/api/checkout']

export function normalizeRedirectPath(
  value: string | null | undefined,
  fallback = '/api/checkout',
) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  try {
    const url = new URL(value, 'http://local')
    const isAllowed = ALLOWED_REDIRECT_PATHS.includes(url.pathname)

    if (!isAllowed) {
      return fallback
    }

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}
