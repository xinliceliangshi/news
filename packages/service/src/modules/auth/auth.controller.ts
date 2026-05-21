import type { Context } from "koa";

import { success } from "../../shared/http/response";
import { loginUser, registerUser } from "./auth.service";
import type { LoginBody, RegisterBody } from "./auth.types";

export async function register(ctx: Context) {
  const user = await registerUser((ctx.request.body ?? {}) as RegisterBody);
  success(ctx, user, "register success", 201);
}

export async function login(ctx: Context) {
  const user = await loginUser((ctx.request.body ?? {}) as LoginBody);
  success(ctx, user, "login success");
}
