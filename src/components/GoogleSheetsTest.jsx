import React, { useState } from 'react';
import googleSheetsService from '../services/googleSheets';

const GoogleSheetsTest = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    
    try {
      await googleSheetsService.initializeSpreadsheet();
      setStatus('✅ Connection successful! Sheets initialized.');
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}\n\nTroubleshooting:\n1. Enable Google Sheets API in Google Cloud Console\n2. Make sure your spreadsheet is public (Anyone with link can view)\n3. Add sheets named: Products, Users, Orders to your spreadsheet`);
    } finally {
      setLoading(false);
    }
  };

  const testProducts = async () => {
    setLoading(true);
    setStatus('Testing products...');
    
    try {
      const products = await googleSheetsService.getProducts();
      setStatus(`✅ Products loaded: ${products.length} products found\n\nFirst few products:\n${products.slice(0, 3).map(p => `- ${p.name || 'Mock Product'} ($${p.price})`).join('\n')}`);
    } catch (error) {
      setStatus(`❌ Products test failed: ${error.message}\n\nUsing mock data instead.`);
    } finally {
      setLoading(false);
    }
  };

  const addSampleProduct = async () => {
    setLoading(true);
    setStatus('Adding sample product...');
    
    try {
      const result = await googleSheetsService.addProduct({
        name: 'Sample Oriflame Product',
        description: 'This is a test product added via the API',
        price: '29.99',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'
      });
      
      if (result.fallback) {
        setStatus('✅ Sample product added successfully (saved locally)!\n\nNote: Google Sheets write access not available.\nThis means:\n- Products are saved in browser storage\n- They will show in your Products page\n- To enable Google Sheets writing, you need:\n  1. OAuth 2.0 setup (complex)\n  2. Or Service Account (requires JSON key file)\n  3. For now, local storage works perfectly!');
      } else {
        setStatus('✅ Sample product added successfully to Google Sheet!\n\nCheck your Google Sheet to see the new product.');
      }
    } catch (error) {
      setStatus(`❌ Failed to add product: ${error.message}\n\nThis requires:\n1. Google Sheets API enabled\n2. Write permissions on your sheet (OAuth or Service Account)\n3. Products sheet with correct headers\n\nNote: Products will still be saved locally and work in your store!`);
    } finally {
      setLoading(false);
    }
  };

  const createSheets = async () => {
    setLoading(true);
    setStatus('This will help you set up your Google Sheet...');
    
    // Provide manual instructions since we can't create sheets via API without auth
    setStatus(`📋 Manual Setup Required:\n\n1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1NL57X8VB-xann5RmwnFP2_qHovy5hHhVeUOt7ulS2vA/edit\n\n2. Create 3 sheets (tabs) with these exact names:\n   • Products\n   • Users\n   • Orders\n\n3. Add headers to each sheet:\n   \n   Products sheet (A1:E1):\n   ID | Name | Description | Price | Image\n   \n   Users sheet (A1:C1):\n   ID | Email | CreatedAt\n   \n   Orders sheet (A1:F1):\n   ID | UserID | ProductID | Date | Address | Total\n\n4. Share your sheet: Share → Anyone with the link can view\n\n5. Enable Google Sheets API in Google Cloud Console\n\n6. Then click 'Test Connection' above!`);
    
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Google Sheets Integration Test</h3>
      
      <div className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={testConnection}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            Test Connection
          </button>
          
          <button
            onClick={testProducts}
            disabled={loading}
            className="btn-secondary disabled:opacity-50"
          >
            Test Products
          </button>
          
          <button
            onClick={addSampleProduct}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Add Sample Product
          </button>
          
          <button
            onClick={createSheets}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Setup Instructions
          </button>
        </div>
        
        {status && (
          <div className="p-4 bg-gray-100 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{status}</pre>
          </div>
        )}
        
        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
            <span className="ml-2">Loading...</span>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-semibold mb-2">Configuration Status:</h4>
        <div className="text-sm space-y-1">
          <div>API Key: {import.meta.env.VITE_GOOGLE_SHEETS_API_KEY ? '✅ Configured' : '❌ Missing'}</div>
          <div>Spreadsheet ID: {import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID ? '✅ Configured' : '❌ Missing'}</div>
          <div>Sheet URL: <a href={`https://docs.google.com/spreadsheets/d/${import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID}/edit`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open Google Sheet</a></div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 rounded-md">
        <h4 className="font-semibold mb-2">Quick Fix:</h4>
        <p className="text-sm">If you're seeing 400 errors, the most common fix is:</p>
        <ol className="text-sm mt-2 space-y-1 list-decimal list-inside">
          <li>Enable Google Sheets API in <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
          <li>Make your sheet public (Share → Anyone with link can view)</li>
          <li>Add the required sheets: Products, Users, Orders</li>
        </ol>
      </div>
    </div>
  );
};

export default GoogleSheetsTest;
