"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import type { Event } from "@/lib/db/types";

type EventFormState = {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  description: string;
};

function eventToForm(event: Event | null, defaultDate: Date): EventFormState {
  if (event) {
    const start = event.start;
    const end = event.end;
    const pad = (n: number) => String(n).padStart(2, "0");
    return {
      title: event.title,
      startDate: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
      startTime: event.allDay ? "09:00" : `${pad(start.getHours())}:${pad(start.getMinutes())}`,
      endDate: `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`,
      endTime: event.allDay ? "17:00" : `${pad(end.getHours())}:${pad(end.getMinutes())}`,
      allDay: event.allDay,
      description: event.description ?? "",
    };
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = defaultDate;
  const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return {
    title: "",
    startDate: dateStr,
    startTime: "09:00",
    endDate: dateStr,
    endTime: "10:00",
    allDay: false,
    description: "",
  };
}

function formToDates(form: EventFormState): { start: Date; end: Date } {
  const parseDate = (dateStr: string, timeStr: string) => {
    const [y, mo, d] = dateStr.split("-").map(Number);
    const [h, min] = timeStr.split(":").map(Number);
    return new Date(y, mo - 1, d, h, min, 0, 0);
  };
  const start = parseDate(form.startDate, form.startTime);
  const end = parseDate(form.endDate, form.endTime);
  if (form.allDay) {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }
  return { start, end };
}

type EventDialogProps = {
  open: boolean;
  onClose: () => void;
  event: Event | null;
  defaultDate: Date;
  calendarId: string;
  calendarColor: string;
  onSave: (data: {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    description: string | null;
  }) => Promise<void>;
  onDelete?: (eventId: string) => Promise<void>;
};

export function EventDialog({
  open,
  onClose,
  event,
  defaultDate,
  onSave,
  onDelete,
}: EventDialogProps) {
  const [form, setForm] = React.useState<EventFormState>(() =>
    eventToForm(event, defaultDate)
  );
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (open) setForm(eventToForm(event, defaultDate));
  }, [open, event, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const { start, end } = formToDates(form);
      await onSave({
        title: form.title.trim(),
        start,
        end,
        allDay: form.allDay,
        description: form.description.trim() || null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(event.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const isEditing = event !== null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", pb: 1 }}>
          {isEditing ? "Edit event" : "New event"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              fullWidth
              autoFocus
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.allDay}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, allDay: e.target.checked }))
                  }
                />
              }
              label="All day"
            />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Start date"
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, startDate: e.target.value }))
                }
                size="small"
                sx={{ flex: 1, minWidth: 140 }}
              />
              {!form.allDay && (
                <TextField
                  label="Start time"
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startTime: e.target.value }))
                  }
                  size="small"
                  sx={{ width: 100 }}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="End date"
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, endDate: e.target.value }))
                }
                size="small"
                sx={{ flex: 1, minWidth: 140 }}
              />
              {!form.allDay && (
                <TextField
                  label="End time"
                  type="time"
                  value={form.endTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, endTime: e.target.value }))
                  }
                  size="small"
                  sx={{ width: 100 }}
                />
              )}
            </Box>
            <TextField
              label="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              multiline
              rows={2}
              size="small"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          {isEditing && onDelete && (
            <Button
              color="error"
              onClick={handleDelete}
              disabled={deleting}
              sx={{ mr: "auto" }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          )}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving…" : isEditing ? "Save" : "Add event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
