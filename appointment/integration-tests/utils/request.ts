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

export async function DELETE(pathname: string, init: RequestInit = {}) {
  return await app.request(pathname, { method: "DELETE", ...init });
}
