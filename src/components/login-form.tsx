import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import lolo_login_1 from "../assets/LOLO_Logo_1.jpg";
import { useAuth } from "../context/AuthContext";

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
  const { login, loading, error, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Client-side validation matching Laravel rules
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0  md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your SRKR LOLO account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="2X0707XXXX"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    // Clear error when user types
                    if (fieldErrors.username) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        username: undefined,
                      }));
                    }
                  }}
                  disabled={loading}
                  required
                  autoComplete="username"
                  className={cn(
                    "h-10",
                    fieldErrors.username ? "border-red-500" : ""
                  )}
                />
                {fieldErrors.username && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {fieldErrors.username[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password *</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                    tabIndex={-1}
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Clear error when user types
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  disabled={loading}
                  required
                  autoComplete="current-password"
                  className={cn(
                    "h-10",
                    fieldErrors.username ? "border-red-500" : ""
                  )}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {fieldErrors.password[0]}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-10 font-semibold"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 p-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={lolo_login_1}
              alt="SRKR LOLO Login"
              className="absolute h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
