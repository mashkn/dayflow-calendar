"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import type { User } from "@supabase/supabase-js";

type UserMenuProps = {
  user: User;
};

export function UserMenu({ user }: UserMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleSignOut = async () => {
    setAnchorEl(null);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color="inherit"
        aria-label="account menu"
      >
        <Avatar
          src={user.user_metadata?.avatar_url}
          sx={{ width: 32, height: 32 }}
        >
          {(user.user_metadata?.full_name ?? user.email ?? "?").slice(0, 1).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            {user.user_metadata?.full_name ?? user.email}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}
