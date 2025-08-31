import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/utils";
import { RowDataPacket } from "mysql2";

// 定义用户行的类型
interface UserRow extends RowDataPacket {
  id: string;
  email: string;
  password: string;
  name: string;
  is_verified: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json({ error: "请提供邮箱和密码" }, { status: 400 });
    }

    // 查询用户
    const user = (await queryOne(
      "SELECT id, email, password, name, is_verified FROM users WHERE email = ?",
      [email]
    )) as UserRow | null;

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 401 });
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "密码不正确" }, { status: 401 });
    }

    // 检查邮箱是否已验证
    if (!user.is_verified) {
      return NextResponse.json({ error: "请先验证您的邮箱" }, { status: 401 });
    }

    // 生成JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // 返回用户信息和token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.is_verified,
      },
      token,
    });
  } catch (error) {
    console.error("登录失败:", error);
    return NextResponse.json(
      { error: "登录失败，请稍后重试" },
      { status: 500 }
    );
  }
}
