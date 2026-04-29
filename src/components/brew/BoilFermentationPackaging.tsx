"use client";

import { useState } from "react";

import { FERMENTATION_STEP_TYPES, PACKAGING_METHODS } from "@/constants/brewing";
import { createEmptyFermentationStep } from "@/lib/defaults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BoilInfo, FermentationInfo, FermentationStep, PackagingInfo } from "@/types/brew";
import { Pencil, Plus, Trash2 } from "lucide-react";

function BoilEditDialog({
  data,
  open,
  onOpenChange,
  onSave,
}: {
  data: BoilInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: BoilInfo) => void;
}) {
  const [draft, setDraft] = useState<BoilInfo>(data);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(data);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit Boil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="boil-pre-vol">Pre-Boil Volume (L)</Label>
              <Input
                id="boil-pre-vol"
                className="h-8 text-xs"
                type="number"
                placeholder="—"
                value={draft.preBoilVolume}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, preBoilVolume: e.target.value === "" ? "" : Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="boil-pre-og">Pre-Boil Gravity</Label>
              <Input
                id="boil-pre-og"
                className="h-8 text-xs"
                placeholder="e.g. 1.048"
                value={draft.preBoilGravity}
                onChange={(e) => setDraft((d) => ({ ...d, preBoilGravity: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="boil-post-vol">Post-Boil Volume (L)</Label>
              <Input
                id="boil-post-vol"
                className="h-8 text-xs"
                type="number"
                placeholder="—"
                value={draft.postBoilVolume}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, postBoilVolume: e.target.value === "" ? "" : Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="boil-post-og">Post-Boil Gravity</Label>
              <Input
                id="boil-post-og"
                className="h-8 text-xs"
                placeholder="e.g. 1.060"
                value={draft.postBoilGravity}
                onChange={(e) => setDraft((d) => ({ ...d, postBoilGravity: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="boil-off-rate">Boil-off Rate (L/hr)</Label>
            <Input
              id="boil-off-rate"
              className="h-8 text-xs"
              type="number"
              placeholder="—"
              value={draft.boilOffRate}
              onChange={(e) =>
                setDraft((d) => ({ ...d, boilOffRate: e.target.value === "" ? "" : Number(e.target.value) }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => { onSave(draft); onOpenChange(false); }}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BoilSection({ data, onChange }: { data: BoilInfo; onChange: (next: BoilInfo) => void }) {
  const [editOpen, setEditOpen] = useState(false);

  const fmt = (val: number | string, suffix = "") =>
    val !== "" && val !== undefined ? `${val}${suffix}` : "—";

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-3 py-3 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600">pre-boil vol</p>
            <p className="text-sm font-semibold">{fmt(data.preBoilVolume, " L")}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600/80">pre-boil OG</p>
            <p className="text-sm">{data.preBoilGravity || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600">post-boil vol</p>
            <p className="text-sm font-semibold">{fmt(data.postBoilVolume, " L")}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600/80">post-boil OG</p>
            <p className="text-sm">{data.postBoilGravity || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">boil-off rate</p>
            <p className="text-sm">{fmt(data.boilOffRate, " L/hr")}</p>
          </div>
        </div>
        <div className="flex justify-end gap-1 border-t border-border/60 bg-muted/40 px-2 py-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Edit boil"
            title="Edit boil"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <BoilEditDialog
        data={data}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onChange}
      />
    </>
  );
}

function FermentationStepEditDialog({
  row,
  open,
  onOpenChange,
  onSave,
  title = "Edit Step",
}: {
  row: FermentationStep;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: FermentationStep) => void;
  title?: string;
}) {
  const [draft, setDraft] = useState<FermentationStep>(row);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(row);
    onOpenChange(next);
  };

  const handleSave = () => {
    onSave(draft);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="ferm-step-name">Step Name</Label>
            <Input
              id="ferm-step-name"
              className="h-8 text-xs"
              placeholder="Primary"
              value={draft.stepName}
              onChange={(e) => setDraft((d) => ({ ...d, stepName: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="ferm-step-type">Type</Label>
            <Select
              value={draft.type}
              onValueChange={(v) => setDraft((d) => ({ ...d, type: v }))}
            >
              <SelectTrigger id="ferm-step-type" className="h-8 text-xs">
                <SelectValue placeholder="Type…" />
                <SelectContent>
                  {FERMENTATION_STEP_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="ferm-temp">Temp (°C)</Label>
              <Input
                id="ferm-temp"
                className="h-8 text-xs"
                type="number"
                placeholder="20"
                value={draft.temp}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, temp: e.target.value === "" ? "" : Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="ferm-duration">Duration (days)</Label>
              <Input
                id="ferm-duration"
                className="h-8 text-xs"
                type="number"
                placeholder="14"
                value={draft.duration}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, duration: e.target.value === "" ? "" : Number(e.target.value) }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="ferm-start">Start Date</Label>
              <Input
                id="ferm-start"
                className="h-8 text-xs"
                placeholder="YYYY-MM-DD"
                value={draft.startDate}
                onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="ferm-end">End Date</Label>
              <Input
                id="ferm-end"
                className="h-8 text-xs"
                placeholder="YYYY-MM-DD"
                value={draft.endDate}
                onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="ferm-notes">Notes</Label>
            <Input
              id="ferm-notes"
              className="h-8 text-xs"
              placeholder="—"
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FermentationStepCard({
  row,
  onSave,
  onRemove,
  canRemove,
}: {
  row: FermentationStep;
  onSave: (updated: FermentationStep) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);

  const dateRange = [row.startDate, row.endDate].filter(Boolean).join(" → ");

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-3 px-3 py-3">
          {/* Left: step name + type + dates */}
          <div className="min-w-0 flex-1">
            {row.stepName ? (
              <>
                <p className="truncate text-base font-semibold leading-tight">{row.stepName}</p>
                {row.type && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.type}</p>
                )}
                {dateRange && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{dateRange}</p>
                )}
              </>
            ) : (
              <p className="text-base italic text-muted-foreground/60">No step name</p>
            )}
          </div>

          {/* Right: stats stacked vertically */}
          <div className="shrink-0 space-y-0.5 border-l border-border/50 pl-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-600">temp</span>
              <span className="text-sm font-semibold">
                {row.temp !== "" && row.temp !== undefined ? `${row.temp}°C` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-blue-600/80">days</span>
              <span className="text-sm">
                {row.duration !== "" && row.duration !== undefined ? String(row.duration) : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex justify-end gap-1 border-t border-border/60 bg-muted/40 px-2 py-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Edit fermentation step"
            title="Edit fermentation step"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label="Delete fermentation step"
            title="Delete fermentation step"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <FermentationStepEditDialog
        row={row}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onSave}
      />
    </>
  );
}

type FermentationParams = Pick<FermentationInfo,
  "pitchDateTime" | "ogMeasured" | "fgMeasured" | "abvCalc" | "attenuation" | "carbonation"
>

function FermentationParamsEditDialog({
  data,
  open,
  onOpenChange,
  onSave,
}: {
  data: FermentationParams;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: FermentationParams) => void;
}) {
  const [draft, setDraft] = useState<FermentationParams>(data);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(data);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit Fermentation Results</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="fp-pitch">Pitch Date & Time</Label>
              <Input
                id="fp-pitch"
                className="h-8 text-xs"
                placeholder="—"
                value={draft.pitchDateTime}
                onChange={(e) => setDraft((d) => ({ ...d, pitchDateTime: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="fp-og">OG Measured</Label>
              <Input
                id="fp-og"
                className="h-8 text-xs"
                placeholder="e.g. 1.052"
                value={draft.ogMeasured}
                onChange={(e) => setDraft((d) => ({ ...d, ogMeasured: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="fp-fg">FG Measured</Label>
              <Input
                id="fp-fg"
                className="h-8 text-xs"
                placeholder="e.g. 1.010"
                value={draft.fgMeasured}
                onChange={(e) => setDraft((d) => ({ ...d, fgMeasured: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="fp-abv">ABV (Calc.)</Label>
              <Input
                id="fp-abv"
                className="h-8 text-xs"
                placeholder="—"
                value={draft.abvCalc}
                onChange={(e) => setDraft((d) => ({ ...d, abvCalc: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="fp-atten">Attenuation (%)</Label>
              <Input
                id="fp-atten"
                className="h-8 text-xs"
                placeholder="—"
                value={draft.attenuation}
                onChange={(e) => setDraft((d) => ({ ...d, attenuation: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="fp-carb">Carbonation (vol)</Label>
              <Input
                id="fp-carb"
                className="h-8 text-xs"
                placeholder="—"
                value={draft.carbonation}
                onChange={(e) => setDraft((d) => ({ ...d, carbonation: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => { onSave(draft); onOpenChange(false); }}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FermentationParamsCard({
  data,
  onSave,
}: {
  data: FermentationParams;
  onSave: (updated: FermentationParams) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-3 py-3 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600">pitch</p>
            <p className="text-sm font-semibold">{data.pitchDateTime || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600/80">OG</p>
            <p className="text-sm">{data.ogMeasured || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600/80">FG</p>
            <p className="text-sm">{data.fgMeasured || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600">ABV</p>
            <p className="text-sm">{data.abvCalc || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">atten</p>
            <p className="text-sm">{data.attenuation || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">carb</p>
            <p className="text-sm">{data.carbonation || "—"}</p>
          </div>
        </div>
        <div className="flex justify-end gap-1 border-t border-border/60 bg-muted/40 px-2 py-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Edit fermentation results"
            title="Edit fermentation results"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <FermentationParamsEditDialog
        data={data}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onSave}
      />
    </>
  );
}

export function FermentationSection({
  data,
  onChange,
}: {
  data: FermentationInfo;
  onChange: (next: FermentationInfo) => void;
}) {
  const [pendingStep, setPendingStep] = useState<FermentationStep | null>(null);

  const saveStep = (id: string, updated: FermentationStep) =>
    onChange({ ...data, schedule: data.schedule.map((s) => (s.id === id ? updated : s)) });

  const saveNewStep = (step: FermentationStep) => {
    onChange({ ...data, schedule: [...data.schedule, step] });
    setPendingStep(null);
  };

  const removeStep = (id: string) => {
    if (data.schedule.length <= 1) return;
    onChange({ ...data, schedule: data.schedule.filter((s) => s.id !== id) });
  };

  const saveParams = (params: FermentationParams) => onChange({ ...data, ...params });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="space-y-3">
          {data.schedule.filter((s) => s.stepName).length === 0 && (
            <p className="py-3 text-center text-sm text-muted-foreground">
              No steps added yet.
            </p>
          )}
          {data.schedule.filter((s) => s.stepName).map((step) => (
            <FermentationStepCard
              key={step.id}
              row={step}
              onSave={(updated) => saveStep(step.id, updated)}
              onRemove={() => removeStep(step.id)}
              canRemove={data.schedule.length > 1}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs sm:h-7"
          onClick={() => setPendingStep(createEmptyFermentationStep())}
        >
          <Plus className="h-3 w-3" />
          Add Step
        </Button>

        {pendingStep && (
          <FermentationStepEditDialog
            row={pendingStep}
            open={true}
            onOpenChange={(open) => { if (!open) setPendingStep(null); }}
            onSave={saveNewStep}
            title="Add Step"
          />
        )}
      </div>

      <FermentationParamsCard
        data={{
          pitchDateTime: data.pitchDateTime,
          ogMeasured: data.ogMeasured,
          fgMeasured: data.fgMeasured,
          abvCalc: data.abvCalc,
          attenuation: data.attenuation,
          carbonation: data.carbonation,
        }}
        onSave={saveParams}
      />
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
