import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { producer } from "@/events/kafka";
import { resend } from "@/utils/resend";
import type { Email } from "@/utils/types";

const sendSpy = spyOn(resend.emails, "send");

afterEach(() => {
  sendSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

async function wait(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

describe("EmailRequested", () => {
  it("sends an email", async () => {
    const id = crypto.randomUUID();
    const email: Email = {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
    };
    sendSpy.mockResolvedValueOnce({ data: { id }, error: null });
    await producer.send({
      topic: "EmailRequested",
      messages: [{ value: JSON.stringify(email) }],
    });
    await wait(1000);
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenNthCalledWith(1, {
      subject: email.subject,
      from: "Telemedicine <notification@telemedicine.ink>",
      to: email.to,
      cc: email.cc,
      bcc: email.bcc,
      text: email.content,
    });
  });

  it("does not break if resend fails", async () => {
    const email: Email = {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
    };
    sendSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    await producer.send({
      topic: "EmailRequested",
      messages: [{ value: JSON.stringify(email) }],
    });
    await wait(1000);
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenNthCalledWith(1, {
      subject: email.subject,
      from: "Telemedicine <notification@telemedicine.ink>",
      to: email.to,
      cc: email.cc,
      bcc: email.bcc,
      text: email.content,
    });
  });
});
