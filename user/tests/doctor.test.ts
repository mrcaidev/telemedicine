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
import {
  doctorTemplate,
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { GET, POST } from "./utils/request";

const publishDoctorCreatedEventSpy = spyOn(
  producer,
  "publishDoctorCreatedEvent",
);

afterEach(() => {
  publishDoctorCreatedEventSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("GET /doctors", () => {
  it("returns doctors", async () => {
    const res = await GET("/doctors");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: expect.arrayContaining([doctorTemplate]),
        nextCursor: null,
      },
    });
  });

  it("paginates", async () => {
    const res1 = await GET("/doctors?limit=2");
    const json1 = await res1.json();
    expect(res1.status).toEqual(200);
    expect(json1).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: expect.arrayContaining([doctorTemplate]),
        nextCursor: expect.any(String),
      },
    });

    // @ts-ignore
    const cursor = json1.data.nextCursor as string;
    const res2 = await GET(`/doctors?limit=30&cursor=${cursor}`);
    const json2 = await res2.json();
    expect(res2.status).toEqual(200);
    expect(json2).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: expect.arrayContaining([doctorTemplate]),
        nextCursor: null,
      },
    });
  });
});

describe("GET /doctors/random", () => {
  it("returns random doctors", async () => {
    const res = await GET("/doctors/random");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: expect.arrayContaining([doctorTemplate]),
    });
  });

  it("limits number of doctors", async () => {
    const res = await GET("/doctors/random?limit=1");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: expect.arrayContaining([doctorTemplate]),
    });
    // @ts-ignore
    expect(json.data.length).toEqual(1);
  });
});

describe("GET /doctors/{id}", () => {
  it("returns doctor if ok", async () => {
    const res = await GET(`/doctors/${mockData.doctor.id}`);
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: mockData.doctor,
    });
  });

  it("returns 404 if doctor does not exist", async () => {
    const res = await GET("/doctors/00000000-0000-0000-0000-000000000000");
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("POST /doctors", () => {
  it("creates doctor if ok", async () => {
    publishDoctorCreatedEventSpy.mockResolvedValueOnce();
    const res = await POST(
      "/doctors",
      {
        email: "doctor2@example.com",
        password: mockData.password,
        firstName: "Tim",
        lastName: "Drake",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        id: uuidTemplate,
        role: "doctor",
        email: "doctor2@example.com",
        clinic: mockData.clinic,
        firstName: "Tim",
        lastName: "Drake",
        avatarUrl: null,
        gender: "male",
        description: "",
        specialties: [],
      },
    });
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(publishDoctorCreatedEventSpy).toHaveBeenNthCalledWith(1, json.data);
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await POST("/doctors", {
      email: "doctor3@example.com",
      password: mockData.password,
      firstName: "Tim",
      lastName: "Drake",
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 403 if user is platform admin", async () => {
    const res = await POST(
      "/doctors",
      {
        email: "doctor4@example.com",
        password: mockData.password,
        firstName: "Tim",
        lastName: "Drake",
      },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await POST(
      "/doctors",
      {
        email: "doctor5@example.com",
        password: mockData.password,
        firstName: "Tim",
        lastName: "Drake",
      },
      { headers: mockData.doctorAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 403 if user is patient", async () => {
    const res = await POST(
      "/doctors",
      {
        email: "doctor6@example.com",
        password: mockData.password,
        firstName: "Tim",
        lastName: "Drake",
      },
      { headers: mockData.patientAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 409 if email has already been registered", async () => {
    const res = await POST(
      "/doctors",
      {
        email: mockData.doctor.email,
        password: mockData.password,
        firstName: "Tim",
        lastName: "Drake",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(409);
    expect(json).toEqual(errorResponseTemplate);
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(0);
  });
});

describe("GET /doctors/search", () => {
  it("returns two doctors if searching 'surgery'", async () => {
    const res = await GET("/doctors/search?q=surgery");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: [
          {
            id: "df9ffcca-1415-4837-95fa-83288e199d99",
            clinic: mockData.clinic,
            firstName: "Christa",
            lastName: "Conn",
            avatarUrl: null,
            gender: "male",
            description: "Very good at Surgery",
            specialties: ["surgery"],
          },
          {
            id: "04cd46f0-c785-48cc-bde1-898aac54c425",
            clinic: mockData.clinic,
            firstName: "Rory",
            lastName: "Greenfelder",
            avatarUrl: null,
            gender: "male",
            description: "Good at both Cardiology and Surgery",
            specialties: ["cardiology"],
          },
        ],
        nextCursor: null,
      },
    });
  });

  it("returns one doctor if searching 'cardiology'", async () => {
    const res = await GET("/doctors/search?q=cardiology");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: [
          {
            id: "04cd46f0-c785-48cc-bde1-898aac54c425",
            clinic: mockData.clinic,
            firstName: "Rory",
            lastName: "Greenfelder",
            avatarUrl: null,
            gender: "male",
            description: "Good at both Cardiology and Surgery",
            specialties: ["cardiology"],
          },
        ],
        nextCursor: null,
      },
    });
  });

  it("returns one doctor if searching 'david tan'", async () => {
    const res = await GET("/doctors/search?q=david%20tan");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: [
          {
            id: mockData.doctor.id,
            clinic: mockData.doctor.clinic,
            firstName: mockData.doctor.firstName,
            lastName: mockData.doctor.lastName,
            avatarUrl: mockData.doctor.avatarUrl,
            gender: mockData.doctor.gender,
            description: mockData.doctor.description,
            specialties: mockData.doctor.specialties,
          },
        ],
        nextCursor: null,
      },
    });
  });

  it("returns no doctor if searching 'neurology'", async () => {
    const res = await GET("/doctors/search?q=neurology");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: { doctors: [], nextCursor: null },
    });
  });

  it("paginates", async () => {
    const res1 = await GET("/doctors/search?q=surgery&limit=1");
    const json1 = await res1.json();
    expect(res1.status).toEqual(200);
    expect(json1).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: [
          {
            id: "df9ffcca-1415-4837-95fa-83288e199d99",
            clinic: mockData.clinic,
            firstName: "Christa",
            lastName: "Conn",
            avatarUrl: null,
            gender: "male",
            description: "Very good at Surgery",
            specialties: ["surgery"],
          },
        ],
        nextCursor: expect.any(Number),
      },
    });

    const res2 = await GET(
      // @ts-ignore
      `/doctors/search?q=surgery&cursor=${json1.data.nextCursor}`,
    );
    const json2 = await res2.json();
    expect(res2.status).toEqual(200);
    expect(json2).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: [
          {
            id: "04cd46f0-c785-48cc-bde1-898aac54c425",
            clinic: mockData.clinic,
            firstName: "Rory",
            lastName: "Greenfelder",
            avatarUrl: null,
            gender: "male",
            description: "Good at both Cardiology and Surgery",
            specialties: ["cardiology"],
          },
        ],
        nextCursor: null,
      },
    });
  });
});
