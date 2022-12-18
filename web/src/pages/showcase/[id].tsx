import { type NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { BackButton } from "../../components/buttons/BackButton";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";

export const getServersideProps = async () => {
  return {
    props: {},
  };
};

const Showcase: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = trpc.images.getImage.useQuery({
    id: id as string,
  });

  return (
    <Layout isDark>
      <NextSeo
        title={"Summon AI - " + data?.prompt}
        description="Summon AI is a Figma plugin that uses AI to generate imagery for your designs."
      />
      <BackButton href="/showcase" label="showcase" className="mt-8 mb-6" />
      <div className="relative w-full h-full overflow-hidden rounded">
        {data && <img src={data?.url} alt={data?.prompt} />}
      </div>
      <p className="mt-8 text-center text-white">{data?.prompt}</p>
    </Layout>
  );
};

export default Showcase;
