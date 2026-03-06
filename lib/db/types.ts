// Domain types used across the app. Backend-agnostic.

export type Calendar = {
  id: string;
  ownerId: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Event = {
  id: string;
  calendarId: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TodoSection = {
  id: string;
  userId: string;
  name: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Todo = {
  id: string;
  userId: string;
  sectionId: string;
  title: string;
  dueDate: Date;
  done: boolean;
  doNotPersist: boolean;
  sourceGlobalListId: string | null;
  sourceGlobalListItemId: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GlobalList = {
  id: string;
  userId: string;
  name: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GlobalListItem = {
  id: string;
  globalListId: string;
  title: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CalendarShare = {
  id: string;
  calendarId: string;
  userId: string;
  role: "view" | "edit";
  createdAt: Date;
};
