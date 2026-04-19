// src/components/membership-head/ViewUserSheet.tsx
import useSWR from "swr";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApprovalWorkflow } from "../../membership-head/ApprovalWorkflow";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

interface ViewUserSheetProps {
  userUuid: string | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (uuid: string, remarks: string) => Promise<boolean>;
  onReject: (uuid: string, remarks: string) => Promise<boolean>;
}

export function ViewUserSheet({
  userUuid,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ViewUserSheetProps) {
  // Fetch full details only when a user is selected and the sheet is open
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(
    isOpen && userUuid
      ? `${API_BASE_URL}/membership-head/users/${userUuid}`
      : null,
    fetcher,
  );

  const profile =
    user?.music_profile || user?.management_profile || user?.profile;
  const approval = user?.user_approval || user?.userApproval;

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex flex-col py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
        {label}
      </span>
      <span className="text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">
        {value || <span className="text-zinc-400 italic">N/A</span>}
      </span>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl w-full overflow-y-auto border-zinc-200 dark:border-zinc-800 bg-background p-0 rounded-none border-l shadow-2xl flex flex-col h-full">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              User Details
            </SheetTitle>
            <SheetDescription className="text-zinc-500">
              Complete profile and registration information.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-zinc-500">
              Loading details...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              Failed to load profile details.
            </div>
          ) : user ? (
            <>
              {/* Account Info */}
              <section>
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 mb-3 flex items-center justify-between">
                  Account Information
                  <Badge
                    variant="outline"
                    className="rounded-none capitalize border-zinc-200"
                  >
                    {user.role}
                  </Badge>
                </h3>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-800">
                  <DetailRow label="Username" value={user.username} />
                  <DetailRow label="Email Address" value={user.email} />
                  <DetailRow
                    label="Management Level"
                    value={
                      <span className="capitalize">
                        {user.management_level}
                      </span>
                    }
                  />
                  {user.promoted_role && (
                    <DetailRow
                      label="Promoted Role"
                      value={
                        <span className="capitalize">
                          {user.promoted_role.replace(/_/g, " ")}
                        </span>
                      }
                    />
                  )}
                  <DetailRow
                    label="Registered On"
                    value={new Date(user.created_at).toLocaleString("en-US", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  />
                </div>
              </section>

              {/* Profile Details */}
              {profile && (
                <section>
                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 mb-3">
                    Personal & Academic
                  </h3>
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-800">
                    <DetailRow
                      label="Full Name"
                      value={`${profile.first_name} ${profile.last_name || ""}`}
                    />
                    <DetailRow label="Phone Number" value={profile.phone_no} />
                    <DetailRow
                      label="Gender"
                      value={
                        <span className="capitalize">{profile.gender}</span>
                      }
                    />
                    <DetailRow
                      label="Registration Number"
                      value={profile.reg_num}
                    />
                    <DetailRow
                      label="Branch & Year"
                      value={
                        <span className="uppercase">
                          {profile.branch} -{" "}
                          <span className="capitalize">
                            {profile.year} Year
                          </span>
                        </span>
                      }
                    />
                    <DetailRow
                      label="Sub Role"
                      value={
                        <span className="capitalize">{profile.sub_role}</span>
                      }
                    />
                    <DetailRow
                      label="Lateral Entry"
                      value={profile.lateral_status ? "Yes" : "No"}
                    />
                    <DetailRow
                      label="Hostel Status"
                      value={profile.hostel_status ? "Yes" : "No"}
                    />
                    <DetailRow
                      label="College Hostel"
                      value={profile.college_hostel_status ? "Yes" : "No"}
                    />
                  </div>
                </section>
              )}

              {/* Registration Answers (Hidden from Edit) */}
              {profile &&
                (profile.passion ||
                  profile.experience ||
                  profile.other_fields_of_interest) && (
                  <section>
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 mb-3">
                      Registration Insights
                    </h3>
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-800">
                      <DetailRow
                        label="Experience"
                        value={profile.experience}
                      />
                      <DetailRow label="Passion" value={profile.passion} />
                      <DetailRow
                        label="Other Fields of Interest"
                        value={profile.other_fields_of_interest}
                      />
                    </div>
                  </section>
                )}

              {/* Approval Info */}
              {approval && (
                <section>
                  <ApprovalWorkflow
                    userUuid={user.uuid}
                    username={user.username}
                    approvalData={approval}
                    onApprove={async (uuid, remarks) => {
                      const success = await onApprove(uuid, remarks);
                      if (success) onClose(); // Close sheet on success
                      return success;
                    }}
                    onReject={async (uuid, remarks) => {
                      const success = await onReject(uuid, remarks);
                      if (success) onClose(); // Close sheet on success
                      return success;
                    }}
                  />
                </section>
              )}
            </>
          ) : null}
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 mt-auto shrink-0 bg-background">
          <Button
            type="button"
            onClick={onClose}
            className="w-full rounded-none bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Close Profile
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
