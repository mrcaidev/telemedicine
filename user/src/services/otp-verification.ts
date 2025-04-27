import { sendEmailRequestedEvent } from "@/events/producer";
import * as otpVerificationRepository from "@/repositories/otp-verification";
import { HTTPException } from "hono/http-exception";

function generateOtp() {
  // TODO: 可以使用更安全的随机数生成算法。
  return Math.floor(Math.random() * 1000000).toString();
}

export async function sendOtp(email: string) {
  // 与上一次请求 OTP 的时间间隔不能小于 1 分钟。
  const lastOtpVerification =
    await otpVerificationRepository.findLastOneByEmail(email);
  if (
    lastOtpVerification &&
    Date.now() < new Date(lastOtpVerification.sentAt).getTime() + 60 * 1000
  ) {
    throw new HTTPException(429, {
      message:
        "Oops! You requested OTP too frequently. Please wait for a minute and try again!",
    });
  }

  // 生成一个新的 OTP。
  const otp = generateOtp();

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

export async function verifyOtp(email: string, otp: string) {
  // 如果找不到待验证的 OTP 记录，说明用户还没有发送过新的 OTP。
  const lastOtpVerification =
    await otpVerificationRepository.findLastOneByEmail(email);
  if (!lastOtpVerification || lastOtpVerification.verifiedAt) {
    throw new HTTPException(422, {
      message:
        "We can't find any relevant OTP record. Have you requested an OTP?",
    });
  }

  // OTP 在 5 分钟后就应该视为过期。
  if (
    Date.now() >
    new Date(lastOtpVerification.sentAt).getTime() + 5 * 60 * 1000
  ) {
    throw new HTTPException(422, {
      message: "This OTP has expired. Let's try another time!",
    });
  }

  // 检查 OTP 是否匹配。
  if (lastOtpVerification.otp !== otp) {
    throw new HTTPException(422, {
      message: "This OTP is incorrect. Make sure you copied the right code!",
    });
  }

  // 更新 OTP 验证记录，标记为已验证。
  await otpVerificationRepository.updateOneById(lastOtpVerification.id, {
    verifiedAt: new Date().toISOString(),
  });
}
