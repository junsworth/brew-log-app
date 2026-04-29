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
import { HOP_FORMS, HOP_USES } from "@/constants/brewing";
import {
  getJolaHop,
  groupJolaHopsByOrigin,
  JOLA_CUSTOM_PRODUCT_ID,
} from "@/constants/jolaCatalog";
import { createEmptyHop } from "@/lib/defaults";
import type { HopAddition } from "@/types/brew";
import { Pencil, Plus, Trash2 } from "lucide-react";

function catalogValue(row: HopAddition): string {
  if (row.catalogProductId === JOLA_CUSTOM_PRODUCT_ID) return JOLA_CUSTOM_PRODUCT_ID;
  if (row.catalogProductId && getJolaHop(row.catalogProductId)) return row.catalogProductId;
  return "";
}

function HopEditDialog({
  row,
  open,
  onOpenChange,
  onSave,
  comboboxGroups,
  title = "Edit Hop",
}: {
  row: HopAddition;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: HopAddition) => void;
  comboboxGroups: { label: string; items: { value: string; label: string }[] }[];
  title?: string;
}) {
  const [draft, setDraft] = useState<HopAddition>(row);
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
        variety: "",
        alphaPercent: "",
      }));
      return;
    }
    const hop = getJolaHop(value);
    if (!hop) return;
    setDraft((d) => ({
      ...d,
      catalogProductId: hop.id,
      variety: hop.name,
      alphaPercent: hop.alphaPercent ?? "",
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
            <Label className="text-xs">Jola hop product</Label>
            <CatalogCombobox
              value={catalogValue(draft)}
              onValueChange={handleCatalogChange}
              groups={comboboxGroups}
              customOption={{ value: JOLA_CUSTOM_PRODUCT_ID, label: "Custom" }}
              placeholder="Select hop…"
            />
          </div>

          {/* Variety name — only when custom */}
          {isCustom && (
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="hop-variety">Variety</Label>
              <Input
                id="hop-variety"
                className="h-8 text-xs"
                placeholder="e.g. Mosaic"
                value={draft.variety}
                onChange={(e) => setDraft((d) => ({ ...d, variety: e.target.value }))}
              />
            </div>
          )}

          {/* Form + Alpha % */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="hop-form">Form</Label>
              <Select
                value={draft.form}
                onValueChange={(v) => setDraft((d) => ({ ...d, form: v }))}
              >
                <SelectTrigger id="hop-form" className="h-8 text-xs">
                  <SelectValue placeholder="Form…" />
                  <SelectContent>
                    {HOP_FORMS.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="hop-alpha">Alpha %</Label>
              <Input
                id="hop-alpha"
                className="h-8 text-xs"
                type="number"
                placeholder="—"
                value={draft.alphaPercent}
                readOnly={isCatalog}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    alphaPercent: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Amount + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="hop-amount">Amount (g)</Label>
              <Input
                id="hop-amount"
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
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="hop-time">Time (min)</Label>
              <Input
                id="hop-time"
                className="h-8 text-xs"
                type="number"
                placeholder="—"
                value={draft.time}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    time: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Use */}
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="hop-use">Use</Label>
            <Select
              value={draft.use}
              onValueChange={(v) => setDraft((d) => ({ ...d, use: v }))}
            >
              <SelectTrigger id="hop-use" className="h-8 text-xs">
                <SelectValue placeholder="Use…" />
                <SelectContent>
                  {HOP_USES.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>

          {/* IBU */}
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="hop-ibu">IBU</Label>
            <Input
              id="hop-ibu"
              className="h-8 text-xs"
              type="number"
              placeholder="—"
              value={draft.ibu}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  ibu: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
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

function HopCard({
  row,
  comboboxGroups,
  onSave,
  onRemove,
  canRemove,
}: {
  row: HopAddition;
  comboboxGroups: { label: string; items: { value: string; label: string }[] }[];
  onSave: (updated: HopAddition) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);

  const subtitle = [
    row.form,
    row.alphaPercent !== "" && row.alphaPercent !== undefined
      ? `${row.alphaPercent}%α`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-3">
        {/* Left: variety + subtitle */}
        <div className="min-w-0 flex-1">
          {row.variety ? (
            <>
              <p className="truncate text-base font-semibold leading-tight">{row.variety}</p>
              {subtitle && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
              )}
            </>
          ) : (
            <p className="text-base italic text-muted-foreground/60">No hop selected</p>
          )}
        </div>

        {/* Right: stats stacked vertically */}
        <div className="shrink-0 space-y-0.5 border-l border-border/50 pl-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-600">g</span>
            <span className="text-sm font-semibold">
              {row.amount !== "" && row.amount !== undefined ? String(row.amount) : "—"}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600/80">use</span>
            <span className="text-sm">{row.use || "—"}</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">min</span>
            <span className="text-sm">
              {row.time !== "" && row.time !== undefined ? String(row.time) : "—"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Edit hop"
            title="Edit hop"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label="Delete hop"
            title="Delete hop"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <HopEditDialog
        row={row}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onSave}
        comboboxGroups={comboboxGroups}
      />
    </>
  );
}

export function HopAdditionsSection({
  rows,
  onChange,
}: {
  rows: HopAddition[];
  onChange: (rows: HopAddition[]) => void;
}) {
  const groups = useMemo(() => Object.entries(groupJolaHopsByOrigin()), []);
  const comboboxGroups = useMemo(
    () => groups.map(([label, hops]) => ({ label, items: hops.map((h) => ({ value: h.id, label: h.name })) })),
    [groups]
  );

  const [pendingRow, setPendingRow] = useState<HopAddition | null>(null);

  const saveRow = (id: string, updated: HopAddition) =>
    onChange(rows.map((r) => (r.id === id ? updated : r)));

  const saveNewRow = (row: HopAddition) => {
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
        Hops come from your Jola supplier catalog. Choose a hop to auto-fill variety and alpha %,
        or choose Custom to enter manually.
      </p>
      <div className="space-y-3">
        {rows.filter((r) => r.variety).length === 0 && (
          <p className="py-3 text-center text-sm text-muted-foreground">
            No hops added yet.
          </p>
        )}
        {rows.filter((r) => r.variety).map((row) => (
          <HopCard
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
        onClick={() => setPendingRow(createEmptyHop())}
      >
        <Plus className="h-3 w-3" />
        Add Hop
      </Button>

      {pendingRow && (
        <HopEditDialog
          row={pendingRow}
          open={true}
          onOpenChange={(open) => { if (!open) setPendingRow(null); }}
          onSave={saveNewRow}
          comboboxGroups={comboboxGroups}
          title="Add Hop"
        />
      )}
    </div>
  );
}
