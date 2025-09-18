import LoginForm from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function LoginPage() {
  return (<>
   {/* Back Button */}
      <Button
        className="z-10 absolute top-4 left-4 flex items-center bg-black rounded-md mx-auto px-auto"
        onClick={() => history.back()}
      >
        <ChevronLeft className="-ml-2" />
        <span className="hidden sm:inline ">Back</span>
      </Button>
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
    </>
  )
}
