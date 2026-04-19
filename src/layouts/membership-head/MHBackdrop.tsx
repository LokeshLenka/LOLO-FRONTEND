import { useSidebar } from "../../context/SidebarContext";

const MHBackdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm transition-all lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
};

export default MHBackdrop;