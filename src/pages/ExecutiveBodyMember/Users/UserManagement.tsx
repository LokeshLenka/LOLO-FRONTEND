import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Spinner,
  Chip,
  Button,
} from "@heroui/react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  Calendar,
  Phone,
} from "lucide-react";

// Reusing your multi-step components
import { ManagementSignUp } from "@/components/forms/ManagementSignUp";
import { MusicSignUp } from "@/components/forms/MusicSignUp";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("create");
  const [category, setCategory] = useState("music");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Fetch registrations when the "List" tab is opened
  useEffect(() => {
    if (activeTab === "list") {
      fetchRegistrations();
    }
  }, [activeTab]);

  const fetchRegistrations = async () => {
    setIsLoadingList(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/ebm/view/my-user-registrations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      // Handle different possible API wrapper structures (e.g., response.data, response.data.data)
      const responseData = response.data?.data || response.data;

      // Strictly ensure we are setting an array
      if (Array.isArray(responseData)) {
        setRegistrations(responseData);
      } else if (responseData && Array.isArray(responseData.data)) {
        // Handle Laravel paginated response structure
        setRegistrations(responseData.data);
      } else {
        setRegistrations([]);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load registrations",
      );
      setRegistrations([]); // Fallback to empty array on error
    } finally {
      setIsLoadingList(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      {/* --- 1. Dashboard Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            User Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Onboard new members and track your previous registrations.
          </p>
        </div>
        <Chip
          startContent={<ShieldCheck size={16} />}
          variant="shadow"
          className="bg-[#03a1b0]/20 border border-[#03a1b0]/40 text-[#03a1b0] font-bold px-4 py-5"
        >
          EBM Portal
        </Chip>
      </div>

      {/* --- 2. Tabs Layout --- */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-black/10 dark:border-white/10",
          cursor: "w-full bg-[#03a1b0]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#03a1b0] font-semibold",
        }}
      >
        {/* CREATE USER TAB */}
        <Tab
          key="create"
          title={
            <div className="flex items-center space-x-2">
              <UserPlus size={18} />
              <span>Create User</span>
            </div>
          }
        >
          <div className="mt-6">
            {/* Category Selector integrated into Dashboard UI */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/5 dark:bg-white/5 p-4 rounded-2xl mb-6 backdrop-blur-sm border border-black/5 dark:border-white/5">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Registration Role
                </h3>
                <p className="text-xs text-gray-500">
                  Select the domain for the new member
                </p>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0 bg-black/10 dark:bg-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setCategory("music")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    category === "music"
                      ? "bg-[#03a1b0] text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Music
                </button>
                <button
                  onClick={() => setCategory("management")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    category === "management"
                      ? "bg-purple-500 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Management
                </button>
              </div>
            </div>

            {/* Embedded Multi-Step Forms */}
            <Card
              shadow="none"
              className="border border-black/5 dark:border-white/5 bg-[#030303] text-white rounded-[2rem] overflow-hidden"
            >
              <CardBody className="p-0 relative">
                {/* Background Accents (From your original code) */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#03a1b0]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 p-6 md:p-12">
                  {category === "music" ? (
                    <MusicSignUp />
                  ) : (
                    <ManagementSignUp />
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* REGISTRATION LIST TAB */}
        <Tab
          key="list"
          title={
            <div className="flex items-center space-x-2">
              <Users size={18} />
              <span>My Registrations</span>
            </div>
          }
        >
          <div className="mt-6 space-y-4">
            {isLoadingList ? (
              <div className="flex justify-center p-12">
                <Spinner color="primary" size="lg" />
              </div>
            ) : !Array.isArray(registrations) || registrations.length === 0 ? (
              <div className="text-center p-12 text-gray-500 border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 rounded-2xl">
                No users created yet. Switch to the Create tab to add someone.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registrations.map((user: any, i: number) => (
                  <Card
                    key={user?.id || i}
                    shadow="none"
                    className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <CardBody className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white capitalize">
                            {user?.first_name} {user?.last_name}
                          </h4>
                          <p className="text-xs font-mono text-gray-500">
                            {user?.reg_num || "N/A"}
                          </p>
                        </div>
                        <Chip
                          size="sm"
                          className={`${
                            user?.role === "music"
                              ? "bg-[#03a1b0]/20 text-[#03a1b0]"
                              : "bg-purple-500/20 text-purple-500"
                          } font-bold uppercase text-[10px]`}
                        >
                          {user?.role || "User"}
                        </Chip>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Mail size={14} /> {user?.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Phone size={14} /> {user?.phone_no || "N/A"}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-between items-center text-xs">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "Just now"}
                        </span>
                        <Button
                          size="sm"
                          variant="flat"
                          className="text-[#03a1b0] bg-[#03a1b0]/10 font-bold"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
