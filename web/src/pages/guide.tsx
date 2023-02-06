import { GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { Layout } from "../components/Layout";

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
        title="Summon AI - Guide"
        description="Looking for unique, AI generated imagery? Look no further than Summon AI! Our directory is powered by a free and open-source Figma plugin, making it easy to access a limitless supply of professional-grade visuals. Boost your design skills with Summon AI today!"
      />
      <div className="my-10 flex flex-col text-gray-500">
        <div className="mx-auto flex max-w-[60ch] flex-col">
          <h1 className="mb-3 text-3xl font-black text-white">
            Guide - Summon.AI
          </h1>
          <h2 className="mt-1.5 text-lg text-white">
            I. Generate/Variants/Edit
          </h2>
          <h3 className="mt-3 mb-2 text-white">1. Get a DALL-E-2 token</h3>
          <p>
            You can get a DALL-E-2 token by creating an account with OpenAI{" "}
            <a
              href="https://openai.com/dall-e-2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 underline"
            >
              DALL-E 2
            </a>
            .
            <br />
            <br /> If you used ChatGPT in the past you can use the same account.
            <br />
            <br />
            Go to{" "}
            <a
              href="https://platform.openai.com/account/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 underline"
            >
              Account/API Keys
            </a>{" "}
            and create a new secret key.
          </p>
          <h3 className="mt-3 mb-2 text-lg text-white">
            2. Add the token to settings
          </h3>
          <p>
            While using any of the Summon AI tools, go to the settings tab and
            paste the token in the DALL-E-2 field.
            <br />
            <br />
            You can also add the token directly in any of the 3 forms and it
            will be instantly saved in local storage.
          </p>
          <h2 className="mt-6 text-lg text-white">
            II. OpenJourney/Upscale/Restore
          </h2>
          <h3 className="mt-3 mb-2 text-white">1. Create an account</h3>
          <p>
            You can create an account with Google in 2 clicks{" "}
            <Link href="/sign-in" className="text-green-500 underline">
              here
            </Link>
            <br />
            <br />
            You'll be redirected to the account page where you can copy the
            SummonAI token.
            <br />
            <br />
            <span className="text-green-500">P.S.:</span>
            You can level up your generations with the{" "}
            <span className="text-green-500">
              pro plan for only{" "}
              <Link href="/account" className="underline">
                $2.49
              </Link>
            </span>{" "}
            a month (less than a Starbucks cup of coffee).
          </p>
          <h3 className="mt-3 mb-2 text-white">2. Add the token to settings</h3>
          <p>
            While using any of the Summon AI PRO command or the other tools, go
            to the settings tab and paste the token in the SummonAI field.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
