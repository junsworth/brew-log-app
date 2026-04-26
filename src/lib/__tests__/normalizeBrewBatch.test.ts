import { describe, expect, it } from 'vitest'
import { JOLA_CUSTOM_PRODUCT_ID, JOLA_MALTS } from '@/constants/jolaCatalog'
import { createDefaultBrewBatch, createEmptyFermentable, createEmptyHop, createEmptyYeast } from '@/lib/defaults'
import { normalizeFermentableRow, normalizeBrewBatch } from '@/lib/normalizeBrewBatch'

// Pick a known catalog entry to use in tests
const KNOWN_MALT = JOLA_MALTS[0] // e.g. "swaen-lager"

describe('normalizeFermentableRow', () => {
  describe('when catalogProductId is already set to a valid catalog entry', () => {
    it('preserves the id', () => {
      const row = createEmptyFermentable()
      const result = normalizeFermentableRow({ ...row, catalogProductId: KNOWN_MALT.id, ingredient: KNOWN_MALT.name })
      expect(result.catalogProductId).toBe(KNOWN_MALT.id)
    })
  })

  describe('when catalogProductId is empty but ingredient matches a catalog entry by name', () => {
    it('resolves the catalogProductId from the catalog', () => {
      const row = createEmptyFermentable()
      const result = normalizeFermentableRow({ ...row, catalogProductId: '', ingredient: KNOWN_MALT.name })
      expect(result.catalogProductId).toBe(KNOWN_MALT.id)
    })
  })

  describe('when catalogProductId is empty and ingredient does not match any catalog entry', () => {
    it('sets catalogProductId to the custom sentinel', () => {
      const row = createEmptyFermentable()
      const result = normalizeFermentableRow({ ...row, catalogProductId: '', ingredient: 'My Weird Grain' })
      expect(result.catalogProductId).toBe(JOLA_CUSTOM_PRODUCT_ID)
    })
  })

  describe('when both catalogProductId and ingredient are empty', () => {
    it('leaves catalogProductId empty', () => {
      const row = createEmptyFermentable()
      const result = normalizeFermentableRow({ ...row, catalogProductId: '', ingredient: '' })
      expect(result.catalogProductId).toBe('')
    })
  })

  describe('when catalogProductId references an id that no longer exists in the catalog', () => {
    it('falls back to the custom sentinel when the ingredient name is set', () => {
      const row = createEmptyFermentable()
      const result = normalizeFermentableRow({ ...row, catalogProductId: 'stale-id', ingredient: 'Some Grain' })
      expect(result.catalogProductId).toBe(JOLA_CUSTOM_PRODUCT_ID)
    })

    it('falls back to empty string when the ingredient name is also empty', () => {
      const row = createEmptyFermentable()
      const result = normalizeFermentableRow({ ...row, catalogProductId: 'stale-id', ingredient: '' })
      expect(result.catalogProductId).toBe('')
    })
  })

  it('fills in missing fields from defaults when a partial row is provided', () => {
    const result = normalizeFermentableRow({ ingredient: 'Rye' })
    expect(result.lotNumber).toBe('')
    expect(result.notes).toBe('')
    expect(result.amount).toBe('')
  })
})

describe('normalizeBrewBatch', () => {
  it('normalizes every fermentable row', () => {
    const batch = createDefaultBrewBatch()
    batch.fermentables = [
      { ...createEmptyFermentable(), catalogProductId: '', ingredient: KNOWN_MALT.name },
    ]
    const result = normalizeBrewBatch(batch)
    expect(result.fermentables[0].catalogProductId).toBe(KNOWN_MALT.id)
  })

  it('handles an empty fermentables array without throwing', () => {
    const batch = createDefaultBrewBatch()
    batch.fermentables = []
    expect(() => normalizeBrewBatch(batch)).not.toThrow()
    expect(normalizeBrewBatch(batch).fermentables).toHaveLength(0)
  })

  it('handles a null/undefined fermentables value (legacy import safety)', () => {
    const batch = { ...createDefaultBrewBatch(), fermentables: undefined as never }
    expect(() => normalizeBrewBatch(batch)).not.toThrow()
    expect(normalizeBrewBatch(batch).fermentables).toHaveLength(0)
  })

  it('does not mutate the original batch', () => {
    const batch = createDefaultBrewBatch()
    const original = JSON.stringify(batch)
    normalizeBrewBatch(batch)
    expect(JSON.stringify(batch)).toBe(original)
  })
})
