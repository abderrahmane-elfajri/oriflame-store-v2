import React, { useState } from 'react';
import { X, Package, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import databaseManager from '../services/databaseManager';

export default function OrderModal({ product, isOpen, onClose }) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    if (!currentUser || (!currentUser.uid && !currentUser.id)) {
      setError('User authentication error. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = {
        userId: currentUser.uid || currentUser.id,
        productId: product.id,
        address: address.trim(),
        total: product.price
      };

      console.log('🛒 Placing order:', order);
      const result = await databaseManager.addOrder(order);
      
      if (result.success) {
        console.log('✅ Order successful:', result);
        setOrderComplete(true);
        
        // Auto close after 5 seconds
        setTimeout(() => {
          handleClose();
        }, 5000);
      } else {
        console.error('❌ Order failed:', result);
        setError('Failed to process order. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error placing order:', error);
      setError(`Failed to place order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAddress('');
    setError('');
    setOrderComplete(false);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {orderComplete ? (
          // Order Success View
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your order. We'll process it and deliver to your address soon.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-900">${product.price}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  handleClose();
                  navigate('/orders');
                }}
                className="btn-primary w-full"
              >
                View My Orders
              </button>
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          // Order Form View
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Complete Your Order</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iNCIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center space-x-1">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-lg font-bold text-oriflame-pink">${product.price}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete delivery address..."
                  className="input-field resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please provide a complete address including street, city, and postal code.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Order Summary
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Product Price:</span>
                    <span className="text-gray-900">${product.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-lg text-oriflame-pink">${product.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Placing Order...</span>
                  </div>
                ) : (
                  `Place Order - $${product.price}`
                )}
              </button>
            </form>

            {/* Security Note */}
            <div className="px-4 pb-4">
              <p className="text-xs text-gray-500 text-center">
                🔒 Your information is secure and protected. Order will be processed manually.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
