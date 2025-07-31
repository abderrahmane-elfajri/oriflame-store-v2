import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Heart } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Star className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Authentic Oriflame products with guaranteed quality and effectiveness."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Shopping",
      description: "Safe and secure online shopping with protected user information."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery service to your doorstep."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer Care",
      description: "Dedicated customer support for all your beauty needs."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-oriflame-pink via-pink-500 to-oriflame-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Discover Your
                <span className="block text-yellow-300">Natural Beauty</span>
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Explore our premium collection of Oriflame cosmetics and skincare products. 
                Enhance your natural beauty with trusted, high-quality products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-oriflame-pink font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-oriflame-pink transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop"
                  alt="Oriflame Beauty Products"
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-lg transform rotate-6 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Oriflame Store?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing you with the best beauty products and shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-oriflame-pink to-oriflame-purple text-white rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Beauty Routine?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of premium Oriflame products and find the perfect items for your beauty needs.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-oriflame-pink to-oriflame-purple text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 group"
          >
            Explore Products
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-oriflame-pink mb-2">500+</div>
              <div className="text-gray-600">Premium Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-oriflame-pink mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-oriflame-pink mb-2">50+</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
