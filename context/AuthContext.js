'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, hasFirebaseConfig } from '@/lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

export function getRedirectPath(role, fallback = '/') {
  if (role === 'admin') return '/dashboard';
  if (role === 'doctor') return '/dashboard/doctor';
  return fallback;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('reflex_token');
    const savedUser = localStorage.getItem('reflex_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('reflex_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (tokenVal, userData) => {
    localStorage.setItem('reflex_token', tokenVal);
    localStorage.setItem('reflex_user', JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  };

  const googleLogin = async () => {
    if (!hasFirebaseConfig || !auth || !googleProvider) {
      throw new Error('Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.');
    }

    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Sync with MongoDB backend
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
        firebaseUid: firebaseUser.uid,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      login(data.token, data.user);
      return data;
    } else {
      throw new Error(data.message || 'Google login failed');
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) { /* ignore firebase signout errors */ }
    localStorage.removeItem('reflex_token');
    localStorage.removeItem('reflex_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem('reflex_user', JSON.stringify(userData));
    setUser(userData);
  };

  const isLoggedIn = !!token;
  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';

  return (
    <AuthContext.Provider value={{ user, token, loading, isLoggedIn, isAdmin, isDoctor, login, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
