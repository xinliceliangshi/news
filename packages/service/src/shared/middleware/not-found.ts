import type { Context, Next } from "koa";

import { failure } from "../http/response";

export async function notFoundMiddleware(ctx: Context, next: Next) {
  await next();

  if (ctx.status === 404 || ctx.body == null) {
    failure(ctx, "Not Found", 404);
  }
}
