import { verifyJwt } from "@/utils/jwt";
import { Hono } from "hono";

export const authGatewayController = new Hono();

authGatewayController.get("/", async (c) => {
  try {
    // JWT 会被放在请求头的 Authorization 字段中，
    // 以 "Bearer " 开头，后面跟着 JWT。
    const token = c.req.header("Authorization")?.slice(7);

    // 即使没有携带 JWT，也不应该返回 401，而是仍返回 204，
    // 由各个端点自行决定是否返回 401。
    if (!token) {
      return c.body(null, 204);
    }

    // 如果 JWT 验证成功，说明 JWT 必然是可信且有效的，
    // 将其中的 ID 和角色信息放入响应头中。
    const { id, role, email } = await verifyJwt(token);
    c.header("X-User-Id", id);
    c.header("X-User-Role", role);
    c.header("X-User-Email", email);

    // 返回 204。
    return c.body(null, 204);
  } catch {
    // 如果 JWT 验证失败，仍返回 204，理由同上。
    return c.body(null, 204);
  }
});
