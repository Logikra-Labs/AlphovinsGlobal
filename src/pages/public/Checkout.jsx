import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, AlertCircle, ShoppingBag, ArrowLeft, XCircle, Download } from 'lucide-react';
import { initializePayment } from '../../services/paymentService';
import { downloadOrderInvoice } from '../../services/pdfService';
import { useAuth } from '../../context/AuthContext';
import { getCustomerProfile } from '../../services/customerService';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { isCustomer, currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    pincode: '',
  });

  React.useEffect(() => {
    if (isCustomer && currentUser?.uid) {
      getCustomerProfile(currentUser.uid).then(profile => {
        if (profile) {
          setFormData(prev => ({ ...prev, ...profile, email: currentUser.email }));
        }
      });
    }
  }, [isCustomer, currentUser]);
  const [processing, setProcessing] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState('');
  const [isCancelled, setIsCancelled] = useState(false);

  if (successId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-[#030f05] rounded-3xl border border-emerald-900/50 p-8 sm:p-12 text-center slide-up">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-400 mb-6">Thank you for your purchase. Your order is now being processed.</p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 max-w-sm mx-auto mb-8 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Transaction ID</span>
              <span className="text-green-300 font-mono text-sm font-bold">{successId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Customer</span>
              <span className="text-white text-sm">{successOrder?.customerDetails?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Total Paid</span>
              <span className="text-green-400 font-bold text-lg">&#x20B9;{successOrder?.totalAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Order Status</span>
              <span className="text-yellow-400 text-sm font-medium">Processing</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {successOrder && (
              <button
                onClick={() => downloadOrderInvoice(successOrder)}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold bg-green-500 hover:bg-green-400 text-[#020a04] shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
              >
                <Download size={18} /> Download Invoice (PDF)
              </button>
            )}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors"
            >
              Return to Home
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">You can also download your invoice anytime from your <button onClick={() => navigate('/account')} className="text-green-400 underline">My Account</button> page.</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="text-green-900/50 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some bananas before checking out!</p>
        <button onClick={() => navigate('/shop')} className="btn-primary">Go to Shop</button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    setIsCancelled(false);

    // Call our simulated payment service
    initializePayment(
      cartTotal,
      formData,
      cartItems,
      currentUser?.uid,
      (paymentId) => {
        const completedOrder = {
          id: paymentId,
          paymentId: paymentId,
          customerDetails: formData,
          cartItems: cartItems,
          totalAmount: cartTotal,
          orderStatus: 'Processing',
          createdAt: new Date().toISOString(),
        };
        setProcessing(false);
        setSuccessOrder(completedOrder);
        setSuccessId(paymentId);
        clearCart();
        // Auto-trigger invoice download after 1 second
        setTimeout(() => downloadOrderInvoice(completedOrder), 1000);
      },
      (errMessage) => {
        setProcessing(false);
        const cancelled = errMessage.toLowerCase().includes('cancel');
        setIsCancelled(cancelled);
        setError(errMessage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    );
  };

  if (!isCustomer) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/shop')}
        className="flex items-center gap-2 text-green-500 hover:text-green-400 mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-2 bg-[#030f05] rounded-3xl border border-green-900/30 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Delivery Details</h2>
          
          {error && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 mb-6 ${
              isCancelled 
                ? 'bg-orange-900/20 border-orange-500/30 text-orange-400' 
                : 'bg-red-900/20 border-red-500/30 text-red-400'
            }`}>
              {isCancelled ? <XCircle size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold text-sm mb-1">{isCancelled ? 'Payment Cancelled' : 'Payment Failed'}</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handlePay} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-field w-full" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field w-full" placeholder="+91 9876543210" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field w-full" placeholder="john@example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Delivery Address</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} className="input-field w-full min-h-[100px] py-3" placeholder="123 Street Name, Area..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="input-field w-full" placeholder="Chennai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Pincode</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="input-field w-full" placeholder="600001" />
              </div>
            </div>

            <div className="pt-6 border-t border-green-900/30">
              <button 
                type="submit" 
                disabled={processing}
                className="w-full py-4 rounded-xl font-bold bg-green-500 hover:bg-green-400 text-[#020a04] shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <div className="w-6 h-6 border-2 border-[#020a04]/20 border-t-[#020a04] rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay ₹{cartTotal} Securely (Razorpay)
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-[#030f05] rounded-3xl border border-green-900/30 p-6 sm:p-8 sticky top-24">
          <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.purchaseType}`} className="flex justify-between items-start">
                <div>
                  <p className="text-green-100 font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} x {item.purchaseType === 'kg' ? 'Kg' : 'Thar'}</p>
                </div>
                <p className="text-green-300 font-medium">
                  ₹{(item.purchaseType === 'kg' ? item.pricePerKg : item.pricePerThar) * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-green-900/30 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-green-900/30">
              <span className="font-bold text-white">Total</span>
              <span className="font-bold text-xl bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                ₹{cartTotal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
