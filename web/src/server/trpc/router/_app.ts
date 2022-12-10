import { generateOpenApiDocument } from "trpc-openapi";
import { router } from "../trpc";
import { images } from "./images";

export const appRouter = router({
  images: images,
  // auth: authRouter,
});

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "tRPC OpenAPI",
  version: "1.0.0",
  baseUrl: "http://localhost:3000/api",
});

// export type definition of API
export type AppRouter = typeof appRouter;
