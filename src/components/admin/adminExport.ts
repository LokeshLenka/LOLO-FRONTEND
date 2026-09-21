export function toCSV(rows: any[], filename = "export.csv") {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => {
      const v = r[h] ?? "";
      const s = String(v).replace(/"/g, '""');
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s;
    }).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
export function toJSONExport(rows: any[], filename="export.json") {
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}
export function flattenUser(u: any) {
  const p = u.profile || u.managementProfile || u.musicProfile || {};
  return {
    uuid: u.uuid,
    username: u.username,
    email: u.email,
    role: u.role,
    sub_role: p.sub_role || "",
    branch: p.branch || "",
    year: p.year || "",
    reg_num: p.reg_num || "",
    phone_no: p.phone_no || "",
    first_name: p.first_name || "",
    last_name: p.last_name || "",
    promoted_role: u.promoted_role || "",
    management_level: u.management_level || "",
    is_active: u.is_active ? "active" : "inactive",
    is_approved: u.is_approved ? "approved" : "pending",
    status: u.user_approval?.status || "",
    created_at: u.created_at || "",
  };
}
