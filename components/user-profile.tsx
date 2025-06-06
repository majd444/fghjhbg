'use client';

import { useUserInfo } from '../hooks/useUserInfo';

export default function UserProfile() {
  const { userInfo, isLoading, error } = useUserInfo();

  if (isLoading) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-gray-500">Loading user information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <div className="text-red-500 text-center">
          <h3 className="font-bold text-lg">Error Loading Profile</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <p className="text-center text-gray-500">
          Please log in to view your profile information.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col items-center">
      <div className="flex items-center space-x-4 mb-6">
        {userInfo.picture ? (
          <img 
            src={userInfo.picture} 
            alt="Profile" 
            className="h-16 w-16 rounded-full"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            {userInfo.name?.charAt(0) || '?'}
          </div>
        )}
        <div>
          <h2 className="text-xl font-medium text-black">{userInfo.name}</h2>
          <p className="text-gray-500">{userInfo.email}</p>
        </div>
      </div>
      
      <div className="w-full border-t border-gray-200 pt-4">
        <h3 className="font-medium text-gray-700 mb-2">Profile Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">User ID:</span>
            <span className="text-gray-700 font-mono text-sm">{userInfo.sub}</span>
          </div>
          {userInfo.nickname && (
            <div className="flex justify-between">
              <span className="text-gray-500">Nickname:</span>
              <span className="text-gray-700">{userInfo.nickname}</span>
            </div>
          )}
          {userInfo.given_name && (
            <div className="flex justify-between">
              <span className="text-gray-500">First Name:</span>
              <span className="text-gray-700">{userInfo.given_name}</span>
            </div>
          )}
          {userInfo.family_name && (
            <div className="flex justify-between">
              <span className="text-gray-500">Last Name:</span>
              <span className="text-gray-700">{userInfo.family_name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Email Verified:</span>
            <span className={userInfo.email_verified ? "text-green-600" : "text-red-600"}>
              {userInfo.email_verified ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
