import React, { useState, useEffect } from 'react';
import { getOnlineOrders, updateOrderStatus, cancelOrderAndRefund } from '../../services/paymentService';
import { ShoppingBag, Search, CheckCircle, Package, Truck, Clock, XCircle, ChevronDown, ChevronUp, User, MapPin, Mail, Phone } from 'lucide-react';

export default function OnlineOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOnlineOrders();
    // Sort orders by newest first
    const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setOrders(sortedData);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Delivered': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <Clock size={16} />;
      case 'Shipped': return <Truck size={16} />;
      case 'Delivered': return <CheckCircle size={16} />;
      case 'Cancelled': return <XCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  // Compute stats
  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.orderStatus === 'Processing').length,
    shipped: orders.filter(o => o.orderStatus === 'Shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
  };

  const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customerDetails?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerDetails?.phone?.includes(searchTerm);
    
    const matchesTab = activeTab === 'All' || o.orderStatus === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const toggleExpand = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  return (
    <div className="space-y-6 slide-up pb-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-green-100 flex items-center gap-3">
            <ShoppingBag className="text-green-500" size={32} /> Online Orders
          </h2>
          <p className="text-sm text-green-500/60 mt-1">Track, manage, and update customer purchases</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-[#030f05] p-4 rounded-2xl border border-green-900/30 flex flex-col justify-center items-center text-center">
          <span className="text-2xl font-bold text-white">{stats.total}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Total Orders</span>
        </div>
        <div className="bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/20 flex flex-col justify-center items-center text-center">
          <span className="text-2xl font-bold text-yellow-400">{stats.processing}</span>
          <span className="text-xs text-yellow-500/70 uppercase tracking-wider font-semibold mt-1">Processing</span>
        </div>
        <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 flex flex-col justify-center items-center text-center">
          <span className="text-2xl font-bold text-blue-400">{stats.shipped}</span>
          <span className="text-xs text-blue-500/70 uppercase tracking-wider font-semibold mt-1">Shipped</span>
        </div>
        <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 flex flex-col justify-center items-center text-center">
          <span className="text-2xl font-bold text-emerald-400">{stats.delivered}</span>
          <span className="text-xs text-emerald-500/70 uppercase tracking-wider font-semibold mt-1">Delivered</span>
        </div>
        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 flex flex-col justify-center items-center text-center">
          <span className="text-2xl font-bold text-red-400">{stats.cancelled}</span>
          <span className="text-xs text-red-500/70 uppercase tracking-wider font-semibold mt-1">Cancelled</span>
        </div>
      </div>

      {/* Controls: Search and Tabs */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#030f05] p-2 rounded-2xl border border-green-900/30">
        <div className="flex overflow-x-auto w-full lg:w-auto hide-scrollbar gap-1 p-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-green-500 text-[#020a04] shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative w-full lg:w-96 px-1 lg:px-0">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, name, or phone..."
            className="w-full bg-white/5 border border-green-900/50 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-[#030f05] rounded-3xl border border-green-900/30 border-dashed">
          <ShoppingBag size={64} className="mx-auto mb-4 text-green-900/40" />
          <h3 className="text-xl font-bold text-green-100 mb-2">No Orders Found</h3>
          <p className="text-gray-500">There are no orders matching your current filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            
            return (
              <div key={order.id} className={`bg-[#030f05] rounded-2xl border transition-all duration-300 ${isExpanded ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'border-green-900/30 hover:border-green-700/50'}`}>
                {/* Accordion Header (Summary) */}
                <div 
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`hidden sm:flex w-12 h-12 rounded-xl flex-shrink-0 items-center justify-center ${getStatusColor(order.orderStatus).replace('border', '')}`}>
                      {getStatusIcon(order.orderStatus)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-white text-lg">{order.customerDetails?.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-mono">
                        <span>#{order.id.slice(-8).toUpperCase()}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 border-t border-green-900/30 sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Total Amount</p>
                      <p className="text-lg font-bold text-green-400">₹{order.totalAmount}</p>
                    </div>
                    <div className={`p-2 rounded-full bg-white/5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-green-500/10 text-green-400' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                {/* Accordion Body (Details) */}
                {isExpanded && (
                  <div className="p-5 border-t border-green-900/30 bg-black/20 rounded-b-2xl slide-up">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Left Column: Customer & Items */}
                      <div className="lg:col-span-8 space-y-6">
                        
                        {/* Items Table */}
                        <div>
                          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Package size={16} className="text-green-500" /> Order Items ({order.cartItems?.length})
                          </h4>
                          <div className="bg-[#020a04] rounded-xl border border-green-900/30 overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm">
                                <thead className="bg-green-900/10 text-gray-400 border-b border-green-900/30">
                                  <tr>
                                    <th className="px-4 py-3 font-medium">Product Name</th>
                                    <th className="px-4 py-3 font-medium text-center">Type</th>
                                    <th className="px-4 py-3 font-medium text-center">Quantity</th>
                                    <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-green-900/20">
                                  {order.cartItems?.map((item, idx) => (
                                    <tr key={idx} className="text-gray-300 hover:bg-white/5 transition-colors">
                                      <td className="px-4 py-3 font-medium">{item.name}</td>
                                      <td className="px-4 py-3 text-center uppercase text-xs text-gray-500">{item.purchaseType}</td>
                                      <td className="px-4 py-3 text-center">x{item.quantity}</td>
                                      <td className="px-4 py-3 text-right font-medium text-green-400">
                                        ₹{(item.purchaseType === 'kg' ? item.pricePerKg : item.pricePerThar) * item.quantity}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* Customer Details */}
                        <div>
                          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <User size={16} className="text-green-500" /> Customer Information
                          </h4>
                          <div className="bg-[#020a04] rounded-xl border border-green-900/30 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-3">
                              <User size={16} className="text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Name</p>
                                <p className="text-white font-medium">{order.customerDetails?.name}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Phone size={16} className="text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Phone</p>
                                <p className="text-white font-medium">{order.customerDetails?.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Mail size={16} className="text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Email</p>
                                <p className="text-white font-medium break-all">{order.customerDetails?.email || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <MapPin size={16} className="text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Delivery Address</p>
                                <p className="text-gray-300 leading-relaxed">
                                  {order.customerDetails?.address}<br/>
                                  {order.customerDetails?.city} - {order.customerDetails?.pincode}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Actions */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="bg-[#020a04] rounded-xl border border-green-900/30 p-5">
                          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Clock size={16} className="text-green-500" /> Manage Status
                          </h4>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs text-gray-400 mb-2">Current Status</label>
                              <select 
                                value={order.orderStatus}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className="w-full bg-white/5 border border-green-900/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors"
                                disabled={order.orderStatus === 'Cancelled'}
                              >
                                <option value="Processing" className="bg-[#030f05]">Processing</option>
                                <option value="Shipped" className="bg-[#030f05]">Shipped</option>
                                <option value="Delivered" className="bg-[#030f05]">Delivered</option>
                                <option value="Cancelled" className="bg-[#030f05]">Cancelled</option>
                              </select>
                            </div>

                            {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                              <div className="pt-4 border-t border-green-900/30">
                                <label className="block text-xs text-gray-400 mb-2">Danger Zone</label>
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Are you sure you want to cancel this order? The customer will be refunded automatically.')) {
                                      const result = await cancelOrderAndRefund(order.id, order.paymentId);
                                      if (result.success) {
                                        alert('Order cancelled and refund initiated successfully!');
                                        loadOrders();
                                      } else {
                                        alert('Failed to cancel order: ' + result.error);
                                      }
                                    }
                                  }}
                                  className="w-full px-4 py-3 text-sm font-bold rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 group"
                                >
                                  <XCircle size={16} className="group-hover:scale-110 transition-transform" /> Cancel & Refund
                                </button>
                                <p className="text-[10px] text-gray-500 text-center mt-2">This will permanently cancel the order and process a refund to the customer's original payment method.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
