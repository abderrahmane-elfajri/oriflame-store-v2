import React, { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderModal from './OrderModal';

export default function ProductCard({ product }) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleOrderClick = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <div className="card group cursor-pointer transition-all duration-300 hover:scale-105">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjQiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMzAiIHk9IjEzMCI+CjxwYXRoIGQ9Im0yMS4wMTIgMy01IDE4aC04bDQtMTNoOS4wMTJ6bS00LjAxMiAzaC01bC0yIDEyaDZsMS0xMnoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-bold text-oriflame-pink">
                ${product.price}
              </span>
            </div>
            <button
              onClick={handleOrderClick}
              className="btn-primary flex items-center space-x-2 group/btn"
            >
              <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              <span>Order Now</span>
            </button>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-oriflame-pink rounded-xl transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* Order Modal */}
      <OrderModal
        product={product}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
}
