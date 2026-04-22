import {
  getJolaHop,
  getJolaMalt,
  getJolaYeast,
  JOLA_CUSTOM_PRODUCT_ID,
  JOLA_HOPS,
  JOLA_MALTS,
  JOLA_YEASTS,
} from "@/constants/jolaCatalog";
import { createEmptyFermentable, createEmptyHop, createEmptyYeast } from "@/lib/defaults";
import type { BrewBatch, Fermentable, HopAddition, Yeast } from "@/types/brew";

export function normalizeFermentableRow(f: Partial<Fermentable> & { id?: string }): Fermentable {
  const base = createEmptyFermentable();
  const merged: Fermentable = {
    ...base,
    ...f,
    id: f.id ?? base.id,
    catalogProductId: f.catalogProductId ?? "",
    ingredient: f.ingredient ?? "",
    maltType: f.maltType ?? "",
    typicalEbc: f.typicalEbc ?? "",
    amount: f.amount ?? "",
    percentOfBill: f.percentOfBill ?? "",
    lotNumber: f.lotNumber ?? "",
    notes: f.notes ?? "",
  };

  let catalogProductId = merged.catalogProductId;

  if (!catalogProductId && merged.ingredient.trim()) {
    const byName = JOLA_MALTS.find((m) => m.name === merged.ingredient.trim());
    catalogProductId = byName ? byName.id : JOLA_CUSTOM_PRODUCT_ID;
  }

  if (
    catalogProductId &&
    catalogProductId !== JOLA_CUSTOM_PRODUCT_ID &&
    !getJolaMalt(catalogProductId)
  ) {
    catalogProductId = merged.ingredient.trim() ? JOLA_CUSTOM_PRODUCT_ID : "";
  }

  return { ...merged, catalogProductId };
}

function normalizeHopRow(row: Partial<HopAddition> & { id?: string }): HopAddition {
  const base = createEmptyHop();
  const merged: HopAddition = {
    ...base,
    ...row,
    id: row.id ?? base.id,
    catalogProductId: row.catalogProductId ?? "",
    variety: row.variety ?? "",
    form: row.form ?? "",
    alphaPercent: row.alphaPercent ?? "",
    amount: row.amount ?? "",
    use: row.use ?? "",
    time: row.time ?? "",
    ibu: row.ibu ?? "",
  };
  let catalogProductId = merged.catalogProductId;
  if (!catalogProductId && merged.variety.trim()) {
    const byName = JOLA_HOPS.find((h) => h.name === merged.variety.trim());
    catalogProductId = byName ? byName.id : JOLA_CUSTOM_PRODUCT_ID;
  }
  if (catalogProductId && catalogProductId !== JOLA_CUSTOM_PRODUCT_ID && !getJolaHop(catalogProductId)) {
    catalogProductId = merged.variety.trim() ? JOLA_CUSTOM_PRODUCT_ID : "";
  }
  return { ...merged, catalogProductId };
}

function normalizeYeastRow(row: Partial<Yeast> & { id?: string }): Yeast {
  const base = createEmptyYeast();
  const merged: Yeast = {
    ...base,
    ...row,
    id: row.id ?? base.id,
    catalogProductId: row.catalogProductId ?? "",
    strainName: row.strainName ?? "",
    labBrand: row.labBrand ?? "",
    form: row.form ?? "",
    amount: row.amount ?? "",
    pitchTemp: row.pitchTemp ?? "",
    attenuation: row.attenuation ?? "",
    lotNumber: row.lotNumber ?? "",
  };
  let catalogProductId = merged.catalogProductId;
  if (!catalogProductId && merged.strainName.trim()) {
    const byName = JOLA_YEASTS.find((y) => y.name === merged.strainName.trim());
    catalogProductId = byName ? byName.id : JOLA_CUSTOM_PRODUCT_ID;
  }
  if (catalogProductId && catalogProductId !== JOLA_CUSTOM_PRODUCT_ID && !getJolaYeast(catalogProductId)) {
    catalogProductId = merged.strainName.trim() ? JOLA_CUSTOM_PRODUCT_ID : "";
  }
  return { ...merged, catalogProductId };
}

export function normalizeBrewBatch(batch: BrewBatch): BrewBatch {
  return {
    ...batch,
    fermentables: (batch.fermentables ?? []).map((row) => normalizeFermentableRow(row)),
    hops: (batch.hops ?? []).map((row) => normalizeHopRow(row)),
    yeast: (batch.yeast ?? []).map((row) => normalizeYeastRow(row)),
  };
}
