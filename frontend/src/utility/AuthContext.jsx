/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser, guestLogin } from "../api/auth.js";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Re-fetch current user profile
  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      if (response && response.success && response.data) {
        setUser(response.data);
        return response.data;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      setUser(null);
      return null;
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    const initializeAuth = async () => {
      await refreshUser();
      setLoading(false);
    };
    initializeAuth();
  }, [refreshUser]);

  // Login handler
  const login = async (credentials) => {
    const response = await loginUser(credentials);
    if (response && response.success) {
      await refreshUser();
    }
    return response;
  };

  // Register handler
  const register = async (formData) => {
    const response = await registerUser(formData);
    return response;
  };

  // Guest login handler
  const loginAsGuest = async () => {
    const response = await guestLogin();
    if (response && response.success) {
      await refreshUser();
    }
    return response;
  };

  // Logout handler
  const logout = async () => {
    try {
      const response = await logoutUser();
      if (response && response.success) {
        setUser(null);
      }
      return response;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
        register,
        loginAsGuest,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
