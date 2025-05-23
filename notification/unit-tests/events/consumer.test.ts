import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { consumeEmailRequestedEvent } from "@/events/consumer";
import { resend } from "@/utils/resend";
const resendEmailsSendSpy = spyOn(resend.emails, "send");

afterEach(() => {
  resendEmailsSendSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("consumeEmailRequestedEvent", () => {
  it("sends email", async () => {
    resendEmailsSendSpy.mockResolvedValueOnce({
      data: { id: crypto.randomUUID() },
      error: null,
    });
    await consumeEmailRequestedEvent({
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
    });
    expect(resendEmailsSendSpy).toHaveBeenCalledTimes(1);
    expect(resendEmailsSendSpy).toHaveBeenNthCalledWith(1, {
      from: "Telemedicine <notification@telemedicine.ink>",
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      text: "content",
    });
  });

  it("fails safe if resend fails", async () => {
    resendEmailsSendSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    const fn = () =>
      consumeEmailRequestedEvent({
        subject: "subject",
        to: ["me@example.com"],
        cc: [],
        bcc: [],
        content: "content",
      });
    expect(fn).not.toThrow();
  });
});
