import React, { useState, useEffect } from 'react';
import { getOnlineOrders, updateOrderStatus, cancelOrderAndRefund } from '../../services/paymentService';
import { ShoppingBag, Search, CheckCircle, Package, Truck, Clock, XCircle } from 'lucide-react';

export default function OnlineOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOnlineOrders();
    setOrders(data);
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

  const filteredOrders = orders.filter(o => 
    o.customerDetails?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      case 'Processing': return <Clock size={14} />;
      case 'Shipped': return <Truck size={14} />;
      case 'Delivered': return <CheckCircle size={14} />;
      case 'Cancelled': return <XCircle size={14} />;
      default: return <Package size={14} />;
    }
  };

  return (
    <div className="space-y-6 slide-up pb-4 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-green-200 flex items-center gap-2">
            <ShoppingBag className="text-green-400" /> Online Orders
          </h2>
          <p className="text-xs text-green-500/50">Manage customer purchases from the storefront</p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-600/50" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name or order ID..."
          className="input-field pl-11 !py-3 !text-base shadow-lg"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center glass-card">
          <ShoppingBag size={48} className="mx-auto mb-3 text-green-800/40" />
          <p className="text-green-500/40 text-lg">No online orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="glass-card p-5 border border-green-800/30">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-green-800/30 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-green-100">{order.customerDetails?.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-green-500/60 font-mono">Order ID: {order.id}</p>
                  <p className="text-xs text-green-500/60 font-mono">Date: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <p className="text-sm text-green-400/60 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-green-300">₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-green-400/70 uppercase mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {order.cartItems?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm bg-green-900/10 p-2 rounded-lg">
                        <span className="text-green-100">{item.name} <span className="text-green-500/50">x {item.quantity} {item.purchaseType}</span></span>
                        <span className="text-green-300 font-medium">₹{(item.purchaseType === 'kg' ? item.pricePerKg : item.pricePerThar) * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-green-400/70 uppercase mb-3">Customer Details</h4>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="text-green-500/50">Phone:</span> {order.customerDetails?.phone}</p>
                    <p><span className="text-green-500/50">Email:</span> {order.customerDetails?.email}</p>
                    <p><span className="text-green-500/50">Address:</span> {order.customerDetails?.address}, {order.customerDetails?.city} - {order.customerDetails?.pincode}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-green-800/20">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-green-400/70 uppercase mb-2">Update Status</label>
                        <select 
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="select-field text-sm w-full"
                          disabled={order.orderStatus === 'Cancelled'}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                        <div className="flex-1 text-right">
                          <label className="block text-xs font-semibold text-transparent uppercase mb-2">Action</label>
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
                            className="px-4 py-2 text-sm font-bold rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors w-full"
                          >
                            Cancel & Refund
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
