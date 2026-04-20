"use client";

import { BrewTable, type ColumnDef } from "@/components/brew/BrewTable";
import { createEmptyMisc } from "@/lib/defaults";
import type { MiscAddition } from "@/types/brew";

const COLUMNS: ColumnDef<MiscAddition>[] = [
  { key: "ingredient", header: "Ingredient", placeholder: "Irish Moss", width: "22%" },
  { key: "use", header: "Use", placeholder: "Fining", width: "14%" },
  { key: "amount", header: "Amount", placeholder: "1 tsp", width: "12%" },
  { key: "timeStage", header: "Time / Stage", placeholder: "15 min", width: "14%" },
  { key: "notes", header: "Notes", placeholder: "-" },
];

export function MiscAdditionsSection({
  rows,
  onChange,
}: {
  rows: MiscAddition[];
  onChange: (rows: MiscAddition[]) => void;
}) {
  return (
    <BrewTable
      rows={rows}
      columns={COLUMNS}
      onCreate={createEmptyMisc}
      onChange={onChange}
      minRows={1}
    />
  );
}
