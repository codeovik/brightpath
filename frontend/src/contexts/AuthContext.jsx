import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApi } from './ApiContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      if (data.user && !data.user.username && location.pathname !== '/setup-profile') {
        navigate('/setup-profile', { replace: true });
      }
    } catch (error) {
      console.error("Auth check failed:", error.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [api, navigate, location.pathname]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signout = async () => {
    await api.post('/auth/signout');
    setUser(null);
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
