import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";
import { Modal, ModalContent } from "@heroui/react";

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

import { toast } from "sonner"; // Ensure this is imported

export function DecisionPanelContent({
  user,
  remarks,
  setRemarks,
  processingAction,
  handleAction,
}: {
  user: UserDetails;
  remarks: string;
  setRemarks: (v: string) => void;
  processingAction: "approve" | "reject" | null;
  handleAction: (a: "approve" | "reject") => void;
}) {
  // Validation function
  const validateAndProceed = (action: "approve" | "reject") => {
    if (remarks.trim().length < 10) {
      toast.error("Remarks must be at least 10 characters long.");
      return;
    }
    handleAction(action);
  };

  return (
    <>
      <CardHeader className="pb-0 pt-5 px-5 flex flex-col items-start gap-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Admin Decision
        </h3>
        <p className="text-xs text-gray-500">
          Review the application carefully before taking action.
        </p>
      </CardHeader>

      <CardBody className="p-5 flex flex-col gap-6">
        {/* Remarks */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
              Remarks / Reason
            </label>
            <span className="text-xs text-red-500 font-medium">*</span>
          </div>

          <Textarea
            placeholder="Enter feedback for the applicant..."
            minRows={5}
            value={remarks}
            onValueChange={setRemarks}
            classNames={{
              input: "outline-none focus:outline-none",
              inputWrapper:
                "border-none shadow-none focus-within:border-none hover:border-none",
            }}
          />
        </div>

        {/* Previous Remark */}
        {user.user_approval.remarks &&
          user.user_approval.status !== "pending" && (
            <div className="p-3 rounded bg-gray-100 dark:bg-white/10 text-xs italic">
              <strong>Previous Remark:</strong> "{user.user_approval.remarks}"
            </div>
          )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-16">
          <Button
            color="danger"
            className="bg-red-700 text-white h-10"
            isLoading={processingAction === "reject"}
            isDisabled={!!processingAction}
            onPress={() => validateAndProceed("reject")}
          >
            Reject
          </Button>

          <Button
            className="bg-[#03a1b0] text-white h-10"
            isLoading={processingAction === "approve"}
            isDisabled={!!processingAction}
            onPress={() => validateAndProceed("approve")}
          >
            Approve
          </Button>
        </div>
      </CardBody>
    </>
  );
}
