import { sendEmailRequestedEvent } from "@/events/producer";
import * as otpVerificationRepository from "@/repositories/otp-verification";
import { HTTPException } from "hono/http-exception";

export async function sendOtp(email: string) {
  // 与上一次请求 OTP 的时间间隔不能小于 1 分钟。
  const lastOtpVerification =
    await otpVerificationRepository.findLastOneByEmail(email);
  if (
    lastOtpVerification &&
    new Date().getTime() <
      new Date(lastOtpVerification.sentAt).getTime() + 60 * 1000
  ) {
    throw new HTTPException(429, {
      message:
        "Oops! You requested OTP too frequently. Please wait for a minute and try again!",
    });
  }

  // 生成一个 6 位数的随机数作为 OTP。
  // TODO: 可以使用更安全的随机数生成算法。
  const otp = Math.floor(Math.random() * 1000000).toString();

  // 让 notification 服务立即发送邮件。
  await sendEmailRequestedEvent({
    subject: "Your One-Time Password",
    to: [email],
    cc: [],
    bcc: [],
    content: `Your OTP is: ${otp}\nThis will expire in 5 minutes. Please do not share it with anyone.`,
    scheduledAt: null,
  });

  // 插入 OTP 发送记录。
  await otpVerificationRepository.insertOne({ email, otp });
}
