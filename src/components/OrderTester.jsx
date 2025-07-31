import React, { useState } from 'react';
import googleSheetsService from '../services/googleSheets';

const OrderTester = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testOrder = async () => {
    setIsLoading(true);
    setTestResult('🔄 Testing order placement...');

    try {
      const testOrder = {
        userId: 'test_user_123',
        productId: '1',
        address: 'Test Address, Test City, Test Country',
        total: '25.99'
      };

      const result = await googleSheetsService.addOrder(testOrder);
      
      if (result.success) {
        setTestResult(`✅ Order test successful!
Order ID: ${result.order.id}
Status: ${result.local ? 'Processed locally' : 'Added to Google Sheets'}
Details: ${JSON.stringify(result.order, null, 2)}`);
      } else {
        setTestResult(`❌ Order test failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setTestResult(`❌ Order test error: ${error.message}`);
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-pink-600">🛒 Order System Tester</h3>
      
      <button
        onClick={testOrder}
        disabled={isLoading}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Order Placement'}
      </button>
      
      {testResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default OrderTester;
