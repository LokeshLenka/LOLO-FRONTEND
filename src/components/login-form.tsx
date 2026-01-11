import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import lolo_login_1 from "../assets/LOLO_Logo_1.jpg";
import { useAuth } from "../context/AuthContext";
import { Loader2, AlertCircle, EyeOff, Eye } from "lucide-react";

interface ValidationErrors {
  username?: string[];
  password?: string[];
}

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  // FIX: Removed 'error' from destructuring
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validation logic
    const errors: ValidationErrors = {};
    if (!username.trim()) {
      errors.username = ["Please enter your username."];
    } else if (username.trim().length < 3) {
      // Changed to 3, 10 might be too strict for some usernames
      errors.username = ["Username must be at least 3 characters."];
    }
    if (!password) {
      errors.password = ["Please enter your password."];
    } else if (password.length < 8) {
      errors.password = ["Password must be at least 8 characters."];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    await login(username.trim(), password);
  };

  return (
    <div
      className={cn(
        "grid md:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-[#03a1b0]/10 bg-[#09090b]/60 backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {/* Left Side: Form */}
      <div className="p-8 md:p-12 flex flex-col justify-center">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Welcome <span className="text-[#03a1b0]">Back</span>
          </h1>
          <p className="text-sm text-gray-400">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-xs font-bold uppercase text-gray-500 ml-1"
            >
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldErrors.username)
                  setFieldErrors((prev) => ({ ...prev, username: undefined }));
              }}
              disabled={loading}
              required
              autoComplete="username"
              className={cn(
                "bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#03a1b0]/50 focus-visible:border-[#03a1b0] h-12 rounded-xl transition-all",
                fieldErrors.username &&
                  "border-red-500/50 focus-visible:ring-red-500/50"
              )}
            />
            {fieldErrors.username && (
              <p className="text-xs text-red-400 ml-1 flex items-center gap-1">
                <AlertCircle size={12} /> {fieldErrors.username[0]}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs font-bold uppercase text-gray-500 ml-1"
              >
                Password
              </Label>
              <a
                href="#"
                className="text-xs text-[#03a1b0] hover:text-[#03a1b0]/80 hover:underline transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password)
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                }}
                disabled={loading}
                required
                autoComplete="current-password"
                className={cn(
                  "bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#03a1b0]/50 focus-visible:border-[#03a1b0] h-12 rounded-xl transition-all pr-10",
                  fieldErrors.password &&
                    "border-red-500/50 focus-visible:ring-red-500/50"
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white hover:bg-transparent"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 mr-2" />
                ) : (
                  <Eye className="w-5 h-5 mr-2" />
                )}
              </Button>
            </div>

            {fieldErrors.password && (
              <p className="text-xs text-red-400 ml-1 flex items-center gap-1">
                <AlertCircle size={12} /> {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#03a1b0] hover:bg-[#028a96] text-white font-bold rounded-xl shadow-lg shadow-[#03a1b0]/20 transition-all active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* FIX: Removed the general error display block since we use Toast now */}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0d0e12] px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Signup Link */}
          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-white font-bold hover:text-[#03a1b0] hover:underline transition-all"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>

      {/* Right Side: Image / Visual */}
      <div className="relative hidden md:block bg-[#03a1b0]/10 border-l border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
        <img
          src={lolo_login_1}
          alt="SRKR LOLO Login"
          className="h-full w-full object-cover opacity-80 transition-all duration-1000"
        />

        <div className="absolute bottom-0 left-0 w-full p-8 z-20">
          <div className="h-1 w-12 bg-[#03a1b0] mb-4"></div>
          <h2 className="text-2xl font-black text-white mb-2">SRKR LOLO</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Experience the rhythm of campus life. Join workshops, explore
            events, and connect with the community.
          </p>
        </div>
      </div>
    </div>
  );
}
