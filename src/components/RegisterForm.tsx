"use client";

import React, { useState } from "react";
import http from "@/lib/request";
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const steps = ["填写信息", "邮箱验证", "完成注册"];

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleInputChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleSendVerificationCode = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await http.request({
        url: "/api/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setActiveStep(1);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError("请输入验证码");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await http.request({
        url: "/api/auth/register",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setActiveStep(2);
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");
    setVerificationCode("");

    try {
      const response = await http.request({
        url: "/api/auth/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("验证码已重新发送，请查收");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendVerificationCode();
            }}
          >
            <TextField
              fullWidth
              label="姓名"
              value={formData.name}
              onChange={handleInputChange("name")}
              margin="dense"
              required
              size="small"
            />

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

            <TextField
              fullWidth
              label="确认密码"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              margin="dense"
              required
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 1, mb: 1 }}
              size="medium"
            >
              {loading ? <CircularProgress size={20} /> : "发送验证码"}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              验证码已发送到 {formData.email}，请输入验证码完成注册
            </Typography>

            <TextField
              fullWidth
              label="验证码"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              margin="dense"
              required
              size="small"
              placeholder="请输入6位验证码"
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyCode}
              disabled={loading || !verificationCode.trim()}
              sx={{ mt: 1, mb: 1 }}
              size="medium"
            >
              {loading ? <CircularProgress size={20} /> : "验证并注册"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleResendCode}
              disabled={loading}
              size="small"
            >
              重新发送验证码
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              注册成功！
            </Typography>
            <Typography variant="body2" color="text.secondary">
              正在跳转到登录页面...
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}

      {activeStep === 0 && (
        <Box sx={{ mt: 1, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            已有账户？{" "}
            <Button
              color="primary"
              onClick={onSwitchToLogin}
              sx={{ textTransform: "none" }}
              size="small"
            >
              立即登录
            </Button>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
