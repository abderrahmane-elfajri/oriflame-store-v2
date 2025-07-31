import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Home, Package, LogIn, UserPlus, Shield, ShoppingBag } from 'lucide-react';

export default function Navigation() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-oriflame-pink to-oriflame-purple rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">Oriflame Store</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-oriflame-pink transition-colors duration-200"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center space-x-1 text-gray-600 hover:text-oriflame-pink transition-colors duration-200"
            >
              <Package size={18} />
              <span>Products</span>
            </Link>
            
            {currentUser && (
              <Link
                to="/orders"
                className="flex items-center space-x-1 text-gray-600 hover:text-oriflame-pink transition-colors duration-200"
              >
                <ShoppingBag size={18} />
                <span>My Orders</span>
              </Link>
            )}
          </div>

          {/* Auth Links */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-gray-600 hover:text-oriflame-pink transition-colors duration-200"
                  >
                    <Shield size={18} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2 text-gray-600">
                  <User size={18} />
                  <span className="hidden sm:inline text-sm">{currentUser.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-600 hover:text-oriflame-pink transition-colors duration-200"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 btn-primary"
                >
                  <UserPlus size={18} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-oriflame-pink">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
