import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";

import type { NextApiRequest, NextApiResponse } from "next";
import { AxiomAPIRequest } from "next-axiom/dist/withAxiom";
import { Database } from "../../types/supabase";
import { getServerAuthSession } from "../common/get-server-auth-session";
import { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "../../utils/supabase";

const isAxiomAPIRequest = (
  req?: NextApiRequest | AxiomAPIRequest
): req is AxiomAPIRequest => {
  return Boolean((req as AxiomAPIRequest)?.log);
};

type CreateContextOptions = {
  session: Session | null;
  supabase: SupabaseClient<Database>;
  res: NextApiResponse;
  req: NextApiRequest | AxiomAPIRequest;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async ({
  req,
  res,
  ...opts
}: CreateContextOptions) => {
  if (!isAxiomAPIRequest(req)) {
    throw new Error("this is not the request type I expected");
  }

  const log = req.log;

  return {
    session: opts.session,
    supabase: opts.supabase,
    res: res,
    req: req,
    log,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });
  const supabase = getSupabaseClient(session?.supabaseAccessToken);

  return await createContextInner({
    res: opts.res,
    req: opts.req,
    session,
    supabase,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
