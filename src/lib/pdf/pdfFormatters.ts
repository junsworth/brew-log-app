/**
 * Pure formatting helpers for the PDF export.
 * No jsPDF dependency — fully testable in isolation.
 */

import type {
  NumericInput,
  Fermentable,
  HopAddition,
  Yeast,
  MiscAddition,
  MashStep,
  FermentationStep,
} from '@/types/brew'

/** Renders a NumericInput as a string, or '—' when empty. */
export function fmtVal(v: NumericInput): string {
  return v === '' ? '—' : String(v)
}

/** Renders a plain string, or '—' when blank. */
export function fmtStr(s: string | undefined): string {
  return (s ?? '').trim() || '—'
}

/**
 * Appends a unit to a NumericInput, or returns '—' when the value is empty.
 * e.g. fmtWithUnit(20, 'L') → '20 L'
 */
export function fmtWithUnit(v: NumericInput, unit: string): string {
  const s = fmtVal(v)
  return s === '—' ? '—' : `${s} ${unit}`
}

/** Appends '%' to a NumericInput, or returns '—'. */
export function fmtPercent(v: NumericInput): string {
  const s = fmtVal(v)
  return s === '—' ? '—' : `${s}%`
}

/**
 * Formats an ISO date string (YYYY-MM-DD) as '29 Apr 2026'.
 * Parses as a local date to avoid UTC timezone shift.
 */
export function fmtDate(s: string | undefined): string {
  if (!s?.trim()) return '—'
  try {
    const parts = s.trim().split('-').map(Number)
    if (parts.length !== 3 || parts.some(isNaN)) return s
    const d = new Date(parts[0], parts[1] - 1, parts[2])
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return s
  }
}

// ── Table row builders ───────────────────────────────────────────────────────

/** Converts fermentable rows to a 2-D string array for autoTable. */
export function fermentableRows(rows: Fermentable[]): string[][] {
  return rows.map((r) => [
    fmtStr(r.ingredient),
    fmtStr(r.maltType),
    fmtStr(r.typicalEbc),
    fmtVal(r.amount),
    fmtPercent(r.percentOfBill),
    fmtStr(r.notes),
  ])
}

/** Converts hop addition rows to a 2-D string array for autoTable. */
export function hopRows(rows: HopAddition[]): string[][] {
  return rows.map((r) => [
    fmtStr(r.variety),
    fmtStr(r.form),
    fmtPercent(r.alphaPercent),
    fmtVal(r.amount),
    fmtStr(r.use),
    fmtWithUnit(r.time, 'min'),
    fmtVal(r.ibu),
  ])
}

/** Converts yeast rows to a 2-D string array for autoTable. */
export function yeastRows(rows: Yeast[]): string[][] {
  return rows.map((r) => [
    fmtStr(r.strainName),
    fmtStr(r.labBrand),
    fmtStr(r.form),
    fmtStr(r.amount),
    fmtWithUnit(r.pitchTemp, 'C'),
    fmtPercent(r.attenuation),
    fmtStr(r.lotNumber),
  ])
}

/** Converts misc addition rows to a 2-D string array for autoTable. */
export function miscRows(rows: MiscAddition[]): string[][] {
  return rows.map((r) => [
    fmtStr(r.ingredient),
    fmtStr(r.use),
    fmtStr(r.amount),
    fmtStr(r.timeStage),
    fmtStr(r.notes),
  ])
}

/** Converts mash step rows to a 2-D string array for autoTable. */
export function mashStepRows(steps: MashStep[]): string[][] {
  return steps.map((s) => [
    fmtStr(s.stepName),
    fmtStr(s.stepType),
    fmtWithUnit(s.tempTarget, 'C'),
    fmtWithUnit(s.tempActual, 'C'),
    fmtWithUnit(s.duration, 'min'),
    fmtStr(s.notes),
  ])
}

/** Converts fermentation schedule steps to a 2-D string array for autoTable. */
export function fermentationStepRows(steps: FermentationStep[]): string[][] {
  return steps.map((s) => [
    fmtStr(s.stepName),
    fmtStr(s.type),
    fmtWithUnit(s.temp, 'C'),
    fmtWithUnit(s.duration, 'days'),
    fmtDate(s.startDate),
    fmtDate(s.endDate),
    fmtStr(s.notes),
  ])
}
