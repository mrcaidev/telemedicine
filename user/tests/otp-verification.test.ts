import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import * as producer from "@/events/producer";
import { sql } from "bun";
import { errorResponseTemplate, successResponseTemplate } from "./utils/data";
import { POST } from "./utils/request";

const publishEmailRequestedEventSpy = spyOn(
  producer,
  "publishEmailRequestedEvent",
);

afterEach(() => {
  publishEmailRequestedEventSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("POST /otp", () => {
  it("sends otp if ok", async () => {
    publishEmailRequestedEventSpy.mockResolvedValueOnce();
    const res = await POST("/otp", { email: "me@example.com" });
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({ ...successResponseTemplate, data: null });
    expect(publishEmailRequestedEventSpy).toHaveBeenCalledTimes(1);
    expect(publishEmailRequestedEventSpy).toHaveBeenNthCalledWith(1, {
      subject: expect.any(String),
      to: ["me@example.com"],
      cc: [],
      bcc: [],
      content: expect.any(String),
    });
  });

  it("returns 429 if requested too frequently", async () => {
    await sql`
      insert into otp_verifications (email, otp) values
      ('attacker@example.com', '123456')
    `;
    const res = await POST("/otp", { email: "attacker@example.com" });
    const json = await res.json();
    expect(res.status).toEqual(429);
    expect(json).toEqual(errorResponseTemplate);
    expect(publishEmailRequestedEventSpy).toHaveBeenCalledTimes(0);
  });
});
