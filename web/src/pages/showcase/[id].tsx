import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CheckIcon, CopyIcon } from "@primer/octicons-react";
import { type NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { BackButton } from "../../components/buttons/BackButton";
import { Button } from "../../components/buttons/Button";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";

export const getServersideProps = async () => {
  return {
    props: {},
  };
};

const Showcase: NextPage = () => {
  const [copied, setCopied] = useState(false);

  const [parent] = useAutoAnimate<HTMLDivElement>();

  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = trpc.images.getImage.useQuery(
    {
      id: id as string,
    },
    {
      enabled: !!id,
    }
  );

  const handleCopy = useCallback(() => {
    setCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <Layout isDark>
      {!isLoading && (
        <NextSeo
          title={"Summon AI - " + (data?.prompt ?? "")}
          description={data?.prompt ?? ""}
          openGraph={{
            images: [
              {
                url:
                  "https://staging.summon-ai.com/api/og?prompt=" +
                  data?.prompt +
                  "&url=" +
                  data?.url,
                width: 1200,
                height: 630,
                alt: data?.prompt,
              },
            ],
          }}
        />
      )}
      <BackButton href="/showcase" label="showcase" className="mt-8 mb-6" />
      <div ref={parent} className="flex flex-col items-center">
        {!isLoading && (
          <>
            <div className="relative grid w-full h-full overflow-hidden rounded place-content-center">
              {data && <img src={data?.url} alt={data?.prompt} />}
            </div>
            <div className="flex gap-2 mx-auto mt-8 text-gray-300">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5 19.8333L19.8333 15.1667H15.1666V7H23.3333V15.1667L21 19.8333H17.5ZM6.99996 19.8333L9.33329 15.1667H4.66663V7H12.8333V15.1667L10.5 19.8333H6.99996Z"
                  fill="currentColor"
                />
              </svg>
              <p className="text-center">{data?.prompt}</p>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5 19.8333L19.8333 15.1667H15.1666V7H23.3333V15.1667L21 19.8333H17.5ZM6.99996 19.8333L9.33329 15.1667H4.66663V7H12.8333V15.1667L10.5 19.8333H6.99996Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <Button onClick={handleCopy} className="mx-auto mt-8">
              {!copied ? "Share link" : "Link copied"}
              {!copied ? <CopyIcon /> : <CheckIcon />}
            </Button>
          </>
        )}
        {isLoading && (
          <div className="flex flex-col items-center">
            <div className="mx-auto mb-8 aspect-square h-full w-full max-w-[768px] animate-[pulse_1s_ease-in-out_infinite] bg-gray-800" />
            <div className="mb-2 h-6 w-[320px] animate-[pulse_1s_ease-in-out_infinite] bg-gray-800" />
            <div className="mb-2 h-6 w-[240px] animate-[pulse_1s_ease-in-out_infinite] bg-gray-800" />
            <div className="h-6 w-[120px] animate-[pulse_1s_ease-in-out_infinite] bg-gray-800" />
            <div className="mt-8 h-10 w-[160px] animate-[pulse_1s_ease-in-out_infinite] bg-gray-800" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Showcase;
