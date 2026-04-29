"use client";

import { useMemo, useState } from "react";

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
import { CatalogCombobox } from "@/components/brew/CatalogCombobox";
import {
  getJolaMalt,
  groupJolaMalts,
  JOLA_CUSTOM_PRODUCT_ID,
} from "@/constants/jolaCatalog";
import { createEmptyFermentable } from "@/lib/defaults";
import type { Fermentable } from "@/types/brew";
import { Pencil, Plus, Trash2 } from "lucide-react";

function ebcToColor(ebc: string | number): string | null {
  const n = Number(ebc);
  if (!Number.isFinite(n) || n <= 0) return null;
  const srm = n * 0.508;
  if (srm < 2) return "#F8F753";
  if (srm < 4) return "#F6F513";
  if (srm < 6) return "#ECE61A";
  if (srm < 8) return "#D5BC26";
  if (srm < 10) return "#BF923B";
  if (srm < 13) return "#BF813A";
  if (srm < 17) return "#BC6733";
  if (srm < 20) return "#8D4C32";
  if (srm < 24) return "#5D341A";
  if (srm < 29) return "#261716";
  return "#0F0B0A";
}

function catalogSelectValue(row: Fermentable): string {
  if (row.catalogProductId === JOLA_CUSTOM_PRODUCT_ID) return JOLA_CUSTOM_PRODUCT_ID;
  if (row.catalogProductId && getJolaMalt(row.catalogProductId)) return row.catalogProductId;
  return "";
}

function FermentableEditDialog({
  row,
  open,
  onOpenChange,
  onSave,
  comboboxGroups,
  title = "Edit Grain",
}: {
  row: Fermentable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: Fermentable) => void;
  comboboxGroups: { label: string; items: { value: string; label: string }[] }[];
  title?: string;
}) {
  const [draft, setDraft] = useState<Fermentable>(row);
  const swatchColor = ebcToColor(draft.typicalEbc);
  const isCustom = draft.catalogProductId === JOLA_CUSTOM_PRODUCT_ID;

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(row);
    onOpenChange(next);
  };

  const handleCatalogChange = (value: string) => {
    if (value === "" || value === JOLA_CUSTOM_PRODUCT_ID) {
      setDraft((d) => ({
        ...d,
        catalogProductId: value,
        ingredient: "",
        maltType: "",
        typicalEbc: "",
      }));
      return;
    }
    const malt = getJolaMalt(value);
    if (!malt) return;
    setDraft((d) => ({
      ...d,
      catalogProductId: malt.id,
      ingredient: malt.name,
      maltType: malt.category,
      typicalEbc: malt.ebc,
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
            <Label className="text-xs">Jola malt product</Label>
            <CatalogCombobox
              value={catalogSelectValue(draft)}
              onValueChange={handleCatalogChange}
              groups={comboboxGroups}
              placeholder="Select malt…"
            />
          </div>

          {/* Custom name — only when custom entry */}
          {isCustom && (
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="grain-name">Name</Label>
              <Input
                id="grain-name"
                className="h-8 text-xs"
                placeholder="e.g. local adjunct"
                value={draft.ingredient}
                onChange={(e) => setDraft((d) => ({ ...d, ingredient: e.target.value }))}
              />
            </div>
          )}

          {/* Type + EBC side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="grain-type">Type / Role</Label>
              <Input
                id="grain-type"
                className="h-8 text-xs"
                placeholder="Line / role"
                value={draft.maltType}
                onChange={(e) => setDraft((d) => ({ ...d, maltType: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="grain-ebc">EBC</Label>
              <div className="relative flex items-center">
                {swatchColor && (
                  <span
                    className="pointer-events-none absolute left-2.5 h-3 w-3 rounded-full border border-border/40"
                    style={{ backgroundColor: swatchColor }}
                    aria-hidden="true"
                  />
                )}
                <Input
                  id="grain-ebc"
                  className={`h-8 text-xs ${swatchColor ? "pl-7" : ""}`}
                  placeholder="—"
                  value={draft.typicalEbc}
                  onChange={(e) => setDraft((d) => ({ ...d, typicalEbc: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* kg */}
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="grain-kg">Weight (kg)</Label>
            <Input
              id="grain-kg"
              className="h-8 text-xs"
              type="number"
              placeholder="0"
              value={draft.amount}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  amount: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="grain-notes">Notes</Label>
            <Input
              id="grain-notes"
              className="h-8 text-xs"
              placeholder="e.g. crushed, milled on site…"
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

function FermentableCard({
  row,
  comboboxGroups,
  onSave,
  onRemove,
  canRemove,
}: {
  row: Fermentable;
  comboboxGroups: { label: string; items: { value: string; label: string }[] }[];
  onSave: (updated: Fermentable) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const swatchColor = ebcToColor(row.typicalEbc);

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-3">
        {/* Left: name + type */}
        <div className="min-w-0 flex-1">
          {row.ingredient ? (
            <>
              <p className="truncate text-base font-semibold leading-tight">{row.ingredient}</p>
              {row.maltType && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.maltType}</p>
              )}
            </>
          ) : (
            <p className="text-base italic text-muted-foreground/60">No malt selected</p>
          )}
        </div>

        {/* Right: stats stacked vertically */}
        <div className="shrink-0 space-y-0.5 border-l border-border/50 pl-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-600">kg</span>
            <span className="text-sm font-semibold">
              {row.amount !== "" && row.amount !== undefined ? String(row.amount) : "—"}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600/80">bill</span>
            <span className="text-sm">
              {row.percentOfBill !== "" && row.percentOfBill !== undefined ? `${row.percentOfBill}%` : "—"}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">ebc</span>
            {swatchColor && (
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-border/40"
                style={{ backgroundColor: swatchColor }}
                aria-hidden="true"
              />
            )}
            <span className="text-sm">{row.typicalEbc || "—"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Edit grain"
            title="Edit grain"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label="Delete grain"
            title="Delete grain"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <FermentableEditDialog
        row={row}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onSave}
        comboboxGroups={comboboxGroups}
      />
    </>
  );
}

export function FermentablesTable({
  rows,
  onChange,
  minRows = 0,
}: {
  rows: Fermentable[];
  onChange: (rows: Fermentable[]) => void;
  minRows?: number;
}) {
  const grouped = useMemo(() => groupJolaMalts(), []);
  const groups = useMemo(() => Object.entries(grouped), [grouped]);
  const comboboxGroups = useMemo(
    () => groups.map(([label, malts]) => ({ label, items: malts.map((m) => ({ value: m.id, label: m.name })) })),
    [groups]
  );

  const withCalculatedPercent = (nextRows: Fermentable[]) => {
    const totalAmount = nextRows.reduce(
      (sum, row) => sum + (typeof row.amount === "number" && Number.isFinite(row.amount) ? row.amount : 0),
      0
    );

    if (totalAmount <= 0) {
      return nextRows.map<Fermentable>((row) => ({ ...row, percentOfBill: "" }));
    }

    const rowsWithAmount = nextRows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => typeof row.amount === "number" && Number.isFinite(row.amount) && row.amount > 0);

    const roundedPercents = rowsWithAmount.map(({ row, index }) => ({
      index,
      rounded: Number((((row.amount as number) / totalAmount) * 100).toFixed(2)),
    }));

    const roundedSum = roundedPercents.reduce((sum, item) => sum + item.rounded, 0);
    const drift = Number((100 - roundedSum).toFixed(2));

    if (roundedPercents.length > 0 && drift !== 0) {
      const last = roundedPercents[roundedPercents.length - 1];
      last.rounded = Number((last.rounded + drift).toFixed(2));
    }

    const percentByIndex = new Map(roundedPercents.map((item) => [item.index, item.rounded]));

    return nextRows.map<Fermentable>((row, index) => ({
      ...row,
      percentOfBill: percentByIndex.get(index) ?? "",
    }));
  };

  const [pendingRow, setPendingRow] = useState<Fermentable | null>(null);

  const saveRow = (id: string, updated: Fermentable) =>
    onChange(withCalculatedPercent(rows.map((r) => (r.id === id ? updated : r))));

  const saveNewRow = (row: Fermentable) => {
    onChange(withCalculatedPercent([...rows, row]));
    setPendingRow(null);
  };

  const removeRow = (id: string) => {
    if (rows.length <= minRows) return;
    onChange(withCalculatedPercent(rows.filter((r) => r.id !== id)));
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground sm:text-xs">
        Grain bill uses your Jola supplier catalog. Pick a catalog malt to auto-fill EBC and type,
        or choose Custom to enter manually. % bill is auto-calculated from kg amounts.
      </p>
      <div className="space-y-3">
        {rows.map((row) => (
          <FermentableCard
            key={row.id}
            row={row}
            comboboxGroups={comboboxGroups}
            onSave={(updated) => saveRow(row.id, updated)}
            onRemove={() => removeRow(row.id)}
            canRemove={rows.length > minRows}
          />
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1 text-xs sm:h-7"
        onClick={() => setPendingRow(createEmptyFermentable())}
      >
        <Plus className="h-3 w-3" />
        Add Grain
      </Button>

      {pendingRow && (
        <FermentableEditDialog
          row={pendingRow}
          open={true}
          onOpenChange={(open) => { if (!open) setPendingRow(null); }}
          onSave={saveNewRow}
          comboboxGroups={comboboxGroups}
          title="Add Grain"
        />
      )}
    </div>
  );
}
