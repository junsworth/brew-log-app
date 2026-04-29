"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BatchHeaderProps = {
  lastSavedLabel: string;
  importError: string | null;
  onExport: () => void;
  onExportPdf: () => void;
  onReset: () => void;
  onImportFile: (file: File) => Promise<void>;
  onImportError: (message: string | null) => void;
};

export function BatchHeader({
  lastSavedLabel,
  importError,
  onExport,
  onExportPdf,
  onReset,
  onImportFile,
  onImportError,
}: BatchHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Card>
        <header>
          <CardHeader className="gap-3 sm:gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-xl tracking-tight sm:text-2xl">Brew Day Batch Record</CardTitle>
                <p className="text-sm text-muted-foreground">A tool to help you track your brew day batch record.</p>
              </div>
              <Badge className="border-amber-500/40 bg-amber-500/10 text-amber-700">{lastSavedLabel}</Badge>
            </div>
          </CardHeader>
          <CardContent className="hidden gap-2 pt-0 sm:flex sm:flex-wrap">
            <Button className="w-full sm:w-auto" variant="secondary" onClick={onExport}>
              Export JSON
            </Button>
            <Button className="w-full sm:w-auto" variant="secondary" onClick={onExportPdf}>
              Export PDF
            </Button>
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => fileInputRef.current?.click()}>
              Import JSON
            </Button>
            <Button className="w-full sm:w-auto" variant="destructive" onClick={onReset}>
              Clear Form
            </Button>
            {importError ? <p className="self-center text-xs text-destructive">{importError}</p> : null}
          </CardContent>
        </header>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-4 gap-2">
          <Button size="sm" variant="secondary" onClick={onExport}>
            JSON
          </Button>
          <Button size="sm" variant="secondary" onClick={onExportPdf}>
            PDF
          </Button>
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
            Import
          </Button>
          <Button size="sm" variant="destructive" onClick={onReset}>
            Clear
          </Button>
        </div>
        {importError ? <p className="mt-1 text-center text-xs text-destructive">{importError}</p> : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          try {
            await onImportFile(file);
            onImportError(null);
          } catch {
            onImportError("Could not import file. Please use a valid Brew Batch JSON export.");
          } finally {
            event.target.value = "";
          }
        }}
      />
    </>
  );
}
