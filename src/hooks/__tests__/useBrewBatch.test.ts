import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBrewBatch } from '@/hooks/useBrewBatch'

// Isolate localStorage between tests
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

beforeEach(() => {
  vi.stubGlobal('localStorage', localStorageMock)
  localStorageMock.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useBrewBatch — initial state', () => {
  it('returns a batch with default values on first render', async () => {
    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.batch.batchInfo.batchNumber).toBe(''))
  })

  it('sets brewDate to today after mount', async () => {
    const today = new Date().toISOString().slice(0, 10)
    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.batch.batchInfo.brewDate).toBe(today))
  })

  it('initialises with one empty fermentable row', async () => {
    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.batch.fermentables).toHaveLength(1))
  })
})

describe('useBrewBatch — persistence', () => {
  it('autosaves to localStorage after a state update', async () => {
    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.batch.batchInfo.brewDate).not.toBe(''))

    act(() => {
      result.current.setBatch((prev) => ({
        ...prev,
        batchInfo: { ...prev.batchInfo, recipeName: 'Cascade Pale Ale' },
      }))
    })

    await waitFor(() => {
      const saved = JSON.parse(localStorageMock.getItem('brew-day-record-v2') ?? '{}')
      expect(saved.batchInfo?.recipeName).toBe('Cascade Pale Ale')
    })
  })

  it('updates lastSavedAt after autosave', async () => {
    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.lastSavedAt).not.toBeNull())
  })

  it('restores a previously saved batch from localStorage', async () => {
    localStorageMock.setItem(
      'brew-day-record-v2',
      JSON.stringify({
        batchInfo: { recipeName: 'Saved Stout', batchNumber: '007', brewDate: '', style: '', brewer: '', batchSize: '', boilTime: 60, recipeType: '', ibu: '', srm: '' },
        gravityStats: { preBoilGravity: { target: '', measured: '' }, originalGravity: { target: '', measured: '' }, finalGravity: { target: '', measured: '' }, abv: { target: '', measured: '' }, mashEfficiency: { target: '', measured: '' }, brewhouseEfficiency: { target: '', measured: '' } },
        fermentables: [],
        hops: [],
        yeast: [],
        miscAdditions: [],
        mash: { steps: [], mashWater: '', spargeWater: '', phTarget: '', phMeasured: '', firstWortGravity: '' },
        waterProfile: { calcium: '', magnesium: '', sodium: '', chloride: '', sulfate: '', bicarbonate: '', profileName: '' },
        boil: { preBoilVolume: '', preBoilGravity: '', postBoilVolume: '', postBoilGravity: '', boilOffRate: '' },
        fermentation: { schedule: [], pitchDateTime: '', ogMeasured: '', fgMeasured: '', abvCalc: '', attenuation: '', carbonation: '' },
        packaging: { packagingDate: '', method: '', volumePackaged: '', primingSugar: '', readyTodrinkDate: '' },
        brewNotes: '',
      })
    )

    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.batch.batchInfo.recipeName).toBe('Saved Stout'))
  })
})

describe('useBrewBatch — reset', () => {
  it('clears localStorage and resets to defaults', async () => {
    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.batch.batchInfo.brewDate).not.toBe(''))

    act(() => {
      result.current.setBatch((prev) => ({
        ...prev,
        batchInfo: { ...prev.batchInfo, recipeName: 'Before Reset' },
      }))
    })

    act(() => { result.current.reset() })

    await waitFor(() => {
      expect(result.current.batch.batchInfo.recipeName).toBe('')
      expect(localStorageMock.getItem('brew-day-record-v2')).toBeNull()
    })
  })

  it('sets a fresh brewDate after reset', async () => {
    const today = new Date().toISOString().slice(0, 10)
    const { result } = renderHook(() => useBrewBatch())
    act(() => { result.current.reset() })
    await waitFor(() => expect(result.current.batch.batchInfo.brewDate).toBe(today))
  })
})

describe('useBrewBatch — derived stats', () => {
  it('calculates ABV when valid OG and FG are set in gravityStats', async () => {
    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.batch.batchInfo.brewDate).not.toBe(''))

    act(() => {
      result.current.setBatch((prev) => ({
        ...prev,
        gravityStats: {
          ...prev.gravityStats,
          originalGravity: { target: '', measured: '1.050' },
          finalGravity: { target: '', measured: '1.010' },
        },
      }))
    })

    await waitFor(() => {
      // (1.050 - 1.010) * 131.25 = 5.25
      expect(result.current.batch.gravityStats.abv.measured).toBe('5.25')
    })
  })

  it('clears ABV when OG is not a valid gravity string', async () => {
    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.batch.batchInfo.brewDate).not.toBe(''))

    act(() => {
      result.current.setBatch((prev) => ({
        ...prev,
        gravityStats: {
          ...prev.gravityStats,
          originalGravity: { target: '', measured: '' },
          finalGravity: { target: '', measured: '1.010' },
        },
      }))
    })

    await waitFor(() => {
      expect(result.current.batch.gravityStats.abv.measured).toBe('')
    })
  })
})

describe('useBrewBatch — importJson', () => {
  it('loads a valid JSON file into the batch', async () => {
    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.batch.batchInfo.brewDate).not.toBe(''))

    const payload = {
      batchInfo: { recipeName: 'Imported IPA', batchNumber: '42', brewDate: '2025-01-01', style: 'IPA', brewer: 'Test', batchSize: 20, boilTime: 60, recipeType: 'All Grain', ibu: '', srm: '' },
      gravityStats: { preBoilGravity: { target: '', measured: '' }, originalGravity: { target: '', measured: '' }, finalGravity: { target: '', measured: '' }, abv: { target: '', measured: '' }, mashEfficiency: { target: '', measured: '' }, brewhouseEfficiency: { target: '', measured: '' } },
      fermentables: [],
      hops: [],
      yeast: [],
      miscAdditions: [],
      mash: { steps: [], mashWater: '', spargeWater: '', phTarget: '', phMeasured: '', firstWortGravity: '' },
      waterProfile: { calcium: '', magnesium: '', sodium: '', chloride: '', sulfate: '', bicarbonate: '', profileName: '' },
      boil: { preBoilVolume: '', preBoilGravity: '', postBoilVolume: '', postBoilGravity: '', boilOffRate: '' },
      fermentation: { schedule: [], pitchDateTime: '', ogMeasured: '', fgMeasured: '', abvCalc: '', attenuation: '', carbonation: '' },
      packaging: { packagingDate: '', method: '', volumePackaged: '', primingSugar: '', readyTodrinkDate: '' },
      brewNotes: 'Good hop aroma',
    }

    const file = new File([JSON.stringify(payload)], 'batch.json', { type: 'application/json' })
    await act(async () => { await result.current.importJson(file) })

    await waitFor(() => {
      expect(result.current.batch.batchInfo.recipeName).toBe('Imported IPA')
      expect(result.current.batch.brewNotes).toBe('Good hop aroma')
    })
  })

  it('rejects a file with invalid JSON', async () => {
    const { result } = renderHook(() => useBrewBatch())
    await waitFor(() => expect(result.current.batch.batchInfo.brewDate).not.toBe(''))

    const file = new File(['not json {{'], 'bad.json', { type: 'application/json' })
    await expect(result.current.importJson(file)).rejects.toThrow('Invalid import file')
  })
})
