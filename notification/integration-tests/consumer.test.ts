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
import { producer } from "@/events/kafka";
import { resend } from "@/utils/resend";

const producerSendSpy = spyOn(producer, "send").mockImplementation(
  async (record) => {
    const event = JSON.parse(record.messages[0]!.value!.toString());
    if (record.topic === "EmailRequested") {
      await consumeEmailRequestedEvent(event);
    }
    return [];
  },
);

const resendEmailsSendSpy = spyOn(resend.emails, "send");

afterEach(() => {
  producerSendSpy.mockClear();
  resendEmailsSendSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("EmailRequestedEvent", () => {
  it("sends email", async () => {
    resendEmailsSendSpy.mockResolvedValueOnce({
      data: { id: crypto.randomUUID() },
      error: null,
    });
    await producerSendSpy({
      topic: "EmailRequested",
      messages: [
        {
          value: JSON.stringify({
            subject: "subject",
            to: ["me@example.com"],
            cc: [],
            bcc: [],
            content: "content",
          }),
        },
      ],
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
    await producerSendSpy({
      topic: "EmailRequested",
      messages: [
        {
          value: JSON.stringify({
            subject: "subject",
            to: ["me@example.com"],
            cc: [],
            bcc: [],
            content: "content",
          }),
        },
      ],
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
});
