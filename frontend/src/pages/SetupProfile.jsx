import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';

export default function SetupProfile() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, refetchUser } = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  if (authLoading) {
    return <div className="text-center p-10 dark:text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user && user.username) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/setup-profile', { username });
      await refetchUser(); // Refetch user to get the new username and update context
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 p-8 rounded-xl border-2 border-level-2 bg-level-1">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            One Last Step!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Choose a username to complete your profile.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 rounded-lg leading-5 bg-transparent focus:outline-none ring-1 ring-level-3 focus:ring-2 focus:ring-primary sm:text-sm"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-secondary transition-colors focus:outline-none cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                Complete Profile
                <ArrowRight className="ml-2 mt-0.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}