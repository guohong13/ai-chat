"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import HydrationProvider from "@/components/HydrationProvider";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import ChatSidebar, { ConversationItem } from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import { StreamChat, ChatMessage as ChatMessageType } from "@/lib/streamChat";

const DRAWER_WIDTH = 280;

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const { muiTheme } = useTheme();
  const showMenuButton = !sidebarOpen;

  const [streamChat] = useState(
    () =>
      new StreamChat({
        onMessage: (message) => {
          setMessages((prev) => {
            const index = prev.findIndex((m) => m.id === message.id);
            if (index >= 0) {
              const newMessages = [...prev];
              newMessages[index] = message;
              return newMessages;
            } else {
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

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSendMessage = useCallback(
    async (message: string) => {
      // 如果是新对话（当前没有消息），则创建对话条目
      if (messages.length === 0) {
        const newId = generateId();
        const newItem: ConversationItem = {
          id: newId,
          title: message, // 使用第一条消息作为标题
          isActive: true,
          isFavorite: false,
        };
        setConversations((prev) => [
          newItem,
          ...prev.map((c) => ({ ...c, isActive: false })),
        ]);
      }
      streamChat.startStreaming(message).catch(() => {});
    },
    [streamChat, messages]
  );

  const handleStopStreaming = useCallback(() => {
    streamChat.stopStreaming();
  }, [streamChat]);

  const handleNewChat = useCallback(() => {
    streamChat.clearHistory();
    setMessages([]);
    // 取消所有对话的激活状态
    setConversations((prev) => prev.map((c) => ({ ...c, isActive: false })));
  }, [streamChat]);

  const handleSelectChat = useCallback(
    (id: string) => {
      handleNewChat(); // 简单起见，切换对话也视为新对话
      setConversations((prev) =>
        prev.map((c) => ({ ...c, isActive: c.id === id }))
      );
    },
    [handleNewChat]
  );

  const handleDeleteChat = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  }, []);

  useEffect(() => {
    setMessages(streamChat.getMessages());
  }, [streamChat]);

  return (
    <HydrationProvider>
      <ThemeProvider>
        <Box sx={{ display: "flex", height: "100vh" }}>
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
            <Box
              sx={{
                width: DRAWER_WIDTH,
                height: "100%",
                display: sidebarOpen ? "block" : "none",
              }}
            >
              <ChatSidebar
                conversations={conversations}
                onClose={handleSidebarClose}
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
                onDeleteChat={handleDeleteChat}
                onToggleFavorite={handleToggleFavorite}
              />
            </Box>
          </Box>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <ChatHeader
              onMenuClick={handleSidebarToggle}
              showMenuButton={showMenuButton}
            />

            <ChatMessages messages={messages} sidebarOpen={sidebarOpen} />

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
