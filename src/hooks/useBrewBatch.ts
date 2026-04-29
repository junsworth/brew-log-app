"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  calculateAbv,
  calculateApparentAttenuation,
} from "@/lib/calculations/brewing";
import { createDefaultBrewBatch } from "@/lib/defaults";
import { normalizeBrewBatch } from "@/lib/normalizeBrewBatch";
import { LocalStorageAdapter } from "@/lib/storage/adapter";
import type { BrewBatch } from "@/types/brew";

const STORAGE_KEY = "brew-day-record-v2";
const AUTOSAVE_DELAY_MS = 500;

export function useBrewBatch() {
  const storage = useMemo(() => new LocalStorageAdapter(STORAGE_KEY), []);

  const applyDerivedStats = useCallback((current: BrewBatch): BrewBatch => {
    const measuredAbv = calculateAbv(
      current.gravityStats.originalGravity.measured,
      current.gravityStats.finalGravity.measured
    );
    const fermAbv = calculateAbv(current.fermentation.ogMeasured, current.fermentation.fgMeasured);
    const attenuation = calculateApparentAttenuation(
      current.fermentation.ogMeasured,
      current.fermentation.fgMeasured
    );

    const nextMeasuredAbv = measuredAbv === null ? "" : measuredAbv.toFixed(2);
    const nextFermAbv = fermAbv === null ? "" : `${fermAbv.toFixed(2)}%`;
    const nextAttenuation = attenuation === null ? "" : attenuation.toFixed(1);

    return {
      ...current,
      gravityStats: {
        ...current.gravityStats,
        abv: { ...current.gravityStats.abv, measured: nextMeasuredAbv },
      },
      fermentation: {
        ...current.fermentation,
        abvCalc: nextFermAbv,
        attenuation: nextAttenuation,
      },
    };
  }, []);

  // Never read localStorage in the initial state: server HTML and the client's first hydration pass must match.
  const [batch, setBatch] = useState<BrewBatch>(() => createDefaultBrewBatch());
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const loaded = storage.load();
      if (loaded) {
        setBatch(applyDerivedStats(normalizeBrewBatch(loaded)));
        return;
      }
      setBatch((prev) =>
        applyDerivedStats({
          ...prev,
          batchInfo: {
            ...prev.batchInfo,
            brewDate:
              prev.batchInfo.brewDate ||
              new Date().toISOString().slice(0, 10),
          },
        })
      );
    });
  }, [storage, applyDerivedStats]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      storage.save(batch);
      setLastSavedAt(new Date());
    }, AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [batch, storage]);

  const updateBatch = useCallback(
    (updater: (prev: BrewBatch) => BrewBatch) => {
      setBatch((prev) => applyDerivedStats(updater(prev)));
    },
    [applyDerivedStats]
  );

  const reset = useCallback(() => {
    const fresh = createDefaultBrewBatch();
    setBatch(
      applyDerivedStats({
        ...fresh,
        batchInfo: {
          ...fresh.batchInfo,
          brewDate: new Date().toISOString().slice(0, 10),
        },
      })
    );
    storage.clear();
  }, [storage, applyDerivedStats]);

  const exportPdf = useCallback(() => {
    window.print()
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(batch, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const slug = batch.batchInfo.batchNumber || "record";
    link.href = url;
    link.download = `brew_batch_${slug}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [batch]);

  const importJson = useCallback(
    (file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result)) as BrewBatch;
            setBatch(applyDerivedStats(normalizeBrewBatch(parsed)));
            resolve();
          } catch {
            reject(new Error("Invalid import file"));
          }
        };
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsText(file);
      });
    },
    [applyDerivedStats]
  );

  return {
    batch,
    setBatch: updateBatch,
    lastSavedAt,
    reset,
    exportJson,
    exportPdf,
    importJson,
  };
}
