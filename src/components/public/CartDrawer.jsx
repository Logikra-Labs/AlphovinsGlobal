import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const totalItems = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-[#FEFAF3] border-l border-[#E8E0D0] shadow-2xl z-50 flex flex-col slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E0D0] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ECFDF5] border border-[rgba(16,185,129,0.2)] flex items-center justify-center text-[#10B981]">
              <ShoppingBag size={17} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0A0A0A] font-display">Your Cart</h2>
              <p className="text-xs text-[#9CA3AF]">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#E8E0D0] text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#F5F0E8] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-[#9CA3AF] py-20">
              <div className="w-20 h-20 rounded-full bg-[#F5F0E8] border border-[#E8E0D0] flex items-center justify-center">
                <ShoppingBag size={32} className="text-[#D1D5DB]" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-[#374151] font-display mb-1">Your cart is empty</p>
                <p className="text-sm">Add some bananas to get started 🍌</p>
              </div>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(16,185,129,0.3)] text-[#10B981] bg-[#ECFDF5] text-sm font-semibold font-display hover:bg-[#D1FAE5] transition-colors mt-2"
              >
                Browse Shop <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.purchaseType}`} className="flex gap-4 p-4 rounded-[18px] border border-[#E8E0D0] bg-white hover:border-[rgba(16,185,129,0.25)] transition-colors">
                {/* Emoji/Image */}
                <div className="w-16 h-16 rounded-2xl bg-[#F5F0E8] border border-[#E8E0D0] flex items-center justify-center text-3xl shrink-0">
                  {item.emoji || '🍌'}
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-[#0A0A0A] font-display text-sm truncate">{item.name}</h3>
                      <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-[#ECFDF5] text-[#10B981]">
                        {item.purchaseType === 'kg' ? 'Per kg' : 'Per Thar'}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.purchaseType)}
                      className="p-1.5 rounded-lg text-[#D1D5DB] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Qty Controls */}
                    <div className="flex items-center gap-2 bg-[#F5F0E8] rounded-xl p-1 border border-[#E8E0D0]">
                      <button
                        onClick={() => updateQuantity(item.id, item.purchaseType, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E8E0D0] hover:border-[rgba(16,185,129,0.3)] flex items-center justify-center text-[#374151] transition-all"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-bold text-[#0A0A0A] w-6 text-center font-display">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.purchaseType, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E8E0D0] hover:border-[rgba(16,185,129,0.3)] flex items-center justify-center text-[#374151] transition-all"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <p className="font-bold text-[#10B981] font-display">
                      {formatPrice ? formatPrice((item.purchaseType === 'kg' ? item.pricePerKg : item.pricePerThar) * item.quantity) : `₹${(item.purchaseType === 'kg' ? item.pricePerKg : item.pricePerThar) * item.quantity}`}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-5 py-5 border-t border-[#E8E0D0] bg-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Subtotal ({totalItems} items)</span>
              <span className="text-2xl font-extrabold text-[#0A0A0A] font-display">
                {formatPrice ? formatPrice(cartTotal) : `₹${cartTotal}`}
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] -mt-2">Shipping and taxes calculated at checkout</p>
            <button
              onClick={handleCheckout}
              className="btn-primary btn-shine w-full py-4 text-base"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <button
              onClick={() => setIsCartOpen(false)}
              className="btn-outline w-full py-3 text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
