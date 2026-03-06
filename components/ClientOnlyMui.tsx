"use client";

import * as React from "react";

/**
 * Renders children only after mount. Use to avoid MUI/Emotion hydration mismatch:
 * server and client both render the placeholder first, then client replaces with the real tree.
 */
export function ClientOnlyMui({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
        aria-hidden
      />
    );
  }
  return <>{children}</>;
}
