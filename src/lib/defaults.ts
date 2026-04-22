import type {
  BatchInfo,
  BoilInfo,
  BrewBatch,
  Fermentable,
  FermentationStep,
  GravityStats,
  HopAddition,
  MashStep,
  MiscAddition,
  PackagingInfo,
  WaterProfile,
  Yeast,
} from "@/types/brew";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const createEmptyFermentable = (): Fermentable => ({
  id: createId(),
  catalogProductId: "",
  ingredient: "",
  maltType: "",
  typicalEbc: "",
  amount: "",
  percentOfBill: "",
  lotNumber: "",
  notes: "",
});

export const createEmptyHop = (): HopAddition => ({
  id: createId(),
  catalogProductId: "",
  variety: "",
  form: "",
  alphaPercent: "",
  amount: "",
  use: "",
  time: "",
  ibu: "",
});

export const createEmptyYeast = (): Yeast => ({
  id: createId(),
  catalogProductId: "",
  strainName: "",
  labBrand: "",
  form: "",
  amount: "",
  pitchTemp: "",
  attenuation: "",
  lotNumber: "",
});

export const createEmptyMisc = (): MiscAddition => ({
  id: createId(),
  ingredient: "",
  use: "",
  amount: "",
  timeStage: "",
  notes: "",
});

export const createEmptyMashStep = (): MashStep => ({
  id: createId(),
  stepName: "",
  stepType: "",
  tempTarget: "",
  tempActual: "",
  duration: "",
  notes: "",
});

export const createEmptyFermentationStep = (): FermentationStep => ({
  id: createId(),
  stepName: "",
  type: "",
  temp: "",
  duration: "",
  startDate: "",
  endDate: "",
  notes: "",
});

export const createDefaultBatchInfo = (): BatchInfo => ({
  batchNumber: "",
  // Empty on first paint so SSR and client hydration match; set today's date after mount in the hook.
  brewDate: "",
  recipeName: "",
  style: "",
  brewer: "",
  batchSize: "",
  boilTime: 60,
  recipeType: "",
  ibu: "",
  srm: "",
});

export const createDefaultGravityStats = (): GravityStats => ({
  preBoilGravity: { target: "", measured: "" },
  originalGravity: { target: "", measured: "" },
  finalGravity: { target: "", measured: "" },
  abv: { target: "", measured: "" },
  mashEfficiency: { target: "", measured: "" },
  brewhouseEfficiency: { target: "", measured: "" },
});

export const createDefaultWaterProfile = (): WaterProfile => ({
  calcium: "",
  magnesium: "",
  sodium: "",
  chloride: "",
  sulfate: "",
  bicarbonate: "",
  profileName: "",
});

export const createDefaultBoilInfo = (): BoilInfo => ({
  preBoilVolume: "",
  preBoilGravity: "",
  postBoilVolume: "",
  postBoilGravity: "",
  boilOffRate: "",
});

export const createDefaultPackagingInfo = (): PackagingInfo => ({
  packagingDate: "",
  method: "",
  volumePackaged: "",
  primingSugar: "",
  readyTodrinkDate: "",
});

export const createDefaultBrewBatch = (): BrewBatch => ({
  batchInfo: createDefaultBatchInfo(),
  gravityStats: createDefaultGravityStats(),
  fermentables: [createEmptyFermentable()],
  hops: [createEmptyHop()],
  yeast: [createEmptyYeast()],
  miscAdditions: [createEmptyMisc()],
  mash: {
    steps: [createEmptyMashStep()],
    mashWater: "",
    spargeWater: "",
    phTarget: "",
    phMeasured: "",
    firstWortGravity: "",
  },
  waterProfile: createDefaultWaterProfile(),
  boil: createDefaultBoilInfo(),
  fermentation: {
    schedule: [createEmptyFermentationStep()],
    pitchDateTime: "",
    ogMeasured: "",
    fgMeasured: "",
    abvCalc: "",
    attenuation: "",
    carbonation: "",
  },
  packaging: createDefaultPackagingInfo(),
  brewNotes: "",
});
