
import { Product, VendorOrder, Coupon, UserOrder, Creator, StudioPost } from './types';

// FEATURE FLAG
export const ENABLE_STUDIO = true;

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

// STUDIO MOCK DATA
const CREATORS: Creator[] = [
    { 
        id: 'c1', 
        name: 'LUVARTE Official', 
        handle: '@luvarte_paris', 
        avatar: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop', 
        isVerified: true, 
        verificationType: 'BLUE' 
    },
    { 
        id: 'c2', 
        name: 'Elena Silva', 
        handle: '@elena.style', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop', 
        isVerified: true, 
        verificationType: 'GREEN' 
    },
    { 
        id: 'c3', 
        name: 'Marc O.', 
        handle: '@marc_fits', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop', 
        isVerified: false 
    },
    {
        id: 'c4',
        name: 'Sofia Kenin',
        handle: '@sofia.k',
        avatar: 'https://plus.unsplash.com/premium_photo-1689371957762-b5f8d601933e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop',
        isVerified: true,
        verificationType: 'GREEN'
    },
    {
        id: 'c5',
        name: 'Julian Casablancas',
        handle: '@julian_c',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
        isVerified: false
    }
];

export const MOCK_STUDIO_POSTS: StudioPost[] = [
    {
        id: 'post1',
        creator: CREATORS[0],
        mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'IMAGE',
        caption: 'The Essential Collection. Defined by silhouette, refined by detail. #LUVARTE #Paris',
        likes: 1240,
        timestamp: '2h ago',
        productIds: ['prod_1', 'prod_4', 'prod_8'] 
    },
    {
        id: 'post2',
        creator: CREATORS[1],
        mediaUrl: 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        mediaType: 'IMAGE',
        caption: 'Sunday brunch vibes in the new silk set. Absolutely obsessed with the quality! ✨',
        likes: 856,
        timestamp: '5h ago',
        productIds: ['prod_12', 'prod_15']
    },
    {
        id: 'post3',
        creator: CREATORS[2],
        mediaUrl: 'https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'IMAGE',
        caption: 'Street style essentials. The heavyweight hoodie is a game changer.',
        likes: 432,
        timestamp: '1d ago',
        productIds: ['prod_20', 'prod_22', 'prod_2']
    },
    {
        id: 'post4',
        creator: CREATORS[3],
        mediaUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'IMAGE',
        caption: 'Simplicity is the ultimate sophistication. Wearing the new Fall collection.',
        likes: 1567,
        timestamp: '3h ago',
        productIds: ['prod_5', 'prod_6']
    },
    {
        id: 'post5',
        creator: CREATORS[4],
        mediaUrl: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'IMAGE',
        caption: 'Accessories make the outfit. Loving this new watch. #Timepiece',
        likes: 890,
        timestamp: '6h ago',
        productIds: ['prod_30', 'prod_31']
    },
    {
        id: 'post6',
        creator: CREATORS[0],
        mediaUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'IMAGE',
        caption: 'Behind the scenes at our latest campaign shoot. Magic in the making.',
        likes: 3420,
        timestamp: '12h ago',
        productIds: ['prod_10', 'prod_11']
    },
    {
        id: 'post7',
        creator: CREATORS[1],
        mediaUrl: 'https://images.unsplash.com/photo-1623113526872-d5237a0d079d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        mediaType: 'IMAGE',
        caption: 'Golden hour glow. The texture of this fabric is unreal.',
        likes: 2100,
        timestamp: '1d ago',
        productIds: ['prod_18']
    },
    {
        id: 'post8',
        creator: CREATORS[2],
        mediaUrl: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'IMAGE',
        caption: 'Coffee run. Comfort meet style.',
        likes: 675,
        timestamp: '1d ago',
        productIds: ['prod_25', 'prod_26']
    },
    // New Posts for Robust Filtering
    {
        id: 'post9',
        creator: CREATORS[3],
        mediaUrl: 'https://images.unsplash.com/photo-1668266366677-08d06537ec8d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        mediaType: 'IMAGE',
        caption: 'Morning light. Verified look for the season.',
        likes: 4500,
        timestamp: '2d ago',
        productIds: ['prod_9']
    },
    {
        id: 'post10',
        creator: CREATORS[4],
        mediaUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'IMAGE',
        caption: 'Classic never goes out of style. #Menswear',
        likes: 230,
        timestamp: '3d ago',
        productIds: ['prod_2']
    },
    {
        id: 'post11',
        creator: CREATORS[0],
        mediaUrl: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'IMAGE',
        caption: 'Details matter. The stitching on this piece is exquisite.',
        likes: 5600,
        timestamp: '4h ago',
        productIds: ['prod_15', 'prod_16']
    },
    {
        id: 'post12',
        creator: CREATORS[2],
        mediaUrl: 'https://images.unsplash.com/photo-1492446845049-9c50cc313f00?q=80&w=1000&auto=format&fit=crop',
        mediaType: 'IMAGE',
        caption: 'Urban explorer.',
        likes: 89,
        timestamp: '1h ago',
        productIds: ['prod_19']
    }
];

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
