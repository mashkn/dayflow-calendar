/**
 * Backend API client interface.
 * v1: implemented with Supabase.
 * v2: replace with fetch to your own API; keep this interface.
 */

import type {
  Calendar,
  Event,
  Todo,
  TodoSection,
  GlobalList,
  GlobalListItem,
  CalendarShare,
} from "@/lib/db/types";

export type CreateEventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;
export type UpdateEventInput = Partial<CreateEventInput>;
export type CreateTodoInput = Omit<Todo, "id" | "createdAt" | "updatedAt">;
export type UpdateTodoInput = Partial<CreateTodoInput>;
export type CreateCalendarInput = Omit<Calendar, "id" | "createdAt" | "updatedAt">;
export type UpdateCalendarInput = Partial<CreateCalendarInput>;
export type CreateTodoSectionInput = Omit<TodoSection, "id" | "createdAt" | "updatedAt">;
export type CreateGlobalListInput = Omit<GlobalList, "id" | "createdAt" | "updatedAt">;
export type CreateGlobalListItemInput = Omit<
  GlobalListItem,
  "id" | "createdAt" | "updatedAt"
>;

export interface CalendarApi {
  list(): Promise<Calendar[]>;
  get(id: string): Promise<Calendar | null>;
  create(data: CreateCalendarInput): Promise<Calendar>;
  update(id: string, data: UpdateCalendarInput): Promise<Calendar>;
  delete(id: string): Promise<void>;
  listShares(calendarId: string): Promise<CalendarShare[]>;
  share(calendarId: string, userId: string, role: "view" | "edit"): Promise<CalendarShare>;
  unshare(calendarId: string, userId: string): Promise<void>;
}

export interface EventApi {
  listByCalendar(calendarId: string, from: Date, to: Date): Promise<Event[]>;
  get(id: string): Promise<Event | null>;
  create(data: CreateEventInput): Promise<Event>;
  update(id: string, data: UpdateEventInput): Promise<Event>;
  delete(id: string): Promise<void>;
}

export interface TodoSectionApi {
  list(): Promise<TodoSection[]>;
  create(data: CreateTodoSectionInput): Promise<TodoSection>;
  update(id: string, data: Partial<Pick<TodoSection, "name" | "sortOrder">>): Promise<TodoSection>;
  delete(id: string): Promise<void>;
}

export interface TodoApi {
  listByDate(date: Date): Promise<Todo[]>;
  create(data: CreateTodoInput): Promise<Todo>;
  update(id: string, data: UpdateTodoInput): Promise<Todo>;
  delete(id: string): Promise<void>;
  rollover(fromDate: Date, toDate: Date): Promise<void>;
}

export interface GlobalListApi {
  list(): Promise<GlobalList[]>;
  getWithItems(id: string): Promise<(GlobalList & { items: GlobalListItem[] }) | null>;
  create(data: CreateGlobalListInput): Promise<GlobalList>;
  createItem(data: CreateGlobalListItemInput): Promise<GlobalListItem>;
  delete(id: string): Promise<void>;
  addListToDay(globalListId: string, date: Date, fullOrPartial?: "full" | number): Promise<void>;
}

export interface ApiClient {
  calendars: CalendarApi;
  events: EventApi;
  todoSections: TodoSectionApi;
  todos: TodoApi;
  globalLists: GlobalListApi;
}
