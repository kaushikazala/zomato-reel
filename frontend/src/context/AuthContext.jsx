import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../App';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-fetch user on app load
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
        setUser(response.data);
      } catch (err) {
        // 401 is expected for unauthenticated users; silently treat as "not logged in"
        // Only log network/server errors, not auth failures
        if (err.response?.status !== 401 && err.code !== 'ERR_BAD_REQUEST') {
          // Silently fail for 401 and bad requests - these are normal
          if (!err.response || (err.response.status >= 500)) {
            console.warn('Server error checking auth status:', err.message);
          }
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
