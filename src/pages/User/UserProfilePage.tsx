import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Hash,
  GitBranch,
  Calendar,
  Phone,
  Music,
  Briefcase,
  Mic2,
  Users,
  Heart,
  Star,
  LayoutGrid,
} from "lucide-react";
import type {
  APIResponse,
  UserProfileData,
  ProfileField,
  MusicProfile,
  ManagementProfile,
  SecurityData,
} from "@/types/types";
import ProfileCard from "../profile/ProfileCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to get token
const getAuthToken = () => localStorage.getItem("authToken");

// Helper to get user from storage
const getUserFromStorage = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export default function UserProfile() {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) throw new Error("No authentication token found.");

        const api = axios.create({
          baseURL: API_BASE_URL,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        // 1. Determine Role (Storage Fallback -> API)
        let role = getUserFromStorage()?.role;

        if (!role) {
          console.log("Role not in storage, fetching from /my-role...");
          const roleResponse = await api.get("/my-role");
          role = roleResponse.data.role; // Ensure /my-role returns { role: '...' }
        }

        if (!role || (role !== "music" && role !== "management")) {
          throw new Error("Invalid or undefined user role.");
        }

        // 2. Fetch Profile from Specific Endpoint
        const endpoint = `/${role}/my-profile`;
        const response = await api.get<APIResponse>(endpoint);

        // Destructure data. Note: We expect 'security' to be in this response now.
        // If your backend specific endpoints don't return security,
        // you might need to merge it or use defaults.
        const { user, abilities, security } = response.data.data;

        // 3. Map Data to UI Structure
        const mappedData = mapApiToProfile(user, abilities, security);
        setProfileData(mappedData);
      } catch (err: any) {
        console.error("Profile Fetch Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#03a1b0]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return profileData ? <ProfileCard data={profileData} /> : null;
}

// --- Mapper Function ---

function mapApiToProfile(
  user: any,
  abilities: string[],
  security: SecurityData | undefined
): UserProfileData {
  const role = user.role;
  const specificProfile =
    role === "music" ? user.music_profile : user.management_profile;

  if (!specificProfile) {
    throw new Error(`Profile data missing for role: ${role}`);
  }

  const fullName = `${specificProfile.first_name} ${specificProfile.last_name}`;

  // 1. Common Personal Details
  const personalDetails: ProfileField[] = [
    { label: "Reg Num", value: specificProfile.reg_num, icon: Hash },
    {
      label: "Branch",
      value: specificProfile.branch?.toUpperCase(),
      icon: GitBranch,
    },
    {
      label: "Year",
      value: specificProfile.year?.toUpperCase(),
      icon: Calendar,
    },
    { label: "Gender", value: specificProfile.gender, icon: User },
    { label: "Phone", value: specificProfile.phone_no, icon: Phone },
  ];

  // 2. Role Specific Details
  let roleSpecificDetails;

  if (role === "music") {
    const music = specificProfile as MusicProfile;
    roleSpecificDetails = {
      title: "Musician Details",
      icon: Music,
      fields: [
        {
          label: "Main Role",
          value: music.sub_role,
          icon: Mic2,
          highlight: true,
        },
        { label: "Experience", value: music.experience, icon: Star },
        { label: "Passion", value: music.passion, icon: Heart },
        {
          label: "Instrument",
          value: music.instrument_avail ? "Owned" : "Not Owned",
          icon: Music,
        },
      ],
    };
  } else {
    const mgmt = specificProfile as ManagementProfile;
    roleSpecificDetails = {
      title: "Management Details",
      icon: Briefcase,
      fields: [
        {
          label: "Designation",
          value: mgmt.sub_role,
          icon: Users,
          highlight: true,
        },
        { label: "Club", value: mgmt.any_club, icon: LayoutGrid },
        { label: "Interest", value: mgmt.interest_towards_lolo, icon: Heart },
        { label: "Experience", value: mgmt.experience, icon: Star },
      ],
    };
  }

  // 3. Security Data Handling
  // If the specific endpoint doesn't return security data, we provide safe defaults
  // so the ProfileCard doesn't crash.
  const safeSecurity: SecurityData = security || {
    last_login: user.last_login_at || null,
    recent_failed_attempts: 0,
    account_risk: "LOW",
  };

  return {
    uuid: user.uuid,
    username: user.username,
    email: user.email,
    full_name: fullName,
    role_label: role,
    sub_role_label: specificProfile.sub_role,
    promoted_role_label: user.promoted_role,
    is_active: !!user.is_active,

    security: safeSecurity,

    personal_details: personalDetails,
    role_specific_details: roleSpecificDetails,
    abilities: abilities,
  };
}
