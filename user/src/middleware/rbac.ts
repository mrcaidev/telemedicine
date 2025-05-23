import type { Actor, Role } from "@/utils/types";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export function rbac(whitelist?: Role[]) {
  return createMiddleware<{ Variables: { actor: Actor } }>((c, next) => {
    // 从请求头中获取用户的 ID 和角色。
    const id = c.req.header("X-User-Id");
    const role = c.req.header("X-User-Role") as Role | undefined;
    const email = c.req.header("X-User-Email");

    // 不论如何，都要拒绝未登录的用户。
    // 如果希望未登录的用户也能访问，就不应该使用该中间件。
    if (!id || !role || !email) {
      throw new HTTPException(401, { message: "Please log in first" });
    }

    // 如果白名单不为空，且当前角色不在白名单内，就拒绝访问。
    if (whitelist && !whitelist.includes(role)) {
      throw new HTTPException(403, { message: "Permission denied" });
    }

    // 将用户存入当前请求的上下文，方便后续使用。
    c.set("actor", { id, role, email });
    return next();
  });
}
