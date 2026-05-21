import Router from "@koa/router";

import { getHealth } from "./health.controller";

export const healthRouter = new Router();

healthRouter.get("/health", getHealth);
