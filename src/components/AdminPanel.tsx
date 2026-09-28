import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, FarmPartner, Review, StoreSettings, Order } from '../types/store';
import { 
  Package, Store, Users, MessageSquare, ShoppingCart, Search, Plus, 
  Trash2, Edit3, Check, X, Download, Upload, RotateCcw, Eye, ArrowLeft, 
  MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles, AlertCircle, FileCode, 
  ExternalLink, Copy, CheckCircle2, ChevronRight, Filter
} from 'lucide-react';

interface AdminPanelProps {
  onBackToSite: () => void;
  onOpenProductDetail: (product: Product) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToSite,
  onOpenProductDetail,
}) => {
  const {
    products,
    storeSettings,
    farms,
    reviews,
    orders,
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
    updateOrderStatus,
    deleteOrder,
    resetAllData,
    exportData,
    importData,
    adminLogout,
  } = useStore();

  type TabType = 'products' | 'store_settings' | 'farms' | 'reviews' | 'orders' | 'seo_sitemap' | 'backup';
  const [activeTab, setActiveTab] = useState<TabType>('products');

  // Search & Filter in Products Tab
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  // Editing state for Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state for editing/adding Product
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Vegetables',
    price: 3.99,
    unit: 'bunch',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    farm: 'Columbia Valley Organic Orchards',
    origin: 'Hood River, OR (52 miles away)',
    isSeasonal: true,
    certifiedOrganic: true,
    calories: '45 kcal / 100g',
    harvestedDate: 'Harvested yesterday morning',
    description: '',
    rating: 5.0,
    reviewsCount: 12,
    localKeywords: ['organic produce Portland', 'local vegetables'],
  });
  const [keywordsInput, setKeywordsInput] = useState('');

  // Editing state for Farm
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [editingFarmIndex, setEditingFarmIndex] = useState<number | null>(null);
  const [farmForm, setFarmForm] = useState<FarmPartner>({
    name: '',
    location: '',
    distance: '',
    specialty: '',
    certifiedSince: 2010,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    bio: '',
  });

  // Editing state for Review
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewForm, setReviewForm] = useState({
    author: '',
    location: '',
    rating: 5,
    comment: '',
    verifiedBuyer: true,
    favoriteItem: '',
  });

  // Settings form local state (synchronized on change)
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(storeSettings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Toast / notification message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Product Modal (for Add or Edit)
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Vegetables',
      price: 4.99,
      unit: 'bunch',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      farm: 'Sauvie Island Organic Family Farm',
      origin: 'Sauvie Island, OR (14 miles away)',
      isSeasonal: true,
      certifiedOrganic: true,
      calories: '45 kcal / 100g',
      harvestedDate: 'Harvested dawn today',
      description: 'Hand-picked fresh organic produce with zero chemical sprays.',
      rating: 5.0,
      reviewsCount: 1,
      localKeywords: ['fresh organic food Portland', 'local produce near me'],
    });
    setKeywordsInput('fresh organic food Portland, local produce near me');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      unit: prod.unit,
      image: prod.image,
      farm: prod.farm,
      origin: prod.origin,
      isSeasonal: prod.isSeasonal,
      certifiedOrganic: prod.certifiedOrganic,
      calories: prod.calories,
      harvestedDate: prod.harvestedDate,
      description: prod.description,
      rating: prod.rating,
      reviewsCount: prod.reviewsCount,
      localKeywords: prod.localKeywords || [],
    });
    setKeywordsInput(prod.localKeywords ? prod.localKeywords.join(', ') : '');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedKeywords = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const payload = {
      ...productForm,
      localKeywords: parsedKeywords.length > 0 ? parsedKeywords : ['organic food'],
    };

    if (editingProduct) {
      updateProduct({
        ...payload,
        id: editingProduct.id,
      });
      showToast(`Updated product "${payload.name}" successfully!`);
    } else {
      addProduct(payload);
      showToast(`Added new product "${payload.name}" to inventory!`);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from store?`)) {
      deleteProduct(id);
      showToast(`Deleted "${name}"`);
    }
  };

  // Farm Add/Edit
  const handleOpenAddFarm = () => {
    setEditingFarmIndex(null);
    setFarmForm({
      name: '',
      location: '',
      distance: '',
      specialty: '',
      certifiedSince: 2012,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      bio: '',
    });
    setIsFarmModalOpen(true);
  };

  const handleOpenEditFarm = (index: number) => {
    setEditingFarmIndex(index);
    setFarmForm(farms[index]);
    setIsFarmModalOpen(true);
  };

  const handleSaveFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFarmIndex !== null) {
      updateFarm(editingFarmIndex, farmForm);
      showToast(`Updated farm "${farmForm.name}"!`);
    } else {
      addFarm(farmForm);
      showToast(`Added new farm partner "${farmForm.name}"!`);
    }
    setIsFarmModalOpen(false);
  };

  // Review Add/Edit
  const handleOpenAddReview = () => {
    setEditingReview(null);
    setReviewForm({
      author: '',
      location: 'Portland, OR',
      rating: 5,
      comment: '',
      verifiedBuyer: true,
      favoriteItem: products[0]?.name || 'Weekly Harvest Bounty Box',
    });
    setIsReviewModalOpen(true);
  };

  const handleOpenEditReview = (rev: Review) => {
    setEditingReview(rev);
    setReviewForm({
      author: rev.author,
      location: rev.location,
      rating: rev.rating,
      comment: rev.comment,
      verifiedBuyer: rev.verifiedBuyer,
      favoriteItem: rev.favoriteItem,
    });
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      updateReview({
        ...editingReview,
        ...reviewForm,
      });
      showToast('Updated customer review!');
    } else {
      addReview(reviewForm);
      showToast('Added new customer review!');
    }
    setIsReviewModalOpen(false);
  };

  // Store Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(settingsForm);
    setSettingsSavedMessage(true);
    showToast('Store settings & Google Maps configuration saved!');
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  // Export / Import
  const handleExportBackup = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earthharvest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Backup JSON exported successfully!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importData(content);
        if (ok) {
          showToast('Data restored successfully from backup!');
        } else {
          alert('Invalid backup JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Dynamic XML Sitemap Generator
  const generatedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://earthharvest-organic.local/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://earthharvest-organic.local/#/organic-produce</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://earthharvest-organic.local/#/farm-boxes</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://earthharvest-organic.local/#/local-farmers</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://earthharvest-organic.local/#/reviews</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://earthharvest-organic.local/#/contact</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${products.map((p) => `  <url>
    <loc>https://earthharvest-organic.local/#/${p.id}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${p.image.replace(/&/g, '&amp;')}</image:loc>
      <image:title>${p.name.replace(/&/g, '&amp;')}</image:title>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.farm.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.origin.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg text-white leading-tight">
                  Admin CMS &amp; Site Builder
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Editing
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Editing: <span className="text-stone-200">{storeSettings.storeName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-stone-700"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>View Live Website</span>
            </button>

            <button
              onClick={() => {
                adminLogout();
                onBackToSite();
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold transition-colors border border-rose-800/40"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 py-2 text-xs font-semibold border-t border-stone-800">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Organic Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('store_settings')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'store_settings'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Store &amp; Google Maps</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('farms')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'farms'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Local Farmers ({farms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'reviews'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('seo_sitemap')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'seo_sitemap'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>SEO &amp; Dynamic Sitemap</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'backup'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Backup &amp; Reset</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============================================================== */}
        {/* TAB 1: PRODUCTS CMS */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header & Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Organic Food &amp; Farm Fresh Catalog Management
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Add, edit, or delete items. Changes update the public store, SEO schema, and search filters in real time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product or farm..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 text-stone-800"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Farm Boxes">Farm Boxes</option>
                  <option value="Dairy & Artisan">Dairy &amp; Artisan</option>
                  <option value="Pantry & Grains">Pantry &amp; Grains</option>
                </select>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Organic Food</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-stone-100">
                  <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price / Unit</th>
                      <th className="p-4">Farm &amp; Origin</th>
                      <th className="p-4">Certifications</th>
                      <th className="p-4">Keywords</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <div className="font-serif font-bold text-stone-900 text-sm">{p.name}</div>
                              <div className="text-[11px] text-stone-500 line-clamp-1">{p.description}</div>
                              <span className="text-[10px] text-emerald-700 font-medium">★ {p.rating} ({p.reviewsCount} reviews)</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-semibold text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-stone-900 text-sm font-serif">
                            ${p.price.toFixed(2)}
                          </span>
                          <span className="text-stone-500 block text-[11px]">/ {p.unit}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-stone-900">{p.farm}</div>
                          <div className="text-[11px] text-stone-500">{p.origin}</div>
                          <div className="text-[10px] text-emerald-700">{p.harvestedDate}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {p.certifiedOrganic && (
                              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                USDA Organic
                              </span>
                            )}
                            {p.isSeasonal && (
                              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold text-[10px]">
                                Seasonal
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {p.localKeywords?.slice(0, 2).map((k, i) => (
                              <span key={i} className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                                #{k}
                              </span>
                            ))}
                            {(p.localKeywords?.length || 0) > 2 && (
                              <span className="text-[10px] text-stone-400">+{p.localKeywords.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onOpenProductDetail(p)}
                              title="Preview detail modal"
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              title="Edit product"
                              className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              title="Delete product"
                              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: STORE SETTINGS & GOOGLE MAPS CMS */}
        {/* ============================================================== */}
        {activeTab === 'store_settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-900">
                    Store Identity, Local NAP &amp; Google Maps Coordinates
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Updates physical location, phone number, hours, announcement bar, and interactive map marker position.
                  </p>
                </div>
                {settingsSavedMessage && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved Live!
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Store Basics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Store Business Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.storeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tagline / Brand Subtitle
                    </label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>
                </div>

                {/* Announcement Bar & Hero Texts */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    Announcement Banner &amp; Homepage Headlines
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Top Announcement Bar Message
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Hero Main Headline
                      </label>
                      <input
                        type="text"
                        value={settingsForm.heroHeadline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Hero Highlight Word (Green Italics)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.heroHighlight}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroHighlight: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Hero Paragraph Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.heroSubtitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>
                </div>

                {/* NAP & Google Maps Coordinates */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    Physical Store Address &amp; Google Maps Geocoding
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        City, State, Zip
                      </label>
                      <input
                        type="text"
                        value={settingsForm.cityStateZip}
                        onChange={(e) => setSettingsForm({ ...settingsForm, cityStateZip: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Google Map Latitude (lat)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={settingsForm.lat}
                        onChange={(e) => setSettingsForm({ ...settingsForm, lat: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Google Map Longitude (lng)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={settingsForm.lng}
                        onChange={(e) => setSettingsForm({ ...settingsForm, lng: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Weekday &amp; Saturday Hours
                      </label>
                      <input
                        type="text"
                        value={settingsForm.hoursWeekday}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hoursWeekday: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Sunday Hours
                      </label>
                      <input
                        type="text"
                        value={settingsForm.hoursSunday}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hoursSunday: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Store Settings &amp; Map Coordinates</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ORDERS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Customer Organic Produce Orders
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Manage curbside pickup and local delivery fulfillment statuses.
                </p>
              </div>
              <div className="text-xs font-semibold text-stone-600 bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200">
                Total Orders Received: <strong className="text-emerald-800">{orders.length}</strong>
              </div>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-500">
                  No orders placed yet. Place a test order through the shopping cart!
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-stone-900">{order.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.deliveryType === 'pickup' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.deliveryType === 'pickup' ? 'Belmont Curbside' : 'Local Delivery'}
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 block mt-0.5">
                          Placed on: {order.createdAt}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-stone-500">Status:</label>
                        <select
                          value={order.status}
                          onChange={(e) => {
                            updateOrderStatus(order.id, e.target.value as Order['status']);
                            showToast(`Updated ${order.id} status to ${e.target.value}`);
                          }}
                          className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none ${
                            order.status === 'Completed'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : order.status === 'Ready for Pickup' || order.status === 'Out for Delivery'
                              ? 'bg-amber-50 border-amber-300 text-amber-900'
                              : 'bg-stone-50 border-stone-300 text-stone-800'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Prepping">Prepping in Store</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete order ${order.id}?`)) {
                              deleteOrder(order.id);
                              showToast(`Deleted order ${order.id}`);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong className="text-stone-700 block mb-1">Customer Details:</strong>
                        <div className="text-stone-900 font-semibold">{order.customerName}</div>
                        {order.customerEmail && <div className="text-stone-500">{order.customerEmail}</div>}
                        {order.customerPhone && <div className="text-stone-500">{order.customerPhone}</div>}
                        {order.deliveryAddress && (
                          <div className="text-stone-600 mt-1 italic">
                            Fulfillment: {order.deliveryAddress}
                          </div>
                        )}
                      </div>

                      <div>
                        <strong className="text-stone-700 block mb-1">Items Ordered:</strong>
                        <ul className="space-y-1">
                          {order.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between text-stone-700">
                              <span>{it.quantity}x {it.productName}</span>
                              <span className="font-semibold text-stone-900">
                                ${(it.price * it.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 pt-2 border-t border-stone-100 flex justify-between font-bold text-stone-900 text-sm">
                          <span>Total Amount:</span>
                          <span className="font-serif text-emerald-800">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: LOCAL FARMERS CMS */}
        {/* ============================================================== */}
        {activeTab === 'farms' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Local Farm Partners &amp; Growers
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Manage the local family farms showcased across the site and provenance tags.
                </p>
              </div>
              <button
                onClick={handleOpenAddFarm}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Farm Partner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((farm, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={farm.image} alt={farm.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-emerald-300 text-xs px-2.5 py-1 rounded-full font-medium">
                        {farm.distance}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="text-xs font-semibold text-emerald-700">{farm.location}</div>
                      <h3 className="font-serif font-bold text-lg text-stone-900 mt-0.5">{farm.name}</h3>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">{farm.bio}</p>
                      <div className="mt-3 text-xs text-stone-500">
                        <span className="font-semibold text-stone-800">Specialty:</span> {farm.specialty}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-400">Since {farm.certifiedSince}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditFarm(idx)}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete farm partner "${farm.name}"?`)) {
                            deleteFarm(idx);
                            showToast(`Deleted ${farm.name}`);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: REVIEWS CMS */}
        {/* ============================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Customer Testimonials &amp; Local Reviews
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Manage social proof, Google Maps ratings, and verified customer badges.
                </p>
              </div>
              <button
                onClick={handleOpenAddReview}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-stone-900">{r.author}</h4>
                      <span className="text-xs text-stone-500">{r.location} • {r.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      {'★'.repeat(r.rating)}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    “{r.comment}”
                  </p>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-medium">Favorite: {r.favoriteItem}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditReview(r)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete review?')) {
                            deleteReview(r.id);
                            showToast('Deleted review');
                          }
                        }}
                        className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: SEO & DYNAMIC SITEMAP */}
        {/* ============================================================== */}
        {activeTab === 'seo_sitemap' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Dynamic XML Sitemap &amp; Local SEO Metadata
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  The sitemap below dynamically recalculates when you add or edit products, ensuring seamless crawling by Googlebot.
                </p>
              </div>

              {/* Meta tags customization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Global Page Title &lt;title&gt;
                  </label>
                  <input
                    type="text"
                    value={storeSettings.metaTitle}
                    onChange={(e) => updateStoreSettings({ metaTitle: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    value={storeSettings.metaDescription}
                    onChange={(e) => updateStoreSettings({ metaDescription: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* XML Sitemap Viewer */}
              <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-xs text-white">
                      Live XML Sitemap ({6 + products.length} URLs indexed)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedSitemap);
                        showToast('Copied live XML sitemap to clipboard!');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Sitemap</span>
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([generatedSitemap], { type: 'application/xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'sitemap.xml';
                        a.click();
                        showToast('Downloaded sitemap.xml!');
                      }}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download XML</span>
                    </button>
                  </div>
                </div>

                <pre className="bg-stone-950 p-4 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-80 border border-stone-800">
                  {generatedSitemap}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: BACKUP & PRESETS */}
        {/* ============================================================== */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200 space-y-6">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Store Data Backup, Export &amp; Factory Reset
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Safely download all your customized products, store settings, farm growers, and customer orders to a JSON file.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Export Card */}
                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-col justify-between space-y-4">
                  <div>
                    <Download className="w-8 h-8 text-emerald-700 mb-2" />
                    <h3 className="font-serif font-bold text-stone-900 text-base">Export Store Data</h3>
                    <p className="text-xs text-stone-600 mt-1">
                      Download a complete snapshot of all products, prices, and settings.
                    </p>
                  </div>
                  <button
                    onClick={handleExportBackup}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-col justify-between space-y-4">
                  <div>
                    <Upload className="w-8 h-8 text-emerald-700 mb-2" />
                    <h3 className="font-serif font-bold text-stone-900 text-base">Restore From File</h3>
                    <p className="text-xs text-stone-600 mt-1">
                      Load a previously saved JSON backup to replace or restore your catalog.
                    </p>
                  </div>
                  <label className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Upload JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Reset Card */}
                <div className="bg-rose-50/60 rounded-2xl p-6 border border-rose-200 flex flex-col justify-between space-y-4">
                  <div>
                    <RotateCcw className="w-8 h-8 text-rose-700 mb-2" />
                    <h3 className="font-serif font-bold text-stone-900 text-base">Factory Demo Reset</h3>
                    <p className="text-xs text-stone-600 mt-1">
                      Revert all products, prices, and settings back to original Portland organic store demo data.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure? This will reset all products and store settings to the initial demo values.")) {
                        resetAllData();
                        showToast("Reset all data to default demo state!");
                      }
                    }}
                    className="w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ============================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between z-10">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingProduct ? `Edit Organic Food: ${editingProduct.name}` : 'Add New Organic Food Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g., Organic Heritage Rainbow Carrots"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Product['category'] })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Farm Boxes">Farm Boxes</option>
                    <option value="Dairy & Artisan">Dairy &amp; Artisan</option>
                    <option value="Pantry & Grains">Pantry &amp; Grains</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Unit</label>
                    <input
                      type="text"
                      required
                      value={productForm.unit}
                      onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                      placeholder="bunch, 2 lb bag, loaf..."
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                  {productForm.image && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={productForm.image} alt="Preview" className="w-14 h-14 rounded-xl object-cover border" />
                      <span className="text-[11px] text-stone-500">Live Image Preview</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Farm / Grower Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.farm}
                    onChange={(e) => setProductForm({ ...productForm, farm: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Origin &amp; Distance</label>
                  <input
                    type="text"
                    required
                    value={productForm.origin}
                    onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                    placeholder="e.g. Hood River, OR (52 miles away)"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Harvest Timestamp</label>
                  <input
                    type="text"
                    value={productForm.harvestedDate}
                    onChange={(e) => setProductForm({ ...productForm, harvestedDate: e.target.value })}
                    placeholder="e.g. Harvested yesterday morning"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Calories / Nutrition</label>
                  <input
                    type="text"
                    value={productForm.calories}
                    onChange={(e) => setProductForm({ ...productForm, calories: e.target.value })}
                    placeholder="e.g. 45 kcal / 100g"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Local SEO Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                    placeholder="e.g. fresh carrots Portland, heirloom carrots local farm"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.certifiedOrganic}
                      onChange={(e) => setProductForm({ ...productForm, certifiedOrganic: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span>USDA Certified Organic</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isSeasonal}
                      onChange={(e) => setProductForm({ ...productForm, isSeasonal: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span>Peak Seasonal Item</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT FARM */}
      {/* ============================================================== */}
      {isFarmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingFarmIndex !== null ? 'Edit Farm Partner' : 'Add Local Farm Partner'}
              </h3>
              <button
                onClick={() => setIsFarmModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFarm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  required
                  value={farmForm.name}
                  onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={farmForm.location}
                    onChange={(e) => setFarmForm({ ...farmForm, location: e.target.value })}
                    placeholder="e.g. Sauvie Island, OR"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Distance</label>
                  <input
                    type="text"
                    required
                    value={farmForm.distance}
                    onChange={(e) => setFarmForm({ ...farmForm, distance: e.target.value })}
                    placeholder="e.g. 14 miles away"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Specialty Crops</label>
                <input
                  type="text"
                  required
                  value={farmForm.specialty}
                  onChange={(e) => setFarmForm({ ...farmForm, specialty: e.target.value })}
                  placeholder="e.g. Leafy greens, squash, herbs"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  required
                  value={farmForm.image}
                  onChange={(e) => setFarmForm({ ...farmForm, image: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Bio &amp; Stewardship</label>
                <textarea
                  rows={3}
                  required
                  value={farmForm.bio}
                  onChange={(e) => setFarmForm({ ...farmForm, bio: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFarmModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT REVIEW */}
      {/* ============================================================== */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingReview ? 'Edit Review' : 'Add Verified Customer Review'}
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.author}
                    onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Location / District</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.location}
                    onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                    placeholder="e.g. Hawthorne, Portland"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Star Rating (1-5)</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) || 5 })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Favorite Produce Item</label>
                  <input
                    type="text"
                    value={reviewForm.favoriteItem}
                    onChange={(e) => setReviewForm({ ...reviewForm, favoriteItem: e.target.value })}
                    placeholder="e.g. Heirloom Carrots"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Review Comment</label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
