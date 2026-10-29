import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/authApi';
import { normalizeRole } from '../utils/formatters';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * AuthContext — global authentication & user state.
 *
 * - Persists JWT + user info in localStorage.
 * - Exposes login / register / logout actions.
 * - Derives the normalized role (CANDIDATE | RECRUITER) from backend authorities.
 */

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const persistSession = useCallback((authResponse) => {
    const roles = authResponse.roles || [];
    const normalizedUser = {
      id: authResponse.id,
      fullName: authResponse.fullName,
      email: authResponse.email,
      companyName: authResponse.companyName,
      roles,
      role: normalizeRole(roles),
    };
    localStorage.setItem(STORAGE_KEYS.TOKEN, authResponse.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
    setToken(authResponse.token);
    setUser(normalizedUser);
    return normalizedUser;
  }, []);

  // On first load, refresh user details from /auth/me if a token exists.
  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!storedToken) {
        setInitializing(false);
        return;
      }
      try {
        const me = await getCurrentUser();
        const normalizedUser = {
          id: me.id,
          fullName: me.fullName,
          email: me.email,
          companyName: me.companyName,
          phoneNumber: me.phoneNumber,
          roles: me.roles || [],
          role: normalizeRole(me.roles || []),
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
        setUser(normalizedUser);
      } catch {
        // Token invalid/expired — the axios interceptor already cleared storage.
        setUser(null);
        setToken(null);
      } finally {
        setInitializing(false);
      }
    };
    bootstrap();
  }, []);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        const response = await loginUser(credentials);
        const normalizedUser = persistSession(response);
        return { success: true, user: normalizedUser };
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const created = await registerUser(payload);
        return { success: true, user: created };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      initializing,
      isAuthenticated: Boolean(token && user),
      isRecruiter: user?.role === 'RECRUITER',
      isCandidate: user?.role === 'CANDIDATE',
      login,
      register,
      logout,
    }),
    [user, token, loading, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;