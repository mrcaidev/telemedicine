import { Resend } from "resend";

// 初始化 Resend 客户端。
export const resend = new Resend(Bun.env.RESEND_API_KEY);
console.log("resend client initialized");
