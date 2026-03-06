"use client";

import * as React from "react";
import { Box } from "@mui/material";
import { createClient } from "@/lib/supabase/client";
import { getApi } from "@/lib/api";
import { getMonthRange } from "@/lib/calendar/eventUtils";
import type { Event } from "@/lib/db/types";
import type { Calendar } from "@/lib/db/types";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { EventDialog } from "@/components/calendar/EventDialog";

const DEFAULT_CALENDAR_NAME = "Personal";

export function CalendarPage() {
  const [user, setUser] = React.useState<{ id: string } | null>(null);
  const [calendars, setCalendars] = React.useState<Calendar[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [viewMonth, setViewMonth] = React.useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);
  const [defaultDate, setDefaultDate] = React.useState(() => new Date());

  const api = getApi();

  React.useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    }).catch((err) => {
      console.error("Auth session error:", err);
    });
    return () => subscription.unsubscribe();
  }, []);

  const ensureDefaultCalendar = React.useCallback(async (uid: string): Promise<Calendar> => {
    const list = await api.calendars.list();
    if (list.length > 0) return list[0];
    return api.calendars.create({
      ownerId: uid,
      name: DEFAULT_CALENDAR_NAME,
      color: "#1976d2",
    });
  }, [api.calendars]);

  const fetchEvents = React.useCallback(
    async (year: number, month: number) => {
      if (calendars.length === 0) return;
      const { from, to } = getMonthRange(year, month);
      const all: Event[] = [];
      for (const cal of calendars) {
        const list = await api.events.listByCalendar(cal.id, from, to);
        all.push(...list);
      }
      all.sort((a, b) => a.start.getTime() - b.start.getTime());
      setEvents(all);
    },
    [api.events, calendars]
  );

  React.useEffect(() => {
    if (!user) {
      setCalendars([]);
      setEvents([]);
      return;
    }
    let cancelled = false;
    ensureDefaultCalendar(user.id)
      .then((cal) => {
        if (cancelled) return;
        setCalendars([cal]);
      })
      .catch((err) => {
        if (!cancelled) console.error("Failed to load calendar:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [user, ensureDefaultCalendar]);

  React.useEffect(() => {
    if (!user || calendars.length === 0) return;
    fetchEvents(viewMonth.year, viewMonth.month).catch((err) => {
      console.error("Failed to load events:", err);
    });
  }, [viewMonth.year, viewMonth.month, user, calendars.length, fetchEvents]);

  const handleViewChange = React.useCallback((year: number, month: number) => {
    setViewMonth({ year, month });
  }, []);

  const handleAddEvent = React.useCallback((date: Date) => {
    setEditingEvent(null);
    setDefaultDate(date);
    setDialogOpen(true);
  }, []);

  const handleEventClick = React.useCallback((event: Event) => {
    setEditingEvent(event);
    setDefaultDate(event.start);
    setDialogOpen(true);
  }, []);

  const handleSaveEvent = React.useCallback(
    async (data: {
      title: string;
      start: Date;
      end: Date;
      allDay: boolean;
      description: string | null;
    }) => {
      const cal = calendars[0];
      if (!cal) return;
      if (editingEvent) {
        await api.events.update(editingEvent.id, {
          title: data.title,
          start: data.start,
          end: data.end,
          allDay: data.allDay,
          description: data.description,
        });
      } else {
        await api.events.create({
          calendarId: cal.id,
          title: data.title,
          start: data.start,
          end: data.end,
          allDay: data.allDay,
          description: data.description,
          color: null,
        });
      }
      setDialogOpen(false);
      setEditingEvent(null);
      await fetchEvents(viewMonth.year, viewMonth.month);
    },
    [api.events, calendars, editingEvent, viewMonth.year, viewMonth.month, fetchEvents]
  );

  const handleDeleteEvent = React.useCallback(
    async (eventId: string) => {
      await api.events.delete(eventId);
      setDialogOpen(false);
      setEditingEvent(null);
      await fetchEvents(viewMonth.year, viewMonth.month);
    },
    [api.events, viewMonth.year, viewMonth.month, fetchEvents]
  );

  const primaryCalendar = calendars[0];

  return (
    <Box component="main" sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <MonthCalendar
        events={events}
        onAddEvent={user ? handleAddEvent : undefined}
        onEventClick={user ? handleEventClick : undefined}
        onViewChange={handleViewChange}
      />
      {user && primaryCalendar && (
        <EventDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingEvent(null);
          }}
          event={editingEvent}
          defaultDate={defaultDate}
          calendarId={primaryCalendar.id}
          calendarColor={primaryCalendar.color}
          onSave={handleSaveEvent}
          onDelete={editingEvent ? handleDeleteEvent : undefined}
        />
      )}
    </Box>
  );
}
