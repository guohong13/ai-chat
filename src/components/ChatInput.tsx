"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Container,
  Button,
} from "@mui/material";
import {
  Send as SendIcon,
  Psychology as PsychologyIcon,
  Search as SearchIcon,
  Stop as StopIcon,
} from "@mui/icons-material";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStopStreaming?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  onStopStreaming,
  isStreaming = false,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [deepThinking, setDeepThinking] = useState(false);
  const [webSearch, setWebSearch] = useState(false);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      // 构建消息内容，包含选中的功能
      let finalMessage = message.trim();

      if (deepThinking) {
        finalMessage += "\n\n请帮我深度思考这个问题，并提供详细的分析和见解。";
      }

      if (webSearch) {
        finalMessage += "\n\n请帮我搜索相关信息，并提供最新的资料和参考。";
      }

      onSendMessage(finalMessage);
      setMessage("");
      // 发送后重置按钮状态
      setDeepThinking(false);
      setWebSearch(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleDeepThinking = () => {
    if (!disabled) {
      setDeepThinking(!deepThinking);
    }
  };

  const handleWebSearch = () => {
    if (!disabled) {
      setWebSearch(!webSearch);
    }
  };

  const handleStop = () => {
    onStopStreaming?.();
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        py: 2,
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 1 }}>
            <TextField
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="有什么可以帮您？"
              variant="standard"
              fullWidth
              disabled={disabled}
              InputProps={{ disableUnderline: true }}
              sx={{
                "& .MuiInputBase-input": {
                  py: 1.5,
                  px: 1,
                  fontSize: "1rem",
                  lineHeight: 1.5,
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              pb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PsychologyIcon />}
                onClick={handleDeepThinking}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  borderColor: deepThinking ? "purple.500" : "grey.400",
                  color: deepThinking ? "purple.500" : "text.secondary",
                  // 移除点击动画
                  "&:active": {
                    transform: "none",
                  },
                  "&:focus": {
                    transform: "none",
                  },
                }}
              >
                深度思考
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={<SearchIcon />}
                onClick={handleWebSearch}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  borderColor: webSearch ? "blue.500" : "grey.400",
                  color: webSearch ? "blue.500" : "text.secondary",
                  // 移除点击动画
                  "&:active": {
                    transform: "none",
                  },
                  "&:focus": {
                    transform: "none",
                  },
                }}
              >
                联网搜索
              </Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isStreaming ? (
                <IconButton
                  onClick={handleStop}
                  sx={{
                    bgcolor: "error.main",
                    color: "white",
                    outline: "none",
                    "&:focus": { outline: "none" },
                    "&.Mui-focusVisible": {
                      outline: "none",
                      boxShadow: "none",
                    },
                    "&:focus-visible": { outline: "none" },
                    "&:hover": {
                      bgcolor: "error.dark",
                    },
                    // 移除点击动画
                    "&:active": {
                      transform: "none",
                    },
                    width: 40,
                    height: 40,
                  }}
                >
                  <StopIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={handleSend}
                  disabled={!message.trim() || disabled}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    outline: "none",
                    "&:focus": { outline: "none" },
                    "&.Mui-focusVisible": {
                      outline: "none",
                      boxShadow: "none",
                    },
                    "&:focus-visible": { outline: "none" },
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                    // 移除点击动画
                    "&:active": {
                      transform: "none",
                    },
                    width: 40,
                    height: 40,
                  }}
                >
                  <SendIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
