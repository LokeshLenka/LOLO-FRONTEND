import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  User as UserAvatar,
  Chip,
  Divider,
  Textarea,
  Tooltip,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import {
  Briefcase,
  Music,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  ShieldCheck,
  ChevronLeft,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Mic2,
  Heart,
  Users,
  Trophy,
  History,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

// --- Types based on your JSON ---

interface ProfileBase {
  uuid: string;
  first_name: string;
  last_name: string;
  reg_num: string;
  branch: string;
  year: string;
  phone_no: string;
  gender: string;
  sub_role: string;
  experience?: string;
  lateral_status: number;
  hostel_status: number;
  college_hostel_status: number;
}

interface MusicProfile extends ProfileBase {
  instrument_avail: number;
  other_fields_of_interest: string;
  passion: string;
}

interface ManagementProfile extends ProfileBase {
  interest_towards_lolo: string;
  any_club: string;
}

interface UserApproval {
  status: string;
  remarks: string | null;
}

interface UserDetails {
  uuid: string;
  username: string | null;
  email: string;
  role: "music" | "management";
  is_approved: boolean;
  created_at: string;
  music_profile: MusicProfile | null;
  management_profile: ManagementProfile | null;
  user_approval: UserApproval;
}

// --- Helper Components ---

const DetailRow = ({
  label,
  value,
  icon: Icon,
  copyable = false,
  fullWidth = false,
}: {
  label: string;
  value?: string | number | null;
  icon?: any;
  copyable?: boolean;
  fullWidth?: boolean;
}) => {
  return (
    <div
      className={`group flex flex-col gap-1.5 py-2 ${
        fullWidth ? "col-span-1 md:col-span-2" : "col-span-1"
      }`}
    >
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        {Icon && <Icon size={14} className="opacity-70" />}
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words leading-relaxed">
          {value || (
            <span className="text-gray-400 dark:text-gray-600 italic text-xs">
              Not provided
            </span>
          )}
        </span>
        {copyable && value && (
          <Tooltip content="Copy">
            <button
              onClick={() => {
                navigator.clipboard.writeText(String(value));
                toast.success("Copied!");
              }}
              className="opacity-0 group-hover:opacity-100 text-xs text-[#03a1b0] font-medium transition-opacity px-1"
            >
              Copy
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const BooleanChip = ({
  label,
  value,
}: {
  label: string;
  value: number | boolean;
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
      {label}
    </span>
    {value ? (
      <Chip
        size="sm"
        startContent={<Check size={12} />}
        classNames={{
          base: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-none",
        }}
      >
        Yes
      </Chip>
    ) : (
      <Chip
        size="sm"
        startContent={<X size={12} />}
        classNames={{
          base: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-none",
        }}
      >
        No
      </Chip>
    )}
  </div>
);

/** Retrieves User Object safely */
const getUserFromStorage = (): any => {
  try {
    const raw = localStorage.getItem("userProfile");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Error parsing user from storage", e);
    return null;
  }
};

const currentUser = getUserFromStorage();

const promotedRole = currentUser?.promoted_role;

export default function ApplicantDetailsPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [processingAction, setProcessingAction] = useState<
    "approve" | "reject" | null
  >(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/ebm/view/application/user/${uuid}`,
        );
        setUser(response.data.data);
        if (response.data.data.user_approval?.remarks) {
          setRemarks(response.data.data.user_approval.remarks);
        }
      } catch (err: any) {
        toast.error("Failed to load applicant details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchDetails();
  }, [uuid, API_BASE_URL, navigate]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!remarks.trim()) {
      toast.error("Please enter remarks before proceeding.");
      return;
    }

    if (remarks.trim().length < 10) {
      toast.error("Remarks must be at least 10 characters long.");
      return;
    }

    setProcessingAction(action);
    const toastId = toast.loading(
      `${action === "approve" ? "Approving" : "Rejecting"}...`,
    );

    try {
      await axios.post(`${API_BASE_URL}/ebm/${action}-user/${uuid}`, {
        remarks: remarks,
      });

      toast.success(`User ${action}d successfully!`, { id: toastId });
      navigate(-1);
    } catch (err: any) {
      const msg =
        err.response?.data?.errors?.remarks?.[0] ||
        err.response?.data?.message ||
        "Action failed";
      toast.error(msg, { id: toastId });
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) return <DetailsSkeleton />;
  if (!user) return null;

  const isMusic = user.role === "music";
  const profile = isMusic ? user.music_profile : user.management_profile;
  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user.username || "Unknown User";

  const renderRoleSpecifics = () => {
    if (isMusic && user.music_profile) {
      const p = user.music_profile;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <DetailRow
              icon={Mic2}
              label="Instrument / Skill"
              value={p.sub_role?.replace(/_/g, " ")}
            />
            <DetailRow icon={History} label="Experience" value={p.experience} />
            <DetailRow
              fullWidth
              icon={Heart}
              label="Passion / Why Music?"
              value={p.passion}
            />
            <DetailRow
              fullWidth
              icon={Trophy}
              label="Other Interests"
              value={p.other_fields_of_interest}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <BooleanChip label="Owns Instrument?" value={p.instrument_avail} />
            <BooleanChip label="Lateral Entry?" value={p.lateral_status} />
          </div>
        </div>
      );
    } else if (!isMusic && user.management_profile) {
      const p = user.management_profile;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <DetailRow
              icon={Briefcase}
              label="Management Role"
              value={p.sub_role?.replace(/_/g, " ")}
            />
            <DetailRow icon={History} label="Experience" value={p.experience} />
            <DetailRow
              fullWidth
              icon={Users}
              label="Club History"
              value={p.any_club}
            />
            <DetailRow
              fullWidth
              icon={Heart}
              label="Interest Description"
              value={p.interest_towards_lolo}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <BooleanChip label="Lateral Entry?" value={p.lateral_status} />
          </div>
        </div>
      );
    }
    return (
      <div className="text-gray-400 italic py-4">
        No specific profile data available.
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-gray-50/50 dark:bg-black/10 pb-12 font-sans">
      <div className="max-w-7xl mx-auto py-4 md:p-8 space-y-6">
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Breadcrumbs
              size="sm"
              variant="light"
              className="pl-0 text-xs sm:text-md"
            >
              <BreadcrumbItem>{promotedRole}</BreadcrumbItem>
              <BreadcrumbItem>pending_approvals</BreadcrumbItem>
              <BreadcrumbItem>user</BreadcrumbItem>
              <BreadcrumbItem>{user.uuid}</BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <Button
            size="sm"
            variant="flat"
            startContent={<ChevronLeft size={16} />}
            onPress={() => navigate(-1)}
            className="font-medium hover:border-b hover:border-b-gray-900 hover:dark:border-b-gray-100 transition-border duration-300"
          >
            Back to List
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Data View (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Identity Card */}
            <Card className="border border-black/5 dark:border-white/5 shadow-sm bg-white dark:bg-white/1 overflow-visible">
              <div
                className={`h-28 w-full rounded-t-xl ${
                  isMusic
                    ? "bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10"
                    : "bg-gradient-to-r from-sky-600/10 to-blue-600/10"
                } relative overflow-hidden`}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(currentColor 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>
              </div>

              <CardBody className="px-6 pb-6 pt-0 relative overflow-visible">
                <div className="flex flex-col sm:flex-row gap-5 -mt-12 items-start sm:items-end">
                  <div className="relative shrink-0 z-10">
                    <div className="p-1.5 bg-white dark:bg-[#18181b] rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                      <UserAvatar
                        name={fullName}
                        className="w-24 h-24 text-3xl text-white rounded-xl shadow-md"
                        classNames={{
                          base: isMusic ? "bg-violet-600" : "bg-sky-600",
                          name: "hidden",
                        }}
                        avatarProps={{
                          fallback: isMusic ? (
                            <Music size={40} />
                          ) : (
                            <Briefcase size={40} />
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5 mb-1 min-w-0 w-full">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white break-all leading-tight">
                        {fullName}
                      </h2>

                      <div className="flex items-center gap-2 mt-1">
                        <Chip
                          size="sm"
                          variant="flat"
                          className={`${
                            isMusic
                              ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                              : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                          } font-bold border-none h-6`}
                        >
                          {isMusic ? "Musician" : "Management"}
                        </Chip>
                        <span className="text-xs text-gray-400 font-mono">
                          ID: {user.uuid.substring(0, 8)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 pt-1">
                      <span className="flex items-center gap-1.5 truncate max-w-full">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} className="shrink-0" />
                        {profile?.phone_no || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* 2. Academic & Personal Info */}
            <Card className="border border-black/5 dark:border-white/5 shadow-sm">
              <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
                  <GraduationCap size={18} className="text-[#03a1b0]" />
                  <h3>Academic Profile</h3>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <DetailRow
                    icon={ShieldCheck}
                    label="Reg Number"
                    value={profile?.reg_num}
                    copyable
                  />
                  <DetailRow
                    icon={Building}
                    label="Branch"
                    value={profile?.branch?.toUpperCase()}
                  />
                  <DetailRow
                    icon={Calendar}
                    label="Year/Batch"
                    value={profile?.year}
                  />
                  <DetailRow
                    icon={User}
                    label="Gender"
                    value={profile?.gender}
                  />
                </div>
                <Divider className="my-6 bg-gray-100 dark:bg-white/5" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BooleanChip
                    label="Hostel Resident?"
                    value={profile?.hostel_status || 0}
                  />
                  <BooleanChip
                    label="College Hostel?"
                    value={profile?.college_hostel_status || 0}
                  />
                </div>
              </CardBody>
            </Card>

            {/* 3. Role Specific Details */}
            <Card className="border border-black/5 dark:border-white/5 shadow-sm">
              <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
                  {isMusic ? (
                    <Music size={18} className="text-violet-500" />
                  ) : (
                    <Briefcase size={18} className="text-sky-500" />
                  )}
                  <h3>{isMusic ? "Musical Profile" : "Management Profile"}</h3>
                </div>
              </CardHeader>
              <CardBody className="p-6">{renderRoleSpecifics()}</CardBody>
            </Card>
          </div>

          {/* RIGHT COLUMN: Action & Meta (Span 4) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            {/* Meta Card */}
            <Card className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-none">
              <CardBody className="p-4 space-y-3">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Application ID</span>
                  <span className="font-mono text-gray-700 dark:text-gray-300">
                    {user.uuid.substring(0, 12)}...
                  </span>
                </div>
                <Divider className="bg-gray-200 dark:bg-white/10" />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Submitted On</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* Decision Panel - FIXED OVERFLOW ISSUE */}
            <Card className="border border-black/5 dark:border-white/5 shadow-md bg-white dark:bg-transparent overflow-visible">
              <CardHeader className="pb-0 pt-5 px-5 flex flex-col items-start gap-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Admin Decision
                </h3>
                <p className="text-xs text-gray-500">
                  Review the application carefully before taking action.
                </p>
              </CardHeader>
              <CardBody className="p-5 flex flex-col gap-6">
                {/* Remarks Section */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
                      Remarks / Reason
                    </label>
                    <span className="text-xs text-red-500 font-medium">
                      * Required
                    </span>
                  </div>
                  <Textarea
                    placeholder="Enter feedback for the applicant..."
                    minRows={5}
                    variant="bordered"
                    radius="sm"
                    value={remarks}
                    onValueChange={setRemarks}
                    required
                    classNames={{
                      input: "outline-none focus:outline-none",
                      inputWrapper: `
                              border-none
                              shadow-none
                              focus-within:border-none
                              focus-within:shadow-none
                              hover:border-none
                            `,
                    }}
                  />
                </div>

                {/* Previous Remark (if any) */}
                {user.user_approval.remarks &&
                  user.user_approval.status !== "pending" && (
                    <div className="p-3 rounded bg-gray-100 dark:bg-white/10 text-xs text-gray-600 dark:text-gray-400 italic">
                      <strong>Previous Remark:</strong> "
                      {user.user_approval.remarks}"
                    </div>
                  )}

                {/* Actions Section - Now cleanly separated below textarea */}
                <div className="grid grid-cols-2 gap-3 mt-auto pt-20">
                  <Button
                    size="md"
                    color="danger"
                    variant="flat"
                    className="bg-red-700 text-white font-semibold h-10"
                    startContent={<XCircle size={18} />}
                    onPress={() => handleAction("reject")}
                    isLoading={processingAction === "reject"}
                    isDisabled={!!processingAction}
                  >
                    Reject
                  </Button>
                  <Button
                    size="md"
                    className="bg-[#03a1b0] text-white font-semibold shadow-lg shadow-[#03a1b0]/20 h-10"
                    startContent={<CheckCircle2 size={18} />}
                    onPress={() => handleAction("approve")}
                    isLoading={processingAction === "approve"}
                    isDisabled={!!processingAction}
                  >
                    Approve
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

const DetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto p-6 space-y-8 animate-pulse">
    <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-6">
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>
      <div className="lg:col-span-4">
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>
    </div>
  </div>
);
