import { Search, Bell, User, RefreshCw, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function AdminHeader({ onRefresh, title, subtitle }: { onRefresh?: ()=>void; title: string; subtitle?: string }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#14261F]/90 backdrop-blur border-b border-[#BFE9E0] dark:border-[#1E3D32]">
      <div className="flex items-center gap-4 px-4 lg:px-8 h-[64px]">
        <div className="flex-1 min-w-0 ml-10 lg:ml-0">
          <h1 className="text-[18px] font-bold tracking-tight text-[#17463C] dark:text-[#EAF6F4] leading-none">{title}</h1>
          {subtitle && <p className="text-xs text-[#4A7A6E] dark:text-[#91E9D7] mt-1 truncate">{subtitle}</p>}
        </div>
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A7A6E]"/>
            <Input placeholder="Search users, events, tickets..." className="pl-9 h-9 rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border-[#BFE9E0] dark:border-[#1E3D32] text-sm focus-visible:ring-[#3CCCB3]"/>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} className="rounded-none border-[#BFE9E0] dark:border-[#1E3D32] text-[#17463C] dark:text-[#EAF6F4] hover:bg-[#EAF6F4] dark:hover:bg-[#1B342D] h-9">
              <RefreshCw size={14}/> <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
          <button onClick={toggleTheme} className="w-9 h-9 rounded-none border border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#0F1F1A] flex items-center justify-center text-[#17463C] dark:text-[#EAF6F4] hover:bg-[#EAF6F4] dark:hover:bg-[#1B342D]">
            {theme==="dark" ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
          <button className="w-9 h-9 rounded-none border border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#0F1F1A] flex items-center justify-center text-[#17463C] dark:text-[#91E9D7] hover:bg-[#EAF6F4] dark:hover:bg-[#1B342D]">
            <Bell size={16}/>
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-[#BFE9E0] dark:border-[#1E3D32]">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold text-[#17463C] dark:text-[#EAF6F4] leading-none">{user?.name || user?.username || "Admin"}</div>
              <div className="text-[11px] tracking-widest uppercase text-[#1E8277] font-semibold">Administrator</div>
            </div>
            <div className="w-9 h-9 rounded-none bg-gradient-to-br from-[#1E8277] to-[#17463C] flex items-center justify-center text-white">
              <User size={16}/>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
