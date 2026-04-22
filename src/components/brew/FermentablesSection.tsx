"use client";

import { FermentablesTable } from "@/components/brew/FermentablesTable";
import type { Fermentable } from "@/types/brew";

export function FermentablesSection({
  rows,
  onChange,
}: {
  rows: Fermentable[];
  onChange: (rows: Fermentable[]) => void;
}) {
  return <FermentablesTable rows={rows} onChange={onChange} minRows={0} />;
}
