import { trpc } from "../utils/trpc";

import { type NextPage } from "next";
import { NextSeo } from "next-seo";
import { Button } from "../components/buttons/Button";
import Input from "../components/inputs/Input";
import { Layout } from "../components/Layout";
import spacetime from "spacetime";

export const getServersideProps = async () => {
  return {
    props: {},
  };
};

const Account: NextPage = () => {
  const session = trpc.auth.getSession.useQuery();
  const profileQuery = trpc.auth.getProfile.useQuery();

  const total = profileQuery.isLoading
    ? 0
    : profileQuery.data.stats.dall_e_2 +
      profileQuery.data.stats.openjourney +
      profileQuery.data.stats.restore +
      profileQuery.data.stats.upscale;

  return (
    <Layout isDark>
      <NextSeo
        title="Summon AI - Showcase"
        description="Looking for unique, AI generated imagery? Look no further than Summon AI! Our directory is powered by a free and open-source Figma plugin, making it easy to access a limitless supply of professional-grade visuals. Boost your design skills with Summon AI today!"
      />
      {!profileQuery.isLoading && (
        <div className="flex flex-col p-5 mt-10 text-gray-500">
          <div className="flex gap-5">
            <img
              src={session.data?.user?.image ?? ""}
              alt="User avatar"
              className="w-24 rounded-md"
            />
            <div>
              <h1 className="mb-2 text-3xl font-black text-white">
                {session.data?.user?.name}
              </h1>
              <span>
                member since{" "}
                {spacetime(profileQuery.data.created_at).format(
                  "{month-short} {date-ordinal}, {year}"
                )}
              </span>
            </div>
          </div>
          <section className="max-w-xs mt-7">
            <h2 className="mb-5 text-xl font-semibold text-white">Settings</h2>
            <Input
              label="API Token"
              value={profileQuery.data?.token}
              onChange={() => {}}
            />
            <Button className="mt-2">Reset token</Button>
            <span className="mt-2 text-xs">
              Copy this token and paste inside Summon.AI Figma plugin &gt;
              Settings
            </span>
          </section>
          <section className="mt-7">
            <h2 className="mb-5 text-xl font-semibold text-white">Stats</h2>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-white">GEN1</h3>
              <span className="text-xs">
                limited by your own DALL-E-2 token
              </span>
            </div>
            <div className="mt-2 flex max-w-[148] items-center gap-9">
              <h4>DALL-E-2 images:</h4>
              <span className="text-green-500">
                {profileQuery.data.stats.dall_e_2}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <h3 className="font-medium text-white">GEN2</h3>
              <span className="text-xs">{total}/10, reset monthly </span>
            </div>
            <div className="mt-2 flex max-w-[148] items-center gap-9">
              <h4>OpenJourney images:</h4>
              <span className="text-green-500">
                {profileQuery.data.stats.openjourney}
              </span>
            </div>
            <div className="mt-2 flex max-w-[148] items-center gap-9">
              <h4>Restored images:</h4>
              <span className="text-green-500">
                {profileQuery.data.stats.restore}
              </span>
            </div>
            <div className="mt-2 flex max-w-[148] items-center gap-9">
              <h4>Upscaled images:</h4>
              <span className="text-green-500">
                {profileQuery.data.stats.upscale}
              </span>
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
};

export default Account;
