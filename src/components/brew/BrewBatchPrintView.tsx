'use client'

import type { BatchInfo, BrewBatch, Fermentable, FermentationStep, HopAddition, MashStep, MiscAddition, Yeast } from '@/types/brew'
import {
  fmtDate,
  fmtPercent,
  fmtStr,
  fmtVal,
  fmtWithUnit,
} from '@/lib/pdf/pdfFormatters'

// ── Internal presentational primitives ──────────────────────────────────────

function PrintSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-3">
      <h2 className="mb-1.5 rounded-sm bg-slate-800 px-2 py-1 text-[8.5pt] font-bold uppercase tracking-wide text-white">
        {title}
      </h2>
      <div className="px-1">{children}</div>
    </section>
  )
}

type KVField = [label: string, value: string]

function PrintKVGrid({ fields, cols = 3 }: { fields: KVField[]; cols?: number }) {
  return (
    <dl
      className="mb-1 grid gap-x-4 gap-y-0.5 text-[8.5pt]"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {fields.map(([label, value]) => (
        <div key={label} className="flex gap-1">
          <dt className="font-semibold text-slate-700 whitespace-nowrap">{label}:</dt>
          <dd className="text-slate-900">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function PrintTable({ head, body }: { head: string[]; body: string[][] }) {
  return (
    <table className="mb-1 w-full border-collapse text-[7.5pt]">
      <thead>
        <tr>
          {head.map((h) => (
            <th
              key={h}
              className="bg-slate-800 px-1.5 py-1 text-left font-semibold text-white"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
            {row.map((cell, ci) => (
              <td key={ci} className="border border-slate-200 px-1.5 py-0.5">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Section builders ─────────────────────────────────────────────────────────

function BatchInfoHeader({ bi }: { bi: BatchInfo }) {
  return (
    <header className="mb-4 flex items-start justify-between border-b-2 border-slate-800 pb-2">
      <div>
        <h1 className="text-[18pt] font-bold leading-tight text-slate-900">
          {fmtStr(bi.recipeName) === '—' ? 'Brew Day Record' : bi.recipeName}
        </h1>
        <p className="text-[10pt] text-slate-600">{fmtStr(bi.style)}</p>
      </div>
      <div className="text-right text-[8.5pt] text-slate-700">
        <p className="font-semibold">Batch #{fmtStr(bi.batchNumber)}</p>
        <p>Brewer: {fmtStr(bi.brewer)}</p>
        <p>{fmtDate(bi.brewDate)}</p>
      </div>
    </header>
  )
}

function SectionBatchInfo({ bi }: { bi: BatchInfo }) {
  return (
    <PrintKVGrid fields={[
      ['Date', fmtDate(bi.brewDate)],
      ['Batch Size', fmtWithUnit(bi.batchSize, 'L')],
      ['Boil Time', fmtWithUnit(bi.boilTime, 'min')],
      ['Recipe Type', fmtStr(bi.recipeType)],
      ['IBU', fmtVal(bi.ibu)],
      ['SRM / EBC', fmtVal(bi.srm)],
    ]} />
  )
}

function SectionFermentables({ rows }: { rows: Fermentable[] }) {
  return (
    <PrintTable
      head={['Ingredient', 'Type', 'EBC', 'kg', '% Bill', 'Notes']}
      body={rows.map((r) => [
        fmtStr(r.ingredient),
        fmtStr(r.maltType),
        fmtStr(r.typicalEbc),
        fmtVal(r.amount),
        fmtPercent(r.percentOfBill),
        fmtStr(r.notes),
      ])}
    />
  )
}

function SectionHops({ rows }: { rows: HopAddition[] }) {
  return (
    <PrintTable
      head={['Variety', 'Form', 'Alpha %', 'Amount (g)', 'Use', 'Time (min)', 'IBU']}
      body={rows.map((r) => [
        fmtStr(r.variety),
        fmtStr(r.form),
        fmtPercent(r.alphaPercent),
        fmtVal(r.amount),
        fmtStr(r.use),
        fmtWithUnit(r.time, 'min'),
        fmtVal(r.ibu),
      ])}
    />
  )
}

function SectionYeast({ rows }: { rows: Yeast[] }) {
  return (
    <PrintTable
      head={['Strain', 'Brand', 'Form', 'Amount', 'Pitch Temp', 'Atten. %', 'Lot #']}
      body={rows.map((r) => [
        fmtStr(r.strainName),
        fmtStr(r.labBrand),
        fmtStr(r.form),
        fmtStr(r.amount),
        fmtWithUnit(r.pitchTemp, 'C'),
        fmtPercent(r.attenuation),
        fmtStr(r.lotNumber),
      ])}
    />
  )
}

function SectionMiscAdditions({ rows }: { rows: { id: string; ingredient: string; use: string; amount: string; timeStage: string; notes: string }[] }) {
  return (
    <PrintTable
      head={['Ingredient', 'Use', 'Amount', 'Time / Stage', 'Notes']}
      body={rows.map((r) => [
        fmtStr(r.ingredient),
        fmtStr(r.use),
        fmtStr(r.amount),
        fmtStr(r.timeStage),
        fmtStr(r.notes),
      ])}
    />
  )
}

function SectionMashSteps({ steps }: { steps: MashStep[] }) {
  return (
    <PrintTable
      head={['Step', 'Type', 'Temp Target', 'Temp Actual', 'Duration', 'Notes']}
      body={steps.map((s) => [
        fmtStr(s.stepName),
        fmtStr(s.stepType),
        fmtWithUnit(s.tempTarget, 'C'),
        fmtWithUnit(s.tempActual, 'C'),
        fmtWithUnit(s.duration, 'min'),
        fmtStr(s.notes),
      ])}
    />
  )
}

function SectionFermentationSteps({ steps }: { steps: FermentationStep[] }) {
  return (
    <PrintTable
      head={['Step', 'Type', 'Temp', 'Duration', 'Start', 'End', 'Notes']}
      body={steps.map((s) => [
        fmtStr(s.stepName),
        fmtStr(s.type),
        fmtWithUnit(s.temp, 'C'),
        fmtWithUnit(s.duration, 'days'),
        fmtDate(s.startDate),
        fmtDate(s.endDate),
        fmtStr(s.notes),
      ])}
    />
  )
}

// ── Public component ─────────────────────────────────────────────────────────

export function BrewBatchPrintView({ batch }: { batch: BrewBatch }) {
  const { batchInfo: bi, gravityStats: gs, mash: m, waterProfile: wp, boil: bl, fermentation: ferm, packaging: pk } = batch

  return (
    <div
      id="brew-print-view"
      className="hidden font-sans text-[10pt] text-slate-800"
    >
      {/* ── Cover header ─────────────────────────────────────────────────── */}
      <BatchInfoHeader bi={bi} />

      {/* ── Page 1: Recipe & Ingredients ─────────────────────────────────── */}
      <PrintSection title="1  Batch Information">
        <SectionBatchInfo bi={bi} />
      </PrintSection>

      <PrintSection title="2  Gravity &amp; Key Stats">
        <PrintTable
          head={['Measurement', 'Target', 'Measured']}
          body={[
            ['Pre-Boil Gravity', fmtStr(gs.preBoilGravity.target), fmtStr(gs.preBoilGravity.measured)],
            ['Original Gravity (OG)', fmtStr(gs.originalGravity.target), fmtStr(gs.originalGravity.measured)],
            ['Final Gravity (FG)', fmtStr(gs.finalGravity.target), fmtStr(gs.finalGravity.measured)],
            ['ABV', fmtStr(gs.abv.target), fmtStr(gs.abv.measured)],
            ['Mash Efficiency', fmtStr(gs.mashEfficiency.target), fmtStr(gs.mashEfficiency.measured)],
            ['Brewhouse Efficiency', fmtStr(gs.brewhouseEfficiency.target), fmtStr(gs.brewhouseEfficiency.measured)],
          ]}
        />
      </PrintSection>

      <PrintSection title="3  Fermentables / Grain Bill">
        <SectionFermentables rows={batch.fermentables} />
      </PrintSection>

      <PrintSection title="4  Hop Additions">
        <SectionHops rows={batch.hops} />
      </PrintSection>

      <PrintSection title="5  Yeast">
        <SectionYeast rows={batch.yeast} />
      </PrintSection>

      {batch.miscAdditions.length > 0 && (
        <PrintSection title="6  Miscellaneous Additions">
          <SectionMiscAdditions rows={batch.miscAdditions} />
        </PrintSection>
      )}

      {/* ── Explicit page break before process sections ───────────────────── */}
      <div style={{ pageBreakBefore: 'always' }} />

      {/* ── Page 2: Process & Fermentation ───────────────────────────────── */}
      <PrintSection title="7  Mash">
        <PrintKVGrid fields={[
          ['Mash Water', fmtWithUnit(m.mashWater, 'L')],
          ['Sparge Water', fmtWithUnit(m.spargeWater, 'L')],
          ['pH Target', fmtVal(m.phTarget)],
          ['pH Measured', fmtVal(m.phMeasured)],
          ['First Wort Gravity', fmtStr(m.firstWortGravity)],
        ]} />
        {m.steps.length > 0 && <SectionMashSteps steps={m.steps} />}
      </PrintSection>

      <PrintSection title="8  Water Profile">
        {fmtStr(wp.profileName) !== '—' && (
          <p className="mb-1 text-[8pt] italic text-slate-500">Profile: {wp.profileName}</p>
        )}
        <PrintTable
          head={['Calcium (ppm)', 'Magnesium (ppm)', 'Sodium (ppm)', 'Chloride (ppm)', 'Sulfate (ppm)', 'Bicarbonate (ppm)']}
          body={[[
            fmtVal(wp.calcium), fmtVal(wp.magnesium), fmtVal(wp.sodium),
            fmtVal(wp.chloride), fmtVal(wp.sulfate), fmtVal(wp.bicarbonate),
          ]]}
        />
      </PrintSection>

      <PrintSection title="9  Boil">
        <PrintKVGrid fields={[
          ['Pre-Boil Volume', fmtWithUnit(bl.preBoilVolume, 'L')],
          ['Pre-Boil Gravity', fmtStr(bl.preBoilGravity)],
          ['Post-Boil Volume', fmtWithUnit(bl.postBoilVolume, 'L')],
          ['Post-Boil Gravity', fmtStr(bl.postBoilGravity)],
          ['Boil-Off Rate', fmtWithUnit(bl.boilOffRate, 'L/hr')],
        ]} />
      </PrintSection>

      <PrintSection title="10  Fermentation Schedule">
        <PrintKVGrid fields={[
          ['Pitch Date/Time', fmtStr(ferm.pitchDateTime)],
          ['OG Measured', fmtStr(ferm.ogMeasured)],
          ['FG Measured', fmtStr(ferm.fgMeasured)],
          ['ABV (calc)', fmtStr(ferm.abvCalc)],
          ['Attenuation', fmtStr(ferm.attenuation)],
          ['Carbonation', fmtStr(ferm.carbonation)],
        ]} />
        {ferm.schedule.length > 0 && <SectionFermentationSteps steps={ferm.schedule} />}
      </PrintSection>

      <PrintSection title="11  Packaging &amp; Conditioning">
        <PrintKVGrid fields={[
          ['Date', fmtDate(pk.packagingDate)],
          ['Method', fmtStr(pk.method)],
          ['Volume Packaged', fmtWithUnit(pk.volumePackaged, 'L')],
          ['Priming Sugar', fmtWithUnit(pk.primingSugar, 'g')],
          ['Ready to Drink', fmtDate(pk.readyTodrinkDate)],
        ]} />
      </PrintSection>

      {batch.brewNotes.trim() && (
        <PrintSection title="12  Brew Notes">
          <p className="whitespace-pre-wrap text-[8.5pt]">{batch.brewNotes}</p>
        </PrintSection>
      )}
    </div>
  )
}
