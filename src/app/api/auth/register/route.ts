import { NextRequest, NextResponse } from "next/server";
import {
  hashPassword,
  isValidEmail,
  isStrongPassword,
  generateVerificationCode,
} from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/email";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// 定义验证码行的类型
interface VerificationCodeRow extends RowDataPacket {
  id: string;
  email: string;
  code: string;
  name: string;
  password: string;
  expires_at: Date;
}

// 第一步：发送验证码
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // 验证输入
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: "密码必须至少8位，包含大小写字母、数字和特殊字符" },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 20) {
      return NextResponse.json(
        { error: "姓名长度必须在2-20个字符之间" },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 });
    }

    // 生成验证码
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分钟有效期
    const verificationId = `vc_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const hashedPassword = await hashPassword(password);

    // 删除旧的验证码（如果存在）
    await query("DELETE FROM verification_codes WHERE email = ?", [email]);

    // 存储验证码到数据库
    await query(
      "INSERT INTO verification_codes (id, email, code, name, password, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
      [verificationId, email, verificationCode, name, hashedPassword, expiresAt]
    );

    // 发送验证邮件
    const emailSent = await sendVerificationEmail(
      email,
      verificationCode,
      name
    );

    if (emailSent) {
      return NextResponse.json({
        message: "验证码已发送到您的邮箱，请查收",
        email: email,
      });
    } else {
      // 删除已存储的验证码
      await query("DELETE FROM verification_codes WHERE id = ?", [
        verificationId,
      ]);
      return NextResponse.json(
        { error: "发送验证邮件失败，请稍后重试" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
}

// 第二步：验证验证码并完成注册
export async function PUT(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // 验证输入
    if (!email || !code) {
      return NextResponse.json(
        { error: "请提供邮箱和验证码" },
        { status: 400 }
      );
    }

    // 查询验证码
    const verificationData = (await query(
      "SELECT * FROM verification_codes WHERE email = ? AND code = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
      [email, code]
    )) as VerificationCodeRow[];

    if (!Array.isArray(verificationData) || verificationData.length === 0) {
      return NextResponse.json(
        { error: "验证码无效或已过期" },
        { status: 400 }
      );
    }

    const verification = verificationData[0];

    // 创建用户
    const userId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    await query(
      "INSERT INTO users (id, email, password, name, is_verified) VALUES (?, ?, ?, ?, ?)",
      [
        userId,
        verification.email,
        verification.password,
        verification.name,
        true,
      ]
    );

    // 删除验证码
    await query("DELETE FROM verification_codes WHERE id = ?", [
      verification.id,
    ]);

    return NextResponse.json({
      message: "注册成功！请使用您的邮箱和密码登录",
      user: {
        id: userId,
        email: verification.email,
        name: verification.name,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("验证失败:", error);
    return NextResponse.json(
      { error: "验证失败，请稍后重试" },
      { status: 500 }
    );
  }
}
