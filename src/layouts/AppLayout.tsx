import React, { useEffect } from "react";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useNavigate } from "react-router-dom"; // Ensure useNavigate is imported
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, loading } = useAuth(); // Get loading state too
  const navigate = useNavigate();

  // Effect to redirect if not authenticated after loading finishes
  useEffect(() => {
    if (!loading && !user) {
      // Use replace to prevent going back to protected route
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show a proper loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#03a1b0]" />
          <p className="text-gray-400 font-medium animate-pulse">
            Initializing Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // If not loading but no user, render nothing (useEffect will redirect)
  // This prevents a flash of the dashboard before redirect
  if (!user) return null;

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div
          className="p-4 min-h-screen mx-auto md:p-6 sm:overflow-hidden overflow-visible
             bg-white 
             dark:bg-gray-900"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
