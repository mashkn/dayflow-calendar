import { Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message: msg } = await searchParams;
  const message = msg ?? "Something went wrong.";
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography color="error" sx={{ mb: 2 }}>
        {message}
      </Typography>
      <Button component={Link} href="/" variant="contained">
        Back home
      </Button>
    </Box>
  );
}
