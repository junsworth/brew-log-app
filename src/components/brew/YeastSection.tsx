"use client";

import { BrewTable, type ColumnDef } from "@/components/brew/BrewTable";
import { YEAST_FORMS } from "@/constants/brewing";
import { createEmptyYeast } from "@/lib/defaults";
import type { Yeast } from "@/types/brew";

const COLUMNS: ColumnDef<Yeast>[] = [
  { key: "strainName", header: "Strain / Name", placeholder: "WY1056", width: "20%" },
  { key: "labBrand", header: "Lab / Brand", placeholder: "Wyeast", width: "14%" },
  { key: "form", header: "Form", type: "select", options: YEAST_FORMS, width: "10%" },
  { key: "amount", header: "Amount", placeholder: "1 pkg", width: "10%" },
  { key: "pitchTemp", header: "Pitch C", type: "number", placeholder: "20", width: "9%" },
  { key: "attenuation", header: "Atten. %", type: "number", placeholder: "75", width: "9%" },
  { key: "lotNumber", header: "Lot #", placeholder: "-" },
];

export function YeastSection({ rows, onChange }: { rows: Yeast[]; onChange: (rows: Yeast[]) => void }) {
  return (
    <BrewTable
      rows={rows}
      columns={COLUMNS}
      onCreate={createEmptyYeast}
      onChange={onChange}
      minRows={1}
    />
  );
}
