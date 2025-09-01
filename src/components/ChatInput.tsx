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
} from "@mui/icons-material";

export default function ChatInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // 处理发送消息逻辑
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleDeepThinking = () => {
    // 处理深度思考逻辑
    console.log("Deep thinking clicked");
  };

  const handleWebSearch = () => {
    // 处理联网搜索逻辑
    console.log("Web search clicked");
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
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
          {/* Text Input */}
          <Box sx={{ p: 2 }}>
            <TextField
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="有什么可以帮您？"
              variant="standard"
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  border: "none",
                  "&:before": {
                    border: "none",
                  },
                  "&:after": {
                    border: "none",
                  },
                  "&:hover:not(.Mui-disabled):before": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  py: 1.5,
                  px: 1,
                  fontSize: "1rem",
                  lineHeight: 1.5,
                },
              }}
            />
          </Box>

          {/* Action Buttons Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              pb: 2,
            }}
          >
            {/* Left Side - Action Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PsychologyIcon />}
                onClick={handleDeepThinking}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  borderColor: "grey.300",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "grey.400",
                    bgcolor: "grey.50",
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
                  borderColor: "grey.300",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "grey.400",
                    bgcolor: "grey.50",
                  },
                }}
              >
                联网搜索
              </Button>
            </Box>

            {/* Right Side - Send Button */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={handleSend}
                disabled={!message.trim()}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "action.disabledBackground",
                    color: "action.disabled",
                  },
                  width: 40,
                  height: 40,
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
