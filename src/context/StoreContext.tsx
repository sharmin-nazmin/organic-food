import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, Review, FarmPartner, StoreSettings, Order 
} from '../types/store';
import { 
  PRODUCTS as INITIAL_PRODUCTS, 
  REVIEWS as INITIAL_REVIEWS, 
  LOCAL_FARMS as INITIAL_FARMS,
  DEFAULT_STORE_SETTINGS 
} from '../data/organicFoodData';

interface StoreContextType {
  products: Product[];
  storeSettings: StoreSettings;
  farms: FarmPartner[];
  reviews: Review[];
  orders: Order[];
  isAdmin: boolean;
  adminLogin: (pass: string) => boolean;
  adminLogout: () => void;
  // Product Actions
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  // Store & Local SEO Settings Actions
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  // Farms Actions
  addFarm: (farm: FarmPartner) => void;
  updateFarm: (index: number, farm: FarmPartner) => void;
  deleteFarm: (index: number) => void;
  // Reviews Actions
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  updateReview: (review: Review) => void;
  deleteReview: (id: string) => void;
  // Orders Actions
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  // Backup / Reset
  resetAllData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'eh_organic_products_v2',
  SETTINGS: 'eh_organic_settings_v2',
  FARMS: 'eh_organic_farms_v2',
  REVIEWS: 'eh_organic_reviews_v2',
  ORDERS: 'eh_organic_orders_v2',
  ADMIN_AUTH: 'eh_organic_is_admin_v2',
};

// Initial mock orders to demonstrate Order Management in the CMS
const INITIAL_ORDERS: Order[] = [
  {
    id: 'EH-894210',
    createdAt: '2026-09-28 08:30 AM',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@gmail.com',
    customerPhone: '(503) 555-0144',
    deliveryType: 'pickup',
    deliveryAddress: '1420 SE Belmont St (Curbside Bay 3)',
    items: [
      {
        productId: 'family-harvest-csa-box',
        productName: 'Weekly Local Farm Harvest Bounty Box (CSA)',
        quantity: 1,
        price: 34.99,
        unit: 'bounty box'
      },
      {
        productId: 'heirloom-rainbow-carrots',
        productName: 'Organic Heritage Rainbow Carrots',
        quantity: 2,
        price: 3.99,
        unit: 'bunch'
      }
    ],
    subtotal: 42.97,
    deliveryFee: 0,
    total: 42.97,
    status: 'Ready for Pickup'
  },
  {
    id: 'EH-894195',
    createdAt: '2026-09-27 04:15 PM',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.v@outlook.com',
    customerPhone: '(503) 555-0812',
    deliveryType: 'local_delivery',
    deliveryAddress: '3210 SE Hawthorne Blvd, Apt 4B, Portland, OR 97214',
    items: [
      {
        productId: 'local-honeycrisp-apples',
        productName: 'Pacific Northwest Organic Honeycrisp Apples',
        quantity: 2,
        price: 4.49,
        unit: '2 lb bag'
      },
      {
        productId: 'artisan-sourdough-boule',
        productName: 'Stone-Milled Organic Whole Spelt Sourdough',
        quantity: 1,
        price: 6.99,
        unit: 'loaf'
      },
      {
        productId: 'raw-wildflower-clover-honey',
        productName: 'Unfiltered Raw Pacific NW Wildflower Honey',
        quantity: 1,
        price: 11.99,
        unit: '16 oz jar'
      }
    ],
    subtotal: 27.96,
    deliveryFee: 4.99,
    total: 32.95,
    status: 'Completed'
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 2. Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  // 3. Farms
  const [farms, setFarms] = useState<FarmPartner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FARMS);
      return saved ? JSON.parse(saved) : INITIAL_FARMS;
    } catch {
      return INITIAL_FARMS;
    }
  });

  // 4. Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // 5. Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // 6. Admin Authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, String(isAdmin));
  }, [isAdmin]);

  // Admin Login
  const adminLogin = (pass: string) => {
    // Accepts "admin", "admin123", or any demo entry
    if (pass.toLowerCase() === 'admin' || pass === 'admin123' || pass === '1234') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
  };

  // Product Actions
  const addProduct = (prodData: Omit<Product, 'id'>): Product => {
    const slug = prodData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `prod-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: `${slug}-${Math.floor(100 + Math.random() * 900)}`
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Store Settings
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  // Farm Actions
  const addFarm = (farm: FarmPartner) => {
    setFarms((prev) => [...prev, farm]);
  };

  const updateFarm = (index: number, farm: FarmPartner) => {
    setFarms((prev) => {
      const copy = [...prev];
      copy[index] = farm;
      return copy;
    });
  };

  const deleteFarm = (index: number) => {
    setFarms((prev) => prev.filter((_, i) => i !== index));
  };

  // Review Actions
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const updateReview = (updated: Review) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `EH-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      status: 'Pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Reset & Backup
  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setStoreSettings(DEFAULT_STORE_SETTINGS);
    setFarms(INITIAL_FARMS);
    setReviews(INITIAL_REVIEWS);
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.FARMS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
  };

  const exportData = (): string => {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      storeSettings,
      products,
      farms,
      reviews,
      orders,
    };
    return JSON.stringify(backup, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.storeSettings) setStoreSettings(parsed.storeSettings);
      if (parsed.farms) setFarms(parsed.farms);
      if (parsed.reviews) setReviews(parsed.reviews);
      if (parsed.orders) setOrders(parsed.orders);
      return true;
    } catch (e) {
      console.error('Failed to import data', e);
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        storeSettings,
        farms,
        reviews,
        orders,
        isAdmin,
        adminLogin,
        adminLogout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStoreSettings,
        addFarm,
        updateFarm,
        deleteFarm,
        addReview,
        updateReview,
        deleteReview,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        resetAllData,
        exportData,
        importData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
