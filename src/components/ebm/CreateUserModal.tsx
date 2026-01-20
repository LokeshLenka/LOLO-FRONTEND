import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Lock, User, Briefcase } from "lucide-react";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Added optional callback
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    registration_type: "music",
  });
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // API Payload: Ensure role matches registration type per backend logic
      const payload = {
        ...formData,
        role: formData.registration_type,
      };

      await axios.post(`${API_BASE_URL}/ebm/create/user`, payload);

      toast.success(`User ${formData.username} registered successfully!`);

      // Reset Form
      setFormData({
        username: "",
        email: "",
        password: "",
        registration_type: "music",
      });

      // Trigger Success Callback (refreshes dashboard stats)
      if (onSuccess) onSuccess();

      onClose();
    } catch (err: any) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Failed to create user. Please check inputs.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10",
        header: "border-b border-gray-200 dark:border-white/10",
        footer: "border-t border-gray-200 dark:border-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Register New Member
          <span className="text-sm font-normal text-gray-500">
            Manually onboard a new student to the platform.
          </span>
        </ModalHeader>

        <ModalBody className="gap-5 py-6">
          <Input
            isRequired
            label="Username / Roll No"
            placeholder="2X070..."
            startContent={<User size={18} className="text-gray-400" />}
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            variant="bordered"
          />

          <Input
            isRequired
            label="Email Address"
            placeholder="student@example.com"
            type="email"
            startContent={<Mail size={18} className="text-gray-400" />}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            variant="bordered"
          />

          <Input
            isRequired
            label="Password"
            placeholder="••••••••"
            type="password"
            startContent={<Lock size={18} className="text-gray-400" />}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            variant="bordered"
          />

          <Select
            label="Profile Type"
            placeholder="Select Role"
            startContent={<Briefcase size={18} className="text-gray-400" />}
            selectedKeys={[formData.registration_type]}
            onChange={(e) =>
              setFormData({ ...formData, registration_type: e.target.value })
            }
            variant="bordered"
          >
            <SelectItem key="music" textValue="Music">
              <div className="flex flex-col">
                <span className="text-sm">Music Profile</span>
                <span className="text-xs text-gray-400">
                  Musicians, vocalists, and band members
                </span>
              </div>
            </SelectItem>
            <SelectItem key="management" textValue="Management">
              <div className="flex flex-col">
                <span className="text-sm">Management Profile</span>
                <span className="text-xs text-gray-400">
                  Event organizers, PR, and logistics
                </span>
              </div>
            </SelectItem>
          </Select>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#03a1b0] text-white font-semibold"
            isLoading={loading}
            onPress={handleSubmit}
          >
            Register User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
