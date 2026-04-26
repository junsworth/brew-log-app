import { describe, expect, it } from 'vitest'
import {
  calculateAbv,
  calculateApparentAttenuation,
  parseGravity,
  toNumber,
} from '../brewing'

describe('toNumber', () => {
  it('parses a valid integer string', () => {
    expect(toNumber('42')).toBe(42)
  })

  it('parses a valid decimal string', () => {
    expect(toNumber('3.14')).toBe(3.14)
  })

  it('returns 0 for an empty string — Number("") coerces to 0', () => {
    // JS: Number('') === 0, which is finite, so toNumber returns 0 not null
    expect(toNumber('')).toBe(0)
  })

  it('returns null for a non-numeric string', () => {
    expect(toNumber('abc')).toBeNull()
  })

  it('returns null for Infinity', () => {
    expect(toNumber('Infinity')).toBeNull()
  })
})

describe('parseGravity', () => {
  it('accepts a valid 1.xxx gravity reading', () => {
    expect(parseGravity('1.050')).toBe(1.05)
  })

  it('accepts gravity at the boundaries — 1.000 and 1.999', () => {
    expect(parseGravity('1.000')).toBe(1.0)
    expect(parseGravity('1.999')).toBe(1.999)
  })

  it('trims leading/trailing whitespace before matching', () => {
    expect(parseGravity('  1.048  ')).toBe(1.048)
  })

  it('returns null for a value without the 1. prefix', () => {
    expect(parseGravity('0.998')).toBeNull()
  })

  it('returns null for a value with fewer than 3 decimal digits', () => {
    expect(parseGravity('1.05')).toBeNull()
  })

  it('returns null for a value with more than 3 decimal digits', () => {
    expect(parseGravity('1.0500')).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(parseGravity('')).toBeNull()
  })
})

describe('calculateAbv', () => {
  it('calculates ABV correctly for a standard ale', () => {
    // (1.050 - 1.010) * 131.25 = 5.25
    expect(calculateAbv('1.050', '1.010')).toBeCloseTo(5.25)
  })

  it('calculates ABV for a high-gravity beer', () => {
    // (1.090 - 1.015) * 131.25 = 9.84375
    expect(calculateAbv('1.090', '1.015')).toBeCloseTo(9.84)
  })

  it('returns null when OG equals FG', () => {
    expect(calculateAbv('1.050', '1.050')).toBeNull()
  })

  it('returns null when OG is less than FG', () => {
    expect(calculateAbv('1.010', '1.050')).toBeNull()
  })

  it('returns null for an invalid OG string', () => {
    expect(calculateAbv('', '1.010')).toBeNull()
  })

  it('returns null for an invalid FG string', () => {
    expect(calculateAbv('1.050', '')).toBeNull()
  })

  it('returns null when both values are invalid', () => {
    expect(calculateAbv('bad', 'data')).toBeNull()
  })
})

describe('calculateApparentAttenuation', () => {
  it('calculates attenuation for a typical fermentation', () => {
    // ((1.050 - 1.010) / (1.050 - 1)) * 100 = 80%
    expect(calculateApparentAttenuation('1.050', '1.010')).toBeCloseTo(80)
  })

  it('approaches 100% when FG is very close to 1.000', () => {
    const result = calculateApparentAttenuation('1.050', '1.001')
    expect(result).toBeGreaterThan(98)
  })

  it('returns 0 when OG equals FG — fermentation produced no attenuation', () => {
    // (1.050 - 1.050) / (1.050 - 1) * 100 = 0; mathematically valid, not null
    expect(calculateApparentAttenuation('1.050', '1.050')).toBe(0)
  })

  it('returns null when OG is 1.000 (division by zero guard)', () => {
    expect(calculateApparentAttenuation('1.000', '1.000')).toBeNull()
  })

  it('returns null for invalid gravity strings', () => {
    expect(calculateApparentAttenuation('', '1.010')).toBeNull()
    expect(calculateApparentAttenuation('1.050', '')).toBeNull()
  })
})
