import { getServerSideSitemap } from "next-sitemap";
import { GetServerSideProps } from "next";
import { supabase } from "../../utils/supabase";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await supabase.from("images").select("id", { count: "exact" });
  const count = data?.count ?? 0;

  const images: {
    loc: string;
    lastmod: string;
  }[] = [];

  if (data) {
    for (let i = 0; i < count; i++) {
      images.push({
        loc: `${process.env.VERCEL_URL}/showcase/${i}`,
        lastmod: new Date().toISOString(),
      });
    }
  }

  return getServerSideSitemap(ctx, images);
};

export default function Sitemap() {
  return null;
}
