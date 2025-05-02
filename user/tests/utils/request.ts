import app from "@/index";

export async function GET(pathname: string, init: RequestInit = {}) {
  return await app.request(pathname, { method: "GET", ...init });
}

export async function POST(
  pathname: string,
  data: unknown = {},
  init: RequestInit = {},
) {
  return await app.request(pathname, {
    method: "POST",
    body: JSON.stringify(data),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

export async function PUT(
  pathname: string,
  data: unknown = {},
  init: RequestInit = {},
) {
  return await app.request(pathname, {
    method: "PUT",
    body: JSON.stringify(data),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

export async function PUTFORM(
  pathname: string,
  data: FormData = new FormData(),
  init: RequestInit = {},
) {
  return await app.request(pathname, { method: "PUT", body: data, ...init });
}

export async function PATCH(
  pathname: string,
  data: unknown = {},
  init: RequestInit = {},
) {
  return await app.request(pathname, {
    method: "PATCH",
    body: JSON.stringify(data),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

export async function DELETE(
  pathname: string,
  data: unknown = {},
  init: RequestInit = {},
) {
  return await app.request(pathname, {
    method: "DELETE",
    body: JSON.stringify(data),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}
