"use client";

import React from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  ListItemIcon as MenuItemIcon,
} from "@mui/material";
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChatBubbleOutline as ChatIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";

export interface ConversationItem {
  id: string;
  title: string;
  isActive: boolean;
  isFavorite: boolean;
}

interface ChatSidebarProps {
  conversations: ConversationItem[];
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function ChatSidebar({
  conversations,
  onClose,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onToggleFavorite,
}: ChatSidebarProps) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [selectedChatId, setSelectedChatId] = React.useState<string | null>(
    null
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    chatId: string
  ) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedChatId(chatId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedChatId(null);
  };

  const handleMenuAction = (action: "favorite" | "delete") => {
    if (!selectedChatId) return;

    if (action === "favorite") {
      onToggleFavorite(selectedChatId);
    } else if (action === "delete") {
      onDeleteChat(selectedChatId);
    }

    handleMenuClose();
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        zIndex: 1200,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          AI Chat
        </Typography>
        <IconButton onClick={onClose} size="small">
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      {/* New Chat Button */}
      <Box sx={{ p: 1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewChat}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            py: 1,
            px: 2,
            borderRadius: 2,
          }}
        >
          新对话
        </Button>
      </Box>

      {/* Chat History */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
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
      >
        {conversations.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              暂无对话历史
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {conversations.map((chat) => (
              <ListItem key={chat.id} disablePadding>
                <ListItemButton
                  onClick={() => onSelectChat(chat.id)}
                  selected={chat.isActive}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    mb: 0.5,
                    py: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "primary.50",
                      "&:hover": {
                        bgcolor: "primary.100",
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ChatIcon color="primary" sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: chat.isActive ? 500 : 400,
                          color: chat.isActive
                            ? "text.primary"
                            : "text.secondary",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {chat.title}
                      </Typography>
                    }
                  />
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                      ".MuiListItemButton-root:hover &": {
                        opacity: 0.7,
                      },
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, chat.id)}
                      sx={{
                        p: 0.5,
                        color: "text.secondary",
                        "&:hover": {
                          color: "text.primary",
                        },
                      }}
                    >
                      <MoreHorizIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiMenuItem-root": {
            fontSize: "0.875rem",
            py: 1,
          },
        }}
      >
        <MenuItem onClick={() => handleMenuAction("favorite")}>
          <MenuItemIcon>
            {selectedChatId &&
            conversations.find((c) => c.id === selectedChatId)?.isFavorite ? (
              <StarIcon fontSize="small" />
            ) : (
              <StarBorderIcon fontSize="small" />
            )}
          </MenuItemIcon>
          {selectedChatId &&
          conversations.find((c) => c.id === selectedChatId)?.isFavorite
            ? "取消收藏"
            : "收藏"}
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction("delete")}>
          <MenuItemIcon>
            <DeleteIcon fontSize="small" />
          </MenuItemIcon>
          删除
        </MenuItem>
      </Menu>
    </Box>
  );
}
