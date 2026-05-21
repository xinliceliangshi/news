import "dotenv/config";
import "./types/koa-request";

import Koa from "koa";
import bodyParser from "koa-bodyparser";

import { env } from "./config/env";
import { apiRouter } from "./router";
import { corsMiddleware } from "./shared/middleware/cors";
import { errorHandlerMiddleware } from "./shared/middleware/error-handler";
import { notFoundMiddleware } from "./shared/middleware/not-found";

export function createApp() {
  const app = new Koa();

  app.use(errorHandlerMiddleware);
  app.use(corsMiddleware);
  app.use(bodyParser());
  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());
  app.use(notFoundMiddleware);

  return app;
}

const app = createApp();

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});

export default app;
