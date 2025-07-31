import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import googleSheetsService from '../services/googleSheets';

const OrderSystemTester = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const testOrderSystem = async () => {
    setIsLoading(true);
    setTestResult('🔄 Testing order system...\n\n');

    try {
      // Test 1: Check current user
      setTestResult(prev => prev + `👤 Current User: ${currentUser ? currentUser.email : 'None'}\n`);
      setTestResult(prev => prev + `   - User ID: ${currentUser ? currentUser.uid || currentUser.id : 'None'}\n\n`);

      if (!currentUser) {
        setTestResult(prev => prev + '❌ No user logged in - cannot test orders\n');
        return;
      }

      // Test 2: Create a test order
      const testOrder = {
        userId: currentUser.uid || currentUser.id,
        productId: 'test_product_123',
        address: '123 Test Street, Test City, Test Country',
        total: 29.99
      };

      setTestResult(prev => prev + '📤 Creating test order...\n');
      setTestResult(prev => prev + `   - Product ID: ${testOrder.productId}\n`);
      setTestResult(prev => prev + `   - Address: ${testOrder.address}\n`);
      setTestResult(prev => prev + `   - Total: $${testOrder.total}\n\n`);

      const orderResult = await googleSheetsService.addOrder(testOrder);
      
      if (orderResult.success) {
        setTestResult(prev => prev + `✅ Order created successfully!\n`);
        setTestResult(prev => prev + `   - Order ID: ${orderResult.order.id}\n`);
        setTestResult(prev => prev + `   - Saved to: ${orderResult.sheets ? 'Google Sheets' : 'Local Storage'}\n\n`);
      } else {
        setTestResult(prev => prev + `❌ Failed to create order\n\n`);
      }

      // Test 3: Fetch user orders
      setTestResult(prev => prev + '📥 Fetching user orders...\n');
      const userOrders = await googleSheetsService.getUserOrders(currentUser.uid || currentUser.id);
      
      setTestResult(prev => prev + `✅ Found ${userOrders.length} orders for this user:\n`);
      userOrders.slice(0, 3).forEach((order, index) => {
        const date = new Date(order.date).toLocaleDateString();
        setTestResult(prev => prev + `   ${index + 1}. Order ${order.id} - $${order.total} (${date})\n`);
      });

      if (userOrders.length > 3) {
        setTestResult(prev => prev + `   ... and ${userOrders.length - 3} more\n`);
      }

      // Test 4: Check localStorage orders
      const localOrders = JSON.parse(localStorage.getItem('oriflame_orders') || '[]');
      setTestResult(prev => prev + `\n📊 Local Storage: ${localOrders.length} orders total\n`);

    } catch (error) {
      setTestResult(prev => prev + `\n❌ Error: ${error.message}\n`);
    }

    setIsLoading(false);
  };

  const clearLocalOrders = () => {
    localStorage.removeItem('oriflame_orders');
    setTestResult(prev => prev + '\n🗑️ Cleared local orders\n');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-pink-600">🛒 Order System Tester</h3>
      
      <div className="space-y-3 mb-4">
        <button
          onClick={testOrderSystem}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mr-3"
        >
          {isLoading ? 'Testing...' : 'Test Order System'}
        </button>
        
        <button
          onClick={clearLocalOrders}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          Clear Local Orders
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

export default OrderSystemTester;
