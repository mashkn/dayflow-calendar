import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@/components/theme/AppRouterCacheProvider";
import { ThemeModeProvider } from "@/lib/theme/ThemeModeContext";
import { ThemeRegistry } from "@/components/theme/ThemeRegistry";
import { Layout } from "@/components/layout/Layout";
import { ClientOnlyMui } from "@/components/ClientOnlyMui";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dayflow Calendar",
  description: "Calendar and to-do for busy people",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientOnlyMui>
          <AppRouterCacheProvider>
            <ThemeModeProvider>
              <ThemeRegistry>
                <Layout user={user ?? null}>{children}</Layout>
              </ThemeRegistry>
            </ThemeModeProvider>
          </AppRouterCacheProvider>
        </ClientOnlyMui>
      </body>
    </html>
  );
}
