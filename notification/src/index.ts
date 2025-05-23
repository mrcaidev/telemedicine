import "@/events/consumer";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { isValiError } from "valibot";
import { scheduledEmailController } from "./controllers/scheduled-email";

const app = new Hono();

app.get("/livez", (c) => {
  return c.text("live");
});

app.get("/readyz", (c) => {
  return c.text("ready");
});

app.route("/scheduled-emails", scheduledEmailController);

app.onError((error, c) => {
  if (isValiError(error)) {
    if (Bun.env.NODE_ENV === "development") {
      console.error(error);
    }
    return c.json({ code: 400, message: error.message, data: null }, 400);
  }

  if (error instanceof HTTPException) {
    return c.json(
      { code: error.status, message: error.message, data: null },
      error.status,
    );
  }

  console.error(error);
  return c.json({ code: 500, message: "Server error", data: null }, 500);
});

export default app;
