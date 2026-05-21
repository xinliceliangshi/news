import Router from "@koa/router";

import { authRouter } from "./modules/auth/auth.routes";
import { healthRouter } from "./modules/health/health.routes";
import { topicRouter } from "./modules/topic/topic.routes";

export const apiRouter = new Router({
  prefix: "/api",
});

apiRouter.use(healthRouter.routes(), healthRouter.allowedMethods());
apiRouter.use(authRouter.routes(), authRouter.allowedMethods());
apiRouter.use(topicRouter.routes(), topicRouter.allowedMethods());
