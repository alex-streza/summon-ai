import { GetServerSideProps } from "next";
import { getProviders, signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { Button } from "../../components/buttons/Button";
import { Layout } from "../../components/Layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

const GoogleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36003 19.27 5.00003 16.25 5.00003 12C5.00003 7.9 8.20003 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42003 2 2.03003 6.8 2.03003 12C2.03003 17.05 6.16003 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1Z"
      fill="currentColor"
    />
  </svg>
);

const SignIn = ({ providers }: { providers: Record<string, any> }) => {
  return (
    <Layout isDark>
      <NextSeo
        title="Summon AI - Sign In"
        description="Looking for unique, AI generated imagery? Look no further than Summon AI! Our directory is powered by a free and open-source Figma plugin, making it easy to access a limitless supply of professional-grade visuals. Boost your design skills with Summon AI today!"
      />
      <div className="mt-10 flex flex-col items-center px-5 pt-5 text-center text-gray-500">
        <div className="flex max-w-sm flex-col items-center">
          <h1 className="mb-3 text-3xl font-black text-white">
            Join Summon.AI
          </h1>
          <p>
            Get access to better image generation, restoration and upscaling
            features within our Figma plugin.
          </p>
          {Object.values(providers).map((provider) => (
            <div className="mt-8" key={provider.name}>
              <Button
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "/account",
                  })
                }
              >
                <GoogleIcon /> Sign in with {provider.name}
              </Button>
            </div>
          ))}
          <span className="my-8 block">or register a new one now</span>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <Button
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "/account",
                  })
                }
              >
                <GoogleIcon />
                Sign up with {provider.name}
              </Button>
            </div>
          ))}
          <p className="mt-10">
            Don&apos;t know whether you need an account? Check the{" "}
            <a
              href="https://www.figma.com/community/plugin/1172891596048319817"
              className="text-green-500 underline"
              target="_blank"
              rel="noreferrer"
            >
              Figma extension here
            </a>
            .
          </p>
        </div>
        <div className="mt-20 grid w-screen grid-cols-3 md:hidden">
          <div className="relative aspect-square">
            <Image
              src="https://replicate.delivery/pbxt/ETIiSJPZfekB00EqmOIGkjtIMECrG6EbmM1ft12n35EyUDvgA/out-0.png"
              alt="Summon AI"
              fill
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/c2aaa66e-0834-407c-00a3-03ead2a40300/public"
              alt="Summon AI"
              fill
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/9fa83a68-8c04-4e2f-af82-17117b72fa00/public"
              alt="Summon AI"
              fill
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/94062f5e-7432-4585-3cee-290adb2ec400/public"
              alt="Summon AI"
              fill
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/aa544a70-d097-484f-4fa6-a9356d02bc00/public"
              alt="Summon AI"
              fill
            />
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/78095b59-18da-413e-31aa-1f07f69fca00/public"
              alt="Summon AI"
              fill
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
