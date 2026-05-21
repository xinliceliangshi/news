import type { Context } from "koa";

import { success } from "../../shared/http/response";

export function getHealth(ctx: Context) {
  success(
    ctx,
    {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    "OK",
  );
}
