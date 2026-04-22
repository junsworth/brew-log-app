export type NumericInput = number | "";

export interface BatchInfo {
  batchNumber: string;
  brewDate: string;
  recipeName: string;
  style: string;
  brewer: string;
  batchSize: NumericInput;
  boilTime: NumericInput;
  recipeType: string;
  ibu: NumericInput;
  srm: NumericInput;
}

export interface GravityStat {
  target: string;
  measured: string;
}

export interface GravityStats {
  preBoilGravity: GravityStat;
  originalGravity: GravityStat;
  finalGravity: GravityStat;
  abv: GravityStat;
  mashEfficiency: GravityStat;
  brewhouseEfficiency: GravityStat;
}

export interface Fermentable {
  id: string;
  /** Supplier catalog id, empty = not chosen yet, "__custom__" = manual grain name */
  catalogProductId: string;
  ingredient: string;
  maltType: string;
  /** Typical colour in EBC (supplier / lab specs); editable when custom */
  typicalEbc: string;
  amount: NumericInput;
  percentOfBill: NumericInput;
  lotNumber: string;
  notes: string;
}

export interface HopAddition {
  id: string;
  catalogProductId: string;
  variety: string;
  form: string;
  alphaPercent: NumericInput;
  amount: NumericInput;
  use: string;
  time: NumericInput;
  ibu: NumericInput;
}

export interface Yeast {
  id: string;
  catalogProductId: string;
  strainName: string;
  labBrand: string;
  form: string;
  amount: string;
  pitchTemp: NumericInput;
  attenuation: NumericInput;
  lotNumber: string;
}

export interface MiscAddition {
  id: string;
  ingredient: string;
  use: string;
  amount: string;
  timeStage: string;
  notes: string;
}

export interface MashStep {
  id: string;
  stepName: string;
  stepType: string;
  tempTarget: NumericInput;
  tempActual: NumericInput;
  duration: NumericInput;
  notes: string;
}

export interface MashInfo {
  steps: MashStep[];
  mashWater: NumericInput;
  spargeWater: NumericInput;
  phTarget: NumericInput;
  phMeasured: NumericInput;
  firstWortGravity: string;
}

export interface WaterProfile {
  calcium: NumericInput;
  magnesium: NumericInput;
  sodium: NumericInput;
  chloride: NumericInput;
  sulfate: NumericInput;
  bicarbonate: NumericInput;
  profileName: string;
}

export interface BoilInfo {
  preBoilVolume: NumericInput;
  preBoilGravity: string;
  postBoilVolume: NumericInput;
  postBoilGravity: string;
  boilOffRate: NumericInput;
}

export interface FermentationStep {
  id: string;
  stepName: string;
  type: string;
  temp: NumericInput;
  duration: NumericInput;
  startDate: string;
  endDate: string;
  notes: string;
}

export interface FermentationInfo {
  schedule: FermentationStep[];
  pitchDateTime: string;
  ogMeasured: string;
  fgMeasured: string;
  abvCalc: string;
  attenuation: string;
  carbonation: string;
}

export interface PackagingInfo {
  packagingDate: string;
  method: string;
  volumePackaged: NumericInput;
  primingSugar: NumericInput;
  readyTodrinkDate: string;
}

export interface BrewBatch {
  batchInfo: BatchInfo;
  gravityStats: GravityStats;
  fermentables: Fermentable[];
  hops: HopAddition[];
  yeast: Yeast[];
  miscAdditions: MiscAddition[];
  mash: MashInfo;
  waterProfile: WaterProfile;
  boil: BoilInfo;
  fermentation: FermentationInfo;
  packaging: PackagingInfo;
  brewNotes: string;
}
