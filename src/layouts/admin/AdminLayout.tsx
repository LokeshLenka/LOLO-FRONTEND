import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!loading && !token) navigate("/admin/login", { replace: true });
  },[loading, token, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#EAF6F4]"><Loader2 className="w-8 h-8 animate-spin text-[#1E8277]"/></div>;
  }
  if (!token) return null;

  return (
    <div className="admin-shell admin-theme">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-[78px]" : "lg:pl-[264px]"}`}>
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
