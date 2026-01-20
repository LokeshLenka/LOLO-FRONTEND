import { type LucideIcon } from "lucide-react";

// 1. Define ProfileField first so it can be used below
export interface ProfileField {
  label: string;
  value: string | number;
  icon: LucideIcon;
  highlight?: boolean;
}

export interface SecurityData {
  last_login: string | null;
  recent_failed_attempts: number;
  account_risk: "HIGH" | "LOW";
}

export interface MusicProfile {
  first_name: string;
  last_name: string;
  reg_num: string;
  branch: string;
  year: string;
  phone_no: string;
  gender: string;
  sub_role: string;
  instrument_avail: number;
  experience: string;
  passion: string;
}

export interface ManagementProfile {
  first_name: string;
  last_name: string;
  reg_num: string;
  branch: string;
  year: string;
  phone_no: string;
  gender: string;
  sub_role: string;
  experience: string;
  interest_towards_lolo: string;
  any_club: string;
}

export interface BaseUser {
  uuid: string;
  username: string;
  email: string;
  is_active: number;
  last_login_at?: string;
  role: "music" | "management";
  promoted_role: string | null;
  management_profile: ManagementProfile | null;
  music_profile: MusicProfile | null;
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

  // Security Section
  security: SecurityData;

  // Details Sections
  personal_details: ProfileField[];
  role_specific_details?: {
    title: string;
    icon: LucideIcon;
    fields: ProfileField[];
  };
  abilities?: string[];
}

export interface APIResponse {
  status: string;
  code: number;
  message: string;
  data: {
    user: BaseUser;
    abilities: string[];
    security: SecurityData;
  };
}
