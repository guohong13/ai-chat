"use client";

import React from "react";
import { Box, Avatar, Typography, Paper, Chip } from "@mui/material";
import {
  Person as PersonIcon,
  SmartToy as RobotIcon,
} from "@mui/icons-material";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
            mt: 0.5,
          }}
        >
          <RobotIcon />
        </Avatar>
      )}

      <Box
        sx={{
          maxWidth: "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        {/* Message Content */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: isUser ? "primary.main" : "background.paper",
            color: isUser ? "white" : "text.primary",
            borderRadius: 3,
            border: isUser ? "none" : 1,
            borderColor: "divider",
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {message.content}
          </Typography>
        </Paper>

        {/* Message Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
            px: 1,
          }}
        >
          {/* {!isUser && (
            <Chip
              label="DeepSeek AI"
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.75rem",
                height: 20,
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          )} */}

          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: "0.75rem" }}
          >
            {message.timestamp}
          </Typography>
        </Box>
      </Box>

      {isUser && (
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "grey.300",
            mt: 0.5,
          }}
        >
          <PersonIcon />
        </Avatar>
      )}
    </Box>
  );
}
