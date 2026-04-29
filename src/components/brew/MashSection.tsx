"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MASH_STEP_TYPES } from "@/constants/brewing";
import { createEmptyMashStep } from "@/lib/defaults";
import type { MashInfo, MashStep, WaterProfile } from "@/types/brew";
import { Pencil, Plus, Trash2 } from "lucide-react";

function MashStepEditDialog({
  row,
  open,
  onOpenChange,
  onSave,
  title = "Edit Step",
}: {
  row: MashStep;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: MashStep) => void;
  title?: string;
}) {
  const [draft, setDraft] = useState<MashStep>(row);

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
            <Label className="text-xs" htmlFor="step-name">Step Name</Label>
            <Input
              id="step-name"
              className="h-8 text-xs"
              placeholder="Saccharification"
              value={draft.stepName}
              onChange={(e) => setDraft((d) => ({ ...d, stepName: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="step-type">Step Type</Label>
            <Select
              value={draft.stepType}
              onValueChange={(v) => setDraft((d) => ({ ...d, stepType: v }))}
            >
              <SelectTrigger id="step-type" className="h-8 text-xs">
                <SelectValue placeholder="Type…" />
                <SelectContent>
                  {MASH_STEP_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="step-temp-target">Temp Target (°C)</Label>
              <Input
                id="step-temp-target"
                className="h-8 text-xs"
                type="number"
                placeholder="67"
                value={draft.tempTarget}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    tempTarget: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="step-temp-actual">Temp Actual (°C)</Label>
              <Input
                id="step-temp-actual"
                className="h-8 text-xs"
                type="number"
                placeholder="67"
                value={draft.tempActual}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    tempActual: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="step-duration">Duration (min)</Label>
            <Input
              id="step-duration"
              className="h-8 text-xs"
              type="number"
              placeholder="60"
              value={draft.duration}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  duration: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="step-notes">Notes</Label>
            <Input
              id="step-notes"
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

function MashStepCard({
  row,
  onSave,
  onRemove,
  canRemove,
}: {
  row: MashStep;
  onSave: (updated: MashStep) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-3 px-3 py-3">
          {/* Left: step name + type */}
          <div className="min-w-0 flex-1">
            {row.stepName ? (
              <>
                <p className="truncate text-base font-semibold leading-tight">{row.stepName}</p>
                {row.stepType && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.stepType}</p>
                )}
              </>
            ) : (
              <p className="text-base italic text-muted-foreground/60">No step name</p>
            )}
          </div>

          {/* Right: stats stacked vertically */}
          <div className="shrink-0 space-y-0.5 border-l border-border/50 pl-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-600">target</span>
              <span className="text-sm font-semibold">
                {row.tempTarget !== "" && row.tempTarget !== undefined ? `${row.tempTarget}°C` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-blue-600/80">actual</span>
              <span className="text-sm">
                {row.tempActual !== "" && row.tempActual !== undefined ? `${row.tempActual}°C` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">min</span>
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
            aria-label="Edit step"
            title="Edit step"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label="Delete step"
            title="Delete step"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <MashStepEditDialog
        row={row}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onSave}
      />
    </>
  );
}

type MashParams = Pick<MashInfo, "mashWater" | "spargeWater" | "phTarget" | "phMeasured" | "firstWortGravity">

function MashParamsEditDialog({
  data,
  open,
  onOpenChange,
  onSave,
}: {
  data: MashParams;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: MashParams) => void;
}) {
  const [draft, setDraft] = useState<MashParams>(data);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(data);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit Mash Parameters</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="mp-mash-water">Mash Water (L)</Label>
              <Input
                id="mp-mash-water"
                className="h-8 text-xs"
                type="number"
                value={draft.mashWater}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, mashWater: e.target.value === "" ? "" : Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="mp-sparge-water">Sparge Water (L)</Label>
              <Input
                id="mp-sparge-water"
                className="h-8 text-xs"
                type="number"
                value={draft.spargeWater}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, spargeWater: e.target.value === "" ? "" : Number(e.target.value) }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="mp-ph-target">Mash pH (Target)</Label>
              <Input
                id="mp-ph-target"
                className="h-8 text-xs"
                type="number"
                step="0.1"
                value={draft.phTarget}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, phTarget: e.target.value === "" ? "" : Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="mp-ph-measured">Mash pH (Measured)</Label>
              <Input
                id="mp-ph-measured"
                className="h-8 text-xs"
                type="number"
                step="0.1"
                value={draft.phMeasured}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, phMeasured: e.target.value === "" ? "" : Number(e.target.value) }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="mp-first-wort">First Wort Gravity</Label>
            <Input
              id="mp-first-wort"
              className="h-8 text-xs"
              placeholder="e.g. 1.068"
              value={draft.firstWortGravity}
              onChange={(e) => setDraft((d) => ({ ...d, firstWortGravity: e.target.value }))}
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

function MashParamsCard({
  data,
  onSave,
}: {
  data: MashParams;
  onSave: (updated: MashParams) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);

  const fmt = (val: number | string, suffix = "") =>
    val !== "" && val !== undefined ? `${val}${suffix}` : "—";

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-3 py-3 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600">mash water</p>
            <p className="text-sm font-semibold">{fmt(data.mashWater, " L")}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600/80">sparge water</p>
            <p className="text-sm">{fmt(data.spargeWater, " L")}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">ph target</p>
            <p className="text-sm">{fmt(data.phTarget)}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">ph measured</p>
            <p className="text-sm">{fmt(data.phMeasured)}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">first wort</p>
            <p className="text-sm">{data.firstWortGravity || "—"}</p>
          </div>
        </div>
        <div className="flex justify-end gap-1 border-t border-border/60 bg-muted/40 px-2 py-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Edit mash parameters"
            title="Edit mash parameters"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <MashParamsEditDialog
        data={data}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onSave}
      />
    </>
  );
}

export function MashSection({ data, onChange }: { data: MashInfo; onChange: (next: MashInfo) => void }) {
  const [pendingStep, setPendingStep] = useState<MashStep | null>(null);

  const saveStep = (id: string, updated: MashStep) =>
    onChange({ ...data, steps: data.steps.map((s) => (s.id === id ? updated : s)) });

  const saveNewStep = (step: MashStep) => {
    onChange({ ...data, steps: [...data.steps, step] });
    setPendingStep(null);
  };

  const removeStep = (id: string) => {
    if (data.steps.length <= 1) return;
    onChange({ ...data, steps: data.steps.filter((s) => s.id !== id) });
  };

  const saveParams = (params: MashParams) => onChange({ ...data, ...params });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="space-y-3">
          {data.steps.filter((s) => s.stepName).length === 0 && (
            <p className="py-3 text-center text-sm text-muted-foreground">
              No steps added yet.
            </p>
          )}
          {data.steps.filter((s) => s.stepName).map((step) => (
            <MashStepCard
              key={step.id}
              row={step}
              onSave={(updated) => saveStep(step.id, updated)}
              onRemove={() => removeStep(step.id)}
              canRemove={data.steps.length > 1}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs sm:h-7"
          onClick={() => setPendingStep(createEmptyMashStep())}
        >
          <Plus className="h-3 w-3" />
          Add Step
        </Button>

        {pendingStep && (
          <MashStepEditDialog
            row={pendingStep}
            open={true}
            onOpenChange={(open) => { if (!open) setPendingStep(null); }}
            onSave={saveNewStep}
            title="Add Step"
          />
        )}
      </div>

      <MashParamsCard
        data={{
          mashWater: data.mashWater,
          spargeWater: data.spargeWater,
          phTarget: data.phTarget,
          phMeasured: data.phMeasured,
          firstWortGravity: data.firstWortGravity,
        }}
        onSave={saveParams}
      />
    </div>
  );
}

const ION_FIELDS: { key: keyof WaterProfile; label: string; short: string }[] = [
  { key: "calcium", label: "Ca (ppm)", short: "Ca" },
  { key: "magnesium", label: "Mg (ppm)", short: "Mg" },
  { key: "sodium", label: "Na (ppm)", short: "Na" },
  { key: "chloride", label: "Cl (ppm)", short: "Cl" },
  { key: "sulfate", label: "SO4 (ppm)", short: "SO4" },
  { key: "bicarbonate", label: "HCO3 (ppm)", short: "HCO3" },
];

function WaterProfileEditDialog({
  data,
  open,
  onOpenChange,
  onSave,
}: {
  data: WaterProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: WaterProfile) => void;
}) {
  const [draft, setDraft] = useState<WaterProfile>(data);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(data);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit Water Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {ION_FIELDS.map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-xs" htmlFor={`wp-${key}`}>{label}</Label>
                <Input
                  id={`wp-${key}`}
                  className="h-8 text-xs"
                  type="number"
                  placeholder="—"
                  value={draft[key]}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      [key]: e.target.value === "" ? "" : Number(e.target.value),
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="wp-profile-name">Profile Name</Label>
            <Input
              id="wp-profile-name"
              className="h-8 text-xs"
              placeholder="e.g. London Hard Water"
              value={draft.profileName}
              onChange={(e) => setDraft((d) => ({ ...d, profileName: e.target.value }))}
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

export function WaterProfileSection({
  data,
  onChange,
}: {
  data: WaterProfile;
  onChange: (next: WaterProfile) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);

  const fmt = (val: number | string) =>
    val !== "" && val !== undefined ? String(val) : "—";

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="px-3 py-3 space-y-3">
          {data.profileName ? (
            <p className="text-base font-semibold leading-tight">{data.profileName}</p>
          ) : (
            <p className="text-base italic text-muted-foreground/60">No profile name</p>
          )}
          <div className="grid grid-cols-3 gap-x-4 gap-y-2 sm:grid-cols-6">
            {ION_FIELDS.map(({ key, short }) => (
              <div key={key}>
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{short}</p>
                <p className="text-sm">{fmt(data[key])}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-1 border-t border-border/60 bg-muted/40 px-2 py-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Edit water profile"
            title="Edit water profile"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <WaterProfileEditDialog
        data={data}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onChange}
      />
    </>
  );
}
