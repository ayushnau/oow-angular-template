// export interface NutritionDetail {
//   unit: string;
//   amount: number;
// }

// export interface Nutrition {
//   protien: NutritionDetail;
//   calories: NutritionDetail;
//   totalFat: NutritionDetail;
//   carbohydrate: NutritionDetail;
//   fiber?: NutritionDetail;
//   sodium?: NutritionDetail;
//   transFat?: NutritionDetail;
//   addedSugar?: NutritionDetail;
//   cholesterol?: NutritionDetail;
//   saturatedFat?: NutritionDetail;
// }

export interface Nutrition {
  [key: string]: {
    unit: string;
    amount: number;
  };
}

export interface VariationAddon {
  addon_group_id: string;
  addon_item_selection_min: string;
  addon_item_selection_max: string;
  _id: string;
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
  addon?: VariationAddon;
  _id: string;
}

export interface AddonGroupItem {
  addonitemid: string;
  addonitem_name: string;
  addonitem_price: string;
  active: string;
  attributes: string;
  addonitem_rank: string;
  _id: string;
}

export interface AddonDetail {
  addon_group_id: string;
  addon_group_name: string;
  addon_group_rank: string;
  addon_group_items: AddonGroupItem[];
  menu_sharing_code: string;
  store_id: string;
  _id: string;
  __v: number;
  active: string;
  variation_ids?: string[];
}

export interface Addon {
  _id: string;
  addon_group_id: string;
  addon_item_selection_max: string;
  addon_item_selection_min: string;
}

export interface FoodItem {
  _id: string;
  item_id: string;
  active: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  cuisine: any[];
  gst_type: string;
  ignore_discounts: string;
  ignore_taxes: string;
  in_stock: string;
  item_allow_variation: string;
  item_attribute_id: string;
  item_category_id: string;
  item_description: string;
  item_image_url: string;
  item_name: string;
  item_ordertype: string;
  item_packing_charges: string;
  item_rank: string;
  item_tax: string;
  menu_sharing_code: string;
  nutrition: string | Nutrition;
  price: string;
  store_id: string;
  addon: Array<{
    _id: string;
    addon_group_id: string;
    addon_item_selection_max: string;
    addon_item_selection_min: string;
  }>;
  addonDetails: AddonDetail[];
  variation: Variation[];
  variationAddonDetails: AddonDetail[];
} 


