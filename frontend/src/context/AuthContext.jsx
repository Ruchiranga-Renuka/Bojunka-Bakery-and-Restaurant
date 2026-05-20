import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchProfile } from '../api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'bojunka_auth';

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizeRole(role) {
  return role ? String(role).toLowerCase() : '';
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStored);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(!!loadStored());

  useEffect(() => {
    if (!auth?.token) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = await fetchProfile(auth.token);
        if (!cancelled) {
          setProfile({
            ...me,
            role: normalizeRole(me.role),
          });
        }
      } catch {
        if (!cancelled && auth?.role) {
          setProfile({
            username: auth.username,
            name: auth.username,
            role: normalizeRole(auth.role),
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth?.token, auth?.role, auth?.username]);

  const login = (token, role, username) => {
    const next = {
      token,
      role: normalizeRole(role),
      username,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
    setProfile({
      username,
      name: username,
      role: normalizeRole(role),
    });
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
    setProfile(null);
    setLoading(false);
  };

  const role = normalizeRole(profile?.role || auth?.role);

  const value = useMemo(
    () => ({
      token: auth?.token,
      role,
      username: profile?.username || auth?.username,
      name: profile?.name,
      isAuthenticated: !!auth?.token,
      isAdmin: role === 'admin',
      isCustomer: role === 'customer',
      loading,
      login,
      logout,
    }),
    [auth, profile, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
