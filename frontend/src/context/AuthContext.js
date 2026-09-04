'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import apiClient, { setSession, clearSession, getStoredUser, getAccessToken } from '../lib/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // on first load, pull whatever we already saved in localStorage
  useEffect(() => {
    const storedUser = getStoredUser();
    const token = getAccessToken();
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  async function customerLogin(email, password) {
    const { data } = await apiClient.post('/auth/customer/login', { email, password });
    const { user: loggedInUser, accessToken, refreshToken } = data.data;
    setSession({ accessToken, refreshToken, user: loggedInUser });
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function adminLogin(email, password) {
    const { data } = await apiClient.post('/auth/admin/login', { email, password });
    const { user: loggedInUser, accessToken, refreshToken } = data.data;
    setSession({ accessToken, refreshToken, user: loggedInUser });
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(email, password, confirmPassword) {
    const { data } = await apiClient.post('/auth/register', { email, password, confirmPassword });
    return data;
  }

  async function logout() {
    try {
      const refreshToken = localStorage.getItem('evotec_refresh_token');
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (err) {
      // logout should still clear local session even if the request fails
    }
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, customerLogin, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
