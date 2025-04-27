import type { Role } from "@/utils/types";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export function roleGuard(roles?: Role[]) {
  return createMiddleware<{ Variables: { userId: string; userRole: Role } }>(
    (c, next) => {
      // 从请求头中获取用户的 ID 和角色。
      const id = c.req.header("X-User-Id");
      const role = c.req.header("X-User-Role") as Role | undefined;

      // 不论如何，都要拒绝未认证的用户。
      if (!id || !role) {
        throw new HTTPException(401, { message: "Please log in first" });
      }

      // 将 ID 和角色存入当前请求的上下文，方便后续请求使用。
      c.set("userId", id);
      c.set("userRole", role);

      // 如果不传入任何的角色，就允许所有角色通过。
      if (!roles) {
        return next();
      }

      // 如果当前用户的角色处于传入的角色列表中，就允许通过。
      if (roles.includes(role)) {
        return next();
      }

      // 否则返回 403，拒绝访问。
      throw new HTTPException(403, { message: "Permission denied" });
    },
  );
}
