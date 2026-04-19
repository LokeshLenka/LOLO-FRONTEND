import React, { useEffect } from "react";
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Outlet, useNavigate } from "react-router-dom";
import Backdrop from "../Backdrop";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import MHAppSidebar from "./MHAppSidebar";
import MHAppHeader from "./MHAppHeader";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-zinc-900 dark:text-zinc-100" />
          <p className="text-zinc-500 dark:text-zinc-400 font-medium animate-pulse">
            Initializing Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen xl:flex bg-zinc-50 dark:bg-zinc-950">
      <div>
        <MHAppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <MHAppHeader />
        <div className="py-4 px-2 min-h-screen mx-auto md:p-6 sm:overflow-hidden overflow-visible bg-zinc-50/50 dark:bg-zinc-950">
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
