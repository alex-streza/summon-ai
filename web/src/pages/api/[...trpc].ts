import { createOpenApiNextHandler } from "trpc-openapi";
import { env } from "../../env/server.mjs";
import { createContext } from "../../server/trpc/context";
import { appRouter } from "../../server/trpc/router/_app";
import cors from "nextjs-cors";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  req.headers["Access-Control-Allow-Origin"] = "*";
  req.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE";
  req.headers["Access-Control-Allow-Headers"] = "Content-Type";

  await cors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  return createOpenApiNextHandler({
    router: appRouter,
    createContext,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path}: ${error}`);
          }
        : undefined,
  })(req, res);
};

export default handler;
