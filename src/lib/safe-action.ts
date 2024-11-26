import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";

//import { validateRequest } from "./auth";
import { z } from "zod";
//import { Ratelimit } from "@upstash/ratelimit";
import { logger } from "./logger";

/*const ratelimit = new Ratelimit({
    limiter: Ratelimit.fixedWindow(10, "10s"),
    redis: RedisClient,
  });*/

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    if (e instanceof Error) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const actionClientWithMeta = createSafeActionClient({
  handleServerError: (e) => {
    if (e instanceof Error) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema: () => {
    return z.object({
      actionName: z.string(),
    });
  },
});

export const authActionClient = actionClientWithMeta.use(
  async ({ next, clientInput, metadata }) => {
    const result = await next();

    if (process.env.NODE_ENV === "development") {
      logger("Input ->", clientInput);
      logger("Result ->", result.data);
      logger("Metadata ->", metadata);
    }

    return result;
  }
);
/*.use(async ({ next }) => {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Unauthorized");
    }

    return next({ ctx: { user } });
  });*/
