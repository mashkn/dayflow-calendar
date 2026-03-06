"use client";

import * as React from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "@/lib/theme/ThemeModeContext";
import { SignInWithGoogle } from "@/components/auth/SignInWithGoogle";
import { UserMenu } from "@/components/auth/UserMenu";
import { TodoPanel } from "@/components/todo/TodoPanel";
import type { User } from "@supabase/supabase-js";

const DRAWER_WIDTH = 320;

type LayoutProps = {
  children: React.ReactNode;
  user: User | null;
};

export function Layout({ children, user }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { mode, toggleMode, mounted } = useThemeMode();

  const handleDrawerToggle = () => setMobileOpen((o) => !o);

  const drawer = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: "100%",
        bgcolor: "background.paper",
      }}
      role="presentation"
    >
      <TodoPanel user={user} />
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          left: 0,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open to-do panel"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dayflow
          </Typography>
          <IconButton
            color="inherit"
            onClick={toggleMode}
            aria-label="toggle theme"
            sx={{ visibility: mounted ? "visible" : "hidden" }}
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          {user ? (
            <UserMenu user={user} />
          ) : (
            <SignInWithGoogle />
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minWidth: 0,
          minHeight: "100vh",
          mt: "64px",
          mr: { md: `${DRAWER_WIDTH}px` },
          p: { xs: 2, sm: 3 },
          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>

      {/* Desktop: persistent drawer on the right */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            top: 64,
            height: "calc(100% - 64px)",
            borderLeft: 1,
            borderColor: "divider",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Mobile: temporary drawer from the right */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            top: 64,
            height: "calc(100% - 64px)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
