import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { resend } from "@/utils/resend";
import { errorResponseTemplate, successResponseTemplate } from "./utils/data";
import { DELETE, PATCH, POST } from "./utils/request";

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

describe("lifecycle", () => {
  it("schedule -> reschedule -> cancel", async () => {
    const id = crypto.randomUUID();
    const scheduledAt = new Date(Date.now() + 1000).toISOString();
    resendEmailsSendSpy.mockResolvedValueOnce({ data: { id }, error: null });
    const res1 = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt,
    });
    const json1 = await res1.json();
    expect(res1.status).toEqual(201);
    expect(json1).toEqual({ ...successResponseTemplate, data: id });
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

    const rescheduledAt = new Date(Date.now() + 10 * 1000).toISOString();
    resendEmailsUpdateSpy.mockResolvedValueOnce({
      data: { id, object: "email" },
      error: null,
    });
    const res2 = await PATCH(`/scheduled-emails/${id}`, {
      scheduledAt: rescheduledAt,
    });
    const json2 = await res2.json();
    expect(res2.status).toEqual(200);
    expect(json2).toEqual({ ...successResponseTemplate, data: null });
    expect(resendEmailsUpdateSpy).toHaveBeenCalledTimes(1);
    expect(resendEmailsUpdateSpy).toHaveBeenNthCalledWith(1, {
      id,
      scheduledAt: rescheduledAt,
    });

    resendEmailsCancelSpy.mockResolvedValueOnce({
      data: { id, object: "email" },
      error: null,
    });
    const res3 = await DELETE(`/scheduled-emails/${id}`);
    const json3 = await res3.json();
    expect(res3.status).toEqual(200);
    expect(json3).toEqual({ ...successResponseTemplate, data: null });
    expect(resendEmailsCancelSpy).toHaveBeenCalledTimes(1);
    expect(resendEmailsCancelSpy).toHaveBeenNthCalledWith(1, id);
  });
});

describe("POST /scheduled-emails", () => {
  it("returns 400 if scheduledAt is in the past", async () => {
    const res = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt: new Date().toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
    expect(resendEmailsSendSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 400 if scheduledAt is after 30 days", async () => {
    const res = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt: new Date(
        Date.now() + 31 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
    expect(resendEmailsSendSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 502 if resend fails", async () => {
    resendEmailsSendSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    const res = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt: new Date(Date.now() + 1000).toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(502);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("PATCH /scheduled-emails/:id", () => {
  it("returns 400 if scheduledAt is in the past", async () => {
    const res = await PATCH(`/scheduled-emails/${crypto.randomUUID()}`, {
      scheduledAt: new Date().toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
    expect(resendEmailsUpdateSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 400 if scheduledAt is after 30 days", async () => {
    const res = await PATCH(`/scheduled-emails/${crypto.randomUUID()}`, {
      scheduledAt: new Date(
        Date.now() + 31 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
    expect(resendEmailsUpdateSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 502 if resend fails", async () => {
    resendEmailsUpdateSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    const res = await PATCH(`/scheduled-emails/${crypto.randomUUID()}`, {
      scheduledAt: new Date(Date.now() + 1000).toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(502);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("DELETE /scheduled-emails/:id", () => {
  it("returns 502 if resend fails", async () => {
    resendEmailsCancelSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    const res = await DELETE(`/scheduled-emails/${crypto.randomUUID()}`);
    const json = await res.json();
    expect(res.status).toEqual(502);
    expect(json).toEqual(errorResponseTemplate);
  });
});
