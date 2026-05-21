import type { Context, Next } from "koa";

import { AppError } from "../http/app-error";
import { failure } from "../http/response";

export async function errorHandlerMiddleware(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    if (error instanceof AppError) {
      failure(ctx, error.message, error.statusCode);
      return;
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    failure(ctx, message, 500);
  }
}
