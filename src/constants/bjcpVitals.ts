/**
 * BJCP 2021 Vital Statistics
 *
 * Ranges for IBU, SRM, OG, FG, and ABV sourced from the BJCP Style Guidelines
 * (https://www.bjcp.org/beer-styles/beer-style-guidelines/).
 *
 * Only sub-styles with well-defined numeric ranges are included. Specialty
 * and open-ended categories (e.g. 29–34) that derive their stats from a base
 * style are omitted and will resolve to null via getBjcpVitals().
 *
 * Keys match the exact string values used in BJCP_BEER_STYLES / the combobox.
 */

export type StyleVitals = {
  ibu: [number, number]
  srm: [number, number]
  og:  [number, number]  // e.g. [1.028, 1.040]
  fg:  [number, number]  // e.g. [0.998, 1.008]
  abv: [number, number]  // percentage e.g. [2.8, 4.2]
}

export const BJCP_VITALS: Record<string, StyleVitals> = {
  // ── 1. Standard American Beer ──────────────────────────────────────────────
  "1A. American Light Lager":         { ibu: [8,  12],  srm: [2,  3],  og: [1.028, 1.040], fg: [0.998, 1.008], abv: [2.8,  4.2]  },
  "1B. American Lager":               { ibu: [8,  18],  srm: [2,  4],  og: [1.040, 1.050], fg: [1.004, 1.010], abv: [4.2,  5.3]  },
  "1C. Cream Ale":                    { ibu: [8,  20],  srm: [2,  5],  og: [1.042, 1.055], fg: [1.006, 1.012], abv: [4.2,  5.6]  },
  "1D. American Wheat Beer":          { ibu: [8,  15],  srm: [3,  6],  og: [1.040, 1.055], fg: [1.008, 1.013], abv: [4.0,  5.5]  },

  // ── 2. International Lager ─────────────────────────────────────────────────
  "2A. International Pale Lager":     { ibu: [18, 25],  srm: [2,  6],  og: [1.042, 1.050], fg: [1.008, 1.012], abv: [4.6,  6.0]  },
  "2B. International Amber Lager":    { ibu: [8,  25],  srm: [7,  14], og: [1.042, 1.055], fg: [1.008, 1.014], abv: [4.6,  6.0]  },
  "2C. International Dark Lager":     { ibu: [8,  20],  srm: [14, 22], og: [1.044, 1.056], fg: [1.008, 1.012], abv: [4.2,  6.0]  },

  // ── 3. Czech Lager ─────────────────────────────────────────────────────────
  "3A. Czech Pale Lager":             { ibu: [20, 35],  srm: [3,  6],  og: [1.028, 1.044], fg: [1.008, 1.014], abv: [3.0,  4.1]  },
  "3B. Czech Premium Pale Lager":     { ibu: [30, 45],  srm: [3,  6],  og: [1.044, 1.060], fg: [1.013, 1.017], abv: [4.2,  5.8]  },
  "3C. Czech Amber Lager":            { ibu: [20, 35],  srm: [10, 16], og: [1.044, 1.060], fg: [1.013, 1.017], abv: [4.4,  5.8]  },
  "3D. Czech Dark Lager":             { ibu: [18, 34],  srm: [17, 35], og: [1.044, 1.060], fg: [1.013, 1.017], abv: [4.4,  5.8]  },

  // ── 4. Pale Malty European Lager ───────────────────────────────────────────
  "4A. Munich Helles":                { ibu: [16, 22],  srm: [3,  5],  og: [1.044, 1.052], fg: [1.006, 1.012], abv: [4.7,  5.4]  },
  "4B. Festbier":                     { ibu: [18, 25],  srm: [4,  7],  og: [1.054, 1.057], fg: [1.010, 1.012], abv: [5.8,  6.3]  },
  "4C. Helles Bock":                  { ibu: [23, 35],  srm: [6,  11], og: [1.064, 1.069], fg: [1.011, 1.014], abv: [6.3,  7.4]  },

  // ── 5. Pale Bitter European Beer ───────────────────────────────────────────
  "5A. German Leichtbier":            { ibu: [15, 28],  srm: [2,  5],  og: [1.026, 1.034], fg: [1.006, 1.010], abv: [2.4,  3.6]  },
  "5B. Kölsch":                       { ibu: [18, 30],  srm: [3,  5],  og: [1.044, 1.050], fg: [1.007, 1.011], abv: [4.4,  5.2]  },
  "5C. German Helles Exportbier":     { ibu: [20, 30],  srm: [4,  7],  og: [1.048, 1.056], fg: [1.010, 1.015], abv: [4.8,  6.0]  },
  "5D. German Pils":                  { ibu: [22, 40],  srm: [2,  5],  og: [1.044, 1.050], fg: [1.008, 1.013], abv: [4.4,  5.2]  },

  // ── 6. Amber Malty European Lager ──────────────────────────────────────────
  "6A. Märzen":                       { ibu: [18, 24],  srm: [8,  17], og: [1.054, 1.060], fg: [1.010, 1.014], abv: [5.8,  6.3]  },
  "6B. Rauchbier":                    { ibu: [20, 30],  srm: [12, 22], og: [1.050, 1.057], fg: [1.012, 1.016], abv: [4.8,  6.0]  },
  "6C. Dunkles Bock":                 { ibu: [20, 27],  srm: [14, 22], og: [1.064, 1.072], fg: [1.013, 1.019], abv: [6.3,  7.2]  },

  // ── 7. Amber Bitter European Beer ──────────────────────────────────────────
  "7A. Vienna Lager":                 { ibu: [18, 30],  srm: [9,  15], og: [1.048, 1.055], fg: [1.010, 1.014], abv: [4.7,  5.5]  },
  "7B. Altbier":                      { ibu: [25, 50],  srm: [11, 17], og: [1.044, 1.052], fg: [1.008, 1.014], abv: [4.3,  5.5]  },

  // ── 8. Dark European Lager ─────────────────────────────────────────────────
  "8A. Munich Dunkel":                { ibu: [18, 28],  srm: [14, 28], og: [1.048, 1.056], fg: [1.010, 1.016], abv: [4.5,  5.6]  },
  "8B. Schwarzbier":                  { ibu: [20, 35],  srm: [17, 30], og: [1.046, 1.052], fg: [1.010, 1.016], abv: [4.4,  5.4]  },

  // ── 9. Strong European Beer ────────────────────────────────────────────────
  "9A. Doppelbock":                   { ibu: [16, 26],  srm: [6,  25], og: [1.072, 1.112], fg: [1.016, 1.024], abv: [7.0,  10.0] },
  "9B. Eisbock":                      { ibu: [25, 35],  srm: [17, 30], og: [1.078, 1.120], fg: [1.020, 1.035], abv: [9.0,  14.0] },
  "9C. Baltic Porter":                { ibu: [20, 40],  srm: [17, 30], og: [1.060, 1.090], fg: [1.016, 1.024], abv: [6.5,  9.5]  },

  // ── 10. German Wheat Beer ──────────────────────────────────────────────────
  "10A. Weissbier":                   { ibu: [8,  15],  srm: [2,  8],  og: [1.044, 1.052], fg: [1.010, 1.014], abv: [4.3,  5.6]  },
  "10B. Dunkles Weissbier":           { ibu: [10, 18],  srm: [14, 23], og: [1.044, 1.056], fg: [1.010, 1.014], abv: [4.3,  5.6]  },
  "10C. Weizenbock":                  { ibu: [15, 30],  srm: [6,  25], og: [1.064, 1.090], fg: [1.015, 1.022], abv: [6.5,  9.0]  },

  // ── 11. British Bitter ─────────────────────────────────────────────────────
  "11A. Ordinary Bitter":             { ibu: [25, 35],  srm: [8,  14], og: [1.030, 1.039], fg: [1.007, 1.011], abv: [3.2,  3.8]  },
  "11B. Best Bitter":                 { ibu: [25, 40],  srm: [8,  16], og: [1.040, 1.048], fg: [1.008, 1.012], abv: [3.8,  4.6]  },
  "11C. Strong Bitter":               { ibu: [30, 50],  srm: [8,  18], og: [1.048, 1.060], fg: [1.010, 1.016], abv: [4.6,  6.2]  },

  // ── 12. Pale Commonwealth Beer ─────────────────────────────────────────────
  "12A. British Golden Ale":          { ibu: [20, 45],  srm: [2,  6],  og: [1.038, 1.053], fg: [1.006, 1.012], abv: [3.8,  5.0]  },
  "12B. Australian Sparkling Ale":    { ibu: [20, 35],  srm: [4,  7],  og: [1.042, 1.050], fg: [1.006, 1.010], abv: [4.5,  6.0]  },
  "12C. English IPA":                 { ibu: [40, 60],  srm: [6,  14], og: [1.050, 1.075], fg: [1.010, 1.018], abv: [5.0,  7.5]  },

  // ── 13. Brown British Beer ─────────────────────────────────────────────────
  "13A. Dark Mild":                   { ibu: [10, 25],  srm: [14, 25], og: [1.030, 1.038], fg: [1.008, 1.013], abv: [3.0,  3.8]  },
  "13B. British Brown Ale":           { ibu: [20, 30],  srm: [12, 22], og: [1.040, 1.052], fg: [1.008, 1.013], abv: [4.2,  5.4]  },
  "13C. English Porter":              { ibu: [18, 35],  srm: [20, 30], og: [1.040, 1.052], fg: [1.008, 1.014], abv: [4.0,  5.4]  },

  // ── 14. Scottish Ale ───────────────────────────────────────────────────────
  "14A. Scottish Light":              { ibu: [10, 20],  srm: [17, 22], og: [1.030, 1.035], fg: [1.010, 1.013], abv: [2.5,  3.3]  },
  "14B. Scottish Heavy":              { ibu: [10, 20],  srm: [12, 20], og: [1.035, 1.040], fg: [1.010, 1.015], abv: [3.3,  3.9]  },
  "14C. Scottish Export":             { ibu: [15, 30],  srm: [12, 20], og: [1.040, 1.060], fg: [1.010, 1.016], abv: [3.9,  6.0]  },

  // ── 15. Irish Beer ─────────────────────────────────────────────────────────
  "15A. Irish Red Ale":               { ibu: [18, 28],  srm: [9,  14], og: [1.036, 1.046], fg: [1.010, 1.014], abv: [3.8,  5.0]  },
  "15B. Irish Stout":                 { ibu: [25, 45],  srm: [25, 40], og: [1.036, 1.044], fg: [1.007, 1.011], abv: [4.0,  4.5]  },
  "15C. Irish Extra Stout":           { ibu: [35, 50],  srm: [25, 40], og: [1.052, 1.062], fg: [1.010, 1.014], abv: [5.5,  6.5]  },

  // ── 16. Dark British Beer ──────────────────────────────────────────────────
  "16A. Sweet Stout":                 { ibu: [20, 40],  srm: [30, 40], og: [1.044, 1.060], fg: [1.012, 1.024], abv: [4.0,  6.0]  },
  "16B. Oatmeal Stout":               { ibu: [25, 40],  srm: [22, 40], og: [1.048, 1.065], fg: [1.010, 1.018], abv: [4.2,  5.9]  },
  "16C. Tropical Stout":              { ibu: [30, 50],  srm: [30, 40], og: [1.056, 1.075], fg: [1.010, 1.018], abv: [5.5,  8.0]  },
  "16D. Foreign Extra Stout":         { ibu: [50, 70],  srm: [30, 40], og: [1.056, 1.075], fg: [1.010, 1.018], abv: [6.3,  8.0]  },

  // ── 17. Strong British Ale ─────────────────────────────────────────────────
  "17A. British Strong Ale":          { ibu: [30, 50],  srm: [8,  22], og: [1.055, 1.080], fg: [1.015, 1.022], abv: [5.5,  8.0]  },
  "17B. Old Ale":                     { ibu: [30, 60],  srm: [10, 22], og: [1.055, 1.088], fg: [1.015, 1.022], abv: [5.5,  9.0]  },
  "17C. Wee Heavy":                   { ibu: [17, 35],  srm: [14, 25], og: [1.070, 1.130], fg: [1.018, 1.040], abv: [6.5,  10.0] },
  "17D. English Barleywine":          { ibu: [35, 70],  srm: [8,  22], og: [1.080, 1.120], fg: [1.018, 1.030], abv: [8.0,  12.0] },

  // ── 18. Pale American Ale ──────────────────────────────────────────────────
  "18A. Blonde Ale":                  { ibu: [15, 28],  srm: [3,  6],  og: [1.038, 1.054], fg: [1.008, 1.013], abv: [3.8,  5.5]  },
  "18B. American Pale Ale":           { ibu: [30, 50],  srm: [5,  10], og: [1.045, 1.060], fg: [1.010, 1.015], abv: [5.0,  6.2]  },

  // ── 19. Amber and Brown American Beer ─────────────────────────────────────
  "19A. American Amber Ale":          { ibu: [25, 40],  srm: [10, 17], og: [1.045, 1.060], fg: [1.010, 1.015], abv: [4.5,  6.2]  },
  "19B. California Common":           { ibu: [30, 45],  srm: [10, 14], og: [1.048, 1.054], fg: [1.011, 1.014], abv: [4.5,  5.5]  },
  "19C. American Brown Ale":          { ibu: [20, 30],  srm: [18, 35], og: [1.045, 1.060], fg: [1.010, 1.016], abv: [4.3,  6.2]  },

  // ── 20. American Porter and Stout ─────────────────────────────────────────
  "20A. American Porter":             { ibu: [25, 50],  srm: [22, 40], og: [1.050, 1.070], fg: [1.012, 1.018], abv: [4.8,  6.5]  },
  "20B. American Stout":              { ibu: [35, 75],  srm: [30, 40], og: [1.050, 1.075], fg: [1.010, 1.022], abv: [5.0,  7.0]  },
  "20C. Imperial Stout":              { ibu: [50, 90],  srm: [30, 40], og: [1.075, 1.115], fg: [1.018, 1.030], abv: [8.0,  12.0] },

  // ── 21. IPA ────────────────────────────────────────────────────────────────
  "21A. American IPA":                { ibu: [40, 70],  srm: [6,  14], og: [1.056, 1.070], fg: [1.008, 1.014], abv: [5.5,  7.5]  },
  "21B. Specialty IPA":               { ibu: [30, 70],  srm: [3,  15], og: [1.056, 1.070], fg: [1.008, 1.016], abv: [5.5,  9.0]  },
  "21C. Hazy IPA":                    { ibu: [25, 60],  srm: [3,  7],  og: [1.060, 1.085], fg: [1.010, 1.015], abv: [6.0,  9.0]  },

  // ── 22. Strong American Ale ────────────────────────────────────────────────
  "22A. Double IPA":                  { ibu: [60, 120], srm: [6,  14], og: [1.065, 1.100], fg: [1.008, 1.018], abv: [7.5,  10.0] },
  "22B. American Strong Ale":         { ibu: [50, 100], srm: [7,  19], og: [1.062, 1.090], fg: [1.014, 1.024], abv: [6.3,  10.0] },
  "22C. American Barleywine":         { ibu: [50, 100], srm: [10, 19], og: [1.080, 1.120], fg: [1.016, 1.030], abv: [8.0,  12.0] },
  "22D. Wheatwine":                   { ibu: [30, 60],  srm: [8,  15], og: [1.080, 1.120], fg: [1.016, 1.030], abv: [8.0,  12.0] },

  // ── 23. European Sour Ale ──────────────────────────────────────────────────
  "23A. Berliner Weisse":             { ibu: [3,  8],   srm: [2,  3],  og: [1.028, 1.032], fg: [1.003, 1.006], abv: [2.8,  3.8]  },
  "23B. Flanders Red Ale":            { ibu: [10, 25],  srm: [10, 17], og: [1.048, 1.057], fg: [1.002, 1.012], abv: [4.6,  6.5]  },
  "23C. Oud Bruin":                   { ibu: [20, 25],  srm: [15, 22], og: [1.040, 1.074], fg: [1.008, 1.012], abv: [4.0,  8.0]  },
  "23D. Lambic":                      { ibu: [0,  10],  srm: [3,  7],  og: [1.040, 1.054], fg: [1.001, 1.010], abv: [5.0,  6.5]  },
  "23E. Gueuze":                      { ibu: [0,  10],  srm: [3,  7],  og: [1.040, 1.060], fg: [1.000, 1.006], abv: [5.0,  8.0]  },
  "23F. Fruit Lambic":                { ibu: [0,  10],  srm: [3,  7],  og: [1.040, 1.060], fg: [1.000, 1.010], abv: [5.0,  7.0]  },
  "23G. Gose":                        { ibu: [5,  15],  srm: [3,  4],  og: [1.036, 1.056], fg: [1.006, 1.010], abv: [4.2,  4.8]  },

  // ── 24. Belgian Ale ────────────────────────────────────────────────────────
  "24A. Witbier":                     { ibu: [8,  20],  srm: [2,  4],  og: [1.044, 1.052], fg: [1.008, 1.012], abv: [4.5,  5.5]  },
  "24B. Belgian Pale Ale":            { ibu: [20, 30],  srm: [8,  14], og: [1.048, 1.054], fg: [1.010, 1.014], abv: [4.8,  5.5]  },
  "24C. Bière de Garde":              { ibu: [18, 28],  srm: [6,  19], og: [1.060, 1.080], fg: [1.008, 1.016], abv: [6.0,  8.5]  },

  // ── 25. Strong Belgian Ale ─────────────────────────────────────────────────
  "25A. Belgian Blond Ale":           { ibu: [15, 30],  srm: [4,  7],  og: [1.062, 1.075], fg: [1.008, 1.018], abv: [6.0,  7.5]  },
  "25B. Saison":                      { ibu: [20, 35],  srm: [5,  14], og: [1.048, 1.065], fg: [1.004, 1.010], abv: [3.5,  9.0]  },
  "25C. Belgian Golden Strong Ale":   { ibu: [22, 35],  srm: [3,  6],  og: [1.070, 1.095], fg: [1.005, 1.016], abv: [7.5,  10.5] },

  // ── 26. Monastic Ale ───────────────────────────────────────────────────────
  "26A. Belgian Single":              { ibu: [25, 45],  srm: [3,  7],  og: [1.044, 1.054], fg: [1.004, 1.010], abv: [4.8,  6.0]  },
  "26B. Belgian Dubbel":              { ibu: [15, 25],  srm: [10, 17], og: [1.062, 1.075], fg: [1.008, 1.018], abv: [6.0,  7.6]  },
  "26C. Belgian Tripel":              { ibu: [20, 40],  srm: [4,  7],  og: [1.075, 1.085], fg: [1.008, 1.014], abv: [7.5,  9.5]  },
  "26D. Belgian Dark Strong Ale":     { ibu: [20, 35],  srm: [12, 22], og: [1.075, 1.110], fg: [1.010, 1.024], abv: [8.0,  12.0] },

  // ── 28. American Wild Ale ──────────────────────────────────────────────────
  // (27. Historical Beer has no single fixed range — omitted)
  "28A. Brett Beer":                  { ibu: [0,  30],  srm: [3,  22], og: [1.045, 1.072], fg: [1.004, 1.014], abv: [5.0,  9.0]  },
  "28B. Mixed-Fermentation Sour Beer":{ ibu: [0,  25],  srm: [3,  22], og: [1.045, 1.072], fg: [1.004, 1.014], abv: [5.0,  9.0]  },
  "28D. Straight Sour Beer":          { ibu: [0,  20],  srm: [3,  7],  og: [1.040, 1.065], fg: [1.004, 1.010], abv: [5.0,  8.0]  },

  // ── 29. Fruit Beer ─────────────────────────────────────────────────────────
  "29D. Grape Ale":                   { ibu: [6,  30],  srm: [4,  8],  og: [1.040, 1.070], fg: [1.000, 1.010], abv: [6.0,  8.5]  },

  // Note: 28C Wild Specialty Beer, 29A-C, 30A-D, 31A-B, 32A-B, 33A-B, 34A-C
  // derive their stats from a base style and are intentionally omitted.
}

/**
 * Returns the BJCP vital statistics for a given style string, or null if the
 * style is not found or has no defined numeric ranges.
 */
export function getBjcpVitals(style: string): StyleVitals | null {
  return BJCP_VITALS[style] ?? null
}
