"use client";

import * as React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getEventsForDay } from "@/lib/calendar/eventUtils";
import type { Event } from "@/lib/db/types";

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
  events?: Event[];
  onAddEvent?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
  onViewChange?: (year: number, month: number) => void;
};

export function MonthCalendar({ year, month, events = [], onAddEvent, onEventClick, onViewChange }: MonthCalendarProps) {
  const now = new Date();
  const [viewDate, setViewDate] = React.useState(() => ({
    year: year ?? now.getFullYear(),
    month: month ?? now.getMonth(),
  }));
  const y = viewDate.year;
  const m = viewDate.month;
  const days = React.useMemo(() => getDaysInMonth(y, m), [y, m]);
  const rowCount = days.length / 7;
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
    setViewDate((prev) => {
      const next = prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 };
      onViewChange?.(next.year, next.month);
      return next;
    });
  };
  const goNext = () => {
    setViewDate((prev) => {
      const next = prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 };
      onViewChange?.(next.year, next.month);
      return next;
    });
  };

  React.useEffect(() => {
    onViewChange?.(viewDate.year, viewDate.month);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: notify parent of initial view once on mount
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
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
          flexShrink: 0,
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
          flexShrink: 0,
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

      {/* Day grid - fills remaining height with 5 or 6 equal rows */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
          borderLeft: 1,
          borderColor: "divider",
        }}
      >
        {days.map((d, i) => {
          const dayEvents = d !== null ? getEventsForDay(events, y, m, d) : [];
          const dateForDay = d !== null ? new Date(y, m, d, 12, 0, 0, 0) : null;
          return (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "flex-start",
              pt: 0.5,
              px: 0.25,
              borderRight: 1,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: d === null ? "action.hover" : "background.paper",
              ...(d !== null && {
                "&:hover": { bgcolor: "action.hover" },
                cursor: onAddEvent ? "pointer" : "default",
              }),
            }}
            onClick={() =>
              d !== null && dateForDay && onAddEvent ? onAddEvent(dateForDay) : undefined
            }
          >
            {d !== null ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
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
                </Box>
                {dayEvents.length > 0 && (
                  <Box
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.25,
                      mt: 0.25,
                    }}
                  >
                    {dayEvents.slice(0, 3).map((ev) => (
                      <Box
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(ev);
                        }}
                        sx={{
                          fontSize: "0.7rem",
                          px: 0.5,
                          py: 0.25,
                          borderRadius: 0.5,
                          bgcolor: ev.color ?? "primary.main",
                          color: ev.color ? "text.primary" : "primary.contrastText",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: onEventClick ? "pointer" : "default",
                          "&:hover": onEventClick ? { opacity: 0.9 } : {},
                        }}
                      >
                        {ev.title}
                      </Box>
                    ))}
                    {dayEvents.length > 3 && (
                      <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
                        +{dayEvents.length - 3} more
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            ) : null}
          </Box>
          );
        })}
      </Box>
    </Box>
  );
}
