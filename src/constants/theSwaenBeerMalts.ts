/**
 * The Swaen — Malt for beer portfolio only.
 * Product names and families from https://theswaen.com/products/malt-for-beer/
 * and linked range pages (Swaen©, Gold / Black / Platinum Swaen©, Flakes).
 * Typical EBC is filled where stated on product pages; otherwise left blank for brewer / COA entry.
 */

export type SwaenBeerMaltFamily = "kilned" | "caramel" | "roasted" | "functional" | "flakes";

export type TheSwaenBeerMalt = {
  id: string;
  /** Display name (includes branding as on site) */
  name: string;
  /** Product line for the Type column */
  line: string;
  family: SwaenBeerMaltFamily;
  /** Typical colour (EBC) when published; empty = enter from spec / COA */
  typicalEbc: string;
};

export const SWAEN_CUSTOM_PRODUCT_ID = "__custom__";

export const THE_SWAEN_BEER_MALTS: readonly TheSwaenBeerMalt[] = [
  // Swaen© — Kilned (https://theswaen.com/products/malt-for-beer/swaen-malts/)
  { id: "swaen-lager", name: "Swaen© Lager", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-pilsner", name: "Swaen© Pilsner", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-dutch-pilsner", name: "Swaen© Dutch Pilsner", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-ale", name: "Swaen© Ale", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "dutch-pale-ale", name: "Dutch Pale Ale", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-vienna", name: "Swaen© Vienna", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-munich-light", name: "Swaen© Munich Light", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-munich-dark", name: "Swaen© Munich Dark", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-amber", name: "Swaen© Amber", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-melany", name: "Swaen© Melany", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-wheat-classic", name: "Swaen© Wheat Classic", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-wheat-dark", name: "Swaen© Wheat Dark", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-spelt", name: "Swaen© Spelt", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-rye", name: "Swaen© Rye", line: "Swaen©", family: "kilned", typicalEbc: "" },
  { id: "swaen-naked-oat", name: "Swaen© Naked Oat", line: "Swaen©", family: "kilned", typicalEbc: "" },

  // Gold Swaen© — Caramel / crystal (https://theswaen.com/products/malt-for-beer/gold-swaen-malts/)
  { id: "gold-swaen-light", name: "Gold Swaen© Light", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-hell", name: "Gold Swaen© Hell", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-belge", name: "Gold Swaen© Belge", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-red", name: "Gold Swaen© Red", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-amber", name: "Gold Swaen© Amber", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-munich-light", name: "Gold Swaen© Munich Light", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-classic", name: "Gold Swaen© Classic", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-munich-dark", name: "Gold Swaen© Munich Dark", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-brown-light", name: "Gold Swaen© Brown Light", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-brown", name: "Gold Swaen© Brown", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-brown-supreme", name: "Gold Swaen© Brown Supreme", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-aroma", name: "Gold Swaen© Aroma", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-wheat-light", name: "Gold Swaen© Wheat Light", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },
  { id: "gold-swaen-wheat-dark", name: "Gold Swaen© Wheat Dark", line: "Gold Swaen©", family: "caramel", typicalEbc: "" },

  // Black Swaen© — Roasted (https://theswaen.com/products/malt-for-beer/black-swaen-malts/)
  {
    id: "black-swaen-biscuit",
    name: "Black Swaen© Biscuit",
    line: "Black Swaen©",
    family: "roasted",
    typicalEbc: "70–90",
  },
  { id: "black-swaen-honey-biscuit", name: "Black Swaen© Honey Biscuit", line: "Black Swaen©", family: "roasted", typicalEbc: "" },
  { id: "black-swaen-coffee", name: "Black Swaen© Coffee", line: "Black Swaen©", family: "roasted", typicalEbc: "" },
  { id: "black-swaen-chocolate-b", name: "Black Swaen© Chocolate B", line: "Black Swaen©", family: "roasted", typicalEbc: "" },
  { id: "black-swaen-black", name: "Black Swaen© Black", line: "Black Swaen©", family: "roasted", typicalEbc: "" },
  { id: "black-swaen-black-extra", name: "Black Swaen© Black Extra", line: "Black Swaen©", family: "roasted", typicalEbc: "" },
  { id: "black-swaen-barley", name: "Black Swaen© Barley", line: "Black Swaen©", family: "roasted", typicalEbc: "" },
  { id: "black-swaen-chocolate-wheat", name: "Black Swaen© Chocolate Wheat", line: "Black Swaen©", family: "roasted", typicalEbc: "" },
  { id: "black-swaen-black-wheat", name: "Black Swaen© Black Wheat", line: "Black Swaen©", family: "roasted", typicalEbc: "" },

  // Platinum Swaen© — Functional (https://theswaen.com/products/malt-for-beer/platinum-swaen-malts/)
  { id: "platinum-swaen-salty-caramel", name: "Platinum Swaen© Salty Caramel", line: "Platinum Swaen©", family: "functional", typicalEbc: "" },
  { id: "platinum-swaen-brown-porter", name: "Platinum Swaen© Brown Porter", line: "Platinum Swaen©", family: "functional", typicalEbc: "" },
  { id: "platinum-swaen-stroopwafel", name: "Platinum Swaen© Stroopwafel", line: "Platinum Swaen©", family: "functional", typicalEbc: "" },
  { id: "platinum-swaen-chit", name: "Platinum Swaen© Chit", line: "Platinum Swaen©", family: "functional", typicalEbc: "" },
  { id: "platinum-swaen-smoke", name: "Platinum Swaen© Smoke", line: "Platinum Swaen©", family: "functional", typicalEbc: "" },
  { id: "platinum-swaen-sauer", name: "Platinum Swaen© Sauer", line: "Platinum Swaen©", family: "functional", typicalEbc: "" },

  // Flakes — Unmalted cereals (https://theswaen.com/products/malt-for-beer/flakes/)
  { id: "flaked-wheat", name: "Flaked Wheat", line: "Flakes", family: "flakes", typicalEbc: "" },
  { id: "flaked-oat", name: "Flaked Oat", line: "Flakes", family: "flakes", typicalEbc: "" },
] as const;

const byId = new Map(THE_SWAEN_BEER_MALTS.map((m) => [m.id, m]));

export function getTheSwaenBeerMalt(id: string): TheSwaenBeerMalt | undefined {
  return byId.get(id);
}

const FAMILY_LABEL: Record<SwaenBeerMaltFamily, string> = {
  kilned: "Swaen© — Kilned malts",
  caramel: "Gold Swaen© — Caramel / crystal",
  roasted: "Black Swaen© — Roasted",
  functional: "Platinum Swaen© — Functional",
  flakes: "Flakes — Unmalted cereals",
};

export function groupTheSwaenMaltsByFamily(): Record<SwaenBeerMaltFamily, readonly TheSwaenBeerMalt[]> {
  const out: Record<SwaenBeerMaltFamily, TheSwaenBeerMalt[]> = {
    kilned: [],
    caramel: [],
    roasted: [],
    functional: [],
    flakes: [],
  };
  for (const m of THE_SWAEN_BEER_MALTS) {
    out[m.family].push(m);
  }
  return out;
}

export function theSwaenFamilyLabel(family: SwaenBeerMaltFamily): string {
  return FAMILY_LABEL[family];
}
