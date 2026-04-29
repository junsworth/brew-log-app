import { describe, expect, it } from 'vitest'
import { getBjcpVitals, BJCP_VITALS, type StyleVitals } from '../bjcpVitals'

describe('getBjcpVitals', () => {
  it('returns null for an empty string', () => {
    expect(getBjcpVitals('')).toBeNull()
  })

  it('returns null for an unrecognised style', () => {
    expect(getBjcpVitals('99Z. Imaginary Beer')).toBeNull()
  })

  it('returns null for a category header that has no vitals entry', () => {
    // Category headers like "1. Standard American Beer" are non-selectable
    // group labels and have no entry in BJCP_VITALS
    expect(getBjcpVitals('1. Standard American Beer')).toBeNull()
  })

  it('returns null for "27. Historical Beer" which has no defined ranges', () => {
    expect(getBjcpVitals('27. Historical Beer')).toBeNull()
  })

  it('returns correct vitals for a known style', () => {
    const vitals = getBjcpVitals('1A. American Light Lager')
    expect(vitals).not.toBeNull()
    expect(vitals!.ibu).toEqual([8, 12])
    expect(vitals!.srm).toEqual([2, 3])
    expect(vitals!.og).toEqual([1.028, 1.040])
    expect(vitals!.fg).toEqual([0.998, 1.008])
    expect(vitals!.abv).toEqual([2.8, 4.2])
  })

  it('returns correct vitals for a high-IBU style', () => {
    const vitals = getBjcpVitals('22A. Double IPA')
    expect(vitals).not.toBeNull()
    expect(vitals!.ibu).toEqual([60, 120])
    expect(vitals!.abv).toEqual([7.5, 10.0])
  })

  it('returns correct vitals for a sour ale with near-zero IBU', () => {
    const vitals = getBjcpVitals('23D. Lambic')
    expect(vitals).not.toBeNull()
    expect(vitals!.ibu).toEqual([0, 10])
  })

  describe('data integrity — every entry has valid ranges', () => {
    const entries = Object.entries(BJCP_VITALS) as [string, StyleVitals][]
    const STAT_KEYS: (keyof StyleVitals)[] = ['ibu', 'srm', 'og', 'fg', 'abv']

    it('every entry has all five stat keys', () => {
      for (const [style, vitals] of entries) {
        for (const key of STAT_KEYS) {
          expect(vitals[key], `${style} is missing "${key}"`).toBeDefined()
          expect(Array.isArray(vitals[key]), `${style}.${key} is not an array`).toBe(true)
          expect(vitals[key].length, `${style}.${key} does not have 2 elements`).toBe(2)
        }
      }
    })

    it('every entry has min <= max for all stats', () => {
      for (const [style, vitals] of entries) {
        for (const key of STAT_KEYS) {
          const [min, max] = vitals[key]
          expect(min, `${style}.${key} min (${min}) > max (${max})`).toBeLessThanOrEqual(max)
        }
      }
    })

    it('IBU values are within plausible range (0–120)', () => {
      for (const [style, vitals] of entries) {
        expect(vitals.ibu[0], `${style} IBU min < 0`).toBeGreaterThanOrEqual(0)
        expect(vitals.ibu[1], `${style} IBU max > 120`).toBeLessThanOrEqual(120)
      }
    })

    it('OG values are plausible gravity readings (1.000–1.130)', () => {
      for (const [style, vitals] of entries) {
        expect(vitals.og[0], `${style} OG min < 1.000`).toBeGreaterThanOrEqual(1.000)
        expect(vitals.og[1], `${style} OG max > 1.130`).toBeLessThanOrEqual(1.130)
      }
    })

    it('ABV values are plausible percentages (0–20)', () => {
      for (const [style, vitals] of entries) {
        expect(vitals.abv[0], `${style} ABV min < 0`).toBeGreaterThanOrEqual(0)
        expect(vitals.abv[1], `${style} ABV max > 20`).toBeLessThanOrEqual(20)
      }
    })
  })
})
