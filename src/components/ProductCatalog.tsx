import React, { useState } from 'react';
import { Product } from '../data/organicFoodData';
import { Search, SlidersHorizontal, Check, ShoppingBag, Sparkles, MapPin, Leaf, Heart, Eye } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlySeasonal, setOnlySeasonal] = useState<boolean>(false);
  const [addedIds, setAddedIds] = useState<{ [id: string]: boolean }>({});

  const categories = ['All', 'Vegetables', 'Fruits', 'Farm Boxes', 'Dairy & Artisan', 'Pantry & Grains'];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.localKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSeasonal = !onlySeasonal || product.isSeasonal;

    return matchesCategory && matchesSearch && matchesSeasonal;
  });

  const handleAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p);
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1800);
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs & Local Filter Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-1">
              Local Pacific NW Harvest
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Browse Local Organic Food &amp; Farm Fresh Produce
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Zero synthetic pesticides, 100% certified organic, harvested within 100 miles of Portland.
            </p>
          </div>

          {/* Search Box with local keywords */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search local carrots, apples, CSA boxes..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-stone-800"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-stone-100">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700 select-none">
            <input
              type="checkbox"
              checked={onlySeasonal}
              onChange={(e) => setOnlySeasonal(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
            />
            <span>Show Only Peak Seasonal Harvest</span>
          </label>
        </div>
      </div>

      {/* Grid of Organic Produce */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isAdded = addedIds[product.id];
          return (
            <article
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={product.image}
                    alt={`${product.name} - fresh local organic produce Portland Oregon`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-800/90 backdrop-blur-md text-white shadow">
                      USDA Organic
                    </span>
                    {product.isSeasonal && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500 text-stone-950 shadow">
                        Peak Season
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-900/80 backdrop-blur-md text-stone-200 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {product.origin}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-emerald-700">{product.farm}</span>
                    <span>★ {product.rating} ({product.reviewsCount})</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <Leaf className="w-3.5 h-3.5" />
                      {product.harvestedDate}
                    </span>
                    <span>{product.calories}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Price & Add to Cart Action */}
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
                  <div>
                    <span className="text-2xl font-bold text-stone-900 font-serif">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-stone-500 block">/ {product.unit}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleAdd(product, e)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isAdded
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-stone-900 hover:bg-emerald-800 text-white shadow-md shadow-stone-900/10'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Box
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <p className="text-stone-500 text-base">No organic produce found matching your query.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOnlySeasonal(false);
            }}
            className="mt-3 text-xs font-semibold text-emerald-700 underline"
          >
            Clear filters and show all local items
          </button>
        </div>
      )}
    </div>
  );
};
