import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [dashboardData, setDashboardData] = useState(null);

  const userLogin = (token, userInfo = null) => {
    setToken(token);
    setUser(userInfo);
    localStorage.setItem('token', token);
    if (userInfo) localStorage.setItem('user', JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setDashboardData(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = useMemo(() => ({
    token,
    user,
    dashboardData,
    setDashboardData,
    userLogin,
    logout,
    isAuthenticated: !!token,
  }), [token, user, dashboardData]);


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
