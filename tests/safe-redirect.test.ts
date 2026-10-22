import { describe, expect, it } from 'vitest'
import { normalizeRedirectPath } from '@/lib/safe-redirect'

describe('normalizeRedirectPath', () => {
  it('keeps allowed internal paths with query and hash', () => {
    expect(normalizeRedirectPath('/dashboard?course=starter-free#lesson')).toBe(
      '/dashboard?course=starter-free#lesson',
    )
    expect(normalizeRedirectPath('/api/checkout?product=claude-code&tier=self')).toBe(
      '/api/checkout?product=claude-code&tier=self',
    )
  })

  it('lets admins come back to the admin pages', () => {
    expect(normalizeRedirectPath('/admin/products')).toBe('/admin/products')
    expect(normalizeRedirectPath('/admin/stats')).toBe('/admin/stats')
  })

  it.each([
    'https://evil.example/dashboard',
    '//evil.example/dashboard',
    '/admin',
    'dashboard',
    '',
  ])('rejects unsafe or unsupported next value %s', (value) => {
    expect(normalizeRedirectPath(value)).toBe('/dashboard')
  })

  it('uses the caller fallback when no next value is present', () => {
    expect(normalizeRedirectPath(undefined, '/dashboard')).toBe('/dashboard')
  })
})
