import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import CircleButton from "../components/buttons/CircleButton";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title> Summon AI - coming soon</title>
        <meta name="description" content="Summon AI - coming soon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
