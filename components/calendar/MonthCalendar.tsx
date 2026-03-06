"use client";

import * as React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const totalCells = startPad + daysInMonth;
  const rows = Math.ceil(totalCells / 7);
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const remaining = rows * 7 - cells.length;
  for (let i = 0; i < remaining; i++) cells.push(null);
  return cells;
}

type MonthCalendarProps = {
  year?: number;
  month?: number; // 0-indexed
};

export function MonthCalendar({ year, month }: MonthCalendarProps) {
  const now = new Date();
  const [viewDate, setViewDate] = React.useState(() => ({
    year: year ?? now.getFullYear(),
    month: month ?? now.getMonth(),
  }));
  const y = viewDate.year;
  const m = viewDate.month;
  const days = React.useMemo(() => getDaysInMonth(y, m), [y, m]);
  const monthLabel = new Date(y, m).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const isToday = (d: number | null) =>
    d !== null &&
    now.getFullYear() === y &&
    now.getMonth() === m &&
    now.getDate() === d;

  const goPrev = () => {
    setViewDate((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 }
    );
  };
  const goNext = () => {
    setViewDate((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 }
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        p: 3,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 1,
      }}
    >
      {/* Month header with nav */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          pb: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <IconButton size="small" onClick={goPrev} aria-label="Previous month">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" component="span" fontWeight={600}>
          {monthLabel}
        </Typography>
        <IconButton size="small" onClick={goNext} aria-label="Next month">
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Weekday row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          textAlign: "center",
          bgcolor: "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {WEEKDAY_NAMES.map((name) => (
          <Typography
            key={name}
            variant="caption"
            color="text.secondary"
            sx={{ py: 1, fontWeight: 600 }}
          >
            {name}
          </Typography>
        ))}
      </Box>

      {/* Day grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          borderLeft: 1,
          borderColor: "divider",
        }}
      >
        {days.map((d, i) => (
          <Box
            key={i}
            sx={{
              minHeight: 56,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              pt: 0.5,
              borderRight: 1,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: d === null ? "action.hover" : "background.paper",
              ...(d !== null && {
                "&:hover": { bgcolor: "action.hover" },
              }),
            }}
          >
            {d !== null ? (
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  ...(isToday(d)
                    ? {
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontWeight: 700,
                      }
                    : {}),
                }}
              >
                <Typography
                  variant="body2"
                  component="span"
                  fontWeight={isToday(d) ? 700 : 400}
                >
                  {d}
                </Typography>
              </Box>
            ) : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
