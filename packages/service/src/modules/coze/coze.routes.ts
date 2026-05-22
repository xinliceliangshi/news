import Router from "@koa/router";

import { postCozeWorkflowRun } from "./coze.controller";

export const cozeRouter = new Router({
  prefix: "/coze",
});

cozeRouter.post("/workflow/run", postCozeWorkflowRun);
