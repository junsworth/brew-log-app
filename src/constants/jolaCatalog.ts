export type JolaMalt = {
  id: string;
  name: string;
  brand: "The Swaen" | "Jola";
  category: string;
  ebc: string;
};

export type JolaHop = {
  id: string;
  name: string;
  origin: string;
  alphaPercent: number | null;
};

export type JolaYeast = {
  id: string;
  name: string;
  brand: string;
  form: string;
  packageSize: string;
  notes?: string;
};

export const JOLA_CUSTOM_PRODUCT_ID = "__custom__";

export const JOLA_MALTS: readonly JolaMalt[] = [
  { id: "swaen-lager", name: "Swaen Lager", brand: "The Swaen", category: "Base", ebc: "3-4" },
  { id: "swaen-pilsner", name: "Swaen Pilsner", brand: "The Swaen", category: "Base", ebc: "3-4.5" },
  { id: "swaen-ale", name: "Swaen Ale (Pale Ale)", brand: "The Swaen", category: "Base", ebc: "6-9" },
  { id: "swaen-vienna", name: "Swaen Vienna", brand: "The Swaen", category: "Base", ebc: "9-12" },
  { id: "swaen-munich-light", name: "Swaen Munich Light", brand: "The Swaen", category: "Base", ebc: "12-15" },
  { id: "swaen-munich-dark", name: "Swaen Munich Dark", brand: "The Swaen", category: "Base", ebc: "15-25" },
  { id: "swaen-amber", name: "Swaen Amber (Abbey)", brand: "The Swaen", category: "Special", ebc: "40-60" },
  { id: "swaen-melany", name: "Swaen Melany (Melanoidin)", brand: "The Swaen", category: "Special", ebc: "60-80" },
  { id: "goldswaen-light", name: "GoldSwaen Light (Carapils)", brand: "The Swaen", category: "Caramel", ebc: "10-20" },
  { id: "goldswaen-hell", name: "GoldSwaen Hell", brand: "The Swaen", category: "Caramel", ebc: "20-30" },
  { id: "goldswaen-red", name: "GoldSwaen Red", brand: "The Swaen", category: "Caramel", ebc: "40-60" },
  { id: "goldswaen-amber", name: "GoldSwaen Amber", brand: "The Swaen", category: "Caramel", ebc: "60-80" },
  { id: "goldswaen-munich-light", name: "GoldSwaen Munich Light", brand: "The Swaen", category: "Caramel", ebc: "80-110" },
  { id: "goldswaen-classic", name: "GoldSwaen Classic", brand: "The Swaen", category: "Caramel", ebc: "110-130" },
  { id: "goldswaen-munich-dark", name: "GoldSwaen Munich Dark", brand: "The Swaen", category: "Caramel", ebc: "130-160" },
  { id: "goldswaen-brown", name: "GoldSwaen Brown", brand: "The Swaen", category: "Caramel", ebc: "200-240" },
  { id: "goldswaen-brown-supreme", name: "GoldSwaen Brown Supreme", brand: "The Swaen", category: "Caramel", ebc: "280-320" },
  { id: "goldswaen-aroma", name: "GoldSwaen Aroma", brand: "The Swaen", category: "Caramel", ebc: "350-450" },
  { id: "blackswaen-biscuit", name: "BlackSwaen Biscuit", brand: "The Swaen", category: "Roasted", ebc: "70-90" },
  { id: "blackswaen-honey-biscuit", name: "BlackSwaen Honey Biscuit", brand: "The Swaen", category: "Roasted", ebc: "80-90" },
  { id: "blackswaen-coffee", name: "BlackSwaen Coffee", brand: "The Swaen", category: "Roasted", ebc: "500-800" },
  { id: "blackswaen-chocolate", name: "BlackSwaen Chocolate", brand: "The Swaen", category: "Roasted", ebc: "800-1000" },
  { id: "blackswaen-black", name: "BlackSwaen Black", brand: "The Swaen", category: "Roasted", ebc: "1000-1250" },
  { id: "blackswaen-barley", name: "BlackSwaen Barley (Cevada Torrada)", brand: "The Swaen", category: "Roasted", ebc: "1000-1250" },
  { id: "blackswaen-black-extra", name: "BlackSwaen Black Extra", brand: "The Swaen", category: "Roasted", ebc: "1250-1400" },
  { id: "whiteswaen-wheat-classic", name: "WhiteSwaen Wheat Classic", brand: "The Swaen", category: "Wheat", ebc: "3-5" },
  { id: "goldswaen-wheat-light", name: "GoldSwaen Wheat Light", brand: "The Swaen", category: "Wheat", ebc: "60-100" },
  { id: "blackswaen-chocolate-wheat", name: "BlackSwaen Chocolate Wheat", brand: "The Swaen", category: "Wheat", ebc: "800-1000" },
  { id: "platinumswaen-spelt", name: "PlatinumSwaen Spelt", brand: "The Swaen", category: "Special", ebc: "5-10" },
  { id: "platinumswaen-rye", name: "PlatinumSwaen Rye", brand: "The Swaen", category: "Special", ebc: "4" },
  { id: "platinumswaen-smoke", name: "PlatinumSwaen Smoke", brand: "The Swaen", category: "Special", ebc: "6" },
  { id: "platinumswaen-sauer", name: "PlatinumSwaen Sauer", brand: "The Swaen", category: "Special", ebc: "14" },
  { id: "platinumswaen-oat", name: "PlatinumSwaen Oat", brand: "The Swaen", category: "Special", ebc: "3-4" },
  { id: "platinumswaen-salty-caramel", name: "PlatinumSwaen Salty Caramel", brand: "The Swaen", category: "Special", ebc: "20-30" },
  { id: "flocos-aveia", name: "Flocos de Aveia", brand: "Jola", category: "Adjunct", ebc: "2" },
  { id: "flocos-cevada", name: "Flocos de Cevada", brand: "Jola", category: "Adjunct", ebc: "2" },
  { id: "flocos-centeio", name: "Flocos de Centeio", brand: "Jola", category: "Adjunct", ebc: "2" },
  { id: "flocos-trigo", name: "Flocos de Trigo", brand: "Jola", category: "Adjunct", ebc: "2" },
] as const;

export const JOLA_HOPS: readonly JolaHop[] = [
  { id: "bramling-cross", name: "Bramling Cross", origin: "Reino Unido", alphaPercent: 6.8 },
  { id: "challenger", name: "Challenger", origin: "Reino Unido", alphaPercent: 4.9 },
  { id: "east-kent-goldings", name: "East Kent Goldings", origin: "Reino Unido", alphaPercent: 5.8 },
  { id: "first-gold", name: "First Gold", origin: "Reino Unido", alphaPercent: 7.5 },
  { id: "fuggles", name: "Fuggles", origin: "Reino Unido", alphaPercent: 5.0 },
  { id: "goldings", name: "Goldings", origin: "Reino Unido", alphaPercent: 4.75 },
  { id: "target", name: "Target", origin: "Reino Unido", alphaPercent: 10.5 },
  { id: "brewers-gold", name: "Brewer's Gold", origin: "Alemanha", alphaPercent: 4.7 },
  { id: "hallertau-blanc", name: "Hallertau Blanc", origin: "Alemanha", alphaPercent: 10.5 },
  { id: "hallertau-tradition", name: "Hallertau Tradition", origin: "Alemanha", alphaPercent: 5.5 },
  { id: "hallertauer-mittelfruh", name: "Hallertauer Mittelfruh", origin: "Alemanha", alphaPercent: 4.75 },
  { id: "herkules", name: "Herkules", origin: "Alemanha", alphaPercent: 14.5 },
  { id: "hersbrucker", name: "Hersbrucker", origin: "Alemanha", alphaPercent: 3.25 },
  { id: "melon", name: "Melon", origin: "Alemanha", alphaPercent: 7.9 },
  { id: "magnum", name: "Magnum", origin: "Alemanha", alphaPercent: 13.5 },
  { id: "mandarina-bavaria", name: "Mandarina Bavaria", origin: "Alemanha", alphaPercent: 7.5 },
  { id: "northern-brewer", name: "Northern Brewer", origin: "Alemanha", alphaPercent: 8.8 },
  { id: "nugget", name: "Nugget", origin: "Alemanha", alphaPercent: 10.4 },
  { id: "perle", name: "Perle", origin: "Alemanha", alphaPercent: 6.0 },
  { id: "polaris", name: "Polaris", origin: "Alemanha", alphaPercent: 19.0 },
  { id: "spalter-select", name: "Spalter Select", origin: "Alemanha", alphaPercent: 4.5 },
  { id: "tettnanger", name: "Tettnanger", origin: "Alemanha", alphaPercent: 4.0 },
  { id: "styrian-golding", name: "Styrian Golding", origin: "Eslovénia", alphaPercent: 4.0 },
  { id: "styrian-bobek", name: "Styrian Bobek", origin: "Eslovénia", alphaPercent: 4.0 },
  { id: "saaz", name: "Saaz", origin: "República Checa", alphaPercent: 4.0 },
  { id: "sladek", name: "Sladek", origin: "República Checa", alphaPercent: 5.1 },
  { id: "nelson-sauvin", name: "Nelson Sauvin", origin: "Nova Zelândia", alphaPercent: null },
  { id: "galaxy", name: "Galaxy", origin: "Austrália", alphaPercent: null },
  { id: "amarillo", name: "Amarillo", origin: "EUA", alphaPercent: 8.5 },
  { id: "azacca", name: "Azacca", origin: "EUA", alphaPercent: 10.6 },
  { id: "cascade", name: "Cascade", origin: "EUA", alphaPercent: 5.75 },
  { id: "centennial", name: "Centennial", origin: "EUA", alphaPercent: 9.0 },
  { id: "chinook", name: "Chinook", origin: "EUA", alphaPercent: 10.6 },
  { id: "citra", name: "Citra", origin: "EUA", alphaPercent: 13.8 },
  { id: "columbus", name: "Columbus", origin: "EUA", alphaPercent: 13.4 },
  { id: "crystal", name: "Crystal", origin: "EUA", alphaPercent: 5.0 },
  { id: "el-dorado", name: "El Dorado", origin: "EUA", alphaPercent: 12.9 },
  { id: "equanot", name: "Equinox / Ekuanot", origin: "EUA", alphaPercent: 13.0 },
  { id: "galena", name: "Galena", origin: "EUA", alphaPercent: 12.5 },
  { id: "lemondrop", name: "Lemondrop", origin: "EUA", alphaPercent: 6.0 },
  { id: "mosaic", name: "Mosaic", origin: "EUA", alphaPercent: 13.6 },
  { id: "simcoe", name: "Simcoe", origin: "EUA", alphaPercent: 11.5 },
  { id: "sorachi-ace", name: "Sorachi Ace", origin: "EUA", alphaPercent: 12.0 },
  { id: "summit", name: "Summit", origin: "EUA", alphaPercent: 14.7 },
  { id: "warrior", name: "Warrior", origin: "EUA", alphaPercent: 16.0 },
  { id: "willamette", name: "Willamette", origin: "EUA", alphaPercent: 5.0 },
] as const;

export const JOLA_YEASTS: readonly JolaYeast[] = [
  { id: "safale-k97", name: "Fermentis SafAle K-97", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "safale-s04", name: "Fermentis SafAle S-04", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "safale-us05", name: "Fermentis SafAle US-05", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "safale-s33", name: "Fermentis SafAle S-33", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "safale-t58", name: "Fermentis SafAle T-58", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "safale-wb06", name: "Fermentis SafAle WB-06", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "safale-be134", name: "Fermentis SafAle BE-134", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "safale-be256", name: "Fermentis SafAle BE-256", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "safale-ha18", name: "Fermentis SafAle HA-18", brand: "Fermentis", form: "Dry", packageSize: "11.5g", notes: "up to 18% ABV" },
  { id: "safale-f2", name: "Fermentis SafAle F-2", brand: "Fermentis", form: "Dry", packageSize: "20g", notes: "bottle refermentation" },
  { id: "saflager-w3470", name: "Fermentis SafLager W-34/70", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "saflager-s23", name: "Fermentis SafLager S-23", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "saflager-s189", name: "Fermentis SafLager S-189", brand: "Fermentis", form: "Dry", packageSize: "11.5g" },
  { id: "safbrew-la01", name: "Fermentis SafBrew LA-01", brand: "Fermentis", form: "Dry", packageSize: "100g*", notes: "low/no alcohol beers" },
  { id: "safbrew-da16", name: "Fermentis SafBrew DA-16", brand: "Fermentis", form: "Dry", packageSize: "100g*", notes: "Brut IPA" },
  { id: "safsour-lb1", name: "Fermentis SafSour LB-1", brand: "Fermentis", form: "Dry", packageSize: "100g*", notes: "Sours" },
  { id: "safsour-lp652", name: "Fermentis SafSour LP-652", brand: "Fermentis", form: "Dry", packageSize: "100g*", notes: "Sours" },
  { id: "springblanche", name: "Fermentis SpringBlanche", brand: "Fermentis", form: "Dry", packageSize: "100g*", notes: "NEIPA/Wheat/Weizen" },
  { id: "safcider", name: "Fermentis SafCider", brand: "Fermentis", form: "Dry", packageSize: "5g", notes: "cider" },
  { id: "enovini-honey", name: "Browin Enovini Honey", brand: "Browin", form: "Dry", packageSize: "10g", notes: "mead" },
  { id: "fermiol-dest", name: "Browin Fermiol Destilação", brand: "Browin", form: "Dry", packageSize: "7g", notes: "distillation" },
  { id: "grom-turbo-48h", name: "Browin Grom Destilação Turbo 48h", brand: "Browin", form: "Dry", packageSize: "150g", notes: "distillation" },
  { id: "whisky-turbo", name: "Browin Destilação Whisky Turbo", brand: "Browin", form: "Dry", packageSize: "23g", notes: "distillation" },
  { id: "frutas-turbo", name: "Browin Destilação Frutas Turbo", brand: "Browin", form: "Dry", packageSize: "40g", notes: "distillation" },
  { id: "lalbrew-verdant-ipa", name: "LalBrew Verdant IPA", brand: "Lallemand", form: "Dry", packageSize: "11.5g" },
] as const;

const maltById = new Map(JOLA_MALTS.map((m) => [m.id, m]));
const hopById = new Map(JOLA_HOPS.map((h) => [h.id, h]));
const yeastById = new Map(JOLA_YEASTS.map((y) => [y.id, y]));

export const getJolaMalt = (id: string) => maltById.get(id);
export const getJolaHop = (id: string) => hopById.get(id);
export const getJolaYeast = (id: string) => yeastById.get(id);

export function groupJolaMalts() {
  return JOLA_MALTS.reduce<Record<string, JolaMalt[]>>((acc, row) => {
    acc[row.category] = acc[row.category] ?? [];
    acc[row.category].push(row);
    return acc;
  }, {});
}

export function groupJolaHopsByOrigin() {
  return JOLA_HOPS.reduce<Record<string, JolaHop[]>>((acc, row) => {
    acc[row.origin] = acc[row.origin] ?? [];
    acc[row.origin].push(row);
    return acc;
  }, {});
}
