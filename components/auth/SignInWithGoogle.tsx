"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, CircularProgress } from "@mui/material";

export function SignInWithGoogle() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
  };

  return (
    <Button
      variant="contained"
      onClick={handleSignIn}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
    >
      {loading ? "Signing in…" : "Sign in with Google"}
    </Button>
  );
}
