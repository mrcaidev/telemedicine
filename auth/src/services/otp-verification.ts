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

  // TODO: 发送事件让 notification 服务发送邮件。
  console.log(`Sending OTP ${otp} to ${email}...`);

  // 插入 OTP 发送记录。
  await otpVerificationRepository.insertOne({ email, otp });
}

export async function verifyOtp(email: string, otp: string) {
  // 如果没有尚未验证的 OTP，说明用户还没请求过新的 OTP。
  const lastOtpVerification =
    await otpVerificationRepository.findLastOneByEmail(email);
  if (!lastOtpVerification || lastOtpVerification.verifiedAt) {
    throw new HTTPException(404, {
      message: "We can't find an OTP for this email... Have you requested one?",
    });
  }

  // OTP 在 15 分钟后过期。
  if (
    new Date().getTime() >
    new Date(lastOtpVerification.sentAt).getTime() + 15 * 60 * 1000
  ) {
    throw new HTTPException(422, {
      message: "This OTP has expired. Let's try another time!",
    });
  }

  // OTP 必须相互匹配。
  if (lastOtpVerification.otp !== otp) {
    throw new HTTPException(422, {
      message: "This OTP is incorrect. Make sure you copied the right code!",
    });
  }

  // 将 OTP 状态更新为已验证。
  await otpVerificationRepository.updateOneById(lastOtpVerification.id, {
    verifiedAt: new Date().toISOString(),
  });
}
