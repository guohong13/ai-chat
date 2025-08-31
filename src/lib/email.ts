import nodemailer from "nodemailer";

// 邮件发送配置
export const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// 发送验证邮件
export const sendVerificationEmail = async (
  email: string,
  code: string,
  name: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "AI Chat - 邮箱验证",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">欢迎使用 AI Chat!</h2>
          <p>亲爱的 ${name}，</p>
          <p>感谢您注册 AI Chat 应用。请使用以下验证码完成邮箱验证：</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${code}</h1>
          </div>
          <p>验证码有效期为 10 分钟。</p>
          <p>如果这不是您的操作，请忽略此邮件。</p>
          <p>祝您使用愉快！</p>
          <p>AI Chat 团队</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("发送邮件失败:", error);
    return false;
  }
};
