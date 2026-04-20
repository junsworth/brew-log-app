"use client";

import { Input } from "@/components/ui/input";
import type { GravityStat, GravityStats } from "@/types/brew";

interface Props {
  data: GravityStats;
  onChange: (next: GravityStats) => void;
}

const STAT_CONFIG: { key: keyof GravityStats; label: string; placeholder: string }[] = [
  { key: "preBoilGravity", label: "Pre-Boil Gravity", placeholder: "1.050" },
  { key: "originalGravity", label: "Original Gravity (OG)", placeholder: "1.065" },
  { key: "finalGravity", label: "Final Gravity (FG)", placeholder: "1.012" },
  { key: "abv", label: "ABV (%)", placeholder: "6.9" },
  { key: "mashEfficiency", label: "Mash Efficiency (%)", placeholder: "75" },
  { key: "brewhouseEfficiency", label: "Brewhouse Eff. (%)", placeholder: "70" },
];

function StatCard({
  label,
  stat,
  placeholder,
  onChange,
}: {
  label: string;
  stat: GravityStat;
  placeholder: string;
  onChange: (next: GravityStat) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="bg-muted/50 px-3 py-2 text-[0.65rem] font-semibold leading-tight tracking-wider uppercase">
        {label}
      </div>
      <div className="bg-blue-50/50 px-3 py-1.5 dark:bg-blue-950/20">
        <p className="mb-1 text-[0.55rem] font-bold tracking-widest uppercase">Target</p>
        <Input
          className="h-6 border-none bg-transparent px-0 text-xs shadow-none focus-visible:ring-0"
          placeholder={placeholder}
          value={stat.target}
          onChange={(e) => onChange({ ...stat, target: e.target.value })}
        />
      </div>
      <div className="border-t-2 border-amber-400 bg-amber-50/80 px-3 py-1.5 dark:bg-amber-950/20">
        <p className="mb-1 text-[0.55rem] font-bold tracking-widest text-amber-600 uppercase">Measured</p>
        <Input
          className="h-6 border-none bg-transparent px-0 text-xs font-semibold shadow-none focus-visible:ring-0"
          placeholder={placeholder}
          value={stat.measured}
          onChange={(e) => onChange({ ...stat, measured: e.target.value })}
        />
      </div>
    </div>
  );
}

export function GravityStatsSection({ data, onChange }: Props) {
  const setStat = (key: keyof GravityStats, stat: GravityStat) => onChange({ ...data, [key]: stat });

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {STAT_CONFIG.map(({ key, label, placeholder }) => (
        <StatCard
          key={key}
          label={label}
          placeholder={placeholder}
          stat={data[key]}
          onChange={(next) => setStat(key, next)}
        />
      ))}
    </div>
  );
}
