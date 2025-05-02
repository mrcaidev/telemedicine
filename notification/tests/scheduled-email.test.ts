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
import { POST } from "./utils/request";

const sendSpy = spyOn(resend.emails, "send");
const updateSpy = spyOn(resend.emails, "update");
const cancelSpy = spyOn(resend.emails, "cancel");

afterEach(() => {
  sendSpy.mockClear();
  updateSpy.mockClear();
  cancelSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("POST /scheduled-emails", () => {
  it("returns 201 if ok", async () => {
    const id = crypto.randomUUID();
    const scheduledAt = new Date(Date.now() + 1000).toISOString();
    sendSpy.mockResolvedValueOnce({ data: { id }, error: null });
    const res = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt,
    });
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({ ...successResponseTemplate, data: id });
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenNthCalledWith(1, {
      subject: "subject",
      from: "Telemedicine <notification@telemedicine.ink>",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      text: "content",
      scheduledAt,
    });
  });

  it("returns 400 if subject is invalid", async () => {
    const res = await POST("/scheduled-emails", {
      subject: "",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt: new Date(Date.now() + 1000).toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 400 if to is invalid", async () => {
    const res1 = await POST("/scheduled-emails", {
      subject: "subject",
      to: [],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt: new Date(Date.now() + 1000).toISOString(),
    });
    const json1 = await res1.json();
    expect(res1.status).toEqual(400);
    expect(json1).toEqual(errorResponseTemplate);

    const res2 = await POST("/scheduled-emails", {
      subject: "subject",
      to: Array.from({ length: 51 }, (_, i) => `${i}@example.com`),
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt: new Date(Date.now() + 1000).toISOString(),
    });
    const json2 = await res2.json();
    expect(res2.status).toEqual(400);
    expect(json2).toEqual(errorResponseTemplate);
  });

  it("returns 400 if cc is invalid", async () => {
    const res = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: Array.from({ length: 51 }, (_, i) => `${i}@example.com`),
      bcc: [],
      content: "content",
      scheduledAt: new Date(Date.now() + 1000).toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 400 if bcc is invalid", async () => {
    const res = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: Array.from({ length: 51 }, (_, i) => `${i}@example.com`),
      content: "content",
      scheduledAt: new Date(Date.now() + 1000).toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 400 if content is invalid", async () => {
    const res = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "",
      scheduledAt: new Date(Date.now() + 1000).toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 400 if scheduledAt is invalid", async () => {
    const res1 = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt: "",
    });
    const json1 = await res1.json();
    expect(res1.status).toEqual(400);
    expect(json1).toEqual(errorResponseTemplate);

    const res2 = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt: new Date().toISOString(),
    });
    const json2 = await res2.json();
    expect(res2.status).toEqual(400);
    expect(json2).toEqual(errorResponseTemplate);

    const res3 = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt: new Date(
        Date.now() + 31 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });
    const json3 = await res3.json();
    expect(res3.status).toEqual(400);
    expect(json3).toEqual(errorResponseTemplate);
  });

  it("returns 502 if resend fails", async () => {
    const scheduledAt = new Date(Date.now() + 1000).toISOString();
    sendSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    const res = await POST("/scheduled-emails", {
      subject: "subject",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: "content",
      scheduledAt,
    });
    const json = await res.json();
    expect(res.status).toEqual(502);
    expect(json).toEqual(errorResponseTemplate);
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenNthCalledWith(1, {
      subject: "subject",
      from: "Telemedicine <notification@telemedicine.ink>",
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      text: "content",
      scheduledAt,
    });
  });
});

describe("POST /scheduled-emails/:id/reschedule", () => {
  it("returns 200 if ok", async () => {
    const id = crypto.randomUUID();
    const scheduledAt = new Date(Date.now() + 1000).toISOString();
    updateSpy.mockResolvedValueOnce({
      data: { object: "email", id },
      error: null,
    });
    const res = await POST(`/scheduled-emails/${id}/reschedule`, {
      scheduledAt,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({ ...successResponseTemplate, data: null });
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenNthCalledWith(1, {
      id,
      scheduledAt,
    });
  });

  it("returns 400 if id is invalid", async () => {
    const res = await POST("/scheduled-emails/123/reschedule", {
      scheduledAt: new Date(Date.now() + 1000).toISOString(),
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 400 if scheduledAt is invalid", async () => {
    const res1 = await POST(
      `/scheduled-emails/${crypto.randomUUID()}/reschedule`,
      { scheduledAt: "" },
    );
    const json1 = await res1.json();
    expect(res1.status).toEqual(400);
    expect(json1).toEqual(errorResponseTemplate);

    const res2 = await POST(
      `/scheduled-emails/${crypto.randomUUID()}/reschedule`,
      { scheduledAt: new Date().toISOString() },
    );
    const json2 = await res2.json();
    expect(res2.status).toEqual(400);
    expect(json2).toEqual(errorResponseTemplate);

    const res3 = await POST(
      `/scheduled-emails/${crypto.randomUUID()}/reschedule`,
      {
        scheduledAt: new Date(
          Date.now() + 31 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    );
    const json3 = await res3.json();
    expect(res3.status).toEqual(400);
    expect(json3).toEqual(errorResponseTemplate);
  });

  it("returns 502 if resend fails", async () => {
    const id = crypto.randomUUID();
    const scheduledAt = new Date(Date.now() + 1000).toISOString();
    updateSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    const res = await POST(`/scheduled-emails/${id}/reschedule`, {
      scheduledAt,
    });
    const json = await res.json();
    expect(res.status).toEqual(502);
    expect(json).toEqual(errorResponseTemplate);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenNthCalledWith(1, { id, scheduledAt });
  });
});

describe("POST /scheduled-emails/:id/cancel", () => {
  it("returns 200 if ok", async () => {
    const id = crypto.randomUUID();
    cancelSpy.mockResolvedValueOnce({
      data: { object: "email", id },
      error: null,
    });
    const res = await POST(`/scheduled-emails/${id}/cancel`);
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({ ...successResponseTemplate, data: null });
    expect(cancelSpy).toHaveBeenCalledTimes(1);
    expect(cancelSpy).toHaveBeenNthCalledWith(1, id);
  });

  it("returns 400 if id is invalid", async () => {
    const res = await POST("/scheduled-emails/123/cancel");
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 502 if resend fails", async () => {
    const id = crypto.randomUUID();
    cancelSpy.mockResolvedValueOnce({
      data: null,
      error: { name: "invalid_api_Key", message: "message" },
    });
    const res = await POST(`/scheduled-emails/${id}/cancel`);
    const json = await res.json();
    expect(res.status).toEqual(502);
    expect(json).toEqual(errorResponseTemplate);
    expect(cancelSpy).toHaveBeenCalledTimes(1);
    expect(cancelSpy).toHaveBeenNthCalledWith(1, id);
  });
});
