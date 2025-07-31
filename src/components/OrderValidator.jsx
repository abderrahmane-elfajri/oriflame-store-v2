import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import googleSheetsService from '../services/googleSheets';

const OrderValidator = () => {
  const [validationResult, setValidationResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const validateOrderSystem = async () => {
    setIsLoading(true);
    setValidationResult('🔍 Validating order system...\n\n');

    try {
      // Check 1: User authentication
      setValidationResult(prev => prev + '1. User Authentication Check:\n');
      if (!currentUser) {
        setValidationResult(prev => prev + '   ❌ No user logged in\n\n');
        return;
      }

      const userId = currentUser.uid || currentUser.id;
      setValidationResult(prev => prev + `   ✅ User: ${currentUser.email}\n`);
      setValidationResult(prev => prev + `   ✅ User ID: ${userId}\n\n`);

      // Check 2: Apps Script Configuration
      setValidationResult(prev => prev + '2. Apps Script Configuration:\n');
      const appsScriptUrl = localStorage.getItem('apps_script_url');
      if (!appsScriptUrl || appsScriptUrl === 'YOUR_APPS_SCRIPT_URL_HERE') {
        setValidationResult(prev => prev + '   ⚠️ Apps Script not configured\n');
      } else {
        setValidationResult(prev => prev + '   ✅ Apps Script URL configured\n');
      }
      setValidationResult(prev => prev + '\n');

      // Check 3: Product availability
      setValidationResult(prev => prev + '3. Product System Check:\n');
      const products = await googleSheetsService.getProducts();
      setValidationResult(prev => prev + `   ✅ Found ${products.length} products\n\n`);

      if (products.length === 0) {
        setValidationResult(prev => prev + '   ⚠️ No products available for testing\n\n');
        return;
      }

      // Check 4: Order creation test
      setValidationResult(prev => prev + '4. Order Creation Test:\n');
      const testProduct = products[0];
      const testOrder = {
        userId: userId,
        productId: testProduct.id,
        address: '123 Test Address, Test City, Test Country',
        total: parseFloat(testProduct.price) || 29.99
      };

      setValidationResult(prev => prev + '   📝 Creating test order...\n');
      const orderResult = await googleSheetsService.addOrder(testOrder);

      if (orderResult.success) {
        setValidationResult(prev => prev + '   ✅ Order creation successful\n');
        setValidationResult(prev => prev + `   📊 Order ID: ${orderResult.order.id}\n`);
        setValidationResult(prev => prev + `   💾 Storage: ${orderResult.sheets ? 'Google Sheets' : 'Local Only'}\n\n`);
      } else {
        setValidationResult(prev => prev + '   ❌ Order creation failed\n\n');
        return;
      }

      // Check 5: Order retrieval test
      setValidationResult(prev => prev + '5. Order Retrieval Test:\n');
      const userOrders = await googleSheetsService.getUserOrders(userId);
      setValidationResult(prev => prev + `   ✅ Retrieved ${userOrders.length} orders for user\n`);

      if (userOrders.length > 0) {
        const latestOrder = userOrders[0];
        setValidationResult(prev => prev + `   📦 Latest order: ${latestOrder.productName || 'Unknown Product'}\n`);
        setValidationResult(prev => prev + `   📅 Date: ${new Date(latestOrder.date).toLocaleDateString()}\n`);
      }
      setValidationResult(prev => prev + '\n');

      // Check 6: Local storage verification
      setValidationResult(prev => prev + '6. Local Storage Check:\n');
      const localOrders = JSON.parse(localStorage.getItem('oriflame_orders') || '[]');
      setValidationResult(prev => prev + `   💾 Local orders: ${localOrders.length}\n`);
      const userLocalOrders = localOrders.filter(order => order.userId === userId);
      setValidationResult(prev => prev + `   👤 User local orders: ${userLocalOrders.length}\n\n`);

      // Summary
      setValidationResult(prev => prev + '📋 VALIDATION SUMMARY:\n');
      setValidationResult(prev => prev + `   ✅ User authenticated: ${currentUser.email}\n`);
      setValidationResult(prev => prev + `   ✅ Products available: ${products.length}\n`);
      setValidationResult(prev => prev + `   ✅ Order system functional: Yes\n`);
      setValidationResult(prev => prev + `   ✅ Storage method: ${orderResult.sheets ? 'Google Sheets + Local' : 'Local Only'}\n`);
      setValidationResult(prev => prev + `   ✅ Total user orders: ${userOrders.length}\n\n`);
      setValidationResult(prev => prev + '🎉 Order system validation complete!\n');

    } catch (error) {
      setValidationResult(prev => prev + `\n❌ Validation Error: ${error.message}\n`);
      console.error('Order validation error:', error);
    }

    setIsLoading(false);
  };

  const clearTestOrders = async () => {
    try {
      const orders = JSON.parse(localStorage.getItem('oriflame_orders') || '[]');
      const nonTestOrders = orders.filter(order => 
        !order.address.includes('Test Address') && 
        !order.productId.includes('test_product')
      );
      localStorage.setItem('oriflame_orders', JSON.stringify(nonTestOrders));
      setValidationResult(prev => prev + '\n🗑️ Test orders cleared from local storage\n');
    } catch (error) {
      setValidationResult(prev => prev + `\n❌ Error clearing test orders: ${error.message}\n`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-green-600">✅ Order System Validator</h3>
      
      <div className="space-y-3 mb-4">
        <button
          onClick={validateOrderSystem}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 mr-3"
        >
          {isLoading ? 'Validating...' : 'Validate Order System'}
        </button>
        
        <button
          onClick={clearTestOrders}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
        >
          Clear Test Orders
        </button>
      </div>
      
      {validationResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <pre className="text-sm whitespace-pre-wrap font-mono">{validationResult}</pre>
        </div>
      )}
    </div>
  );
};

export default OrderValidator;
