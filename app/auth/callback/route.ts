import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function now(): string {
  return new Date().toISOString();
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const user = data.user;
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();
      if (existing) {
        await supabase
          .from("users")
          .update({
            email: user.email ?? null,
            name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null,
            updated_at: now(),
          })
          .eq("id", user.id);
      } else {
        await supabase.from("users").insert({
          id: user.id,
          email: user.email ?? null,
          name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
          created_at: now(),
          updated_at: now(),
        });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/error?message=Auth failed`);
}
