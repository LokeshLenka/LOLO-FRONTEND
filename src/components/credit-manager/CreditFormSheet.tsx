import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreditFormMode = "create" | "edit";

interface CreditFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: CreditFormMode;
  username: string;
  eventName: string;
  initialAmount?: number | string | null;
  onSubmit: (amount: number) => Promise<void>;
}

export function CreditFormSheet({
  open,
  onOpenChange,
  mode,
  username,
  eventName,
  initialAmount,
  onSubmit,
}: CreditFormSheetProps) {
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAmount(initialAmount != null ? String(initialAmount) : "");
  }, [initialAmount, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = Number(amount);

    if (Number.isNaN(parsed) || parsed < 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit(parsed);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md rounded-none border-l border-zinc-200 bg-white p-0 text-zinc-950 dark:border-[#344054] dark:bg-[#161F2E] dark:text-[#F2F4F7]"
      >
        <SheetHeader className="border-b border-zinc-200 px-6 py-5 dark:border-[#344054]">
          <SheetTitle className="text-base font-semibold tracking-tight">
            {mode === "create" ? "Assign Credit" : "Edit Credit"}
          </SheetTitle>
          <SheetDescription className="text-sm text-zinc-500 dark:text-[#98A2B3]">
            {username} · {eventName}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <div className="space-y-5 px-6 py-6">
            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]"
              >
                Credit Amount
              </Label>
              <Input
                id="amount"
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="h-11 rounded-none border-zinc-300 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-[#344054] dark:bg-[#1D2939] dark:text-[#F2F4F7] dark:placeholder:text-[#667085]"
              />
              <p className="text-xs text-zinc-500 dark:text-[#98A2B3]">
                Max value depends on backend validation.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-none bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </span>
              ) : mode === "create" ? (
                "Assign Credit"
              ) : (
                "Update Credit"
              )}
            </Button>
          </div>

          <div className="mt-auto flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-[#344054]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-none border-zinc-300 dark:border-[#344054]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </span>
              ) : mode === "create" ? (
                "Assign Credit"
              ) : (
                "Update Credit"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
