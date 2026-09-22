import { Search, Bell, User, RefreshCw, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function AdminHeader({ onRefresh, title, subtitle }: { onRefresh?: ()=>void; title: string; subtitle?: string }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-30 bg-[var(--admin-surface)] border-b border-[var(--admin-line)]">
      <div className="flex items-center gap-4 px-4 lg:px-8 h-[64px]">
        <div className="flex-1 min-w-0 ml-10 lg:ml-0">
          <h1 className="text-[18px] font-bold tracking-tight text-[var(--admin-ink)] leading-none" style={{letterSpacing:"-0.02em"}}>{title}</h1>
          {subtitle && <p className="text-xs text-[var(--admin-ink-muted)] mt-1 truncate">{subtitle}</p>}
        </div>
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-ink-muted)]"/>
            <Input placeholder="Search users, events, tickets..." className="pl-9 h-9 rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)] text-sm focus-visible:ring-[var(--admin-ink)]"/>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} className="rounded-none border-[var(--admin-line)] text-[var(--admin-ink)] hover:bg-[var(--admin-canvas)] h-9">
              <RefreshCw size={14}/> <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
          <button onClick={toggleTheme} className="w-9 h-9 rounded-none border border-[var(--admin-line)] bg-[var(--admin-surface)] flex items-center justify-center text-[var(--admin-ink)] hover:bg-[var(--admin-canvas)]">
            {theme==="dark" ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
          <button className="w-9 h-9 rounded-none border border-[var(--admin-line)] bg-[var(--admin-surface)] flex items-center justify-center text-[var(--admin-ink)] hover:bg-[var(--admin-canvas)]">
            <Bell size={16}/>
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-[var(--admin-line)]">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold text-[var(--admin-ink)] leading-none">{user?.name || user?.username || "Admin"}</div>
              <div className="text-[11px] tracking-widest uppercase text-[var(--admin-ink-muted)] font-medium">Administrator</div>
            </div>
            <div className="w-9 h-9 rounded-none bg-[var(--admin-accent)] text-[var(--admin-accent-fg)] flex items-center justify-center">
              <User size={16}/>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
