import * as React from "react";
import { Card, CardBody, Button, Avatar, Chip, Divider } from "@heroui/react";
import {
  User,
  Shield,
  Briefcase,
  Music,
  Calendar,
  MapPin,
  Phone,
  Lock,
  Activity,
  CheckCircle2,
  Crown, // Icon for Promoted Roles
} from "lucide-react";

// --- Types ---

// Enums from PHP
enum UserRole {
  ADMIN = "admin",
  MANAGEMENT = "management",
  MUSIC = "music",
  PUBLIC = "public",
}

enum PromotedRole {
  EBM = "executive_body_member",
  CM = "credit_manager",
  MH = "membership_head",
  NONE = "none",
}

interface BaseProfile {
  first_name: string;
  last_name: string;
  reg_num: string;
  branch: string;
  year: string;
  phone_no: string;
  sub_role: string; // e.g., "Guitarist" or "Event Organizer"
}

interface MusicProfile extends BaseProfile {
  instrument_avail: string;
}

interface ManagementProfile extends BaseProfile {
  // Add specific management fields if any
}

interface UserData {
  uuid: string;
  username: string;
  email: string;
  role: UserRole;
  promoted_role?: PromotedRole; // Nullable
  is_active: boolean;
  last_login_at: string;
  managementProfile?: ManagementProfile;
  musicProfile?: MusicProfile;
}

// --- Mock Data (Scenario: Musician promoted to Executive Body Member) ---
const MOCK_USER: UserData = {
  uuid: "user-uuid-123",
  username: "alex_rhythm",
  email: "alex@university.edu",
  role: UserRole.MUSIC, // Base Role
  promoted_role: PromotedRole.EBM, // Promoted Role (Executive Body Member)
  is_active: true,
  last_login_at: new Date().toISOString(),
  // Only Music Profile exists
  musicProfile: {
    first_name: "Alex",
    last_name: "Doe",
    reg_num: "REG2023001",
    branch: "Computer Science",
    year: "3rd Year",
    sub_role: "Guitarist",
    phone_no: "+91 98765 43210",
    instrument_avail: "Yes",
  },
};

const MOCK_ABILITIES = [
  "events:create", // EBM ability
  "events:register", // Musician ability
  "blogs:create",
  "event_registrations:viewAny",
];

// --- Helpers ---

const getPromotedRoleLabel = (role: PromotedRole) => {
  switch (role) {
    case PromotedRole.EBM:
      return "Executive Body Member";
    case PromotedRole.CM:
      return "Credit Manager";
    case PromotedRole.MH:
      return "Membership Head";
    default:
      return null;
  }
};

// --- Sub-Components ---

const ProfileHeader = React.memo(
  ({ user, activeProfile }: { user: UserData; activeProfile: BaseProfile }) => {
    const fullName = `${activeProfile.first_name} ${activeProfile.last_name}`;
    const promotedLabel = user.promoted_role
      ? getPromotedRoleLabel(user.promoted_role)
      : null;

    return (
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Avatar */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#03a1b0] to-purple-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-200"></div>
          <Avatar
            src={`https://ui-avatars.com/api/?name=${fullName}&background=03a1b0&color=fff`}
            className="w-24 h-24 md:w-32 md:h-32 text-2xl relative border-4 border-white dark:border-black"
          />
          {/* Active Status Dot */}
          <div
            className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white dark:border-black ${
              user.is_active ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
        </div>

        {/* Info */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white mb-1">
            {fullName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mb-4">
            @{user.username}
          </p>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {/* 1. Promoted Badge (If exists - Highest Priority) */}
            {promotedLabel && (
              <Chip
                startContent={<Crown size={14} />}
                variant="shadow"
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-none font-bold shadow-orange-500/20 py-1 px-3"
              >
                {promotedLabel}
              </Chip>
            )}

            {/* 2. Base Role Badge (Music or Management) */}
            <Chip
              startContent={
                user.role === UserRole.MUSIC ? (
                  <Music size={14} />
                ) : (
                  <Briefcase size={14} />
                )
              }
              variant="flat"
              className="bg-[#03a1b0]/10 text-[#03a1b0] dark:text-[#03a1b0] font-bold uppercase py-0.5 px-3"
            >
              {user.role}
            </Chip>

            {/* 3. Sub Role (e.g. Guitarist) */}
            <Chip
              variant="flat"
              className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold py-0.5 px-3"
            >
              {activeProfile.sub_role}
            </Chip>
          </div>
        </div>
      </div>
    );
  }
);

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
    <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:text-[#03a1b0] transition-colors">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  </div>
);

const AbilitiesList = React.memo(({ abilities }: { abilities: string[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    {abilities.map((ability, idx) => (
      <div
        key={idx}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors"
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
));

// --- Main Component ---

export default function UserProfilePage() {
  const user = MOCK_USER;

  // Determine which profile to show (Music OR Management)
  const activeProfile =
    user.role === UserRole.MUSIC ? user.musicProfile : user.managementProfile;
  const isMusic = user.role === UserRole.MUSIC;

  // Guard: If data is missing/corrupt
  if (!activeProfile)
    return <div className="p-10 text-center">Profile Data Unavailable</div>;

  return (
    <section className="w-full min-h-screen py-1 md:p-8 flex justify-center items-start">
      <Card
        shadow="none"
        onDragStart={(e) => e.preventDefault()}
        className="
          w-full max-w-5xl select-none
          border border-black/10 dark:border-white/10
          bg-gradient-to-br from-white/95 to-white/85 
          backdrop-blur-xl backdrop-saturate-150
          dark:from-white/[0.08] dark:to-white/[0.02] 
          rounded-2xl overflow-hidden
        "
      >
        <CardBody className="p-0">
          {/* Decorative Header Background */}
          <div className="h-32 bg-gradient-to-r from-[#03a1b0]/20 to-purple-600/20 relative">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
          </div>

          <div className="px-6 md:px-10 pb-10 -mt-12">
            {/* 1. Header Section */}
            <ProfileHeader user={user} activeProfile={activeProfile} />

            <Divider className="my-8 bg-black/5 dark:bg-white/10" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 2. Details Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Personal Info Grid */}
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <User size={18} className="text-[#03a1b0]" /> Personal
                    Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/50 dark:bg-black/20 p-2 rounded-2xl border border-black/5 dark:border-white/5">
                    <DetailRow
                      icon={Briefcase}
                      label="Branch"
                      value={activeProfile.branch}
                    />
                    <DetailRow
                      icon={Calendar}
                      label="Year"
                      value={activeProfile.year}
                    />
                    <DetailRow
                      icon={Phone}
                      label="Contact"
                      value={activeProfile.phone_no}
                    />
                    <DetailRow
                      icon={MapPin}
                      label="Reg Number"
                      value={activeProfile.reg_num}
                    />
                  </div>
                </div>

                {/* Specific Role Stats (Conditional) */}
                {isMusic && user.musicProfile && (
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                      <Music size={18} className="text-purple-500" /> Music
                      Stats
                    </h3>
                    <div className="p-1 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <DetailRow
                          icon={Music}
                          label="Instrument"
                          value={user.musicProfile.sub_role}
                        />
                        <DetailRow
                          icon={CheckCircle2}
                          label="Instrument Owned"
                          value={user.musicProfile.instrument_avail}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Permissions */}
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-[#03a1b0]" /> Permissions
                  </h3>
                  <AbilitiesList abilities={MOCK_ABILITIES} />
                </div>
              </div>

              {/* 3. Security Sidebar */}
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
                        {new Date(user.last_login_at).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">
                        Account Status
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
                      className="w-full bg-black dark:bg-white text-white dark:text-black font-bold shadow-lg rounded-md py-5"
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
