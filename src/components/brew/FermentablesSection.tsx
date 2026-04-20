"use client";

import { BrewTable, type ColumnDef } from "@/components/brew/BrewTable";
import { createEmptyFermentable } from "@/lib/defaults";
import type { Fermentable } from "@/types/brew";

const COLUMNS: ColumnDef<Fermentable>[] = [
  { key: "ingredient", header: "Ingredient / Malt", placeholder: "Pale Malt 2-Row", width: "22%" },
  { key: "maltType", header: "Type", placeholder: "Base", width: "12%" },
  { key: "amount", header: "Amount (kg)", type: "number", placeholder: "5.0", width: "10%" },
  { key: "percentOfBill", header: "% Bill", type: "number", placeholder: "75", width: "8%" },
  { key: "lotNumber", header: "Lot #", placeholder: "-", width: "10%" },
  { key: "notes", header: "Notes", placeholder: "e.g. crushed" },
];

export function FermentablesSection({
  rows,
  onChange,
}: {
  rows: Fermentable[];
  onChange: (rows: Fermentable[]) => void;
}) {
  return (
    <BrewTable
      rows={rows}
      columns={COLUMNS}
      onCreate={createEmptyFermentable}
      onChange={onChange}
      minRows={1}
    />
  );
}
