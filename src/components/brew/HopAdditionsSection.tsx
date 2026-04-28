"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CatalogCombobox } from "@/components/brew/CatalogCombobox";
import { Plus, Trash2 } from "lucide-react";
import { HOP_FORMS, HOP_USES } from "@/constants/brewing";
import { getJolaHop, groupJolaHopsByOrigin, JOLA_CUSTOM_PRODUCT_ID } from "@/constants/jolaCatalog";
import { createEmptyHop } from "@/lib/defaults";
import type { HopAddition } from "@/types/brew";

const ACTION_COL_PX = 44;

function catalogValue(row: HopAddition) {
  if (row.catalogProductId === JOLA_CUSTOM_PRODUCT_ID) return JOLA_CUSTOM_PRODUCT_ID;
  if (row.catalogProductId && getJolaHop(row.catalogProductId)) return row.catalogProductId;
  return "";
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
  const updateRow = (id: string, patch: Partial<HopAddition>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const isCustom = (row: HopAddition) => row.catalogProductId === JOLA_CUSTOM_PRODUCT_ID;

  const onCatalogChange = (id: string, value: string) => {
    if (value === "" || value === JOLA_CUSTOM_PRODUCT_ID) {
      updateRow(id, {
        catalogProductId: value,
        variety: "",
        alphaPercent: "",
      });
      return;
    }
    const hop = getJolaHop(value);
    if (!hop) return;
    updateRow(id, {
      catalogProductId: value,
      variety: hop.name,
      alphaPercent: hop.alphaPercent ?? "",
    });
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground sm:text-xs">
        Hops come from your Jola supplier catalog. Choose a hop (alpha % auto-fills when provided) or select custom.
      </p>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[760px] table-fixed border-collapse text-xs sm:min-w-0">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: ACTION_COL_PX }} />
          </colgroup>
          <thead>
            <tr className="bg-muted/70">
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Jola hop</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Form</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Alpha %</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Amount (g)</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Use</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Time (min)</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">IBU</th>
              <th className="border-b border-border/60 px-0 py-2 text-center" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <CatalogCombobox
                    value={catalogValue(row)}
                    onValueChange={(v) => onCatalogChange(row.id, v)}
                    groups={comboboxGroups}
                    customOption={{ value: JOLA_CUSTOM_PRODUCT_ID, label: "Custom hop" }}
                    placeholder="Select hop..."
                  />
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Select value={row.form} onValueChange={(v) => updateRow(row.id, { form: v })}>
                    <SelectTrigger className="h-8 w-full border-none bg-transparent px-1 text-xs shadow-none sm:h-7">
                      <SelectValue placeholder="Form..." />
                      <SelectContent>
                        {HOP_FORMS.map((form) => (
                          <SelectItem key={form} value={form}>
                            {form}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Input className="h-8 border-none bg-transparent px-1 text-xs shadow-none sm:h-7" type="number" value={row.alphaPercent} onChange={(e) => updateRow(row.id, { alphaPercent: e.target.value === "" ? "" : Number(e.target.value) })} readOnly={!isCustom(row) && Boolean(row.catalogProductId)} />
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Input className="h-8 border-none bg-transparent px-1 text-xs shadow-none sm:h-7" type="number" value={row.amount} onChange={(e) => updateRow(row.id, { amount: e.target.value === "" ? "" : Number(e.target.value) })} />
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Select value={row.use} onValueChange={(v) => updateRow(row.id, { use: v })}>
                    <SelectTrigger className="h-8 w-full border-none bg-transparent px-1 text-xs shadow-none sm:h-7">
                      <SelectValue placeholder="Use..." />
                      <SelectContent>
                        {HOP_USES.map((use) => (
                          <SelectItem key={use} value={use}>
                            {use}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Input className="h-8 border-none bg-transparent px-1 text-xs shadow-none sm:h-7" type="number" value={row.time} onChange={(e) => updateRow(row.id, { time: e.target.value === "" ? "" : Number(e.target.value) })} />
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Input className="h-8 border-none bg-transparent px-1 text-xs shadow-none sm:h-7" type="number" value={row.ibu} onChange={(e) => updateRow(row.id, { ibu: e.target.value === "" ? "" : Number(e.target.value) })} />
                </td>
                <td className="w-11 border-x border-border/40 px-0 py-0.5 text-center">
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => removeRow(row.id)} disabled={rows.length <= 1}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="outline" size="sm" className="h-8 gap-1 text-xs sm:h-7" onClick={() => onChange([...rows, createEmptyHop()])}>
        <Plus className="h-3 w-3" />
        Add Row
      </Button>
    </div>
  );
}
