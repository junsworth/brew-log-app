'use client'

import { getBjcpVitals, type StyleVitals } from '@/constants/bjcpVitals'

// ── Scale configuration ─────────────────────────────────────────────────────

type StatKey = keyof StyleVitals

type StatRow = {
  key: StatKey
  label: string
  scale: [number, number]
  fmt: (v: number) => string
}

const STAT_ROWS: StatRow[] = [
  {
    key:   'ibu',
    label: 'IBU',
    scale: [0, 120],
    fmt:   (v) => v.toFixed(0),
  },
  {
    key:   'srm',
    label: 'SRM',
    scale: [0, 40],
    fmt:   (v) => v.toFixed(0),
  },
  {
    key:   'og',
    label: 'OG',
    scale: [1.000, 1.120],
    fmt:   (v) => v.toFixed(3),
  },
  {
    key:   'fg',
    label: 'FG',
    scale: [0.990, 1.040],
    fmt:   (v) => v.toFixed(3),
  },
  {
    key:   'abv',
    label: 'ABV',
    scale: [0, 20],
    fmt:   (v) => `${v.toFixed(1)}%`,
  },
]

// ── Sub-components ──────────────────────────────────────────────────────────

type StatRangeRowProps = {
  label: string
  min: number
  max: number
  scale: [number, number]
  fmt: (v: number) => string
}

function StatRangeRow({ label, min, max, scale, fmt }: StatRangeRowProps) {
  const [scaleMin, scaleMax] = scale
  const span    = scaleMax - scaleMin
  const leftPct  = ((min - scaleMin) / span) * 100
  const widthPct = ((max - min)      / span) * 100

  return (
    <div className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-2 text-xs">
      <span className="font-medium text-muted-foreground">{label}</span>
      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${label} range ${fmt(min)} to ${fmt(max)}`}
      >
        <div
          className="absolute h-2 rounded-full bg-primary/70"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
          data-testid="range-bar"
        />
      </div>
      <span className="whitespace-nowrap tabular-nums text-muted-foreground">
        {fmt(min)}–{fmt(max)}
      </span>
    </div>
  )
}

// ── Public component ────────────────────────────────────────────────────────

export function BJCPStyleGuide({ style }: { style: string }) {
  const vitals = getBjcpVitals(style)
  if (!vitals) return null

  return (
    <div className="mt-4 space-y-2.5 rounded-md border border-border bg-muted/20 p-3">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        BJCP Style Ranges
      </p>
      {STAT_ROWS.map(({ key, label, scale, fmt }) => (
        <StatRangeRow
          key={key}
          label={label}
          min={vitals[key][0]}
          max={vitals[key][1]}
          scale={scale}
          fmt={fmt}
        />
      ))}
    </div>
  )
}
