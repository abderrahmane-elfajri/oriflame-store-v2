import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, MapPin, DollarSign, Eye, ArrowLeft } from 'lucide-react';
import databaseManager from '../services/databaseManager';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    loadOrderHistory();
  }, [currentUser, navigate]);

  const loadOrderHistory = async () => {
    try {
      setLoading(true);
      console.log('📋 Loading order history for user:', currentUser.uid || currentUser.id);
      const userOrders = await databaseManager.getUserOrders(currentUser.uid || currentUser.id);
      console.log('📊 Loaded orders:', userOrders.length);
      setOrders(userOrders);
    } catch (error) {
      console.error('❌ Error loading order history:', error);
      // Try to load from localStorage as fallback
      const localOrders = JSON.parse(localStorage.getItem('oriflame_orders') || '[]');
      const userLocalOrders = localOrders.filter(order => 
        order.userId === (currentUser.uid || currentUser.id)
      );
      setOrders(userLocalOrders);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStatus = (order) => {
    // In a real app, you'd have actual status tracking
    const orderAge = Date.now() - new Date(order.date).getTime();
    const days = orderAge / (1000 * 60 * 60 * 24);
    
    if (days < 1) return { status: 'Processing', color: 'bg-yellow-100 text-yellow-800' };
    if (days < 3) return { status: 'Confirmed', color: 'bg-blue-100 text-blue-800' };
    if (days < 7) return { status: 'Shipped', color: 'bg-purple-100 text-purple-800' };
    return { status: 'Delivered', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-pink-600 hover:text-pink-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and view your Oriflame purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping and your orders will appear here</p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const statusInfo = getOrderStatus(order);
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-pink-100 p-3 rounded-full">
                          <Package className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(order.date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.status}
                        </span>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          ${order.total}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{order.address}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">Total: ${order.total}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center space-x-2 text-pink-600 hover:text-pink-700"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Order ID</label>
                <p className="text-gray-900">#{selectedOrder.id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Date</label>
                <p className="text-gray-900">{formatDate(selectedOrder.date)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Product</label>
                <p className="text-gray-900">{selectedOrder.productName || `Product ID: ${selectedOrder.productId}`}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Delivery Address</label>
                <p className="text-gray-900">{selectedOrder.address}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-2xl font-bold text-pink-600">${selectedOrder.total}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getOrderStatus(selectedOrder).color}`}>
                  {getOrderStatus(selectedOrder).status}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
