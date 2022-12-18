import { SearchIcon } from "@primer/octicons-react";
import { type NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { BackButton } from "../../components/buttons/BackButton";
import Input from "../../components/inputs/Input";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";

const Showcase: NextPage = () => {
  const [search, setSearch] = useState("");

  const { data } = trpc.images.getImages.useQuery({
    page: "1",
    page_size: "9",
    search,
  });

  const filledPositions = useMemo(() => {
    const positions: number[] = [];

    for (let i = 0; i < 9; i++) {
      let pos = Math.floor(Math.random() * 15) + 1;

      while (positions.includes(pos)) {
        pos = Math.floor(Math.random() * 15) + 1;

        if (!positions.includes(pos)) {
          break;
        }
      }

      positions.push(pos);
    }

    return positions;
  }, []);

  const images = useMemo(() => {
    if (!data?.images) return [];

    const images = [];
    let j = 0;

    for (let i = 0; i < 15; i++) {
      if (filledPositions.includes(i)) {
        images.push(data?.images[j]);
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

  return (
    <Layout isDark>
      <NextSeo
        title="Summon AI - Showcase"
        description="Summon AI is a Figma plugin that uses AI to generate imagery for your designs."
      />
      <BackButton href="/" label="home" className="mt-8" />
      <Input
        placeholder="Search by prompt contents"
        className="mt-3"
        onChange={handleSearch}
        icon={<SearchIcon size={24} />}
      />
      <div className="grid grid-cols-3 grid-rows-5 gap-5 mt-5">
        {images.map((image, index) =>
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
      </div>
    </Layout>
  );
};

export default Showcase;
