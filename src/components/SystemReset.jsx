import React from 'react';

const SystemReset = () => {
  const resetSystem = () => {
    // Clear all localStorage
    localStorage.clear();
    
    // Reload the page
    window.location.reload();
    
    alert('System reset complete! Please login again with admin@oriflame.com / admin123secure');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
      <h3 className="text-xl font-bold mb-4 text-red-600">🔄 System Reset</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-2">
          If you're experiencing login issues or cached data problems, click below to reset the system:
        </p>
        <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
          <li>Clears all localStorage data</li>
          <li>Resets user accounts and settings</li>
          <li>Refreshes the application</li>
        </ul>
      </div>
      
      <button
        onClick={resetSystem}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
      >
        Reset System & Reload
      </button>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded-md">
        <p className="text-xs text-yellow-800">
          <strong>After reset, use:</strong><br/>
          Email: admin@oriflame.com<br/>
          Password: admin123secure
        </p>
      </div>
    </div>
  );
};

export default SystemReset;
