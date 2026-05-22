import type { Context } from "koa";

import { success } from "../../shared/http/response";
import { runCozeWorkflow } from "./coze.service";
import type { RunCozeWorkflowBody } from "./coze.types";

export async function postCozeWorkflowRun(ctx: Context) {
  const result = await runCozeWorkflow((ctx.request.body ?? {}) as RunCozeWorkflowBody);
  success(ctx, result, "workflow completed");
}
