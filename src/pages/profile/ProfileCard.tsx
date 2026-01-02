// src/components/profile/ProfileCard.tsx
import React from "react";
import { Card, CardBody, Avatar, Chip, Divider, Button } from "@heroui/react";
import {
  User,
  Briefcase,
  Calendar,
  Phone,
  MapPin,
  Music,
  Shield,
  Activity,
  Lock,
  Crown,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

// --- Generic Interfaces for Reusability ---
export interface ProfileField {
  label: string;
  value: string | number;
  icon: LucideIcon;
  highlight?: boolean; // For special styling (e.g., Instrument Owned)
}

export interface UserProfileData {
  uuid: string;
  username: string;
  email: string;
  full_name: string;
  role_label: string;
  sub_role_label: string;
  promoted_role_label?: string;
  is_active: boolean;
  last_login_at: string;

  // Sections of data
  personal_details: ProfileField[];
  role_specific_details?: {
    title: string;
    icon: LucideIcon;
    fields: ProfileField[];
  };
  abilities?: string[];
}

// --- Helper Components ---

const DetailRow = ({ field }: { field: ProfileField }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
    <div
      className={`p-2 rounded-lg transition-colors ${
        field.highlight
          ? "bg-green-500/10 text-green-600 dark:text-green-400"
          : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:text-[#03a1b0]"
      }`}
    >
      <field.icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {field.label}
      </p>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {field.value}
      </p>
    </div>
  </div>
);

const ProfileHeader = ({ data }: { data: UserProfileData }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      {/* Avatar */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#03a1b0] to-purple-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-200"></div>
        <Avatar
          src={`https://ui-avatars.com/api/?name=${data.full_name}&background=03a1b0&color=fff`}
          className="w-24 h-24 md:w-32 md:h-32 text-2xl relative border-4 border-white dark:border-black"
        />
        <div
          className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white dark:border-black ${
            data.is_active ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
      </div>

      {/* Info */}
      <div className="text-center md:text-left flex-1">
        <h1 className="text-3xl font-black tracking-tight text-black dark:text-white mb-1">
          {data.full_name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mb-4">
          @{data.username}
        </p>

        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {/* Promoted Role Badge */}
          {data.promoted_role_label && (
            <Chip
              startContent={<Crown size={14} />}
              variant="shadow"
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none font-bold shadow-orange-500/20 py-1 px-3"
            >
              {data.promoted_role_label}
            </Chip>
          )}

          {/* Base Role Badge */}
          <Chip
            startContent={
              data.role_label === "Music" ? (
                <Music size={14} />
              ) : (
                <Briefcase size={14} />
              )
            }
            variant="flat"
            className="bg-[#03a1b0]/10 text-[#03a1b0] dark:text-[#03a1b0] font-bold uppercase py-0.5 px-3"
          >
            {data.role_label}
          </Chip>

          {/* Sub Role Badge */}
          <Chip
            variant="flat"
            className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold py-0.5 px-3"
          >
            {data.sub_role_label}
          </Chip>
        </div>
      </div>
    </div>
  );
};

export default function ProfileCard({ data }: { data: UserProfileData }) {
  return (
    <section className="w-full min-h-screen py-1 md:p-8 flex justify-center items-start">
      <Card
        shadow="none"
        className="w-full max-w-5xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl dark:from-white/[0.08] dark:to-white/[0.02] rounded-2xl overflow-hidden"
      >
        <CardBody className="p-0">
          <div className="h-32 bg-gradient-to-r from-[#03a1b0]/20 to-purple-600/20 relative">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
          </div>

          <div className="px-6 md:px-10 pb-10 -mt-12">
            <ProfileHeader data={data} />
            <Divider className="my-8 bg-black/5 dark:bg-white/10" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Personal Details Section */}
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <User size={18} className="text-[#03a1b0]" /> Personal
                    Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/50 dark:bg-black/20 p-2 rounded-2xl border border-black/5 dark:border-white/5">
                    {data.personal_details.map((field, i) => (
                      <DetailRow key={i} field={field} />
                    ))}
                  </div>
                </div>

                {/* Role Specific Details (Music/Management) */}
                {data.role_specific_details && (
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                      <data.role_specific_details.icon
                        size={18}
                        className="text-purple-500"
                      />
                      {data.role_specific_details.title}
                    </h3>
                    <div className="p-1 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {data.role_specific_details.fields.map((field, i) => (
                          <DetailRow key={i} field={field} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Abilities / Permissions */}
                {data.abilities && (
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-[#03a1b0]" />{" "}
                      Permissions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {data.abilities.map((ability, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/10"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-green-600 dark:text-green-400 shrink-0"
                          />
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 font-mono">
                            {ability}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar */}
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <Activity size={16} className="text-gray-500" /> Activity
                    Log
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">
                        Last Login
                      </p>
                      <p className="text-xs font-mono text-gray-800 dark:text-gray-200 mt-1">
                        {new Date(data.last_login_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">
                        Status
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Lock size={12} className="text-green-500" />
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">
                          Secure
                        </span>
                      </div>
                    </div>
                    <Divider className="bg-black/5 dark:bg-white/5" />
                    <Button
                      className="w-full bg-black dark:bg-white text-white dark:text-black font-bold shadow-lg"
                      size="sm"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
