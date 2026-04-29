"use client";

import { useMemo, useState } from "react";

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
import { CatalogCombobox } from "@/components/brew/CatalogCombobox";
import { YEAST_FORMS } from "@/constants/brewing";
import {
  JOLA_CUSTOM_PRODUCT_ID,
  JOLA_YEASTS,
  getJolaYeast,
} from "@/constants/jolaCatalog";
import { createEmptyYeast } from "@/lib/defaults";
import type { Yeast } from "@/types/brew";
import { Pencil, Plus, Trash2 } from "lucide-react";

function catalogValue(row: Yeast): string {
  if (row.catalogProductId === JOLA_CUSTOM_PRODUCT_ID) return JOLA_CUSTOM_PRODUCT_ID;
  if (row.catalogProductId && getJolaYeast(row.catalogProductId)) return row.catalogProductId;
  return "";
}

function YeastEditDialog({
  row,
  open,
  onOpenChange,
  onSave,
  comboboxGroups,
  title = "Edit Yeast",
}: {
  row: Yeast;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: Yeast) => void;
  comboboxGroups: { label: string; items: { value: string; label: string }[] }[];
  title?: string;
}) {
  const [draft, setDraft] = useState<Yeast>(row);
  const isCustom = draft.catalogProductId === JOLA_CUSTOM_PRODUCT_ID;
  const isCatalog = Boolean(draft.catalogProductId) && !isCustom;

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(row);
    onOpenChange(next);
  };

  const handleCatalogChange = (value: string) => {
    if (value === "" || value === JOLA_CUSTOM_PRODUCT_ID) {
      setDraft((d) => ({
        ...d,
        catalogProductId: value,
        strainName: "",
        labBrand: "",
        form: "",
        amount: "",
      }));
      return;
    }
    const yeast = getJolaYeast(value);
    if (!yeast) return;
    setDraft((d) => ({
      ...d,
      catalogProductId: yeast.id,
      strainName: yeast.name,
      labBrand: yeast.brand,
      form: yeast.form,
      amount: yeast.packageSize,
    }));
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
          {/* Catalog picker */}
          <div className="space-y-1.5">
            <Label className="text-xs">Jola yeast product</Label>
            <CatalogCombobox
              value={catalogValue(draft)}
              onValueChange={handleCatalogChange}
              groups={comboboxGroups}
              customOption={{ value: JOLA_CUSTOM_PRODUCT_ID, label: "Custom" }}
              placeholder="Select yeast…"
            />
          </div>

          {/* Strain name — only when custom */}
          {isCustom && (
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="yeast-strain">Strain name</Label>
              <Input
                id="yeast-strain"
                className="h-8 text-xs"
                placeholder="e.g. WLP001"
                value={draft.strainName}
                onChange={(e) => setDraft((d) => ({ ...d, strainName: e.target.value }))}
              />
            </div>
          )}

          {/* Brand + Form */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="yeast-brand">Brand / Lab</Label>
              <Input
                id="yeast-brand"
                className="h-8 text-xs"
                placeholder="e.g. Fermentis"
                value={draft.labBrand}
                readOnly={isCatalog}
                onChange={(e) => setDraft((d) => ({ ...d, labBrand: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="yeast-form">Form</Label>
              <Select
                value={draft.form}
                onValueChange={(v) => setDraft((d) => ({ ...d, form: v }))}
              >
                <SelectTrigger id="yeast-form" className="h-8 text-xs">
                  <SelectValue placeholder="Form…" />
                  <SelectContent>
                    {YEAST_FORMS.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          </div>

          {/* Amount (package size) */}
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="yeast-amount">Amount / Pack size</Label>
            <Input
              id="yeast-amount"
              className="h-8 text-xs"
              placeholder="e.g. 11.5g"
              value={draft.amount}
              readOnly={isCatalog}
              onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
            />
          </div>

          {/* Pitch temp + Attenuation */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="yeast-pitch">Pitch temp (°C)</Label>
              <Input
                id="yeast-pitch"
                className="h-8 text-xs"
                type="number"
                placeholder="—"
                value={draft.pitchTemp}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    pitchTemp: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="yeast-atten">Attenuation (%)</Label>
              <Input
                id="yeast-atten"
                className="h-8 text-xs"
                type="number"
                placeholder="—"
                value={draft.attenuation}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    attenuation: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Lot # */}
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="yeast-lot">Lot #</Label>
            <Input
              id="yeast-lot"
              className="h-8 text-xs"
              placeholder="—"
              value={draft.lotNumber}
              onChange={(e) => setDraft((d) => ({ ...d, lotNumber: e.target.value }))}
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

function YeastCard({
  row,
  comboboxGroups,
  onSave,
  onRemove,
  canRemove,
}: {
  row: Yeast;
  comboboxGroups: { label: string; items: { value: string; label: string }[] }[];
  onSave: (updated: Yeast) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);

  const subtitle = [row.labBrand, row.form].filter(Boolean).join(" · ");

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-3 px-3 py-3">
          {/* Left: strain name + subtitle */}
          <div className="min-w-0 flex-1">
            {row.strainName ? (
              <>
                <p className="truncate text-base font-semibold leading-tight">{row.strainName}</p>
                {subtitle && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
                )}
              </>
            ) : (
              <p className="text-base italic text-muted-foreground/60">No yeast selected</p>
            )}
          </div>

          {/* Right: stats stacked vertically */}
          <div className="shrink-0 space-y-0.5 border-l border-border/50 pl-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-600">amt</span>
              <span className="text-sm font-semibold">{row.amount || "—"}</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-blue-600/80">pitch</span>
              <span className="text-sm">
                {row.pitchTemp !== "" && row.pitchTemp !== undefined ? `${row.pitchTemp}°C` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">atten</span>
              <span className="text-sm">
                {row.attenuation !== "" && row.attenuation !== undefined ? `${row.attenuation}%` : "—"}
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
            aria-label="Edit yeast"
            title="Edit yeast"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label="Delete yeast"
            title="Delete yeast"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <YeastEditDialog
        row={row}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onSave}
        comboboxGroups={comboboxGroups}
      />
    </>
  );
}

export function YeastSection({
  rows,
  onChange,
}: {
  rows: Yeast[];
  onChange: (rows: Yeast[]) => void;
}) {
  const comboboxGroups = useMemo(() => {
    const byBrand = JOLA_YEASTS.reduce<Record<string, { value: string; label: string }[]>>(
      (acc, y) => {
        acc[y.brand] = acc[y.brand] ?? [];
        acc[y.brand].push({ value: y.id, label: y.name });
        return acc;
      },
      {}
    );
    return Object.entries(byBrand).map(([label, items]) => ({ label, items }));
  }, []);

  const [pendingRow, setPendingRow] = useState<Yeast | null>(null);

  const saveRow = (id: string, updated: Yeast) =>
    onChange(rows.map((r) => (r.id === id ? updated : r)));

  const saveNewRow = (row: Yeast) => {
    onChange([...rows, row]);
    setPendingRow(null);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground sm:text-xs">
        Yeast list uses your Jola supplier catalog. Choose a strain to auto-fill brand, form, and
        pack size, or choose Custom to enter manually.
      </p>
      <div className="space-y-3">
        {rows.filter((r) => r.strainName).length === 0 && (
          <p className="py-3 text-center text-sm text-muted-foreground">
            No yeast added yet.
          </p>
        )}
        {rows.filter((r) => r.strainName).map((row) => (
          <YeastCard
            key={row.id}
            row={row}
            comboboxGroups={comboboxGroups}
            onSave={(updated) => saveRow(row.id, updated)}
            onRemove={() => removeRow(row.id)}
            canRemove={rows.length > 1}
          />
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1 text-xs sm:h-7"
        onClick={() => setPendingRow(createEmptyYeast())}
      >
        <Plus className="h-3 w-3" />
        Add Yeast
      </Button>

      {pendingRow && (
        <YeastEditDialog
          row={pendingRow}
          open={true}
          onOpenChange={(open) => { if (!open) setPendingRow(null); }}
          onSave={saveNewRow}
          comboboxGroups={comboboxGroups}
          title="Add Yeast"
        />
      )}
    </div>
  );
}
