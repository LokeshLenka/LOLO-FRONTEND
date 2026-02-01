import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker as MuiResponsiveDateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import dayjs, { Dayjs } from "dayjs";
import { X, Calendar as CalendarIcon } from "lucide-react";
import clsx from "clsx";

interface CustomDateTimePickerProps {
  value?: string | Date | null;
  onChange?: (date: string | null) => void;
  label?: string;
  error?: boolean;
  disabledDate?: (date: Dayjs) => boolean;
  minDate?: Date;
  maxDate?: Date;
}

const getTheme = (isDark: boolean) =>
  createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: { main: "#06b6d4" },
      text: {
        primary: isDark ? "#f4f4f5" : "#18181b",
        secondary: isDark ? "#a1a1aa" : "#71717a",
      },
      background: {
        paper: isDark ? "#09090b" : "#ffffff",
        default: isDark ? "#09090b" : "#ffffff",
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: isDark ? "1px solid #27272a" : "1px solid #e4e4e7",
            borderRadius: "16px",
            boxShadow: isDark
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
              : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            fontSize: "0.875rem",
            "&.Mui-selected": {
              backgroundColor: "#06b6d4 !important",
              color: "#ffffff",
            },
            "&:hover": {
              backgroundColor: isDark ? "#27272a" : "#f4f4f5",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            // KILL ALL INTERNAL BORDERS & RINGS
            "& fieldset": { border: "none !important" },
            "&.Mui-focused fieldset": { border: "none !important" },
            "&.Mui-focused": {
              boxShadow: "none !important",
              outline: "none !important",
            },
            padding: 0,
          },
          input: {
            padding: "8px 0",
            fontSize: "0.875rem",
            color: "inherit",
            cursor: "pointer",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "16px",
            border: isDark ? "1px solid #27272a" : "none",
            backgroundColor: isDark ? "#09090b" : "#ffffff",
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { backgroundColor: "#06b6d4" },
        },
      },
    },
  });

export function DateTimePicker({
  value,
  onChange,
  label,
  error,
  disabledDate,
  minDate,
  maxDate,
}: CustomDateTimePickerProps) {
  const [isDark, setIsDark] = React.useState(false);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const applySmartTime = (newDate: Dayjs) => {
    const now = dayjs();
    if (newDate.isSame(now, "day")) {
      return newDate.add(1, "hour").startOf("hour");
    }
    return newDate.hour(9).minute(0).second(0);
  };

  const handleChange = (newValue: Dayjs | null) => {
    if (!onChange) return;
    if (!newValue) {
      onChange(null);
      return;
    }
    let finalDate = newValue;
    if (!value) {
      finalDate = applySmartTime(newValue);
    }
    onChange(finalDate.toISOString());
  };

  return (
    <ThemeProvider theme={getTheme(isDark)}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MuiResponsiveDateTimePicker
          format="DD MMM YYYY | hh:mm A"
          value={value ? dayjs(value) : null}
          onChange={handleChange}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          shouldDisableDate={disabledDate}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          slots={{
            openPickerIcon: () => (
              <CalendarIcon className="h-4 w-4 text-cyan-500" />
            ),
          }}
          slotProps={{
            mobilePaper: {
              sx: {
                width: "90vw",
                maxWidth: "360px",
                borderRadius: "16px",
                backgroundImage: "none",
              },
            },
            desktopPaper: {
              sx: {
                borderRadius: "16px",
                marginTop: "8px",
                backgroundImage: "none",
              },
            },
            textField: {
              fullWidth: true,
              placeholder: label,
              error: error,
              onClick: () => setOpen(true),
              InputProps: {
                readOnly: true,
                className: clsx(
                  "flex h-11 w-full rounded-xl border bg-white px-3 py-1 text-sm shadow-sm transition-colors cursor-pointer",
                  "dark:bg-transparent dark:text-zinc-100",

                  // STATIC BORDERS ONLY - NO HOVER/FOCUS EFFECTS
                  error
                    ? "border-red-500"
                    : "border-zinc-200 dark:border-zinc-800",
                ),
                sx: {
                  // Double-check overrides
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none !important",
                  },
                  "& .MuiInputBase-root.Mui-focused": {
                    boxShadow: "none !important",
                  },
                  "& .MuiInputBase-input": {
                    padding: "8px 0",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  },
                },
                endAdornment: value ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange?.(null);
                      }}
                      className="text-zinc-400 hover:text-red-500 transition-colors z-10"
                    >
                      <X size={14} />
                    </button>
                    <CalendarIcon className="h-4 w-4 text-cyan-500 cursor-pointer" />
                  </div>
                ) : (
                  <CalendarIcon className="h-4 w-4 text-cyan-500 cursor-pointer" />
                ),
              },
            },
            actionBar: {
              actions: ["cancel", "accept"],
              sx: {
                "& button": { color: "#06b6d4", fontWeight: 600 },
              },
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
