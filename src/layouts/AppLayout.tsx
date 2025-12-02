import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

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
             bg-gradient-to-tl
             from-lolo-pink/10 to-white 
             dark:from-[#0c000b] dark:to-gray-900
             backdrop-blur-9xl transition-all duration-500 
             text-white dark:text-white"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// #0c000b

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
