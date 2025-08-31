"use client";

import React from "react";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import HydrationProvider from "@/components/HydrationProvider";

export default function ChatPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <HydrationProvider>
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              聊天页面
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              这里是聊天功能的主页面，正在开发中...
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                当前用户：{user?.name} ({user?.email})
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Logout />}
              onClick={handleLogout}
              size="medium"
            >
              退出登录
            </Button>
          </Paper>
        </Container>
      </Box>
    </HydrationProvider>
  );
}
