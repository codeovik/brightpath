import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-10 dark:text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-6">
        <img src={user.profilePicture} alt={user.name} className="w-24 h-24 rounded-full border-2 border-primary" />
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Welcome, {user.username || user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
        </div>
      </div>
    </div>
  );
}