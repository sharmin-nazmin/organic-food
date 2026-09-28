import React, { useState } from 'react';
import { Product } from '../data/organicFoodData';
import { ShoppingBag, X, Check, ArrowRight, ShieldCheck, Truck, MapPin } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { product: Product; quantity: number }[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'local_delivery'>('pickup');
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'local_delivery' ? (subtotal >= 40 ? 0 : 4.99) : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    setTimeout(() => {
      onClearCart();
      setIsOrdered(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-800" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Your Local Farm Fresh Box ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {isOrdered ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-2xl text-stone-900">Order Placed Successfully!</h4>
            <p className="text-sm text-stone-600 max-w-sm mx-auto">
              Thank you for supporting Oregon organic family farmers! Your order is being harvested and prepped for{' '}
              {deliveryType === 'pickup' ? 'curbside pickup at 1420 SE Belmont St' : 'same-day eco delivery'}.
            </p>
            <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-500 font-mono">
              Confirmation #EH-{Math.floor(100000 + Math.random() * 900000)}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-stone-500">
                <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-2" />
                <p className="text-sm">Your organic box is currently empty.</p>
                <button
                  onClick={onClose}
                  className="mt-3 text-xs font-semibold text-emerald-700 underline"
                >
                  Explore local organic produce
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-stone-100">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h5 className="text-xs font-serif font-bold text-stone-900 line-clamp-1">
                            {product.name}
                          </h5>
                          <span className="text-[11px] text-stone-500">
                            ${product.price.toFixed(2)} / {product.unit}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50 text-xs">
                          <button
                            onClick={() => onUpdateQuantity(product.id, -1)}
                            className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold"
                          >
                            −
                          </button>
                          <span className="px-2 py-1 font-semibold text-stone-900 min-w-6 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-bold text-stone-900 min-w-12 text-right">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pickup vs Delivery Selector */}
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Choose Fulfillment Method:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        deliveryType === 'pickup'
                          ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        Store Curbside
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">1420 SE Belmont (Free)</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('local_delivery')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        deliveryType === 'local_delivery'
                          ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                        <Truck className="w-3.5 h-3.5 text-emerald-700" />
                        Local Delivery
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        {subtotal >= 40 ? 'Free (over $40)' : '$4.99 flat rate'}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Subtotal Calculation */}
                <div className="bg-stone-50 rounded-2xl p-4 space-y-2 text-xs border border-stone-200/80">
                  <div className="flex justify-between text-stone-600">
                    <span>Produce Subtotal:</span>
                    <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Fulfillment ({deliveryType === 'pickup' ? 'Belmont Pickup' : 'Portland Metro'}):</span>
                    <span className="font-semibold text-stone-900">
                      {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total Amount:</span>
                    <span className="font-serif text-emerald-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Complete Order Button */}
                <form onSubmit={handleCheckout}>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Confirm Local Harvest Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>SNAP / EBT &amp; Major Credit Cards accepted at pickup</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
