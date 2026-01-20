import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/* =======================
   Types
======================= */

interface User {
  username: string;
  name: string;
  email: string;
  uuid: string;
}

interface UserProfile {
  primary_role: "management" | "music";
  promoted_role: string | null;
  has_promoted_role: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string,
    role?: "admin" | "user"
  ) => Promise<void>;
  logout: () => void;
  hasPromotedRole: () => boolean;
  getPromotedRoleLabel: () => string;
}

/* =======================
   Context Setup
======================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/* =======================
   Provider
======================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* =======================
     1. Initialize from localStorage
  ======================= */

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    const storedProfile = localStorage.getItem("userProfile");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  /* =======================
     2. Axios 401 Interceptor
  ======================= */

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (err) => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  /* =======================
     3. Login
  ======================= */

  const login = async (
    username: string,
    password: string,
    role: "admin" | "user" = "user"
  ) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Signing in...");

    try {
      const endpoint =
        role === "admin"
          ? `${API_BASE_URL}/admin/login`
          : `${API_BASE_URL}/login`;

      const response = await axios.post(endpoint, {
        username,
        password,
      });

      const data = response.data;

      const accessToken = data.token || data.access_token || data.data?.token;
      const userData = data.user || data.data?.user;
      const profileData = data.profile || data.data?.profile;

      if (!accessToken || !userData) {
        throw new Error("No token received from server.");
      }

      // State
      setToken(accessToken);
      setUser(userData);
      setProfile(profileData ?? null);

      // Storage
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      if (profileData) {
        localStorage.setItem("userProfile", JSON.stringify(profileData));
      }

      // Axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      toast.success(`Welcome back, ${userData.name || userData.username}!`, {
        id: toastId,
      });

      // Redirect
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(`/${userData.username}/dashboard`);
      }
    } catch (err: any) {
      let message = "Login failed. Please try again.";

      if (err.response?.data) {
        const server = err.response.data;
        if (server.errors) {
          const key = Object.keys(server.errors)[0];
          message = server.errors[key][0];
        } else if (server.message) {
          message = server.message;
        }
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     4. Logout
  ======================= */

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    setError(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");

    delete axios.defaults.headers.common["Authorization"];

    navigate("/login");
    toast.dismiss();

    try {
      await axios.post(`${API_BASE_URL}/logout`);
    } catch {
      // ignore
    }
  }, [navigate, API_BASE_URL]);

  /* =======================
     5. Helpers
  ======================= */

  const hasPromotedRole = () => {
    return !!profile?.has_promoted_role;
  };

  const getPromotedRoleLabel = () => {
    if (!profile?.promoted_role) return "";

    const labels: Record<string, string> = {
      credit_manager: "Credit Manager",
      executive_body_member: "Executive Member",
      membership_head: "Membership Head",
    };

    return (
      labels[profile.promoted_role] || profile.promoted_role.replace(/_/g, " ")
    );
  };

  /* =======================
     Context Value
  ======================= */

  const value: AuthContextType = {
    user,
    profile,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login,
    logout,
    hasPromotedRole,
    getPromotedRoleLabel,
  };
  

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
