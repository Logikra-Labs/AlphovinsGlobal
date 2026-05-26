import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerProfile, saveCustomerProfile } from '../../services/customerService';
import { getCustomerOrders, cancelOrderAndRefund } from '../../services/paymentService';
import { downloadOrderInvoice } from '../../services/pdfService';
import { User, MapPin, Package, Clock, CheckCircle, Truck, LogOut, Loader2, XCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerAccount() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser?.uid) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    const [profileData, ordersData] = await Promise.all([
      getCustomerProfile(currentUser.uid),
      getCustomerOrders(currentUser.uid)
    ]);
    
    if (profileData) {
      setProfile(prev => ({ ...prev, ...profileData }));
    }
    setOrders(ordersData);
    setLoading(false);
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    const success = await saveCustomerProfile(currentUser.uid, profile);
    if (success) {
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to save profile. Try again.');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <Clock size={16} className="text-yellow-400" />;
      case 'Shipped': return <Truck size={16} className="text-blue-400" />;
      case 'Delivered': return <CheckCircle size={16} className="text-emerald-400" />;
      case 'Cancelled': return <XCircle size={16} className="text-red-400" />;
      default: return <Package size={16} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={48} className="text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0A0A0A] font-display mb-2">My Account</h1>
          <p className="text-[#6B7280]">{currentUser.email}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="btn-danger hover:bg-red-100 flex items-center gap-2"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'profile' 
                ? 'bg-[#10B981] text-white font-bold shadow-[0_4px_12px_rgba(16,185,129,0.2)]' 
                : 'text-[#6B7280] hover:bg-[#F5F0E8] hover:text-[#0A0A0A]'
            }`}
          >
            <User size={20} /> Profile Details
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'orders' 
                ? 'bg-[#10B981] text-white font-bold shadow-[0_4px_12px_rgba(16,185,129,0.2)]' 
                : 'text-[#6B7280] hover:bg-[#F5F0E8] hover:text-[#0A0A0A]'
            }`}
          >
            <Package size={20} /> Order History
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-[#E8E0D0] p-6 sm:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <h2 className="text-xl font-bold text-[#0A0A0A] font-display mb-6 flex items-center gap-2">
                <MapPin className="text-[#10B981]" /> Delivery Information
              </h2>

              {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm ${
                  message.includes('success') 
                    ? 'bg-emerald-50 text-[#10B981] border border-[rgba(16,185,129,0.2)]' 
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Full Name</label>
                    <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="input-field w-full" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} className="input-field w-full" placeholder="+91 9876543210" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#374151] mb-2">Full Delivery Address</label>
                    <textarea name="address" value={profile.address} onChange={handleProfileChange} className="input-field w-full min-h-[100px] py-3" placeholder="123 Street Name, Area..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">City</label>
                    <input type="text" name="city" value={profile.city} onChange={handleProfileChange} className="input-field w-full" placeholder="Chennai" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Pincode</label>
                    <input type="text" name="pincode" value={profile.pincode} onChange={handleProfileChange} className="input-field w-full" placeholder="600001" />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E0D0] flex justify-end">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="btn-primary btn-shine px-8"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#E8E0D0] p-12 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <Package size={48} className="mx-auto text-[#6B7280] mb-4" />
                  <p className="text-[#6B7280] mb-6">You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/shop')} className="btn-primary">Start Shopping</button>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl border border-[#E8E0D0] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:border-[rgba(16,185,129,0.35)] transition-all duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b border-[#E8E0D0]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#0A0A0A] text-lg font-display">Order #{order.id.slice(-6).toUpperCase()}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1 ${
                            order.orderStatus === 'Cancelled' 
                              ? 'bg-red-50 text-red-600 border border-red-200' 
                              : 'bg-[#ECFDF5] border border-[rgba(16,185,129,0.2)] text-[#10B981]'
                          }`}>
                            {getStatusIcon(order.orderStatus)} {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-sm text-[#6B7280]">{(order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt)).toLocaleString()}</p>
                      </div>
                      <div className="text-left sm:text-right flex flex-col sm:items-end gap-2">
                        <div>
                          <p className="text-sm text-[#6B7280]">Total Amount</p>
                          <p className="font-bold text-[#10B981] text-xl font-display">₹{order.totalAmount}</p>
                        </div>
                        {order.orderStatus === 'Processing' && (
                          <button 
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone and your payment will be refunded.')) {
                                const result = await cancelOrderAndRefund(order.id, order.paymentId);
                                if (result.success) {
                                  alert('Order cancelled and refund initiated successfully!');
                                  loadData();
                                } else {
                                  alert('Failed to cancel order: ' + result.error);
                                }
                              }
                            }}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}
                        {order.orderStatus !== 'Cancelled' && (
                          <button
                            onClick={() => downloadOrderInvoice(order)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[rgba(16,185,129,0.3)] text-[#10B981] hover:bg-[#ECFDF5] transition-colors"
                          >
                            <Download size={13} /> Invoice
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.cartItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-[#374151]">{item.name} <span className="text-[#6B7280]">x {item.quantity} {item.purchaseType}</span></span>
                          <span className="text-[#0A0A0A] font-medium">₹{(item.purchaseType === 'kg' ? item.pricePerKg : item.pricePerThar) * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
