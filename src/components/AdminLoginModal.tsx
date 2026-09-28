import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, AlertCircle, ArrowRight, X, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { adminLogin } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = adminLogin(password);
    if (ok) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleQuickLogin = () => {
    adminLogin('admin123');
    setError(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              Admin &amp; CMS Login
            </h3>
            <p className="text-xs text-stone-500">
              Access the website builder dashboard to edit products, prices, store NAP, Google Maps coordinates, orders, and local SEO.
            </p>
          </div>

          {/* Quick Demo Login Option */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/80 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Quick Admin Access
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 font-semibold">
                pass: admin123
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Click below to immediately log in as the site administrator with full editing privileges.
            </p>
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>Instant 1-Click Demo Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-stone-400 text-xs uppercase font-medium">Or enter password</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Manual Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="Enter admin password..."
                  className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border rounded-xl text-xs text-stone-900 focus:outline-none transition-colors ${
                    error ? 'border-rose-400 bg-rose-50/50' : 'border-stone-200 focus:border-emerald-600'
                  }`}
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Incorrect password. Try <code className="font-bold">admin123</code> or use Instant Login.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-stone-900/10 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Enter Admin Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
