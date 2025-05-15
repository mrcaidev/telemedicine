import { tokenStore } from "@/utils/secure-store";

export class RequestError extends Error {
  public readonly code: number;

  public constructor(code: number, message: string) {
    super(message);
    this.name = "RequestError";
    this.code = code;
  }
}

type ResponseJson<T> = {
  code: number;
  message: string;
  data: T;
};

async function wrappedFetch<T>(pathname: string, init: RequestInit) {
  const token = await tokenStore.get();

  const res = await fetch(process.env.EXPO_PUBLIC_API_BASE_URL + pathname, {
    ...init,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...init.headers,
    },
  });

  const { code, message, data }: ResponseJson<T> = await res.json();

  if (!res.ok) {
    throw new RequestError(code, message);
  }

  return data;
}

export const request = {
  get: async <T>(pathname: string, init: RequestInit = {}) => {
    return await wrappedFetch<T>(pathname, { method: "GET", ...init });
  },

  post: async <T>(
    pathname: string,
    data: unknown = {},
    init: RequestInit = {},
  ) => {
    return await wrappedFetch<T>(pathname, {
      method: "POST",
      body: JSON.stringify(data),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  },

  put: async <T>(
    pathname: string,
    data: unknown = {},
    init: RequestInit = {},
  ) => {
    return await wrappedFetch<T>(pathname, {
      method: "PUT",
      body: JSON.stringify(data),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  },

  patch: async <T>(
    pathname: string,
    data: unknown = {},
    init: RequestInit = {},
  ) => {
    return await wrappedFetch<T>(pathname, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  },

  delete: async <T>(pathname: string, init: RequestInit = {}) => {
    return await wrappedFetch<T>(pathname, { method: "DELETE", ...init });
  },

  form: async <T>(
    pathname: string,
    data: FormData = new FormData(),
    init: RequestInit = {},
  ) => {
    return await wrappedFetch<T>(pathname, {
      method: "POST",
      body: data,
      ...init,
    });
  },
};
