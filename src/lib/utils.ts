import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// JWT工具函数
export const generateToken = (payload: Record<string, unknown>): string => {
  const secret = process.env.JWT_SECRET || "fallback-secret";
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): unknown => {
  try {
    const secret = process.env.JWT_SECRET || "fallback-secret";
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

// 密码工具函数
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// 生成验证码
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 验证邮箱格式
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证密码强度
export const isStrongPassword = (password: string): boolean => {
  // 至少8位，包含大小写字母、数字和特殊字符
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// 简单的加密/解密函数
export const simpleEncrypt = (text: string): string => btoa(text);
export const simpleDecrypt = (text: string): string => {
  try {
    return atob(text);
  } catch {
    return "";
  }
};
