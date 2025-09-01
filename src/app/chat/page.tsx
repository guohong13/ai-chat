"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import HydrationProvider from "@/components/HydrationProvider";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";

const DRAWER_WIDTH = 320;

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { muiTheme } = useTheme();
  const showMenuButton = !sidebarOpen;

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <HydrationProvider>
      <ThemeProvider>
        <Box sx={{ display: "flex", height: "100vh" }}>
          {/* Sidebar */}
          <Box
            component="nav"
            sx={{
              width: sidebarOpen ? DRAWER_WIDTH : 0,
              flexShrink: 0,
              transition: muiTheme.transitions.create("width", {
                easing: muiTheme.transitions.easing.sharp,
                duration: muiTheme.transitions.duration.enteringScreen,
              }),
            }}
          >
            {/* Sidebar Content */}
            <Box
              sx={{
                width: DRAWER_WIDTH,
                height: "100%",
                display: sidebarOpen ? "block" : "none",
              }}
            >
              <ChatSidebar onClose={handleSidebarClose} />
            </Box>
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            {/* Header */}
            <ChatHeader
              onMenuClick={handleSidebarToggle}
              showMenuButton={showMenuButton}
            />

            {/* Messages */}
            <ChatMessages />

            {/* Input */}
            <ChatInput />
          </Box>
        </Box>
      </ThemeProvider>
    </HydrationProvider>
  );
}
