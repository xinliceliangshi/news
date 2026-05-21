import Router from "@koa/router";

import { login, register } from "./auth.controller";

export const authRouter = new Router({
  prefix: "/auth",
});

authRouter.post("/register", register);
authRouter.post("/login", login);
