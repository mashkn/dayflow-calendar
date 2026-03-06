"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h2>Something went wrong</h2>
        <p style={{ color: "#666" }}>{error.message}</p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "8px 16px",
            marginTop: 8,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
