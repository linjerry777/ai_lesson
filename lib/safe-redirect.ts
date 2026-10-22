// Where a login may send you back to. The old /api/checkout course flow is off, so the
// default is now the dashboard (earlier course buyers) instead of a dead checkout.
const ALLOWED_REDIRECT_PATHS = ['/', '/dashboard', '/api/checkout', '/admin/stats', '/admin/products', '/orders']

export function normalizeRedirectPath(
  value: string | null | undefined,
  fallback = '/dashboard',
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
