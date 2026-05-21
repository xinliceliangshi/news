import type { Context, Next } from "koa";

export async function corsMiddleware(ctx: Context, next: Next) {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (ctx.method === "OPTIONS") {
    ctx.status = 204;
    return;
  }

  await next();
}
