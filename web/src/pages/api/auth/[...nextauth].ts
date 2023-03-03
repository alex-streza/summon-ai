import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import jwt from "jsonwebtoken";
import NextAuth, { type NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";

const figmaProvider: Provider = {
  id: "figma",
  name: "Figma",
  type: "oauth",
  authorization: {
    url: "https://www.figma.com/oauth",
    params: {
      scope: "file_read",
      response_type: "code",
    },
  },
  token: {
    url: "https://www.figma.com/api/oauth/token",
    async request(context) {
      const provider = context.provider;
      const res = await fetch(
        `https://www.figma.com/api/oauth/token?client_id=${provider.clientId}&client_secret=${provider.clientSecret}&redirect_uri=${provider.callbackUrl}&code=${context.params.code}&grant_type=authorization_code`,
        { method: "POST" }
      );
      const json = await res.json();
      return { tokens: json };
    },
  },
  userinfo: "https://api.figma.com/v1/me",
  profile(profile) {
    console.log("profile", profile);
    return {
      id: profile.id,
      name: `${profile.handle}`,
      email: profile.email,
      image: profile.img_url,
    };
  },
  clientId: process.env.FIGMA_ID,
  clientSecret: process.env.FIGMA_SECRET,
};

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        };
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
        session.user = user;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    //   clientSec`ret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    // }),
    figmaProvider,
    // ...add more providers here
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  }),
  pages: {
    signIn: "/auth/sign-in",
  },
};

export default NextAuth(authOptions);
