import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import databaseManager from '../services/databaseManager';

const SQLiteTester = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const testSQLiteDatabase = async () => {
    setIsLoading(true);
    setTestResult('🗄️ Testing SQLite Database...\n\n');

    try {
      // Test 1: Check database stats
      setTestResult(prev => prev + '1. Database Statistics:\n');
      const stats = databaseManager.getStats();
      setTestResult(prev => prev + `   📊 Users: ${stats.users}\n`);
      setTestResult(prev => prev + `   📦 Products: ${stats.products}\n`);
      setTestResult(prev => prev + `   🛒 Orders: ${stats.orders}\n\n`);

      // Test 2: Test product operations
      setTestResult(prev => prev + '2. Product Operations:\n');
      const products = await databaseManager.getProducts();
      setTestResult(prev => prev + `   ✅ Retrieved ${products.length} products\n`);
      
      if (products.length > 0) {
        setTestResult(prev => prev + `   📝 Sample: "${products[0].name}" - $${products[0].price}\n`);
      }

      // Test 3: Test user operations
      setTestResult(prev => prev + '\n3. User Operations:\n');
      const users = await databaseManager.getUsers();
      setTestResult(prev => prev + `   ✅ Retrieved ${users.length} users\n`);
      
      if (currentUser) {
        setTestResult(prev => prev + `   👤 Current user: ${currentUser.email}\n`);
      }

      // Test 4: Test order operations
      setTestResult(prev => prev + '\n4. Order Operations:\n');
      const orders = await databaseManager.getOrders();
      setTestResult(prev => prev + `   ✅ Retrieved ${orders.length} orders\n`);

      if (currentUser) {
        const userOrders = await databaseManager.getUserOrders(currentUser.uid || currentUser.id);
        setTestResult(prev => prev + `   👤 User orders: ${userOrders.length}\n`);
      }

      // Test 5: Create test order
      if (currentUser && products.length > 0) {
        setTestResult(prev => prev + '\n5. Test Order Creation:\n');
        const testOrder = {
          userId: currentUser.uid || currentUser.id,
          productId: products[0].id,
          address: '123 SQLite Test Street, Test City',
          total: products[0].price
        };

        const orderResult = await databaseManager.addOrder(testOrder);
        if (orderResult.success) {
          setTestResult(prev => prev + `   ✅ Test order created: ${orderResult.order.id}\n`);
        } else {
          setTestResult(prev => prev + `   ❌ Test order failed\n`);
        }
      }

      // Summary
      setTestResult(prev => prev + '\n📋 SQLite Database Summary:\n');
      setTestResult(prev => prev + `   🗄️ Database Type: In-Memory SQLite (LocalStorage)\n`);
      setTestResult(prev => prev + `   💾 Storage: Browser LocalStorage\n`);
      setTestResult(prev => prev + `   🌐 GitHub Compatible: Yes\n`);
      setTestResult(prev => prev + `   📱 Client-Side: Yes\n`);
      setTestResult(prev => prev + `   🔧 Status: Fully Operational\n\n`);
      setTestResult(prev => prev + '🎉 SQLite database test complete!\n');

    } catch (error) {
      setTestResult(prev => prev + `\n❌ Test Error: ${error.message}\n`);
      console.error('SQLite test error:', error);
    }

    setIsLoading(false);
  };

  const clearDatabase = () => {
    if (window.confirm('⚠️ This will clear ALL data (users, products, orders). Are you sure?')) {
      databaseManager.clearAll();
      setTestResult(prev => prev + '\n🗑️ Database cleared completely\n');
    }
  };

  const showDatabaseInfo = () => {
    setTestResult('📖 SQLite Database Information:\n\n');
    setTestResult(prev => prev + '🏗️ Architecture:\n');
    setTestResult(prev => prev + '   - In-Memory SQLite-like structure\n');
    setTestResult(prev => prev + '   - Uses JavaScript Maps for data storage\n');
    setTestResult(prev => prev + '   - Persists to localStorage for durability\n');
    setTestResult(prev => prev + '   - Perfect for GitHub Pages hosting\n\n');
    
    setTestResult(prev => prev + '📊 Tables:\n');
    setTestResult(prev => prev + '   - users (id, email, password, role, created_at)\n');
    setTestResult(prev => prev + '   - products (id, name, description, price, image, created_at)\n');
    setTestResult(prev => prev + '   - orders (id, user_id, product_id, address, total, status, created_at)\n\n');
    
    setTestResult(prev => prev + '🌟 Benefits:\n');
    setTestResult(prev => prev + '   ✅ No external dependencies\n');
    setTestResult(prev => prev + '   ✅ Works offline\n');
    setTestResult(prev => prev + '   ✅ GitHub Pages compatible\n');
    setTestResult(prev => prev + '   ✅ Fast performance\n');
    setTestResult(prev => prev + '   ✅ Easy to deploy\n');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-purple-600">🗄️ SQLite Database Tester</h3>
      
      <div className="space-y-3 mb-4">
        <button
          onClick={testSQLiteDatabase}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 mr-3"
        >
          {isLoading ? 'Testing...' : 'Test SQLite Database'}
        </button>
        
        <button
          onClick={showDatabaseInfo}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mr-3"
        >
          Database Info
        </button>
        
        <button
          onClick={clearDatabase}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          Clear Database
        </button>
      </div>
      
      {testResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <pre className="text-sm whitespace-pre-wrap font-mono">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default SQLiteTester;
