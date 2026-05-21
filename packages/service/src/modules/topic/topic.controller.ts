import type { Context } from "koa";

import { success } from "../../shared/http/response";
import {
  archiveTopic,
  createTopic,
  getTopicById,
  listTopics,
  publishTopic,
} from "./topic.service";
import type { CreateTopicBody } from "./topic.types";

function parseRouteId(ctx: Context) {
  return Number(ctx.params.id);
}

export async function getTopics(ctx: Context) {
  const tag = typeof ctx.query.tag === "string" ? ctx.query.tag : undefined;
  const keyword =
    typeof ctx.query.keyword === "string" ? ctx.query.keyword : undefined;
  const limit =
    typeof ctx.query.limit === "string" ? Number(ctx.query.limit) : undefined;

  success(
    ctx,
    await listTopics({
      tag,
      keyword,
      limit: Number.isFinite(limit) ? limit : undefined,
    }),
    "topics fetched",
  );
}

export async function getTopicDetail(ctx: Context) {
  const id = parseRouteId(ctx);
  success(ctx, await getTopicById(id), "topic fetched");
}

export async function postTopic(ctx: Context) {
  const topic = await createTopic((ctx.request.body ?? {}) as CreateTopicBody);
  success(ctx, topic, "topic created", 201);
}

export async function postTopicPublish(ctx: Context) {
  const id = parseRouteId(ctx);
  success(ctx, await publishTopic(id), "topic published");
}

export async function postTopicArchive(ctx: Context) {
  const id = parseRouteId(ctx);
  success(ctx, await archiveTopic(id), "topic archived");
}
