"use client";

import React from "react";
import { Box, Avatar, Typography, Paper } from "@mui/material";
import { SmartToy as RobotIcon } from "@mui/icons-material";
import { ChatMessage as ChatMessageType } from "@/lib/streamChat";
import { useAuthStore } from "@/store";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user";
  const { user } = useAuthStore();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {/* AI 头像 - 左侧 */}
      {!isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            mt: 0.5,
          }}
        >
          <RobotIcon />
        </Avatar>
      )}

      {/* 消息内容 */}
      <Box
        sx={{
          maxWidth: "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        {/* Message Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
            px: 1,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.75rem" }}
          >
            {message.timestamp}
          </Typography>
        </Box>

        {/* Message Content */}
        <Paper
          elevation={0}
          sx={{
            p: 1,
            bgcolor: isUser ? "primary.main" : "background.paper",
            color: isUser ? "white" : "text.primary",
            borderRadius: 3,
            border: isUser ? "none" : 1,
            borderColor: "divider",
            maxWidth: "100%",
            wordBreak: "break-word",
            position: "relative",
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              "@keyframes fade": {
                "0%, 100%": { opacity: 0.3 },
                "50%": { opacity: 1 },
              },
            }}
          >
            {message.content}
            {message.isStreaming && (
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  ml: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    bgcolor: "currentColor",
                    opacity: 1,
                    animation: "fade 1.4s ease-in-out infinite",
                  }}
                />
                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    bgcolor: "currentColor",
                    opacity: 0.6,
                    animation: "fade 1.4s ease-in-out infinite 0.2s",
                  }}
                />
                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    bgcolor: "currentColor",
                    opacity: 0.3,
                    animation: "fade 1.4s ease-in-out infinite 0.4s",
                  }}
                />
              </Box>
            )}
          </Typography>
        </Paper>
      </Box>

      {/* 用户头像 - 右侧 */}
      {isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            mt: 0.5,
            fontSize: "0.875rem",
          }}
        >
          {user?.name?.charAt(0) || "U"}
        </Avatar>
      )}
    </Box>
  );
}
