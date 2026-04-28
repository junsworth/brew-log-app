export const RECIPE_TYPES = ["All Grain", "BIAB", "Extract", "Partial Mash"] as const;

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

export const BJCP_BEER_STYLES = [
  "1. Standard American Beer", 
  "1A. American Light Lager", 
  "1B. American Lager", 
  "1C. Cream Ale", 
  "1D. American Wheat Beer",
  "2. International Lager", 
  "2A. International Pale Lager", 
  "2B. International Amber Lager", 
  "2C. International Dark Lager",
  "3. Czech Lager", 
  "3A. Czech Pale Lager", 
  "3B. Czech Premium Pale Lager", 
  "3C. Czech Amber Lager", 
  "3D. Czech Dark Lager",
  "4. Pale Malty European Lager", 
  "4A. Munich Helles", 
  "4B. Festbier", 
  "4C. Helles Bock",
  "5. Pale Bitter European Beer", 
  "5A. German Leichtbier", 
  "5B. Kölsch", 
  "5C. German Helles Exportbier", 
  "5D. German Pils",
  "6. Amber Malty European Lager", 
  "6A. Märzen", 
  "6B. Rauchbier", 
  "6C. Dunkles Bock",
  "7. Amber Bitter European Beer", 
  "7A. Vienna Lager", 
  "7B. Altbier",
  "8. Dark European Lager", 
  "8A. Munich Dunkel", 
  "8B. Schwarzbier",
  "9. Strong European Beer", 
  "9A. Doppelbock", 
  "9B. Eisbock", 
  "9C. Baltic Porter",
  "10. German Wheat Beer", 
  "10A. Weissbier", 
  "10B. Dunkles Weissbier", 
  "10C. Weizenbock",
  "11. British Bitter", 
  "11A. Ordinary Bitter", 
  "11B. Best Bitter", 
  "11C. Strong Bitter",
  "12. Pale Commonwealth Beer", 
  "12A. British Golden Ale", 
  "12B. Australian Sparkling Ale", 
  "12C. English IPA",
  "13. Brown British Beer", 
  "13A. Dark Mild", 
  "13B. British Brown Ale", 
  "13C. English Porter",
  "14. Scottish Ale", 
  "14A. Scottish Light", 
  "14B. Scottish Heavy", 
  "14C. Scottish Export",
  "15. Irish Beer", 
  "15A. Irish Red Ale", 
  "15B. Irish Stout", 
  "15C. Irish Extra Stout",
  "16. Dark British Beer", 
  "16A. Sweet Stout", 
  "16B. Oatmeal Stout", 
  "16C. Tropical Stout", 
  "16D. Foreign Extra Stout",
  "17. Strong British Ale", 
  "17A. British Strong Ale", 
  "17B. Old Ale", 
  "17C. Wee Heavy", 
  "17D. English Barleywine",
  "18. Pale American Ale", 
  "18A. Blonde Ale", 
  "18B. American Pale Ale",
  "19. Amber and Brown American Beer", 
  "19A. American Amber Ale", 
  "19B. California Common", 
  "19C. American Brown Ale",
  "20. American Porter and Stout", 
  "20A. American Porter", 
  "20B. American Stout", 
  "20C. Imperial Stout",
  "21. IPA", 
  "21A. American IPA", 
  "21B. Specialty IPA", 
  "21C. Hazy IPA",
  "22. Strong American Ale", 
  "22A. Double IPA", 
  "22B. American Strong Ale", 
  "22C. American Barleywine", 
  "22D. Wheatwine",
  "23. European Sour Ale", 
  "23A. Berliner Weisse", 
  "23B. Flanders Red Ale", 
  "23C. Oud Bruin", 
  "23D. Lambic", 
  "23E. Gueuze", 
  "23F. Fruit Lambic", 
  "23G. Gose",
  "24. Belgian Ale", 
  "24A. Witbier", 
  "24B. Belgian Pale Ale", 
  "24C. Bière de Garde",
  "25. Strong Belgian Ale", 
  "25A. Belgian Blond Ale", 
  "25B. Saison", 
  "25C. Belgian Golden Strong Ale",
  "26. Monastic Ale", 
  "26A. Belgian Single", 
  "26B. Belgian Dubbel", 
  "26C. Belgian Tripel", 
  "26D. Belgian Dark Strong Ale",
  "27. Historical Beer",
  "28. American Wild Ale", 
  "28A. Brett Beer", 
  "28B. Mixed-Fermentation Sour Beer", 
  "28C. Wild Specialty Beer", 
  "28D. Straight Sour Beer",
  "29. Fruit Beer", 
  "29A. Fruit Beer", 
  "29B. Fruit and Spice Beer", 
  "29C. Specialty Fruit Beer", 
  "29D. Grape Ale",
  "30. Spiced Beer", 
  "30A. Spice, Herb, or Vegetable Beer", 
  "30B. Autumn Seasonal Beer", 
  "30C. Winter Seasonal Beer", 
  "30D. Specialty Spice Beer",
  "31. Alternative Fermentables Beer", 
  "31A. Alternative Grain Beer", 
  "31B. Alternative Sugar Beer",
  "32. Smoked Beer", 
  "32A. Classic Style Smoked Beer", 
  "32B. Specialty Smoked Beer",
  "33. Wood-Aged Beer", 
  "33A. Wood-Aged Beer", 
  "33B. Specialty Wood-Aged Beer",
  "34. Specialty Beer", 
  "34A. Commercial Specialty Beer",
  "34B. Mixed-Style Beer",
  "34C. Experimental Beer"
]

/**
 * Converts BJCP_BEER_STYLES into grouped form for CatalogCombobox.
 * Category-header entries (e.g. "21. IPA") become non-selectable group labels;
 * sub-style entries (e.g. "21A. American IPA") become selectable items.
 * The one exception is "27. Historical Beer" which has no sub-styles and is
 * kept as a selectable item inside its own group.
 */
export function bjcpStyleGroups(): { label: string; items: { value: string; label: string }[] }[] {
  const groups: { label: string; items: { value: string; label: string }[] }[] = []

  for (let i = 0; i < BJCP_BEER_STYLES.length; i++) {
    const style = BJCP_BEER_STYLES[i]

    if (/^\d+\. /.test(style)) {
      // Category header — check whether sub-styles follow immediately
      const hasSubStyles =
        i + 1 < BJCP_BEER_STYLES.length && !/^\d+\. /.test(BJCP_BEER_STYLES[i + 1])
      groups.push({
        label: style,
        // If no sub-styles, make the category itself selectable
        items: hasSubStyles ? [] : [{ value: style, label: style }],
      })
    } else {
      // Sub-style item — append to the most recent group
      groups[groups.length - 1]?.items.push({ value: style, label: style })
    }
  }

  return groups
}
