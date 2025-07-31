import React, { useState, useEffect } from 'react';

const AppsScriptConfig = () => {
  const [appsScriptUrl, setAppsScriptUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [testStatus, setTestStatus] = useState('');

  useEffect(() => {
    // Check if Apps Script URL is already configured
    const savedUrl = localStorage.getItem('apps_script_url');
    if (savedUrl && savedUrl !== 'YOUR_APPS_SCRIPT_URL_HERE') {
      setAppsScriptUrl(savedUrl);
      setIsConfigured(true);
    }
  }, []);

  const handleSaveUrl = () => {
    if (appsScriptUrl.trim()) {
      localStorage.setItem('apps_script_url', appsScriptUrl.trim());
      setIsConfigured(true);
      // Update the Google Sheets service with the new URL
      if (window.googleSheetsService) {
        window.googleSheetsService.appsScriptUrl = appsScriptUrl.trim();
      }
      alert('Apps Script URL saved! Products will now automatically sync to Google Sheets.');
    }
  };

  const testConnection = async () => {
    if (!appsScriptUrl.trim()) {
      setTestStatus('❌ Please enter an Apps Script URL first');
      return;
    }

    setTestStatus('🔄 Testing connection...');
    
    try {
      const response = await fetch(appsScriptUrl.trim(), {
        method: 'GET'
      });
      
      if (response.ok) {
        setTestStatus('✅ Connection successful! Apps Script is working.');
      } else {
        setTestStatus(`❌ Connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestStatus(`❌ Connection error: ${error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-pink-600">🔧 Google Sheets Auto-Sync Setup</h3>
      
      {!isConfigured && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 mb-2">
            <strong>⚠️ Automatic Google Sheets sync not configured!</strong>
          </p>
          <p className="text-sm text-yellow-700">
            Products are currently saved locally only. Follow the steps below to enable automatic Google Sheets integration.
          </p>
        </div>
      )}

      {isConfigured && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800">
            <strong>✅ Apps Script configured!</strong> Products will automatically sync to Google Sheets.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apps Script Web App URL:
          </label>
          <input
            type="url"
            value={appsScriptUrl}
            onChange={(e) => setAppsScriptUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSaveUrl}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 text-sm"
          >
            Save Configuration
          </button>
          
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Test Connection
          </button>
        </div>

        {testStatus && (
          <div className="p-3 bg-gray-50 rounded-md text-sm">
            {testStatus}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">🔗 Setup Instructions:</h4>
        <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
          <li>Open your Google Sheet: <a href="https://docs.google.com/spreadsheets/d/1NL57X8VB-xann5RmwnFP2_qHovy5hHhVeUOt7ulS2vA/edit" target="_blank" rel="noopener noreferrer" className="underline">Click here</a></li>
          <li>Click "Extensions" → "Apps Script"</li>
          <li>Replace the default code with the Google Apps Script code provided</li>
          <li>Click "Deploy" → "New deployment"</li>
          <li>Choose type: "Web app", Execute as: "Me", Access: "Anyone"</li>
          <li>Copy the Web App URL and paste it above</li>
          <li>Click "Save Configuration" and "Test Connection"</li>
        </ol>
      </div>
    </div>
  );
};

export default AppsScriptConfig;
