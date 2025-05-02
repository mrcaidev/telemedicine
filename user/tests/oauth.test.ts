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
import * as idTokenUtils from "@/utils/id-token";
import { mockData, successResponseTemplate, uuidTemplate } from "./utils/data";
import { POST } from "./utils/request";

const verifyGoogleIdTokenSpy = spyOn(idTokenUtils, "verifyGoogleIdToken");
const publishPatientCreatedEvent = spyOn(
  producer,
  "publishPatientCreatedEvent",
);

afterEach(() => {
  verifyGoogleIdTokenSpy.mockClear();
  publishPatientCreatedEvent.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("POST /oauth/google/login", () => {
  it("creates a new patient if google email does not exist", async () => {
    // 第一次会创建新用户。
    verifyGoogleIdTokenSpy.mockResolvedValue({
      sub: "1",
      email: "Maeve37@gmail.com",
      email_verified: true,
      name: "Maeve Harris",
      picture: "https://example.com/avatar.jpg",
      given_name: "Maeve",
      family_name: "Harris",
    });
    publishPatientCreatedEvent.mockResolvedValue();
    const res1 = await POST("/oauth/google/login", { idToken: "..." });
    const json1 = await res1.json();
    expect(res1.status).toEqual(201);
    expect(json1).toEqual({
      ...successResponseTemplate,
      data: {
        id: uuidTemplate,
        role: "patient",
        email: "Maeve37@gmail.com",
        nickname: "Maeve Harris",
        avatarUrl: "https://example.com/avatar.jpg",
        gender: null,
        birthDate: null,
        token: expect.any(String),
      },
    });
    expect(publishPatientCreatedEvent).toHaveBeenCalledTimes(1);
    // @ts-ignore
    const { token, ...patient } = json1.data;
    expect(publishPatientCreatedEvent).toHaveBeenNthCalledWith(1, patient);

    // 第二次之后不再创建新用户。
    const res2 = await POST("/oauth/google/login", { idToken: "..." });
    const json2 = await res2.json();
    expect(res2.status).toEqual(201);
    expect(json2).toEqual({
      ...successResponseTemplate,
      data: {
        ...patient,
        token: expect.any(String),
      },
    });
    expect(publishPatientCreatedEvent).toHaveBeenCalledTimes(1);
  });

  it("links google identity to existing patient if google email exists", async () => {
    // 第一次会绑定。
    verifyGoogleIdTokenSpy.mockResolvedValue({
      sub: "2",
      email: mockData.patient.email,
      email_verified: true,
      name: "Katrina Douglas",
      picture: "https://example.com/katrina-douglas.jpg",
      given_name: "Katrina",
      family_name: "Douglas",
    });
    const res1 = await POST("/oauth/google/login", { idToken: "..." });
    const json1 = await res1.json();
    expect(res1.status).toEqual(201);
    expect(json1).toEqual({
      ...successResponseTemplate,
      data: {
        ...mockData.patient,
        token: expect.any(String),
      },
    });
    expect(publishPatientCreatedEvent).toHaveBeenCalledTimes(0);

    // 第二次直接登录。
    const res2 = await POST("/oauth/google/login", { idToken: "..." });
    const json2 = await res2.json();
    expect(res2.status).toEqual(201);
    expect(json2).toEqual({
      ...successResponseTemplate,
      data: {
        ...mockData.patient,
        token: expect.any(String),
      },
    });
    expect(publishPatientCreatedEvent).toHaveBeenCalledTimes(0);
  });
});
