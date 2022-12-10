import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title> Summon AI - coming soon</title>
        <meta name="description" content="Summon AI - coming soon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-4xl font-bold text-white">
          Summon AI - coming soon
        </h1>
      </main>
    </>
  );
};

export default Home;
