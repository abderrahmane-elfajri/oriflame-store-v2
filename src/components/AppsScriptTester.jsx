import React, { useState } from 'react';

const AppsScriptTester = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testAppsScript = async () => {
    setIsLoading(true);
    setTestResult('🔄 Testing Apps Script...');
    
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbypCw51gQ5GpHUmiH9LZGNK9EjkaNWBrJxz2s9BW2jh05YX45Ou1W7vetW_LFwLs8Y54A/exec';
    
    // First test GET request
    try {
      const getResponse = await fetch(appsScriptUrl, { method: 'GET' });
      const getText = await getResponse.text();
      setTestResult(`✅ GET test: ${getText}\n\n🔄 Testing POST request...`);
      
      // Then test POST request with sample product
      const testProduct = {
        id: 'test_' + Date.now(),
        name: 'Test Product',
        description: 'This is a test product',
        price: '99.99',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'
      };
      
      const postResponse = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addProduct',
          product: testProduct
        })
      });
      
      const postResult = await postResponse.json();
      
      setTestResult(prev => prev + `\n\n📥 POST Response:
Status: ${postResponse.status}
Success: ${postResult.success}
Message: ${postResult.message || postResult.error}
Full Response: ${JSON.stringify(postResult, null, 2)}`);
      
    } catch (error) {
      setTestResult(prev => prev + `\n\n❌ Error: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-pink-600">🧪 Apps Script Tester</h3>
      
      <button
        onClick={testAppsScript}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Apps Script'}
      </button>
      
      {testResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default AppsScriptTester;
