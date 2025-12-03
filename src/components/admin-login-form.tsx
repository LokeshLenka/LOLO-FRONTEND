import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import lolo_login_1 from "../assets/LOLO_Logo_1.jpg"; // Reuse or change image
import { useAuth } from "../context/AuthContext"; // Ensure this context handles admin logic if needed
import { Loader2, AlertCircle, ShieldAlert } from "lucide-react";

interface ValidationErrors {
  username?: string[];
  password?: string[];
}

export default function AdminLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  // Assuming useAuth might have a specific adminLogin or you handle the role check internally
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validation logic
    const errors: ValidationErrors = {};

    if (!password) {
      errors.password = ["Please enter your password."];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Pass a flag or use a specific admin login function if your API distinguishes endpoints
    // Example: await login(username, password, 'admin');
    await login(username, password, "admin");
  };

  return (
    <div
      className={cn(
        "grid md:grid-cols-2 overflow-hidden rounded-3xl border border-red-500/20 shadow-2xl shadow-red-500/10 bg-[#09090b]/80 backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {/* Left Side: Form */}
      <div className="px-8 md:px-12 py-12 flex flex-col justify-center relative">
        {/* Decorative Admin Badge */}
        <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert size={12} /> Admin Portal
        </div>

        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Admin <span className="text-red-500">Access</span>
          </h1>
          <p className="text-sm text-gray-400">
            Secure login for system administrators and managers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-xs font-bold uppercase text-gray-500 ml-1"
            >
              Admin Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="admin@srkrlolo.com"
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
                "bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-red-500/50 focus-visible:border-red-500 h-12 rounded-xl transition-all",
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
                "bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-red-500/50 focus-visible:border-red-500 h-12 rounded-xl transition-all",
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
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                Authenticating...
              </>
            ) : (
              "Access Dashboard"
            )}
          </Button>

          {/* General Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Right Side: Visual */}
      <div className="relative hidden md:block bg-red-900/5 border-l border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>

        {/* Grayscale or Tinted Image for "Serious" Tone */}
        <img
          src={lolo_login_1}
          alt="Admin Access"
          className="h-full w-full object-cover opacity-60 transition-all"
        />

        <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay"></div>

        {/* Overlay Text */}
        <div className="absolute bottom-0 left-0 w-full p-8 z-20">
          <div className="h-1 w-12 bg-red-600 mb-4"></div>
          <h2 className="text-2xl font-black text-white mb-2">
            System Administration
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Manage users, approve events, and oversee platform operations.
            Strictly for authorized personnel.
          </p>
        </div>
      </div>
    </div>
  );
}
