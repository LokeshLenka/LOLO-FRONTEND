// src/pages/profile/ManagementProfile.tsx
import React from "react";
import ProfileCard, { type UserProfileData } from "./ProfileCard";
import {
  Briefcase,
  Calendar,
  Phone,
  MapPin,
  Crown,
  Megaphone,
} from "lucide-react";

// This would typically come from an API call
const MOCK_MGMT_USER = {
  uuid: "mgmt-123",
  username: "sarah_manager",
  email: "sarah@lolo.com",
  role: "management",
  promoted_role: "executive_body_member", // Example of promotion
  is_active: true,
  last_login_at: new Date().toISOString(),
  managementProfile: {
    first_name: "Sarah",
    last_name: "Manager",
    reg_num: "REG2024002",
    branch: "MBA",
    year: "2nd Year",
    phone_no: "+91 9876543211",
    sub_role: "event_organizer",
    experience: "2 years in event management",
  },
};

export default function ManagementProfile() {
  const user = MOCK_MGMT_USER;
  const profile = user.managementProfile;

  // Format Promoted Role Label
  const getPromotedLabel = (role?: string) => {
    if (role === "executive_body_member") return "Executive Body Member";
    if (role === "membership_head") return "Membership Head";
    return undefined;
  };

  // Transform Data
  const profileData: UserProfileData = {
    uuid: user.uuid,
    username: user.username,
    email: user.email,
    full_name: `${profile.first_name} ${profile.last_name}`,
    role_label: "Management",
    sub_role_label: profile.sub_role.replace("_", " "), // "Event Organizer"
    promoted_role_label: getPromotedLabel(user.promoted_role),
    is_active: user.is_active,
    last_login_at: user.last_login_at,

    personal_details: [
      { label: "Branch", value: profile.branch, icon: Briefcase },
      { label: "Year", value: profile.year, icon: Calendar },
      { label: "Contact", value: profile.phone_no, icon: Phone },
      { label: "Reg Number", value: profile.reg_num, icon: MapPin },
    ],

    role_specific_details: {
      title: "Management Info",
      icon: Crown,
      fields: [
        {
          label: "Role Focus",
          value: profile.sub_role.replace("_", " "),
          icon: Megaphone,
        },
        { label: "Experience", value: profile.experience, icon: Briefcase },
      ],
    },

    abilities: ["events:create", "members:view", "budget:manage"],
  };

  return <ProfileCard data={profileData} />;
}
