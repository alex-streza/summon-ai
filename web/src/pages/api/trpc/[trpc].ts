import { createNextApiHandler } from "@trpc/server/adapters/next";
import { withAxiom } from "next-axiom";
import { env } from "../../../env/server.mjs";
import { createContext } from "../../../server/trpc/context";
import { appRouter } from "../../../server/trpc/router/_app";

// Handle incoming tRPC requests
const handler = createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ ctx, path, error }) => {
          if (ctx) ctx.log.error(error.message);
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});

export default withAxiom(handler);
