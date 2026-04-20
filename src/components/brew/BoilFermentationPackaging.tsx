"use client";

import { BrewTable, type ColumnDef } from "@/components/brew/BrewTable";
import { FERMENTATION_STEP_TYPES, PACKAGING_METHODS } from "@/constants/brewing";
import { createEmptyFermentationStep } from "@/lib/defaults";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BoilInfo, FermentationInfo, FermentationStep, PackagingInfo } from "@/types/brew";

export function BoilSection({ data, onChange }: { data: BoilInfo; onChange: (next: BoilInfo) => void }) {
  const set = <K extends keyof BoilInfo>(key: K, value: BoilInfo[K]) => onChange({ ...data, [key]: value });
  const fields: { key: keyof BoilInfo; label: string }[] = [
    { key: "preBoilVolume", label: "Pre-Boil Volume (L)" },
    { key: "preBoilGravity", label: "Pre-Boil Gravity" },
    { key: "postBoilVolume", label: "Post-Boil Volume (L)" },
    { key: "postBoilGravity", label: "Post-Boil Gravity" },
    { key: "boilOffRate", label: "Boil-off Rate (L/hr)" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
      {fields.map(({ key, label }) => (
        <div key={key} className="space-y-1.5">
          <Label>{label}</Label>
          <Input
            type={key === "preBoilGravity" || key === "postBoilGravity" ? "text" : "number"}
            value={data[key]}
            onChange={(e) =>
              set(
                key,
                key === "preBoilGravity" || key === "postBoilGravity"
                  ? e.target.value
                  : e.target.value === ""
                    ? ""
                    : Number(e.target.value)
              )
            }
          />
        </div>
      ))}
    </div>
  );
}

const FERM_COLUMNS: ColumnDef<FermentationStep>[] = [
  { key: "stepName", header: "Step Name", placeholder: "Primary", width: "16%" },
  { key: "type", header: "Type", type: "select", options: FERMENTATION_STEP_TYPES, width: "14%" },
  { key: "temp", header: "Temp (C)", type: "number", placeholder: "20", width: "10%" },
  { key: "duration", header: "Days", type: "number", placeholder: "14", width: "8%" },
  { key: "startDate", header: "Start Date", placeholder: "YYYY-MM-DD", width: "13%" },
  { key: "endDate", header: "End Date", placeholder: "YYYY-MM-DD", width: "13%" },
  { key: "notes", header: "Notes", placeholder: "-" },
];

export function FermentationSection({
  data,
  onChange,
}: {
  data: FermentationInfo;
  onChange: (next: FermentationInfo) => void;
}) {
  const set = <K extends keyof FermentationInfo>(key: K, value: FermentationInfo[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <BrewTable
        rows={data.schedule}
        columns={FERM_COLUMNS}
        onCreate={createEmptyFermentationStep}
        onChange={(schedule) => set("schedule", schedule)}
        minRows={1}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {[
          { key: "pitchDateTime" as const, label: "Pitch Date & Time" },
          { key: "ogMeasured" as const, label: "OG Measured" },
          { key: "fgMeasured" as const, label: "FG Measured" },
          { key: "abvCalc" as const, label: "ABV (Calc.)" },
          { key: "attenuation" as const, label: "Attenuation (%)" },
          { key: "carbonation" as const, label: "Carbonation (vol)" },
        ].map(({ key, label }) => (
          <div key={key} className="space-y-1.5">
            <Label>{label}</Label>
            <Input value={data[key]} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PackagingSection({
  data,
  onChange,
}: {
  data: PackagingInfo;
  onChange: (next: PackagingInfo) => void;
}) {
  const set = <K extends keyof PackagingInfo>(key: K, value: PackagingInfo[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
      <div className="space-y-1.5">
        <Label>Packaging Date</Label>
        <Input type="date" value={data.packagingDate} onChange={(e) => set("packagingDate", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Method</Label>
        <Select value={data.method} onValueChange={(v) => set("method", v as PackagingInfo["method"])}>
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
            <SelectContent>
              {PACKAGING_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectTrigger>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Volume Packaged (L)</Label>
        <Input
          type="number"
          value={data.volumePackaged}
          onChange={(e) => set("volumePackaged", e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Priming Sugar (g)</Label>
        <Input
          type="number"
          value={data.primingSugar}
          onChange={(e) => set("primingSugar", e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Ready to Drink</Label>
        <Input type="date" value={data.readyTodrinkDate} onChange={(e) => set("readyTodrinkDate", e.target.value)} />
      </div>
    </div>
  );
}
