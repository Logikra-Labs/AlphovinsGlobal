import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check, PackageOpen, BarChart3, FlaskConical } from 'lucide-react';
import { getAvailableProducts } from '../../services/productService';
import { useCurrency } from '../../context/CurrencyContext';

export default function Shop() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getAvailableProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product, type) => {
    addToCart(product, 1, type);
    const key = `${product.id}-${type}`;
    setAddedItems(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [key]: false })), 1500);
  };

  return (
    <div style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <div className="bg-[#F5F0E8] border-b border-[#E8E0D0] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto slide-up">
          <p className="section-label mb-3">Our Products</p>
          <h1 className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A] mb-4" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
            Fresh From Our <span className="gradient-text">Farms</span>
          </h1>
          <p className="text-lg text-[#374151] max-w-xl leading-[1.7]">
            Browse our selection of premium banana varieties. Available by the kilogram or by the entire bunch (thar).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-[#E8E0D0] border-t-[#10B981] animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[20px] border border-[#E8E0D0]">
            <PackageOpen size={56} className="mx-auto text-[#D1D5DB] mb-4" />
            <h2 className="text-2xl font-bold text-[#0A0A0A] font-display mb-2">No Products Available</h2>
            <p className="text-[#6B7280]">Check back later for fresh stock.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="card overflow-hidden group slide-up"
                style={{ animationDelay: `${(index % 6) * 80}ms` }}
              >
                {/* Product Image */}
                <div className="aspect-[4/3] bg-[#F5F0E8] flex items-center justify-center relative overflow-hidden">
                  <span className="text-8xl group-hover:scale-110 transition-transform duration-500">🍌</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-[#0A0A0A] font-display group-hover:text-[#10B981] transition-colors">{product.name}</h3>
                    {product.tamil && <p className="text-xs text-[#10B981] font-semibold mt-0.5">{product.tamil}</p>}
                  </div>
                  <p className="text-[#374151] text-sm mb-6 line-clamp-2 leading-relaxed min-h-[40px]">{product.desc}</p>

                  <div className="space-y-3">
                    {/* Buy by KG */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F0E8] border border-[#E8E0D0] hover:border-[rgba(16,185,129,0.3)] transition-colors">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-0.5">Price per kg</p>
                        <p className="font-bold text-[#0A0A0A] font-display">{formatPrice(product.pricePerKg)}</p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product, 'kg')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all font-display ${
                          addedItems[`${product.id}-kg`]
                            ? 'bg-[#ECFDF5] text-[#10B981] border border-[rgba(16,185,129,0.3)]'
                            : 'bg-[#10B981] hover:bg-[#059669] text-white shadow-[0_0_0_0_rgba(16,185,129,0)] hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                        }`}
                      >
                        {addedItems[`${product.id}-kg`] ? <Check size={15} /> : <ShoppingCart size={15} />}
                        {addedItems[`${product.id}-kg`] ? 'Added' : 'Add kg'}
                      </button>
                    </div>

                    {/* Buy by Thar */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F0E8] border border-[#E8E0D0] hover:border-[rgba(16,185,129,0.3)] transition-colors">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-0.5">Price per Thar (Bunch)</p>
                        <p className="font-bold text-[#0A0A0A] font-display">{formatPrice(product.pricePerThar)}</p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product, 'thar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all font-display ${
                          addedItems[`${product.id}-thar`]
                            ? 'bg-[#ECFDF5] text-[#10B981] border border-[rgba(16,185,129,0.3)]'
                            : 'bg-white hover:bg-[#F5F0E8] text-[#374151] border border-[#E8E0D0]'
                        }`}
                      >
                        {addedItems[`${product.id}-thar`] ? <Check size={15} /> : <ShoppingCart size={15} />}
                        {addedItems[`${product.id}-thar`] ? 'Added' : 'Add Thar'}
                      </button>
                    </div>

                    {/* B2B Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => navigate(`/contact?subject=Bulk Quote: ${product.name}`)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#ECFDF5] text-[#10B981] border border-[rgba(16,185,129,0.25)] hover:bg-[#D1FAE5] transition-all font-display"
                      >
                        <BarChart3 size={13} /> Bulk Quote
                      </button>
                      <button
                        onClick={() => navigate(`/contact?subject=Sample Request: ${product.name}`)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F5F0E8] text-[#374151] border border-[#E8E0D0] hover:bg-[#EBE6DE] transition-all font-display"
                      >
                        <FlaskConical size={13} /> Sample
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
