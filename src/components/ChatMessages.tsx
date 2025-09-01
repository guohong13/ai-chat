"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import ChatMessage from "@/components/ChatMessage";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

export default function ChatMessages() {
  // 模拟聊天消息数据
  const messages: Message[] = [
    {
      id: "1",
      type: "user",
      content: "你好,你是谁?",
      timestamp: "刚刚",
    },
    {
      id: "2",
      type: "ai",
      content:
        "你好!我是DeepSeek-V3,由深度求索公司创造的智能助手。我可以帮你解答问题、陪你聊天、提供各种知识和建议。如果有任何问题或需要帮助,随时问我哦! 😊",
      timestamp: "刚刚",
    },
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "auto",
        bgcolor: "background.default",
        py: 3,
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
