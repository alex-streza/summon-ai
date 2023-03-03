import { SearchIcon } from "@primer/octicons-react";
import { type NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { BackButton } from "../../components/buttons/BackButton";
import Input from "../../components/inputs/Input";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import NotFound from "../../components/NotFound";
import { useAtom } from "jotai";
import { searchAtom } from "../../utils/store";

const placeholders = [...Array(20)];

export const getServersideProps = async () => {
  return {
    props: {},
  };
};

const Showcase: NextPage = () => {
  const [search, setSearch] = useAtom(searchAtom);
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const { data, isLoading } = trpc.images.getImages.useQuery({
    page: "1",
    page_size: "20",
    search,
  });

  const handleSearch = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(ev.target.value);
    },
    []
  );

  const notFound = !isLoading && data?.images?.length == 0;

  return (
    <Layout isDark>
      <NextSeo
        title="Summon AI - Showcase"
        description="Looking for unique, AI generated imagery? Look no further than Summon AI! Our directory is powered by a free and open-source Figma plugin, making it easy to access a limitless supply of professional-grade visuals. Boost your design skills with Summon AI today!"
      />
      <BackButton href="/" label="home" className="mt-8" />
      <Input
        placeholder="Search by prompt contents"
        className="mt-3 md:mt-6"
        containerClassName="md:max-w-sm"
        defaultValue={search}
        onChange={handleSearch}
        icon={<SearchIcon size={24} />}
      />
      <p className="mt-2 text-sm text-white">
        {!notFound && !isLoading
          ? `${data?.count} images found.`
          : "Searching for images..."}
      </p>
      <div
        ref={parent}
        className={`grid ${
          !notFound
            ? "grid-cols-3 grid-rows-5 md:grid-cols-5 md:grid-rows-3"
            : "place-content-center"
        } my-5 gap-5 md:my-8`}
      >
        {isLoading &&
          placeholders.map((_, index) => (
            <div
              key={index}
              className="aspect-square h-full w-full animate-[pulse_1s_ease-in-out_infinite] bg-gray-800"
            />
          ))}
        {!isLoading &&
          data?.images &&
          data.images.map((image, index) => (
            <Link key={image.id} href={`/showcase/${image.id}`}>
              <div className="relative aspect-square h-full w-full overflow-hidden rounded">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="block rounded-lg object-cover object-center grayscale-0 transition-all duration-300 hover:grayscale"
                />
              </div>
            </Link>
          ))}
        {notFound && <NotFound onReset={() => setSearch("")} />}
      </div>
    </Layout>
  );
};

export default Showcase;
