import type { Role } from "@/utils/types";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export function authGuard(whitelist?: Role[]) {
  return createMiddleware<{ Variables: { userId: string; userRole: Role } }>(
    (c, next) => {
      // 从请求头中获取用户的 ID 和角色。
      const id = c.req.header("X-User-Id");
      const role = c.req.header("X-User-Role") as Role | undefined;

      // 不论如何，都要拒绝未登录的用户。
      // 如果希望未登录的用户也能访问，就不应该使用该中间件。
      if (!id || !role) {
        throw new HTTPException(401, { message: "Please log in first" });
      }

      // 将用户的 ID 和角色存入当前请求的上下文，方便后续请求使用。
      c.set("userId", id);
      c.set("userRole", role);

      // 如果白名单为空，或者当前角色在白名单内，就允许访问。
      if (!whitelist || whitelist.includes(role)) {
        return next();
      }

      // 否则拒绝访问。
      throw new HTTPException(403, { message: "Permission denied" });
    },
  );
}
