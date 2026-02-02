// src/components/profile/ProfileCard.tsx
import type { UserProfileData, ProfileField } from "@/types/types";
import { Card, CardBody, Avatar, Chip, Divider, Progress } from "@heroui/react";
import {
  User,
  Briefcase,
  Music,
  Shield,
  Crown,
  CheckCircle2,
  Fingerprint,
  History,
  Lock,
  Globe,
  Activity,
} from "lucide-react";

// --- Components ---

const DetailRow = ({ field }: { field: ProfileField }) => (
  <div className="flex items-center gap-4 p-3.5 border border-black/5 dark:border-white/5 bg-white dark:bg-white/1 backdrop-blur-sm rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
    <div
      className={`p-2.5 rounded-xl transition-colors ${
        field.highlight
          ? "bg-[#03a1b0]/10 text-[#03a1b0]"
          : "bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:text-[#03a1b0] group-hover:bg-[#03a1b0]/5"
      }`}
    >
      <field.icon size={20} strokeWidth={1.5} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
        {field.label}
      </p>
      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
        {field.value}
      </p>
    </div>
  </div>
);

// Helper for Title Case (e.g., "event_organizer" -> "Event Organizer")
const toTitleCase = (str: string) => {
  if (!str) return "";
  return str
    .split(/[_ ]+/) // Split by underscore or space
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ProfileHeader = ({ data }: { data: UserProfileData }) => {
  // Process labels for display
  const displayRole = toTitleCase(data.role_label);
  const displaySubRole = toTitleCase(data.sub_role_label);
  const displayPromotedRole = data.promoted_role_label
    ? toTitleCase(data.promoted_role_label)
    : null;

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-end relative z-10 w-full">
      {/* Avatar Container */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#03a1b0] to-purple-600 rounded-full opacity-0 group-hover:opacity-75 blur-lg transition-opacity duration-700 ease-in-out"></div>

        <Avatar
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.full_name
          )}&background=03a1b0&color=fff&size=256&font-size=0.35&bold=true`}
          className="w-32 h-32 md:w-40 md:h-40 text-4xl relative border-[6px] border-white dark:border-[#18181b] shadow-2xl z-10"
          isBordered={false}
        />

        {/* Status Indicator */}
        <div className="absolute bottom-2 right-2 z-20">
          {data.is_active && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
          )}
          <div
            className={`relative w-8 h-8 rounded-full border-[4px] border-white dark:border-[#18181b] flex items-center justify-center shadow-sm ${
              data.is_active ? "bg-emerald-500" : "bg-rose-500"
            }`}
          >
            {data.is_active ? (
              <CheckCircle2 size={14} className="text-white stroke-[3px]" />
            ) : (
              <Lock size={14} className="text-white stroke-[3px]" />
            )}
          </div>
        </div>
      </div>

      {/* User Info Container */}
      <div className="text-center md:text-left flex-1 min-w-0 pb-1 w-full">
        {/* Name Row */}
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white truncate leading-tight">
            {data.full_name}
          </h1>
        </div>

        {/* Meta Data Row */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mb-6 text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-lg tracking-tight text-gray-600 dark:text-gray-300">
            @{data.username}
          </span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <Globe size={12} className="text-gray-400" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              {displayRole}
            </span>
          </div>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
          {/* 1. Promoted Role (Dynamic) */}
          {displayPromotedRole && (
            <Chip
              startContent={
                <Crown size={14} className="text-white/90 drop-shadow-sm" />
              }
              className="bg-gradient-to-br from-amber-400 to-orange-600 text-white border-none font-bold shadow-lg shadow-orange-500/25 h-9 px-1 pl-3"
              radius="sm"
            >
              <span className="px-1 text-sm tracking-wide drop-shadow-sm">
                {displayPromotedRole}
              </span>
            </Chip>
          )}

          {/* 2. Base Role (Dynamic) */}
          <Chip
            startContent={
              data.role_label.toLowerCase() === "music" ? (
                <Music size={15} strokeWidth={2.5} />
              ) : (
                <Briefcase size={15} strokeWidth={2.5} />
              )
            }
            variant="flat"
            className="bg-[#03a1b0]/10 text-[#03a1b0] dark:bg-[#03a1b0]/20 dark:text-[#03a1b0] border border-[#03a1b0]/20 font-bold uppercase h-9 px-2 tracking-wide"
            radius="sm"
          >
            {displaySubRole}
          </Chip>

          {/* 3. Sub Role (Dynamic)
          {displaySubRole && (
            <Chip
              variant="dot"
              color="secondary"
              className="border-gray-200 dark:border-gray-700 bg-transparent h-9 px-2 font-semibold text-gray-600 dark:text-gray-300"
              radius="sm"
            >
              {displaySubRole}
            </Chip>
          )} */}
        </div>
      </div>
    </div>
  );
};

// --- Security Widget ---

const SecurityDashboard = ({ data }: { data: UserProfileData }) => {
  const isHighRisk = data.security.account_risk === "HIGH";

  // Calculate percentage: Cap at 100%, assume 10 failed attempts is "full bar" for visual scale
  const failedAttempts = data.security.recent_failed_attempts;
  const progressValue = Math.min((failedAttempts / 10) * 100, 100);

  return (
    <div className="space-y-6">
      {/* 1. Risk Status Card */}
      <div className="relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-white/1 backdrop-blur-sm rounded-2xl h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        {/* Background Pattern */}
        <div
          className={`absolute top-0 right-0 p-8 opacity-10 ${
            isHighRisk ? "text-red-500" : "text-emerald-500"
          }`}
        >
          <Shield size={100} />
        </div>

        <div className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity
                size={16}
                className={isHighRisk ? "text-red-500" : "text-emerald-500"}
              />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Security Health
              </h3>
            </div>
            <Chip
              size="sm"
              variant="flat"
              color={isHighRisk ? "danger" : "success"}
              className="font-bold"
            >
              {isHighRisk ? "Action Needed" : "Secure"}
            </Chip>
          </div>

          <div className="flex items-end gap-3 mb-2">
            <span
              className={`text-4xl font-black tracking-tighter ${
                isHighRisk ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {data.security.account_risk}
            </span>
            <span className="text-sm font-semibold text-gray-400 mb-1.5">
              Risk Level
            </span>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed max-w-[80%]">
            {isHighRisk
              ? "Multiple failed login attempts detected. Recommended: Change password immediately."
              : "Your account meets all standard security protocols. No immediate threats detected."}
          </p>
        </div>

        {/* Status Bar at bottom */}
        <div
          className={`h-1.5 w-full ${
            isHighRisk ? "bg-red-500" : "bg-emerald-500"
          }`}
        />
      </div>

      {/* 2. Metrics Detail Card */}
      <div className="p-6 rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-white/1 backdrop-blur-sm rounded-2xl h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] space-y-8">
        {/* Header */}
        <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-3">
          <Fingerprint size={24} className="text-[#03a1b0]" />
          <span>Access Logs</span>
        </h3>

        {/* Failed Attempts Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-gray-400">
              Failed Attempts (7d)
            </span>
            <span
              className={`text-xl font-bold font-mono ${
                failedAttempts > 0 ? "text-orange-500" : "text-gray-500"
              }`}
            >
              {failedAttempts}
            </span>
          </div>

          <Progress
            size="sm"
            value={progressValue}
            color="warning" // Uses orange/yellow color scheme
            aria-label="Failed attempts"
            classNames={{
              base: "max-w-full",
              track: "bg-black/10 dark:bg-white/10 h-1.5", // Darker background track
              indicator: "bg-orange-500 h-1.5", // Explicit orange bar
            }}
          />
        </div>

        {/* Last Login Section */}
        <div className="flex gap-4 items-center">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
            <History size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              LAST AUTHENTICATED
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">
              {data.security.last_login
                ? new Date(data.security.last_login).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <p className="text-xs text-gray-400 font-medium">
                Session Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfileCard({ data }: { data: UserProfileData }) {
  return (
    <section className="w-full min-h-screen py-4 md:py-8 px-1 sm:px-16 flex justify-center items-start">
      <Card
        shadow="none"
        className="w-full max-w-6xl border border-gray-200 dark:border-white/10 bg-black/1 dark:bg-white/1 backdrop-blur-lg rounded-[2rem] overflow-hidden"
      >
        <CardBody className="p-0">
          {/* Hero Banner */}

          <div className="h-48 relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_70%)]" />
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md" />
          </div>

          <div className="px-6 md:px-12 pb-12 -mt-20">
            <ProfileHeader data={data} />

            <Divider className="my-10 bg-gray-100 dark:bg-white/5" />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              {/* Main Content (Left) - Spans 8 cols */}
              <div className="xl:col-span-8 space-y-10">
                {/* 1. Personal Details */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-[#03a1b0]/10 text-[#03a1b0]">
                      <User size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.personal_details.map((field, i) => (
                      <DetailRow key={i} field={field} />
                    ))}
                  </div>
                </section>

                {/* 2. Role Details */}
                {data.role_specific_details && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                        <data.role_specific_details.icon size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {data.role_specific_details.title}
                      </h3>
                    </div>
                    <div className="p-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data.role_specific_details.fields.map((field, i) => (
                          <DetailRow key={i} field={field} />
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* 3. Permissions */}
                {data.abilities && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                        <Shield size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        System Permissions
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {data.abilities.map((ability, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/1 border border-gray-200 dark:border-white/10 hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-green-500 shrink-0"
                          />
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300 font-mono tracking-tight">
                            {ability}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar (Right) - Spans 4 cols */}
              <div className="xl:col-span-4 space-y-8">
                <SecurityDashboard data={data} />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
