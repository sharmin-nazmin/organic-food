import { StoreSettings } from '../types/store';

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
  name: string;
  location: string;
  distance: string;
  specialty: string;
  certifiedSince: number;
  image: string;
  bio: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'heirloom-rainbow-carrots',
    name: 'Organic Heritage Rainbow Carrots',
    category: 'Vegetables',
    price: 3.99,
    unit: 'bunch (approx 1.2 lbs)',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
    farm: 'Columbia Valley Organic Orchards',
    origin: 'Hood River, OR (52 miles away)',
    isSeasonal: true,
    certifiedOrganic: true,
    calories: '45 kcal / 100g',
    harvestedDate: 'Harvested yesterday morning',
    description: 'Crisp, naturally sweet multicolored heirloom carrots bursting with beta-carotene. Grown in mineral-rich volcanic soil without synthetic inputs.',
    rating: 4.9,
    reviewsCount: 42,
    localKeywords: ['fresh carrots Portland', 'heirloom carrots local farm', 'organic vegetables Hood River']
  },
  {
    id: 'local-honeycrisp-apples',
    name: 'Pacific Northwest Organic Honeycrisp Apples',
    category: 'Fruits',
    price: 4.49,
    unit: '2 lb bag',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    farm: 'Mount Hood Heritage Farms',
    origin: 'Parkdale, OR (64 miles away)',
    isSeasonal: true,
    certifiedOrganic: true,
    calories: '52 kcal / 100g',
    harvestedDate: 'Harvested 2 days ago',
    description: 'Ultra-crisp, refreshing burst of honey-tart flavor. Tree-ripened and cold-stored under zero chemical sprays.',
    rating: 5.0,
    reviewsCount: 88,
    localKeywords: ['organic honeycrisp apples Portland', 'local apple orchard Oregon', 'Pacific NW fruit market']
  },
  {
    id: 'wild-foraged-chanterelles',
    name: 'Wild Foraged Golden Chanterelle & Forest Mushrooms',
    category: 'Vegetables',
    price: 8.99,
    unit: '0.5 lb basket',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    farm: 'Cascadia Wildwood Foragers Guild',
    origin: 'Cascade Range Foothills, OR (38 miles away)',
    isSeasonal: true,
    certifiedOrganic: true,
    calories: '32 kcal / 100g',
    harvestedDate: 'Foraged fresh today',
    description: 'Earthy, peppery, golden forest gems sustainably gathered by hand under licensed organic foraging protocols.',
    rating: 4.95,
    reviewsCount: 64,
    localKeywords: ['chanterelles Portland market', 'wild mushrooms Oregon local', 'organic foraged produce']
  },
  {
    id: 'artisan-sourdough-boule',
    name: 'Stone-Milled Organic Whole Spelt Sourdough',
    category: 'Dairy & Artisan',
    price: 6.99,
    unit: 'loaf (800g)',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
    farm: 'Belmont Mill & Hearth Artisan Bakery',
    origin: 'Portland SE, OR (In-house bakery)',
    isSeasonal: false,
    certifiedOrganic: true,
    calories: '220 kcal / slice',
    harvestedDate: 'Baked fresh at 5:00 AM daily',
    description: 'Slow-fermented 36-hour sourdough baked using 100% Willamette Valley organic heritage grains. Naturally gut-friendly.',
    rating: 4.9,
    reviewsCount: 112,
    localKeywords: ['organic sourdough bakery SE Portland', 'local heritage grain bread', 'Belmont artisan bakery']
  },
  {
    id: 'family-harvest-csa-box',
    name: 'Weekly Local Farm Harvest Bounty Box (CSA)',
    category: 'Farm Boxes',
    price: 34.99,
    unit: 'bounty box (12-14 seasonal items)',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    farm: 'Willamette River Valley Co-Op',
    origin: 'Willamette Valley, OR (24 miles away)',
    isSeasonal: true,
    certifiedOrganic: true,
    calories: 'Assorted seasonal produce',
    harvestedDate: 'Packed fresh on delivery morning',
    description: 'Our most popular weekly subscription! Contains 12-14 items: crisp greens, root vegetables, orchard fruits, fresh culinary herbs, and weekly farm recipe card.',
    rating: 5.0,
    reviewsCount: 153,
    localKeywords: ['CSA box delivery Portland', 'local organic produce box', 'farm to table subscription Oregon']
  },
  {
    id: 'organic-pasture-raised-eggs',
    name: 'Heritage Pasture-Raised Golden Yolk Eggs',
    category: 'Dairy & Artisan',
    price: 6.49,
    unit: 'dozen (12 eggs)',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80',
    farm: 'Silver Falls Regenerative Poultry Farm',
    origin: 'Sublimity, OR (58 miles away)',
    isSeasonal: false,
    certifiedOrganic: true,
    calories: '72 kcal / egg',
    harvestedDate: 'Collected yesterday afternoon',
    description: 'Rich, deep amber yolks from hens roaming free on clover pasture under rotational grazing. Non-GMO, soy-free organic feed.',
    rating: 4.96,
    reviewsCount: 97,
    localKeywords: ['pasture raised eggs Portland', 'organic local eggs Oregon', 'regenerative farm eggs']
  },
  {
    id: 'organic-tuscan-lacinato-kale',
    name: 'Fresh Crisp Organic Dinosaur (Lacinato) Kale',
    category: 'Vegetables',
    price: 2.99,
    unit: 'bunch',
    image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?auto=format&fit=crop&w=800&q=80',
    farm: 'Sauvie Island Organic Family Farm',
    origin: 'Sauvie Island, OR (14 miles away)',
    isSeasonal: true,
    certifiedOrganic: true,
    calories: '35 kcal / 100g',
    harvestedDate: 'Harvested dawn today',
    description: 'Deep forest green dinosaur kale picked hours ago. Unsurpassed in tenderness and nutrient density, perfect for salads and green smoothies.',
    rating: 4.88,
    reviewsCount: 51,
    localKeywords: ['organic kale Sauvie Island', 'fresh greens local Portland', 'pesticide free kale']
  },
  {
    id: 'raw-wildflower-clover-honey',
    name: 'Unfiltered Raw Pacific NW Wildflower Honey',
    category: 'Pantry & Grains',
    price: 11.99,
    unit: '16 oz glass jar',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    farm: 'Cascadia Bee Sanctuary',
    origin: 'Sandy, OR (28 miles away)',
    isSeasonal: false,
    certifiedOrganic: true,
    calories: '64 kcal / tbsp',
    harvestedDate: 'Cold spun seasonal extraction',
    description: 'Raw, unpasteurized honey packed with natural enzymes, live pollen, and delicate floral notes of blackberry and mountain clover.',
    rating: 4.97,
    reviewsCount: 78,
    localKeywords: ['raw local honey Portland', 'wildflower honey Cascadia', 'unfiltered Oregon honey']
  },
  {
    id: 'tri-color-quinoa-grain',
    name: 'Locally Sourced Organic High-Protein Tri-Color Quinoa',
    category: 'Pantry & Grains',
    price: 5.49,
    unit: '1 lb bulk pouch',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    farm: 'Pacific Northwest Grain Collective',
    origin: 'Corvallis, OR (82 miles away)',
    isSeasonal: false,
    certifiedOrganic: true,
    calories: '120 kcal / 0.25 cup cooked',
    harvestedDate: 'Fresh harvest milled',
    description: 'Pre-washed, nutty heirloom seed blend packed with all 9 essential amino acids. 100% organically cultivated in Oregon.',
    rating: 4.85,
    reviewsCount: 39,
    localKeywords: ['organic grains Oregon', 'bulk grains Portland', 'local quinoa Pacific NW']
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Elena Rostova',
    location: 'Hawthorne / SE Portland, OR',
    rating: 5,
    date: '3 days ago',
    comment: 'The produce is incomparably fresher than any conventional supermarket. You can genuinely taste the difference in the heirloom rainbow carrots and Sauvie Island greens. Also love that I can pick up same day right on Belmont!',
    verifiedBuyer: true,
    favoriteItem: 'Weekly Local Farm Harvest Bounty Box (CSA)'
  },
  {
    id: 'r2',
    author: 'Marcus Vance',
    location: 'Mount Tabor, Portland, OR',
    rating: 5,
    date: '1 week ago',
    comment: 'Finding genuine certified organic food from local farms within 50 miles used to take whole weekend trips. EarthHarvest solved this completely. The Google Maps directions and in-store pickup parking are so easy.',
    verifiedBuyer: true,
    favoriteItem: 'Pacific Northwest Organic Honeycrisp Apples'
  },
  {
    id: 'r3',
    author: 'Sarah Chen, ND',
    location: 'Eastmoreland, Portland, OR',
    rating: 5,
    date: '2 weeks ago',
    comment: 'As a holistic nutritionist, pesticide-free regenerative food is non-negotiable for my family. EarthHarvest provides full transparency: every item has the farm name, harvest timestamp, and organic certification.',
    verifiedBuyer: true,
    favoriteItem: 'Stone-Milled Organic Whole Spelt Sourdough'
  },
  {
    id: 'r4',
    author: 'David & Karen O’Connor',
    location: 'Sunnyside, Portland, OR',
    rating: 5,
    date: '3 weeks ago',
    comment: 'The pasture eggs with deep amber yolks and wild chanterelles turned our Sunday brunches into 5-star restaurant meals. Staff is knowledgeable and deeply passionate about sustainable agriculture.',
    verifiedBuyer: true,
    favoriteItem: 'Heritage Pasture-Raised Golden Yolk Eggs'
  }
];

export const LOCAL_FARMS: FarmPartner[] = [
  {
    name: 'Sauvie Island Organic Family Farm',
    location: 'Sauvie Island, OR',
    distance: '14 miles away',
    specialty: 'Leafy brassicas, heirloom squash, fresh culinary herbs',
    certifiedSince: 1994,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    bio: 'Family-run multi-generational organic homestead dedicated to closed-loop composting and zero petroleum pesticide farming.'
  },
  {
    name: 'Columbia Valley Organic Orchards',
    location: 'Hood River, OR',
    distance: '52 miles away',
    specialty: 'Heirloom root vegetables, pears, and crisp mountain apples',
    certifiedSince: 2002,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
    bio: 'Nestled beneath Mount Hood, nourished by pure glacier snowmelt and fertile volcanic loam soils.'
  },
  {
    name: 'Silver Falls Regenerative Poultry & Dairy',
    location: 'Sublimity, OR',
    distance: '58 miles away',
    specialty: 'Pastured eggs, raw butter, grass-fed artisan goat cheeses',
    certifiedSince: 2008,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    bio: 'Pioneering regenerative rotational grazing that sequesters soil carbon while raising the happiest pasture birds in Oregon.'
  }
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "EarthHarvest Organic Food & Farm Market",
  tagline: "Local Organic Market & Sustainable Farm Stand",
  address: "1420 SE Belmont St",
  cityStateZip: "Portland, OR 97214",
  phone: "(503) 555-0198",
  email: "support@earthharvest-organic.local",
  hoursWeekday: "Mon - Sat: 7:30 AM – 8:00 PM",
  hoursSunday: "Sunday: 8:30 AM – 6:00 PM",
  announcementText: "100% Certified Organic Food • Same-Day Local Curbside Pickup & Portland Metro Delivery",
  heroHeadline: "Fresh, pesticide-free",
  heroHighlight: "organic food",
  heroSubtitle: "Experience the highest standard of nutrient-dense nutrition. Harvested at dawn across Willamette Valley, Hood River & Sauvie Island—available for same-day pickup on Belmont or eco-delivery.",
  lat: 45.5165,
  lng: -122.6515,
  metaTitle: "EarthHarvest Organic Food & Local Farm Market | Fresh Produce & Delivery",
  metaDescription: "Shop 100% certified organic food, local pesticide-free farm produce, and seasonal CSA boxes in Portland & Pacific NW. Same-day local pickup & eco-friendly delivery.",
  focusKeywords: [
    "organic food near me",
    "fresh organic produce Portland",
    "local organic market Belmont",
    "farm to table delivery Oregon",
    "pesticide free vegetables",
    "local CSA boxes"
  ],
  parkingNote: "Free 45-minute parking in our private rear lot off 14th Ave, plus 4 Level-2 EV charging stalls."
};

export const LOCAL_SEO_KEYWORDS = [
  { keyword: 'organic food near me', monthlyVolume: '74,000/mo', intent: 'High Local Transactional', rank: '#1 SE Portland' },
  { keyword: 'fresh organic produce Portland OR', monthlyVolume: '18,500/mo', intent: 'High Local Commercial', rank: '#1 Pacific NW' },
  { keyword: 'local organic market Belmont Portland', monthlyVolume: '4,200/mo', intent: 'Hyper-Local Navigation', rank: '#1 Maps 3-Pack' },
  { keyword: 'farm to table vegetable delivery Oregon', monthlyVolume: '9,800/mo', intent: 'Transactional Subscription', rank: '#2 Regional' },
  { keyword: 'certified pesticide-free grocery store near me', monthlyVolume: '12,300/mo', intent: 'Commercial Health', rank: '#1 Local organic' },
  { keyword: 'local CSA bounty box Portland', monthlyVolume: '6,100/mo', intent: 'Seasonal Community', rank: '#1 Willamette Valley' }
];
