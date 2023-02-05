import { type NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import CircleButton from "../components/buttons/CircleButton";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <NextSeo title="Summon AI" />
      <a
        className="mt-16 mb-3 md:hidden"
        href="https://www.producthunt.com/posts/summon-ai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-summon&#0045;ai"
        target="_blank"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=366943&theme=dark"
          alt="Summon&#0046;AI - Generate&#0032;beautiful&#0032;images&#0032;with&#0032;DALL&#0045;E&#0045;2&#0032;in&#0032;Figma | Product Hunt"
          width="250"
          height="54"
        />
      </a>
      <h1 className="mb-12 text-4xl md:mt-12 md:text-6xl">
        <div>
          <span className="mr-3 font-serif text-5xl italic font-bold transition-colors duration-300 hover:text-green-500 md:mr-12 md:text-7xl">
            Evolving
          </span>
          <span className="font-black">imagery</span>
        </div>
        <div className="mt-3 font-black md:mt-14 md:mb-6">with AI directly</div>
        <div>
          <span className="font-black">in</span>
          <span className="ml-3 font-serif text-5xl italic font-bold transition-colors duration-300 hover:text-green-500 md:ml-12 md:text-7xl">
            Figma
          </span>
        </div>
      </h1>
      <CircleButton />
      <Link href="/showcase"></Link>
    </Layout>
  );
};

export default Home;
