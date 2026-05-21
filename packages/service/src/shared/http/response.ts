import type { Context } from "koa";

export function success<T>(
  ctx: Context,
  data: T,
  message = "OK",
  status = 200,
) {
  ctx.status = status;
  ctx.body = {
    success: true,
    message,
    data,
  };
}

export function failure(ctx: Context, message: string, status = 400) {
  ctx.status = status;
  ctx.body = {
    success: false,
    message,
  };
}
