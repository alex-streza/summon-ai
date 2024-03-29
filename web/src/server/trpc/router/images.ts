import { TRPCError } from "@trpc/server";
import Replicate from "replicate-js";
import { z } from "zod";
import { cloudflare } from "../../../utils/client";
import { getPagination } from "../../../utils/supabase";

import { publicProcedure, router, tokenProcedure } from "../trpc";

const replicate = new Replicate({ token: process.env.REPLICATE_API_KEY });

const sizeSchema = z
  .literal(128)
  .or(z.literal(256))
  .or(z.literal(512))
  .or(z.literal(768))
  .or(z.literal(1024));

const typeSchema = z.enum([
  "dall-e-2-generation",
  "dall-e-2-variant",
  "dall-e-2-edit",
  "openjourney-generation",
  "restored",
  "upscaled",
]);

export const images = router({
  getImages: publicProcedure
    .meta({ openapi: { method: "GET", path: "/images" } })
    .input(
      z.object({
        page: z.string().optional(),
        page_size: z.string().optional(),
        search: z.string().optional(),
        user_id: z.string().optional(),
      })
    )
    .output(
      z.object({
        count: z.number(),
        images: z
          .object({
            id: z.number(),
            url: z.string(),
            prompt: z.string(),
            created_at: z.string().optional(),
            figma_user_id: z.string(),
            name: z.string(),
            avatar_url: z.string(),
          })
          .array(),
      })
    )
    .query(async ({ ctx, input }) => {
      const page = parseInt(input.page ?? "1") - 1;
      const pageSize = parseInt(input.page_size ?? "9");

      const { from, to } = getPagination(page, pageSize);
      let query = ctx.supabase
        .from("images")
        .select(
          "id, url, prompt, figma_user_id, created_at, figma_users:figma_user_id (name, avatar_url)"
        )
        .ilike("prompt", "*" + (input.search ?? "") + "*");

      if (input.user_id) {
        query = query.eq("figma_user_id", input.user_id);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      let countQuery = ctx.supabase
        .from("images")
        .select("id", { count: "exact" })
        .ilike("prompt", "*" + (input.search ?? "") + "*");

      if (input.user_id) {
        countQuery = countQuery.eq("figma_user_id", input.user_id);
      }

      const { count, error: countError } = await countQuery;

      if (error || countError) {
        console.log("error ?? countError", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Images could not be retrieved",
          cause: error ?? countError,
        });
      }

      return {
        images: data.map(({ figma_users, ...image }) => ({
          ...image,
          prompt: image.prompt ?? "",
          ...(figma_users as {
            name: string;
            avatar_url: string;
            created_at: string;
          }),
        })),
        count: count ?? 0,
      };
    }),
  getImage: publicProcedure
    .meta({ openapi: { method: "GET", path: "/image/:id" } })
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(
      z.object({
        id: z.number(),
        url: z.string(),
        prompt: z.string(),
        created_at: z.string().optional(),
        figma_user_id: z.string(),
        name: z.string(),
        avatar_url: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("images")
        .select(
          "id, url, prompt, figma_user_id, created_at, figma_users:figma_user_id (name, avatar_url)"
        )
        .eq("id", input.id);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Images could not be retrieved",
          cause: error,
        });
      }

      const { figma_users, ...image } = data[0] as any;

      return {
        ...image,
        ...figma_users,
      };
    }),
  getUploadImageURL: publicProcedure
    .meta({ openapi: { method: "GET", path: "/images/upload-url" } })
    .input(z.object({ count: z.string().optional() }))
    .output(z.object({ urls: z.string().array() }))
    .query(async ({ ctx, input }) => {
      const { count = 1 } = input;

      if (count > 4) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only upload up to 4 images at a time.",
        });
      }

      const urls = [];

      try {
        for (let i = 0; i < count; i++) {
          const {
            result: { uploadURL },
          } = await cloudflare.getDirectUploadURL<{
            result: { uploadURL: string };
          }>();
          urls.push(uploadURL);
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Direct upload URL could not be generated",
          cause: error,
        });
      }

      return { urls };
    }),
  uploadImages: publicProcedure
    .meta({ openapi: { method: "POST", path: "/images" } })
    .input(
      z.object({
        image_urls: z.string().array(),
        prompt: z.string(),
        type: typeSchema,
        user: z.object({
          id: z.string(),
          name: z.string(),
          photoUrl: z.string(),
        }),
      })
    )
    .output(z.void())
    .query(async ({ input, ctx }) => {
      const {
        image_urls,
        prompt,
        user: { photoUrl, ...user },
      } = input;

      if (image_urls.length > 4) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only save up to 4 images at a time.",
        });
      }

      const { data: userExists } = await ctx.supabase
        .from("figma_users")
        .select("*")
        .eq("id", user.id);

      if (!userExists?.length) {
        const { error: userError } = await ctx.supabase
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

      const { error } = await ctx.supabase.from("images").insert(
        image_urls.map((url) => ({
          url,
          prompt,
          type: input.type,
          figma_user_id: user.id,
        }))
      );

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Images could not be inserted",
          cause: error,
        });
      }

      return;
    }),
  generateOpenjourneyImage: tokenProcedure
    .meta({ openapi: { method: "POST", path: "/images/openjourney" } })
    .input(
      z.object({
        width: sizeSchema,
        height: sizeSchema,
        num_outputs: z.literal(1).or(z.literal(4)),
        prompt: z.string(),
      })
    )
    .output(
      z.object({
        predictions: z.array(z.string()),
      })
    )
    .mutation(async ({ input: { width, height, ...rest }, ctx }) => {
      const openjourneyModel = await replicate.models.get(
        "prompthero/openjourney"
      );
      let predictions: string[] = [];

      try {
        predictions = await openjourneyModel.predict({
          ...rest,
          width,
          height,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Image could not be generated",
        });
      }

      if (ctx.session.user.id) {
        const { data, error } = await ctx.supabase.rpc("increment_stats", {
          table_name: "stats",
          user_id: ctx.session.user.id,
          field_name: "openjourney",
          x: rest.num_outputs,
        });

        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Stats could not be incremented",
            cause: error,
          });
        }
      }

      return {
        predictions,
      };
    }),
  restoreImage: tokenProcedure
    .meta({ openapi: { method: "POST", path: "/images/restore" } })
    .input(
      z.object({
        image: z.string(),
        task: z.enum([
          "Face Restoration",
          "Face Colorization",
          "Face Inpainting",
        ]),
        output_individual: z.boolean(),
        broken_image: z.boolean(),
      })
    )
    .output(
      z.object({
        predictions: z.string().array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let predictions = [];

      const restoreModel = await replicate.models.get("yangxy/gpen");

      try {
        predictions = (await restoreModel.predict(input)) ?? [];
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Image could not be restored",
        });
      }

      if (ctx.session.user.id) {
        const { data, error } = await ctx.supabase.rpc("increment_stats", {
          table_name: "stats",
          user_id: ctx.session.user.id,
          field_name: "restore",
          x: 1,
        });

        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Stats could not be incremented",
            cause: error,
          });
        }
      }

      return {
        predictions,
      };
    }),
  upscaleImage: tokenProcedure
    .meta({ openapi: { method: "POST", path: "/images/upscale" } })
    .input(
      z.object({
        image: z.string(),
        scale: z.number().min(1).max(10),
        face_enhance: z.boolean(),
      })
    )
    .output(
      z.object({
        prediction: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let prediction = "";

      const upscaleModel = await replicate.models.get(
        "nightmareai/real-esrgan"
      );

      try {
        prediction = (await upscaleModel.predict(input)) ?? "";
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Image could not be upscaled",
        });
      }

      if (ctx.session.user.id) {
        const { data, error } = await ctx.supabase.rpc("increment_stats", {
          table_name: "stats",
          user_id: ctx.session.user.id,
          field_name: "upscale",
          x: 1,
        });

        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Stats could not be incremented",
            cause: error,
          });
        }
      }

      return {
        prediction,
      };
    }),
});
