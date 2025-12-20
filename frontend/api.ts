import { Product, Coupon, Address, SalesOrderResponse } from './types';

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '').endsWith('/api')
  ? RAW_API_BASE.replace(/\/+$/, '')
  : `${RAW_API_BASE.replace(/\/+$/, '')}/api`;

let accessToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
let refreshToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

export const setTokens = (access: string, refresh: string | null = null) => {
  accessToken = access;
  refreshToken = refresh ?? refreshToken;
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', access);
    if (refresh) localStorage.setItem('refreshToken', refresh);
  }
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

const authHeaders = () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {});

type BackendProduct = {
  product_id: number;
  product_name: string;
  product_code: string;
  product_category: string;
  product_type: string;
  material?: string;
  description?: string;
  sales_price: string | number;
  sales_tax_percentage: string | number;
  images?: { image_url: string; is_primary: boolean }[];
  colors?: { color_name: string }[];
  created_at?: string;
};

const mapTypeToGroup = (productType: string): Product['group'] => {
  const lower = productType.toLowerCase();
  if (['jeans', 'pant', 'trousers', 'joggers', 'shorts'].some(t => lower.includes(t))) return 'Bottomwear';
  if (['shirt', 't-shirt', 'kurta', 'dress', 'sweatshirt', 'jacket', 'hoodie'].some(t => lower.includes(t))) return 'Topwear';
  if (['shoe', 'boot'].some(t => lower.includes(t))) return 'Footwear';
  return 'Accessories';
};

const mapCategoryToGender = (category: string) => {
  const normalized = category?.toLowerCase();
  if (normalized === 'men') return 'Men';
  if (normalized === 'women') return 'Women';
  if (normalized === 'children') return 'Children';
  return 'Men';
};

type ProductPage = { items: Product[]; next: string | null; count?: number };

const mapProducts = (backend: BackendProduct[]): Product[] =>
  backend.map(p => ({
    id: `prod_${p.product_id}`,
    backendId: p.product_id,
    name: p.product_name,
    gender: mapCategoryToGender(p.product_category),
    group: mapTypeToGroup(p.product_type),
    category: p.product_type,
    price: Number(p.sales_price),
    originalPrice: undefined,
    image: p.images?.find(i => i.is_primary)?.image_url || p.images?.[0]?.image_url || '',
    images: (p.images || []).map(i => i.image_url),
    description: p.description || '',
    sku: p.product_code,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: (p.colors || []).map(c => c.color_name),
    material: p.material || 'Cotton',
    vendor: 'LUVARTE Atelier',
    reviews: [],
    popularityScore: 50,
    createdAt: p.created_at || new Date().toISOString(),
  }));

export async function fetchProducts(
  params: Record<string, string | number | undefined> = {}
): Promise<ProductPage> {
  const query = new URLSearchParams();
  if (!params.page_size) {
    query.append("page_size", "50");
  }
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
  });
  const res = await fetch(`${API_BASE}/catalog/products/?${query.toString()}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  if (Array.isArray(data)) {
    return { items: mapProducts(data), next: null, count: data.length };
  }
  return { items: mapProducts(data.results || []), next: data.next, count: data.count };
}

export async function fetchProductsByUrl(url: string): Promise<ProductPage> {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return { items: mapProducts(data.results || []), next: data.next, count: data.count };
}

export async function validateCoupon(code: string): Promise<Coupon | null> {
  const res = await fetch(`${API_BASE}/pricing/coupons/validate/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.valid) return null;
  const discount = data.coupon.discount_offer.discount_percentage;
  return { code: data.coupon.coupon_code, discountType: 'PERCENTAGE', value: Number(discount), description: data.coupon.discount_offer.offer_name };
}

export async function registerUser(payload: { email: string; password: string; fullName: string }): Promise<void> {
  const body = {
    username: payload.email,
    email: payload.email,
    password: payload.password,
    contact_name: payload.fullName,
    contact_type: 'customer',
    user_role: 'portal',
  };
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Registration failed');
  }
}

export async function registerVendor(payload: { email: string; password: string; fullName: string }): Promise<void> {
  const body = {
    username: payload.email,
    email: payload.email,
    password: payload.password,
    contact_name: payload.fullName,
    user_role: 'internal',
  };
  const res = await fetch(`${API_BASE}/auth/vendor/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Registration failed');
  }
}

export async function loginUser(payload: { email: string; password: string }): Promise<void> {
  const body = { username: payload.email, password: payload.password };
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Invalid credentials');
  }
  const data = await res.json();
  setTokens(data.access, data.refresh);
}

export async function fetchProfile(): Promise<{ contact_id: number; contact_name: string; user_role: string }> {
  const res = await fetch(`${API_BASE}/auth/profile/`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
  if (!res.ok) throw new Error('Unable to load profile');
  const data = await res.json();
  return {
    contact_id: data.contact?.contact_id,
    contact_name: data.contact?.contact_name,
    user_role: data.user_role,
  };
}

type CheckoutLine = {
  product_id: number;
  quantity: number;
  unit_price: number;
  tax_percentage?: number;
  line_number: number;
};

export async function checkoutOrder(payload: {
  customer_id?: number;
  payment_term_id: number;
  coupon_code?: string;
  address_id?: number;
  shipping_address_line1?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;
  shipping_country?: string;
  lines: CheckoutLine[];
}): Promise<{ order: SalesOrderResponse; invoice: any }> {
  const res = await fetch(`${API_BASE}/sales/checkout/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Checkout failed');
  return res.json();
}

export async function createPayment(invoiceId: number, amount: number): Promise<any> {
  const res = await fetch(`${API_BASE}/payments/create/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ invoice_id: invoiceId, amount, payment_method: 'upi' }),
  });
  if (!res.ok) throw new Error('Payment failed');
  return res.json();
}

export async function fetchOrders(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/sales/orders/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load orders');
  const data = await res.json();
  if (Array.isArray(data)) {
    return data as SalesOrderResponse[];
  }
  if (data && Array.isArray(data.results)) {
    return data.results as SalesOrderResponse[];
  }
  return [];
}

export async function fetchInvoices(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/sales/invoices/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load invoices');
  return res.json();
}

// Cart APIs
export async function fetchCart(): Promise<any> {
  const res = await fetch(`${API_BASE}/sales/cart/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load cart');
  return res.json();
}

export async function saveCart(items: { product_id: number; quantity: number; selected_size?: string; selected_color?: string }[]): Promise<any> {
  const res = await fetch(`${API_BASE}/sales/cart/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error('Unable to save cart');
  return res.json();
}

export async function fetchAddresses(): Promise<Address[]> {
  const res = await fetch(`${API_BASE}/auth/addresses/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load addresses');
  return res.json();
}

export async function createAddress(payload: Partial<Address>): Promise<Address> {
  const res = await fetch(`${API_BASE}/auth/addresses/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Unable to save address');
  return res.json();
}

export async function updateAddress(addressId: number, payload: Partial<Address>): Promise<Address> {
  const res = await fetch(`${API_BASE}/auth/addresses/${addressId}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Unable to update address');
  return res.json();
}

export async function deleteAddress(addressId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/addresses/${addressId}/`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error('Unable to delete address');
}

// Vendor APIs
export async function vendorFetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/catalog/vendor/products/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load vendor products');
  return (await res.json()) as Product[];
}

export async function vendorCreateProduct(payload: {
  product_name: string;
  product_code?: string;
  product_category: 'men' | 'women' | 'children' | 'unisex';
  product_type: 'shirt' | 'pant' | 'kurta' | 't-shirt' | 'jeans' | 'dress' | 'other';
  material?: string;
  description?: string;
  sales_price: number;
  purchase_price: number;
  colors?: string[];
  images?: string[];
  is_published?: boolean;
}): Promise<Product> {
  const res = await fetch(`${API_BASE}/catalog/vendor/products/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Unable to create product');
  return (await res.json()) as Product;
}
