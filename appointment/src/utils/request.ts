import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const serviceDiscovery = {
  notification: "http://notification:3000",
} as const;

type DiscoveredService = keyof typeof serviceDiscovery;

async function wrappedFetch<T>(url: string, init: RequestInit = {}) {
  try {
    const res = await fetch(url, init);
    const json = await res.json();
    const { message, data } = json as {
      code: number;
      message: "";
      data: T;
    };

    if (!res.ok) {
      throw new HTTPException(res.status as ContentfulStatusCode, { message });
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new HTTPException(502, { message: "Server error" });
  }
}

function createRequestToService(service: DiscoveredService) {
  return {
    get: async <T>(pathname: string, init: RequestInit = {}) => {
      return await wrappedFetch<T>(serviceDiscovery[service] + pathname, {
        method: "GET",
        ...init,
      });
    },
    post: async <T>(
      pathname: string,
      data: unknown = {},
      init: RequestInit = {},
    ) => {
      return await wrappedFetch<T>(serviceDiscovery[service] + pathname, {
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
      return await wrappedFetch<T>(serviceDiscovery[service] + pathname, {
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
      return await wrappedFetch<T>(serviceDiscovery[service] + pathname, {
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
      return await wrappedFetch<T>(serviceDiscovery[service] + pathname, {
        method: "DELETE",
        ...init,
      });
    },
  };
}

export const requestNotification = createRequestToService("notification");
