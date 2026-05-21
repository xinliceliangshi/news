import Router from "@koa/router";

import {
  getTopicDetail,
  getTopics,
  postTopic,
  postTopicArchive,
  postTopicPublish,
  postTopicVote,
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
