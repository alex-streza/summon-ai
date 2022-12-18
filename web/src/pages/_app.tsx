import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";
export { reportWebVitals } from "next-axiom";
import { EB_Garamond, Inter } from "@next/font/google";

import "../styles/globals.css";
import { Layout } from "../components/Layout";
import { DefaultSeo } from "next-seo";

const inter = Inter({
  subsets: ["latin"],
  weight: ["600", "900"],
  style: ["normal"],
  variable: "--font-inter",
});
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-eb-garamond",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Layout className={[inter.variable, ebGaramond.variable].join(" ")}>
      <DefaultSeo
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "https://www.summon-ai.com",
          siteName: "Summon AI",
        }}
      />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </Layout>
  );
};

export default trpc.withTRPC(MyApp);
