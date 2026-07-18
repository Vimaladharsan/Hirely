import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "./authContextInstance";
import api, {
  clearToken,
  getToken,
  login as loginRequest,
  register as registerRequest,
  setToken,
} from "../api/api";

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;

    api
      .get("/auth/me")
      .then((response) => setUser(response.data))
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearToken();
      setUser(null);
      navigate("/login");
    };

    window.addEventListener("hirely:unauthorized", handleUnauthorized);

    return () =>
      window.removeEventListener("hirely:unauthorized", handleUnauthorized);
  }, [navigate]);

  const login = async ({ email, password }) => {
    const response = await loginRequest({ email, password });

    setToken(response.data.access_token);
    setUser(response.data.user);

    return response.data.user;
  };

  const register = async ({ email, password, name }) => {
    const response = await registerRequest({ email, password, name });

    setToken(response.data.access_token);
    setUser(response.data.user);

    return response.data.user;
  };

  const logout = () => {
    clearToken();
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
