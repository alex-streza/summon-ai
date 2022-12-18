import { type NextPage } from "next";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Image from "next/image";
import CircleButton from "../components/buttons/CircleButton";

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Summon AI - coming soon"
        description="Summon AI is a Figma plugin that uses AI to generate imagery for your designs."
        canonical="https://www.summon-ai.com"
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "https://www.summon-ai.com",
          siteName: "Summon AI",
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicons/favicon.ico",
          },
          {
            rel: "apple-touch-icon",
            href: "/favicons/apple-touch-icon.png",
            sizes: "76x76",
          },
          {
            rel: "icon",
            href: "/favicons/android-chrome-192x192.png",
            sizes: "192x192",
          },
          {
            rel: "icon",
            href: "/favicons/android-chrome-512x512.png",
            sizes: "512x512",
          },
          {
            rel: "apple-touch-icon",
            href: "/favicons/favicon-16x16.png",
            sizes: "16x16",
          },
          {
            rel: "apple-touch-icon",
            href: "/favicons/favicon-32x32.png",
            sizes: "32x32",
          },
          {
            rel: "manifest",
            href: "/site.webmanifest",
          },
        ]}
      />
      <h1 className="mt-16 mb-12 text-4xl md:text-7xl">
        <div>
          <span className="mr-3 font-serif text-5xl italic font-bold md:mr-12 md:text-8xl">
            Evolving
          </span>
          <span className="font-black">imagery</span>
        </div>
        <div className="mt-3 font-black md:mt-14 md:mb-6">with AI directly</div>
        <div>
          <span className="font-black">in</span>
          <span className="ml-3 font-serif text-5xl italic font-bold md:ml-12 md:text-8xl">
            Figma
          </span>
        </div>
      </h1>
      <CircleButton />
      <div className="absolute bottom-9 -right-32 z-10 h-[380px] w-[480px] overflow-hidden grayscale transition-all duration-300 hover:grayscale-0 md:-bottom-20 md:-right-64 md:h-[800px] md:w-[988px]">
        <Image src="/images/hero.png" alt="Summon AI - coming soon" fill />
      </div>
    </>
  );
};

export default Home;
