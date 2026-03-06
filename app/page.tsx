import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { Box } from "@mui/material";

export default function HomePage() {
  return (
    <Box component="main" sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <MonthCalendar />
    </Box>
  );
}
