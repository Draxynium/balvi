export type CatalogItem = {
  id: string;
  name: string;
  hexCode?: string;
};

export type CatalogInput = {
  name: string;
  hexCode?: string;
};

export type CatalogResource = "brands" | "colors";
