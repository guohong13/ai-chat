"use client";

import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Brightness4 as SystemModeIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
}

export default function ChatHeader({
  onMenuClick,
  showMenuButton,
}: ChatHeaderProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/auth");
    setAnchorEl(null);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleTheme = () => {
    const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <LightModeIcon />;
      case "dark":
        return <DarkModeIcon />;
      case "system":
        return <SystemModeIcon />;
      default:
        return <LightModeIcon />;
    }
  };

  const getThemeTitle = () => {
    switch (theme) {
      case "light":
        return "当前主题: 浅色";
      case "dark":
        return "当前主题: 深色";
      case "system":
        return "当前主题: 系统";
      default:
        return "当前主题: 浅色";
    }
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        bgcolor: "background.default",
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 32,
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {showMenuButton && (
          <IconButton
            onClick={onMenuClick}
            size="large"
            sx={{ color: "text.secondary" }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="body1"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          My DeepSeek
        </Typography>
      </Box>

      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={toggleTheme}
          size="large"
          sx={{ color: "text.secondary" }}
          title={getThemeTitle()}
        >
          {getThemeIcon()}
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
          <IconButton onClick={handleUserMenuClick} sx={{ p: 0 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogout} sx={{ fontSize: "0.875rem" }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              退出登录
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}
