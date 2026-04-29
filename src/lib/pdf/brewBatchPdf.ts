/**
 * Generates and downloads a PDF of the full BrewBatch record.
 * Uses jsPDF (client-side only) — call this from a browser event handler.
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { BrewBatch } from '@/types/brew'
import {
  fmtVal,
  fmtStr,
  fmtDate,
  fmtWithUnit,
  fmtPercent,
  fermentableRows,
  hopRows,
  yeastRows,
  miscRows,
  mashStepRows,
  fermentationStepRows,
} from './pdfFormatters'

// ── Design tokens ────────────────────────────────────────────────────────────

const C = {
  navy:  [30,  41,  59]  as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  row:   [248, 250, 252] as [number, number, number],  // alternating row bg
  muted: [100, 116, 139] as [number, number, number],
}

const TABLE = {
  styles: {
    fontSize: 8,
    cellPadding: 2.2,
    lineColor: [220, 230, 240] as [number, number, number],
    lineWidth: 0.2,
    textColor: C.navy,
    font: 'helvetica',
  },
  headStyles: {
    fillColor: C.navy,
    textColor: C.white,
    fontSize: 7.5,
    fontStyle: 'bold' as const,
    cellPadding: 2.2,
  },
  alternateRowStyles: { fillColor: C.row },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function lastY(doc: jsPDF): number {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? 0
}

function pageH(doc: jsPDF): number {
  return doc.internal.pageSize.getHeight()
}

function pageW(doc: jsPDF): number {
  return doc.internal.pageSize.getWidth()
}

/** Draws a dark navy section-heading bar and returns the new y below it. */
function sectionHeader(doc: jsPDF, title: string, y: number, margin: number): number {
  const width = pageW(doc) - margin * 2
  doc.setFillColor(...C.navy)
  doc.rect(margin, y, width, 7, 'F')
  doc.setTextColor(...C.white)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.text(title.toUpperCase(), margin + 3, y + 5)
  doc.setTextColor(...C.navy)
  doc.setFont('helvetica', 'normal')
  return y + 9
}

/** Breaks to a new page if less than `needed` mm remain. */
function ensureSpace(doc: jsPDF, y: number, needed: number, margin: number): number {
  if (y + needed > pageH(doc) - margin) {
    doc.addPage()
    return margin
  }
  return y
}

/** Renders a grid of key-value pairs (2 per row). */
function kvGrid(
  doc: jsPDF,
  fields: [string, string][],
  y: number,
  margin: number,
  cols = 3,
  labelW = 26,
): number {
  const colW = (pageW(doc) - margin * 2) / cols
  fields.forEach(([label, value], idx) => {
    const col = idx % cols
    const row = Math.floor(idx / cols)
    const x = margin + col * colW
    const rowY = y + row * 5.5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...C.navy)
    doc.text(`${label}:`, x, rowY)
    doc.setFont('helvetica', 'normal')
    doc.text(value, x + labelW, rowY)
  })
  return y + Math.ceil(fields.length / cols) * 5.5 + 3
}

// ── Main export ──────────────────────────────────────────────────────────────

export function generateBrewBatchPdf(batch: BrewBatch): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 14
  const contentW = pageW(doc) - margin * 2

  const { batchInfo: bi } = batch
  let y = margin

  // ── Cover header bar ──────────────────────────────────────────────────────
  doc.setFillColor(...C.navy)
  doc.rect(margin, y, contentW, 16, 'F')

  doc.setTextColor(...C.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(fmtStr(bi.recipeName) === '—' ? 'Brew Day Record' : bi.recipeName, margin + 4, y + 7)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(fmtStr(bi.style), margin + 4, y + 13)

  doc.setFontSize(8)
  doc.text(`Batch #${fmtStr(bi.batchNumber)}`, pageW(doc) - margin - 4, y + 6, { align: 'right' })
  doc.text(`Brewer: ${fmtStr(bi.brewer)}`, pageW(doc) - margin - 4, y + 11.5, { align: 'right' })

  y += 19

  // ── 1. Batch Information ──────────────────────────────────────────────────
  y = sectionHeader(doc, '1  Batch Information', y, margin)
  y = kvGrid(doc, [
    ['Date',        fmtDate(bi.brewDate)],
    ['Batch Size',  fmtWithUnit(bi.batchSize, 'L')],
    ['Boil Time',   fmtWithUnit(bi.boilTime, 'min')],
    ['Recipe Type', fmtStr(bi.recipeType)],
    ['IBU',         fmtVal(bi.ibu)],
    ['SRM / EBC',   fmtVal(bi.srm)],
  ], y, margin, 3, 24)

  // ── 2. Gravity & Key Stats ────────────────────────────────────────────────
  y = sectionHeader(doc, '2  Gravity & Key Stats', y, margin)
  const gs = batch.gravityStats
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Measurement', 'Target', 'Measured']],
    body: [
      ['Pre-Boil Gravity',     fmtStr(gs.preBoilGravity.target),      fmtStr(gs.preBoilGravity.measured)],
      ['Original Gravity (OG)',fmtStr(gs.originalGravity.target),     fmtStr(gs.originalGravity.measured)],
      ['Final Gravity (FG)',   fmtStr(gs.finalGravity.target),        fmtStr(gs.finalGravity.measured)],
      ['ABV',                  fmtStr(gs.abv.target),                 fmtStr(gs.abv.measured)],
      ['Mash Efficiency',      fmtStr(gs.mashEfficiency.target),      fmtStr(gs.mashEfficiency.measured)],
      ['Brewhouse Efficiency', fmtStr(gs.brewhouseEfficiency.target), fmtStr(gs.brewhouseEfficiency.measured)],
    ],
    ...TABLE,
  })
  y = lastY(doc) + 5

  // ── 3. Fermentables ───────────────────────────────────────────────────────
  y = sectionHeader(doc, '3  Fermentables / Grain Bill', y, margin)
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Ingredient', 'Type', 'EBC', 'kg', '% Bill', 'Notes']],
    body: fermentableRows(batch.fermentables),
    columnStyles: { 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' } },
    ...TABLE,
  })
  y = lastY(doc) + 5

  // ── 4. Hop Additions ──────────────────────────────────────────────────────
  y = sectionHeader(doc, '4  Hop Additions', y, margin)
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Variety', 'Form', 'Alpha %', 'Amount (g)', 'Use', 'Time (min)', 'IBU']],
    body: hopRows(batch.hops),
    columnStyles: { 2: { halign: 'center' }, 3: { halign: 'center' }, 5: { halign: 'center' }, 6: { halign: 'center' } },
    ...TABLE,
  })
  y = lastY(doc) + 5

  // ── 5. Yeast ──────────────────────────────────────────────────────────────
  y = sectionHeader(doc, '5  Yeast', y, margin)
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Strain', 'Brand', 'Form', 'Amount', 'Pitch Temp', 'Atten. %', 'Lot #']],
    body: yeastRows(batch.yeast),
    ...TABLE,
  })
  y = lastY(doc) + 5

  // ── 6. Misc Additions (conditional) ───────────────────────────────────────
  if (batch.miscAdditions.length > 0) {
    y = sectionHeader(doc, '6  Miscellaneous Additions', y, margin)
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Ingredient', 'Use', 'Amount', 'Time / Stage', 'Notes']],
      body: miscRows(batch.miscAdditions),
      ...TABLE,
    })
    y = lastY(doc) + 5
  }

  // ── Page 2 ────────────────────────────────────────────────────────────────
  doc.addPage()
  y = margin

  // ── 7. Mash ───────────────────────────────────────────────────────────────
  y = sectionHeader(doc, '7  Mash', y, margin)
  const m = batch.mash
  y = kvGrid(doc, [
    ['Mash Water',        fmtWithUnit(m.mashWater, 'L')],
    ['Sparge Water',      fmtWithUnit(m.spargeWater, 'L')],
    ['pH Target',         fmtVal(m.phTarget)],
    ['pH Measured',       fmtVal(m.phMeasured)],
    ['First Wort Gravity',fmtStr(m.firstWortGravity)],
  ], y, margin, 3, 28)

  if (m.steps.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Step', 'Type', 'Temp Target', 'Temp Actual', 'Duration', 'Notes']],
      body: mashStepRows(m.steps),
      ...TABLE,
    })
    y = lastY(doc) + 5
  }

  // ── 8. Water Profile ──────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 30, margin)
  y = sectionHeader(doc, '8  Water Profile', y, margin)
  const wp = batch.waterProfile
  if (fmtStr(wp.profileName) !== '—') {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...C.muted)
    doc.text(`Profile: ${wp.profileName}`, margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.navy)
  }
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Calcium (ppm)', 'Magnesium (ppm)', 'Sodium (ppm)', 'Chloride (ppm)', 'Sulfate (ppm)', 'Bicarbonate (ppm)']],
    body: [[
      fmtVal(wp.calcium), fmtVal(wp.magnesium), fmtVal(wp.sodium),
      fmtVal(wp.chloride), fmtVal(wp.sulfate), fmtVal(wp.bicarbonate),
    ]],
    styles: { ...TABLE.styles, halign: 'center' },
    headStyles: { ...TABLE.headStyles, halign: 'center' },
    alternateRowStyles: TABLE.alternateRowStyles,
  })
  y = lastY(doc) + 5

  // ── 9. Boil ───────────────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 25, margin)
  y = sectionHeader(doc, '9  Boil', y, margin)
  const bl = batch.boil
  y = kvGrid(doc, [
    ['Pre-Boil Volume',   fmtWithUnit(bl.preBoilVolume, 'L')],
    ['Pre-Boil Gravity',  fmtStr(bl.preBoilGravity)],
    ['Post-Boil Volume',  fmtWithUnit(bl.postBoilVolume, 'L')],
    ['Post-Boil Gravity', fmtStr(bl.postBoilGravity)],
    ['Boil-Off Rate',     fmtWithUnit(bl.boilOffRate, 'L/hr')],
  ], y, margin, 3, 28)

  // ── 10. Fermentation ──────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 30, margin)
  y = sectionHeader(doc, '10  Fermentation Schedule', y, margin)
  const ferm = batch.fermentation
  y = kvGrid(doc, [
    ['Pitch Date/Time', fmtStr(ferm.pitchDateTime)],
    ['OG Measured',     fmtStr(ferm.ogMeasured)],
    ['FG Measured',     fmtStr(ferm.fgMeasured)],
    ['ABV (calc)',      fmtStr(ferm.abvCalc)],
    ['Attenuation',     fmtPercent(ferm.attenuation === '' ? '' : Number(ferm.attenuation))],
    ['Carbonation',     fmtStr(ferm.carbonation)],
  ], y, margin, 3, 28)

  if (ferm.schedule.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Step', 'Type', 'Temp', 'Duration', 'Start', 'End', 'Notes']],
      body: fermentationStepRows(ferm.schedule),
      ...TABLE,
    })
    y = lastY(doc) + 5
  }

  // ── 11. Packaging ─────────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 25, margin)
  y = sectionHeader(doc, '11  Packaging & Conditioning', y, margin)
  const pk = batch.packaging
  y = kvGrid(doc, [
    ['Date',            fmtDate(pk.packagingDate)],
    ['Method',          fmtStr(pk.method)],
    ['Volume Packaged', fmtWithUnit(pk.volumePackaged, 'L')],
    ['Priming Sugar',   fmtWithUnit(pk.primingSugar, 'g')],
    ['Ready to Drink',  fmtDate(pk.readyTodrinkDate)],
  ], y, margin, 3, 28)

  // ── 12. Brew Notes ────────────────────────────────────────────────────────
  if (batch.brewNotes.trim()) {
    y = ensureSpace(doc, y, 20, margin)
    y = sectionHeader(doc, '12  Brew Notes', y, margin)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.navy)
    const lines = doc.splitTextToSize(batch.brewNotes, contentW)
    doc.text(lines, margin, y)
  }

  // ── Footer on every page ──────────────────────────────────────────────────
  const total = (doc.internal as unknown as { getNumberOfPages(): number }).getNumberOfPages()
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.muted)
    const footer = pageH(doc) - 6
    doc.text(`Brew Day Record — ${fmtStr(bi.recipeName)}`, margin, footer)
    doc.text(fmtDate(bi.brewDate), pageW(doc) / 2, footer, { align: 'center' })
    doc.text(`Page ${i} / ${total}`, pageW(doc) - margin, footer, { align: 'right' })
  }

  // ── Download ──────────────────────────────────────────────────────────────
  const slug = bi.batchNumber || 'record'
  doc.save(`brew_batch_${slug}.pdf`)
}
