"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import HydrationProvider from "@/components/HydrationProvider";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import { StreamChat, ChatMessage as ChatMessageType } from "@/lib/streamChat";

const DRAWER_WIDTH = 280;

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const { muiTheme } = useTheme();
  const showMenuButton = !sidebarOpen;

  // 创建流式对话实例
  const [streamChat] = useState(
    () =>
      new StreamChat({
        onMessage: (message) => {
          setMessages((prev) => {
            const index = prev.findIndex((m) => m.id === message.id);
            if (index >= 0) {
              // 更新现有消息
              const newMessages = [...prev];
              newMessages[index] = message;
              return newMessages;
            } else {
              // 添加新消息
              return [...prev, message];
            }
          });
        },
        onStreamStart: () => {
          setIsStreaming(true);
        },
        onStreamEnd: () => {
          setIsStreaming(false);
        },
        onError: (error) => {
          console.error("Stream chat error:", error);
          setIsStreaming(false);
        },
      })
  );

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSendMessage = useCallback(
    async (message: string) => {
      try {
        await streamChat.startStreaming(message);
      } catch (error) {
        console.error("Failed to start streaming:", error);
      }
    },
    [streamChat]
  );

  const handleStopStreaming = useCallback(() => {
    streamChat.stopStreaming();
  }, [streamChat]);

  const handleClearHistory = useCallback(() => {
    streamChat.clearHistory();
    setMessages([]);
  }, [streamChat]);

  const handleNewChat = useCallback(() => {
    // 处理新建聊天逻辑
    streamChat.clearHistory();
    setMessages([]);
  }, [streamChat]);

  // 初始化时获取消息
  useEffect(() => {
    setMessages(streamChat.getMessages());
  }, [streamChat]);

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
              <ChatSidebar
                onClose={handleSidebarClose}
                onClearHistory={handleClearHistory}
                onNewChat={handleNewChat}
                messages={messages}
              />
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
            <ChatMessages messages={messages} sidebarOpen={sidebarOpen} />

            {/* Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              onStopStreaming={handleStopStreaming}
              isStreaming={isStreaming}
              disabled={isStreaming}
            />
          </Box>
        </Box>
      </ThemeProvider>
    </HydrationProvider>
  );
}
