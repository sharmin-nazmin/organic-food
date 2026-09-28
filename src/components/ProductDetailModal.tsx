import React, { useState } from 'react';
import { Product } from '../data/organicFoodData';
import { 
  X, Check, ShoppingBag, MapPin, Leaf, ShieldCheck, Heart, 
  Calendar, Award, Truck, AlertCircle, Share2 
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/#/${product.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
          <img
            src={product.image}
            alt={`${product.name} - 100% certified organic food Portland Oregon`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-white shadow-md">
              USDA Organic Certified
            </span>
            {product.isSeasonal && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-stone-950 shadow-md">
                Seasonal Harvest
              </span>
            )}
          </div>
          <div className="absolute bottom-4 left-4 bg-stone-900/85 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{product.origin}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-semibold text-emerald-700 uppercase tracking-wider">
                {product.category} • {product.farm}
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                ★ {product.rating} ({product.reviewsCount} verified reviews)
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 leading-tight">
              {product.name}
            </h2>

            <p className="text-stone-600 text-sm mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Farm Provenance & Harvest Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/80 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Harvested</span>
              <span className="font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {product.harvestedDate}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Nutrition</span>
              <span className="font-semibold text-stone-800 block mt-0.5">
                {product.calories}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Delivery / Pickup</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                Same-Day Available
              </span>
            </div>
          </div>

          {/* SEO Local Keywords Tag Cloud */}
          <div>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
              Local SEO Indexing Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.localKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-100"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & Add to Cart Controls */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-serif font-bold text-stone-900">
                  ${(product.price * quantity).toFixed(2)}
                </span>
                <span className="text-xs text-stone-500">
                  (${product.price.toFixed(2)} / {product.unit})
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block">
                ✓ Free pickup at Belmont store or free delivery over $40
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-700 hover:bg-stone-200 font-bold text-sm"
                >
                  −
                </button>
                <span className="px-3 py-2 text-xs font-semibold text-stone-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-stone-700 hover:bg-stone-200 font-bold text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`px-6 py-3 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2 ${
                  isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-900 hover:bg-emerald-800 text-white shadow-lg shadow-stone-900/20'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Order!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Local Box
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                title="Share canonical SEO link"
                className="p-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          {copiedLink && (
            <p className="text-center text-xs text-emerald-700 font-medium">
              ✓ Canonical SEO product link copied to clipboard!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
