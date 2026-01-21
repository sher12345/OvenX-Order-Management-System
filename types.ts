
export type PriceType = number | { [key: string]: number };

export interface MenuItem {
  id: string;
  name: string;
  price: PriceType;
  category: string;
}

export interface FlavorRequirement {
  label: string;
  cat: string;
}

export interface DealItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  badge: string;
  img: string;
  flavorsNeeded?: FlavorRequirement[];
  fixedItems?: string[];
}

export type OrderType = 'Dine-In' | 'Takeaway' | 'Delivery';

export interface CartItem {
  cartId: string;
  id: string;
  name: string;
  price: number;
  qty: number;
  note: string;
  flavorNotes?: string;
}

export interface OrderRecord {
  id: string;
  timestamp: number;
  items: CartItem[];
  orderType: OrderType;
  tableNum?: string;
  subtotal: number;
  serviceCharge: number;
  deliveryCharge: number;
  total: number;
}
