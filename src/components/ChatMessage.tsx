"use client";

import React from "react";
import { Box, Avatar, Typography, Paper } from "@mui/material";
import { SmartToy as RobotIcon } from "@mui/icons-material";
import { ChatMessage as ChatMessageType } from "@/lib/streamChat";
import { useAuthStore } from "@/store";
import MarkdownRenderer from "./MarkdownRenderer";

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
        {/* 时间戳 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
            px: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {message.timestamp}
          </Typography>
        </Box>

        {/* 消息内容 */}
        {isUser ? (
          <Paper
            elevation={0}
            sx={{
              px: 1.5,
              py: 1,
              bgcolor: "primary.main",
              color: "white",
              borderRadius: 3,
              maxWidth: "100%",
              wordBreak: "break-word",
            }}
          >
            <Typography
              variant="body1"
              component="div"
              sx={{
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {message.content}
            </Typography>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: "background.paper",
              color: "text.primary",
              borderRadius: 3,
              border: 1,
              borderColor: "divider",
              maxWidth: "100%",
              wordBreak: "break-word",
            }}
          >
            <MarkdownRenderer isStreaming={message.isStreaming}>
              {message.content}
            </MarkdownRenderer>
            {/* 流式响应 */}
            {message.isStreaming && (
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  ml: 0.5,
                  pt: 1,
                  "@keyframes fade": {
                    "0%, 100%": { opacity: 0.3 },
                    "50%": { opacity: 1 },
                  },
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
          </Paper>
        )}
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
