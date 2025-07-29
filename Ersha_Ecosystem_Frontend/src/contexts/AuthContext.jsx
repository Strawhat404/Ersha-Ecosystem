import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Check for existing token on app load
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const profileData = await authAPI.getProfile();
          setUser(profileData);
          setProfile(profileData);
        } catch (error) {
          console.error('Failed to get profile:', error);
          // Token might be expired, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      const response = await authAPI.register({
        email,
        password,
        ...userData
      });
      
      if (response.access) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        setUser(response.user);
        setProfile(response.user);
      }
      
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.access) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        setUser(response.user);
        setProfile(response.user);
      }
      
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setProfile(null);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      // This would need to be implemented in the Django backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Password reset failed');
      }
      
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedProfile = await authAPI.updateProfile(updates);
      setProfile(updatedProfile);
      setUser(updatedProfile);
      return { data: updatedProfile, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const refreshUserProfile = async () => {
    try {
      const profileData = await authAPI.getProfile();
      setUser(profileData);
      setProfile(profileData);
      return { data: profileData, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 