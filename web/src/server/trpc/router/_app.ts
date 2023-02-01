import { generateOpenApiDocument } from "trpc-openapi";
import { env } from "../../../env/server.mjs";
import { router } from "../trpc";
import { authRouter } from "./auth";
import { images } from "./images";

export const appRouter = router({
  images: images,
  auth: authRouter,
});

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "tRPC OpenAPI",
  version: "1.0.0",
  baseUrl:
    env.NODE_ENV === "production"
      ? "https://www.summon-ai.com"
      : "http://localhost:3000",
});

// export type definition of API
export type AppRouter = typeof appRouter;
