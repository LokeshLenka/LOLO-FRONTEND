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

  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validation logic
    const errors: ValidationErrors = {};
    if (!username.trim()) {
      errors.username = ["Please enter your username."];
    } else if (username.trim().length < 3) {
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
        "grid md:grid-cols-2 overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl bg-white/[0.02] backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {/* Left Side: Form */}
      <div className="p-8 md:p-14 flex flex-col justify-center relative">
        {/* Subtle inner glow */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-lolo-pink/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col text-center space-y-2 mb-10 relative z-10">
          <h1 className="text-4xl font-black tracking-tight text-white">
            Welcome <span className="text-lolo-pink">Back</span>
          </h1>
          <p className="text-sm text-center text-neutral-400 font-medium">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Username Field */}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-xs font-bold uppercase text-neutral-500 ml-1 tracking-wider"
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
                "bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-lolo-pink/50 focus-visible:border-lolo-pink h-14 rounded-2xl transition-all text-base",
                fieldErrors.username &&
                  "border-red-500/50 focus-visible:ring-red-500/50",
              )}
            />
            {fieldErrors.username && (
              <p className="text-xs text-red-400 ml-1 flex items-center gap-1 font-medium">
                <AlertCircle size={12} /> {fieldErrors.username[0]}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs font-bold uppercase text-neutral-500 ml-1 tracking-wider"
              >
                Password
              </Label>
              <a
                href="#"
                className="text-xs font-bold text-lolo-pink hover:text-white hover:underline transition-colors"
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
                  "bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-lolo-pink/50 focus-visible:border-lolo-pink h-14 rounded-2xl transition-all pr-12 text-base",
                  fieldErrors.password &&
                    "border-red-500/50 focus-visible:ring-red-500/50",
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </Button>
            </div>

            {fieldErrors.password && (
              <p className="text-xs text-red-400 ml-1 flex items-center gap-1 font-medium">
                <AlertCircle size={12} /> {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 bg-white text-black hover:bg-lolo-pink hover:text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all active:scale-[0.98] mt-2 text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
              <span className="bg-[#09090b] px-3 text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Signup Link */}
          <div className="text-center text-sm text-neutral-400 font-medium">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-white font-bold hover:text-lolo-pink hover:underline transition-all"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>

      {/* Right Side: Image / Visual */}
      <div className="relative hidden md:block bg-black border-l border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
        <img
          src={lolo_login_1}
          alt="SRKR LOLO Login"
          className="h-full w-full object-cover opacity-60 hover:opacity-80 transition-all duration-1000 hover:scale-105"
        />

        <div className="absolute bottom-0 left-0 w-full p-12 z-20">
          <div className="h-1.5 w-16 bg-lolo-pink mb-6 rounded-full"></div>
          <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
            SRKR LOLO
          </h2>
          <p className="text-neutral-300 text-base leading-relaxed max-w-sm font-medium">
            Experience the rhythm of campus life. Join workshops, explore
            events, and connect with the community.
          </p>
        </div>
      </div>
    </div>
  );
}
