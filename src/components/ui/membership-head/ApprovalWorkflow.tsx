// src/components/membership-head/ApprovalWorkflow.tsx
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ApprovalData {
  status: string; // "pending", "ebm_approved", "rejected", "membership_head_approved", "membership_head_rejected", "admin_approved", "admin_rejected"
  ebm_approved_at?: string | null;
  membership_head_approved_at?: string | null;
  approved_at?: string | null; // Admin approval time
  remarks?: string | null;
  assigned_ebm_id?: number | null;
}

interface ApprovalWorkflowProps {
  userUuid: string;
  username: string;
  approvalData: ApprovalData | null;
  onApprove: (uuid: string, remarks: string) => Promise<boolean>;
  onReject: (uuid: string, remarks: string) => Promise<boolean>;
}

export function ApprovalWorkflow({
  userUuid,
  approvalData,
  onApprove,
  onReject,
}: ApprovalWorkflowProps) {
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!approvalData) {
    return (
      <div className="text-zinc-500 text-sm">
        No approval workflow data available for this user.
      </div>
    );
  }

  const { status } = approvalData;

  // Determine the current state of the workflow
  const isAdminOverridden =
    status === "admin_approved" || status === "admin_rejected";

  // EBM completed if they have a timestamp OR the status explicitly moved past them.
  const isEbmApproved =
    !!approvalData.ebm_approved_at ||
    status === "ebm_approved" ||
    status.startsWith("membership_head_");
  const isEbmRejected = status === "rejected";

  // MemHead completed if they have a timestamp OR the status explicitly says so.
  const isMemHeadApproved =
    !!approvalData.membership_head_approved_at ||
    status === "membership_head_approved";
  const isMemHeadRejected = status === "membership_head_rejected";

  // Is it currently the Membership Head's turn to act?
  const isActionable = status === "ebm_approved";

  const handleAction = async (type: "approve" | "reject") => {
    if (!remarks.trim()) return;
    setIsSubmitting(true);

    const formattedRemarks = `[Membership Head]: ${remarks}`;
    const success =
      type === "approve"
        ? await onApprove(userUuid, formattedRemarks)
        : await onReject(userUuid, formattedRemarks);

    if (!success) setIsSubmitting(false);
  };

  // Helper to render the step UI
  const StepNode = ({
    title,
    isActive,
    isComplete,
    isRejected,
    timestamp,
    description,
  }: any) => (
    <div className="flex flex-col relative">
      <div className="flex items-center gap-3 mb-1">
        <div
          className={`flex items-center justify-center h-8 w-8 rounded-full border-2 ${
            isRejected
              ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500"
              : isComplete
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"
                : isActive
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-400"
          }`}
        >
          {isRejected ? (
            <XCircle className="h-4 w-4" />
          ) : isComplete ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
        </div>
        <div>
          <h4
            className={`text-sm font-semibold ${isActive || isComplete || isRejected ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-400"}`}
          >
            {title}
          </h4>
          {(timestamp || description) && (
            <p className="text-xs text-zinc-500 mt-0.5">
              {timestamp ? new Date(timestamp).toLocaleString() : description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 1. Workflow Visualizer */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xs font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase mb-6">
          Approval Chain
        </h3>
        <div className="relative flex flex-col gap-6 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 ml-4">
          <div className="absolute -left-[17px] top-0 py-1">
            <StepNode
              title="EBM Review"
              isComplete={isEbmApproved}
              isRejected={isEbmRejected}
              isActive={status === "pending"}
              timestamp={approvalData.ebm_approved_at}
              description={
                status === "pending"
                  ? approvalData.assigned_ebm_id
                    ? "Assigned to EBM"
                    : "Awaiting EBM assignment"
                  : undefined
              }
            />
          </div>

          <div className="absolute -left-[17px] top-[70px] py-1">
            <StepNode
              title="Membership Head Review"
              isComplete={isMemHeadApproved && !isAdminOverridden}
              isRejected={isMemHeadRejected && !isAdminOverridden}
              isActive={status === "ebm_approved"}
              timestamp={approvalData.membership_head_approved_at}
              description={
                status === "pending"
                  ? "Waiting for EBM first"
                  : isEbmRejected
                    ? "Halted by EBM"
                    : undefined
              }
            />
          </div>
        </div>
        <div className="h-[120px]" />{" "}
        {/* Spacer for absolute positioned nodes */}
        {/* Admin Override Alert */}
        {isAdminOverridden && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 flex gap-3 items-start">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Admin Override
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                This workflow was manually resolved by a System Administrator on{" "}
                {new Date(approvalData.approved_at!).toLocaleString()}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Remarks Log */}
      {approvalData.remarks && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
            Workflow Remarks Log
          </Label>
          <div className="p-3 text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap font-mono text-xs">
            {approvalData.remarks}
          </div>
        </div>
      )}

      {/* 3. Action Form (Only visible if it is MemHead's turn) */}
      {isActionable && (
        <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-2">
            <AlertCircle className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Your Action Required</h3>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="remarks"
              className="text-zinc-700 dark:text-zinc-300"
            >
              Provide Remarks (Required)
            </Label>
            <Textarea
              id="remarks"
              placeholder="Explain your reason for approval or rejection..."
              className="rounded-none border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-zinc-900 min-h-[100px]"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              disabled={isSubmitting || !remarks.trim()}
              onClick={() => handleAction("approve")}
              className="flex-1 rounded-none bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />{" "}
              {isSubmitting ? "Processing..." : "Approve User"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting || !remarks.trim()}
              onClick={() => handleAction("reject")}
              className="flex-1 rounded-none border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <XCircle className="mr-2 h-4 w-4" />{" "}
              {isSubmitting ? "Processing..." : "Reject User"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
