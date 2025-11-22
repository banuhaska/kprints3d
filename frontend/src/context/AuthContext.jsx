import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('k3d_token');
    if (!token) {
      setLoading(false);
      return;
    }

    client
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('k3d_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    setError('');
    const { data } = await client.post('/auth/login', credentials);
    localStorage.setItem('k3d_token', data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    setError('');
    const { data } = await client.post('/auth/register', payload);
    localStorage.setItem('k3d_token', data.token);
    setUser(data.user);
  };

  const skip = () => {
    setUser({ name: 'Guest', role: 'guest' });
    setError('');
  };

  const logout = () => {
    localStorage.removeItem('k3d_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    skip,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

