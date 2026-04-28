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
import { YEAST_FORMS } from "@/constants/brewing";
import { JOLA_CUSTOM_PRODUCT_ID, JOLA_YEASTS, getJolaYeast } from "@/constants/jolaCatalog";
import { createEmptyYeast } from "@/lib/defaults";
import type { Yeast } from "@/types/brew";

const ACTION_COL_PX = 44;

function catalogValue(row: Yeast) {
  if (row.catalogProductId === JOLA_CUSTOM_PRODUCT_ID) return JOLA_CUSTOM_PRODUCT_ID;
  if (row.catalogProductId && getJolaYeast(row.catalogProductId)) return row.catalogProductId;
  return "";
}

export function YeastSection({ rows, onChange }: { rows: Yeast[]; onChange: (rows: Yeast[]) => void }) {
  const groupedByBrand = useMemo(() => {
    return JOLA_YEASTS.reduce<Record<string, typeof JOLA_YEASTS>>((acc, row) => {
      const key = row.brand;
      acc[key] = (acc[key] ?? []) as typeof JOLA_YEASTS;
      (acc[key] as unknown as { push: (x: (typeof JOLA_YEASTS)[number]) => void }).push(row);
      return acc;
    }, {});
  }, []);
  const groups = useMemo(() => Object.entries(groupedByBrand), [groupedByBrand]);
  const comboboxGroups = useMemo(
    () => groups.map(([label, yeasts]) => ({ label, items: yeasts.map((y) => ({ value: y.id, label: y.name })) })),
    [groups]
  );

  const updateRow = (id: string, patch: Partial<Yeast>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const onCatalogChange = (id: string, value: string) => {
    if (value === "" || value === JOLA_CUSTOM_PRODUCT_ID) {
      updateRow(id, {
        catalogProductId: value,
        strainName: "",
        labBrand: "",
        form: "",
        amount: "",
      });
      return;
    }
    const yeast = getJolaYeast(value);
    if (!yeast) return;
    updateRow(id, {
      catalogProductId: value,
      strainName: yeast.name,
      labBrand: yeast.brand,
      form: yeast.form,
      amount: yeast.packageSize,
    });
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((r) => r.id !== id));
  };

  const isCustom = (row: Yeast) => row.catalogProductId === JOLA_CUSTOM_PRODUCT_ID;

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground sm:text-xs">
        Yeast list uses your Jola supplier catalog. Choose a strain and it auto-fills brand/form/pack size.
      </p>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[780px] table-fixed border-collapse text-xs sm:min-w-0">
          <colgroup>
            <col style={{ width: "24%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: ACTION_COL_PX }} />
          </colgroup>
          <thead>
            <tr className="bg-muted/70">
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Jola yeast</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Brand</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Form</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Pitch C</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Atten. %</th>
              <th className="border-b border-border/60 px-2 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Lot #</th>
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
                    placeholder="Select yeast..."
                  />
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Input className="h-8 border-none bg-transparent px-1 text-xs shadow-none sm:h-7" value={row.labBrand} readOnly={!isCustom(row) && Boolean(row.catalogProductId)} onChange={(e) => updateRow(row.id, { labBrand: e.target.value })} />
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Select value={row.form} onValueChange={(v) => updateRow(row.id, { form: v })}>
                    <SelectTrigger className="h-8 w-full border-none bg-transparent px-1 text-xs shadow-none sm:h-7">
                      <SelectValue placeholder="Form..." />
                      <SelectContent>
                        {YEAST_FORMS.map((form) => (
                          <SelectItem key={form} value={form}>
                            {form}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Input className="h-8 border-none bg-transparent px-1 text-xs shadow-none sm:h-7" value={row.amount} readOnly={!isCustom(row) && Boolean(row.catalogProductId)} onChange={(e) => updateRow(row.id, { amount: e.target.value })} />
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Input className="h-8 border-none bg-transparent px-1 text-xs shadow-none sm:h-7" type="number" value={row.pitchTemp} onChange={(e) => updateRow(row.id, { pitchTemp: e.target.value === "" ? "" : Number(e.target.value) })} />
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Input className="h-8 border-none bg-transparent px-1 text-xs shadow-none sm:h-7" type="number" value={row.attenuation} onChange={(e) => updateRow(row.id, { attenuation: e.target.value === "" ? "" : Number(e.target.value) })} />
                </td>
                <td className="border-x border-border/40 px-1 py-0.5">
                  <Input className="h-8 border-none bg-transparent px-1 text-xs shadow-none sm:h-7" value={row.lotNumber} onChange={(e) => updateRow(row.id, { lotNumber: e.target.value })} />
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
      <Button variant="outline" size="sm" className="h-8 gap-1 text-xs sm:h-7" onClick={() => onChange([...rows, createEmptyYeast()])}>
        <Plus className="h-3 w-3" />
        Add Row
      </Button>
    </div>
  );
}
