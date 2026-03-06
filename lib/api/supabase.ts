/**
 * v1: Supabase implementation of ApiClient.
 * v2: Add lib/api/custom.ts that implements the same interface via your API.
 */

import { createClient } from "@/lib/supabase/client";
import type { ApiClient } from "./client";
import type {
  Calendar,
  Event,
  Todo,
  TodoSection,
  GlobalList,
  GlobalListItem,
  CalendarShare,
} from "@/lib/db/types";
import type {
  CreateEventInput,
  UpdateEventInput,
  CreateTodoInput,
  UpdateTodoInput,
  CreateCalendarInput,
  UpdateCalendarInput,
  CreateTodoSectionInput,
  CreateGlobalListInput,
  CreateGlobalListItemInput,
} from "./client";

function mapCalendar(row: Record<string, unknown>): Calendar {
  return {
    id: row.id as string,
    ownerId: row.owner_id as string,
    name: row.name as string,
    color: (row.color as string) ?? "#1976d2",
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    calendarId: row.calendar_id as string,
    title: row.title as string,
    start: new Date(row.start as string),
    end: new Date(row.end as string),
    allDay: (row.all_day as boolean) ?? false,
    description: (row.description as string) ?? null,
    color: (row.color as string) ?? null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapTodo(row: Record<string, unknown>): Todo {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    sectionId: row.section_id as string,
    title: row.title as string,
    dueDate: new Date(row.due_date as string),
    done: (row.done as boolean) ?? false,
    doNotPersist: (row.do_not_persist as boolean) ?? false,
    sourceGlobalListId: (row.source_global_list_id as string) ?? null,
    sourceGlobalListItemId: (row.source_global_list_item_id as string) ?? null,
    sortOrder: (row.sort_order as number) ?? 0,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapTodoSection(row: Record<string, unknown>): TodoSection {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    sortOrder: (row.sort_order as number) ?? 0,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapGlobalList(row: Record<string, unknown>): GlobalList {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    sortOrder: (row.sort_order as number) ?? 0,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapGlobalListItem(row: Record<string, unknown>): GlobalListItem {
  return {
    id: row.id as string,
    globalListId: row.global_list_id as string,
    title: row.title as string,
    sortOrder: (row.sort_order as number) ?? 0,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapCalendarShare(row: Record<string, unknown>): CalendarShare {
  return {
    id: row.id as string,
    calendarId: row.calendar_id as string,
    userId: row.user_id as string,
    role: (row.role as "view" | "edit") ?? "view",
    createdAt: new Date(row.created_at as string),
  };
}

export function createSupabaseApiClient(): ApiClient {
  const supabase = createClient();

  return {
    calendars: {
      async list() {
        const { data, error } = await supabase
          .from("calendars")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        return (data ?? []).map(mapCalendar);
      },
      async get(id) {
        const { data, error } = await supabase.from("calendars").select("*").eq("id", id).single();
        if (error) {
          if (error.code === "PGRST116") return null;
          throw error;
        }
        return data ? mapCalendar(data) : null;
      },
      async create(input: CreateCalendarInput) {
        const { data, error } = await supabase
          .from("calendars")
          .insert({
            owner_id: input.ownerId,
            name: input.name,
            color: input.color ?? "#1976d2",
          })
          .select("*")
          .single();
        if (error) throw error;
        return mapCalendar(data);
      },
      async update(id, input: UpdateCalendarInput) {
        const payload: Record<string, unknown> = {};
        if (input.name != null) payload.name = input.name;
        if (input.color != null) payload.color = input.color;
        const { data, error } = await supabase
          .from("calendars")
          .update(payload)
          .eq("id", id)
          .select("*")
          .single();
        if (error) throw error;
        return mapCalendar(data);
      },
      async delete(id) {
        const { error } = await supabase.from("calendars").delete().eq("id", id);
        if (error) throw error;
      },
      async listShares(calendarId) {
        const { data, error } = await supabase
          .from("calendar_shares")
          .select("*")
          .eq("calendar_id", calendarId);
        if (error) throw error;
        return (data ?? []).map(mapCalendarShare);
      },
      async share(calendarId, userId, role) {
        const { data, error } = await supabase
          .from("calendar_shares")
          .insert({ calendar_id: calendarId, user_id: userId, role })
          .select("*")
          .single();
        if (error) throw error;
        return mapCalendarShare(data);
      },
      async unshare(calendarId, userId) {
        const { error } = await supabase
          .from("calendar_shares")
          .delete()
          .eq("calendar_id", calendarId)
          .eq("user_id", userId);
        if (error) throw error;
      },
    },

    events: {
      async listByCalendar(calendarId, from, to) {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("calendar_id", calendarId)
          .gte("start", from.toISOString())
          .lte("end", to.toISOString())
          .order("start", { ascending: true });
        if (error) throw error;
        return (data ?? []).map(mapEvent);
      },
      async get(id) {
        const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
        if (error) {
          if (error.code === "PGRST116") return null;
          throw error;
        }
        return data ? mapEvent(data) : null;
      },
      async create(input: CreateEventInput) {
        const { data, error } = await supabase
          .from("events")
          .insert({
            calendar_id: input.calendarId,
            title: input.title,
            start: input.start.toISOString(),
            end: input.end.toISOString(),
            all_day: input.allDay,
            description: input.description ?? null,
            color: input.color ?? null,
          })
          .select("*")
          .single();
        if (error) throw error;
        return mapEvent(data);
      },
      async update(id, input: UpdateEventInput) {
        const payload: Record<string, unknown> = {};
        if (input.title != null) payload.title = input.title;
        if (input.start != null) payload.start = input.start.toISOString();
        if (input.end != null) payload.end = input.end.toISOString();
        if (input.allDay != null) payload.all_day = input.allDay;
        if (input.description != null) payload.description = input.description;
        if (input.color != null) payload.color = input.color;
        const { data, error } = await supabase
          .from("events")
          .update(payload)
          .eq("id", id)
          .select("*")
          .single();
        if (error) throw error;
        return mapEvent(data);
      },
      async delete(id) {
        const { error } = await supabase.from("events").delete().eq("id", id);
        if (error) throw error;
      },
    },

    todoSections: {
      async list() {
        const { data, error } = await supabase
          .from("todo_sections")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return (data ?? []).map(mapTodoSection);
      },
      async create(input: CreateTodoSectionInput) {
        const { data, error } = await supabase
          .from("todo_sections")
          .insert({
            user_id: input.userId,
            name: input.name,
            sort_order: input.sortOrder ?? 0,
          })
          .select("*")
          .single();
        if (error) throw error;
        return mapTodoSection(data);
      },
      async update(id, input) {
        const payload: Record<string, unknown> = {};
        if (input.name != null) payload.name = input.name;
        if (input.sortOrder != null) payload.sort_order = input.sortOrder;
        const { data, error } = await supabase
          .from("todo_sections")
          .update(payload)
          .eq("id", id)
          .select("*")
          .single();
        if (error) throw error;
        return mapTodoSection(data);
      },
      async delete(id) {
        const { error } = await supabase.from("todo_sections").delete().eq("id", id);
        if (error) throw error;
      },
    },

    todos: {
      async listByDate(date) {
        const dayStart = new Date(date);
        dayStart.setUTCHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setUTCHours(23, 59, 59, 999);
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .gte("due_date", dayStart.toISOString())
          .lte("due_date", dayEnd.toISOString())
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return (data ?? []).map(mapTodo);
      },
      async create(input: CreateTodoInput) {
        const { data, error } = await supabase
          .from("todos")
          .insert({
            user_id: input.userId,
            section_id: input.sectionId,
            title: input.title,
            due_date: input.dueDate.toISOString(),
            done: input.done ?? false,
            do_not_persist: input.doNotPersist ?? false,
            source_global_list_id: input.sourceGlobalListId ?? null,
            source_global_list_item_id: input.sourceGlobalListItemId ?? null,
            sort_order: input.sortOrder ?? 0,
          })
          .select("*")
          .single();
        if (error) throw error;
        return mapTodo(data);
      },
      async update(id, input: UpdateTodoInput) {
        const payload: Record<string, unknown> = {};
        if (input.title != null) payload.title = input.title;
        if (input.dueDate != null) payload.due_date = input.dueDate.toISOString();
        if (input.done != null) payload.done = input.done;
        if (input.doNotPersist != null) payload.do_not_persist = input.doNotPersist;
        if (input.sortOrder != null) payload.sort_order = input.sortOrder;
        const { data, error } = await supabase
          .from("todos")
          .update(payload)
          .eq("id", id)
          .select("*")
          .single();
        if (error) throw error;
        return mapTodo(data);
      },
      async delete(id) {
        const { error } = await supabase.from("todos").delete().eq("id", id);
        if (error) throw error;
      },
      async rollover(fromDate, toDate) {
        const dayStart = new Date(fromDate);
        dayStart.setUTCHours(0, 0, 0, 0);
        const dayEnd = new Date(fromDate);
        dayEnd.setUTCHours(23, 59, 59, 999);
        const { data: incomplete } = await supabase
          .from("todos")
          .select("*")
          .eq("done", false)
          .eq("do_not_persist", false)
          .gte("due_date", dayStart.toISOString())
          .lte("due_date", dayEnd.toISOString());
        if (!incomplete?.length) return;
        const toDayStart = new Date(toDate);
        toDayStart.setUTCHours(0, 0, 0, 0);
        for (const t of incomplete) {
          await supabase.from("todos").insert({
            user_id: t.user_id,
            section_id: t.section_id,
            title: t.title,
            due_date: toDayStart.toISOString(),
            done: false,
            do_not_persist: t.do_not_persist,
            sort_order: t.sort_order,
          });
        }
      },
    },

    globalLists: {
      async list() {
        const { data, error } = await supabase
          .from("global_lists")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return (data ?? []).map(mapGlobalList);
      },
      async getWithItems(id) {
        const { data: list, error: e1 } = await supabase
          .from("global_lists")
          .select("*")
          .eq("id", id)
          .single();
        if (e1 || !list) return null;
        const { data: items, error: e2 } = await supabase
          .from("global_list_items")
          .select("*")
          .eq("global_list_id", id)
          .order("sort_order", { ascending: true });
        if (e2) throw e2;
        return { ...mapGlobalList(list), items: (items ?? []).map(mapGlobalListItem) };
      },
      async create(input: CreateGlobalListInput) {
        const { data, error } = await supabase
          .from("global_lists")
          .insert({
            user_id: input.userId,
            name: input.name,
            sort_order: input.sortOrder ?? 0,
          })
          .select("*")
          .single();
        if (error) throw error;
        return mapGlobalList(data);
      },
      async createItem(input: CreateGlobalListItemInput) {
        const { data, error } = await supabase
          .from("global_list_items")
          .insert({
            global_list_id: input.globalListId,
            title: input.title,
            sort_order: input.sortOrder ?? 0,
          })
          .select("*")
          .single();
        if (error) throw error;
        return mapGlobalListItem(data);
      },
      async delete(id) {
        const { error } = await supabase.from("global_lists").delete().eq("id", id);
        if (error) throw error;
      },
      async addListToDay(
        globalListId,
        date,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- v2: full vs partial template
        _fullOrPartial?: "full" | number
      ) {
        const listWithItems = await this.getWithItems(globalListId);
        if (!listWithItems) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const dayStart = new Date(date);
        dayStart.setUTCHours(0, 0, 0, 0);
        const { data: sections } = await supabase
          .from("todo_sections")
          .select("id")
          .order("sort_order", { ascending: true })
          .limit(1);
        const defaultSectionId = sections?.[0]?.id;
        if (!defaultSectionId) return;
        for (let i = 0; i < listWithItems.items.length; i++) {
          await supabase.from("todos").insert({
            user_id: user.id,
            section_id: defaultSectionId,
            title: listWithItems.items[i].title,
            due_date: dayStart.toISOString(),
            done: false,
            do_not_persist: false,
            source_global_list_id: globalListId,
            source_global_list_item_id: listWithItems.items[i].id,
            sort_order: i,
          });
        }
      },
    },
  };
}
