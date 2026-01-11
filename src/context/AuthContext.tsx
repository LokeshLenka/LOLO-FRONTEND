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

// --- Types ---
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
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPromotedRole: () => boolean;
  getPromotedRoleLabel: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start true to check localStorage first
  const navigate = useNavigate();

  // Use Env variable for API URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // --- 1. Initialization Logic ---
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");
      const storedProfile = localStorage.getItem("userProfile");

      if (storedToken && storedUser && storedProfile) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setProfile(JSON.parse(storedProfile));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // --- 2. Axios Interceptor for 401s ---
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]); // navigate dependency to ensure correct redirect context

  // --- 3. Login Function ---
  // ... imports and other code ...

  const login = async (username: string, password: string) => {
    setLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      console.log("Sending Login Request:", { username, password }); // DEBUG LOG

      const response = await axios.post(`${API_BASE_URL}/login`, {
        username: username, // Ensure this matches your backend validation (username vs email)
        password: password,
      });

      console.log("Login Response:", response.data); // DEBUG LOG

      const data = response.data;

      // Handle various response wrappers common in Laravel resources
      const accessToken = data.token || data.access_token || data.data?.token;
      const userData = data.user || data.data?.user;
      const profileData = data.profile || data.data?.profile;

      if (!accessToken || !userData) {
        throw new Error("Authentication successful but no token received.");
      }

      // Update State
      setToken(accessToken);
      setUser(userData);
      setProfile(profileData || null);

      // Persist
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      if (profileData) {
        localStorage.setItem("userProfile", JSON.stringify(profileData));
      }

      // Set Header
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      toast.success(`Welcome back, ${userData.name || userData.username}!`, {
        id: toastId,
        duration: 3000,
      });

      // Redirect
      const targetRole = profileData?.primary_role || "public";
      navigate(`/${targetRole}/dashboard`);
    } catch (err: any) {
      console.error("Login Failed Details:", err); // DEBUG LOG

      let errorMsg = "Login failed. Please check your credentials.";

      if (err.response) {
        // Server responded with a status code outside 2xx range
        const serverData = err.response.data;

        if (serverData.errors) {
          // Laravel Validation Errors (e.g., { errors: { username: ["Invalid..."] } })
          const firstField = Object.keys(serverData.errors)[0];
          errorMsg = serverData.errors[firstField][0];
        } else if (serverData.message) {
          // Generic Laravel error message
          errorMsg = serverData.message;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMsg = "No response from server. Check your internet connection.";
      } else {
        // Something happened in setting up the request
        errorMsg = err.message;
      }

      toast.error(errorMsg, { id: toastId, duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the file ...

  // --- 4. Logout Function ---
  const logout = useCallback(async () => {
    // Clear Local State immediately for UX
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
    delete axios.defaults.headers.common["Authorization"];

    navigate("/login");
    toast.dismiss(); // Clear any pending toasts

    try {
      // Attempt server-side logout (fire and forget)
      await axios.post(`${API_BASE_URL}/logout`);
    } catch (error) {
      // Ignore logout errors (token might be already expired)
    }
  }, [navigate, API_BASE_URL]);

  // --- 5. Helper Functions ---
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

  const value: AuthContextType = {
    user,
    profile,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    hasPromotedRole,
    getPromotedRoleLabel,
  };

  // Prevent rendering children until initial check is done
  // (Optional: You could render a global loading spinner here)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
