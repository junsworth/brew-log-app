export const RECIPE_TYPES = ["All Grain", "BIAB", "Extract", "Partial Mash"] as const;

export const BJCP_STYLES = [
  "18A Blonde Ale",
  "18B American Pale Ale",
  "19A American Amber Ale",
  "21A American IPA",
  "22A Double IPA",
  "11A Ordinary Bitter",
  "13B British Brown Ale",
  "20A American Porter",
  "20C Imperial Stout",
  "27A Historical Beer",
] as const;

export const HOP_FORMS = ["Pellet", "Whole", "Cryo", "Extract"] as const;
export const HOP_USES = ["Mash", "First Wort", "Boil", "Whirlpool", "Dry Hop"] as const;
export const YEAST_FORMS = ["Dry", "Liquid", "Slurry"] as const;
export const MASH_STEP_TYPES = ["Infusion", "Decoction", "Temperature"] as const;
export const FERMENTATION_STEP_TYPES = [
  "Primary",
  "Diacetyl Rest",
  "Secondary",
  "Cold Crash",
  "Conditioning",
] as const;
export const PACKAGING_METHODS = ["Keg", "Bottle", "Cask", "Can"] as const;
