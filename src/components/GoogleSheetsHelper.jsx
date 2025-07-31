import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink } from 'lucide-react';

const GoogleSheetsHelper = () => {
  const [localProducts, setLocalProducts] = useState([]);

  useEffect(() => {
    // Load products that are stored locally but not in Google Sheets
    const products = JSON.parse(localStorage.getItem('oriflame_products') || '[]');
    setLocalProducts(products);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatProductForSheets = (product) => {
    return `${product.id}\t${product.name}\t${product.description}\t${product.price}\t${product.image}`;
  };

  const copyAllProducts = () => {
    const headers = 'ID\tName\tDescription\tPrice\tImage';
    const rows = localProducts.map(formatProductForSheets);
    const allData = [headers, ...rows].join('\n');
    copyToClipboard(allData);
  };

  if (localProducts.length === 0) {
    return (
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">✅ All Products Synced</h4>
        <p className="text-green-700 text-sm">No local products need to be added to Google Sheets.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-2">📋 Google Sheets Manual Sync</h4>
      <p className="text-blue-700 text-sm mb-3">
        You have {localProducts.length} product(s) that need to be added to Google Sheets manually.
      </p>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <a
            href="https://docs.google.com/spreadsheets/d/1NL57X8VB-xann5RmwnFP2_qHovy5hHhVeUOt7ulS2vA/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            Open Google Sheet
          </a>
          
          <button
            onClick={copyAllProducts}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            <Copy className="w-4 h-4" />
            Copy All Data
          </button>
        </div>
        
        <div className="text-xs text-blue-600">
          <strong>Instructions:</strong>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Click "Open Google Sheet" above</li>
            <li>Go to the "Products" sheet/tab</li>
            <li>Click "Copy All Data" button above</li>
            <li>In Google Sheets, click on cell A1</li>
            <li>Press Ctrl+V (or Cmd+V on Mac) to paste</li>
            <li>Your products will be added to the sheet!</li>
          </ol>
        </div>

        <details className="bg-white p-2 rounded border">
          <summary className="cursor-pointer text-sm font-medium">Show Individual Products</summary>
          <div className="mt-2 space-y-2">
            {localProducts.map((product, index) => (
              <div key={product.id} className="border-l-2 border-blue-200 pl-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-gray-600">${product.price}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(formatProductForSheets(product))}
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                  >
                    Copy Row
                  </button>
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default GoogleSheetsHelper;
