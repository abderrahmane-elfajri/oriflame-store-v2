// Database Manager - Unified interface for data operations
import SQLiteService from './sqliteService';

class DatabaseManager {
  constructor() {
    this.db = new SQLiteService();
    console.log('🗄️ Database Manager initialized with SQLite');
  }

  // User Operations
  async addUser(user) {
    try {
      return this.db.addUser(user);
    } catch (error) {
      console.error('Database Manager - Error adding user:', error);
      throw error;
    }
  }

  async getUser(email) {
    try {
      return this.db.getUser(email);
    } catch (error) {
      console.error('Database Manager - Error getting user:', error);
      return null;
    }
  }

  async getUsers() {
    try {
      return this.db.getUsers();
    } catch (error) {
      console.error('Database Manager - Error getting users:', error);
      return [];
    }
  }

  // Product Operations
  async addProduct(product) {
    try {
      return this.db.addProduct(product);
    } catch (error) {
      console.error('Database Manager - Error adding product:', error);
      throw error;
    }
  }

  async getProducts() {
    try {
      return this.db.getProducts();
    } catch (error) {
      console.error('Database Manager - Error getting products:', error);
      return [];
    }
  }

  async updateProduct(id, product) {
    try {
      return this.db.updateProduct(id, product);
    } catch (error) {
      console.error('Database Manager - Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      return this.db.deleteProduct(id);
    } catch (error) {
      console.error('Database Manager - Error deleting product:', error);
      throw error;
    }
  }

  // Order Operations
  async addOrder(order) {
    try {
      return this.db.addOrder(order);
    } catch (error) {
      console.error('Database Manager - Error adding order:', error);
      throw error;
    }
  }

  async getOrders() {
    try {
      return this.db.getOrders();
    } catch (error) {
      console.error('Database Manager - Error getting orders:', error);
      return [];
    }
  }

  async getUserOrders(userId) {
    try {
      return this.db.getUserOrders(userId);
    } catch (error) {
      console.error('Database Manager - Error getting user orders:', error);
      return [];
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      return this.db.updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Database Manager - Error updating order status:', error);
      throw error;
    }
  }

  // Utility Operations
  getStats() {
    try {
      return this.db.getStats();
    } catch (error) {
      console.error('Database Manager - Error getting stats:', error);
      return { users: 0, products: 0, orders: 0 };
    }
  }

  clearAll() {
    try {
      this.db.clearAll();
      console.log('🗑️ Database Manager - All data cleared');
    } catch (error) {
      console.error('Database Manager - Error clearing data:', error);
    }
  }

  close() {
    try {
      this.db.close();
      console.log('🔒 Database Manager - Connection closed');
    } catch (error) {
      console.error('Database Manager - Error closing connection:', error);
    }
  }
}

// Create and export singleton instance
const databaseManager = new DatabaseManager();
export default databaseManager;
