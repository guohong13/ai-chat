"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import { useAuthStore } from "@/store/authStore";
import { simpleDecrypt } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    login,
    setError: setStoreError,
    rememberMe: storedRememberMe,
    savedEmail,
    savedPassword,
    setSavedCredentials,
    clearSavedCredentials,
  } = useAuthStore();
  const router = useRouter();

  // 页面加载时恢复记住我的状态和凭据
  useEffect(() => {
    setRememberMe(storedRememberMe);
    if (storedRememberMe && savedEmail && savedPassword) {
      const decryptedPassword = simpleDecrypt(savedPassword);
      setFormData({ email: savedEmail, password: decryptedPassword });
    }
  }, [storedRememberMe, savedEmail, savedPassword]);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      setError("");
    };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    setRememberMe(checked);
    if (!checked) clearSavedCredentials();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError("请填写邮箱和密码");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          setSavedCredentials(formData.email, formData.password);
        } else {
          clearSavedCredentials();
        }

        login(data.user, data.token, rememberMe);
        router.push("/chat");
      } else {
        setError(data.error);
        setStoreError(data.error);
      }
    } catch (error) {
      const errorMessage = "网络错误，请稍后重试";
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="邮箱"
          type="email"
          value={formData.email}
          onChange={handleInputChange("email")}
          margin="dense"
          required
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="密码"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleInputChange("password")}
          margin="dense"
          required
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={handleRememberMeChange}
                color="primary"
                size="small"
              />
            }
            label="记住我"
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 1, mb: 1 }}
          size="medium"
        >
          {loading ? <CircularProgress size={20} /> : "登录"}
        </Button>

        <Box sx={{ mt: 1, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            还没有账户？{" "}
            <Button
              color="primary"
              onClick={onSwitchToRegister}
              sx={{ textTransform: "none" }}
              size="small"
            >
              立即注册
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
