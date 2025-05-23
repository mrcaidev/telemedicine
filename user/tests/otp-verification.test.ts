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

const produceEventSpy = spyOn(producer, "produceEvent");

afterEach(() => {
  produceEventSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("POST /otp", () => {
  it("sends otp if ok", async () => {
    produceEventSpy.mockResolvedValueOnce();
    const res = await POST("/otp", { email: "me@example.com" });
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({ ...successResponseTemplate, data: null });
    expect(produceEventSpy).toHaveBeenCalledTimes(1);
    expect(produceEventSpy).toHaveBeenNthCalledWith(1, "EmailRequested", {
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
    expect(produceEventSpy).toHaveBeenCalledTimes(0);
  });
});
