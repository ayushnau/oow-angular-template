export interface CartItem {
  _id: string;
  userId: string;
  storeId: string;
  quantity: number;
  notes: string;
  item_id: string;
  variation: string;
  addons: string[];
  createdAt: string;
  updatedAt: string;
  addons_details: any[];
  items_details: {
    _id: string;
    item_id: string;
    item_name: string;
    item_image_url: string;
    price: string;
    variation: {
      id: string;
      name?: string;
    };
    [key: string]: any;
  };
  total: number;
}

export interface CartResponse {
  results: CartItem[];
  message: string;
  code: number;
}

export interface OrderNotesResponse {
  results: {
    minimum_prep_time: {
      num: string;
      time: string;
    };
    minimum_delivery_time: {
      num: string;
      time: string;
    };
    _id: string;
    userId: string;
    storeId: string;
    orderId: string;
    order_type: string;
    order_status: string;
    notes: string;
    is_modified: string;
    paymentDetails: {
      refunded: boolean;
    };
    cartItems: any[];
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  code: number;
} 