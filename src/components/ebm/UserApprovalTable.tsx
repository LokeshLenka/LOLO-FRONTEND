import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Button,
  Tooltip,
  ButtonGroup,
} from "@heroui/react";
import { Check, X, Loader2, History, ListFilter } from "lucide-react";
import { toast } from "sonner";

// Define strict type based on API
interface PendingUser {
  uuid: string;
  name: string;
  email: string;
  registration_type: "music" | "management";
  created_at: string;
  status?: string; // For history view
}

export default function UserApprovalTable() {
  const [viewMode, setViewMode] = useState<"pending" | "history">("pending");
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch logic handles both endpoints based on viewMode
  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint =
        viewMode === "pending"
          ? `${API_BASE_URL}/ebm/pending-approvals`
          : `${API_BASE_URL}/ebm/my-approvals`;

      const response = await axios.get(endpoint);

      // Handle Laravel Response Wrapper
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load data");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [viewMode]);

  const handleAction = async (uuid: string, action: "approve" | "reject") => {
    setProcessingId(uuid);
    const toastId = toast.loading("Processing...");

    try {
      await axios.post(`${API_BASE_URL}/ebm/${action}-user/${uuid}`);
      toast.success(`User ${action}d`, { id: toastId });
      // Optimistic Update
      setUsers((prev) => prev.filter((u) => u.uuid !== uuid));
    } catch (err) {
      toast.error("Action failed", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-bold text-lg flex items-center gap-2">
          {viewMode === "pending" ? (
            <ListFilter size={20} />
          ) : (
            <History size={20} />
          )}
          {viewMode === "pending" ? "Pending Requests" : "Approval History"}
        </h3>
        <ButtonGroup variant="flat" size="sm">
          <Button
            color={viewMode === "pending" ? "primary" : "default"}
            onPress={() => setViewMode("pending")}
          >
            Pending
          </Button>
          <Button
            color={viewMode === "history" ? "primary" : "default"}
            onPress={() => setViewMode("history")}
          >
            History
          </Button>
        </ButtonGroup>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-[#03a1b0]" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center p-12 text-gray-400 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          No {viewMode} records found.
        </div>
      ) : (
        <Table
          aria-label="Approvals Table"
          shadow="none"
          className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden"
        >
          <TableHeader>
            <TableColumn>USER</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn align="center">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uuid}>
                <TableCell>
                  <User name={user.name} description={user.email} />
                </TableCell>
                <TableCell>
                  <Chip
                    color={
                      user.registration_type === "music"
                        ? "secondary"
                        : "primary"
                    }
                    size="sm"
                    variant="flat"
                    className="capitalize"
                  >
                    {user.registration_type}
                  </Chip>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {viewMode === "pending" ? (
                    <div className="flex justify-center gap-2">
                      <Tooltip content="Approve">
                        <Button
                          isIconOnly
                          color="success"
                          variant="flat"
                          size="sm"
                          isLoading={processingId === user.uuid}
                          onPress={() => handleAction(user.uuid, "approve")}
                        >
                          <Check size={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Reject">
                        <Button
                          isIconOnly
                          color="danger"
                          variant="flat"
                          size="sm"
                          isLoading={processingId === user.uuid}
                          onPress={() => handleAction(user.uuid, "reject")}
                        >
                          <X size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  ) : (
                    <div className="text-center text-xs text-gray-400 italic">
                      Processed
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
