import LoginForm from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, MoveLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();

  return (
    <>
      {/* Back Button */}
      <button
        className="z-10 absolute top-4 left-4 flex items-center bg-transparent h-12 rounded-md mx-auto"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2" />
        <span className="hidden sm:inline ">Back</span>
      </button>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
