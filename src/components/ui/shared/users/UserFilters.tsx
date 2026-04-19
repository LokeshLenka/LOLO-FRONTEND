// src/components/membership-head/UserFilters.tsx
import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type UserFilters as FilterType } from "@/hooks/useUsers";

interface UserFiltersProps {
  filters: FilterType;
  setFilters: (filters: FilterType) => void;
  onResetPage: () => void;
}

export function UserFilters({
  filters,
  setFilters,
  onResetPage,
}: UserFiltersProps) {
  // Local state for debouncing the search input
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Debounce search input (waits 500ms after user stops typing before calling API)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filters.search !== searchValue) {
        setFilters({ ...filters, search: searchValue });
        onResetPage();
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchValue, filters, setFilters, onResetPage]);

  // Count active filters (excluding search)
  const activeFilterCount = Object.keys(filters).filter(
    (key) =>
      key !== "search" &&
      filters[key as keyof FilterType] !== "all" &&
      filters[key as keyof FilterType] !== undefined,
  ).length;

  const handleFilterChange = (key: keyof FilterType, value: string) => {
    setFilters({ ...filters, [key]: value });
    onResetPage();
  };

  const clearFilters = () => {
    setFilters({ search: searchValue }); // Keep search, clear dropdowns
    onResetPage();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search name, reg num, email..."
          className="rounded-none pl-9 border-zinc-200 dark:border-zinc-800 bg-background focus-visible:ring-0 focus-visible:border-zinc-900"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue && (
          <button
            onClick={() => setSearchValue("")}
            className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="rounded-none border-zinc-200 dark:border-zinc-800 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-900 relative"
          >
            <Filter className="mr-2 h-4 w-4 text-zinc-500" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="default"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-zinc-900 text-white"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-80 rounded-none border-zinc-200 dark:border-zinc-800 p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Filter Users
            </h4>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-0 text-xs text-zinc-500 hover:text-zinc-900"
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Role
              </label>
              <Select
                value={filters.role || "all"}
                onValueChange={(val) => handleFilterChange("role", val)}
              >
                <SelectTrigger className="rounded-none border-zinc-200 dark:border-zinc-800 focus:ring-0">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Approval Status
              </label>
              <Select
                value={filters.status || "all"}
                onValueChange={(val) => handleFilterChange("status", val)}
              >
                <SelectTrigger className="rounded-none border-zinc-200 dark:border-zinc-800 focus:ring-0">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Branch
              </label>
              <Select
                value={filters.branch || "all"}
                onValueChange={(val) => handleFilterChange("branch", val)}
              >
                <SelectTrigger className="rounded-none border-zinc-200 dark:border-zinc-800 focus:ring-0 uppercase">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-800 h-48 overflow-y-auto">
                  <SelectItem value="all">ALL BRANCHES</SelectItem>
                  <SelectItem value="aids">AIDS</SelectItem>
                  <SelectItem value="aiml">AIML</SelectItem>
                  <SelectItem value="cse">CSE</SelectItem>
                  <SelectItem value="csd">CSD</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="ece">ECE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
