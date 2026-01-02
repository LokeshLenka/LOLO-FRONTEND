import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // 1. Import toast

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

  // Use Env variable for API URL
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

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
    const toastId = toast.loading("Signing in...");

    try {
      const { data } = await axios.post(`${API_BASE_URL}/login`, {
        username, // Assuming backend accepts 'username' (or 'email' based on your error msg)
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

      toast.success(`Welcome back! ${user}`, {
        id: toastId,
        description: "Login successful.",
        duration: 3000,
      });

      if (role) {
        navigate(`/${role}/dashboard`);
      } else {
        navigate(`${user}/dashboard`);
      }
    } catch (err: any) {
      // --- ERROR HANDLING UPDATE START ---
      let errorMsg = "Login failed.";

      if (err.response && err.response.data) {
        const serverData = err.response.data;

        // 1. Check for 'errors' object (Validation errors like your example)
        if (serverData.errors) {
          // Flatten errors values and pick the first one
          // Example: errors: { email: ["The provided credentials are incorrect."] }
          const allErrors = Object.values(serverData.errors).flat();
          if (allErrors.length > 0) {
            errorMsg = String(allErrors[0]);
          }
        }
        // 2. Check for top-level 'message' field
        else if (serverData.message) {
          errorMsg = serverData.message;
        }
      } else if (err.message) {
        // Network errors or other client-side errors
        errorMsg = err.message;
      }
      // --- ERROR HANDLING UPDATE END ---

      setError(errorMsg);
      setToken(null);
      setUser(null);

      toast.error("Login Failed", {
        id: toastId,
        description: errorMsg,
        duration: 4000, // Valid duration in ms
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Logging out...");

    try {
      // Assuming logout endpoint exists, otherwise just remove local state
      // Using try/catch allows logout to proceed even if server call fails (e.g. token expired)
      await axios.post(`${API_BASE_URL}/auth/logout`).catch(() => {});

      setToken(null);
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];

      toast.success("Logged out", {
        id: toastId,
        description: "See you next time!",
      });

      setTimeout(() => navigate("/", { replace: true }), 10);
    } catch (err: any) {
      // Even if API fails, we force local logout usually, but if you want to warn:
      const errorMsg =
        err?.response?.data?.message || err?.message || "Logout failed.";
      setError(errorMsg);

      toast.error("Error", {
        id: toastId,
        description: "Failed to notify server of logout.",
      });

      // Still clear local state
      setToken(null);
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
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
