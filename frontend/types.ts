
export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  backendId?: number;
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

export interface Address {
  address_id: number;
  label: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state?: string | null;
  pincode?: string | null;
  country: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
}

export interface OrderLineDetail {
  so_line_id: number;
  line_number: number;
  product: number;
  product_detail?: {
    name: string;
    code: string;
    price: number;
  };
  quantity: number;
  unit_price: number;
  tax_percentage: number;
  line_subtotal: number;
  line_tax_amount: number;
  line_total: number;
}

export interface SalesOrderResponse {
  sales_order_id: number;
  so_number: string;
  order_date: string;
  order_status: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  shipping_address_line1?: string;
  shipping_address_line2?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_pincode?: string | null;
  shipping_country?: string | null;
  lines: OrderLineDetail[];
  status_logs?: { previous_status: string; new_status: string; changed_at: string; note?: string | null }[];
}

export interface Creator {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    isVerified: boolean;
    verificationType?: 'BLUE' | 'GREEN'; // BLUE = Celebrity/Brand, GREEN = Verified Creator
}

export interface StudioPost {
    id: string;
    creator: Creator;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
    caption: string;
    likes: number;
    timestamp: string;
    productIds: string[]; // IDs of products in the look
}

export type ViewState = 'LANDING' | 'GENDER_SELECTION' | 'PRODUCT_LISTING' | 'PRODUCT_DETAIL' | 'CART' | 'CHECKOUT' | 'ORDER_SUCCESS' | 'USER_PROFILE' | 'ORDER_DETAIL' | 'VENDOR_LOGIN' | 'VENDOR_DASHBOARD' | 'USER_AUTH' | 'STUDIO';
