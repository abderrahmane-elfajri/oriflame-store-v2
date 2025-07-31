// In-Memory SQLite-like Database Service for Oriflame Store
// This provides SQLite-like functionality using localStorage and in-memory storage
// Perfect for GitHub Pages hosting and client-side applications

class SQLiteService {
  constructor() {
    this.tables = {
      users: new Map(),
      products: new Map(),
      orders: new Map()
    };
    
    this.initializeFromStorage();
    this.initializeTables();
    console.log('🗄️ SQLite-like Database initialized');
  }

  initializeFromStorage() {
    // Load existing data from localStorage
    try {
      const userData = localStorage.getItem('sqlite_users');
      if (userData) {
        const users = JSON.parse(userData);
        users.forEach(user => this.tables.users.set(user.id, user));
      }

      const productData = localStorage.getItem('sqlite_products');
      if (productData) {
        const products = JSON.parse(productData);
        products.forEach(product => this.tables.products.set(product.id, product));
      }

      const orderData = localStorage.getItem('sqlite_orders');
      if (orderData) {
        const orders = JSON.parse(orderData);
        orders.forEach(order => this.tables.orders.set(order.id, order));
      }
    } catch (error) {
      console.log('No existing data found, starting fresh');
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('sqlite_users', JSON.stringify(Array.from(this.tables.users.values())));
      localStorage.setItem('sqlite_products', JSON.stringify(Array.from(this.tables.products.values())));
      localStorage.setItem('sqlite_orders', JSON.stringify(Array.from(this.tables.orders.values())));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  initializeTables() {
    // Insert default admin user if not exists
    const adminExists = this.getUser('admin@oriflame.com');
    if (!adminExists) {
      this.addUser({
        id: 'admin_' + Date.now(),
        email: 'admin@oriflame.com',
        password: 'admin123', // In production, this should be hashed
        role: 'admin',
        created_at: new Date().toISOString()
      });
    }

    // Insert sample products if none exist
    if (this.tables.products.size === 0) {
      this.insertSampleProducts();
    }

    console.log('✅ Database tables initialized');
  }

  insertSampleProducts() {
    const sampleProducts = [
      {
        id: '1',
        name: 'Oriflame Royal Velvet Lipstick',
        description: 'Long-lasting luxury lipstick with rich pigmentation and moisturizing formula.',
        price: 25.99,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Divine Anti-Aging Cream',
        description: 'Premium anti-aging moisturizer with 24k gold and peptides for youthful skin.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Eclat Beauty Serum',
        description: 'Illuminating vitamin C serum for radiant and glowing complexion.',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop',
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Perfect Foundation',
        description: 'Full coverage foundation with SPF protection for flawless skin.',
        price: 35.99,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop',
        created_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Wellness Multivitamin',
        description: 'Complete daily multivitamin with essential nutrients for overall health.',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop',
        created_at: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Hydrating Face Mask',
        description: 'Intensive hydrating mask for dry and tired skin with natural ingredients.',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop',
        created_at: new Date().toISOString()
      }
    ];

    sampleProducts.forEach(product => {
      this.tables.products.set(product.id, product);
    });

    this.saveToStorage();
    console.log('✅ Sample products inserted');
  }

  // User Methods
  addUser(user) {
    try {
      const newUser = {
        ...user,
        created_at: user.created_at || new Date().toISOString()
      };
      
      this.tables.users.set(user.id, newUser);
      this.saveToStorage();
      console.log('✅ User added to SQLite:', user.email);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('❌ Error adding user:', error.message);
      throw error;
    }
  }

  getUser(email) {
    try {
      for (const user of this.tables.users.values()) {
        if (user.email === email) {
          return user;
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting user:', error.message);
      return null;
    }
  }

  getUsers() {
    try {
      return Array.from(this.tables.users.values())
        .map(user => ({
          id: user.id,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      console.error('❌ Error getting users:', error.message);
      return [];
    }
  }

  // Product Methods
  addProduct(product) {
    try {
      const newProduct = {
        ...product,
        created_at: new Date().toISOString()
      };
      
      this.tables.products.set(product.id, newProduct);
      this.saveToStorage();
      console.log('✅ Product added to SQLite:', product.name);
      return { success: true, product: newProduct };
    } catch (error) {
      console.error('❌ Error adding product:', error.message);
      throw error;
    }
  }

  getProducts() {
    try {
      return Array.from(this.tables.products.values())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      console.error('❌ Error getting products:', error.message);
      return [];
    }
  }

  updateProduct(id, product) {
    try {
      const existingProduct = this.tables.products.get(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      const updatedProduct = {
        ...existingProduct,
        ...product,
        id,
        updated_at: new Date().toISOString()
      };
      
      this.tables.products.set(id, updatedProduct);
      this.saveToStorage();
      console.log('✅ Product updated in SQLite:', product.name);
      return { success: true, product: updatedProduct };
    } catch (error) {
      console.error('❌ Error updating product:', error.message);
      throw error;
    }
  }

  deleteProduct(id) {
    try {
      this.tables.products.delete(id);
      this.saveToStorage();
      console.log('✅ Product deleted from SQLite:', id);
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting product:', error.message);
      throw error;
    }
  }

  // Order Methods
  addOrder(order) {
    try {
      const newOrder = {
        id: Date.now().toString(),
        user_id: order.userId,
        product_id: order.productId,
        address: order.address,
        total: order.total,
        status: 'processing',
        created_at: new Date().toISOString()
      };
      
      this.tables.orders.set(newOrder.id, newOrder);
      this.saveToStorage();
      console.log('✅ Order added to SQLite:', newOrder.id);
      return { success: true, order: newOrder };
    } catch (error) {
      console.error('❌ Error adding order:', error.message);
      throw error;
    }
  }

  getOrders() {
    try {
      const orders = Array.from(this.tables.orders.values());
      
      // Enhance with user and product information
      return orders.map(order => {
        const user = this.tables.users.get(order.user_id);
        const product = this.tables.products.get(order.product_id);
        
        return {
          ...order,
          user_email: user ? user.email : 'Unknown User',
          product_name: product ? product.name : 'Unknown Product',
          product_image: product ? product.image : null
        };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      console.error('❌ Error getting orders:', error.message);
      return [];
    }
  }

  getUserOrders(userId) {
    try {
      const orders = Array.from(this.tables.orders.values())
        .filter(order => order.user_id === userId);
      
      // Enhance with product information
      return orders.map(order => {
        const product = this.tables.products.get(order.product_id);
        
        return {
          ...order,
          product_name: product ? product.name : 'Unknown Product',
          product_image: product ? product.image : null
        };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      console.error('❌ Error getting user orders:', error.message);
      return [];
    }
  }

  updateOrderStatus(orderId, status) {
    try {
      const order = this.tables.orders.get(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      order.status = status;
      order.updated_at = new Date().toISOString();
      
      this.tables.orders.set(orderId, order);
      this.saveToStorage();
      console.log('✅ Order status updated:', orderId, status);
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating order status:', error.message);
      throw error;
    }
  }

  // Utility Methods
  close() {
    this.saveToStorage();
    console.log('🔒 Database connection closed');
  }

  // Get database statistics
  getStats() {
    try {
      return {
        users: this.tables.users.size,
        products: this.tables.products.size,
        orders: this.tables.orders.size
      };
    } catch (error) {
      console.error('❌ Error getting stats:', error.message);
      return { users: 0, products: 0, orders: 0 };
    }
  }

  // Clear all data (for testing)
  clearAll() {
    this.tables.users.clear();
    this.tables.products.clear();
    this.tables.orders.clear();
    localStorage.removeItem('sqlite_users');
    localStorage.removeItem('sqlite_products');
    localStorage.removeItem('sqlite_orders');
    console.log('🗑️ All data cleared');
  }
}

export default SQLiteService;
