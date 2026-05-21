import type { Context } from "koa";

import { success } from "../../shared/http/response";
import { voteTopic } from "./vote.service";
import type { VoteTopicBody } from "./vote.types";

function parseRouteId(ctx: Context) {
  return Number(ctx.params.id);
}

export async function postTopicVote(ctx: Context) {
  const id = parseRouteId(ctx);
  const result = await voteTopic(id, (ctx.request.body ?? {}) as VoteTopicBody);
  success(ctx, result, "vote recorded");
}
