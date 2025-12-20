
import { Product, VendorOrder, Coupon, UserOrder } from './types';

// New Hierarchy Definition
export const NAV_HIERARCHY = {
    Men: {
        Topwear: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Sweatshirts', 'Jackets'],
        Bottomwear: ['Jeans', 'Trousers', 'Joggers', 'Shorts'],
        Footwear: ['Sneakers', 'Formal Shoes', 'Boots'],
        Accessories: ['Watches', 'Perfumes', 'Belts', 'Wallets']
    },
    Women: {
        Topwear: ['Tops', 'T-Shirts', 'Dresses', 'Jackets'],
        Bottomwear: ['Jeans', 'Skirts', 'Leggings'],
        Footwear: ['Heels', 'Flats', 'Sneakers'],
        Accessories: ['Handbags', 'Jewelry', 'Perfumes', 'Scarves']
    },
    Children: {
        Topwear: ['T-Shirts', 'Sets'],
        Bottomwear: ['Shorts', 'Pants'],
        Footwear: ['Sneakers', 'Sandals'],
        Accessories: ['Hats', 'Bags']
    }
};

const MATERIAL_TYPES = ['Cotton', 'Polyester', 'Linen', 'Denim', 'Leather', 'Silk', 'Gold', 'Silver', 'Crystal'];
const COLORS = ['Noir', 'Ecru', 'Navy', 'Olive', 'Sand', 'Burgundy', 'Slate', 'Gold'];

const TEES_IMAGES = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', // Black Tee Model
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop', // Black Tee Studio
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop', // White Tee
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop', // Black Tee Folded
];

const BOTTOMS_IMAGES = [
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop', // Beige Trousers
    'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=1000&auto=format&fit=crop', // Jeans
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop', // Shorts
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop', // Trousers Detail
];

const FLEECE_IMAGES = [
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop', // Hoodie
    'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=1000&auto=format&fit=crop', // Sweatshirt
    'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1000&auto=format&fit=crop', // White Hoodie
];

const ACCESSORY_IMAGES = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', // Watch
    'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop', // Perfume
    'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1000&auto=format&fit=crop', // Watch 2
    'https://images.unsplash.com/photo-1594038683601-b024214f43cc?q=80&w=1000&auto=format&fit=crop', // Perfume 2
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop' // Gold Watch
];

const GENERAL_IMAGES = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551488852-d814c937d191?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop'
];

const getImagesForCategory = (group: string, category: string): string[] => {
    if (category.includes('T-Shirt') || category.includes('Tops')) return TEES_IMAGES;
    if (group === 'Bottomwear') return BOTTOMS_IMAGES;
    if (category.includes('Sweatshirt') || category.includes('Hoodie') || category.includes('Jacket')) return FLEECE_IMAGES;
    if (group === 'Accessories' || category.includes('Watch') || category.includes('Perfume')) return ACCESSORY_IMAGES;
    return GENERAL_IMAGES;
};

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  let idCounter = 1;

  const genders = ['Men', 'Women', 'Children'] as const;
  
  genders.forEach(gender => {
      const groups = NAV_HIERARCHY[gender];
      Object.keys(groups).forEach((group) => {
          const categories = groups[group as keyof typeof groups];
          categories.forEach(category => {
              // Generate 2-4 products per specific category
              const count = Math.floor(Math.random() * 3) + 2; 
              const categoryImages = getImagesForCategory(group, category);
              
              for(let i=0; i<count; i++) {
                  const basePrice = Math.floor(Math.random() * 150) + 30;
                  // Use category specific images
                  const imgIndex = i % categoryImages.length;
                  const mainImage = categoryImages[imgIndex];
                  
                  products.push({
                      id: `prod_${idCounter++}`,
                      name: `${gender}'s ${category} - ${['Classic', 'Modern', 'Essential', 'Premium'][Math.floor(Math.random()*4)]} Edition`,
                      gender: gender,
                      group: group as any,
                      category: category,
                      price: basePrice,
                      originalPrice: Math.random() > 0.7 ? Math.floor(basePrice * 1.2) : undefined,
                      image: mainImage,
                      images: [
                          mainImage,
                          categoryImages[(imgIndex + 1) % categoryImages.length],
                          categoryImages[(imgIndex + 2) % categoryImages.length]
                      ],
                      description: `Expertly crafted ${category.toLowerCase()} featuring our signature silhouette. Designed for comfort and style using premium ${MATERIAL_TYPES[Math.floor(Math.random()*MATERIAL_TYPES.length)]}.`,
                      sku: `LUV-${Math.floor(Math.random() * 90000) + 10000}`,
                      sizes: category.includes('Perfume') || category.includes('Watch') ? ['One Size'] : ['S', 'M', 'L', 'XL', 'XXL'],
                      colors: [COLORS[Math.floor(Math.random()*COLORS.length)], COLORS[Math.floor(Math.random()*COLORS.length)]],
                      material: MATERIAL_TYPES[Math.floor(Math.random()*MATERIAL_TYPES.length)],
                      vendor: 'LUVARTE Atelier',
                      reviews: [],
                      popularityScore: Math.floor(Math.random() * 100),
                      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
                  });
              }
          });
      });
  });

  return products;
};

export const MOCK_PRODUCTS = generateProducts();

export const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountType: 'PERCENTAGE', value: 10, description: '10% Off First Order' },
  { code: 'MERRYCHRISTMAS20', discountType: 'PERCENTAGE', value: 20, description: 'Holiday Special' },
  { code: 'NEWYEARNEWME15', discountType: 'PERCENTAGE', value: 15, description: 'New Year Sale' },
];

export const MOCK_USER_ORDERS: UserOrder[] = [
    { 
        id: 'ORD-7782-X', 
        date: '2024-01-15', 
        status: 'Delivered', 
        paymentStatus: 'Paid',
        shippingAddress: '123 Fashion Ave, Paris, France 75001',
        subtotal: 245.00,
        discount: 0,
        tax: 24.50,
        total: 269.50,
        invoiceReference: 'INV-2024-001',
        items: [
            { name: 'Men\'s Casual Shirts - Classic', quantity: 2, unitPrice: 85.00, total: 170.00, image: GENERAL_IMAGES[0] },
            { name: 'Men\'s Belt', quantity: 1, unitPrice: 75.00, total: 75.00, image: GENERAL_IMAGES[1] }
        ] 
    },
    { 
        id: 'ORD-9921-Y', 
        date: '2024-03-22', 
        status: 'Processing', 
        paymentStatus: 'Paid',
        shippingAddress: '123 Fashion Ave, Paris, France 75001',
        subtotal: 120.00,
        discount: 12.00,
        tax: 10.80,
        total: 118.80,
        invoiceReference: 'INV-2024-089',
        items: [
            { name: 'Women\'s Handbag', quantity: 1, unitPrice: 120.00, total: 120.00, image: GENERAL_IMAGES[4] }
        ] 
    }
];

export const MOCK_ORDERS: VendorOrder[] = [
  { id: 'INV-2024-001', date: '2024-02-10', customer: 'Isabella Rossellini', total: 420.50, status: 'Paid', paymentTerm: 'Immediate', ref: 'PO-001' },
  { id: 'INV-2024-002', date: '2024-02-11', customer: 'Marcus Aurelius', total: 1250.00, status: 'Pending', paymentTerm: 'Net 30', ref: 'PO-002' },
];
