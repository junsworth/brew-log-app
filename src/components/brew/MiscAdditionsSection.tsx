"use client";

import { useState } from "react";

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
import { createEmptyMisc } from "@/lib/defaults";
import type { MiscAddition } from "@/types/brew";
import { Pencil, Plus, Trash2 } from "lucide-react";

function MiscEditDialog({
  row,
  open,
  onOpenChange,
  onSave,
  title = "Edit Addition",
}: {
  row: MiscAddition;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: MiscAddition) => void;
  title?: string;
}) {
  const [draft, setDraft] = useState<MiscAddition>(row);

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
            <Label className="text-xs" htmlFor="misc-ingredient">Ingredient</Label>
            <Input
              id="misc-ingredient"
              className="h-8 text-xs"
              placeholder="e.g. Irish Moss"
              value={draft.ingredient}
              onChange={(e) => setDraft((d) => ({ ...d, ingredient: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="misc-use">Use</Label>
              <Input
                id="misc-use"
                className="h-8 text-xs"
                placeholder="e.g. Fining"
                value={draft.use}
                onChange={(e) => setDraft((d) => ({ ...d, use: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="misc-amount">Amount</Label>
              <Input
                id="misc-amount"
                className="h-8 text-xs"
                placeholder="e.g. 1 tsp"
                value={draft.amount}
                onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="misc-time">Time / Stage</Label>
            <Input
              id="misc-time"
              className="h-8 text-xs"
              placeholder="e.g. 15 min / Flameout"
              value={draft.timeStage}
              onChange={(e) => setDraft((d) => ({ ...d, timeStage: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="misc-notes">Notes</Label>
            <Input
              id="misc-notes"
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

function MiscCard({
  row,
  onSave,
  onRemove,
  canRemove,
}: {
  row: MiscAddition;
  onSave: (updated: MiscAddition) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-3 px-3 py-3">
          {/* Left: ingredient + use */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold leading-tight">{row.ingredient}</p>
            {row.use && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.use}</p>
            )}
          </div>

          {/* Right: stats stacked vertically */}
          <div className="shrink-0 space-y-0.5 border-l border-border/50 pl-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-600">amt</span>
              <span className="text-sm font-semibold">{row.amount || "—"}</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-blue-600/80">time</span>
              <span className="text-sm">{row.timeStage || "—"}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {row.notes && (
          <div className="border-t border-border/60 px-3 py-1.5">
            <p className="text-[0.65rem] text-muted-foreground">{row.notes}</p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex justify-end gap-1 border-t border-border/60 bg-muted/40 px-2 py-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Edit addition"
            title="Edit addition"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label="Delete addition"
            title="Delete addition"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <MiscEditDialog
        row={row}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onSave}
      />
    </>
  );
}

export function MiscAdditionsSection({
  rows,
  onChange,
}: {
  rows: MiscAddition[];
  onChange: (rows: MiscAddition[]) => void;
}) {
  const [pendingRow, setPendingRow] = useState<MiscAddition | null>(null);

  const saveRow = (id: string, updated: MiscAddition) =>
    onChange(rows.map((r) => (r.id === id ? updated : r)));

  const saveNewRow = (row: MiscAddition) => {
    onChange([...rows, row]);
    setPendingRow(null);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="space-y-3">
        {rows.filter((r) => r.ingredient).length === 0 && (
          <p className="py-3 text-center text-sm text-muted-foreground">
            No additions added yet.
          </p>
        )}
        {rows.filter((r) => r.ingredient).map((row) => (
          <MiscCard
            key={row.id}
            row={row}
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
        onClick={() => setPendingRow(createEmptyMisc())}
      >
        <Plus className="h-3 w-3" />
        Add Addition
      </Button>

      {pendingRow && (
        <MiscEditDialog
          row={pendingRow}
          open={true}
          onOpenChange={(open) => { if (!open) setPendingRow(null); }}
          onSave={saveNewRow}
          title="Add Addition"
        />
      )}
    </div>
  );
}
