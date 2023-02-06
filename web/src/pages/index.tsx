import { GetServerSideProps, type NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import CircleButton from "../components/buttons/CircleButton";
import { Layout } from "../components/Layout";
import { trpc } from "../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

type Row = Array<{ id: string; url: string }>;
type Rows = Array<Row>;

const Home: NextPage = () => {
  const imagesQuery = trpc.images.getImages.useQuery({
    page_size: "25",
  });

  const rows: Rows | undefined = imagesQuery.isLoading
    ? ([[]] as Rows)
    : imagesQuery.data?.images.reduce((acc, image, index) => {
        const row = Math.floor(index / 5);
        if (!acc[row]) {
          acc[row] = [];
        }
        acc[row]?.push({ id: image.id + "", url: image.url });

        return acc;
      }, [] as Rows);

  return (
    <Layout>
      <NextSeo title="Summon AI" />
      <a
        className="mt-8 mb-3 md:hidden"
        href="https://www.producthunt.com/posts/summon-ai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-summon&#0045;ai"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=366943&theme=dark"
          alt="Summon&#0046;AI - Generate&#0032;beautiful&#0032;images&#0032;with&#0032;DALL&#0045;E&#0045;2&#0032;in&#0032;Figma | Product Hunt"
          width="250"
          height="54"
        />
      </a>
      <h1 className="text-4xl md:mt-8 md:text-6xl">
        <div>
          <span className="mr-3 font-serif text-5xl font-bold italic transition-colors duration-300 hover:text-green-500 md:mr-12 md:text-7xl">
            Evolving
          </span>
          <span className="font-black">imagery</span>
        </div>
        <div className="mt-3 font-black md:mt-10 md:mb-4">with AI directly</div>
        <div>
          <span className="font-black">in</span>
          <span className="ml-3 font-serif text-5xl font-bold italic transition-colors duration-300 hover:text-green-500 md:ml-8 md:text-7xl">
            Figma
          </span>
        </div>
      </h1>
      <p className="mt-4 mb-12 max-w-[28ch] md:max-w-none">
        Get state-of-the-art AI tools directly in your favourite design tool.
      </p>
      <CircleButton />
      <Link href="/showcase"></Link>
      <div
        className="clip absolute right-4 bottom-[132px] flex flex-col items-end md:right-[111px] md:bottom-[140px]"
        style={{
          clipPath: "polygon(100% 0, 0% 100%, 100% 100%)",
        }}
      >
        <span className="absolute right-1/2 bottom-5 z-50 translate-x-1/2 rounded-full bg-gray-700 p-2 text-xs text-green-500">
          {imagesQuery.data?.count} images generated
        </span>
        {rows &&
          rows.map((row, index) => (
            <div key={index} className="flex">
              {row.map((image) => (
                <Link key={image.id} href={`/showcase/${image.id}`}>
                  <Image
                    className="transition-all hover:grayscale"
                    src={image.url}
                    alt={image.id}
                    width={124}
                    height={124}
                  />
                </Link>
              ))}
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default Home;
