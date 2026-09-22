import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileJson, FileText } from "lucide-react";
import { toCSV, toJSONExport, flattenUser } from "./adminExport";

export function AdminExportMenu({ users, disabled, filenamePrefix="lolo-admin" }: { users: any[]; disabled?: boolean; filenamePrefix?: string }) {
  const rows = users.map(flattenUser);
  const handleCSV = () => toCSV(rows, `${filenamePrefix}-${new Date().toISOString().slice(0,10)}.csv`);
  const handleJSON = () => toJSONExport(rows, `${filenamePrefix}-${new Date().toISOString().slice(0,10)}.json`);
  const handleXLSX = () => toCSV(rows, `${filenamePrefix}-${new Date().toISOString().slice(0,10)}-excel.csv`);
  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const headers = rows[0] ? Object.keys(rows[0]) : [];
    const head = `<tr>${headers.map(h=>`<th style="padding:8px;border:1px solid #D9CEF2;background:#EDE6F8;text-align:left;font-size:11px;color:#030407">${h}</th>`).join("")}</tr>`;
    const body = rows.map(r=>`<tr>${headers.map(h=>`<td style="padding:8px;border:1px solid #DDF3EF;font-size:12px">${(r as any)[h]??""}</td>`).join("")}</tr>`).join("");
    w.document.write(`<html><head><title>Export</title></head><body style="font-family:Inter,sans-serif"><h2 style="color:#030407">LOLO Admin Export — ${new Date().toLocaleString()}</h2><table style="border-collapse:collapse;width:100%">${head}${body}</table><script>window.print()</script></body></html>`);
    w.document.close();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled} className="rounded-none bg-[#DF3FFA] hover:bg-[#030407] text-white h-9 shadow-sm">
          <Download size={16}/> Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A]">
        <DropdownMenuLabel className="text-xs uppercase tracking-widest text-[#494070]">Export data</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={handleCSV} className="gap-2"><FileSpreadsheet size={14} className="text-[#DF3FFA]"/> CSV (spreadsheet)</DropdownMenuItem>
        <DropdownMenuItem onClick={handleXLSX} className="gap-2"><FileSpreadsheet size={14} className="text-[#030407]"/> Excel CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={handleJSON} className="gap-2"><FileJson size={14} className="text-[#DF3FFA]"/> JSON (raw)</DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint} className="gap-2"><FileText size={14}/> Print / PDF</DropdownMenuItem>
        <DropdownMenuSeparator/>
        <div className="px-2 py-1.5 text-[11px] text-[#494070]">{rows.length} rows • {rows.length ? Object.keys(rows[0]).length : 0} columns</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
