export interface Nutrition {
  calories: { unit: string; amount: number };
  protein: { unit: string; amount: number };
  // ... other nutrition properties
}

export interface Addon {
  addon_group_id: string;
  addon_item_selection_min: string;
  addon_item_selection_max: string;
  _id: { $oid: string };
}

export interface Variation {
  id: string;
  variationid: string;
  name: string;
  groupname: string;
  price: string;
  active: string;
  item_packingcharges: string;
  variationrank: string;
  variationallowaddon: number;
  addon: Addon[];
  _id: { $oid: string };
}

export interface MenuItem {
  _id: { $oid: string };
  item_id: string;
  active: string;
  addon: Addon[];
  item_allow_variation: string;
  item_name: string;
  item_description: string;
  item_image_url: string;
  item_favorite: string;
  nutrition: string;
  price: string;
  variation: Variation[];
} 