import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import useAutoLogout from "../useAutoLogout";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("vtoken") || null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const login = (t) => {
    setToken(t);
    localStorage.setItem("vtoken", t);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("vtoken");
  };

  useEffect(() => {
    if (token) {
      setLoadingUser(true);
      apiFetch("/user/profile", {}, token)
        .then((d) => {
          // ✅ Handle both { user: {...} } and direct {...}
          setUser(d.user ? d.user : d);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoadingUser(false);
        });
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]); // ← runs every time token changes

  useAutoLogout(logout, !!token);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, setUser, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}