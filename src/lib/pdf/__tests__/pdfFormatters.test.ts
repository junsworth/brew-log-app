import { describe, expect, it } from 'vitest'
import {
  fmtVal,
  fmtStr,
  fmtWithUnit,
  fmtPercent,
  fmtDate,
  fermentableRows,
  hopRows,
  yeastRows,
  miscRows,
  mashStepRows,
  fermentationStepRows,
} from '../pdfFormatters'
import type { Fermentable, HopAddition, Yeast, MiscAddition, MashStep, FermentationStep } from '@/types/brew'

// ── fmtVal ──────────────────────────────────────────────────────────────────

describe('fmtVal', () => {
  it('renders a number as a string', () => {
    expect(fmtVal(42)).toBe('42')
    expect(fmtVal(1.065)).toBe('1.065')
  })

  it('renders zero as "0"', () => {
    expect(fmtVal(0)).toBe('0')
  })

  it('renders empty string as "—"', () => {
    expect(fmtVal('')).toBe('—')
  })
})

// ── fmtStr ──────────────────────────────────────────────────────────────────

describe('fmtStr', () => {
  it('returns the string when non-empty', () => {
    expect(fmtStr('Pale Malt')).toBe('Pale Malt')
  })

  it('trims whitespace', () => {
    expect(fmtStr('  hello  ')).toBe('hello')
  })

  it('returns "—" for empty string', () => {
    expect(fmtStr('')).toBe('—')
  })

  it('returns "—" for undefined', () => {
    expect(fmtStr(undefined)).toBe('—')
  })

  it('returns "—" for whitespace-only string', () => {
    expect(fmtStr('   ')).toBe('—')
  })
})

// ── fmtWithUnit ─────────────────────────────────────────────────────────────

describe('fmtWithUnit', () => {
  it('appends the unit to a number', () => {
    expect(fmtWithUnit(20, 'L')).toBe('20 L')
    expect(fmtWithUnit(60, 'min')).toBe('60 min')
  })

  it('returns "—" when value is empty', () => {
    expect(fmtWithUnit('', 'L')).toBe('—')
  })
})

// ── fmtPercent ──────────────────────────────────────────────────────────────

describe('fmtPercent', () => {
  it('appends % to a number', () => {
    expect(fmtPercent(75)).toBe('75%')
    expect(fmtPercent(5.5)).toBe('5.5%')
  })

  it('returns "—" when value is empty', () => {
    expect(fmtPercent('')).toBe('—')
  })

  it('handles zero', () => {
    expect(fmtPercent(0)).toBe('0%')
  })
})

// ── fmtDate ─────────────────────────────────────────────────────────────────

describe('fmtDate', () => {
  it('formats a YYYY-MM-DD string as "DD Mon YYYY"', () => {
    expect(fmtDate('2026-04-29')).toBe('29 Apr 2026')
  })

  it('returns "—" for empty string', () => {
    expect(fmtDate('')).toBe('—')
  })

  it('returns "—" for undefined', () => {
    expect(fmtDate(undefined)).toBe('—')
  })

  it('returns the raw string for an unparseable value', () => {
    expect(fmtDate('not-a-date')).toBe('not-a-date')
  })
})

// ── fermentableRows ─────────────────────────────────────────────────────────

describe('fermentableRows', () => {
  const row: Fermentable = {
    id: '1',
    catalogProductId: 'abc',
    ingredient: 'Pale Malt',
    maltType: 'Base',
    typicalEbc: '5',
    amount: 5.5,
    percentOfBill: 85,
    lotNumber: 'L001',
    notes: 'Crushed',
  }

  it('maps a fermentable to a 6-element string array', () => {
    const [result] = fermentableRows([row])
    expect(result).toHaveLength(6)
    expect(result[0]).toBe('Pale Malt')
    expect(result[1]).toBe('Base')
    expect(result[2]).toBe('5')
    expect(result[3]).toBe('5.5')
    expect(result[4]).toBe('85%')
    expect(result[5]).toBe('Crushed')
  })

  it('renders empty fields as "—"', () => {
    const empty: Fermentable = { ...row, ingredient: '', amount: '', percentOfBill: '', notes: '' }
    const [result] = fermentableRows([empty])
    expect(result[0]).toBe('—')
    expect(result[3]).toBe('—')
    expect(result[4]).toBe('—')
    expect(result[5]).toBe('—')
  })

  it('returns one row per fermentable', () => {
    expect(fermentableRows([row, row])).toHaveLength(2)
  })
})

// ── hopRows ─────────────────────────────────────────────────────────────────

describe('hopRows', () => {
  const row: HopAddition = {
    id: '1',
    catalogProductId: '',
    variety: 'Cascade',
    form: 'Pellet',
    alphaPercent: 5.5,
    amount: 30,
    use: 'Boil',
    time: 60,
    ibu: 25,
  }

  it('maps a hop addition to a 7-element string array', () => {
    const [result] = hopRows([row])
    expect(result).toHaveLength(7)
    expect(result[0]).toBe('Cascade')
    expect(result[2]).toBe('5.5%')
    expect(result[5]).toBe('60 min')
    expect(result[6]).toBe('25')
  })

  it('renders empty numeric fields as "—"', () => {
    const empty: HopAddition = { ...row, alphaPercent: '', time: '', ibu: '' }
    const [result] = hopRows([empty])
    expect(result[2]).toBe('—')
    expect(result[5]).toBe('—')
    expect(result[6]).toBe('—')
  })
})

// ── yeastRows ───────────────────────────────────────────────────────────────

describe('yeastRows', () => {
  const row: Yeast = {
    id: '1',
    catalogProductId: '',
    strainName: 'US-05',
    labBrand: 'Fermentis',
    form: 'Dry',
    amount: '11.5g',
    pitchTemp: 18,
    attenuation: 75,
    lotNumber: 'Y001',
  }

  it('maps a yeast to a 7-element string array', () => {
    const [result] = yeastRows([row])
    expect(result).toHaveLength(7)
    expect(result[0]).toBe('US-05')
    expect(result[4]).toBe('18 C')
    expect(result[5]).toBe('75%')
  })
})

// ── miscRows ────────────────────────────────────────────────────────────────

describe('miscRows', () => {
  const row: MiscAddition = {
    id: '1',
    ingredient: 'Irish Moss',
    use: 'Boil',
    amount: '1 tsp',
    timeStage: '15 min',
    notes: 'Clarifier',
  }

  it('maps a misc addition to a 5-element string array', () => {
    const [result] = miscRows([row])
    expect(result).toHaveLength(5)
    expect(result[0]).toBe('Irish Moss')
    expect(result[4]).toBe('Clarifier')
  })
})

// ── mashStepRows ─────────────────────────────────────────────────────────────

describe('mashStepRows', () => {
  const step: MashStep = {
    id: '1',
    stepName: 'Saccharification',
    stepType: 'Infusion',
    tempTarget: 67,
    tempActual: 66.5,
    duration: 60,
    notes: '',
  }

  it('maps a mash step to a 6-element string array', () => {
    const [result] = mashStepRows([step])
    expect(result).toHaveLength(6)
    expect(result[0]).toBe('Saccharification')
    expect(result[2]).toBe('67 C')
    expect(result[3]).toBe('66.5 C')
    expect(result[4]).toBe('60 min')
    expect(result[5]).toBe('—')
  })
})

// ── fermentationStepRows ─────────────────────────────────────────────────────

describe('fermentationStepRows', () => {
  const step: FermentationStep = {
    id: '1',
    stepName: 'Primary',
    type: 'Primary',
    temp: 18,
    duration: 14,
    startDate: '2026-04-29',
    endDate: '2026-05-13',
    notes: 'Dry hop on day 7',
  }

  it('maps a fermentation step to a 7-element string array', () => {
    const [result] = fermentationStepRows([step])
    expect(result).toHaveLength(7)
    expect(result[0]).toBe('Primary')
    expect(result[2]).toBe('18 C')
    expect(result[3]).toBe('14 days')
    expect(result[4]).toBe('29 Apr 2026')
    expect(result[5]).toBe('13 May 2026')
    expect(result[6]).toBe('Dry hop on day 7')
  })
})
