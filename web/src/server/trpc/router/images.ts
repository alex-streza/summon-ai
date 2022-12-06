import { z } from "zod";
import { client } from "../../../utils/client";

import { publicProcedure, router } from "../trpc";

export const images = router({
  getUploadImageURL: publicProcedure
    .meta({ openapi: { method: "GET", path: "/images/upload-url" } })
    .input(z.object({ count: z.string().optional() }))
    .output(z.object({ urls: z.string().array() }))
    .query(async ({ input }) => {
      const { count = 1 } = input;

      const urls = [];

      for (let i = 0; i < count; i++) {
        try {
          const {
            result: { uploadURL },
          } = await client
            .post("direct_upload")
            .json<{ result: { uploadURL: string } }>();
          urls.push(uploadURL);
        } catch (error) {
          console.log("error", error);
        }
      }

      return { urls };
    }),
});
