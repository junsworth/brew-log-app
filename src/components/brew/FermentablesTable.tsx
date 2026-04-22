"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectOptGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getJolaMalt,
  groupJolaMalts,
  JOLA_CUSTOM_PRODUCT_ID,
} from "@/constants/jolaCatalog";
import { createEmptyFermentable } from "@/lib/defaults";
import type { Fermentable } from "@/types/brew";
import { Plus, Trash2 } from "lucide-react";

const ACTION_COL_PX = 44;

function catalogSelectValue(row: Fermentable): string {
  if (row.catalogProductId === JOLA_CUSTOM_PRODUCT_ID) return JOLA_CUSTOM_PRODUCT_ID;
  if (row.catalogProductId && getJolaMalt(row.catalogProductId)) return row.catalogProductId;
  return "";
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

  const updateRow = (id: string, patch: Partial<Fermentable>) =>
    onChange(withCalculatedPercent(rows.map((r) => (r.id === id ? { ...r, ...patch } : r))));

  const onCatalogChange = (rowId: string, value: string) => {
    if (value === "" || value === JOLA_CUSTOM_PRODUCT_ID) {
      if (value === JOLA_CUSTOM_PRODUCT_ID) {
        updateRow(rowId, {
          catalogProductId: JOLA_CUSTOM_PRODUCT_ID,
          ingredient: "",
          maltType: "",
          typicalEbc: "",
        });
      } else {
        updateRow(rowId, {
          catalogProductId: "",
          ingredient: "",
          maltType: "",
          typicalEbc: "",
        });
      }
      return;
    }

    const malt = getJolaMalt(value);
    if (!malt) return;
    updateRow(rowId, {
      catalogProductId: malt.id,
      ingredient: malt.name,
      maltType: malt.category,
      typicalEbc: malt.ebc,
    });
  };

  const addRow = () => onChange(withCalculatedPercent([...rows, createEmptyFermentable()]));

  const removeRow = (id: string) => {
    if (rows.length <= minRows) return;
    onChange(withCalculatedPercent(rows.filter((r) => r.id !== id)));
  };

  const isCustom = (row: Fermentable) => row.catalogProductId === JOLA_CUSTOM_PRODUCT_ID;

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground sm:text-xs">
        Grain bill uses your Jola supplier catalog (Maltes / Lupulos / Leveduras PDF). Pick a catalog malt
        (EBC auto-filled from supplier list) or choose Custom. Type and EBC stay editable. `% bill` is
        auto-calculated from kg amounts.
      </p>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-xs sm:min-w-0">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: ACTION_COL_PX }} />
          </colgroup>
          <thead>
            <tr className="bg-muted/70">
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                Jola malt product
              </th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                Name (custom)
              </th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th
                className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground"
                title="European Brewery Convention colour units (EBC), as used on The Swaen malt pages"
              >
                EBC
              </th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                kg
              </th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                % bill
              </th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                Notes
              </th>
              <th
                className="border-b border-border/60 px-0 py-2 text-center align-middle"
                style={{ width: ACTION_COL_PX }}
                aria-label="Row actions"
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="min-w-0 border-x border-border/40 px-1 py-0.5 align-middle">
                  <Select
                    value={catalogSelectValue(row)}
                    onValueChange={(v) => onCatalogChange(row.id, v)}
                  >
                    <SelectTrigger className="h-8 min-w-0 w-full max-w-full border-none bg-transparent px-1 text-[11px] shadow-none sm:h-7 sm:text-xs">
                      <SelectValue placeholder="Select malt…" />
                      <SelectContent>
                        {groups.map(([groupName, malts]) => (
                          <SelectOptGroup key={groupName} label={groupName}>
                            {malts.map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectOptGroup>
                        ))}
                        <SelectItem value={JOLA_CUSTOM_PRODUCT_ID}>Custom (other grain / fermentable)</SelectItem>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </td>
                <td className="min-w-0 border-x border-border/40 px-1 py-0.5 align-middle">
                  <Input
                    className="h-8 min-w-0 w-full border-none bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 sm:h-7"
                    placeholder={isCustom(row) ? "e.g. local adjunct" : "From catalog"}
                    value={row.ingredient}
                    readOnly={!isCustom(row) && Boolean(row.catalogProductId)}
                    onChange={(e) => updateRow(row.id, { ingredient: e.target.value })}
                  />
                </td>
                <td className="min-w-0 border-x border-border/40 px-1 py-0.5 align-middle">
                  <Input
                    className="h-8 min-w-0 w-full border-none bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 sm:h-7"
                    placeholder="Line / role"
                    value={row.maltType}
                    onChange={(e) => updateRow(row.id, { maltType: e.target.value })}
                  />
                </td>
                <td className="min-w-0 border-x border-border/40 px-1 py-0.5 align-middle">
                  <Input
                    className="h-8 min-w-0 w-full border-none bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 sm:h-7"
                    placeholder="—"
                    value={row.typicalEbc}
                    onChange={(e) => updateRow(row.id, { typicalEbc: e.target.value })}
                  />
                </td>
                <td className="min-w-0 border-x border-border/40 px-1 py-0.5 align-middle">
                  <Input
                    className="h-8 min-w-0 w-full border-none bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 sm:h-7"
                    type="number"
                    placeholder="0"
                    value={row.amount}
                    onChange={(e) =>
                      updateRow(row.id, {
                        amount: e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td className="min-w-0 border-x border-border/40 px-1 py-0.5 align-middle">
                  <Input
                    className="h-8 min-w-0 w-full border-none bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 sm:h-7"
                    placeholder="auto"
                    value={row.percentOfBill}
                    readOnly
                  />
                </td>
                <td className="min-w-0 border-x border-border/40 px-1 py-0.5 align-middle">
                  <Input
                    className="h-8 min-w-0 w-full border-none bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 sm:h-7"
                    placeholder="e.g. crushed"
                    value={row.notes}
                    onChange={(e) => updateRow(row.id, { notes: e.target.value })}
                  />
                </td>
                <td
                  className={
                    idx % 2 === 0
                      ? "w-11 min-w-11 border-x border-border/40 bg-background px-0 py-0.5 text-center align-middle"
                      : "w-11 min-w-11 border-x border-border/40 bg-muted/20 px-0 py-0.5 text-center align-middle"
                  }
                  style={{ width: ACTION_COL_PX }}
                >
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Delete row"
                    title="Delete row"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length <= minRows}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground sm:hidden">
        Scroll sideways if needed. Catalog is your Jola supplier list with custom option.
      </p>
      <Button variant="outline" size="sm" className="h-8 gap-1 text-xs sm:h-7" onClick={addRow}>
        <Plus className="h-3 w-3" />
        Add Row
      </Button>
    </div>
  );
}
