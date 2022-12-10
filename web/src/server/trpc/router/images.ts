import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cloudflare } from "../../../utils/client";
import { supabase, getPagination } from "../../../utils/supabase";

import { publicProcedure, router } from "../trpc";

export const images = router({
  getImages: publicProcedure
    .meta({ openapi: { method: "GET", path: "/images" } })
    .input(
      z.object({
        page: z.string().optional(),
        page_size: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .output(
      z.object({
        count: z.number(),
        images: z
          .object({
            url: z.string(),
            prompt: z.string(),
            figma_user_id: z.string(),
            figma_users: z.object({
              name: z.string(),
              avatar_url: z.string(),
            }),
          })
          .array(),
      })
    )
    .query(async ({ input }) => {
      const page = parseInt(input.page ?? "1") - 1;
      const pageSize = parseInt(input.page_size ?? "9");

      const { from, to } = getPagination(page, pageSize);
      const { data, error } = await supabase
        .from("images")
        .select(
          "url, prompt, figma_user_id, figma_users:figma_user_id (name, avatar_url)"
        )
        .ilike("prompt", "*" + (input.search ?? "") + "*")
        .order("created_at", { ascending: false })
        .range(from, to);

      const { count, error: countError } = await supabase
        .from("images")
        .select("id", { count: "exact" })
        .ilike("prompt", "*" + (input.search ?? "") + "*");

      if (error || countError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Images could not be retrieved",
          cause: error,
        });
      }

      // TOOD: Get supabase types
      return { images: data as any, count: count ?? 0 };
    }),
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
          } = await cloudflare.getDirectUploadURL<{
            result: { uploadURL: string };
          }>();
          urls.push(uploadURL);
        } catch (error) {
          console.log("error", error);
        }
      }

      return { urls };
    }),
  uploadImages: publicProcedure
    .meta({ openapi: { method: "POST", path: "/images" } })
    .input(
      z.object({
        image_urls: z.string().array(),
        prompt: z.string(),
        user: z.object({
          id: z.string(),
          name: z.string(),
          photoUrl: z.string(),
        }),
      })
    )
    .output(z.void())
    .query(async ({ input }) => {
      const {
        image_urls,
        prompt,
        user: { photoUrl, ...user },
      } = input;

      const { data: userExists } = await supabase
        .from("figma_users")
        .select("*")
        .eq("id", user.id);

      if (!userExists?.length) {
        const { error: userError } = await supabase
          .from("figma_users")
          .insert({ ...user, avatar_url: photoUrl });

        if (userError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User could not be upserted",
            cause: userError,
          });
        }
      }

      const { error } = await supabase.from("images").insert(
        image_urls.map((url) => ({
          url,
          prompt,
          figma_user_id: user.id,
        }))
      );

      if (error) {
        console.log("error", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Images could not be inserted",
          cause: error,
        });
      }

      return;
    }),
});
