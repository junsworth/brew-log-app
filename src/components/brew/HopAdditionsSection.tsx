"use client";

import { BrewTable, type ColumnDef } from "@/components/brew/BrewTable";
import { HOP_FORMS, HOP_USES } from "@/constants/brewing";
import { createEmptyHop } from "@/lib/defaults";
import type { HopAddition } from "@/types/brew";

const COLUMNS: ColumnDef<HopAddition>[] = [
  { key: "variety", header: "Variety", placeholder: "Cascade", width: "18%" },
  { key: "form", header: "Form", type: "select", options: HOP_FORMS, width: "10%" },
  { key: "alphaPercent", header: "Alpha %", type: "number", placeholder: "5.5", width: "9%" },
  { key: "amount", header: "Amount (g)", type: "number", placeholder: "28", width: "10%" },
  { key: "use", header: "Use", type: "select", options: HOP_USES, width: "13%" },
  { key: "time", header: "Time (min)", type: "number", placeholder: "60", width: "10%" },
  { key: "ibu", header: "IBU", type: "number", placeholder: "-", width: "7%" },
];

export function HopAdditionsSection({
  rows,
  onChange,
}: {
  rows: HopAddition[];
  onChange: (rows: HopAddition[]) => void;
}) {
  return (
    <BrewTable rows={rows} columns={COLUMNS} onCreate={createEmptyHop} onChange={onChange} minRows={1} />
  );
}
