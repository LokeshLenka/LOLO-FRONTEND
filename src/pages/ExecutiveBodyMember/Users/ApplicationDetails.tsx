import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardBody,
  Button,
  User as UserAvatar,
  Chip,
  Divider,
  Textarea,
  Skeleton,
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
  MapPin,
  User,
  Hash,
  Clock,
  ShieldCheck,
  ChevronLeft,
  Phone,
  Mail,
  AlertCircle,
  Building,
  GraduationCap,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

// --- Types ---
interface ProfileData {
  first_name: string;
  last_name: string;
  reg_num: string;
  branch: string;
  year: string;
  gender: string;
  sub_role: string;
  phone?: string;
  email?: string;
}

interface UserDetails {
  uuid: string;
  username: string | null;
  role: "music" | "management";
  is_approved: boolean;
  music_profile: ProfileData | null;
  management_profile: ProfileData | null;
  user_approval: {
    ebm_assigned_at: string;
    status: string;
  };
  created_by?: {
    username: string;
  };
  created_at: string;
}

// --- Helper Components ---
const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-white/5">
    <Icon className="text-[#03a1b0]" size={20} />
    <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wide">
      {title}
    </h3>
  </div>
);

const DetailItem = ({ label, value, icon: Icon, isCopyable = false }: any) => (
  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
    <div className="mt-1 text-gray-400 group-hover:text-[#03a1b0] transition-colors">
      <Icon size={18} />
    </div>
    <div className="flex-1">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 break-all">
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </p>
        {isCopyable && value && (
          <Tooltip content="Copy">
            <button
              onClick={() => {
                navigator.clipboard.writeText(value);
                toast.success("Copied to clipboard");
              }}
              className="opacity-0 group-hover:opacity-100 text-xs text-[#03a1b0] font-medium hover:underline"
            >
              Copy
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  </div>
);

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

  // --- Fetch Data ---
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/ebm/view/application/user/${uuid}`,
        );
        setUser(response.data.data);
      } catch (err: any) {
        toast.error("Failed to load applicant details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchDetails();
  }, [uuid, API_BASE_URL, navigate]);

  // --- Handle Actions ---
  const handleAction = async (action: "approve" | "reject") => {
    if (!remarks.trim()) {
      toast.error("Please enter remarks before proceeding.");
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
      console.error(err);
      const msg =
        err.response?.data?.errors?.remarks?.[0] ||
        err.response?.data?.message ||
        "Action failed";
      toast.error(msg, { id: toastId });
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const profile =
    user.role === "music" ? user.music_profile : user.management_profile;
  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user.username;
  const isMusic = user.role === "music";

  return (
    <section className="min-h-screen bg-gray-50/50 dark:bg-black/5 pb-12">
      {" "}
      {/* Reduced bottom padding */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-5">
        {" "}
        {/* Reduced p-8 to p-6, space-y-6 to space-y-5 */}
        {/* 1. Header Section - Tighter vertical rhythm */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            {" "}
            {/* Tighter text spacing */}
            <Breadcrumbs size="sm" variant="solid" radius="lg">
              {/* ... breadcrumbs */}
            </Breadcrumbs>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Review Application
            </h1>
          </div>
          <Button
            size="sm" // Smaller button for enterprise density
            variant="bordered"
            startContent={<ChevronLeft size={16} />}
            onPress={() => navigate(-1)}
            className="font-semibold border-black/10 dark:border-white/10 bg-white dark:bg-black/20 h-9"
          >
            Back to List
          </Button>
        </div>
        {/* Main Grid - Reduced gap from 6 to 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN (Span 8) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Identity Card - Reduced padding & height */}
            <Card
              shadow="sm"
              className="border border-black/5 dark:border-white/5 bg-white dark:bg-[#18181b]"
            >
              <CardBody className="p-0">
                {/* Banner - Reduced height */}
                <div
                  className={`h-20 w-full ${isMusic ? "bg-gradient-to-r from-purple-600/20 to-indigo-600/20" : "bg-gradient-to-r from-blue-600/20 to-cyan-600/20"}`}
                />

                {/* Profile Section - Tighter layout */}
                <div className="px-5 pb-5 -mt-8 flex flex-col sm:flex-row items-start sm:items-end gap-4">
                  <div className="p-1 bg-white dark:bg-[#18181b] rounded-xl shadow-sm">
                    <UserAvatar
                      name={fullName}
                      className="transition-transform"
                      // The 'fallback' goes INSIDE avatarProps, not on the User component itself
                      avatarProps={{
                        src: undefined, // ensure no image source conflicts
                        className: `w-20 h-20 text-2xl font-bold rounded-lg ${
                          isMusic
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        }`,
                        fallback: isMusic ? (
                          <Music size={32} />
                        ) : (
                          <Briefcase size={32} />
                        ),
                        radius: "md",
                      }}
                      classNames={{
                        name: "hidden", // We are rendering name manually outside, so hide default
                        description: "hidden",
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-0.5 mb-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {fullName}
                      </h2>
                      <Chip
                        size="sm"
                        variant="dot"
                        color={isMusic ? "secondary" : "primary"}
                        className="border-none pl-1 h-6"
                      >
                        {user.role === "music" ? "Musician" : "Manager"}
                      </Chip>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      @{user.username}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-medium text-gray-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />{" "}
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={12} /> {uuid?.substring(0, 8)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Info Grid - Same gap 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Cards - Reduced internal padding to p-4 */}
              <Card
                shadow="sm"
                className="h-full border border-black/5 dark:border-white/5 bg-white dark:bg-[#18181b]"
              >
                <CardBody className="p-4">
                  <SectionHeader
                    icon={GraduationCap}
                    title="Academic Profile"
                  />
                  <div className="space-y-0.5">
                    {" "}
                    {/* Tighter list items */}
                    <DetailItem
                      icon={Building}
                      label="Branch"
                      value={profile?.branch}
                    />
                    <DetailItem
                      icon={ShieldCheck}
                      label="Reg No."
                      value={profile?.reg_num}
                      isCopyable
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Batch"
                      value={profile?.year}
                    />
                    <DetailItem
                      icon={Hash}
                      label="Gender"
                      value={profile?.gender}
                    />
                  </div>
                </CardBody>
              </Card>

              <Card
                shadow="sm"
                className="h-full border border-black/5 dark:border-white/5 bg-white dark:bg-[#18181b]"
              >
                <CardBody className="p-4">
                  <SectionHeader icon={User} title="Contact & Role" />
                  <div className="space-y-0.5">
                    <DetailItem
                      icon={Mail}
                      label="Email"
                      value={profile?.email}
                      isCopyable
                    />
                    <DetailItem
                      icon={Phone}
                      label="Phone"
                      value={profile?.phone}
                      isCopyable
                    />
                    <Divider className="my-2 bg-gray-100 dark:bg-white/5" />
                    <DetailItem
                      icon={Briefcase}
                      label="Sub-Role"
                      value={profile?.sub_role?.replace(/_/g, " ")}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* RIGHT COLUMN (Span 4) - Sticky */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
            {/* Status - Compact */}
            <Card
              shadow="none"
              className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30"
            >
              <CardBody className="p-3 flex items-center gap-3">
                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-500">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase leading-tight">
                    Status
                  </p>
                  <p className="text-sm font-bold text-amber-900 dark:text-amber-200 leading-tight">
                    Pending Review
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Action Panel - Compact */}
            <Card
              shadow="sm"
              className="border border-black/5 dark:border-white/5 bg-white dark:bg-[#18181b]"
            >
              <CardBody className="p-5">
                <SectionHeader icon={FileText} title="Decision" />

                <div className="space-y-4">
                  {" "}
                  {/* Reduced vertical space */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                        Remarks <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <Textarea
                      placeholder="Reason for decision..."
                      minRows={4} // Reduced height
                      variant="faded"
                      radius="md"
                      size="sm" // Smaller text input
                      value={remarks}
                      onValueChange={setRemarks}
                      classNames={{
                        inputWrapper:
                          "bg-gray-50 dark:bg-black/20 focus-within:bg-white border-black/10",
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {" "}
                    {/* Tighter button gap */}
                    <Button
                      size="sm" // Smaller buttons
                      color="danger"
                      variant="ghost"
                      className="font-bold border-small"
                      startContent={<XCircle size={16} />}
                      onPress={() => handleAction("reject")}
                      isLoading={processingAction === "reject"}
                      isDisabled={!!processingAction}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#03a1b0] text-white font-bold shadow-md"
                      startContent={<CheckCircle2 size={16} />}
                      onPress={() => handleAction("approve")}
                      isLoading={processingAction === "approve"}
                      isDisabled={!!processingAction}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="text-center">
              <p className="text-[10px] text-gray-400">
                {" "}
                {/* Smaller meta text */}
                ID: <span className="font-mono">{uuid}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
