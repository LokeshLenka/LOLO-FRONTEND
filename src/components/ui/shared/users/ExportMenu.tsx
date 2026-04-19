// src/components/membership-head/ExportMenu.tsx
import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { type User } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

interface ExportMenuProps {
  users: User[];
  disabled?: boolean;
}

// Available fields to export
const EXPORT_FIELDS = [
  { id: "name", label: "Full Name", default: true },
  { id: "reg_num", label: "Registration Number", default: true },
  { id: "username", label: "Username", default: false },
  { id: "email", label: "Email Address", default: true },
  { id: "phone", label: "Phone Number", default: true },
  { id: "role", label: "Base Role", default: true },
  { id: "sub_role", label: "Sub Role", default: true },
  { id: "promoted_role", label: "Promoted Role", default: false },
  { id: "branch", label: "Branch", default: true },
  { id: "year", label: "Year", default: true },
  { id: "gender", label: "Gender", default: false },
  { id: "lateral", label: "Lateral Entry", default: false },
  { id: "hostel", label: "Hostel Status", default: false },
  { id: "status", label: "Approval Status", default: true },
  { id: "registered", label: "Registered Date", default: false },
];

export function ExportMenu({ users, disabled }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // State to track which fields are checked
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    EXPORT_FIELDS.reduce(
      (acc, field) => ({ ...acc, [field.id]: field.default }),
      {},
    ),
  );

  const toggleField = (id: string) => {
    setSelectedFields((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAll = (val: boolean) => {
    setSelectedFields(
      EXPORT_FIELDS.reduce((acc, field) => ({ ...acc, [field.id]: val }), {}),
    );
  };

  // Helper to safely format dates and avoid "Invalid Date"
  const safeDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  // Helper to extract requested data for a single user row
  const extractRowData = (user: User) => {
    const row: Record<string, string> = {};

    if (selectedFields.name)
      row["Name"] =
        `${user.profile?.first_name || ""} ${user.profile?.last_name || ""}`.trim() ||
        user.username;
    if (selectedFields.reg_num)
      row["Registration Number"] = user.profile?.reg_num || "N/A";
    if (selectedFields.username) row["Username"] = user.username || "N/A";
    if (selectedFields.email) row["Email Address"] = user.email || "N/A";
    if (selectedFields.phone)
      row["Phone Number"] = user.profile?.phone_no || "N/A";
    if (selectedFields.role) row["Role"] = user.role?.toUpperCase() || "N/A";
    if (selectedFields.sub_role)
      row["Sub Role"] = user.profile?.sub_role
        ? user.profile.sub_role.replace(/_/g, " ").toUpperCase()
        : "N/A";
    if (selectedFields.promoted_role)
      row["Promoted Role"] = user.promoted_role
        ? user.promoted_role.replace(/_/g, " ").toUpperCase()
        : "None";
    if (selectedFields.branch)
      row["Branch"] = user.profile?.branch?.toUpperCase() || "N/A";
    if (selectedFields.year)
      row["Year"] = user.profile?.year
        ? `${user.profile.year.charAt(0).toUpperCase()}${user.profile.year.slice(1)}`
        : "N/A";
    if (selectedFields.gender) row["Gender"] = user.profile?.gender || "N/A";
    if (selectedFields.lateral)
      row["Lateral Entry"] = user.profile?.lateral_status ? "Yes" : "No";
    if (selectedFields.hostel)
      row["Hostel (Any)"] = user.profile?.hostel_status ? "Yes" : "No";
    if (selectedFields.status)
      row["Approval Status"] = Boolean(user.is_approved)
        ? "Approved"
        : "Pending";
    if (selectedFields.registered)
      row["Registered Date"] = safeDate(
        user.created_at || user.profile?.created_at,
      );

    return row;
  };

  // ---------------------------------------------------------------------------
  // EXCEL EXPORT
  // ---------------------------------------------------------------------------
  const exportToExcel = () => {
    const activeFieldCount =
      Object.values(selectedFields).filter(Boolean).length;
    if (activeFieldCount === 0)
      return toast.error("Please select at least one field to export");

    const toastId = toast.loading("Generating Excel file...");

    try {
      const excelData = users.map(extractRowData);

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      // Attempt to auto-fit columns loosely
      const wscols = Object.keys(excelData[0] || {}).map(() => ({ wch: 20 }));
      worksheet["!cols"] = wscols;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(
        blob,
        `LOLO_Users_Export_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      toast.success("Excel exported successfully", { id: toastId });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate Excel file", { id: toastId });
    }
  };

  // ---------------------------------------------------------------------------
  // PDF EXPORT
  // ---------------------------------------------------------------------------
  const exportToPDF = () => {
    const activeFieldCount =
      Object.values(selectedFields).filter(Boolean).length;
    if (activeFieldCount === 0)
      return toast.error("Please select at least one field to export");
    if (activeFieldCount > 8)
      return toast.warning(
        "Too many columns for PDF. Try Excel instead, or select fewer columns.",
      );

    const toastId = toast.loading("Generating PDF file...");

    try {
      // Use landscape if they selected more than 5 columns
      const orientation = activeFieldCount > 5 ? "l" : "p";
      const doc = new jsPDF(orientation, "pt", "a4");

      // Header
      doc.setFontSize(16);
      doc.text("LOLO Club - Custom User Export", 40, 40);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 60);
      doc.text(`Total Records: ${users.length}`, 40, 75);

      // Extract only the headers that are checked
      const tableData = users.map(extractRowData);
      const headers = Object.keys(tableData[0] || {});
      const rows = tableData.map((obj) => Object.values(obj));

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 90,
        styles: {
          fontSize: 8,
          cellPadding: 4,
          valign: "middle",
        },
        headStyles: {
          fillColor: [24, 24, 27], // zinc-950
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250], // zinc-50
        },
      });

      doc.save(
        `Lolo_Users_Export_${new Date().toISOString().split("T")[0]}.pdf`,
      );
      toast.success("PDF exported successfully", { id: toastId });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="rounded-none border-zinc-200 dark:border-zinc-800 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          <Download className="mr-2 h-4 w-4 text-zinc-500" />
          Export Data
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-none border-zinc-200 dark:border-zinc-800 bg-background">
        <DialogHeader>
          <DialogTitle className="text-zinc-950 dark:text-zinc-50">
            Export Custom Data
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Select the exact columns you want to include in your exported file.
          </DialogDescription>
        </DialogHeader>

        {/* Checkbox Grid */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Columns to include
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => selectAll(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => selectAll(false)}
                className="text-xs text-zinc-500 hover:underline"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {EXPORT_FIELDS.map((field) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={selectedFields[field.id]}
                  onCheckedChange={() => toggleField(field.id)}
                  className="rounded-none border-zinc-300 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-zinc-50"
                />
                <Label
                  htmlFor={field.id}
                  className="text-sm font-normal text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  {field.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-2">
          <span className="text-xs text-zinc-500 mb-4 sm:mb-0">
            {Object.values(selectedFields).filter(Boolean).length} columns
            selected
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={exportToExcel}
              className="rounded-none border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-900/30 dark:text-green-500 dark:hover:bg-green-900/20"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel (.xlsx)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={exportToPDF}
              className="rounded-none border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900/30 dark:text-red-500 dark:hover:bg-red-900/20"
            >
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
