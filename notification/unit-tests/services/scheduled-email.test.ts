import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import * as scheduledEmailService from "@/services/scheduled-email";
import { resend } from "@/utils/resend";
import { HTTPException } from "hono/http-exception";

const resendEmailsSendSpy = spyOn(resend.emails, "send");
const resendEmailsUpdateSpy = spyOn(resend.emails, "update");
const resendEmailsCancelSpy = spyOn(resend.emails, "cancel");

afterEach(() => {
  resendEmailsSendSpy.mockClear();
  resendEmailsUpdateSpy.mockClear();
  resendEmailsCancelSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("schedule", () => {
  it("schedules email", async () => {
    const id = crypto.randomUUID();
    const scheduledAt = new Date().toISOString();
    resendEmailsSendSpy.mockResolvedValueOnce({ data: { id }, error: null });
    const result = await scheduledEmailService.schedule(
      {
        subject: "subject",
        to: ["me@example.com"],
        cc: [],
        bcc: [],
        content: "content",
      },
      scheduledAt,
    );
    expect(result).toEqual(id);
    expect(resendEmailsSendSpy).toHaveBeenCalledTimes(1);
    expect(resendEmailsSendSpy).toHaveBeenNthCalledWith(1, {
      from: "Telemedicine <notification@telemedicine.ink>",
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      text: "content",
      scheduledAt,
    });
  });

  it("throws if resend fails", async () => {
    resendEmailsSendSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    const fn = () =>
      scheduledEmailService.schedule(
        {
          subject: "subject",
          to: ["me@example.com"],
          cc: [],
          bcc: [],
          content: "content",
        },
        new Date().toISOString(),
      );
    expect(fn).toThrow(HTTPException);
  });
});

describe("reschedule", () => {
  it("reschedules email", async () => {
    const id = crypto.randomUUID();
    const scheduledAt = new Date().toISOString();
    resendEmailsUpdateSpy.mockResolvedValueOnce({
      data: { id, object: "email" },
      error: null,
    });
    await scheduledEmailService.reschedule(id, scheduledAt);
    expect(resendEmailsUpdateSpy).toHaveBeenCalledTimes(1);
    expect(resendEmailsUpdateSpy).toHaveBeenNthCalledWith(1, {
      id,
      scheduledAt,
    });
  });

  it("throws if resend fails", async () => {
    const id = crypto.randomUUID();
    const scheduledAt = new Date().toISOString();
    resendEmailsUpdateSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    const fn = () => scheduledEmailService.reschedule(id, scheduledAt);
    expect(fn).toThrow(HTTPException);
  });
});

describe("cancel", () => {
  it("cancels email", async () => {
    const id = crypto.randomUUID();
    resendEmailsCancelSpy.mockResolvedValueOnce({
      data: { id, object: "email" },
      error: null,
    });
    await scheduledEmailService.cancel(id);
    expect(resendEmailsCancelSpy).toHaveBeenCalledTimes(1);
    expect(resendEmailsCancelSpy).toHaveBeenNthCalledWith(1, id);
  });

  it("throws if resend fails", async () => {
    const id = crypto.randomUUID();
    resendEmailsCancelSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    const fn = () => scheduledEmailService.cancel(id);
    expect(fn).toThrow(HTTPException);
  });
});
