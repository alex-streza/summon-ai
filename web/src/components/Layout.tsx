import { DefaultSeo } from "next-seo";
import Footer from "./Footer";
import Navigation from "./Navigation";

export interface LayoutProps {
  children: React.ReactNode;
  isDark?: boolean;
}

export const Layout = ({ children, isDark }: LayoutProps) => {
  const className = isDark
    ? "bg-gradient-to-br from-gray-900 to-gray-700 md:px-[180px]"
    : "bg-white";

  return (
    <div
      className={`${className} relative flex h-full min-h-screen flex-col overflow-hidden px-4 pt-6 md:px-[111px]`}
    >
      <DefaultSeo
        description="Unlock the power of AI generated imagery with Summon AI, the premier directory powered by a free and open-source Figma plugin. Quickly generate professional-grade visuals for your projects and elevate your design skills"
        canonical="https://www.summon-ai.com"
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "https://www.summon-ai.com",
          siteName: "Summon AI",
          images: [
            {
              url: "/images/og.png",
              width: 1200,
              height: 630,
              alt: "Summon AI - coming soon",
            },
          ],
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

      <Navigation isDark={isDark} />
      {children}
      <Footer className={isDark ? "bg-transparent" : className} />
    </div>
  );
};
