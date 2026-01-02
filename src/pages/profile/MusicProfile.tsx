// src/pages/profile/MusicProfile.tsx
import React from "react";
import {
  Briefcase,
  Calendar,
  Phone,
  MapPin,
  Music,
  CheckCircle2,
  Star,
} from "lucide-react";
import ProfileCard, { type UserProfileData } from "./ProfileCard";

// This would typically come from an API call
const MOCK_MUSIC_USER = {
  uuid: "music-123",
  username: "alex_rhythm",
  email: "alex@music.com",
  role: "music",
  is_active: true,
  last_login_at: new Date().toISOString(),
  musicProfile: {
    first_name: "Alex",
    last_name: "Rhythm",
    reg_num: "REG2024001",
    branch: "CSE",
    year: "3rd Year",
    phone_no: "+91 9876543210",
    sub_role: "Guitarist", // e.g. Vocalist, Guitarist
    instrument_avail: 1, // boolean from DB
    passion: "Creating fusion rock music",
  },
};

export default function MusicProfile() {
  const user = MOCK_MUSIC_USER;
  const profile = user.musicProfile;

  // Transform Data to Generic Format
  const profileData: UserProfileData = {
    uuid: user.uuid,
    username: user.username,
    email: user.email,
    full_name: `${profile.first_name} ${profile.last_name}`,
    role_label: "Music",
    sub_role_label: profile.sub_role, // "Guitarist"
    is_active: user.is_active,
    last_login_at: user.last_login_at,

    personal_details: [
      { label: "Branch", value: profile.branch, icon: Briefcase },
      { label: "Year", value: profile.year, icon: Calendar },
      { label: "Contact", value: profile.phone_no, icon: Phone },
      { label: "Reg Number", value: profile.reg_num, icon: MapPin },
    ],

    role_specific_details: {
      title: "Music Stats",
      icon: Music,
      fields: [
        { label: "Instrument", value: profile.sub_role, icon: Music },
        {
          label: "Instrument Owned",
          value: profile.instrument_avail ? "Yes" : "No",
          icon: CheckCircle2,
          highlight: !!profile.instrument_avail,
        },
        { label: "Passion", value: profile.passion, icon: Star },
      ],
    },

    abilities: ["events:register", "jam:join", "resources:access"],
  };

  return <ProfileCard data={profileData} />;
}
