import Router from "@koa/router";
import { postTopicVote } from "../vote/vote.controller";

import {
  getTopicDetail,
  getTopics,
  postTopic,
  postTopicArchive,
  postTopicPublish,
} from "./topic.controller";

export const topicRouter = new Router({
  prefix: "/topics",
});

topicRouter.get("/", getTopics);
topicRouter.post("/", postTopic);
topicRouter.get("/:id", getTopicDetail);
topicRouter.post("/:id/vote", postTopicVote);
topicRouter.post("/:id/publish", postTopicPublish);
topicRouter.post("/:id/archive", postTopicArchive);
