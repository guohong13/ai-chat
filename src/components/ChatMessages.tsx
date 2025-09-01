"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, Fab } from "@mui/material";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material";
import ChatMessage from "@/components/ChatMessage";
import { ChatMessage as ChatMessageType } from "@/lib/streamChat";
import { useTheme } from "@mui/material/styles";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  sidebarOpen?: boolean;
}

export default function ChatMessages({
  messages,
  sidebarOpen,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const muiTheme = useTheme();

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 检测滚动位置 - 直接使用容器的 onScroll，避免初次为空未绑定的问题
  const handleContainerScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // 滑动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 当消息变化时，检查是否需要显示滚动按钮
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
      }
    }, 100); // 延迟检查，确保DOM已更新

    return () => clearTimeout(timer);
  }, [messages]);

  if (messages.length === 0) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            开始新的对话
          </Typography>
          <Typography variant="body2" color="text.secondary">
            输入您的问题，我将为您提供帮助
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "auto",
        bgcolor: "background.default",
        py: 3,
        position: "relative",
        // 自定义滚动条样式
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          bgcolor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "3px",
          "&:hover": {
            bgcolor: "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
      data-testid="chat-messages-container"
      ref={containerRef}
      onScroll={handleContainerScroll}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* 滚动到底部的引用点 */}
          <div ref={messagesEndRef} />
        </Box>
      </Container>

      {/* 滑动到底部按钮 */}
      {showScrollButton && (
        <Fab
          size="small"
          onClick={scrollToBottom}
          sx={{
            position: "fixed",
            bottom: 155,
            left: sidebarOpen ? "calc(50% + 160px)" : "50%",
            transform: "translateX(-50%)",
            bgcolor: "white",
            color: "primary.main",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "grey.50",
              boxShadow: "none",
            },
            zIndex: 1000,
            transition: muiTheme.transitions.create("left", {
              easing: muiTheme.transitions.easing.sharp,
              duration: muiTheme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      )}
    </Box>
  );
}
