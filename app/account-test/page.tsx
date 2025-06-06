'use client';

import { useState, useEffect } from 'react';
// Import only what we need

interface AccountInfo {
  accountId: string;
  userId: string;
  email: string;
  createdAt: string;
  lastLogin: string;
}

interface PaginatedResponse {
  length: number;
  limit: number;
  accounts: AccountInfo[];
  start: number;
  total: number;
}

export default function AccountTestPage() {
  const [accountId, setAccountId] = useState<string>('');
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<{
    total: number;
    page: number;
    limit: number;
  }>({
    total: 0,
    page: 0,
    limit: 5
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the current account ID from cookies
  useEffect(() => {
    const accountIdCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('account_id='));
      
    if (accountIdCookie) {
      setAccountId(accountIdCookie.split('=')[1]);
    } else {
      setError('No account ID found in cookies');
    }
  }, []);
  
  // Fetch accounts with pagination
  const fetchAccounts = async (page: number = 0, limit: number = 5) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/account?all=true&include_totals=true&page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json() as PaginatedResponse;
      setAccounts(data.accounts || []);
      setPaginationInfo({
        total: data.total,
        page: data.start / data.limit,
        limit: data.limit
      });
    } catch (err) {
      setError(`Error fetching accounts: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new test account
  const createTestAccount = async () => {
    try {
      setLoading(true);
      const testEmail = `test-${Date.now()}@example.com`;
      const testUserId = `test-user-${Date.now()}`;
      
      const response = await fetch('/api/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail, userId: testUserId }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      alert(`Created new test account: ${data.account.accountId}`);
      
      // Refresh the accounts list
      fetchAccounts(paginationInfo.page, paginationInfo.limit);
    } catch (err) {
      setError(`Error creating test account: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize by fetching accounts
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchAccounts(newPage, paginationInfo.limit);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account ID System Test</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Account ID</h2>
        {accountId ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="font-mono text-green-800">{accountId}</p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">No account ID found. Please visit the landing page first.</p>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Accounts (Auth0-style Pagination)</h2>
          <button
            onClick={createTestAccount}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Test Account
          </button>
        </div>
        
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Account ID</th>
                    <th className="py-3 px-6 text-left">User ID</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <tr key={account.accountId} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left font-mono">{account.accountId}</td>
                        <td className="py-3 px-6 text-left">{account.userId}</td>
                        <td className="py-3 px-6 text-left">{account.email}</td>
                        <td className="py-3 px-6 text-left">{new Date(account.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center">No accounts found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div>
                <p className="text-sm text-gray-600">
                  Showing page {paginationInfo.page + 1} of {Math.ceil(paginationInfo.total / paginationInfo.limit)}
                </p>
                <p className="text-sm text-gray-600">
                  Total accounts: {paginationInfo.total}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, paginationInfo.page - 1))}
                  disabled={paginationInfo.page === 0}
                  className={`px-3 py-1 rounded ${
                    paginationInfo.page === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(paginationInfo.page + 1)}
                  disabled={paginationInfo.page >= Math.ceil(paginationInfo.total / paginationInfo.limit) - 1}
                  className={`px-3 py-1 rounded ${
                    paginationInfo.page >= Math.ceil(paginationInfo.total / paginationInfo.limit) - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">GET /api/account</h3>
            <p className="text-gray-600 mb-2">Get account information by userId or email</p>
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
              /api/account?userId=user123
              /api/account?email=user@example.com
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">GET /api/account?all=true&include_totals=true</h3>
            <p className="text-gray-600 mb-2">Get all accounts with Auth0-style pagination</p>
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
              /api/account?all=true&include_totals=true&page=0&limit=5
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">POST /api/account</h3>
            <p className="text-gray-600 mb-2">Create or ensure an account exists</p>
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
{`fetch('/api/account', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', userId: 'user123' })
})`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
