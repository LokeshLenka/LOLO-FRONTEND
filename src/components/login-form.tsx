import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import lolo_login_1 from "../assets/LOLO_Logo_1.jpg"; // Ensure this path is correct
import { useAuth } from "../context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";

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
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validation logic
    const errors: ValidationErrors = {};
    if (!username.trim()) {
      errors.username = ["Please enter your username."];
    } else if (username.trim().length < 10) {
      errors.username = ["Username must be at least 10 characters."];
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
              placeholder="2X0707XXXX"
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
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password)
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              disabled={loading}
              required
              autoComplete="current-password"
              className={cn(
                "bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#03a1b0]/50 focus-visible:border-[#03a1b0] h-12 rounded-xl transition-all",
                fieldErrors.password &&
                  "border-red-500/50 focus-visible:ring-red-500/50"
              )}
            />
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

          {/* General Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

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

        {/* Overlay Text on Image */}
        <div className="absolute bottom-0 left-0 w-full p-8 z-20">
          <div className="h-1 w-12 bg-[#03a1b0] mb-4"></div>
          <h2 className="text-2xl font-black text-white mb-2">SRKR LOLO</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Experience the rhythm of campus life. Manage events, explore clubs,
            and connect with the community.
          </p>
        </div>
      </div>
    </div>
  );
}
