import React, { useEffect, useState } from "react";
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
} from "@heroui/react";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PendingUser {
  uuid: string;
  name: string;
  email: string;
  registration_type: "music" | "management";
  created_at: string;
}

export default function UserApprovalTable() {
  // Initialize as empty array to prevent render crashes
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchPending = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ebm/pending-approvals`);

      // Robust Data Extraction
      let dataList: PendingUser[] = [];

      if (Array.isArray(response.data)) {
        dataList = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        dataList = response.data.data; // Standard Laravel Resource
      } else if (response.data?.users && Array.isArray(response.data.users)) {
        dataList = response.data.users; // Custom key
      }

      setUsers(dataList);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending approvals");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (uuid: string, action: "approve" | "reject") => {
    setProcessingId(uuid);
    const toastId = toast.loading(
      `${action === "approve" ? "Approving" : "Rejecting"} user...`
    );

    try {
      await axios.post(`${API_BASE_URL}/ebm/${action}-user/${uuid}`);
      toast.success(`User ${action}d successfully`, { id: toastId });
      setUsers((prev) => prev.filter((u) => u.uuid !== uuid));
    } catch (err) {
      toast.error(`Failed to ${action} user`, { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin text-[#03a1b0]" />
      </div>
    );

  // Safe check for length
  if (!users || users.length === 0)
    return (
      <div className="p-8 text-center text-gray-500">
        No pending approvals found.
      </div>
    );

  return (
    <div className="p-4">
      <Table aria-label="Pending Approvals">
        <TableHeader>
          <TableColumn>USER</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>REQUESTED DATE</TableColumn>
          <TableColumn align="center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uuid || Math.random()}>
              <TableCell>
                <User
                  name={user.name || "Unknown"}
                  description={user.email}
                  avatarProps={{ src: undefined }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  color={
                    user.registration_type === "music" ? "secondary" : "primary"
                  }
                  size="sm"
                  variant="flat"
                  className="capitalize"
                >
                  {user.registration_type || "N/A"}
                </Chip>
              </TableCell>
              <TableCell>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Tooltip content="Approve User">
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
                  <Tooltip content="Reject User">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
