"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export type ColumnDef<T> = {
  key: keyof T;
  header: string;
  type?: "text" | "number" | "select";
  options?: readonly string[];
  placeholder?: string;
  width?: string;
};

interface Props<T extends { id: string }> {
  rows: T[];
  columns: ColumnDef<T>[];
  onCreate: () => T;
  onChange: (rows: T[]) => void;
  minRows?: number;
}

export function BrewTable<T extends { id: string }>({
  rows,
  columns,
  onCreate,
  onChange,
  minRows = 0,
}: Props<T>) {
  const addRow = () => onChange([...rows, onCreate()]);

  const removeRow = (id: string) => {
    if (rows.length <= minRows) return;
    onChange(rows.filter((r) => r.id !== id));
  };

  const updateCell = (id: string, key: keyof T, value: unknown) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-md border border-border touch-pan-x">
        <table className="min-w-max w-full text-xs">
          <thead>
            <tr className="bg-muted/70">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="sticky top-0 bg-muted/90 px-2 py-2 text-left font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              <th className="sticky top-0 w-10 bg-muted/90 px-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="border-x border-border/40 px-1 py-0.5"
                  >
                    {col.type === "select" ? (
                      <Select
                        value={String(row[col.key] ?? "")}
                        onValueChange={(v) => updateCell(row.id, col.key, v)}
                      >
                        <SelectTrigger className="h-8 border-none bg-transparent px-1 text-xs shadow-none sm:h-7">
                          <SelectValue placeholder="-" />
                          <SelectContent>
                            {col.options?.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectTrigger>
                      </Select>
                    ) : (
                      <Input
                        className="h-8 border-none bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 sm:h-7"
                        type={col.type === "number" ? "number" : "text"}
                        placeholder={col.placeholder ?? ""}
                        value={String(row[col.key] ?? "")}
                        onChange={(e) =>
                          updateCell(
                            row.id,
                            col.key,
                            col.type === "number" && e.target.value !== ""
                              ? Number(e.target.value)
                              : e.target.value
                          )
                        }
                      />
                    )}
                  </td>
                ))}
                <td className="px-1 py-0.5">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
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
      <p className="text-[11px] text-muted-foreground sm:hidden">Swipe table horizontally to see all columns.</p>
      <Button variant="outline" size="sm" className="h-8 gap-1 text-xs sm:h-7" onClick={addRow}>
        <Plus className="h-3 w-3" />
        Add Row
      </Button>
    </div>
  );
}
