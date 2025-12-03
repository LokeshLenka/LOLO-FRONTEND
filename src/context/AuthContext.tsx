import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  // Add more user fields as needed
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken)
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    setInitialized(true);
  }, []);

  const login = async (username: string, password: string, role?: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post("http://localhost:8000/api/login", {
        username,
        password,
      });
      const token =
        data.token ||
        data.access_token ||
        data.data?.token ||
        data.data?.access_token;
      const user = data.data?.user || data.user || { username };
      if (!token) throw new Error("Authentication failed: No token received.");
      setToken(token);
      setUser(user);
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("User logged in:", data);

      if (role) {
        navigate(`/${role}/dashboard`);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Login failed.");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/logout"
      );
      if (response.status !== 200) {
        setError("Logout failed. Please try again.");
        return;
      }
      // Clear auth state on successful logout
      setToken(null);
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      setTimeout(() => navigate("/", { replace: true }), 10);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Logout failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return initialized ? (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  ) : null;
};

export { useAuth };
