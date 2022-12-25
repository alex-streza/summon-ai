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

const placeholders = [...Array(15)];
const filledPositions = [0, 2, 4, 5, 6, 8, 10, 12, 14];

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
    page_size: "9",
    search,
  });

  const images = useMemo(() => {
    const images = [];
    let j = 0;

    if (data?.images.length == 0) {
      return [];
    }

    for (let i = 0; i < 15; i++) {
      if (filledPositions.includes(i)) {
        images.push(
          data?.images
            ? data?.images[j]
            : {
                id: "image-" + i,
                url: "",
                prompt: "",
              }
        );
        j++;
      } else {
        images.push(null);
      }
    }

    return images;
  }, [data]);

  const handleSearch = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(ev.target.value);
    },
    []
  );

  const notFound = !isLoading && images.length == 0;

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
          placeholders.map((_, index) =>
            filledPositions.includes(index) ? (
              <div
                key={index}
                className="aspect-square h-full w-full animate-[pulse_1s_ease-in-out_infinite] bg-gray-800"
              />
            ) : (
              <div key={index} />
            )
          )}
        {!isLoading &&
          images.map((image, index) =>
            image ? (
              <Link key={image.id} href={`/showcase/${image.id}`}>
                <div className="relative w-full h-full overflow-hidden rounded">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="transition-all duration-300 grayscale-0 hover:grayscale"
                  />
                </div>
              </Link>
            ) : (
              <div key={index} />
            )
          )}
        {notFound && <NotFound onReset={() => setSearch("")} />}
      </div>
    </Layout>
  );
};

export default Showcase;
