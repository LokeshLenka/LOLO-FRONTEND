import { Search, Bell, User, RefreshCw, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function AdminHeader({ onRefresh, title, subtitle }: { onRefresh?: ()=>void; title: string; subtitle?: string }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#120A1A]/90 backdrop-blur border-b border-[#D9CEF2] dark:border-[#2A1A3A]">
      <div className="flex items-center gap-4 px-4 lg:px-8 h-[64px]">
        <div className="flex-1 min-w-0 ml-10 lg:ml-0">
          <h1 className="text-[18px] font-bold tracking-tight text-[#030407] dark:text-[#EDE6F8] leading-none">{title}</h1>
          {subtitle && <p className="text-xs text-[#494070] dark:text-[#494070] mt-1 truncate">{subtitle}</p>}
        </div>
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#494070]"/>
            <Input placeholder="Search users, events, tickets..." className="pl-9 h-9 rounded-none bg-[#EDE6F8] dark:bg-[#030407] border-[#D9CEF2] dark:border-[#2A1A3A] text-sm focus-visible:ring-[#DF3FFA]"/>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] text-[#030407] dark:text-[#EDE6F8] hover:bg-[#EDE6F8] dark:hover:bg-[#1A1025] h-9">
              <RefreshCw size={14}/> <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
          <button onClick={toggleTheme} className="w-9 h-9 rounded-none border border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#030407] flex items-center justify-center text-[#030407] dark:text-[#EDE6F8] hover:bg-[#EDE6F8] dark:hover:bg-[#1A1025]">
            {theme==="dark" ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
          <button className="w-9 h-9 rounded-none border border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#030407] flex items-center justify-center text-[#030407] dark:text-[#494070] hover:bg-[#EDE6F8] dark:hover:bg-[#1A1025]">
            <Bell size={16}/>
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-[#D9CEF2] dark:border-[#2A1A3A]">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold text-[#030407] dark:text-[#EDE6F8] leading-none">{user?.name || user?.username || "Admin"}</div>
              <div className="text-[11px] tracking-widest uppercase text-[#DF3FFA] font-semibold">Administrator</div>
            </div>
            <div className="w-9 h-9 rounded-none bg-gradient-to-br from-[#DF3FFA] to-[#030407] flex items-center justify-center text-white">
              <User size={16}/>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
