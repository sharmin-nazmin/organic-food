export interface Product {
  id: string;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Pantry & Grains' | 'Dairy & Artisan' | 'Farm Boxes';
  price: number;
  unit: string;
  image: string;
  farm: string;
  origin: string;
  isSeasonal: boolean;
  certifiedOrganic: boolean;
  calories: string;
  harvestedDate: string;
  description: string;
  rating: number;
  reviewsCount: number;
  localKeywords: string[];
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  favoriteItem: string;
}

export interface FarmPartner {
  id?: string;
  name: string;
  location: string;
  distance: string;
  specialty: string;
  certifiedSince: number;
  image: string;
  bio: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  cityStateZip: string;
  phone: string;
  email: string;
  hoursWeekday: string;
  hoursSunday: string;
  announcementText: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtitle: string;
  lat: number;
  lng: number;
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string[];
  parkingNote: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryType: 'pickup' | 'local_delivery';
  deliveryAddress?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    unit: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Prepping' | 'Ready for Pickup' | 'Out for Delivery' | 'Completed' | 'Cancelled';
}
