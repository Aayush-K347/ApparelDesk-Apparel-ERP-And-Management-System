
export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  gender: 'Men' | 'Women' | 'Children';
  group: 'Topwear' | 'Bottomwear' | 'Footwear' | 'Accessories'; // Broad Category
  category: string; // Specific Category (e.g. T-Shirts)
  price: number;
  originalPrice?: number;
  image: string;     // Main image
  images: string[];  // Gallery
  description: string;
  sku: string;
  sizes: string[];
  colors: string[];
  material: string;
  vendor: string;
  reviews: Review[];
  popularityScore: number;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
  description: string;
}

export interface OrderItem {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    image: string;
}

export interface UserOrder {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending';
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  invoiceReference: string;
}

export interface VendorOrder {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: 'Pending' | 'Paid' | 'Shipped';
  paymentTerm: string;
  ref: string;
}

export type ViewState = 'LANDING' | 'GENDER_SELECTION' | 'PRODUCT_LISTING' | 'PRODUCT_DETAIL' | 'CART' | 'CHECKOUT' | 'ORDER_SUCCESS' | 'USER_PROFILE' | 'ORDER_DETAIL' | 'VENDOR_LOGIN' | 'VENDOR_DASHBOARD' | 'USER_AUTH';
