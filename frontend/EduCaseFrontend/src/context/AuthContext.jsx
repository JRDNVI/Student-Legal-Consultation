// Based of Web App 2 Assignment 2 - UserAuth 

// This code is used to proivide the app with authentication context (The current user),
// When the user succesfully logs in, the token and user information is stored in the context and local storage.
// When the user logs out, the token and user information is removed from the context and local storage.
// The AuthProvider component is wrapped around the app (app.jsx) and provides the authentication context to all components in the app.

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); 
  const [user, setUser] = useState(null);  

  const userLogin = (token, userInfo = null) => {
    setToken(token);
    setUser(userInfo);
    
    localStorage.setItem('token', token);
    if (userInfo) localStorage.setItem('user', JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    token,
    user,
    userLogin,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
