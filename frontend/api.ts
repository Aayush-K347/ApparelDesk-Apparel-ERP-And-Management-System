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

const baseFetch: typeof globalThis.fetch = (...args) => globalThis.fetch(...args);

const refreshAccessToken = async (): Promise<boolean> => {
  if (!refreshToken) return false;
  const res = await baseFetch(`${API_BASE}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!res.ok) return false;
  const data = await res.json().catch(() => ({}));
  if (!data?.access) return false;
  setTokens(data.access, refreshToken);
  return true;
};

const apiFetch: typeof globalThis.fetch = async (input, init) => {
  const headers = new Headers(init?.headers || {});
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  const res = await baseFetch(input, { ...init, headers });
  if (res.status !== 401) return res;
  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    clearTokens();
    return res;
  }
  const retryHeaders = new Headers(init?.headers || {});
  if (accessToken && !retryHeaders.has('Authorization')) {
    retryHeaders.set('Authorization', `Bearer ${accessToken}`);
  }
  return baseFetch(input, { ...init, headers: retryHeaders });
};

const fetch: typeof globalThis.fetch = apiFetch;

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
  const data = await res.json();
  if (Array.isArray(data)) return mapProducts(data);
  return mapProducts(data.results || []);
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
  const body = {
    product_category: payload.product_category || 'men',
    product_type: payload.product_type || 'other',
    product_code: payload.product_code,
    material: payload.material,
    description: payload.description,
    sales_price: payload.sales_price,
    purchase_price: payload.purchase_price,
    product_name: payload.product_name,
    colors: payload.colors || [],
    images: payload.images || [],
    is_published: payload.is_published ?? true,
    is_active: true,
  };

  const res = await fetch(`${API_BASE}/catalog/vendor/products/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = 'Unable to create product';
    try {
      const err = await res.json();
      detail = err.detail || JSON.stringify(err);
    } catch (_e) {
      /* ignore */
    }
    throw new Error(detail);
  }
  const data = await res.json();
  if (Array.isArray(data)) return mapProducts(data)[0];
  if (data && data.product_id) return mapProducts([data])[0];
  throw new Error('Unexpected response');
}

// Sales helpers for vendors (customer + payment term selection)
export async function fetchSaleCustomers(search?: string): Promise<{ contact_id: number; contact_name: string; email: string }[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`${API_BASE}/sales/customers/${query}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load customers');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchPaymentTerms(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/pricing/payment-terms/`);
  if (!res.ok) throw new Error('Unable to load payment terms');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

// Offers & Coupons
export type Offer = {
  discount_offer_id: number;
  offer_name: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  available_on: string;
  is_active: boolean;
};

export type CouponRow = {
  coupon_id: number;
  coupon_code: string;
  expiration_date: string;
  coupon_status: string;
  usage_count: number;
  max_usage_count: number;
  contact_detail?: { contact_id: number; contact_name: string; email: string } | null;
  discount_offer?: Offer;
};

export async function fetchOffers(): Promise<Offer[]> {
  const res = await fetch(`${API_BASE}/pricing/offers/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load offers');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function createOffer(payload: {
  offer_name: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  available_on: string;
  is_active?: boolean;
}): Promise<Offer> {
  const res = await fetch(`${API_BASE}/pricing/offers/create/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ ...payload, is_active: payload.is_active ?? true }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Unable to create offer');
  }
  return res.json();
}

export async function fetchCoupons(filter?: { offer_id?: number; status?: string; customer_id?: number }): Promise<CouponRow[]> {
  const qs = new URLSearchParams();
  if (filter?.offer_id) qs.append('offer_id', String(filter.offer_id));
  if (filter?.status) qs.append('status', filter.status);
  if (filter?.customer_id) qs.append('customer_id', String(filter.customer_id));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  const res = await fetch(`${API_BASE}/pricing/coupons/${query}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load coupons');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function generateCoupons(payload: {
  discount_offer_id: number;
  for_type: 'anonymous' | 'selected' | 'all';
  customer_ids?: number[];
  quantity?: number;
  expiration_date: string;
  max_usage_count?: number;
}): Promise<CouponRow[]> {
  const res = await fetch(`${API_BASE}/pricing/coupons/generate/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Unable to generate coupons');
  }
  const data = await res.json();
  return data.created || [];
}

// Reports summary
export async function fetchReportSummary(group_by: 'product' | 'contact' | 'document' = 'product') {
  const qs = new URLSearchParams({ group_by });
  const res = await fetch(`${API_BASE}/sales/reports/summary/?${qs.toString()}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load report summary');
  return res.json();
}

export async function fetchVendorInvoices(filter?: { customer_id?: number; status?: string }) {
  const query = new URLSearchParams();
  if (filter?.customer_id) query.append('customer_id', String(filter.customer_id));
  if (filter?.status) query.append('status', filter.status);
  const qs = query.toString() ? `?${query.toString()}` : '';
  const res = await fetch(`${API_BASE}/sales/vendor/invoices/${qs}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load invoices');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchPurchaseOrders(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/purchases/purchase-orders/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load purchase orders');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function createPurchaseOrder(payload: {
  vendor_id: number;
  expected_delivery_date?: string;
  order_date?: string;
  notes?: string;
  lines: { product_id?: number; product_name?: string; quantity: number; unit_price: number; tax_percentage?: number }[];
}) {
  const res = await fetch(`${API_BASE}/purchases/purchase-orders/create/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Unable to create purchase order');
  }
  return res.json();
}

// Portal Users APIs
export type PortalUser = {
  contact_id: number;
  contact_name: string;
  contact_type: string;
  email: string;
  mobile: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country: string;
  is_active: boolean;
};

export async function fetchPortalUsers(): Promise<PortalUser[]> {
  const res = await fetch(`${API_BASE}/users/portal/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load portal users');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function updatePortalUser(contactId: number, payload: Partial<PortalUser>): Promise<PortalUser> {
  const res = await fetch(`${API_BASE}/users/portal/${contactId}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Unable to update user');
  }
  return res.json();
}

// Contacts APIs (single source)
export async function fetchCustomers(): Promise<PortalUser[]> {
  const res = await fetch(`${API_BASE}/contacts/customers/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load customers');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchVendors(): Promise<PortalUser[]> {
  const res = await fetch(`${API_BASE}/contacts/vendors/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load vendors');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchVendorBills(filter?: { vendor_id?: number }) {
  const query = new URLSearchParams();
  if (filter?.vendor_id) query.append('vendor_id', String(filter.vendor_id));
  const qs = query.toString() ? `?${query.toString()}` : '';
  const res = await fetch(`${API_BASE}/purchases/vendor-bills/${qs}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Unable to load vendor bills');
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function createBillFromPurchaseOrder(poId: number) {
  const res = await fetch(`${API_BASE}/purchases/purchase-orders/${poId}/create-bill/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Unable to create vendor bill');
  }
  return res.json();
}

export async function payVendorBill(billId: number) {
  const res = await fetch(`${API_BASE}/purchases/vendor-bills/${billId}/pay/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Unable to pay bill');
  }
  return res.json();
}
