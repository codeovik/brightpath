import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import googleLogo from '../assets/google.png'
import fbLogo from '../assets/facebook.png'
import { useApi } from '../contexts/ApiContext'
import { useAuth } from '../contexts/AuthContext'

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const api = useApi();
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      setError(errorParam.replace(/\+/g, ' '));
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/signin', formData);
      await refetchUser(); // This will fetch user and trigger redirect in AuthContext if needed
      navigate('/dashboard'); // Navigate to dashboard, AuthContext will handle redirect to setup if needed
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // google auth
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_DOMAIN}/api/auth/google`;
  };

  // facebook auth
  const handleFacebookLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_DOMAIN}/api/auth/facebook`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 p-8 rounded-xl border-2 border-level-2 bg-level-1">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full pl-10 pr-3 py-3 rounded-lg leading-5 bg-transparent focus:outline-none ring-1 ring-level-3 focus:ring-2 focus:ring-primary sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="block w-full pl-10 pr-3 py-3 rounded-lg leading-5 bg-transparent focus:outline-none ring-1 ring-level-3 focus:ring-2 focus:ring-primary sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
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
              "Sign In"
            )}
            {!loading && <ArrowRight className="ml-2 mt-0.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-level-1 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center cursor-pointer justify-center px-4 py-2 rounded-lg bg-level-2 focus:outline-none ring-2 ring-level-3 hover:bg-level-3 transition-all active:scale-95"
          >
            <img src={googleLogo} alt="Google" className="h-5 w-5 mr-2" />
            Google
          </button>
          <button
            type="button"
            onClick={handleFacebookLogin}
            className="flex items-center cursor-pointer justify-center px-4 py-2 rounded-lg bg-level-2 focus:outline-none ring-2 ring-level-3 hover:bg-level-3 transition-all active:scale-95"
          >
            <img src={fbLogo} alt="Facebook" className="h-5 w-5 mr-2" />
            Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:border-b-2 hover:border-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}