import { SHOULD_ACTUALLY_SEND, resend } from "@/utils/resend";
import type { Email } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

// 创建定时邮件。
export async function schedule(email: Email, scheduledAt: string) {
  if (!SHOULD_ACTUALLY_SEND) {
    const mockId = crypto.randomUUID();
    console.log(
      `scheduled email ${mockId} at ${scheduledAt}:`,
      JSON.stringify(email),
    );
    return mockId;
  }

  const { data, error } = await resend.emails.send({
    subject: email.subject,
    from: "Telemedicine <notification@telemedicine.ink>",
    to: email.to,
    cc: email.cc,
    bcc: email.bcc,
    text: email.content,
    scheduledAt,
  });

  if (error) {
    throw new HTTPException(502, { message: error.message });
  }

  return data!.id;
}

// 更改定时邮件的发送时间。
export async function reschedule(id: string, scheduledAt: string) {
  if (!SHOULD_ACTUALLY_SEND) {
    console.log(`rescheduled email ${id} at ${scheduledAt}`);
    return;
  }

  const { error } = await resend.emails.update({ id, scheduledAt });

  if (error) {
    throw new HTTPException(502, { message: error.message });
  }
}

// 取消定时邮件。
export async function cancel(id: string) {
  if (!SHOULD_ACTUALLY_SEND) {
    console.log(`cancelled email ${id}`);
    return;
  }

  const { error } = await resend.emails.cancel(id);

  if (error) {
    throw new HTTPException(502, { message: error.message });
  }
}
