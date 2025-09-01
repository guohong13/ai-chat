"use client";

import React from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  ChatBubbleOutline as ChatIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";

interface ChatSidebarProps {
  onClose?: () => void;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  isActive?: boolean;
}

export default function ChatSidebar({ onClose }: ChatSidebarProps) {
  // 模拟聊天历史数据
  const chatHistory: ChatHistory[] = [
    {
      id: "1",
      title: "你好,你是谁?",
      timestamp: "less than a minute ago",
      isActive: true,
    },
    {
      id: "2",
      title: "如何学习React?",
      timestamp: "2 hours ago",
    },
    {
      id: "3",
      title: "TypeScript基础语法",
      timestamp: "1 day ago",
    },
  ];

  const handleNewChat = () => {
    // 处理新建聊天逻辑
    console.log("New chat clicked");
  };

  const handleChatSelect = (chatId: string) => {
    // 处理聊天选择逻辑
    console.log("Chat selected:", chatId);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        zIndex: 1200,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          AI Chat
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* New Chat Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewChat}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            py: 1.5,
            px: 2,
            borderRadius: 2,
          }}
        >
          新对话
        </Button>
      </Box>

      {/* Chat History */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <List sx={{ py: 0 }}>
          {chatHistory.map((chat) => (
            <ListItem key={chat.id} disablePadding>
              <ListItemButton
                onClick={() => handleChatSelect(chat.id)}
                selected={chat.isActive}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "primary.50",
                    "&:hover": {
                      bgcolor: "primary.100",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ChatIcon color="primary" sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: chat.isActive ? 500 : 400,
                        color: chat.isActive
                          ? "text.primary"
                          : "text.secondary",
                      }}
                    >
                      {chat.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.disabled">
                      {chat.timestamp}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
