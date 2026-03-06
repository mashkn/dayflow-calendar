# Dayflow Calendar

Calendar and to-do for busy people. Web app first (Next.js), with future iOS and macOS apps.

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, MUI
- **Auth:** Supabase Auth (Sign in with Google)
- **Data (v1):** Supabase (Postgres). API layer is backend-agnostic so you can replace with your own backend in v2.
- **Schema:** Prisma (migrations and types)

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - Configure **Google Sign-In** (see [Google Sign-In setup](#google-sign-in-setup) below).
   - In **Authentication → URL Configuration**, set **Site URL** to `http://localhost:3000` and add `http://localhost:3000/auth/callback` to **Redirect URLs**.

3. **Environment**

   Copy `.env.example` to `.env.local` and set:

   **Option A – Connect dialog (easiest)**  
   In the Supabase dashboard, open your project and click **Connect** (top right or in the project overview). The dialog shows **Project URL** and a **Publishable** key — use those for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.

   **Option B – Settings**  
   - **Project URL & API key:** **Project Settings** (gear) → **API** (or **API Keys**). Use **Project URL** and the **Publishable** key for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`. Legacy anon key is also supported via `NEXT_PUBLIC_SUPABASE_ANON_KEY`.  
   - **Database URL:** **Project Settings** → **Database** → **Connection string** → **URI**. Copy the URI and replace `[YOUR-PASSWORD]` with your database password. Use the **Transaction** pooler (port 6543) for Prisma.

4. **Database**

   Create tables from the Prisma schema (Supabase Postgres). Use the **Session** pooler connection string in `DATABASE_URL` (Prisma works best with it):

   ```bash
   npm run db:push
   ```

   Optional: generate Prisma client for type-safe access from a future API:

   ```bash
   npm run db:generate
   ```

5. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Use **Sign in with Google** to log in.

## Google Sign-In setup

The app is already wired for Google OAuth (Supabase Auth + `/auth/callback`). You only need to create credentials and turn on the provider.

1. **Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com).
   - Create or select a project.
   - Open **APIs & Services → Credentials**.
   - Click **Create credentials → OAuth client ID**.
   - If asked, configure the **OAuth consent screen** (External, add your email, app name, save).
   - Application type: **Web application**.
   - Name: e.g. "Dayflow (local)".
   - **Authorized redirect URIs:** add `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback`  
     (get the exact URL from Supabase: **Authentication → Providers → Google**; it’s shown there).
   - Create and copy the **Client ID** and **Client secret**.

2. **Supabase**
   - In your project: **Authentication → Providers**.
   - Find **Google** and enable it.
   - Paste **Client ID** and **Client secret** from step 1.
   - Save.

3. **Test**
   - Run `npm run dev`, open the app, click **Sign in with Google**. You should be redirected to Google, then back to the app.

## Scripts

- `npm run dev` — dev server (Turbopack)
- `npm run build` / `npm run start` — production
- `npm run lint` — ESLint
- `npm run db:push` — push Prisma schema to DB (no migration files)
- `npm run db:migrate` — create and run migrations
- `npm run db:studio` — open Prisma Studio (requires `DATABASE_URL`)

## Project layout

- `app/` — Next.js App Router pages and routes (`page.tsx`, `layout.tsx`, `auth/callback`, `auth/error`)
- `components/` — React components:
  - `auth/` — SignInWithGoogle, UserMenu
  - `calendar/` — MonthCalendar
  - `layout/` — Layout (app bar, drawer, main content)
  - `theme/` — AppRouterCacheProvider, ThemeRegistry (MUI + light/dark)
  - `todo/` — TodoPanel
  - `ClientOnlyMui.tsx` — client-only wrapper to avoid hydration mismatch
- `lib/` — shared code:
  - `api/` — backend-agnostic API client (v1: Supabase; v2: swap for your API), `client.ts`, `supabase.ts`, `index.ts`
  - `db/types.ts` — domain types
  - `supabase/` — client (browser + server), env helpers, middleware
  - `theme/ThemeModeContext.tsx` — light/dark mode state and provider
- `prisma/schema.prisma` — Postgres schema (calendars, events, todos, global lists, etc.)
- `middleware.ts` — Supabase session refresh

## v2+

- Replace Supabase client with your own backend (same `lib/api` interface).
- To-do templates, recurrence, notifications, outfit planner, etc. as planned.
