"use client";

import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ContentCopy, Check } from "@mui/icons-material";

interface CodeBlockProps {
  language: string;
  rawCode: string;
  children: React.ReactNode;
}

export default function CodeBlock({
  language,
  rawCode, // 原始代码
  children,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <Box
      className="code-block-container"
      sx={{
        backgroundColor: "#2d2d2d",
        borderRadius: "6px",
        marginBottom: "1.5em",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.3em 1em",
          backgroundColor: "#3a3a3a",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#dcdcdc",
            fontSize: "0.85rem",
          }}
        >
          {language || "text"}
        </Typography>

        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{
            color: "#dcdcdc",
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            fontSize: "0.8rem",
            "&:hover": {
              color: "#fafafa",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {isCopied ? (
            <Check fontSize="inherit" />
          ) : (
            <ContentCopy fontSize="inherit" />
          )}
          <Typography variant="caption" sx={{ ml: 0.1 }}>
            {isCopied ? "已复制" : "复制代码"}
          </Typography>
        </IconButton>
      </Box>
      <Box
        sx={{
          "& > pre": {
            margin: "0.5em",
            padding: "0em",
            backgroundColor: "transparent",
            lineHeight: 1.5,
            overflowX: "auto",
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
