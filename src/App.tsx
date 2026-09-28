import React, { useState, useEffect } from 'react';
import { 
  PRODUCTS, REVIEWS, LOCAL_FARMS, LOCAL_SEO_KEYWORDS, Product 
} from './data/organicFoodData';
import { GoogleMapsSection } from './components/GoogleMapsSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartModal } from './components/CartModal';
import { SeoDashboardModal } from './components/SeoDashboardModal';
import { 
  MapPin, Phone, Mail, Clock, ShoppingBag, ShieldCheck, Heart, 
  ChevronRight, Award, Leaf, Search, Navigation, Zap, ExternalLink, 
  Sparkles, CheckCircle2, MessageSquare, ArrowUpRight, Menu, X
} from 'lucide-react';

export default function App() {
  // Navigation / SEO Clean URL State
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Read Maps API Key from env
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  // Synchronize hash routing for SEO friendly URL structures
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash || hash === '') {
        setCurrentRoute('home');
      } else if (['organic-produce', 'farm-boxes', 'local-farmers', 'contact', 'reviews'].includes(hash)) {
        setCurrentRoute(hash);
      } else {
        // Check if hash matches product id
        const prod = PRODUCTS.find((p) => p.id === hash);
        if (prod) {
          setSelectedProduct(prod);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = `#/${route}`;
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[]
    );
  };

  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Top Local SEO Announcement Bar */}
      <aside aria-label="Local store notice" className="bg-emerald-950 text-emerald-200 text-xs py-2 px-4 border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-medium">
              100% Certified Organic Food • Same-Day Local Curbside Pickup &amp; Portland Metro Delivery
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-emerald-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              1420 SE Belmont St, Portland, OR
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" />
              (503) 555-0198
            </span>
            <button
              onClick={() => setIsSeoModalOpen(true)}
              className="text-white underline font-semibold hover:text-emerald-300 flex items-center gap-1 ml-2"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              SEO &amp; Sitemap Audit
            </button>
          </div>
        </div>
      </aside>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="font-serif font-black text-xl text-stone-900 tracking-tight leading-none">
                EarthHarvest
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 block mt-0.5">
                Local Organic Market
              </span>
            </div>
          </div>

          {/* Clean URL Semantic Nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-stone-600">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                currentRoute === 'home'
                  ? 'text-emerald-900 bg-emerald-50 font-bold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('organic-produce')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                currentRoute === 'organic-produce'
                  ? 'text-emerald-900 bg-emerald-50 font-bold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Organic Produce
            </button>
            <button
              onClick={() => navigateTo('farm-boxes')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                currentRoute === 'farm-boxes'
                  ? 'text-emerald-900 bg-emerald-50 font-bold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Farm CSA Boxes
            </button>
            <button
              onClick={() => navigateTo('local-farmers')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                currentRoute === 'local-farmers'
                  ? 'text-emerald-900 bg-emerald-50 font-bold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Our Local Farmers
            </button>
            <button
              onClick={() => navigateTo('reviews')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                currentRoute === 'reviews'
                  ? 'text-emerald-900 bg-emerald-50 font-bold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Customer Reviews
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                currentRoute === 'contact'
                  ? 'text-emerald-900 bg-emerald-50 font-bold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Store &amp; Google Map
            </button>
          </nav>

          {/* Right Action Icons: Cart & Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSeoModalOpen(true)}
              title="View Local SEO & Sitemap"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-xs font-semibold transition-colors border border-stone-200"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Sitemap / SEO</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-stone-900 hover:bg-emerald-800 text-white transition-colors shadow-md shadow-stone-900/10 flex items-center gap-2 text-xs font-semibold"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Farm Box</span>
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-stone-950 font-bold text-[11px] flex items-center justify-center">
                {totalCartCount}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 bg-white border-b border-stone-200 space-y-1">
            <button
              onClick={() => navigateTo('home')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-emerald-50"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('organic-produce')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-emerald-50"
            >
              Organic Produce Catalog
            </button>
            <button
              onClick={() => navigateTo('farm-boxes')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-emerald-50"
            >
              Farm CSA Subscription Boxes
            </button>
            <button
              onClick={() => navigateTo('local-farmers')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-emerald-50"
            >
              Our Local Farmers &amp; Orchards
            </button>
            <button
              onClick={() => navigateTo('reviews')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-emerald-50"
            >
              Verified Customer Reviews (4.9★)
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-emerald-50"
            >
              Store Location &amp; Google Maps
            </button>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSeoModalOpen(true);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50"
              >
                ⚡ View Local SEO Audit &amp; XML Sitemap
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {currentRoute === 'home' && (
          <div className="space-y-16 pb-20">
            {/* HERO SECTION with local keyword focus */}
            <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-stone-900 to-stone-950 text-white pt-16 pb-24 md:py-24">
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Certified Organic Food Market • Portland, Oregon</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.1] text-white">
                      Fresh, pesticide-free <span className="text-emerald-400 italic">organic food</span> directly from local family farms.
                    </h1>

                    <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed">
                      Experience the highest standard of nutrient-dense nutrition. Harvested at dawn across Willamette Valley, Hood River &amp; Sauvie Island—available for same-day pickup on Belmont or eco-delivery.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        onClick={() => navigateTo('organic-produce')}
                        className="px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2"
                      >
                        <span>Shop Local Organic Produce</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => navigateTo('contact')}
                        className="px-6 py-4 rounded-2xl bg-stone-800/90 hover:bg-stone-700 text-white font-semibold text-sm transition-all border border-stone-700 flex items-center gap-2"
                      >
                        <Navigation className="w-4 h-4 text-emerald-400" />
                        <span>Find Belmont Store (Google Maps)</span>
                      </button>
                    </div>

                    {/* Local Trust Badges */}
                    <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-800 text-xs text-stone-300">
                      <div>
                        <span className="font-bold text-lg text-white font-serif block">100%</span>
                        <span className="text-stone-400">USDA &amp; Oregon Tilth Certified</span>
                      </div>
                      <div>
                        <span className="font-bold text-lg text-emerald-400 font-serif block">&lt; 100 Miles</span>
                        <span className="text-stone-400">Hyper-Local Farm Sourcing</span>
                      </div>
                      <div>
                        <span className="font-bold text-lg text-white font-serif block">4.9 ★★★★★</span>
                        <span className="text-stone-400">384 Local Google Reviews</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Image Feature Card */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800/60 group">
                      <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                        alt="Local fresh organic vegetables and heirloom fruits market Portland Oregon"
                        className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent"></div>
                      
                      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-stone-700 text-stone-200">
                        <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1">
                          <span>Today’s Morning Harvest</span>
                          <span className="text-stone-300">Packed 2 Hours Ago</span>
                        </div>
                        <p className="text-xs text-stone-300">
                          Heirloom carrots, crisp Sauvie Island kale, and fresh golden honey available today at 1420 SE Belmont St.
                        </p>
                      </div>
                    </div>

                    {/* Floating Local SEO Pill */}
                    <div className="absolute -top-4 -right-4 bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Best Organic Grocery 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PRODUCT CATALOG PREVIEW SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ProductCatalog
                products={PRODUCTS}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p, 1)}
              />
            </section>

            {/* WHY LOCAL ORGANIC MATTERS (SEO Educational & Topical Authority) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-emerald-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-3xl space-y-4">
                  <span className="px-3.5 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                    Local Farm Stewardship
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
                    Why Local Organic Food Outperforms Conventional Supermarkets
                  </h2>
                  <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
                    Most produce in industrial supermarket chains travels over 1,500 miles and sits in cold chemical storage for weeks. At EarthHarvest, our food is harvested less than 24 hours before it reaches our Belmont market or your doorstep—preserving crucial enzymes, phytonutrients, and unbelievable natural flavor.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                    <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/50">
                      <ShieldCheck className="w-6 h-6 text-emerald-300 mb-2" />
                      <h3 className="font-serif font-bold text-base">Zero Pesticides</h3>
                      <p className="text-xs text-emerald-200 mt-1">Non-GMO, glyphosate-free, synthetic herbicide-free cultivation.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/50">
                      <Leaf className="w-6 h-6 text-emerald-300 mb-2" />
                      <h3 className="font-serif font-bold text-base">Peak Nutrition</h3>
                      <p className="text-xs text-emerald-200 mt-1">Higher vitamin C, antioxidant, and polyphenolic concentrations.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/50">
                      <Heart className="w-6 h-6 text-emerald-300 mb-2" />
                      <h3 className="font-serif font-bold text-base">Local Economy</h3>
                      <p className="text-xs text-emerald-200 mt-1">92 cents of every dollar directly supports Pacific NW family farmers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* GOOGLE MAPS STORE SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                  Visit In Person
                </span>
                <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">
                  Local Farm Stand &amp; Google Maps Navigation
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  Centrally located on SE Belmont in Portland with electric charging stations and convenient curbside loading bays.
                </p>
              </div>
              <GoogleMapsSection apiKey={apiKey} />
            </section>

            {/* LOCAL FARMER PARTNERS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                    Transparent Provenance
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">
                    Meet Your Local Organic Growers
                  </h2>
                  <p className="text-sm text-stone-600 mt-1">
                    Dedicated family farms cultivating living soil across Oregon and the Pacific Northwest.
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('local-farmers')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <span>View all partner farm stories</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {LOCAL_FARMS.map((farm, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={farm.image}
                          alt={`${farm.name} local organic farm Oregon`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-emerald-300 text-xs px-2.5 py-1 rounded-full font-medium">
                          {farm.distance}
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="text-xs font-semibold text-emerald-700">{farm.location}</div>
                        <h3 className="font-serif font-bold text-lg text-stone-900 mt-0.5">{farm.name}</h3>
                        <p className="text-xs text-stone-600 mt-2 leading-relaxed">{farm.bio}</p>
                        <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
                          <span className="font-medium text-stone-700">Specialty:</span> {farm.specialty}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: ORGANIC PRODUCE (Clean URL: #/organic-produce) */}
        {currentRoute === 'organic-produce' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <nav className="text-xs text-stone-500 flex items-center gap-2">
              <button onClick={() => navigateTo('home')} className="hover:underline">Home</button>
              <span>/</span>
              <span className="text-stone-900 font-semibold">Local Organic Food &amp; Produce</span>
            </nav>

            <header className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
                100% Certified Organic Food &amp; Farm Fresh Produce Near Me
              </h1>
              <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                Browse our complete seasonal inventory of USDA &amp; Oregon Tilth certified organic fruits, greens, root vegetables, artisan stone-milled breads, and local pasture-raised eggs. All harvested from family growers within 100 miles of Portland, OR.
              </p>
            </header>

            <ProductCatalog
              products={PRODUCTS}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={(p) => handleAddToCart(p, 1)}
            />
          </div>
        )}

        {/* VIEW 3: FARM CSA BOXES (Clean URL: #/farm-boxes) */}
        {currentRoute === 'farm-boxes' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <nav className="text-xs text-stone-500 flex items-center gap-2">
              <button onClick={() => navigateTo('home')} className="hover:underline">Home</button>
              <span>/</span>
              <span className="text-stone-900 font-semibold">Farm Subscription Bounty Boxes</span>
            </nav>

            <header className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Community Supported Agriculture (CSA)
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
                Weekly Local Organic Produce Boxes in Portland &amp; Pacific NW
              </h1>
              <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                Enjoy curated seasonal organic food harvested the morning of delivery. No commitments—pause, cancel, or customize your box contents anytime.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Box Option 1 */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Small Household</span>
                  <h3 className="font-serif font-bold text-xl text-stone-900 mt-1">Couples Harvest Basket</h3>
                  <div className="text-3xl font-serif font-bold text-stone-900 mt-2">$24.99 <span className="text-xs font-sans text-stone-500 font-normal">/ week</span></div>
                  <p className="text-xs text-stone-600 mt-3">
                    Perfect for 1-2 people. Contains 7-9 essentials including heirloom roots, seasonal salad greens, and weekly orchard fruit.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-stone-700 border-t border-stone-100 pt-4">
                    <li className="flex items-center gap-2">✓ 7–9 Certified Organic produce items</li>
                    <li className="flex items-center gap-2">✓ Weekly recipe pairings from local chefs</li>
                    <li className="flex items-center gap-2">✓ Free Belmont pickup or $4.99 delivery</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const boxProd = PRODUCTS.find((p) => p.id === 'family-harvest-csa-box') || PRODUCTS[0];
                    handleAddToCart(boxProd, 1);
                    setIsCartOpen(true);
                  }}
                  className="mt-6 w-full py-3 bg-stone-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Subscribe Couples Box
                </button>
              </div>

              {/* Box Option 2 - Most Popular */}
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-700 shadow-xl relative flex flex-col justify-between">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Family Favorite</span>
                  <h3 className="font-serif font-bold text-xl text-stone-900 mt-1">Full Harvest Bounty Box</h3>
                  <div className="text-3xl font-serif font-bold text-emerald-900 mt-2">$34.99 <span className="text-xs font-sans text-stone-500 font-normal">/ week</span></div>
                  <p className="text-xs text-stone-600 mt-3">
                    Abundant weekly farm share for 3-5 people. 12-14 items: crisp leafy greens, heirloom carrots, mushrooms, berries, and culinary herbs.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-stone-700 border-t border-stone-100 pt-4">
                    <li className="flex items-center gap-2">✓ 12–14 Certified Organic farm items</li>
                    <li className="flex items-center gap-2">✓ Free weekly artisan bread or honey sample</li>
                    <li className="flex items-center gap-2">✓ Free delivery across Portland Metro</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const boxProd = PRODUCTS.find((p) => p.id === 'family-harvest-csa-box') || PRODUCTS[0];
                    handleAddToCart(boxProd, 1);
                    setIsCartOpen(true);
                  }}
                  className="mt-6 w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Order Harvest Bounty Box
                </button>
              </div>

              {/* Box Option 3 */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Gourmet Feast</span>
                  <h3 className="font-serif font-bold text-xl text-stone-900 mt-1">Artisan &amp; Farm Deluxe Box</h3>
                  <div className="text-3xl font-serif font-bold text-stone-900 mt-2">$49.99 <span className="text-xs font-sans text-stone-500 font-normal">/ week</span></div>
                  <p className="text-xs text-stone-600 mt-3">
                    Includes the complete produce harvest PLUS pasture-raised eggs, wood-fired spelt sourdough, and raw wildflower honey.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-stone-700 border-t border-stone-100 pt-4">
                    <li className="flex items-center gap-2">✓ Full organic vegetable &amp; fruit bounty</li>
                    <li className="flex items-center gap-2">✓ Dozen pasture eggs + artisan sourdough</li>
                    <li className="flex items-center gap-2">✓ Priority morning delivery slot</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const boxProd = PRODUCTS.find((p) => p.id === 'family-harvest-csa-box') || PRODUCTS[0];
                    handleAddToCart(boxProd, 1);
                    setIsCartOpen(true);
                  }}
                  className="mt-6 w-full py-3 bg-stone-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Subscribe Deluxe Box
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: LOCAL FARMERS (Clean URL: #/local-farmers) */}
        {currentRoute === 'local-farmers' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <nav className="text-xs text-stone-500 flex items-center gap-2">
              <button onClick={() => navigateTo('home')} className="hover:underline">Home</button>
              <span>/</span>
              <span className="text-stone-900 font-semibold">Local Oregon Farm Partners</span>
            </nav>

            <header className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
                Local Organic Farmers &amp; Sustainable Agriculture in Oregon
              </h1>
              <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                Meet the stewards behind our certified organic food. By cutting out global industrial distributors, EarthHarvest pays our local growers fair-market compensation while bringing you freshly harvested food with zero carbon miles.
              </p>
            </header>

            <div className="space-y-8">
              {LOCAL_FARMS.map((farm, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-5 relative min-h-[260px]">
                    <img
                      src={farm.image}
                      alt={`${farm.name} organic farming Portland Oregon`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-emerald-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Certified Since {farm.certifiedSince}
                    </div>
                  </div>
                  <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                        {farm.location} • {farm.distance}
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                        {farm.name}
                      </h2>
                      <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                        {farm.bio}
                      </p>
                      <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
                        <span className="font-bold text-stone-800 block mb-1">Key Organic Crops:</span>
                        <span className="text-stone-600">{farm.specialty}</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500">Inspected annually by Oregon Tilth</span>
                      <button
                        onClick={() => navigateTo('organic-produce')}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                      >
                        Shop produce from this farm →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: REVIEWS (Clean URL: #/reviews) */}
        {currentRoute === 'reviews' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <nav className="text-xs text-stone-500 flex items-center gap-2">
              <button onClick={() => navigateTo('home')} className="hover:underline">Home</button>
              <span>/</span>
              <span className="text-stone-900 font-semibold">Local Customer Reviews</span>
            </nav>

            <header className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold text-xl">★★★★★</span>
                <span className="text-stone-900 font-serif font-bold text-xl">4.9 out of 5 Rating</span>
                <span className="text-xs text-stone-500">(384 Google &amp; Local Reviews)</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
                What Portland Neighbors Say About EarthHarvest Organic Food
              </h1>
              <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                Verified reviews from families, chefs, and health practitioners in Hawthorne, Belmont, Sunnyside, and the broader Portland metro area.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REVIEWS.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-stone-900">{r.author}</h4>
                      <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{r.location}</span>
                      </div>
                    </div>
                    <div className="text-amber-500 text-sm">★★★★★</div>
                  </div>

                  <p className="text-stone-700 text-xs md:text-sm leading-relaxed">
                    “{r.comment}”
                  </p>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="text-emerald-700 font-semibold">✓ Verified Local Buyer</span>
                    <span>Favorite: {r.favoriteItem}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: CONTACT & GOOGLE MAPS (Clean URL: #/contact) */}
        {currentRoute === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <nav className="text-xs text-stone-500 flex items-center gap-2">
              <button onClick={() => navigateTo('home')} className="hover:underline">Home</button>
              <span>/</span>
              <span className="text-stone-900 font-semibold">Store Location &amp; Contact</span>
            </nav>

            <header className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Local Store Location &amp; Contact
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
                Visit EarthHarvest Organic Market on SE Belmont
              </h1>
              <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                Find driving directions, store operating hours, curbside pickup instructions, and interactive Google Maps routing for fresh organic food in Portland, OR.
              </p>
            </header>

            {/* Google Maps Main Embed Component */}
            <GoogleMapsSection apiKey={apiKey} />

            {/* Contact Details & Inquiry Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Local Store NAP (Name, Address, Phone)
                </h3>
                
                <div className="space-y-4 text-xs text-stone-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block text-sm">Physical Address:</strong>
                      <span>EarthHarvest Organic Food &amp; Farm Market</span><br />
                      <span>1420 SE Belmont St</span><br />
                      <span>Portland, OR 97214 (Central Eastside District)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block text-sm">Customer Support &amp; Phone Orders:</strong>
                      <span>(503) 555-0198</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block text-sm">Email Inquiries:</strong>
                      <span>support@earthharvest-organic.local</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block text-sm">Operating Hours:</strong>
                      <span>Mon - Sat: 7:30 AM – 8:00 PM</span><br />
                      <span>Sunday: 8:30 AM – 6:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900">
                  <strong>Parking Note:</strong> Free 45-minute parking in our private rear lot off 14th Ave, plus 4 Level-2 EV charging stalls.
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Send a Message to Our Farm Team
                </h3>
                <p className="text-xs text-stone-500">
                  Questions about local farm availability, wholesale orders, or custom CSA boxes? Drop us a note!
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Thank you! Your message has been sent to our Belmont market team.");
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Elena Vance"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="elena@example.com"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 text-stone-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Local Topic / Inquiries</label>
                    <select className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 text-stone-800">
                      <option>Farm Bounty Box Subscription Inquiry</option>
                      <option>Same-day Curbside Pickup Question</option>
                      <option>Wholesale &amp; Restaurant Produce Sourcing</option>
                      <option>Local Organic Farmer Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your note here..."
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 text-stone-800"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-emerald-950/20"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER: Optimized with Local SEO Keywords, Geo-Data, and XML Sitemap Links */}
      <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Store Bio */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
                  <Leaf className="w-5 h-5 text-emerald-200" />
                </div>
                <span className="font-serif font-bold text-lg text-white">EarthHarvest Organic</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Portland's premier independent organic food market and CSA subscription hub. Dedicated to pesticide-free soil health, local family farmers, and transparent nutrition.
              </p>
              <div className="text-[11px] text-stone-400">
                Oregon Tilth Certified Organic Retailer #OR-97214
              </div>
            </div>

            {/* Column 2: SEO URL Internal Pages */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
                Local Organic Pages
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button onClick={() => navigateTo('organic-produce')} className="hover:text-emerald-400 transition-colors">
                    Organic Produce Catalog
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('farm-boxes')} className="hover:text-emerald-400 transition-colors">
                    Weekly Farm CSA Bounty Boxes
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('local-farmers')} className="hover:text-emerald-400 transition-colors">
                    Pacific NW Farmer Directory
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('reviews')} className="hover:text-emerald-400 transition-colors">
                    Portland Verified Customer Reviews
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('contact')} className="hover:text-emerald-400 transition-colors">
                    Google Maps Store &amp; Curbside Pickup
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Local Search Keywords Footprint */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
                Local Search Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-stone-400">
                <span className="bg-stone-900 px-2 py-1 rounded">organic food near me</span>
                <span className="bg-stone-900 px-2 py-1 rounded">fresh organic produce Portland</span>
                <span className="bg-stone-900 px-2 py-1 rounded">Belmont organic market</span>
                <span className="bg-stone-900 px-2 py-1 rounded">local farm delivery Oregon</span>
                <span className="bg-stone-900 px-2 py-1 rounded">pesticide free vegetables</span>
                <span className="bg-stone-900 px-2 py-1 rounded">Sauvie Island produce</span>
                <span className="bg-stone-900 px-2 py-1 rounded">pasture eggs SE Portland</span>
              </div>
            </div>

            {/* Column 4: Sitemaps, Indexing & Technical SEO */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
                Indexing &amp; Sitemaps
              </h4>
              <p className="text-xs text-stone-400">
                Crawl-friendly sitemaps compliant with Google Search Console &amp; Schema.org standards.
              </p>
              <div className="space-y-2">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View XML Sitemap (/sitemap.xml)
                </a>
                <br />
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View robots.txt
                </a>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsSeoModalOpen(true)}
                  className="w-full py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  Open SEO Audit Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & NAP Verification */}
          <div className="pt-8 border-t border-stone-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <div>
              © 2026 EarthHarvest Organic Food &amp; Farm Market. All rights reserved. 1420 SE Belmont St, Portland, OR 97214 • (503) 555-0198
            </div>
            <div className="flex items-center gap-4">
              <span>Fast Page Load: 0.4s FCP</span>
              <span>•</span>
              <span>100% Mobile Responsive</span>
              <span>•</span>
              <span>Valid Schema.org JSON-LD</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={() => setCart([])}
      />

      <SeoDashboardModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
      />
    </div>
  );
}
