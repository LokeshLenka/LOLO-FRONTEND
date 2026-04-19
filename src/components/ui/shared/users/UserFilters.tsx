// src/components/shared/users/UserFilters.tsx
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

const branches = [
  { value: "aids", label: "AIDS" },
  { value: "aiml", label: "AIML" },
  { value: "cic", label: "CIC" },
  { value: "civil", label: "CIVIL" },
  { value: "csbs", label: "CSBS" },
  { value: "csd", label: "CSD" },
  { value: "cse", label: "CSE" },
  { value: "csg", label: "CSG" },
  { value: "csit", label: "CSIT" },
  { value: "ece", label: "ECE" },
  { value: "eee", label: "EEE" },
  { value: "it", label: "IT" },
  { value: "mech", label: "MECH" },
];

export function UserFilters({
  filters,
  setFilters,
  onResetPage,
}: UserFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filters.search !== searchValue) {
        setFilters({ ...filters, search: searchValue });
        onResetPage();
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchValue, filters, setFilters, onResetPage]);

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
    setFilters({ search: searchValue });
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
                  
                  {/* Fixed Status Values matching Backend Enums */}
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="ebm_approved">EBM Approved</SelectItem>
                  <SelectItem value="membership_approved">
                    Mem. Head Approved
                  </SelectItem>
                  <SelectItem value="admin_approved">Fully Approved</SelectItem>
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
                <SelectTrigger className="rounded-none border-zinc-200 dark:border-zinc-800 focus:ring-0">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-800 h-56 overflow-y-auto">
                  <SelectItem value="all">ALL BRANCHES</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
