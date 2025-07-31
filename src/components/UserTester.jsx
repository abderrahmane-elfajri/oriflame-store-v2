import React, { useState } from 'react';
import googleSheetsService from '../services/googleSheets';

const UserTester = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testUserOperations = async () => {
    setIsLoading(true);
    setTestResult('🔄 Testing user operations...\n\n');

    try {
      // Test 1: Create a test user
      const testUser = {
        id: 'test_user_' + Date.now(),
        email: 'testuser@example.com',
        role: 'customer',
        createdAt: new Date().toISOString()
      };

      setTestResult(prev => prev + '📤 Creating test user...\n');
      const createResult = await googleSheetsService.addUser(testUser);
      
      if (createResult.success) {
        setTestResult(prev => prev + `✅ User created successfully!\n`);
        setTestResult(prev => prev + `   - Saved to: ${createResult.sheets ? 'Google Sheets' : 'Local Storage'}\n\n`);
      } else {
        setTestResult(prev => prev + `❌ Failed to create user\n\n`);
      }

      // Test 2: Fetch all users
      setTestResult(prev => prev + '📥 Fetching all users...\n');
      const users = await googleSheetsService.getUsers();
      
      setTestResult(prev => prev + `✅ Found ${users.length} users:\n`);
      users.slice(0, 5).forEach((user, index) => {
        setTestResult(prev => prev + `   ${index + 1}. ${user.email} (${user.role})\n`);
      });
      
      if (users.length > 5) {
        setTestResult(prev => prev + `   ... and ${users.length - 5} more\n`);
      }

      setTestResult(prev => prev + `\n📊 User Statistics:\n`);
      const adminCount = users.filter(u => u.role === 'admin').length;
      const customerCount = users.filter(u => u.role === 'customer').length;
      setTestResult(prev => prev + `   - Admins: ${adminCount}\n`);
      setTestResult(prev => prev + `   - Customers: ${customerCount}\n`);

    } catch (error) {
      setTestResult(prev => prev + `\n❌ Error: ${error.message}\n`);
    }

    setIsLoading(false);
  };

  const testUserFromSheets = async () => {
    setIsLoading(true);
    setTestResult('🔄 Testing Google Sheets user fetch...\n\n');

    try {
      const users = await googleSheetsService.getUsersFromSheets();
      setTestResult(prev => prev + `✅ Retrieved ${users.length} users from Google Sheets\n\n`);
      
      if (users.length > 0) {
        setTestResult(prev => prev + 'Recent users:\n');
        users.slice(0, 3).forEach((user, index) => {
          setTestResult(prev => prev + `   ${index + 1}. ${user.email} - ${user.role} (${new Date(user.createdAt).toLocaleDateString()})\n`);
        });
      } else {
        setTestResult(prev => prev + 'No users found in Google Sheets. Try creating some users first!\n');
      }

    } catch (error) {
      setTestResult(prev => prev + `❌ Error: ${error.message}\n`);
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-pink-600">👥 User System Tester</h3>
      
      <div className="space-y-3 mb-4">
        <button
          onClick={testUserOperations}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mr-3"
        >
          {isLoading ? 'Testing...' : 'Test User Operations'}
        </button>
        
        <button
          onClick={testUserFromSheets}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Google Sheets Users'}
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

export default UserTester;
