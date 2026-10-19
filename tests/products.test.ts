import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { PRODUCTS, getProduct, priceLabel } from '@/lib/products'

describe('storefront catalogue', () => {
  it('has unique slugs', () => {
    expect(new Set(PRODUCTS.map(p => p.slug)).size).toBe(PRODUCTS.length)
  })

  it('every sellable product meets the reproducibility rule and has a price', () => {
    for (const product of PRODUCTS.filter(p => p.status !== 'soon')) {
      expect(product.price, product.slug).toBeGreaterThan(0)
      expect(product.includes.length, product.slug).toBeGreaterThan(0)
      expect(product.requirements.length, product.slug).toBeGreaterThan(0)
      expect(product.excluded.length, product.slug).toBeGreaterThan(0)
    }
  })

  it('references assets that exist', () => {
    for (const product of PRODUCTS) {
      expect(existsSync(path.join('public', 'stickers', `${product.sticker}.webp`)), product.sticker).toBe(true)
      for (const preview of product.previews ?? []) {
        expect(existsSync(path.join('public', preview.src)), preview.src).toBe(true)
        expect(existsSync(path.join('public', preview.poster)), preview.poster).toBe(true)
      }
    }
  })

  it('labels prices', () => {
    expect(priceLabel(getProduct('shorts-studio-kit')!)).toBe('NT$790')
    expect(priceLabel(getProduct('mystery-doc-kit')!)).toBe('即將推出')
  })
})
