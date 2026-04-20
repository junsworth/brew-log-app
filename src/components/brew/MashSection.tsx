"use client";

import { BrewTable, type ColumnDef } from "@/components/brew/BrewTable";
import { MASH_STEP_TYPES } from "@/constants/brewing";
import { createEmptyMashStep } from "@/lib/defaults";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MashInfo, MashStep, WaterProfile } from "@/types/brew";

const MASH_COLUMNS: ColumnDef<MashStep>[] = [
  { key: "stepName", header: "Step Name", placeholder: "Saccharification", width: "20%" },
  { key: "stepType", header: "Type", type: "select", options: MASH_STEP_TYPES, width: "13%" },
  { key: "tempTarget", header: "Temp Target (C)", type: "number", placeholder: "67", width: "14%" },
  { key: "tempActual", header: "Temp Actual (C)", type: "number", placeholder: "67", width: "14%" },
  { key: "duration", header: "Duration (min)", type: "number", placeholder: "60", width: "13%" },
  { key: "notes", header: "Notes", placeholder: "-" },
];

export function MashSection({ data, onChange }: { data: MashInfo; onChange: (next: MashInfo) => void }) {
  const set = <K extends keyof MashInfo>(key: K, value: MashInfo[K]) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <BrewTable
        rows={data.steps}
        columns={MASH_COLUMNS}
        onCreate={createEmptyMashStep}
        onChange={(steps) => set("steps", steps)}
        minRows={1}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
        <div className="space-y-1.5">
          <Label>Mash Water (L)</Label>
          <Input type="number" value={data.mashWater} onChange={(e) => set("mashWater", e.target.value === "" ? "" : Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label>Sparge Water (L)</Label>
          <Input type="number" value={data.spargeWater} onChange={(e) => set("spargeWater", e.target.value === "" ? "" : Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label>Mash pH (Target)</Label>
          <Input type="number" step="0.1" value={data.phTarget} onChange={(e) => set("phTarget", e.target.value === "" ? "" : Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label>Mash pH (Measured)</Label>
          <Input type="number" step="0.1" value={data.phMeasured} onChange={(e) => set("phMeasured", e.target.value === "" ? "" : Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label>First Wort Gravity</Label>
          <Input value={data.firstWortGravity} onChange={(e) => set("firstWortGravity", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

const ION_FIELDS: { key: keyof WaterProfile; label: string }[] = [
  { key: "calcium", label: "Ca (ppm)" },
  { key: "magnesium", label: "Mg (ppm)" },
  { key: "sodium", label: "Na (ppm)" },
  { key: "chloride", label: "Cl (ppm)" },
  { key: "sulfate", label: "SO4 (ppm)" },
  { key: "bicarbonate", label: "HCO3 (ppm)" },
];

export function WaterProfileSection({
  data,
  onChange,
}: {
  data: WaterProfile;
  onChange: (next: WaterProfile) => void;
}) {
  const set = <K extends keyof WaterProfile>(key: K, value: WaterProfile[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
      {ION_FIELDS.map(({ key, label }) => (
        <div key={key} className="space-y-1.5">
          <Label>{label}</Label>
          <Input
            type="number"
            value={data[key]}
            onChange={(e) => set(key, e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
      ))}
      <div className="col-span-1 space-y-1.5">
        <Label>Profile Name</Label>
        <Input value={data.profileName} onChange={(e) => set("profileName", e.target.value)} />
      </div>
    </div>
  );
}
