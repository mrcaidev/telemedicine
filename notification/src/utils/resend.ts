import { Resend } from "resend";

// 初始化 Resend 客户端。
export const resend = new Resend(Bun.env.RESEND_API_KEY);
console.log("resend client initialized");

// 如果 Resend API 密钥无效，就在模拟模式下运行。
// 在模拟模式下，邮件不会真的被发送，而是被记录到日志。
export const SHOULD_ACTUALLY_SEND = Bun.env.RESEND_API_KEY.startsWith("re_");
if (!SHOULD_ACTUALLY_SEND) {
  console.warn("emails will not be sent, because resend api key is invalid");
}
