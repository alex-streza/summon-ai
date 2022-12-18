import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { EB_Garamond, Inter } from "@next/font/google";
import { trpc } from "../utils/trpc";
export { reportWebVitals } from "next-axiom";

import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "900"],
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
    <main className={[inter.variable, ebGaramond.variable].join(" ")}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </main>
  );
};

export default trpc.withTRPC(MyApp);
